import { u as toErrorObject } from "./error-coercion-C787aVxk.mjs";
import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { AsyncResource } from "node:async_hooks";
import { Socket } from "node:net";
import { EventEmitter } from "node:events";
//#region src/process/spawn-broker/protocol.ts
var SpawnBrokerError = class extends Error {
	constructor(message, options) {
		super(message, options);
		this.code = "ERR_SPAWN_BROKER_UNAVAILABLE";
		this.name = "SpawnBrokerError";
	}
};
function serializeBrokerError(error) {
	return {
		message: error.message,
		code: error.code,
		errno: error.errno,
		syscall: error.syscall,
		path: error.path
	};
}
//#endregion
//#region src/process/spawn-broker/pipe.ts
const readers = /* @__PURE__ */ new WeakMap();
const holdReadable = () => {};
/** Defer consumption and EOF until the transferred socket is ready for its caller. */
function holdPipe(socket) {
	const held = {
		read: socket.read.bind(socket),
		resumed: false,
		onResume: () => {
			held.resumed = true;
		}
	};
	readers.set(socket, held);
	socket.on("resume", held.onResume);
	socket.on("readable", holdReadable);
	socket.read = () => null;
}
/** Restore native stdin's write-only direction after Node's duplex IPC handoff. */
function restoreStdinPipe(socket) {
	const state = Reflect.get(socket, "_readableState");
	if (!state || typeof state !== "object" || [
		"ended",
		"endEmitted",
		"reading"
	].some((flag) => typeof Reflect.get(state, flag) !== "boolean")) throw new SpawnBrokerError("Spawn broker requires a Node readable state for stdin");
	stopPipeReads(socket);
	Object.assign(state, {
		readable: false,
		ended: true,
		endEmitted: true,
		reading: false
	});
}
function stopPipeReads(socket) {
	const handle = Reflect.get(socket, "_handle");
	if (!handle || typeof handle !== "object" || !("readStop" in handle) || typeof handle.readStop !== "function" || !("reading" in handle) || typeof handle.reading !== "boolean") throw new SpawnBrokerError("Spawn broker requires a transferable Node pipe handle");
	if (handle.readStop() !== 0) throw new SpawnBrokerError("Spawn broker could not stop pipe reads");
	handle.reading = false;
}
/** Restore the pre-transfer buffer ahead of bytes read from the received handle. */
function restorePipePrefix(socket, prefix) {
	if (prefix.length > 0) socket.unshift(prefix);
}
/** Publish stream data and EOF after the caller's readiness continuation. */
function releasePipe(socket) {
	const held = restoreReader(socket);
	if (!held) return;
	process.nextTick(() => {
		if (socket.destroyed) return;
		socket.emit("readable");
		if (held.resumed) socket.resume();
	});
}
function restoreReader(socket) {
	const held = readers.get(socket);
	if (!held) return;
	socket.read = held.read;
	readers.delete(socket);
	socket.removeListener("resume", held.onResume);
	socket.removeListener("readable", holdReadable);
	return held;
}
//#endregion
//#region src/process/spawn-broker/child.ts
/** Native pipes remain native streams; only lifecycle and IPC cross the broker. */
var BrokerChild = class extends EventEmitter {
	constructor(requestId, argv, transmit) {
		super();
		this.requestId = requestId;
		this.transmit = transmit;
		this.callbackContext = new AsyncResource("OpenClawSpawnBrokerChild");
		this.stdin = null;
		this.stdout = null;
		this.stderr = null;
		this.connected = false;
		this.killed = false;
		this.exitCode = null;
		this.signalCode = null;
		this.stdio = [
			null,
			null,
			null,
			null,
			null
		];
		this.opened = createDeferredCore();
		this.completion = createDeferredCore();
		this.pipes = /* @__PURE__ */ new Set();
		this.sends = /* @__PURE__ */ new Map();
		this.sendSequence = 0;
		this.spawnReceived = false;
		this.eventsReleased = false;
		this.pendingEventOverflow = false;
		this.pendingEvents = [];
		this.exited = false;
		this.closed = false;
		this.processNotStarted = false;
		this.spawnfile = argv[0];
		this.spawnargs = [...argv];
		this.opened.promise.catch(() => {});
		this.on("error", () => {});
	}
	/** Only the admission owner can establish that no native process was started. */
	markNotStarted() {
		this.processNotStarted = true;
	}
	get notStarted() {
		return this.processNotStarted;
	}
	ready() {
		return this.opened.promise;
	}
	emit(event, ...args) {
		return this.callbackContext.runInAsyncScope(() => super.emit(event, ...args));
	}
	/** Transport bookkeeping survives disposal of the caller's event listeners. */
	waitForClose() {
		return this.completion.promise;
	}
	attachPipe(fd, socket) {
		socket.emit = this.callbackContext.bind(socket.emit.bind(socket));
		this.stdio[fd] = socket;
		if (fd === 0) this.stdin = socket;
		if (fd === 1) this.stdout = socket;
		if (fd === 2) this.stderr = socket;
		this.pipes.add(socket);
		let acknowledged = false;
		const acknowledge = (error) => {
			if (acknowledged) return;
			acknowledged = true;
			this.transmit({
				type: "output-drained",
				id: this.requestId,
				fd,
				error: error ? serializeBrokerError(error) : void 0
			}).catch(() => {});
		};
		socket.once(fd === 0 ? "finish" : "end", () => acknowledge());
		socket.on("error", acknowledge);
		socket.once("close", () => {
			acknowledge();
			this.pipes.delete(socket);
			this.finishClose();
		});
	}
	receive(message) {
		if (message.type === "spawned") {
			if (this.spawnReceived || this.closed) return;
			this.spawnReceived = true;
			this.pid = message.pid;
			this.spawnfile = message.spawnfile;
			this.spawnargs = message.spawnargs;
			this.connected = message.connected;
			this.stdio.splice(message.stdioLength);
			while (this.stdio.length < message.stdioLength) this.stdio.push(null);
			if (this.connected) this.channel = Object.assign(new EventEmitter(), {
				ref() {},
				unref() {}
			});
			this.opened.resolve();
			setImmediate(() => {
				if (this.closed) return;
				this.emit("spawn");
				setImmediate(() => {
					for (const [fd, pipe] of this.stdio.entries()) if (fd > 0 && pipe instanceof Socket && !pipe.destroyed) releasePipe(pipe);
					this.eventsReleased = true;
					for (const event of this.pendingEvents.splice(0)) event();
				});
			});
			return;
		}
		if (!this.eventsReleased && (this.spawnReceived || message.type !== "error")) {
			this.deferEvent(() => this.emitMessage(message));
			return;
		}
		this.emitMessage(message);
	}
	deferEvent(event) {
		if (this.pendingEventOverflow) return;
		if (this.pendingEvents.length >= 64) {
			this.pendingEventOverflow = true;
			this.pendingEvents.splice(0);
			this.pendingEvents.push(() => {
				this.kill("SIGKILL");
				this.failNow(new SpawnBrokerError("Spawn broker startup event capacity exceeded"));
			});
			return;
		}
		this.pendingEvents.push(event);
	}
	emitMessage(message) {
		switch (message.type) {
			case "error": {
				const error = Object.assign(new Error(message.error.message), message.error);
				this.opened.reject(error);
				this.emit("error", error);
				if (!this.pid) {
					this.exited = true;
					this.finishClose();
				}
				break;
			}
			case "exit":
				this.exited = true;
				this.exitCode = message.code;
				this.signalCode = message.signal;
				this.stdin?.destroy();
				this.emit("exit", message.code, message.signal);
				process.nextTick(() => {
					for (const pipe of this.pipes) if (pipe.readable) pipe.resume();
				});
				this.finishClose();
				break;
			case "ipc-sent":
				this.finishSend(message.sequence, message.error ? Object.assign(new Error(message.error.message), message.error) : null);
				break;
			case "disconnect":
				this.failSends(/* @__PURE__ */ new Error("Child process IPC channel is closed"));
				this.connected = false;
				this.channel = void 0;
				this.emit("disconnect");
				break;
			case "ipc":
				this.emit("message", message.message);
				break;
			case "closed": this.finishClose();
		}
	}
	fail(error) {
		if (this.spawnReceived && !this.eventsReleased) {
			this.deferEvent(() => this.failNow(error));
			return;
		}
		this.failNow(error);
	}
	failNow(error) {
		if (this.closed) return;
		this.opened.reject(error);
		this.failSends(error);
		const wasConnected = this.connected;
		this.connected = false;
		this.channel = void 0;
		if (wasConnected) this.emit("disconnect");
		if (!this.exited) this.emit("error", error);
		for (const pipe of this.pipes) pipe.destroy(error);
		this.exited = true;
		this.finishClose();
	}
	finishClose() {
		if (!this.exited || this.pipes.size > 0 || this.closed) return;
		this.closed = true;
		this.completion.resolve();
		this.emit("close", this.exitCode, this.signalCode);
	}
	kill(signal = "SIGTERM") {
		if (this.exited) return false;
		this.killed = true;
		this.transmit({
			type: "kill",
			id: this.requestId,
			signal
		}).catch((error) => this.fail(toErrorObject(error, "Spawn broker signal delivery failed")));
		return true;
	}
	send(message, handleOrCallback, optionsOrCallback, callback) {
		const done = typeof handleOrCallback === "function" ? handleOrCallback : typeof optionsOrCallback === "function" ? optionsOrCallback : callback;
		if (!this.connected) {
			const error = /* @__PURE__ */ new Error("Child process IPC channel is closed");
			queueMicrotask(() => done ? done(error) : this.emit("error", error));
			return false;
		}
		if (this.sends.size >= 1024) {
			const error = /* @__PURE__ */ new Error("Child process IPC capacity exceeded");
			queueMicrotask(() => done ? done(error) : this.emit("error", error));
			return false;
		}
		const sequence = ++this.sendSequence;
		this.sends.set(sequence, AsyncResource.bind((error) => {
			if (done) done(error);
			else if (error) this.emit("error", error);
		}));
		const handle = typeof handleOrCallback === "function" ? void 0 : handleOrCallback;
		this.transmit({
			type: "ipc",
			id: this.requestId,
			sequence,
			message
		}, handle).catch((error) => this.finishSend(sequence, toErrorObject(error, "Spawn broker IPC delivery failed")));
		return true;
	}
	finishSend(sequence, error) {
		const callback = this.sends.get(sequence);
		this.sends.delete(sequence);
		callback?.(error);
	}
	failSends(error) {
		for (const sequence of this.sends.keys()) this.finishSend(sequence, error);
	}
	disconnect() {
		if (!this.connected) return;
		this.connected = false;
		this.transmit({
			type: "disconnect",
			id: this.requestId
		}).catch((error) => this.fail(toErrorObject(error, "Spawn broker disconnect failed")));
	}
	ref() {}
	unref() {}
	[Symbol.dispose]() {
		this.kill("SIGTERM");
	}
};
//#endregion
export { SpawnBrokerError as a, restoreStdinPipe as i, holdPipe as n, restorePipePrefix as r, BrokerChild as t };
