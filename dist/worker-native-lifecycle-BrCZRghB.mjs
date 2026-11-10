import { d as toErrorObject } from "./error-coercion-BwMr25F8.mjs";
import { a as resolveGlobalSingleton } from "./global-singleton-DrXvEBww.mjs";
import { t as runInDetachedAsyncContext } from "./detached-async-context-D04NzekX.mjs";
import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { n as runWithMainThreadTask } from "./main-thread-stall-BJxVH-It.mjs";
import { r as resolveRuntimeWorkerThreadExecArgv } from "./runtime-worker-url-CvMrvFI1.mjs";
import { n as runtimeProcessEntrypoints } from "./runtime-process-entrypoints-BMmG9cQl.mjs";
import { n as resolveRuntimeProcessEntrypointUrl } from "./runtime-process-url-BCfqgqXF.mjs";
import { t as captureRuntimeWorkerSource } from "./runtime-worker-generation-DvW-aFj2.mjs";
import { n as createCpuTrackedWorker, s as receiveWorkerMemoryPort, u as trackNativeWorkerForCpu } from "./worker-cpu-c5lFIb1t.mjs";
import { i as workerMessagePayloadBytes, n as observeWorkerMessage } from "./worker-message-metrics-CcNXClPZ.mjs";
import { i as captureSqliteWorkerEnvironmentData } from "./bun-sqlite-library-CYR1RYZS.mjs";
import { n as createSpawnBrokerHost } from "./host-lcL0oJAA.mjs";
import { i as decodeNativeWorkerFailure, t as BrokerNativeResourceCloseError } from "./resource-protocol-Bh2jG53d.mjs";
import { t as createRetainedOperation } from "./retained-operation-cDWsZqBc.mjs";
import { basename } from "node:path";
import { MessageChannel, SHARE_ENV, receiveMessageOnPort } from "node:worker_threads";
import { AsyncLocalStorage } from "node:async_hooks";
import { EventEmitter } from "node:events";
//#region src/infra/worker-native-resource.ts
/** Binds the host's original cleanup port to the same surviving spawn-owner claim. */
function bindNativeWorkerResource(options) {
	const { broker, descriptor, connection } = options;
	let disposed = false;
	const lease = broker.captureNativeResource({
		moduleUrl: descriptor.moduleUrl,
		input: descriptor.input,
		ownerPort: Boolean(connection)
	}, {
		message(response) {
			if (response.type === "resource-owner") connection?.port.postMessage(response.value, []);
			else if (response.type === "resource-closed") options.closed();
		},
		failed: (error) => options.failed(error)
	});
	const forward = (value) => {
		if (disposed) return;
		try {
			const delivery = lease.ownerMessage(value);
			if (options.supervisorAvailable()) options.postOwnerMessage(value, delivery.sequence);
		} catch (error) {
			options.failed(toErrorObject(error, "Native resource owner delivery failed"));
		}
	};
	connection?.port.on("message", forward);
	const dispose = () => {
		if (disposed) return;
		disposed = true;
		connection?.port.off("message", forward);
		connection?.port.close();
		connection?.dispose();
	};
	return {
		attachment: lease.attachment,
		receive(response) {
			lease.receive(response);
		},
		service() {
			if (disposed || !connection) return;
			connection.service();
			for (;;) {
				const next = receiveMessageOnPort(connection.port);
				if (!next) break;
				forward(next.message);
			}
		},
		async closeAfterSupervisor() {
			try {
				await broker.sealNativeResources();
				await lease.close();
			} catch (error) {
				if (error instanceof BrokerNativeResourceCloseError && connection?.decodeCloseError) throw connection.decodeCloseError(error.payload);
				throw error;
			}
		},
		release() {
			lease.release();
			dispose();
		},
		abandonUnattached() {
			lease.abandonUnattached();
			dispose();
		}
	};
}
//#endregion
//#region src/infra/worker-native-port.ts
const livePort = /* @__PURE__ */ new Error("Native worker port validation reached the live sentinel");
livePort.stack = void 0;
const portValidation = { get value() {
	throw livePort;
} };
function nativePortIsOpen(port) {
	if (process.versions.bun) {
		const referenced = port.hasRef();
		port.unref();
		port.ref();
		const open = port.hasRef();
		if (!referenced) port.unref();
		return open;
	}
	try {
		structuredClone(portValidation, { transfer: [port] });
	} catch (error) {
		if (error === livePort) return true;
		if (error instanceof DOMException && error.name === "DataCloneError") return false;
		throw error;
	}
	throw new Error("Native port validation did not abort serialization");
}
//#endregion
//#region src/infra/worker-native-task-port.ts
/** The task endpoint owns delivery only; its close never proves native execution stopped. */
var NativeWorkerTaskPort = class {
	constructor(port, callbacks) {
		this.port = port;
		this.callbacks = callbacks;
		this.pending = [];
		this.started = false;
		this.disposed = false;
		this.portClosed = false;
		this.receive = (value) => {
			observeWorkerMessage(value, "from_worker");
			this.pending.push({
				type: "message",
				value
			});
			this.drain();
		};
		this.receiveError = (error) => {
			this.pending.push({
				type: "messageerror",
				error
			});
			this.drain();
		};
		this.closed = () => {
			this.portClosed = true;
			this.drain();
			this.fail(/* @__PURE__ */ new Error("Native worker task channel closed"));
		};
		port.on("message", this.receive);
		port.on("messageerror", this.receiveError);
		port.on("close", this.closed);
		port.unref();
	}
	fail(error) {
		if (this.disposed || this.failure) return;
		this.failure = error;
		this.callbacks.unavailable();
	}
	start() {
		this.started = true;
	}
	/** Startup admission gates data even when the control owner has already failed. */
	drain() {
		if (this.disposed || !this.started) return;
		for (;;) {
			const buffered = this.pending.shift();
			if (buffered) {
				if (buffered.type === "message") this.callbacks.message(buffered.value);
				else this.callbacks.messageerror(buffered.error);
			} else {
				if (this.portClosed || this.failure) return;
				let next;
				try {
					next = runWithMainThreadTask("worker:message-decode", () => receiveMessageOnPort(this.port));
				} catch (error) {
					this.fail(toErrorObject(error, "Native worker task channel observation failed"));
					return;
				}
				if (!next) return;
				observeWorkerMessage(next.message, "from_worker");
				this.callbacks.message(next.message);
			}
			if (this.disposed) return;
		}
	}
	service() {
		this.drain();
		if (this.disposed || this.failure) return;
		if (this.portClosed) {
			this.fail(/* @__PURE__ */ new Error("Native worker task channel closed"));
			return;
		}
		let open;
		try {
			open = nativePortIsOpen(this.port);
		} catch (error) {
			this.fail(toErrorObject(error, "Native worker task channel observation failed"));
			return;
		}
		if (!open) {
			this.portClosed = true;
			this.fail(/* @__PURE__ */ new Error("Native worker task channel closed"));
		}
	}
	assertAvailable() {
		if (this.failure) throw this.failure;
		if (this.disposed || this.portClosed) throw new Error("Native worker task channel is closed");
	}
	postMessage(value, transferList) {
		this.assertAvailable();
		const bytes = workerMessagePayloadBytes(value);
		this.port.postMessage(value, [...transferList]);
		observeWorkerMessage(value, "to_worker", "other", bytes ?? null);
	}
	close() {
		if (this.disposed) return;
		this.disposed = true;
		this.pending.length = 0;
		this.port.off("message", this.receive);
		this.port.off("messageerror", this.receiveError);
		this.port.off("close", this.closed);
		this.port.close();
	}
};
//#endregion
//#region src/infra/worker-request-kind.ts
const standaloneKinds = {
	"catalog-page.worker.js": "catalog",
	"code-mode.worker.js": "codeMode",
	"disk-budget.worker.js": "diskBudget",
	"document-extractor.worker.js": "document",
	"manager-index.worker.js": "memoryIndex",
	"manager-search.worker.js": "memorySearch",
	"memory-index.worker.js": "memoryIndex",
	"memory-search.worker.js": "memorySearch",
	"run.worker.js": "teamReports",
	"session-history.worker.js": "sessionHistory"
};
const kinds = new Map([...Object.entries(runtimeProcessEntrypoints).map(([kind, entry]) => [basename(entry.distWorkerPath), kind]), ...Object.entries(standaloneKinds)]);
/** SDK callers may supply their own workers; never publish arbitrary paths as labels. */
function workerRequestKind(url) {
	return kinds.get(basename(url.pathname).replace(/\.(?:ts|mjs)$/, ".js")) ?? "extension";
}
//#endregion
//#region src/infra/worker-native-handle.ts
var NativeWorker = class extends EventEmitter {
	constructor(runtime, id, filename, evalSource, ownsNativeResource, resourceConnection, taskPort) {
		super();
		this.runtime = runtime;
		this.id = id;
		this.filename = filename;
		this.evalSource = evalSource;
		this.ownsNativeResource = ownsNativeResource;
		this.resourceConnection = resourceConnection;
		this.runInContext = AsyncLocalStorage.snapshot();
		this.threadId = 0;
		this.started = false;
		this.executionStopped = false;
		this.referenced = true;
		this.stopping = false;
		this.joined = false;
		this.servicingResource = false;
		this.resourceClosed = false;
		this.supervisorJoined = false;
		this.terminalObserved = false;
		this.taskPortLossReported = false;
		this.requestId = 0;
		this.stopCompletion = createRetainedOperation(() => this.service());
		this.cpuRequests = /* @__PURE__ */ new Map();
		this.heapRequests = /* @__PURE__ */ new Map();
		this.diagnosticName = `worker:${!evalSource && filename instanceof URL ? workerRequestKind(filename) : "other"}`;
		if (taskPort) this.taskPort = new NativeWorkerTaskPort(taskPort, {
			message: (value) => this.runInContext(() => runWithMainThreadTask(this.diagnosticName, () => this.emit("message", value))),
			messageerror: (error) => this.runInContext(() => this.emit("messageerror", error)),
			unavailable: () => this.observeTaskPortLoss()
		});
	}
	get needsReference() {
		return this.referenced || this.stopping || this.executionStopped && this.ownsNativeResource && !this.joined || this.cpuRequests.size > 0 || this.heapRequests.size > 0;
	}
	service() {
		this.runtime.service();
	}
	serviceTaskPort() {
		const taskPort = this.taskPort;
		if (!taskPort) return;
		runWithMainThreadTask(this.diagnosticName, () => taskPort.service());
		this.observeTaskPortLoss();
	}
	observeTaskPortLoss() {
		const failure = this.taskPort?.failure;
		if (!failure || !this.started || !this.referenced || this.taskPortLossReported || this.terminalObserved || this.stopping || this.joined || this.executionStopped || this.runtime.failure) return;
		this.taskPortLossReported = true;
		this.runInContext(() => this.emit("error", failure));
	}
	serviceResource() {
		if (!this.resourceBinding || this.servicingResource || this.joined) return;
		this.servicingResource = true;
		try {
			this.resourceBinding.service();
		} catch (error) {
			this.resourceFailed(error);
		} finally {
			this.servicingResource = false;
		}
	}
	attachResource(descriptor) {
		this.resourceBinding = bindNativeWorkerResource({
			broker: this.runtime.resourceBroker(),
			descriptor,
			connection: this.resourceConnection,
			supervisorAvailable: () => !this.runtime.failure,
			postOwnerMessage: (value, sequence) => this.runtime.post({
				type: "resource-owner",
				id: this.id,
				sequence,
				value
			}),
			closed: () => this.runInContext(() => {
				this.resourceClosed = true;
				if (this.supervisorJoined) this.finishJoined(void 0);
			}),
			failed: (error) => this.resourceFailed(error)
		});
		return {
			workerDataKey: descriptor.workerDataKey,
			attachment: this.resourceBinding.attachment
		};
	}
	abandonResource() {
		this.taskPort?.close();
		if (this.resourceBinding) this.resourceBinding.abandonUnattached();
		else this.resourceConnection?.dispose();
	}
	resourceFailed(error) {
		this.runInContext(() => {
			this.stopCompletion.reject(error);
			this.emit("error", toErrorObject(error, "Native resource observation failed"));
		});
	}
	recoverResource() {
		if (!this.resourceBinding || this.joined || this.resourceRecovery) return;
		const recovery = this.resourceBinding.closeAfterSupervisor();
		this.resourceRecovery = recovery;
		recovery.then(() => this.runInContext(() => {
			this.finishJoined(void 0);
		}), (error) => this.runInContext(() => {
			this.stopping = false;
			this.stopCompletion.reject(error);
		}));
	}
	postMessage(value, transferList = []) {
		if (this.joined || this.stopping || this.executionStopped) throw new Error("Native worker is closing");
		if (this.runtime.failure) throw this.runtime.failure;
		if (this.taskPort) {
			this.taskPort.postMessage(value, transferList);
			return;
		}
		this.runtime.post({
			type: "post",
			id: this.id,
			value,
			transferList: [...transferList]
		}, transferList);
	}
	ref() {
		if (this.runtime.failure) throw this.runtime.failure;
		this.taskPort?.assertAvailable();
		if (!this.referenced) {
			this.runtime.post({
				type: "ref",
				id: this.id,
				referenced: true
			});
			this.referenced = true;
		}
		this.runtime.refreshReference();
		return this;
	}
	unref() {
		const wasReferenced = this.referenced;
		this.referenced = false;
		if (!this.joined) {
			if (this.runtime.failure) throw this.runtime.failure;
			if (wasReferenced) this.runtime.post({
				type: "ref",
				id: this.id,
				referenced: false
			});
		}
		this.runtime.refreshReference();
		return this;
	}
	stop() {
		if (this.joined) {
			if (this.stopCompletion.operation.read().status !== "fulfilled") {
				this.stopCompletion = createRetainedOperation(() => this.service());
				this.stopCompletion.resolve();
			}
			return this.stopCompletion.operation;
		}
		if (this.stopCompletion.operation.read().status === "rejected") this.stopCompletion = createRetainedOperation(() => this.service());
		if (this.supervisorJoined && this.resourceBinding) {
			this.stopCompletion.reject(new Error("Native resource cleanup is still retained after supervisor loss", { cause: this.runtime.failure }));
			this.recoverResource();
			return this.stopCompletion.operation;
		}
		if (!this.stopping) {
			this.stopping = true;
			try {
				this.runtime.post({
					type: "stop",
					id: this.id
				});
			} catch (error) {
				this.stopping = false;
				this.stopCompletion.reject(error);
			}
			this.runtime.refreshReference();
		}
		return this.stopCompletion.operation;
	}
	terminate() {
		return this.stop().result;
	}
	cpuUsage(previous) {
		return this.requestSample(this.cpuRequests, {
			type: "cpu",
			previous
		});
	}
	getHeapStatistics() {
		return this.requestSample(this.heapRequests, { type: "heap" });
	}
	requestSample(requests, request) {
		if (this.joined) return Promise.reject(/* @__PURE__ */ new Error("Native worker exited"));
		const pending = createRetainedOperation(() => this.service());
		const requestId = ++this.requestId;
		requests.set(requestId, pending);
		try {
			this.runtime.post({
				...request,
				id: this.id,
				requestId
			});
		} catch (error) {
			requests.delete(requestId);
			pending.reject(error);
		}
		this.runtime.refreshReference();
		return pending.operation.result;
	}
	rejectSamples(error) {
		for (const pending of [...this.cpuRequests.values(), ...this.heapRequests.values()]) pending.reject(error);
		this.cpuRequests.clear();
		this.heapRequests.clear();
	}
	ownerFailed(error) {
		this.runInContext(() => {
			this.taskPort?.close();
			this.stopping = false;
			this.rejectSamples(error);
			this.stopCompletion.reject(error);
			this.emit("error", error);
		});
	}
	ownerJoined(error) {
		this.runInContext(() => {
			this.stopping = false;
			this.supervisorJoined = true;
			this.rejectSamples(error);
			this.finishExecution(void 0);
			if (this.ownsNativeResource) {
				if (this.resourceClosed) {
					this.finishJoined(void 0);
					return;
				}
				this.stopCompletion.reject(new Error("Native resource cleanup outcome is unavailable after owner loss", { cause: error }));
				this.recoverResource();
				return;
			}
			this.finishJoined(void 0);
		});
	}
	finishJoined(code) {
		if (this.joined) return;
		this.joined = true;
		this.taskPort?.close();
		this.threadId = -1;
		this.stopping = false;
		this.referenced = false;
		this.rejectSamples(/* @__PURE__ */ new Error("Native worker exited"));
		this.stopCompletion.resolve();
		this.runtime.handles.delete(this.id);
		if (!this.runtime.failure) this.runtime.post({
			type: "release",
			id: this.id
		});
		this.runtime.refreshReference();
		if (this.resourceBinding) this.resourceBinding.release();
		else this.resourceConnection?.dispose();
		this.finishExecution(code);
		this.emit("exit", code);
	}
	finishExecution(code) {
		if (!this.executionStopped) {
			this.taskPort?.close();
			this.executionStopped = true;
			this.emit("execution-exit", code);
		}
	}
	receive(reply) {
		this.runInContext(() => runWithMainThreadTask(this.diagnosticName, () => {
			if (reply.type === "error" || reply.type === "messageerror" || reply.type === "create-error" || reply.type === "execution-exit" || reply.type === "stopped" || reply.type === "stop-error") {
				this.terminalObserved = true;
				this.taskPort?.drain();
			}
			this.receiveOwned(reply);
		}));
	}
	receiveOwned(reply) {
		if (reply.type === "created") {
			this.started = true;
			this.threadId = reply.threadId;
			trackNativeWorkerForCpu(this, this.filename, this.evalSource);
			this.taskPort?.start();
			this.emit("started");
			this.taskPort?.drain();
			this.observeTaskPortLoss();
		} else if (reply.type === "message") this.emit("message", reply.value);
		else if (reply.type === "resource-message") this.resourceBinding?.receive(reply.response);
		else if (reply.type === "error" || reply.type === "messageerror") this.emit(reply.type, toErrorObject(decodeNativeWorkerFailure(reply.error), "Native worker failed"));
		else if (reply.type === "create-error") {
			this.joined = true;
			this.threadId = -1;
			this.referenced = false;
			const error = toErrorObject(decodeNativeWorkerFailure(reply.error), "Native worker creation failed");
			this.rejectSamples(error);
			this.stopCompletion.resolve();
			this.runtime.handles.delete(this.id);
			this.runtime.refreshReference();
			this.abandonResource();
			this.emit("error", error);
		} else if (reply.type === "stopped") this.finishJoined(reply.code);
		else if (reply.type === "execution-exit") this.finishExecution(reply.code);
		else if (reply.type === "stop-error") {
			const requestedStop = this.stopping;
			this.stopping = false;
			let error;
			try {
				if (reply.resourceError) {
					if (!this.resourceConnection?.decodeCloseError) throw new Error("Native resource cleanup error decoder is unavailable", { cause: reply.error });
					error = this.resourceConnection.decodeCloseError(reply.error);
				} else error = toErrorObject(decodeNativeWorkerFailure(reply.error), "Native worker stop failed");
			} catch (decodeError) {
				error = toErrorObject(decodeError, "Native resource cleanup error decoding failed");
			}
			this.stopCompletion.reject(error);
			if (!requestedStop) this.emit("error", error);
		} else if (reply.type === "cpu") {
			this.cpuRequests.get(reply.requestId)?.resolve(reply.value);
			this.cpuRequests.delete(reply.requestId);
		} else if (reply.type === "heap") {
			this.heapRequests.get(reply.requestId)?.resolve(reply.value);
			this.heapRequests.delete(reply.requestId);
		} else if (reply.type === "request-error") {
			const error = toErrorObject(decodeNativeWorkerFailure(reply.error), "Native worker observation failed");
			this.cpuRequests.get(reply.requestId)?.reject(error);
			this.heapRequests.get(reply.requestId)?.reject(error);
			this.cpuRequests.delete(reply.requestId);
			this.heapRequests.delete(reply.requestId);
		}
		this.runtime.refreshReference();
	}
};
//#endregion
//#region src/infra/worker-native-lifecycle.ts
const lifetime = resolveGlobalSingleton(Symbol.for("openclaw.nativeWorkerLifetimes"), () => ({
	nextId: 0,
	sources: /* @__PURE__ */ new WeakMap()
}), closeDefaultRetainedNativeWorkerSource);
/** Terminal process cleanup joins the existing unbound owner without starting another. */
async function closeDefaultRetainedNativeWorkerSource() {
	await lifetime.defaultSource?.close();
}
function forgetNativeSource(source) {
	if (source.runtimeGeneration) {
		if (lifetime.sources.get(source.runtimeGeneration) === source) lifetime.sources.delete(source.runtimeGeneration);
	} else if (lifetime.defaultSource === source) lifetime.defaultSource = void 0;
}
function nativeCleanupFailures(results) {
	return results.flatMap((result) => result.status === "rejected" ? [result.reason] : []);
}
function nativeRuntime(source) {
	if (source.closing) throw new Error("Native worker source is closing");
	const existing = source.runtime;
	if (existing) {
		if (existing.failure) throw existing.failure;
		return existing;
	}
	return runInDetachedAsyncContext(() => {
		const { port1, port2 } = new MessageChannel();
		const url = source.moduleUrl;
		let worker;
		try {
			worker = createCpuTrackedWorker(url, {
				execArgv: resolveRuntimeWorkerThreadExecArgv(url),
				env: SHARE_ENV,
				workerData: { port: port2 },
				transferList: [port2]
			});
		} catch (error) {
			port1.close();
			port2.close();
			throw error;
		}
		const handles = /* @__PURE__ */ new Map();
		const ownerJoined = createDeferredCore();
		ownerJoined.promise.catch(() => void 0);
		let terminating = false;
		const terminateOwner = () => {
			if (terminating) return;
			terminating = true;
			worker.ref();
			port1.ref();
			try {
				worker.terminate().catch(ownerJoined.reject);
			} catch (error) {
				ownerJoined.reject(error);
			}
		};
		const receive = (reply) => {
			observeWorkerMessage(reply, "from_worker", "lifecycle");
			handles.get(reply.id)?.receive(reply);
		};
		const runtime = {
			handles,
			service() {
				for (;;) {
					const next = runWithMainThreadTask("worker:control-decode", () => receiveMessageOnPort(port1));
					if (!next) break;
					receive(next.message);
				}
				const resourceHandles = [...handles.values()];
				for (const handle of resourceHandles) {
					handle.serviceTaskPort();
					handle.serviceResource();
				}
				if (runtime.failure) return;
				let channelOpen;
				try {
					channelOpen = nativePortIsOpen(port1);
				} catch (error) {
					fail(new Error("Native worker lifetime channel observation failed", { cause: error }));
					terminateOwner();
					return;
				}
				if (!channelOpen) {
					fail(/* @__PURE__ */ new Error("Native worker lifetime channel closed"));
					terminateOwner();
					return;
				}
				source.broker?.serviceNativeResources();
			},
			post(message, transfers = []) {
				if (runtime.failure) throw runtime.failure;
				const bytes = workerMessagePayloadBytes(message);
				port1.postMessage(message, [...transfers]);
				observeWorkerMessage(message, "to_worker", "lifecycle", bytes ?? null);
			},
			resourceBroker() {
				return source.broker ??= runInDetachedAsyncContext(() => createSpawnBrokerHost({
					nativeResources: true,
					workerUrl: source.brokerModuleUrl
				}));
			},
			refreshReference() {
				if ([...handles.values()].some((handle) => handle.needsReference)) {
					worker.ref();
					port1.ref();
				} else {
					worker.unref();
					port1.unref();
				}
			},
			close() {
				if (handles.size) return Promise.reject(/* @__PURE__ */ new Error("Native worker execution owners have not joined"));
				runtime.failure ??= /* @__PURE__ */ new Error("Native worker lifetime owner is closing");
				terminateOwner();
				return ownerJoined.promise;
			}
		};
		const fail = (error) => {
			if (runtime.failure) return;
			runtime.failure = toErrorObject(error, "Native worker lifetime owner failed");
			for (const handle of handles.values()) handle.ownerFailed(runtime.failure);
		};
		port1.on("message", receive);
		port1.on("messageerror", (error) => {
			try {
				fail(error);
			} finally {
				terminateOwner();
			}
		});
		worker.on("message", (message) => receiveWorkerMemoryPort(worker, message));
		worker.on("error", fail);
		worker.once("exit", () => {
			setImmediate(() => {
				const error = runtime.failure ?? /* @__PURE__ */ new Error("Native worker lifetime owner exited");
				runtime.failure = error;
				source.closing = true;
				for (const handle of handles.values()) handle.ownerJoined(error);
				port1.close();
				ownerJoined.resolve();
			});
		});
		source.runtime = runtime;
		runtime.refreshReference();
		return runtime;
	});
}
/** Capture before queues; explicit undefined preserves an intentionally unbound lifetime. */
function captureRetainedNativeWorkerSource(options) {
	const supervisor = resolveRuntimeProcessEntrypointUrl("workerNativeLifecycle");
	const captured = options === void 0 ? captureRuntimeWorkerSource(supervisor) : {
		moduleUrl: options.runtimeGeneration ? options.runtimeGeneration.resolve(supervisor) : supervisor,
		runtimeGeneration: options.runtimeGeneration
	};
	const existing = captured.runtimeGeneration ? lifetime.sources.get(captured.runtimeGeneration) : lifetime.defaultSource;
	if (existing) return existing;
	const source = {
		...captured,
		brokerModuleUrl: captured.runtimeGeneration ? captured.runtimeGeneration.resolve(resolveRuntimeProcessEntrypointUrl("spawnBroker")) : resolveRuntimeProcessEntrypointUrl("spawnBroker"),
		closing: false,
		get hasActiveWorkers() {
			return Boolean(source.runtime?.handles.size);
		},
		async retireIdleBroker() {
			await source.brokerClose;
			if (source.hasActiveWorkers) return false;
			const broker = source.broker;
			source.broker = void 0;
			await (source.brokerClose = broker?.close());
			source.brokerClose = void 0;
			return true;
		},
		close() {
			return closingOwners ??= Promise.resolve().then(async () => {
				const errors = nativeCleanupFailures(await Promise.allSettled([...owners.values()].map((close) => close())));
				if (errors.length) throw new AggregateError(errors, "Native worker execution owner cleanup failed");
				source.closing = true;
				await source.runtime?.close();
				await source.brokerClose;
				await source.broker?.close();
				forgetNativeSource(source);
				owners.clear();
			});
		},
		create(filename, workerOptions, resource, taskPorts) {
			try {
				return startNativeWorker(nativeRuntime(source), filename, workerOptions ?? {}, resource, taskPorts);
			} catch (error) {
				taskPorts?.host.close();
				taskPorts?.worker.close();
				throw error;
			}
		},
		captureResource(moduleUrl, workerDataKey, input, connect) {
			const inContext = AsyncLocalStorage.snapshot();
			return Object.freeze({
				moduleUrl: String(captured.runtimeGeneration?.resolve(moduleUrl) ?? moduleUrl),
				workerDataKey,
				input: input === void 0 ? void 0 : structuredClone(input),
				connect: connect ? () => inContext(() => {
					const connection = connect();
					const decode = connection.decodeCloseError?.bind(connection);
					return {
						port: connection.port,
						service: () => inContext(() => connection.service()),
						dispose: () => inContext(() => connection.dispose()),
						decodeCloseError: decode ? (payload) => inContext(() => decode(payload)) : void 0
					};
				}) : void 0
			});
		},
		retain(owner, closeOwner) {
			owners.set(owner, closeOwner);
			captured.runtimeGeneration?.retain(source, () => source.close());
		}
	};
	const owners = /* @__PURE__ */ new Map();
	let closingOwners;
	if (captured.runtimeGeneration) lifetime.sources.set(captured.runtimeGeneration, source);
	else lifetime.defaultSource = source;
	return source;
}
/** Existing execution owners retain their queues; this capability owns only physical Worker lifetime. */
function createRetainedNativeWorker(filename, options = {}, source, resource, taskPorts) {
	try {
		return (source ?? captureRetainedNativeWorkerSource({ runtimeGeneration: void 0 })).create(filename, options, resource, taskPorts);
	} catch (error) {
		taskPorts?.host.close();
		taskPorts?.worker.close();
		throw error;
	}
}
function startNativeWorker(runtime, filename, options, resource, taskPorts) {
	const id = ++lifetime.nextId;
	let resourceConnection;
	let handle;
	try {
		resourceConnection = resource?.connect?.();
		handle = new NativeWorker(runtime, id, filename, options.eval === true, resource !== void 0, resourceConnection, taskPorts?.host);
		const { env, transferList = [], ...captured } = options;
		runtime.handles.set(id, handle);
		const retainedResource = resource ? handle.attachResource(resource) : void 0;
		runtime.post({
			type: "create",
			id,
			filename: {
				kind: filename instanceof URL ? "url" : "path",
				value: String(filename)
			},
			environmentData: captureSqliteWorkerEnvironmentData(),
			options: {
				...captured,
				environment: { ...env === SHARE_ENV ? process.env : env ?? process.env },
				shareEnvironment: env === SHARE_ENV
			},
			transferList: [...transferList],
			resource: retainedResource,
			taskPort: taskPorts?.worker
		}, taskPorts ? [...transferList, taskPorts.worker] : transferList);
	} catch (error) {
		runtime.handles.delete(id);
		runtime.refreshReference();
		if (handle) handle.abandonResource();
		else {
			taskPorts?.host.close();
			resourceConnection?.dispose();
		}
		taskPorts?.worker.close();
		throw error;
	}
	runtime.refreshReference();
	return handle;
}
//#endregion
export { workerRequestKind as i, closeDefaultRetainedNativeWorkerSource as n, createRetainedNativeWorker as r, captureRetainedNativeWorkerSource as t };
