import { u as toErrorObject } from "../error-coercion-CvJK4lmH.mjs";
import { t as createDeferredCore } from "../deferred-D0La5CRk.mjs";
import { c as isRecord } from "../record-coerce-TIsquoVR.mjs";
import { t as SpawnBrokerError } from "../protocol-foRdUdX7.mjs";
import { c as createBrokerSender, i as encodeNativeWorkerFailure, r as decodeNativeWorkerFailure, s as createBrokerReceiver, t as BrokerNativeResourceCloseError } from "../resource-protocol-DwwJYD9n.mjs";
import { t as serveWorkerMemorySamples } from "../worker-memory-RbSetjGQ.mjs";
import { deserialize, serialize } from "node:v8";
import { connect } from "node:net";
import { MessageChannel, MessagePort, SHARE_ENV, Worker, parentPort, setEnvironmentData, workerData } from "node:worker_threads";
import { setImmediate } from "node:timers/promises";
//#region src/process/spawn-broker/resource-socket.ts
/** Byte transport only: socket closure says nothing about a resource's native lifetime. */
function createBrokerResourceSocket(socket, handlers) {
	const receiver = createBrokerReceiver();
	const header = Buffer.alloc(4);
	let headerBytes = 0;
	let body;
	let bodyBytes = 0;
	let stopped = false;
	let failure;
	let pendingWrite;
	const stop = (error) => {
		if (stopped) return;
		stopped = true;
		failure = error;
		receiver.clear();
		body = void 0;
		pendingWrite?.(error ?? new SpawnBrokerError("Spawn broker resource socket closed"));
		socket.destroy();
	};
	const sender = createBrokerSender((message, _handle, callback) => {
		if (stopped || socket.destroyed) {
			callback(failure ?? new SpawnBrokerError("Spawn broker resource socket closed"));
			return;
		}
		const payload = serialize(message);
		if (payload.length > 268435456) {
			callback(new SpawnBrokerError("Spawn broker resource frame exceeds capacity"));
			return;
		}
		const packet = Buffer.allocUnsafe(4 + payload.length);
		packet.writeUInt32BE(payload.length);
		payload.copy(packet, 4);
		const complete = (error) => {
			if (pendingWrite !== complete) return;
			pendingWrite = void 0;
			callback(error);
			if (error) stop(error);
		};
		pendingWrite = complete;
		try {
			socket.write(packet, (error) => complete(error ?? null));
		} catch (error) {
			complete(toErrorObject(error, "Spawn broker resource write failed"));
		}
	});
	socket.on("data", (chunk) => {
		try {
			let offset = 0;
			while (offset < chunk.length) {
				if (stopped) break;
				if (!body) {
					const count = Math.min(4 - headerBytes, chunk.length - offset);
					chunk.copy(header, headerBytes, offset, offset + count);
					headerBytes += count;
					offset += count;
					if (headerBytes !== 4) continue;
					const length = header.readUInt32BE();
					if (length === 0 || length > 268435456) throw new SpawnBrokerError("Invalid spawn broker resource frame length");
					body = Buffer.allocUnsafe(length);
					headerBytes = 0;
				}
				const count = Math.min(body.length - bodyBytes, chunk.length - offset);
				chunk.copy(body, bodyBytes, offset, offset + count);
				bodyBytes += count;
				offset += count;
				if (bodyBytes !== body.length) continue;
				const decoded = receiver.receive(deserialize(body));
				body = void 0;
				bodyBytes = 0;
				if (decoded !== void 0) {
					if (!decoded || typeof decoded !== "object" || !("value" in decoded)) throw new SpawnBrokerError("Invalid spawn broker resource message");
					handlers.message(decoded.value);
				}
			}
		} catch (error) {
			stop(toErrorObject(error, "Spawn broker resource read failed"));
		}
	});
	socket.once("end", () => stop(body || headerBytes ? new SpawnBrokerError("Spawn broker resource socket ended during a frame") : void 0));
	socket.once("error", stop);
	socket.once("close", () => {
		stop();
		handlers.close(failure);
	});
	return {
		async send(value) {
			if (stopped || socket.destroyed) throw failure ?? new SpawnBrokerError("Spawn broker resource socket closed");
			await sender({ value });
		},
		close: () => stop()
	};
}
//#endregion
//#region src/process/spawn-broker/resource-client.ts
/** This attachment moves messages; its socket's lifetime is not native resource custody. */
function attachBrokerNativeResource(attachment, target, observe, fail) {
	const initialized = createDeferredCore();
	initialized.promise.catch(() => {});
	let transport;
	let retryTimer;
	let closeSequence = 0;
	let ready = false;
	let initializedOwner = false;
	let closed = false;
	let failure;
	let closing;
	const lose = (error) => {
		if (closed || failure) return;
		failure = error;
		clearTimeout(retryTimer);
		clearTimeout(startupTimer);
		initialized.reject(error);
		closing?.completion.reject(error);
		closing = void 0;
		target.close();
		transport?.close();
		fail(error);
	};
	const transmit = async (message) => {
		if (failure) throw failure;
		if (!transport || closed) throw new Error("Native resource attachment is closed");
		await transport.send(message);
	};
	const receive = (value) => {
		if (!isRecord(value) || value.id !== attachment.id || typeof value.type !== "string") {
			lose(/* @__PURE__ */ new Error("Invalid native resource response identity"));
			return;
		}
		const response = value;
		if (response.type === "resource-target") {
			target.postMessage(response.value, []);
			return;
		}
		observe(response);
		if (response.type === "resource-ready") {
			ready = true;
			clearTimeout(startupTimer);
		} else if (response.type === "resource-created") {
			initializedOwner = true;
			initialized.resolve();
		} else if (response.type === "resource-closed") {
			closed = true;
			clearTimeout(startupTimer);
			closing?.completion.resolve();
			closing = void 0;
			target.close();
			transport?.close();
		} else if (response.type === "resource-close-error") {
			if (closing?.id === response.requestId) {
				const pending = closing;
				closing = void 0;
				pending.completion.reject(response.resourceError ? new BrokerNativeResourceCloseError(response.error) : toErrorObject(decodeNativeWorkerFailure(response.error), "Native resource close failed"));
			}
		} else if (response.type === "resource-failed") lose(toErrorObject(decodeNativeWorkerFailure(response.error), "Native resource failed"));
	};
	const start = () => {
		if (failure || closed) return;
		const candidate = connect(attachment.endpoint);
		let connected = false;
		let connectionError;
		candidate.once("error", (error) => {
			connectionError = error;
		});
		transport = createBrokerResourceSocket(candidate, {
			message: receive,
			close(error) {
				if (closed || failure) return;
				if (!connected && !ready && attachment.startupDeadline !== void 0 && Date.now() < attachment.startupDeadline) {
					retryTimer = setTimeout(start, 10);
					return;
				}
				lose(error ?? connectionError ?? /* @__PURE__ */ new Error("Native resource attachment lost"));
			}
		});
		candidate.once("connect", () => {
			connected = true;
			transmit({
				type: "resource-attach",
				attachment
			}).catch((error) => lose(toErrorObject(error, "Native resource attachment failed")));
		});
	};
	const startupTimer = attachment.startupDeadline === void 0 ? void 0 : setTimeout(() => {
		if (!ready) lose(/* @__PURE__ */ new Error("Spawn broker readiness deadline exceeded"));
	}, Math.max(0, attachment.startupDeadline - Date.now()));
	start();
	const assertAvailable = () => {
		if (failure) throw failure;
	};
	initialized.promise.then(() => {
		target.on("message", (value) => {
			transmit({
				type: "resource-target",
				id: attachment.id,
				value
			}).catch((error) => lose(toErrorObject(error, "Native resource input delivery failed")));
		});
	}, () => {});
	return {
		ownerMessage(value, sequence) {
			initialized.promise.then(() => transmit({
				type: "resource-owner",
				id: attachment.id,
				sequence,
				value
			})).catch((error) => lose(toErrorObject(error, "Native resource owner delivery failed")));
		},
		async close() {
			if (closed) return;
			assertAvailable();
			if (!initializedOwner) await initialized.promise;
			if (closed) return;
			assertAvailable();
			const pending = closing ?? {
				id: ++closeSequence,
				completion: createDeferredCore()
			};
			if (!closing) {
				closing = pending;
				pending.completion.promise.catch(() => {});
				transmit({
					type: "resource-close",
					id: attachment.id,
					requestId: pending.id
				}).catch((error) => lose(toErrorObject(error, "Native resource close delivery failed")));
			}
			await pending.completion.promise;
		},
		dispose() {
			clearTimeout(retryTimer);
			clearTimeout(startupTimer);
			transport?.close();
		}
	};
}
//#endregion
//#region src/infra/worker-native-lifecycle.worker.ts
if (!isRecord(workerData) || !(workerData.port instanceof MessagePort)) throw new Error("Native worker lifetime owner requires its private port");
const port = workerData.port;
if (parentPort) serveWorkerMemorySamples(parentPort);
const workers = /* @__PURE__ */ new Map();
function send(reply, transferList = []) {
	const message = "error" in reply && !(reply.type === "stop-error" && reply.resourceError) ? {
		...reply,
		error: encodeNativeWorkerFailure(reply.error)
	} : reply;
	port.postMessage(message, transferList);
}
/** Values have already crossed a structured-clone boundary; forward transferred ownership. */
function transfers(value) {
	const transferred = /* @__PURE__ */ new Set();
	const visited = /* @__PURE__ */ new Set();
	const visit = (current) => {
		if (typeof current !== "object" || current === null || visited.has(current)) return;
		visited.add(current);
		if (current instanceof MessagePort || current instanceof ArrayBuffer) transferred.add(current);
		else if (ArrayBuffer.isView(current)) visit(current.buffer);
		else if (current instanceof Map) for (const [key, entry] of current) {
			visit(key);
			visit(entry);
		}
		else if (current instanceof Set) for (const entry of current) visit(entry);
		else if (!(current instanceof SharedArrayBuffer)) {
			for (const descriptor of Object.values(Object.getOwnPropertyDescriptors(current))) if ("value" in descriptor) visit(descriptor.value);
		}
	};
	visit(value);
	return [...transferred];
}
function stop(id, lifetime) {
	if (lifetime.nativeJoined) {
		finishJoined(id, lifetime);
		return;
	}
	if (lifetime.joined || lifetime.termination) return;
	try {
		lifetime.termination = lifetime.worker.terminate();
		lifetime.termination.catch((error) => {
			lifetime.termination = void 0;
			send({
				type: "stop-error",
				id,
				error
			});
		});
	} catch (error) {
		send({
			type: "stop-error",
			id,
			error
		});
	}
}
function finishJoined(id, lifetime) {
	const nativeJoined = lifetime.nativeJoined;
	if (!nativeJoined || lifetime.joined || lifetime.closing) return;
	lifetime.closing = (async () => {
		const resource = lifetime.resource;
		if (resource) {
			resource.port.close();
			await resource.owner.close();
		}
		lifetime.joined = true;
		send({
			type: "stopped",
			id,
			code: nativeJoined.code
		});
	})();
	lifetime.closing.then(() => {
		lifetime.closing = void 0;
	}, (error) => {
		lifetime.closing = void 0;
		if (error instanceof BrokerNativeResourceCloseError) send({
			type: "stop-error",
			id,
			error: error.payload,
			resourceError: true
		});
		else send({
			type: "stop-error",
			id,
			error
		});
	});
}
function create(request) {
	const id = request.id;
	const { environment, shareEnvironment, ...options } = request.options;
	const descriptor = request.resource;
	let resourcePorts;
	let childData = options.workerData;
	let workerTransfers = request.transferList;
	let worker;
	try {
		if (descriptor) {
			if (options.workerData !== void 0 && !isRecord(options.workerData) || isRecord(options.workerData) && descriptor.workerDataKey in options.workerData) throw new Error("Native resource requires an unused object workerData property");
			resourcePorts = new MessageChannel();
			childData = {
				...options.workerData,
				[descriptor.workerDataKey]: resourcePorts.port2
			};
			workerTransfers = [...request.transferList, resourcePorts.port2];
		}
		for (const [key, value] of request.environmentData) setEnvironmentData(key, value);
		worker = new Worker(request.filename.kind === "url" ? new URL(request.filename.value) : request.filename.value, {
			...options,
			env: shareEnvironment ? SHARE_ENV : environment,
			workerData: childData,
			transferList: workerTransfers
		});
	} catch (error) {
		resourcePorts?.port1.close();
		resourcePorts?.port2.close();
		send({
			type: "create-error",
			id,
			error
		});
		return;
	}
	const lifetime = {
		worker,
		joined: false
	};
	workers.set(id, lifetime);
	if (resourcePorts && descriptor) {
		const resourcePort = resourcePorts.port1;
		lifetime.resource = {
			port: resourcePort,
			owner: attachBrokerNativeResource(descriptor.attachment, resourcePort, (response) => send({
				type: "resource-message",
				id,
				response
			}), (error) => {
				send({
					type: "error",
					id,
					error
				});
				stop(id, lifetime);
			})
		};
	}
	worker.on("message", (value) => {
		send({
			type: "message",
			id,
			value
		}, transfers(value));
	});
	worker.on("messageerror", (error) => {
		send({
			type: "messageerror",
			id,
			error
		});
	});
	worker.on("error", (error) => {
		send({
			type: "error",
			id,
			error
		});
		stop(id, lifetime);
	});
	worker.once("exit", (code) => {
		(async () => {
			await setImmediate();
			lifetime.nativeJoined = { code };
			send({
				type: "execution-exit",
				id,
				code
			});
			finishJoined(id, lifetime);
		})().catch((error) => send({
			type: "stop-error",
			id,
			error
		}));
	});
	send({
		type: "created",
		id,
		threadId: worker.threadId
	});
}
port.on("message", (message) => {
	if (message.type === "create") {
		create(message);
		return;
	}
	const lifetime = workers.get(message.id);
	if (!lifetime) return;
	if (message.type === "release") {
		if (lifetime.joined) {
			lifetime.resource?.owner.dispose();
			workers.delete(message.id);
		}
		return;
	}
	if (message.type === "stop") {
		stop(message.id, lifetime);
		return;
	}
	if (message.type === "resource-owner") {
		lifetime.resource?.owner.ownerMessage(message.value, message.sequence);
		return;
	}
	if (message.type === "ref") {
		if (message.referenced) lifetime.worker.ref();
		else lifetime.worker.unref();
		return;
	}
	if (message.type === "post") {
		try {
			lifetime.worker.postMessage(message.value, message.transferList);
		} catch (error) {
			send({
				type: "messageerror",
				id: message.id,
				error
			});
		}
		return;
	}
	if (message.type === "cpu") {
		const { id, requestId } = message;
		Promise.resolve().then(() => lifetime.worker.cpuUsage(message.previous)).then((value) => send({
			type: "cpu",
			id,
			requestId,
			value
		}), (error) => send({
			type: "request-error",
			id,
			requestId,
			error
		}));
	} else if (message.type === "heap") {
		const { id, requestId } = message;
		Promise.resolve().then(() => lifetime.worker.getHeapStatistics()).then((value) => send({
			type: "heap",
			id,
			requestId,
			value
		}), (error) => send({
			type: "request-error",
			id,
			requestId,
			error
		}));
	}
});
//#endregion
export {};
