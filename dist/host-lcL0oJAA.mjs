import { a as extractErrorCode, d as toErrorObject } from "./error-coercion-BwMr25F8.mjs";
import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { t as killProcessTree } from "./kill-tree-D8IW3UNJ.mjs";
import { u as redactToolPayloadText } from "./redact-BcXJu5HP.mjs";
import { i as resolveRuntimeWorkerUrl, n as resolveRuntimeWorkerArgv } from "./runtime-worker-url-CvMrvFI1.mjs";
import { a as isPidDefinitelyDead, n as getProcessInstanceStartTime } from "./pid-alive-dd7OR8F6.mjs";
import { n as runtimeProcessEntrypoints } from "./runtime-process-entrypoints-BMmG9cQl.mjs";
import { t as formatChildRuntimeSpawnWarning } from "./child-runtime-viability-X4GxYG5L.mjs";
import { n as truncateUtf8Suffix } from "./utf8-truncate-_hf7tp13.mjs";
import { t as SpawnBrokerError } from "./protocol-foRdUdX7.mjs";
import { r as restoreStdinPipe, t as holdPipe } from "./pipe-6isWb_IH.mjs";
import { t as BrokerChild } from "./child-DRcH2L5b.mjs";
import "./service-child-group-ownership-D1TLR2xv.mjs";
import { c as createBrokerReceiver, i as decodeNativeWorkerFailure, l as createBrokerSender, n as SPAWN_BROKER_STARTUP_TIMEOUT_MS, r as spawnBrokerStartupNowMs, t as BrokerNativeResourceCloseError } from "./resource-protocol-Bh2jG53d.mjs";
import { chmodSync, mkdtempSync, rmSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { randomBytes } from "node:crypto";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { AsyncLocalStorage } from "node:async_hooks";
import { spawn } from "node:child_process";
import { Socket } from "node:net";
import { setTimeout as setTimeout$1 } from "node:timers/promises";
import { deserialize, serialize } from "node:v8";
//#region src/process/spawn-broker/child-completion.ts
/** Observe immediately after spawn, before this owner can disconnect or transfer pipes. */
function waitForBrokerChildCompletion(child) {
	return new Promise((resolve) => {
		let exited = child.exitCode != null || child.signalCode != null;
		let ipcClosed = !child.connected;
		let openPipes = 0;
		const finish = () => {
			if (!exited || !ipcClosed || openPipes !== 0) return;
			child.removeListener("exit", onExit);
			child.removeListener("error", onError);
			child.removeListener("disconnect", onDisconnect);
			resolve();
		};
		const onExit = () => {
			exited = true;
			finish();
		};
		const onError = () => {
			if (child.pid === void 0) {
				exited = true;
				ipcClosed = true;
				finish();
			}
		};
		const onDisconnect = () => {
			ipcClosed = true;
			finish();
		};
		child.once("exit", onExit);
		child.on("error", onError);
		child.once("disconnect", onDisconnect);
		for (const stream of child.stdio ?? []) {
			if (!stream || stream.closed) continue;
			openPipes++;
			stream.once("close", () => {
				openPipes--;
				finish();
			});
		}
		finish();
	});
}
//#endregion
//#region src/process/supervisor/cancellation-policy.ts
const GRACEFUL_CANCEL_TIMEOUT_MS = 5e3;
//#endregion
//#region src/process/spawn-broker/cleanup.ts
function groupGone(pid) {
	try {
		process.kill(-pid, 0);
		return false;
	} catch (error) {
		return extractErrorCode(error) === "ESRCH";
	}
}
/** Once the original group is absent or its leader identity changes, never signal its number again. */
function isBrokerChildGroupAlive(identity) {
	if (groupGone(identity.pid)) return false;
	const current = getProcessInstanceStartTime(identity.pid);
	if (identity.isLeaderAlive) {
		if (identity.isLeaderAlive()) return identity.startedAt === null || current === null || current === identity.startedAt;
		if (!isPidDefinitelyDead(identity.pid)) return false;
		return identity.startedAt === null || current === null || current === identity.startedAt;
	}
	if (identity.startedAt === null || current === null && !isPidDefinitelyDead(identity.pid)) throw new SpawnBrokerError(`Spawn broker group leader identity is unavailable for pid=${identity.pid}`);
	return current === null || current === identity.startedAt;
}
function terminateRetainedBrokerChildGroup(identity) {
	let retired = false;
	let forced = false;
	const signal = (value) => {
		if (retired) return;
		if (!isBrokerChildGroupAlive(identity)) {
			retired = true;
			return;
		}
		try {
			process.kill(-identity.pid, value);
		} catch (error) {
			if (extractErrorCode(error) !== "ESRCH") throw error;
			retired = true;
		}
	};
	const force = () => {
		if (retired || forced) return;
		forced = true;
		signal("SIGKILL");
	};
	return {
		force,
		settled: (async () => {
			const graceEndsAt = performance.now() + GRACEFUL_CANCEL_TIMEOUT_MS;
			const deadline = graceEndsAt + 2e3;
			try {
				signal("SIGTERM");
				for (;;) {
					if (retired || !isBrokerChildGroupAlive(identity)) break;
					if (performance.now() >= graceEndsAt) force();
					if (performance.now() >= deadline) throw new SpawnBrokerError(`Spawn broker child cleanup could not be confirmed for pid=${identity.pid}`);
					await setTimeout$1(50);
				}
			} finally {
				retired = true;
			}
		})()
	};
}
/** Preserve a lost broker's tree cleanup across host restart and process exit. */
function terminateLostBrokerChild(pid, detached, groupIdentity) {
	if (detached && groupIdentity) {
		if (groupIdentity.pid !== pid) throw new SpawnBrokerError("Spawn broker cleanup identity changed");
		return terminateRetainedBrokerChildGroup(groupIdentity);
	}
	const termination = killProcessTree(pid, {
		detached,
		graceMs: GRACEFUL_CANCEL_TIMEOUT_MS
	});
	const deadline = performance.now() + GRACEFUL_CANCEL_TIMEOUT_MS + 2e3;
	return {
		force: () => termination?.force(),
		settled: (async () => {
			for (;;) {
				if (isPidDefinitelyDead(pid) && (!detached || groupGone(pid)) && (termination?.exited() ?? true)) break;
				if (performance.now() >= deadline) throw new SpawnBrokerError(`Spawn broker child cleanup could not be confirmed for pid=${pid}`);
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
			const deadline = performance.now() + GRACEFUL_CANCEL_TIMEOUT_MS + 2e3;
			try {
				while (!groupGone(pgid)) {
					if (performance.now() >= deadline) throw new SpawnBrokerError(`Spawn broker group cleanup could not be confirmed for pgid=${pgid}`, { cause: signalError });
					await setTimeout$1(50);
				}
			} finally {
				retire();
			}
		})()
	};
}
//#endregion
//#region src/process/spawn-broker/file-reads.ts
/** Request state only; the existing broker owns process startup, failure, and shutdown. */
var BrokerFileReads = class {
	constructor(host) {
		this.host = host;
		this.pending = /* @__PURE__ */ new Map();
		this.sequence = 0;
	}
	get size() {
		return this.pending.size;
	}
	async read(filePath, signal) {
		signal?.throwIfAborted();
		await this.host.ready();
		signal?.throwIfAborted();
		if (!this.host.canAdmit()) throw new SpawnBrokerError("Spawn broker cannot admit a raw file read");
		const id = ++this.sequence;
		const result = createDeferredCore();
		this.pending.set(id, {
			chunks: [],
			result
		});
		const abort = () => {
			result.reject(signal?.reason);
			this.host.send({
				type: "cancel-read-file",
				id
			}).catch(() => {});
		};
		signal?.addEventListener("abort", abort, { once: true });
		this.host.send({
			type: "read-file",
			id,
			filePath
		}).catch(result.reject);
		try {
			return await result.promise;
		} finally {
			signal?.removeEventListener("abort", abort);
			this.pending.delete(id);
		}
	}
	receive(reply) {
		if (reply.type !== "file-read-chunk" && reply.type !== "file-read-result") return false;
		const read = this.pending.get(reply.id);
		if (read) {
			if (reply.type === "file-read-chunk") read.chunks.push(reply.bytes);
			else if (reply.error) read.result.reject(Object.assign(reply.error, { code: reply.code }));
			else read.result.resolve(Buffer.concat(read.chunks));
		}
		return true;
	}
	fail(error) {
		for (const read of this.pending.values()) read.result.reject(error);
		this.pending.clear();
	}
};
//#endregion
//#region src/process/spawn-broker/resource-host.ts
/** Captured claims are part of SpawnBrokerHost; transport loss never retires their custody. */
var BrokerResourceClaims = class {
	constructor(host) {
		this.host = host;
		this.claims = /* @__PURE__ */ new Map();
		this.bufferedBytes = 0;
		this.bufferedMessages = 0;
		this.closeSequence = 0;
		this.sealed = false;
	}
	get size() {
		return this.claims.size;
	}
	get hasOpenClaims() {
		return [...this.claims.values()].some((claim) => !claim.closed);
	}
	capture(attachment, callbacks) {
		if (this.failure || this.sealed) throw this.failure ?? new SpawnBrokerError("Native resource source is sealed");
		const serializedAttachment = serialize(attachment);
		if (serializedAttachment.length > 268435456) throw new SpawnBrokerError("Native resource input exceeds IPC capacity");
		const captured = deserialize(serializedAttachment);
		const claim = {
			attachment: captured,
			callbacks,
			inContext: AsyncLocalStorage.snapshot(),
			attached: createDeferredCore(),
			ready: false,
			created: false,
			closed: false,
			lastSequence: 0,
			ownerSequence: 0,
			ownerMessages: /* @__PURE__ */ new Map()
		};
		claim.attached.promise.catch(() => {});
		this.claims.set(captured.id, claim);
		this.host.refreshReference();
		const active = () => {
			if (this.claims.get(captured.id) !== claim) throw new SpawnBrokerError("Native resource claim is released");
			if (claim.failure) throw claim.failure;
		};
		return {
			attachment: captured,
			receive: (response) => {
				if (response.id !== captured.id) throw new SpawnBrokerError("Native resource response belongs to another claim");
				this.receive(response);
			},
			ownerMessage: (value) => {
				active();
				if (claim.closed) throw new SpawnBrokerError("Native resource is closed");
				const sequence = claim.ownerSequence + 1;
				const serialized = serialize({
					type: "resource-owner",
					id: captured.id,
					sequence,
					value
				});
				if (this.bufferedBytes + serialized.length > 268435456 || this.bufferedMessages >= 1024) throw new SpawnBrokerError("Native resource owner delivery capacity exceeded");
				claim.ownerSequence = sequence;
				const completion = createDeferredCore();
				completion.promise.catch(() => {});
				const request = deserialize(serialized);
				claim.ownerMessages.set(sequence, {
					request,
					size: serialized.length,
					completion
				});
				this.bufferedBytes += serialized.length;
				this.bufferedMessages++;
				(async () => {
					await claim.attached.promise;
					active();
					const pending = claim.ownerMessages.get(sequence);
					if (!claim.closed && pending) await this.host.transmit(pending.request);
				})().catch((cause) => {
					const error = toErrorObject(cause, "Native resource owner delivery failed");
					completion.reject(error);
					if (this.claims.get(captured.id) === claim && !claim.closed && !claim.failure) claim.inContext(() => claim.callbacks.failed(error));
				});
				return {
					sequence,
					result: completion.promise
				};
			},
			close: () => {
				if (claim.closed) return Promise.resolve();
				try {
					active();
				} catch (error) {
					return Promise.reject(toErrorObject(error, "Native resource is unavailable"));
				}
				if (claim.pending) return claim.pending.completion.promise;
				const requestId = --this.closeSequence;
				const completion = createDeferredCore();
				completion.promise.catch(() => {});
				claim.pending = {
					requestId,
					completion
				};
				(async () => {
					await claim.attached.promise;
					active();
					if (!claim.closed && claim.pending?.requestId === requestId) await this.host.transmit({
						type: "resource-close",
						id: captured.id,
						requestId
					});
				})().catch((error) => {
					if (claim.pending?.requestId === requestId) {
						claim.pending = void 0;
						completion.reject(toErrorObject(error, "Native resource close delivery failed"));
					}
				});
				return completion.promise;
			},
			release: () => {
				if (this.claims.get(captured.id) !== claim) return;
				if (!claim.closed) throw new SpawnBrokerError("Native resource must close before release");
				this.host.transmit({
					type: "resource-release",
					id: captured.id
				}).catch(() => {});
				this.remove(claim);
			},
			abandonUnattached: () => {
				if (this.claims.get(captured.id) !== claim) return;
				if (claim.ready || claim.created) throw new SpawnBrokerError("Attached native resource cannot be abandoned");
				const error = new SpawnBrokerError("Native resource was never dispatched");
				claim.attached.reject(error);
				claim.pending?.completion.reject(error);
				this.remove(claim, error);
			}
		};
	}
	receive(response) {
		const claim = this.claims.get(response.id);
		if (!claim || claim.failure && response.type !== "resource-closed") return;
		if (response.type === "resource-ready") {
			this.host.markReady(response.pid, response.generation);
			if (claim.ready) return;
			claim.ready = true;
			claim.attached.resolve();
		} else if (response.type === "resource-created") {
			if (claim.created) return;
			claim.created = true;
		} else if (response.type === "resource-owner-received" || response.type === "resource-owner-rejected") {
			const pending = claim.ownerMessages.get(response.sequence);
			if (pending) {
				claim.ownerMessages.delete(response.sequence);
				this.bufferedBytes -= pending.size;
				this.bufferedMessages--;
				if (response.type === "resource-owner-rejected") {
					const error = toErrorObject(decodeNativeWorkerFailure(response.error), "Native resource owner callback failed");
					pending.completion.reject(error);
					claim.inContext(() => claim.callbacks.failed(error));
				} else pending.completion.resolve();
			}
			return;
		} else if (response.type === "resource-owner") {
			if (response.sequence <= claim.lastSequence) return;
			claim.lastSequence = response.sequence;
			claim.inContext(() => claim.callbacks.message(response));
			return;
		} else if (response.type === "resource-closed") {
			if (claim.closed) return;
			claim.closed = true;
			this.clearOwnerMessages(claim, new SpawnBrokerError("Native resource closed before owner delivery was acknowledged"));
			claim.pending?.completion.resolve();
			claim.pending = void 0;
			this.host.refreshReference();
		} else if (response.type === "resource-close-error") {
			if (claim.pending?.requestId === response.requestId) {
				const pending = claim.pending;
				claim.pending = void 0;
				pending.completion.reject(response.resourceError ? new BrokerNativeResourceCloseError(response.error) : toErrorObject(decodeNativeWorkerFailure(response.error), "Native resource cleanup failed"));
			}
		} else if (response.type === "resource-failed") {
			const error = toErrorObject(decodeNativeWorkerFailure(response.error), "Native resource failed");
			claim.pending?.completion.reject(error);
			claim.pending = void 0;
			for (const pending of claim.ownerMessages.values()) pending.completion.reject(error);
			claim.inContext(() => claim.callbacks.failed(error));
			return;
		}
		claim.inContext(() => claim.callbacks.message(response));
	}
	seal() {
		if (this.sealPromise) return this.sealPromise;
		this.sealed = true;
		this.sealPromise = this.host.transmit({ type: "resource-seal" }).then(() => {
			for (const claim of this.claims.values()) claim.attached.resolve();
		});
		return this.sealPromise;
	}
	fail(error) {
		this.failure ??= error;
		const failed = [...this.claims.values()].filter((claim) => this.rejectClaim(claim, error));
		const callbackErrors = [];
		for (const claim of failed) try {
			claim.inContext(() => claim.callbacks.failed(error));
		} catch (callbackError) {
			callbackErrors.push(callbackError);
		}
		if (callbackErrors.length) throw new AggregateError(callbackErrors, "Native resource failure callback failed");
	}
	rejectClaim(claim, error) {
		if (claim.failure || claim.closed) return false;
		claim.failure = error;
		claim.attached.reject(error);
		claim.pending?.completion.reject(error);
		for (const pending of claim.ownerMessages.values()) pending.completion.reject(error);
		claim.pending = void 0;
		return true;
	}
	clearOwnerMessages(claim, error) {
		for (const pending of claim.ownerMessages.values()) {
			this.bufferedBytes -= pending.size;
			this.bufferedMessages--;
			pending.completion.reject(error);
		}
		claim.ownerMessages.clear();
	}
	remove(claim, error) {
		this.clearOwnerMessages(claim, error ?? new SpawnBrokerError("Native resource released before owner delivery was acknowledged"));
		this.claims.delete(claim.attachment.id);
		this.host.refreshReference();
	}
};
const UNIX_SOCKET_PATH_BYTES = 103;
function createNativeResourceDirectory() {
	const directory = mkdtempSync(join(tmpdir(), "oc-br-"));
	if (process.platform === "win32" || Buffer.byteLength(join(directory, "resource.sock")) <= UNIX_SOCKET_PATH_BYTES) return directory;
	rmSync(directory, {
		recursive: true,
		force: true
	});
	return mkdtempSync("/tmp/oc-br-");
}
function createNativeResourceAuthority() {
	const directory = createNativeResourceDirectory();
	chmodSync(directory, 448);
	const secret = randomBytes(32).toString("hex");
	return {
		directory,
		secret,
		endpoint: process.platform === "win32" ? `\\\\.\\pipe\\oc-br-${secret}` : join(directory, "resource.sock")
	};
}
//#endregion
//#region src/process/spawn-broker/host.ts
const MAX_REQUESTS = 256;
const RESTART_DELAYS = [
	100,
	250,
	500,
	1e3,
	2e3
];
const MAX_BOOTSTRAP_BYTES = 1024;
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
		this.runInContext = AsyncLocalStorage.snapshot();
		this.readiness = createDeferredCore();
		this.available = false;
		this.hasBeenReady = false;
		this.closing = false;
		this.generation = 0;
		this.consecutiveFailures = 0;
		this.sequence = 0;
		this.requests = /* @__PURE__ */ new Map();
		this.fileReads = new BrokerFileReads({
			ready: () => this.ready(),
			send: (message) => this.transmit(message),
			canAdmit: () => !this.resourceClaims && !this.closing && this.requests.size + this.fileReads.size < MAX_REQUESTS
		});
		this.cleanups = /* @__PURE__ */ new Set();
		this.cleanupErrors = [];
		this.startupDeadline = 0;
		this.onParentExit = () => {
			if (this.process?.connected) this.process.disconnect();
			for (const cleanup of this.cleanups) cleanup.force();
		};
		this.workerUrl = options.workerUrl ?? resolveRuntimeWorkerUrl(runtimeProcessEntrypoints.spawnBroker);
		this.entryPath = fileURLToPath(this.workerUrl);
		if (options.nativeResources) {
			const { directory, ...authority } = createNativeResourceAuthority();
			this.resourceDirectory = directory;
			this.resourceAuthority = authority;
			this.resourceClaims = new BrokerResourceClaims({
				transmit: async (request) => {
					if (!this.available) await this.ready();
					await this.transmit(request);
				},
				markReady: (pid, generation) => {
					if (!this.markNativeReady) throw new SpawnBrokerError("Native resource broker unavailable");
					this.markNativeReady(pid, generation);
				},
				refreshReference: () => this.refreshNativeReference()
			});
		}
		this.readiness.promise.catch(() => {});
		try {
			this.start();
		} catch (error) {
			if (this.resourceDirectory) rmSync(this.resourceDirectory, {
				recursive: true,
				force: true
			});
			throw error;
		}
		process.once("exit", this.onParentExit);
	}
	get pid() {
		return this.process?.pid;
	}
	ready() {
		return this.closing ? Promise.reject(new SpawnBrokerError("Spawn broker is closing")) : this.readiness.promise;
	}
	readFile(filePath, signal) {
		return this.fileReads.read(filePath, signal);
	}
	captureNativeResource(input, callbacks) {
		if (!this.resourceClaims || !this.resourceAuthority || this.closing || this.requests.size + this.resourceClaims.size >= MAX_REQUESTS) throw new SpawnBrokerError("Native resource broker is unavailable or at capacity");
		return this.resourceClaims.capture({
			...input,
			...this.resourceAuthority,
			generation: this.generation - 1,
			startupDeadline: this.available ? void 0 : this.startupDeadline,
			id: ++this.sequence
		}, callbacks);
	}
	sealNativeResources() {
		if (this.resourceClaims && !this.available) return Promise.reject(new SpawnBrokerError("Native resource broker is not ready for cleanup"));
		return this.resourceClaims?.seal() ?? Promise.reject(new SpawnBrokerError("Native resources are disabled"));
	}
	serviceNativeResources() {
		this.serviceStartup?.();
	}
	refreshNativeReference() {
		if (!this.resourceClaims || !this.process) return;
		const stderr = this.process.stderr instanceof Socket ? this.process.stderr : void 0;
		if (this.closing || this.resourceClaims.hasOpenClaims || this.requests.size > 0) {
			this.process.ref();
			stderr?.ref();
			this.process.channel?.ref?.();
		} else {
			this.process.unref();
			stderr?.unref();
			this.process.channel?.unref?.();
		}
	}
	spawn(command, args, options, initiateSpawn) {
		const prepared = brokerSpawnOptions(options);
		if (!prepared) throw new Error("Unsupported spawn broker stdio or process options");
		return this.admit({
			type: initiateSpawn ? "prepare-spawn" : "spawn",
			id: ++this.sequence,
			argv: [command, ...args],
			options: prepared
		}, initiateSpawn).child;
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
	admit(message, initiateSpawn) {
		const child = new BrokerChild(message.id, message.argv, (value, handle, initiate) => this.transmit(value, handle, initiate));
		const result = message.type === "spawn-execa" ? createDeferredCore() : void 0;
		if (result) result.promise.catch(() => {});
		const request = {
			child,
			initiateSpawn,
			result,
			childClosed: false,
			resultSettled: !result,
			detached: message.options.detached === true || message.type === "spawn-execa" && message.options.killDescendants === true
		};
		const fail = (error) => {
			result?.reject(error);
			child.fail(error);
		};
		if (!this.available || this.closing || this.requests.size + this.fileReads.size + (this.resourceClaims?.size ?? 0) >= MAX_REQUESTS) {
			child.markNotStarted();
			queueMicrotask(() => fail(new SpawnBrokerError("Spawn broker is unavailable")));
			return request;
		}
		this.requests.set(message.id, request);
		this.refreshNativeReference();
		child.waitForClose().then(() => {
			request.childClosed = true;
			this.retire(message.id, request);
		});
		this.transmit(message).catch((error) => {
			if (!request.nativeInitiated) {
				if (message.type === "prepare-spawn") child.markNotStarted();
				this.requests.delete(message.id);
				this.refreshNativeReference();
			}
			fail(new SpawnBrokerError("Spawn broker request delivery failed", { cause: error }));
		});
		return request;
	}
	retire(id, request) {
		if (request.childClosed && request.resultSettled && !request.nativeInitiated) {
			this.requests.delete(id);
			this.refreshNativeReference();
		}
	}
	retainCleanup(cleanup) {
		this.cleanups.add(cleanup);
		cleanup.settled.then(() => this.cleanups.delete(cleanup), (failure) => {
			this.cleanupErrors.push(toErrorObject(failure, "Spawn broker cleanup failed"));
			this.cleanups.delete(cleanup);
		});
	}
	transmit(message, handle, initiateSpawn) {
		if (!this.available || !this.sendMessage) return Promise.reject(new SpawnBrokerError("Spawn broker is unavailable"));
		return this.sendMessage(message, handle, initiateSpawn);
	}
	start() {
		if (this.closing) return;
		const generation = this.generation++;
		const bootstrap = {
			type: "bootstrap",
			...this.resourceAuthority ? { nativeResource: {
				...this.resourceAuthority,
				generation
			} } : {}
		};
		if (serialize(bootstrap).byteLength > MAX_BOOTSTRAP_BYTES) throw new SpawnBrokerError("Spawn broker bootstrap exceeds its IPC bound");
		const child = spawn(process.execPath, resolveRuntimeWorkerArgv(this.workerUrl), {
			stdio: [
				"inherit",
				"ignore",
				"pipe",
				"ipc"
			],
			detached: true,
			serialization: "advanced"
		});
		this.process = child;
		let stderrTail = "";
		child.stderr?.setEncoding("utf8").on("data", (chunk) => {
			stderrTail = truncateUtf8Suffix(stderrTail + chunk, 2048);
		});
		const exitError = () => {
			const stderr = redactToolPayloadText(stderrTail).trim();
			return /* @__PURE__ */ new Error(`exited with code=${child.exitCode ?? "null"} signal=${child.signalCode ?? "none"}${stderr ? `\nstderr:\n${stderr}` : ""}`);
		};
		this.brokerClosed = waitForBrokerChildCompletion(child).then(() => {
			if (this.closing && child.pid && (child.exitCode !== 0 || child.signalCode !== null)) this.cleanupErrors.push(new SpawnBrokerError("Spawn broker shutdown failed", { cause: exitError() }));
		});
		const receiver = createBrokerReceiver();
		const brokerExited = createDeferredCore();
		let ended = false;
		let ready = false;
		this.startupDeadline = spawnBrokerStartupNowMs() + SPAWN_BROKER_STARTUP_TIMEOUT_MS;
		const checkStartup = () => {
			if (!ended && !ready && spawnBrokerStartupNowMs() >= this.startupDeadline) fail(/* @__PURE__ */ new Error("readiness deadline exceeded after 15000ms"));
		};
		const startupTimer = this.resourceClaims ? void 0 : setTimeout(checkStartup, SPAWN_BROKER_STARTUP_TIMEOUT_MS);
		this.serviceStartup = checkStartup;
		const fail = (cause) => {
			if (ended) return;
			ended = true;
			clearTimeout(startupTimer);
			this.markNativeReady = void 0;
			receiver.clear();
			this.available = false;
			this.sendMessage = void 0;
			if (child.connected) child.disconnect();
			const error = new SpawnBrokerError(formatChildRuntimeSpawnWarning(cause) ?? (this.hasBeenReady ? "Spawn broker exited; command outcome is unavailable" : `Spawn broker failed before readiness: ${cause?.message ?? "channel lost"}`), { cause });
			const previousReadiness = this.readiness;
			this.readiness = createDeferredCore();
			this.readiness.promise.catch(() => {});
			previousReadiness.reject(error);
			this.fileReads.fail(error);
			for (const request of this.requests.values()) {
				if (request.pid && !request.childClosed) {
					const pid = request.pid;
					if (this.closing) {
						let cleanup;
						this.retainCleanup({
							force: () => cleanup?.force(),
							settled: brokerExited.promise.then(async () => {
								if (child.exitCode === 0 && child.signalCode === null) return;
								cleanup = terminateLostBrokerChild(pid, request.detached);
								await cleanup.settled;
							})
						});
					} else this.retainCleanup(terminateLostBrokerChild(pid, request.detached));
				}
				request.result?.reject(error);
				request.child.fail(error);
			}
			this.requests.clear();
			this.refreshNativeReference();
			if (child.pid && process.platform !== "win32") {
				const pgid = child.pid;
				let cleanup;
				this.retainCleanup({
					force: () => cleanup?.force(),
					settled: brokerExited.promise.then(async () => {
						cleanup = terminateBrokerProcessGroup(pgid);
						await cleanup.settled;
					})
				});
			}
			if (this.resourceClaims || this.closing || !this.hasBeenReady) {
				this.readiness.reject(error);
				this.resourceClaims?.fail(error);
				return;
			}
			const delay = RESTART_DELAYS[this.consecutiveFailures++];
			if (delay === void 0) {
				this.readiness.reject(error);
				return;
			}
			this.restartTimer = setTimeout(() => this.start(), delay);
		};
		const markReady = (pid, receivedGeneration) => {
			if (ended || pid !== child.pid || receivedGeneration !== generation) throw new SpawnBrokerError("Native resource readiness does not match the captured broker");
			if (ready) return;
			ready = true;
			clearTimeout(startupTimer);
			this.hasBeenReady = true;
			this.consecutiveFailures = 0;
			this.available = true;
			this.readiness.resolve();
			this.runInContext(() => this.options.onReady?.(pid, generation > 0));
		};
		this.markNativeReady = markReady;
		child.once("error", fail);
		child.once("exit", () => {
			brokerExited.resolve();
			fail(exitError());
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
				fail(toErrorObject(error, "Spawn broker receive failed"));
				return;
			}
			if (decoded === void 0) return;
			const message = decoded;
			if (message.type === "ready") {
				try {
					markReady(message.pid, generation);
				} catch (error) {
					fail(toErrorObject(error, "Spawn broker readiness failed"));
				}
				return;
			}
			if (message.type === "resource-ready" || message.type === "resource-created" || message.type === "resource-target" || message.type === "resource-owner" || message.type === "resource-owner-received" || message.type === "resource-owner-rejected" || message.type === "resource-closed" || message.type === "resource-close-error" || message.type === "resource-failed") {
				try {
					this.resourceClaims?.receive(message);
				} catch (error) {
					fail(toErrorObject(error, "Spawn broker native resource receive failed"));
				}
				return;
			}
			if (this.fileReads.receive(message)) return;
			const request = this.requests.get(message.id);
			if (!request) {
				if (handle instanceof Socket) handle.destroy();
				if (message.type === "pipe") this.transmit({
					type: "pipe-received",
					id: message.id,
					fd: message.fd
				}).catch(fail);
				else if (message.type === "prepared") this.transmit({
					type: "launch",
					id: message.id,
					allowed: false
				}).catch(fail);
				return;
			}
			if (message.type === "owned" || message.type === "error") {
				request.nativeInitiated?.resolve();
				request.nativeInitiated = void 0;
			}
			if (message.type === "prepared") {
				const initiate = request.initiateSpawn;
				request.initiateSpawn = void 0;
				const brokerClosed = this.brokerClosed;
				const nativeInitiated = initiate ? request.nativeInitiated ??= createDeferredCore() : void 0;
				const settlement = brokerClosed && nativeInitiated ? Promise.race([nativeInitiated.promise, brokerClosed]) : Promise.reject(/* @__PURE__ */ new Error("Spawn broker retirement is unavailable"));
				settlement.catch(() => {});
				this.transmit({
					type: "launch",
					id: message.id,
					allowed: true
				}, void 0, (launch) => {
					if (!initiate || !nativeInitiated || request.childClosed) throw new SpawnBrokerError("Spawn broker launch grant is unavailable");
					return initiate(launch, settlement);
				}).catch(() => {
					this.transmit({
						type: "launch",
						id: message.id,
						allowed: false
					}).catch(fail);
				});
			} else if (message.type === "owned") {
				request.pid = message.pid;
				if (request.childClosed) {
					this.retainCleanup(terminateLostBrokerChild(message.pid, request.detached));
					this.retire(message.id, request);
				}
			} else if (message.type === "pipe") {
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
					return;
				}
				this.transmit({
					type: "pipe-received",
					id: message.id,
					fd: message.fd
				}).catch(fail);
			} else if (message.type === "pipe-prefix") {
				const pipe = request.child.stdio[message.fd];
				if (pipe instanceof Socket && message.bytes.length > 0) pipe.unshift(message.bytes);
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
		try {
			child.send(bootstrap, (error) => {
				if (error) fail(error);
			});
		} catch (error) {
			fail(toErrorObject(error, "Spawn broker bootstrap delivery failed"));
		}
		if (!ended) this.sendMessage = createBrokerSender((message, handle, callback) => child.send(message, handle, { keepOpen: true }, callback));
		this.refreshNativeReference();
	}
	/** Join cleanup already retained by this host, including recorded failures. */
	async waitForCleanup() {
		await Promise.allSettled([...this.cleanups].map((cleanup) => cleanup.settled));
		if (this.cleanupErrors.length) throw new AggregateError(this.cleanupErrors, "Spawn broker cleanup did not complete");
	}
	close() {
		if (this.resourceClaims?.hasOpenClaims) return Promise.reject(new SpawnBrokerError("Native resource claims must close before broker shutdown"));
		return this.closePromise ??= this.closeInternal();
	}
	async closeInternal() {
		this.closing = true;
		this.refreshNativeReference();
		this.readiness.reject(new SpawnBrokerError("Spawn broker is closing"));
		this.fileReads.fail(new SpawnBrokerError("Spawn broker is closing"));
		clearTimeout(this.restartTimer);
		try {
			const child = this.process;
			if (child && child.exitCode === null && child.signalCode === null) {
				if (this.resourceClaims) this.transmit({ type: "shutdown" }).catch(() => {
					if (child.connected) child.disconnect();
				});
				else if (child.connected) child.disconnect();
			}
			await this.brokerClosed;
			try {
				await this.waitForCleanup();
			} finally {
				if (this.resourceDirectory) rmSync(this.resourceDirectory, {
					recursive: true,
					force: true
				});
			}
		} finally {
			process.removeListener("exit", this.onParentExit);
		}
	}
};
function createSpawnBrokerHost(options) {
	return new SpawnBrokerHost(options);
}
//#endregion
export { createSpawnBrokerHost as n, GRACEFUL_CANCEL_TIMEOUT_MS as r, brokerSpawnOptions as t };
