import { i as extractErrorCode, u as toErrorObject } from "./error-coercion-C787aVxk.mjs";
import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { t as killProcessTree } from "./kill-tree-BGQdx374.mjs";
import { i as isPidDefinitelyDead } from "./pid-alive-CXdZEzr_.mjs";
import { n as runtimeProcessEntrypoints } from "./runtime-process-entrypoints-DazJcPEG.mjs";
import { r as resolveRuntimeWorkerUrl, t as resolveRuntimeWorkerArgv } from "./runtime-worker-url-B4o9tqvO.mjs";
import { a as SpawnBrokerError, i as restoreStdinPipe, n as holdPipe, r as restorePipePrefix, t as BrokerChild } from "./child-C7738Y0I.mjs";
import { t as GRACEFUL_CANCEL_TIMEOUT_MS } from "./cancellation-policy-BQ2STJu_.mjs";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";
import { Socket } from "node:net";
import { setTimeout as setTimeout$1 } from "node:timers/promises";
import { deserialize, serialize } from "node:v8";
//#region src/process/spawn-broker/cleanup.ts
function groupGone(pid) {
	try {
		process.kill(-pid, 0);
		return false;
	} catch (error) {
		return extractErrorCode(error) === "ESRCH";
	}
}
/** Preserve a lost broker's tree cleanup across host restart and process exit. */
function terminateLostBrokerChild(pid, detached, ownerExited) {
	const termination = killProcessTree(pid, {
		detached,
		graceMs: GRACEFUL_CANCEL_TIMEOUT_MS
	});
	const graceEndsAt = Date.now() + GRACEFUL_CANCEL_TIMEOUT_MS;
	return {
		force: () => termination?.force(),
		settled: (async () => {
			let deadline = graceEndsAt + 2e3;
			if (ownerExited) {
				await ownerExited;
				deadline = Math.max(deadline, Date.now() + 2e3);
			}
			if (!detached && Date.now() < graceEndsAt) await setTimeout$1(graceEndsAt - Date.now());
			for (;;) {
				if (isPidDefinitelyDead(pid) && (!detached || groupGone(pid))) break;
				if (Date.now() >= deadline) throw new SpawnBrokerError(`Spawn broker child cleanup could not be confirmed for pid=${pid}`);
				await setTimeout$1(50);
			}
		})()
	};
}
/** A broker's private group retains non-detached children before PID publication. */
function terminateBrokerProcessGroup(pgid) {
	let retired = false;
	let signalError;
	let forceTimer;
	const signal = (value) => {
		try {
			process.kill(-pgid, value);
		} catch (error) {
			if (extractErrorCode(error) !== "ESRCH") signalError = error;
		}
	};
	const retire = () => {
		retired = true;
		clearTimeout(forceTimer);
	};
	const force = () => {
		if (retired) return;
		if (groupGone(pgid)) {
			retire();
			return;
		}
		clearTimeout(forceTimer);
		signal("SIGKILL");
	};
	return {
		force,
		settled: (async () => {
			if (groupGone(pgid)) {
				retire();
				return;
			}
			signal("SIGTERM");
			forceTimer = setTimeout(force, GRACEFUL_CANCEL_TIMEOUT_MS);
			const deadline = Date.now() + GRACEFUL_CANCEL_TIMEOUT_MS + 2e3;
			try {
				while (!groupGone(pgid)) {
					if (Date.now() >= deadline) throw new SpawnBrokerError(`Spawn broker group cleanup could not be confirmed for pgid=${pgid}`, { cause: signalError });
					await setTimeout$1(50);
				}
			} finally {
				retire();
			}
		})()
	};
}
//#endregion
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
		if (bytes + size > MAX_PENDING_BYTES || messages >= MAX_PENDING_MESSAGES) return Promise.reject(new SpawnBrokerError("Spawn broker IPC capacity exceeded"));
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
			if (!Number.isSafeInteger(frame.id) || !Number.isSafeInteger(frame.total) || frame.total <= FRAME_BYTES || frame.total > MAX_PENDING_BYTES || !Number.isSafeInteger(frame.offset) || !Buffer.isBuffer(frame.bytes) || frame.bytes.length === 0 || frame.bytes.length > FRAME_BYTES) throw new SpawnBrokerError("Invalid spawn broker IPC frame");
			let assembly = pending.get(frame.id);
			if (!assembly) {
				if (frame.offset !== 0 || pending.size >= MAX_PENDING_MESSAGES || reserved + frame.total > MAX_PENDING_BYTES) throw new SpawnBrokerError("Spawn broker receive capacity exceeded");
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
//#region src/process/spawn-broker/host.ts
const spawnBrokerWorkerUrl = resolveRuntimeWorkerUrl(runtimeProcessEntrypoints.spawnBroker);
const spawnBrokerEntryPath = fileURLToPath(spawnBrokerWorkerUrl);
const MAX_REQUESTS = 256;
const RESTART_DELAYS = [
	100,
	250,
	500,
	1e3,
	2e3
];
function brokerSpawnOptions(options) {
	const stdio = options.stdio ?? "pipe";
	const entries = typeof stdio === "string" ? [
		stdio,
		stdio,
		stdio
	] : [...stdio];
	const normalized = [];
	for (let fd = 0; fd < Math.max(3, entries.length); fd += 1) {
		const entry = entries[fd] ?? (fd < 3 ? "pipe" : "ignore");
		if (entry === "inherit" && fd !== 0) return;
		if (entry !== "pipe" && entry !== "ignore" && entry !== "inherit" && entry !== "ipc") return;
		normalized.push(entry);
	}
	if (options.signal || options.timeout || options.killSignal) throw new Error("Unsupported spawn broker cancellation options");
	return {
		cwd: options.cwd instanceof URL ? fileURLToPath(options.cwd) : options.cwd,
		env: options.env ? { ...options.env } : { ...process.env },
		argv0: options.argv0,
		detached: options.detached,
		shell: options.shell,
		windowsHide: options.windowsHide,
		windowsVerbatimArguments: options.windowsVerbatimArguments,
		serialization: options.serialization,
		uid: options.uid,
		gid: options.gid,
		stdio: normalized
	};
}
var SpawnBrokerHost = class {
	constructor(options = {}) {
		this.options = options;
		this.readiness = createDeferredCore();
		this.available = false;
		this.hasBeenReady = false;
		this.closing = false;
		this.generation = 0;
		this.consecutiveFailures = 0;
		this.sequence = 0;
		this.requests = /* @__PURE__ */ new Map();
		this.cleanups = /* @__PURE__ */ new Set();
		this.cleanupErrors = [];
		this.onParentExit = () => {
			if (this.process?.connected) this.process.disconnect();
			for (const cleanup of this.cleanups) cleanup.force();
		};
		this.readiness.promise.catch(() => {});
		this.start();
		process.once("exit", this.onParentExit);
	}
	get pid() {
		return this.process?.pid;
	}
	ready() {
		return this.closing ? Promise.reject(new SpawnBrokerError("Spawn broker is closing")) : this.readiness.promise;
	}
	spawn(command, args, options) {
		const prepared = brokerSpawnOptions(options);
		if (!prepared) throw new Error("Unsupported spawn broker stdio or process options");
		return this.admit({
			type: "spawn",
			id: ++this.sequence,
			argv: [command, ...args],
			options: prepared
		}).child;
	}
	spawnExeca(argv, options) {
		const id = ++this.sequence;
		const request = this.admit({
			type: "spawn-execa",
			id,
			argv,
			options
		});
		return {
			child: request.child,
			result: request.result.promise,
			cancel: () => {
				this.transmit({
					type: "cancel",
					id
				}).catch((error) => request.child.fail(toErrorObject(error, "Spawn broker cancellation delivery failed")));
			}
		};
	}
	admit(message) {
		const child = new BrokerChild(message.id, message.argv, (value, handle) => this.transmit(value, handle));
		const result = message.type === "spawn-execa" ? createDeferredCore() : void 0;
		if (result) result.promise.catch(() => {});
		const request = {
			child,
			result,
			childClosed: false,
			resultSettled: !result,
			detached: message.options.detached === true || message.type === "spawn-execa" && message.options.killDescendants === true
		};
		const fail = (error) => {
			result?.reject(error);
			child.fail(error);
		};
		if (!this.available || this.closing || this.requests.size >= MAX_REQUESTS) {
			child.markNotStarted();
			queueMicrotask(() => fail(new SpawnBrokerError("Spawn broker is unavailable")));
			return request;
		}
		this.requests.set(message.id, request);
		child.waitForClose().then(() => {
			request.childClosed = true;
			this.retire(message.id, request);
		});
		this.transmit(message).catch((error) => {
			this.requests.delete(message.id);
			fail(new SpawnBrokerError("Spawn broker request delivery failed", { cause: error }));
		});
		return request;
	}
	retire(id, request) {
		if (request.childClosed && request.resultSettled) this.requests.delete(id);
	}
	retainCleanup(cleanup) {
		this.cleanups.add(cleanup);
		cleanup.settled.then(() => this.cleanups.delete(cleanup), (failure) => {
			this.cleanupErrors.push(toErrorObject(failure, "Spawn broker cleanup failed"));
			this.cleanups.delete(cleanup);
		});
	}
	transmit(message, handle) {
		if (!this.available || !this.sendMessage) return Promise.reject(new SpawnBrokerError("Spawn broker is unavailable"));
		return this.sendMessage(message, handle);
	}
	start() {
		if (this.closing) return;
		const generation = this.generation++;
		const child = spawn(process.execPath, resolveRuntimeWorkerArgv(spawnBrokerWorkerUrl), {
			stdio: [
				"inherit",
				"ignore",
				"ignore",
				"ipc"
			],
			detached: true,
			serialization: "advanced"
		});
		this.process = child;
		this.sendMessage = createBrokerSender((message, handle, callback) => child.send(message, handle, { keepOpen: true }, callback));
		const receiver = createBrokerReceiver();
		const brokerExited = createDeferredCore();
		let ended = false;
		const startupTimer = setTimeout(() => {
			fail(/* @__PURE__ */ new Error("readiness deadline exceeded after 15000ms"));
			child.kill("SIGKILL");
		}, 15e3);
		const fail = (cause) => {
			if (ended) return;
			ended = true;
			clearTimeout(startupTimer);
			receiver.clear();
			this.available = false;
			this.sendMessage = void 0;
			const error = new SpawnBrokerError(this.hasBeenReady ? "Spawn broker exited; command outcome is unavailable" : `Spawn broker failed before readiness: ${cause?.message ?? "channel lost"}`, { cause });
			const previousReadiness = this.readiness;
			this.readiness = createDeferredCore();
			this.readiness.promise.catch(() => {});
			previousReadiness.reject(error);
			for (const request of this.requests.values()) {
				if (request.pid && !request.childClosed) {
					const cleanup = terminateLostBrokerChild(request.pid, request.detached, this.closing ? brokerExited.promise : void 0);
					this.retainCleanup(cleanup);
				}
				request.result?.reject(error);
				request.child.fail(error);
			}
			this.requests.clear();
			if (child.pid && process.platform !== "win32") this.retainCleanup(terminateBrokerProcessGroup(child.pid));
			if (this.closing || !this.hasBeenReady) {
				this.readiness.reject(error);
				return;
			}
			const delay = RESTART_DELAYS[this.consecutiveFailures++];
			if (delay === void 0) {
				this.readiness.reject(error);
				return;
			}
			this.restartTimer = setTimeout(() => this.start(), delay);
		};
		child.once("error", fail);
		child.once("exit", (code, signal) => {
			brokerExited.resolve();
			fail(/* @__PURE__ */ new Error(`exited with code=${code ?? "null"} signal=${signal ?? "none"}`));
		});
		child.once("disconnect", () => fail(/* @__PURE__ */ new Error("IPC channel disconnected")));
		child.on("message", (raw, handle) => {
			if (ended || this.closing) {
				if (handle instanceof Socket) handle.destroy();
				return;
			}
			let decoded;
			try {
				decoded = receiver.receive(raw);
			} catch (error) {
				fail(error instanceof Error ? error : new Error(String(error)));
				if (child.connected) child.disconnect();
				child.kill("SIGTERM");
				return;
			}
			if (decoded === void 0) return;
			const message = decoded;
			if (message.type === "ready") {
				clearTimeout(startupTimer);
				this.hasBeenReady = true;
				this.consecutiveFailures = 0;
				this.available = true;
				this.readiness.resolve();
				this.options.onReady?.(message.pid, generation > 0);
				return;
			}
			const request = this.requests.get(message.id);
			if (!request) {
				if (handle instanceof Socket) handle.destroy();
				if (message.type === "pipe") this.transmit({
					type: "pipe-received",
					id: message.id,
					fd: message.fd
				}).catch(fail);
				return;
			}
			if (message.type === "owned") request.pid = message.pid;
			else if (message.type === "pipe") {
				try {
					if (message.closed && message.fd === 0) {
						const stdin = new Socket();
						request.child.attachPipe(message.fd, stdin);
						stdin.destroy();
					} else if (handle instanceof Socket) {
						if (message.fd === 0) restoreStdinPipe(handle);
						else holdPipe(handle);
						request.child.attachPipe(message.fd, handle);
					} else throw new SpawnBrokerError("Spawn broker pipe transfer failed");
				} catch (error) {
					if (handle instanceof Socket) handle.destroy();
					fail(toErrorObject(error, "Spawn broker pipe setup failed"));
					if (child.connected) child.disconnect();
					child.kill("SIGTERM");
					return;
				}
				this.transmit({
					type: "pipe-received",
					id: message.id,
					fd: message.fd
				}).catch(fail);
			} else if (message.type === "pipe-prefix") {
				const pipe = request.child.stdio[message.fd];
				if (pipe instanceof Socket) restorePipePrefix(pipe, message.bytes);
			} else if (message.type === "execa-result") {
				if (request.pid === void 0 && message.result.failed) request.child.markNotStarted();
				request.result?.resolve(message.result);
				request.resultSettled = true;
				this.retire(message.id, request);
			} else {
				if (message.type === "error" && message.resultUnavailable && request.result) {
					request.result.reject(Object.assign(new Error(message.error.message), message.error));
					request.resultSettled = true;
				}
				request.child.receive(message);
				this.retire(message.id, request);
			}
		});
	}
	/** Join cleanup already retained by this host, including recorded failures. */
	async waitForCleanup() {
		await Promise.allSettled([...this.cleanups].map((cleanup) => cleanup.settled));
		if (this.cleanupErrors.length) throw new AggregateError(this.cleanupErrors, "Spawn broker cleanup did not complete");
	}
	close() {
		return this.closePromise ??= this.closeInternal();
	}
	async closeInternal() {
		this.closing = true;
		this.readiness.reject(new SpawnBrokerError("Spawn broker is closing"));
		clearTimeout(this.restartTimer);
		try {
			const child = this.process;
			if (child && child.exitCode === null && child.signalCode === null) {
				const exited = new Promise((resolve) => {
					child.once("exit", () => resolve());
				});
				if (child.connected) child.disconnect();
				const timer = setTimeout(() => child.kill("SIGKILL"), GRACEFUL_CANCEL_TIMEOUT_MS + 2e3);
				try {
					await exited;
				} finally {
					clearTimeout(timer);
				}
			}
			await this.waitForCleanup();
		} finally {
			process.removeListener("exit", this.onParentExit);
		}
	}
};
function createSpawnBrokerHost(options) {
	return new SpawnBrokerHost(options);
}
//#endregion
export { spawnBrokerEntryPath as i, brokerSpawnOptions as n, createSpawnBrokerHost as r, SpawnBrokerHost as t };
