import { u as toErrorObject } from "./error-coercion-CvJK4lmH.mjs";
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
	const write = (message, handle) => new Promise((resolve, reject) => {
		try {
			send(message, handle, (error) => error ? reject(error) : resolve());
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
	const sender = (message, handle) => {
		const payload = serialize(message);
		const size = payload.byteLength;
		if (size > FRAME_BYTES && handle) return Promise.reject(new SpawnBrokerError("Spawn broker handle metadata exceeds one IPC frame"));
		const id = ++sequence;
		const operation = async () => {
			if (size <= FRAME_BYTES) {
				await write(message, handle);
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
				await write(frame);
			}
		};
		return enqueue(size, operation);
	};
	return Object.assign(sender, { reserve(run) {
		return enqueue(FRAME_BYTES, async () => {
			let active = true;
			let publication;
			const publish = (message) => {
				if (!active || publication) return Promise.reject(new SpawnBrokerError("Spawn broker publication reservation is closed"));
				publication = (async () => {
					if (serialize(message).byteLength > FRAME_BYTES) throw new SpawnBrokerError("Spawn broker reserved publication exceeds one IPC frame");
					await write(message);
				})();
				publication.catch(() => {});
				return publication;
			};
			try {
				return await run(publish);
			} finally {
				active = false;
				await publication;
			}
		});
	} });
}
/** Only the version-matched private peer can supply frames on this channel. */
function createBrokerReceiver() {
	const pending = /* @__PURE__ */ new Map();
	let reserved = 0;
	return {
		receive(message) {
			if (!message || typeof message !== "object" || !("kind" in message) || message.kind !== FRAME_KIND) return message;
			const frame = message;
			if (!Number.isSafeInteger(frame.id) || !Number.isSafeInteger(frame.total) || frame.total <= FRAME_BYTES || frame.total > 268435456 || !Number.isSafeInteger(frame.offset) || !Buffer.isBuffer(frame.bytes) || frame.bytes.length === 0 || frame.bytes.length > FRAME_BYTES) throw new SpawnBrokerError("Invalid spawn broker IPC frame");
			let assembly = pending.get(frame.id);
			if (!assembly) {
				if (frame.offset !== 0 || pending.size >= 1024 || reserved + frame.total > 268435456) throw new SpawnBrokerError("Spawn broker receive capacity exceeded");
				assembly = {
					total: frame.total,
					received: 0,
					chunks: []
				};
				pending.set(frame.id, assembly);
				reserved += frame.total;
			}
			if (assembly.total !== frame.total || assembly.received !== frame.offset || assembly.received + frame.bytes.length > assembly.total) throw new SpawnBrokerError("Out-of-order spawn broker IPC frame");
			assembly.chunks.push(frame.bytes);
			assembly.received += frame.bytes.length;
			if (assembly.received < assembly.total) return;
			pending.delete(frame.id);
			reserved -= assembly.total;
			return deserialize(Buffer.concat(assembly.chunks, assembly.total));
		},
		clear() {
			pending.clear();
			reserved = 0;
		}
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
			constructorName: current instanceof AggregateError ? "AggregateError" : [...errorConstructors].find(([, Constructor]) => current instanceof Constructor)?.[0] ?? "Error",
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
		const error = current.constructorName === "AggregateError" ? new AggregateError([], current.message) : new Constructor(current.message);
		seen.set(current, error);
		error.name = current.name;
		error.stack = current.stack;
		for (const key of [
			"code",
			"errcode",
			"errno"
		]) if (current[key] !== void 0) Object.defineProperty(error, key, {
			value: current[key],
			writable: true,
			configurable: true,
			enumerable: true
		});
		if (current.cause) Object.defineProperty(error, "cause", {
			value: decode(current.cause),
			writable: true,
			configurable: true
		});
		if (current.errors) Object.defineProperty(error, "errors", {
			value: current.errors.map(decode),
			writable: true,
			configurable: true
		});
		return error;
	};
	return decode(value);
}
//#endregion
//#region src/process/spawn-broker/resource-protocol.ts
const SPAWN_BROKER_STARTUP_TIMEOUT_MS = 15e3;
/** The domain decoder, not a transport adapter, restores this original cleanup payload. */
var BrokerNativeResourceCloseError = class extends Error {
	constructor(payload) {
		super("Native resource cleanup failed");
		this.payload = payload;
		this.name = "BrokerNativeResourceCloseError";
	}
};
//#endregion
export { MAX_PENDING_BYTES as a, createBrokerSender as c, encodeNativeWorkerFailure as i, SPAWN_BROKER_STARTUP_TIMEOUT_MS as n, MAX_PENDING_MESSAGES as o, decodeNativeWorkerFailure as r, createBrokerReceiver as s, BrokerNativeResourceCloseError as t };
