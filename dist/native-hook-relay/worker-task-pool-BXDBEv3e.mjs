import { s as toErrorObject } from "./error-coercion-DKQY4wyF.mjs";
import { D as isRecord, S as resolveGlobalSingleton, h as resolveTimerTimeoutMs } from "./number-coercion-CmpLVzZ6.mjs";
import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { n as runInDetachedAsyncContext } from "./async-work-scope-6N1oTppj.mjs";
import { n as captureSqliteWorkerEnvironmentData } from "./bun-sqlite-library-DhkLqQoS.mjs";
import { n as createLazyPromiseLoader } from "./lazy-promise-DLFIcwoO.mjs";
import { t as isPromiseLike } from "./promise-like-D7-l5Fsp.mjs";
import { c as createCpuTrackedWorker, d as trackNativeWorkerForCpu, f as captureRuntimeWorkerSource, i as captureDeletedAgentDatabaseFences, l as markWorkerRetirement, s as attributeWorkerToPool, t as createRetainedOperation, u as receiveWorkerMemoryPort } from "./retained-operation-Dsn-U2KQ.mjs";
import { r as resolveRuntimeWorkerThreadExecArgv } from "./runtime-worker-url-QXcu2VO1.mjs";
import { n as resolveRuntimeProcessEntrypointUrl } from "./runtime-process-url-C4UiB3n2.mjs";
import { n as BrokerNativeResourceCloseError, r as decodeNativeWorkerFailure, t as createSpawnBrokerHost } from "./host-BpNtvl4K.mjs";
import { availableParallelism } from "node:os";
import { AsyncLocalStorage } from "node:async_hooks";
import { channel } from "node:diagnostics_channel";
import { MessageChannel, SHARE_ENV, receiveMessageOnPort } from "node:worker_threads";
import { EventEmitter } from "node:events";
//#region src/shared/lazy-runtime.ts
function createLazyRuntimeSurface(importer, select) {
	const loader = createLazyPromiseLoader(() => importer().then(select), { cacheRejections: true });
	return Object.assign(loader.load, {
		peek: loader.peek,
		clear: loader.clear
	});
}
/** Cache the raw dynamically imported runtime module behind a stable loader. */
function createLazyRuntimeModule(importer) {
	return createLazyRuntimeSurface(importer, (module) => module);
}
//#endregion
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
//#region src/infra/worker-native-handle.ts
var NativeWorker = class extends EventEmitter {
	constructor(runtime, id, filename, evalSource, ownsNativeResource, resourceConnection) {
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
		this.resourceRetryRequested = false;
		this.requestId = 0;
		this.stopCompletion = createRetainedOperation(() => this.service());
		this.cpuRequests = /* @__PURE__ */ new Map();
		this.heapRequests = /* @__PURE__ */ new Map();
	}
	get needsReference() {
		return this.referenced || this.stopping || this.executionStopped && this.ownsNativeResource && !this.joined || this.cpuRequests.size > 0 || this.heapRequests.size > 0;
	}
	service() {
		this.runtime.service();
	}
	serviceResource() {
		if (!this.resourceBinding || this.servicingResource || this.joined) return;
		this.servicingResource = true;
		try {
			this.resourceBinding.service();
		} catch (error) {
			this.stopCompletion.reject(error);
			this.runInContext(() => this.emit("error", toErrorObject(error, "Native resource observation failed")));
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
			failed: (error) => this.runInContext(() => {
				this.stopCompletion.reject(error);
				this.emit("error", error);
			})
		});
		return {
			workerDataKey: descriptor.workerDataKey,
			attachment: this.resourceBinding.attachment
		};
	}
	abandonResource() {
		if (this.resourceBinding) this.resourceBinding.abandonUnattached();
		else this.resourceConnection?.dispose();
	}
	recoverResource(requestRetry = false) {
		if (!this.resourceBinding || this.joined) return;
		if (this.resourceRecovery) {
			this.resourceRetryRequested ||= requestRetry;
			return;
		}
		this.resourceRetryRequested = false;
		const recovery = this.resourceBinding.closeAfterSupervisor();
		this.resourceRecovery = recovery;
		recovery.then(() => this.runInContext(() => {
			this.resourceRecovery = void 0;
			this.resourceRetryRequested = false;
			this.finishJoined(void 0);
		}), (error) => this.runInContext(() => {
			this.resourceRecovery = void 0;
			this.stopping = false;
			this.stopCompletion.reject(error);
			if (this.resourceRetryRequested) this.recoverResource();
		}));
	}
	postMessage(value, transferList = []) {
		if (this.joined || this.stopping || this.executionStopped) throw new Error("Native worker is closing");
		this.runtime.post({
			type: "post",
			id: this.id,
			value,
			transferList: [...transferList]
		}, transferList);
	}
	ref() {
		this.referenced = true;
		this.runtime.post({
			type: "ref",
			id: this.id,
			referenced: true
		});
		this.runtime.refreshReference();
		return this;
	}
	unref() {
		this.referenced = false;
		if (!this.joined) this.runtime.post({
			type: "ref",
			id: this.id,
			referenced: false
		});
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
			this.recoverResource(true);
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
			this.executionStopped = true;
			this.emit("execution-exit", code);
		}
	}
	receive(reply) {
		this.runInContext(() => this.receiveOwned(reply));
	}
	receiveOwned(reply) {
		if (reply.type === "created") {
			this.started = true;
			this.threadId = reply.threadId;
			trackNativeWorkerForCpu(this, this.filename, this.evalSource);
			this.emit("started");
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
//#region src/infra/worker-native-port.ts
const livePort = /* @__PURE__ */ new Error("Native worker port validation reached the live sentinel");
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
function closeNativeBroker(source) {
	let closing;
	try {
		closing = source.broker?.close() ?? Promise.resolve();
	} catch (error) {
		const failed = createDeferredCore();
		failed.reject(error);
		closing = failed.promise;
	}
	return source.retiringBrokers.size ? joinNativeBrokerCloses([...source.retiringBrokers, closing]) : closing;
}
async function joinNativeBrokerCloses(attempts) {
	const failures = (await Promise.allSettled(attempts)).flatMap((result) => result.status === "rejected" ? [result.reason] : []);
	if (failures.length === 1) throw failures[0];
	if (failures.length > 1) throw new AggregateError(failures, "Native broker retirement failed");
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
		let nativeOwnerJoined = false;
		const retireSource = () => {
			if (!nativeOwnerJoined || handles.size > 0) return;
			source.runtime = void 0;
			if (!source.broker && source.retiringBrokers.size === 0) {
				forgetNativeSource(source);
				return;
			}
			if (!source.automaticBrokerClose) {
				source.automaticBrokerClose = closeNativeBroker(source);
				source.automaticBrokerClose.then(() => forgetNativeSource(source), () => {});
			}
		};
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
		const receive = (value) => {
			if (!isRecord(value) || typeof value.id !== "number" || typeof value.type !== "string") return;
			handles.get(value.id)?.receive(value);
		};
		const runtime = {
			worker,
			port: port1,
			handles,
			service() {
				for (;;) {
					const next = receiveMessageOnPort(port1);
					if (!next) break;
					receive(next.message);
				}
				const resourceHandles = [...handles.values()];
				for (const handle of resourceHandles) handle.serviceResource();
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
				port1.postMessage(message, [...transfers]);
			},
			resourceBroker() {
				return source.broker ??= runInDetachedAsyncContext(() => createSpawnBrokerHost({
					nativeResources: true,
					workerUrl: source.brokerModuleUrl
				}));
			},
			refreshReference() {
				retireSource();
				if (source.closing && handles.size === 0 && !nativeOwnerJoined) {
					runtime.close().catch(ownerJoined.reject);
					return;
				}
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
				nativeOwnerJoined = true;
				source.closing = true;
				for (const handle of handles.values()) handle.ownerJoined(error);
				port1.close();
				retireSource();
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
	const resources = /* @__PURE__ */ new WeakSet();
	const source = {
		...captured,
		brokerModuleUrl: captured.runtimeGeneration ? captured.runtimeGeneration.resolve(resolveRuntimeProcessEntrypointUrl("spawnBroker")) : resolveRuntimeProcessEntrypointUrl("spawnBroker"),
		closing: false,
		retiringBrokers: /* @__PURE__ */ new Set(),
		get hasActiveWorkers() {
			return Boolean(source.runtime?.handles.size);
		},
		async retireIdleBroker() {
			if (source.hasActiveWorkers) return false;
			if (source.broker) {
				const closing = source.broker.close();
				source.broker = void 0;
				source.retiringBrokers.add(closing);
				closing.then(() => source.retiringBrokers.delete(closing), () => {});
			}
			await joinNativeBrokerCloses([...source.retiringBrokers]);
			return true;
		},
		close() {
			return closingOwners ??= Promise.resolve().then(async () => {
				const closing = [...owners.values()].map((owner) => owner.close());
				joinSource();
				const errors = (await Promise.allSettled(closing.length ? closing : [joined.promise])).flatMap((result) => result.status === "rejected" ? [result.reason] : []);
				if (errors.length) throw new AggregateError(errors, "Native worker execution owner cleanup failed");
			});
		},
		create(filename, workerOptions, resource) {
			if (captured.runtimeGeneration && !owners.size) throw new Error("Native worker source has no retained execution owner");
			if (resource && !resources.has(resource)) throw new Error("Native worker resource belongs to a different execution source");
			return startNativeWorker(nativeRuntime(source), filename, workerOptions ?? {}, resource);
		},
		captureResource(moduleUrl, workerDataKey, input, connect) {
			if (source.closing) throw new Error("Native worker source is closing");
			const inContext = AsyncLocalStorage.snapshot();
			const resource = Object.freeze({
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
			resources.add(resource);
			return resource;
		},
		retain(owner, closeOwner) {
			if (closingOwners || source.closing) throw new Error("Native worker source is closing");
			const close = async () => {
				let outcome;
				try {
					await closeOwner();
					outcome = { status: "fulfilled" };
				} catch (error) {
					outcome = {
						status: "rejected",
						error
					};
				} finally {
					record.settled = true;
					joinSource();
				}
				try {
					await joined.promise;
				} catch (error) {
					if (outcome.status === "rejected") throw new AggregateError([outcome.error, error], "Execution owner and native source cleanup failed", { cause: error });
					throw error;
				}
				if (outcome.status === "rejected") throw outcome.error;
			};
			const record = {
				close,
				settled: false
			};
			captured.runtimeGeneration?.retain(owner, close);
			owners.set(owner, record);
		}
	};
	const owners = /* @__PURE__ */ new Map();
	const joined = createDeferredCore();
	joined.promise.catch(() => void 0);
	let joining = false;
	let closingOwners;
	const joinSource = () => {
		if (joining || [...owners.values()].some((owner) => !owner.settled)) return;
		joining = true;
		source.closing = true;
		(async () => {
			await source.runtime?.close();
			const automatic = source.automaticBrokerClose;
			const closing = closeNativeBroker(source);
			const attempts = automatic && automatic !== closing ? [automatic, closing] : [closing];
			const outcomes = await Promise.allSettled(attempts);
			if (outcomes.at(-1)?.status === "fulfilled") {
				forgetNativeSource(source);
				owners.clear();
			}
			const failures = outcomes.flatMap((outcome) => outcome.status === "rejected" ? [outcome.reason] : []);
			if (failures.length > 1 && !Object.is(failures[0], failures[1])) throw new AggregateError(failures, "Automatic and final native broker cleanup failed");
			await automatic;
			await closing;
		})().then(joined.resolve, joined.reject);
	};
	if (captured.runtimeGeneration) lifetime.sources.set(captured.runtimeGeneration, source);
	else lifetime.defaultSource = source;
	return source;
}
/** Existing execution owners retain their queues; this capability owns only physical Worker lifetime. */
function createRetainedNativeWorker(filename, options = {}, source = captureRetainedNativeWorkerSource({ runtimeGeneration: void 0 }), resource) {
	return source.create(filename, options, resource);
}
function startNativeWorker(runtime, filename, options, resource) {
	const id = ++lifetime.nextId;
	const resourceConnection = resource?.connect?.();
	const handle = new NativeWorker(runtime, id, filename, options.eval === true, resource !== void 0, resourceConnection);
	const { env, transferList = [], ...captured } = options;
	runtime.handles.set(id, handle);
	try {
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
			resource: retainedResource
		}, transferList);
	} catch (error) {
		runtime.handles.delete(id);
		runtime.refreshReference();
		handle.abandonResource();
		throw error;
	}
	runtime.refreshReference();
	return handle;
}
const DEFAULT_WORKER_PENDING_BYTES = 268435456;
/** Shared compute admission; database and generation workers keep their own ordering. */
function createWorkerComputeCapacity(limit) {
	if (!Number.isSafeInteger(limit) || limit < 1) throw new RangeError("compute capacity must be a positive safe integer");
	const active = /* @__PURE__ */ new Set();
	const waiting = /* @__PURE__ */ new Set();
	let pendingTasks = 0;
	let pendingBytes = 0;
	let draining = false;
	const requestCheckpoints = () => {
		let demand = waiting.size;
		if (demand) {
			for (const permit of active) if (permit.requestCheckpoint() && --demand === 0) break;
		}
	};
	const drain = () => {
		if (draining) return;
		draining = true;
		try {
			while (active.size < limit && waiting.size) {
				const next = waiting.values().next().value;
				waiting.delete(next);
				next();
			}
		} finally {
			draining = false;
		}
		requestCheckpoints();
	};
	return {
		getSnapshot: () => ({
			limit,
			active: active.size,
			waitingPools: waiting.size,
			pendingTasks,
			pendingBytes
		}),
		admit(bytes) {
			if (pendingTasks >= 128 || pendingBytes + bytes > 268435456) return false;
			pendingTasks++;
			pendingBytes += bytes;
			return true;
		},
		finish(bytes) {
			pendingTasks--;
			pendingBytes -= bytes;
		},
		acquire(resume, requestCheckpoint) {
			if (active.size >= limit || !draining && waiting.size) {
				waiting.add(resume);
				requestCheckpoints();
				return;
			}
			const permit = { requestCheckpoint };
			active.add(permit);
			return permit;
		},
		release(permit) {
			active.delete(permit);
			drain();
		},
		remove(resume) {
			waiting.delete(resume);
		},
		requestCheckpoints
	};
}
//#endregion
//#region packages/worker-runtime/src/worker-task-error.ts
var WorkerTaskError = class extends Error {
	constructor(message, code) {
		super(message);
		this.code = code;
		this.name = "WorkerTaskError";
	}
};
function workerTaskTimeoutError(exchange, workerUrl) {
	let callback = exchange?.sent === false ? exchange.name : void 0;
	if (callback === "unknown") callback = workerUrl.protocol === "file:" ? workerUrl.pathname.split("/").at(-1)?.slice(0, 96) || "worker" : `${workerUrl.protocol} worker`;
	const error = new WorkerTaskError(callback ? `worker task timed out waiting for host callback ${callback}` : "worker task timed out", "timeout");
	if (callback) process.emitWarning(error.message, { code: "WORKER_HOST_CALLBACK_TIMEOUT" });
	return error;
}
//#endregion
//#region packages/worker-runtime/src/worker-task-native-sections.ts
const CANCELLED = 1;
const SECTION = 2;
const nativeSectionKey = Symbol.for("openclaw.workerTaskNativeSection");
const nativeSectionStore = globalThis;
nativeSectionStore[nativeSectionKey] ??= new AsyncLocalStorage();
function createWorkerNativeSectionState() {
	return new Int32Array(new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT));
}
function cancelWorkerNativeSections(state) {
	Atomics.or(state, 0, CANCELLED);
	Atomics.notify(state, 0);
}
function waitForWorkerNativeSections(state) {
	if (areWorkerNativeSectionsSettled(state)) return;
	return (async () => {
		for (;;) {
			const observed = Atomics.load(state, 0);
			if (observed < SECTION) return;
			await Atomics.waitAsync(state, 0, observed).value;
		}
	})();
}
/** Cancellation must close admission before this fact permits native termination. */
function areWorkerNativeSectionsSettled(state) {
	return Atomics.load(state, 0) < SECTION;
}
function releaseWorkerNativeSectionsOnExit(state) {
	Atomics.store(state, 0, CANCELLED);
	Atomics.notify(state, 0);
}
//#endregion
//#region packages/worker-runtime/src/worker-task-pool-owned.ts
function createWorkerHostExchange(task, request) {
	const name = isRecord(request) ? request.kind ?? request.type : void 0;
	return task.exchange = {
		id: ++task.exchangeSequence,
		name: typeof name === "string" && /^[a-zA-Z][a-zA-Z0-9._:-]{0,95}$/.test(name) ? name : "unknown",
		pressure: new AbortController(),
		sent: false,
		onConsumed: void 0
	};
}
function dispatchOwnedWorkerRequest(task, slot, value, exchange, owner) {
	const context = {
		signal: task.controller.signal,
		yieldSignal: exchange.pressure.signal
	};
	const assertCurrent = () => {
		if (task.done || slot.task !== task) throw owner.closedError();
	};
	if (task.options.onRequestSync) {
		try {
			assertCurrent();
			owner.accept(task.options.onRequestSync(value, context));
		} catch (error) {
			owner.reject(error);
		}
		return;
	}
	Promise.resolve().then(() => {
		assertCurrent();
		return task.options.onRequest(value, context);
	}).then(owner.accept).catch(owner.reject);
}
async function joinOwnedWorkerTasks(closures) {
	const errors = (await Promise.allSettled(closures)).flatMap((result) => result.status === "rejected" ? [result.reason] : []);
	if (errors.length === 1) throw errors[0];
	if (errors.length > 1) throw new AggregateError(errors, "Worker task cleanup failed");
}
function joinOwnedWorkerTask(task, settlement, retire = false) {
	return startJoinOwnedWorkerTask(task, settlement, retire).result;
}
function startJoinOwnedWorkerTask(task, settlement, retire = false) {
	const closing = startCloseOwnedWorkerTask(task, settlement, retire);
	const observe = () => {
		const outcome = closing.read();
		if (outcome.status === "pending") return outcome;
		if (outcome.status === "rejected" && task.owner?.closing === closing) task.owner.closing = void 0;
		if (task.owner?.closed) {
			const slot = task.slot;
			task.slot = void 0;
			settlement.release(task, slot);
		}
		return outcome;
	};
	const result = closing.result.then(() => {
		observe();
	}, (error) => {
		observe();
		throw error;
	});
	result.catch(() => void 0);
	return {
		result,
		read: observe,
		service() {
			closing.service();
			observe();
		}
	};
}
function closeOwnedWorkerTask(task, settlement, retire = false) {
	return startCloseOwnedWorkerTask(task, settlement, retire).result;
}
function startCloseOwnedWorkerTask(task, settlement, retire = false) {
	const owner = task.owner;
	if (!owner || owner.closed) {
		if (owner?.closing) return owner.closing;
		const complete = createRetainedOperation(() => {});
		complete.resolve();
		return complete.operation;
	}
	owner.retire ||= retire;
	if (owner.closing) return owner.closing;
	let retirement;
	let observedPreparation;
	let advancing = false;
	const closing = createRetainedOperation(() => {
		retirement?.service();
		advance();
	});
	const advance = () => {
		if (advancing || closing.operation.read().status !== "pending") return;
		advancing = true;
		try {
			if (task.preparation) {
				if (observedPreparation !== task.preparation.promise) {
					observedPreparation = task.preparation.promise;
					observedPreparation.then(advance, closing.reject);
				}
				return;
			}
			const slot = task.slot;
			if (slot && owner.retire) {
				if (!retirement) {
					retirement = settlement.retire(slot);
					retirement.result.then(advance, advance);
				}
				const outcome = retirement.read();
				if (outcome.status === "pending") return;
				if (outcome.status === "rejected") throw outcome.error;
			}
			settlement.detach(task);
			try {
				owner.complete?.();
			} finally {
				owner.closed = true;
				owner.complete = void 0;
				task.input = void 0;
				task.options = {};
				task.abort = () => {};
			}
			closing.resolve();
		} catch (error) {
			closing.reject(error);
		} finally {
			advancing = false;
		}
	};
	owner.closing = closing.operation;
	if (!task.done) settlement.cancel(task);
	advance();
	return closing.operation;
}
function retainWorkerTask(task, settlement, service) {
	return {
		result: task.promise,
		read: () => task.read(),
		service,
		release: (closeOptions) => {
			const closing = startJoinOwnedWorkerTask(task, settlement, closeOptions?.retire === true);
			return {
				result: closing.result,
				read: () => closing.read(),
				service: () => {
					service();
					closing.service();
				}
			};
		}
	};
}
function prepareWorkerTaskInput(task, receive, reject, prepareResources) {
	const taskInput = task.input;
	delete task.input;
	const preparation = Promise.withResolvers();
	task.preparation = preparation;
	const finishPreparation = () => {
		preparation.resolve();
		if (task.preparation === preparation) task.preparation = void 0;
	};
	const failed = (error) => {
		finishPreparation();
		reject(error);
	};
	let prepared;
	try {
		prepared = typeof taskInput === "function" ? taskInput() : taskInput;
	} catch (error) {
		failed(error);
		return;
	}
	if (prepareResources) prepared = Promise.resolve(prepared).then(async (input) => {
		await prepareResources();
		return input;
	});
	const ready = (input) => {
		finishPreparation();
		receive(input);
	};
	if (isPromiseLike(prepared)) Promise.resolve(prepared).then(ready, failed);
	else ready(prepared);
}
function expireWorkerTasks(queue, slots, expire) {
	const now = performance.now();
	const pending = [...queue, ...[...slots].flatMap((slot) => slot.task ? [slot.task] : [])];
	for (const task of pending) if (!task.done && task.deadline !== void 0 && now >= task.deadline) expire(task);
}
//#endregion
//#region packages/worker-runtime/src/worker-task-pool-completion.ts
const taskDiagnostics = channel("openclaw.worker.task");
function joinWorkerTaskPreparationCleanups(completion, artifactCleanup) {
	return joinOwnedWorkerTasks([...[...completion.preparationCleanups].map(([task, cleanup]) => cleanup.finally(() => {
		if (completion.preparationCleanups.delete(task)) completion.releaseAdmission(task);
	})), artifactCleanup.then(() => void 0)]);
}
function notifyExecutionSettled(task) {
	try {
		if (!task.executionNotified) {
			task.executionNotified = true;
			task.options.onExecutionSettled?.({ retired: task.slot?.retired === true });
		}
	} catch (error) {
		return toErrorObject(error, "worker settlement receipt failed");
	}
}
function createWorkerTaskCompletion(task, completion, error, value) {
	const preparation = task.owner ? void 0 : task.preparation;
	let settlementError;
	const complete = () => {
		if (!task.owner && !preparation) completion.releaseAdmission(task);
		return completeWorkerTask(task, completion, error, value, settlementError);
	};
	if (!preparation) return complete;
	const cleanup = Promise.withResolvers();
	completion.preparationCleanups.set(task, cleanup.promise);
	cleanup.promise.catch(() => void 0);
	return () => {
		settlementError = task.runInContext(() => notifyExecutionSettled(task));
		if (error) task.reject(error);
		preparation.promise.then(() => {
			const failure = complete();
			if (failure) throw failure;
			completion.preparationCleanups.delete(task);
			completion.releaseAdmission(task);
			cleanup.resolve();
		}).catch(cleanup.reject);
	};
}
function completeWorkerTask(task, completion, error, value, settlementError) {
	return task.runInContext(() => {
		let completionError = error ?? settlementError;
		const cleanupErrors = settlementError ? [settlementError] : [];
		try {
			if (!task.inputConsumed) {
				task.inputConsumed = true;
				task.options.onInputConsumed?.();
			}
			const release = task.exchange?.onConsumed;
			task.exchange = void 0;
			release?.();
		} catch (releaseError) {
			const cleanupError = toErrorObject(releaseError, "worker input release failed");
			cleanupErrors.push(cleanupError);
			completionError ??= cleanupError;
		}
		const receiptError = notifyExecutionSettled(task);
		if (receiptError) {
			cleanupErrors.push(receiptError);
			completionError ??= receiptError;
		}
		const permit = task.computePermit;
		task.computePermit = void 0;
		if (permit) completion.releaseCompute(permit);
		if (taskDiagnostics.hasSubscribers) {
			const now = performance.now();
			taskDiagnostics.publish({
				...completion.diagnostics(),
				outcome: completionError ? "failed" : "ok",
				queueMs: (task.startedAt ?? now) - task.enqueuedAt,
				preparationMs: task.startedAt === void 0 ? 0 : (task.preparedAt ?? now) - task.startedAt,
				runMs: task.preparedAt === void 0 ? 0 : now - task.preparedAt,
				transferMs: task.transferMs,
				hostWaitMs: task.hostWaitMs
			});
		}
		const firstCleanupError = cleanupErrors[0];
		const cleanupError = cleanupErrors.length > 1 ? new AggregateError(cleanupErrors, "Worker task cleanup failed", { cause: firstCleanupError }) : firstCleanupError;
		if (task.owner) {
			if (cleanupError) throw cleanupError;
		} else if (completionError) task.reject(completionError);
		else task.resolve(value);
		return cleanupError;
	});
}
//#endregion
//#region packages/worker-runtime/src/worker-task-pool-resources.ts
/** Each existing slot retains its cleanup receipt; no result Promise controls custody. */
function startCloseWorkerPoolResources(slots, resourceClosures, retire, key, options) {
	const operations = [...slots].map((slot) => {
		if (slot.retiring) return slot.retiring;
		if (slot.native?.executionStopped) return retire(slot);
		const worker = slot.worker;
		if (!worker) {
			const complete = createRetainedOperation(() => {});
			complete.resolve();
			return complete.operation;
		}
		const closure = resourceClosures.get(worker) ?? { pending: 0 };
		closure.pending++;
		resourceClosures.set(worker, closure);
		worker.ref();
		return startCloseWorkerTaskResources(slot, worker, closure, key, options, retire);
	});
	const completion = createRetainedOperation(() => {
		for (const operation of operations) operation.service();
		advance();
	});
	const advance = () => {
		const outcomes = operations.map((operation) => operation.read());
		if (outcomes.some((outcome) => outcome.status === "pending")) return;
		const errors = outcomes.flatMap((outcome) => outcome.status === "rejected" ? [outcome.error] : []);
		if (errors.length) completion.reject(new AggregateError(errors, "Worker resource cleanup failed"));
		else completion.resolve();
	};
	for (const operation of operations) operation.result.then(advance, advance);
	advance();
	return completion.operation;
}
/** Concurrent resource closes share one listener until their last real receipt. */
function observeResourceWorkerExit(worker, closures, finish) {
	let exit = closures.exit;
	if (!exit) {
		const waiters = /* @__PURE__ */ new Set();
		exit = {
			waiters,
			receive: () => {
				for (const waiter of waiters) waiter();
			}
		};
		closures.exit = exit;
		worker.once("exit", exit.receive);
	}
	exit.waiters.add(finish);
	return () => {
		exit.waiters.delete(finish);
		if (!exit.waiters.size) {
			worker.removeListener("exit", exit.receive);
			if (closures.exit === exit) closures.exit = void 0;
		}
	};
}
function startCloseWorkerTaskResources(slot, worker, closures, key, options, retire) {
	const { port1, port2 } = new MessageChannel();
	const runInContext = AsyncLocalStorage.snapshot();
	let settled = false;
	let awaitingRetirement = false;
	let selectedRetirement;
	const completion = createRetainedOperation(() => {
		if (settled) return;
		slot.native?.service();
		if (slot.native?.executionStopped) {
			awaitingRetirement = true;
			selectedRetirement ??= slot.retiring ?? retire(slot);
		}
		for (;;) {
			const next = receiveMessageOnPort(port1);
			if (!next || settled) break;
			receive(next.message);
		}
		const retirement = selectedRetirement ?? slot.retiring;
		if (awaitingRetirement && retirement) {
			retirement.service();
			const stopped = retirement.read();
			if (stopped.status === "fulfilled") finish();
			else if (stopped.status === "rejected") finish(toErrorObject(stopped.error, "Worker resource cleanup retirement failed"));
		}
	});
	const finish = (error) => runInContext(() => {
		if (settled) return;
		settled = true;
		stopObservingExit();
		port1.close();
		port2.close();
		closures.pending--;
		if (!closures.pending && !slot.task && !slot.retiring) worker.unref();
		if (error) completion.reject(error);
		else completion.resolve();
	});
	const receive = (reply) => {
		try {
			if (isRecord(reply) && reply.ok === true) {
				finish();
				return;
			}
			const error = isRecord(reply) && reply.detail !== void 0 && options?.decodeResourceError ? options.decodeResourceError(reply.detail) : new Error(isRecord(reply) && typeof reply.error === "string" ? reply.error : "Invalid worker resource cleanup receipt");
			finish(error);
		} catch (error) {
			finish(toErrorObject(error, "Worker resource cleanup receipt could not be decoded"));
		}
	};
	const stopObservingExit = observeResourceWorkerExit(worker, closures, () => finish());
	port1.once("message", receive);
	port1.once("messageerror", (error) => finish(toErrorObject(error, "Worker resource cleanup receipt could not be decoded")));
	port1.once("close", () => {
		if (settled) return;
		const retirement = slot.retiring;
		if (!retirement) {
			finish(/* @__PURE__ */ new Error("Worker resource cleanup closed without a receipt"));
			return;
		}
		awaitingRetirement = true;
		selectedRetirement = retirement;
		retirement.result.then(() => finish(), (error) => finish(toErrorObject(error, "Worker resource cleanup retirement failed")));
	});
	try {
		worker.postMessage({
			closeResource: true,
			key,
			resourcePort: port2
		}, [port2]);
	} catch (error) {
		finish(toErrorObject(error, "Worker resource cleanup could not be sent"));
	}
	return completion.operation;
}
//#endregion
//#region packages/worker-runtime/src/worker-task-pool-retirement.ts
const WORKER_WARM_WINDOW_MS = 3e5;
function createWorkerTaskPoolRetirement({ slots, options, runInContext, dispatch, serviceDeadlines, markWorkerRetirement }) {
	const artifactCleanups = /* @__PURE__ */ new Map();
	let lastIdleRetirementAt = -Infinity;
	let warmSlot;
	let rotation;
	let rotationFailed = false;
	const setTimeoutFn = setTimeout;
	const clearTimeoutFn = clearTimeout;
	const now = performance.now.bind(performance);
	const clearIdle = (slot) => clearTimeoutFn(slot.idleTimer);
	function startRotate() {
		if (rotation) return rotation;
		const runRotation = AsyncLocalStorage.snapshot();
		let retirements;
		let artifacts;
		let advancing = false;
		const completion = createRetainedOperation(() => {
			for (const slot of rotationSlots) slot.native?.service();
			serviceDeadlines();
			for (const retiring of retirements ?? []) retiring.service();
			artifacts?.service();
			advance();
		});
		rotation = completion.operation;
		rotationFailed = false;
		const rotationSlots = [...slots];
		const tasks = rotationSlots.flatMap((slot) => slot.task ? [slot.task] : []);
		const advance = () => runRotation(() => {
			if (advancing || completion.operation.read().status !== "pending") return;
			advancing = true;
			try {
				if (tasks.some((task) => task.read().status === "pending")) return;
				if (!retirements) {
					retirements = rotationSlots.map((slot) => startRetire(slot, "rotation"));
					for (const retiring of retirements) retiring.result.then(advance, advance);
				}
				for (const retiring of retirements) {
					const stopped = retiring.read();
					if (stopped.status === "rejected") throw stopped.error;
					if (stopped.status === "pending") return;
				}
				if (!artifacts) {
					artifacts = startJoinArtifacts();
					artifacts.result.then(advance, advance);
				}
				const cleaned = artifacts.read();
				if (cleaned.status === "pending") return;
				if (cleaned.status === "rejected") throw cleaned.error;
				rotation = void 0;
				completion.resolve();
				dispatch();
			} catch (error) {
				rotation = void 0;
				rotationFailed = true;
				completion.reject(error);
			} finally {
				advancing = false;
			}
		});
		for (const task of tasks) task.promise.then(advance, advance);
		advance();
		return completion.operation;
	}
	function startRetire(slot, reason = "closed") {
		if (reason === "idle_timeout") lastIdleRetirementAt = now();
		else if (reason === "rotation") lastIdleRetirementAt = -Infinity;
		if (warmSlot === slot) warmSlot = void 0;
		if (slot.worker) markWorkerRetirement(slot.worker, reason);
		clearIdle(slot);
		cancelWorkerNativeSections(slot.nativeSections);
		if (slot.retiring) return slot.retiring;
		const runRetirement = AsyncLocalStorage.snapshot();
		let nativeStop;
		let observingSection = false;
		let advancing = false;
		const completion = createRetainedOperation(() => {
			nativeStop?.service();
			advance();
		});
		const advance = () => runRetirement(() => {
			if (advancing || completion.operation.read().status !== "pending") return;
			advancing = true;
			try {
				if (slot.creating) return;
				if (!areWorkerNativeSectionsSettled(slot.nativeSections)) {
					if (!observingSection) {
						observingSection = true;
						Promise.resolve(waitForWorkerNativeSections(slot.nativeSections)).then(advance, completion.reject);
					}
					return;
				}
				if (slot.worker && !nativeStop) {
					markWorkerRetirement(slot.worker, reason);
					if (slot.native) nativeStop = slot.native.stop();
					else {
						const stopped = createRetainedOperation(() => {});
						nativeStop = stopped.operation;
						Promise.resolve().then(() => slot.worker.terminate()).then(() => stopped.resolve(), stopped.reject);
					}
					nativeStop.result.then(advance, advance);
				}
				const stopped = nativeStop?.read();
				if (stopped?.status === "pending") return;
				if (stopped?.status === "rejected") throw stopped.error;
				slot.retired = true;
				const releaseResources = slot.releaseResources;
				if (releaseResources) runInContext(() => {
					const cleanup = (async () => {
						try {
							await releaseResources();
						} catch (error) {
							try {
								process.emitWarning(`Worker task resource release failed: ${String(error)}`);
							} catch {}
						}
					})();
					const settled = createRetainedOperation(() => {});
					artifactCleanups.set(cleanup, settled.operation);
					cleanup.then(() => {
						artifactCleanups.delete(cleanup);
						settled.resolve();
					}, settled.reject);
				});
				slot.worker?.removeAllListeners();
				slots.delete(slot);
				for (const complete of slot.completions ?? []) complete();
				slot.completions = void 0;
				dispatch();
				completion.resolve();
			} catch (error) {
				try {
					Promise.resolve(options.onRetirementFailure?.(error)).catch(() => void 0);
				} catch {}
				slot.retirementFailed = true;
				slot.retiring = void 0;
				completion.reject(error);
			} finally {
				advancing = false;
			}
		});
		slot.retiring = completion.operation;
		Promise.resolve().then(advance);
		return completion.operation;
	}
	function retire(slot, reason) {
		return startRetire(slot, reason).result;
	}
	function startJoinArtifacts() {
		const pending = [...artifactCleanups.values()];
		const joined = createRetainedOperation(() => {
			for (const operation of pending) operation.service();
			advance();
		});
		const advance = () => {
			const outcomes = pending.map((operation) => operation.read());
			const failure = outcomes.find((outcome) => outcome.status === "rejected");
			if (failure?.status === "rejected") joined.reject(failure.error);
			else if (outcomes.every((outcome) => outcome.status === "fulfilled")) joined.resolve();
		};
		for (const operation of pending) operation.result.then(advance, advance);
		advance();
		return joined.operation;
	}
	/** Join failed native retirements without interrupting healthy tasks. */
	async function retryFailedRetirements() {
		const outcomes = await Promise.allSettled([...slots].filter((slot) => slot.retirementFailed).map((slot) => retire(slot)));
		outcomes.push(...await Promise.allSettled(artifactCleanups.keys()));
		const errors = outcomes.flatMap((outcome) => outcome.status === "rejected" ? [toErrorObject(outcome.reason, "worker retirement retry failed")] : []);
		const firstError = errors[0];
		if (firstError) throw errors.length === 1 ? firstError : new AggregateError(errors, "Worker retirement retries failed", { cause: firstError });
	}
	return {
		get dispatchAllowed() {
			return rotation === void 0 && !rotationFailed;
		},
		startRotate,
		retire,
		startRetire,
		service() {
			const current = [...slots];
			for (const slot of current) slot.retiring?.service();
			rotation?.service();
		},
		clearIdle,
		idle(slot) {
			const idleMs = options.idleTimeoutMs ?? 6e4;
			if (idleMs <= 0) return;
			if (!warmSlot && now() - lastIdleRetirementAt < WORKER_WARM_WINDOW_MS) warmSlot = slot;
			slot.idleTimer = runInContext(() => setTimeoutFn(() => void retire(slot, "idle_timeout").catch(() => void 0), warmSlot === slot ? Math.max(idleMs, WORKER_WARM_WINDOW_MS) : idleMs));
			slot.idleTimer.unref();
		},
		retireIdle(resourceClosures) {
			for (const slot of slots) if (!slot.task && !slot.retiring && !slot.retirementFailed && slot.worker && !resourceClosures.get(slot.worker)?.pending) retire(slot, "memory_pressure").catch(() => void 0);
		},
		retryFailedRetirements,
		joinArtifacts: () => startJoinArtifacts().result
	};
}
//#endregion
//#region packages/worker-runtime/src/worker-task-pool-worker.ts
function postWorkerTaskInput(worker, slot, task, input, transferList, taskContext) {
	const transferStartedAt = performance.now();
	worker.postMessage({
		input,
		taskId: task.id,
		interactive: Boolean(task.options.onRequest || task.options.onRequestSync || task.options.onNotification),
		nativeSections: slot.nativeSections.buffer,
		taskContext,
		sampleMemory: true
	}, transferList);
	task.transferMs += performance.now() - transferStartedAt;
}
/** Physical construction and listeners share the pool's detached creation scope. */
function createWorkerTaskPoolWorker(params) {
	const { slot, options } = params;
	const worker = params.runInContext(() => {
		const prepared = options.prepareWorker?.();
		slot.releaseResources = prepared?.releaseResources;
		const temporaryDirectory = prepared?.temporaryDirectory;
		if (temporaryDirectory) {
			const cleanup = params.host.prepareResources();
			const releaseResources = slot.releaseResources;
			slot.releaseResources = async () => {
				try {
					await cleanup;
					await params.host.releaseTemporaryDirectory(temporaryDirectory);
				} finally {
					await releaseResources?.();
				}
			};
		}
		const workerUrl = options.workerUrl;
		const workerOptions = {
			...options.workerOptions,
			...prepared?.options
		};
		if (slot.retiring) throw params.unavailableError("worker creation closed during preparation");
		const created = params.host.createWorker(workerUrl, workerOptions);
		slot.native = created.native;
		return created.worker;
	});
	let counted = false;
	const started = () => {
		if (counted) return;
		counted = true;
		params.onStarted(worker);
	};
	if (slot.native) {
		slot.native.on("started", started);
		slot.native.on("execution-exit", (code) => {
			releaseWorkerNativeSectionsOnExit(slot.nativeSections);
			if (!slot.retiring) params.onFailure(params.unavailableError(`worker exited with code ${code}`));
		});
	} else started();
	slot.worker = worker;
	worker.on("message", (message) => {
		if (params.host.receiveMessage(worker, message)) return;
		const task = slot.task;
		if (task) task.runInContext(() => params.onMessage(message));
		else params.onMessage(message);
	});
	worker.on("error", (error) => params.onFailure(params.unavailableError(String(error))));
	worker.on("messageerror", (error) => params.onFailure(params.unavailableError(String(error))));
	worker.once("exit", (code) => {
		releaseWorkerNativeSectionsOnExit(slot.nativeSections);
		const wasCounted = counted;
		counted = false;
		params.onExit(code, wasCounted);
	});
	return worker;
}
//#endregion
//#region packages/worker-runtime/src/worker-task-pool-core.ts
const runInWorkerPoolContext = AsyncLocalStorage.snapshot();
/** Bounded execution workers; each worker accepts one task at a time. */
var WorkerTaskPoolCore = class {
	constructor(options, host, publicDispatch, ownerOptions = {}) {
		this.options = options;
		this.host = host;
		this.publicDispatch = publicDispatch;
		this.ownerOptions = ownerOptions;
		this.slots = /* @__PURE__ */ new Set();
		this.ownedTasks = /* @__PURE__ */ new Set();
		this.resourceClosures = /* @__PURE__ */ new WeakMap();
		this.ownedSettlement = {
			cancel: (task) => this.cancel(task, new WorkerTaskError("worker task closed", "unavailable")),
			detach: (task) => {
				if (task.slot?.task === task) {
					task.slot.task = void 0;
					this.activeTasks--;
				}
			},
			retire: (slot) => this.retirement.startRetire(slot),
			release: (task, slot) => {
				if (!this.ownedTasks.delete(task)) return;
				this.releaseAdmission(task);
				task.runInContext = runInWorkerPoolContext;
				this.dispatch();
				if (slot && !task.owner?.retire && !slot.task && !slot.retiring) this.idle(slot);
			}
		};
		this.completion = {
			preparationCleanups: /* @__PURE__ */ new Map(),
			releaseAdmission: (task) => this.releaseAdmission(task),
			releaseCompute: (permit) => this.computeCapacity.release(permit),
			diagnostics: () => ({
				worker: this.options.workerUrl.pathname.split("/").at(-1),
				...this.publicDispatch?.getSnapshot() ?? this.getSnapshot(),
				pendingBytes: this.pendingBytes
			})
		};
		this.queue = [];
		this.pendingTasks = 0;
		this.pendingBytes = 0;
		this.workers = 0;
		this.workersCreated = 0;
		this.activeTasks = 0;
		this.resumeCompute = () => this.dispatch();
		this.nextTaskId = 0;
		this.retireIdleOnPressure = () => this.retirement.retireIdle(this.resourceClosures);
		this.expireTasks = () => expireWorkerTasks(this.queue, this.slots, (task) => this.timeout(task));
		this.retryFailedRetirements = () => this.retirement.retryFailedRetirements();
		this.maxWorkers = options.maxWorkers ?? availableParallelism();
		this.maxPendingTasks = options.maxPendingTasks ?? 128;
		this.maxPendingBytes = options.maxPendingBytes ?? 268435456;
		for (const [name, value] of Object.entries({
			maxWorkers: this.maxWorkers,
			maxPendingTasks: this.maxPendingTasks,
			maxPendingBytes: this.maxPendingBytes
		})) if (!Number.isSafeInteger(value) || value < 1) throw new RangeError(`${name} must be a positive safe integer`);
		this.computeCapacity = options.sharedCompute ? host.computeCapacity : void 0;
		this.retirement = createWorkerTaskPoolRetirement({
			slots: this.slots,
			options,
			runInContext: runInWorkerPoolContext,
			dispatch: () => this.dispatch(),
			serviceDeadlines: this.expireTasks,
			markWorkerRetirement: (worker, reason) => host.workerRetiring(worker, reason)
		});
		host.pools.register(this);
	}
	run(input, options) {
		if (this.closedError) return Promise.reject(this.closedError);
		const inputBytes = options.inputBytes ?? 0;
		if (!Number.isSafeInteger(inputBytes) || inputBytes < 0) return Promise.reject(/* @__PURE__ */ new RangeError("inputBytes must be a nonnegative safe integer"));
		return this.enqueue(input, options, false, inputBytes).promise;
	}
	runTask(input, options) {
		const task = this.enqueue(input, options, true);
		return {
			result: task.promise,
			close: (closeOptions) => joinOwnedWorkerTask(task, this.ownedSettlement, closeOptions?.retire === true)
		};
	}
	startTask(input, options) {
		if (!this.ownerOptions.retainedTransport) throw new WorkerTaskError("Retained tasks require their native lifetime transport", "unavailable");
		return retainWorkerTask(this.enqueue(input, options, true), this.ownedSettlement, () => this.service());
	}
	service() {
		const slots = [...this.slots];
		for (const slot of slots) slot.native?.service();
		this.expireTasks();
		this.retirement.service();
		const tasks = [...this.ownedTasks];
		for (const task of tasks) task.owner?.closing?.service();
		this.dispatch();
	}
	enqueue(input, options, owned = false, inputBytes = options.inputBytes ?? 0) {
		const completion = createRetainedOperation(() => this.service(), { observeRejection: this.ownerOptions.retainedTransport === true });
		const task = {
			promise: completion.operation.result,
			resolve: completion.resolve,
			reject: completion.reject,
			read: () => completion.operation.read(),
			id: ++this.nextTaskId,
			runInContext: AsyncLocalStorage.snapshot(),
			controller: new AbortController(),
			inputConsumed: false,
			executionNotified: false,
			exchangeSequence: 0,
			input,
			options: { ...options },
			abort: () => this.cancel(task, toErrorObject(options.signal?.reason, "worker task aborted")),
			done: false,
			admitted: false,
			...owned ? { owner: {
				closed: false,
				retire: false
			} } : {},
			inputBytes,
			enqueuedAt: performance.now(),
			transferMs: 0,
			hostWaitMs: 0
		};
		if (owned) this.ownedTasks.add(task);
		if (this.closedError || !Number.isSafeInteger(inputBytes) || inputBytes < 0) {
			this.finish(task, this.closedError ?? /* @__PURE__ */ new RangeError("inputBytes must be a nonnegative safe integer"));
			return task;
		}
		if (this.pendingTasks >= this.maxPendingTasks || this.pendingBytes + inputBytes > this.maxPendingBytes || this.computeCapacity && !this.computeCapacity.admit(inputBytes)) {
			this.finish(task, new WorkerTaskError("worker task capacity reached", "overloaded"));
			return task;
		}
		task.admitted = true;
		this.pendingTasks++;
		this.pendingBytes += inputBytes;
		if (options.timeoutMs !== void 0) this.armTimeout(task, options.timeoutMs);
		options.signal?.addEventListener("abort", task.abort, { once: true });
		this.queue.push(task);
		if (options.signal?.aborted) task.abort();
		else this.dispatch();
		return task;
	}
	get isClosed() {
		return this.closedError !== void 0;
	}
	getSnapshot() {
		return {
			maxWorkers: this.maxWorkers,
			workers: this.workers,
			workersCreated: this.workersCreated,
			activeTasks: this.activeTasks,
			pendingTasks: this.pendingTasks
		};
	}
	startCloseResources(key) {
		return startCloseWorkerPoolResources(this.slots, this.resourceClosures, (slot) => this.ownedSettlement.retire(slot), key, this.ownerOptions);
	}
	/** Pause dispatch, settle current work and join native exit before restarting the queue. */
	rotate() {
		return this.startRotate().result;
	}
	startRotate() {
		this.computeCapacity?.remove(this.resumeCompute);
		return this.retirement.startRotate();
	}
	close(error = new WorkerTaskError("worker task pool closed", "unavailable")) {
		this.closedError ??= error;
		channel("openclaw.memory.critical").unsubscribe(this.retireIdleOnPressure);
		this.computeCapacity?.remove(this.resumeCompute);
		for (const task of this.queue.splice(0)) this.finish(task, this.closedError);
		for (const slot of this.slots) {
			if (slot.worker) this.host.workerRetiring(slot.worker, "closed");
			if (slot.task && !slot.task.owner) this.finish(slot.task, this.closedError, void 0, true);
		}
		const tasks = [...this.ownedTasks];
		const ownedSlots = new Set(tasks.flatMap((task) => task.slot?.task === task ? [task.slot] : []));
		const owned = tasks.map((task) => joinOwnedWorkerTask(task, this.ownedSettlement, true));
		const unowned = [...this.slots].filter((slot) => !ownedSlots.has(slot));
		const closures = [...owned, ...unowned.map((slot) => this.retirement.retire(slot))];
		return this.host.pools.close(this, closures, () => joinWorkerTaskPreparationCleanups(this.completion, this.retirement.joinArtifacts()));
	}
	dispatch() {
		if (!this.slots.size) channel("openclaw.memory.critical").unsubscribe(this.retireIdleOnPressure);
		if (!this.queue.length || this.closedError || !this.retirement.dispatchAllowed) this.computeCapacity?.remove(this.resumeCompute);
		while (!this.closedError && this.retirement.dispatchAllowed && this.queue.length) {
			let slot = [...this.slots].find((entry) => !entry.task && !entry.retiring && !entry.retirementFailed);
			if (!slot) {
				if (this.slots.size >= this.maxWorkers) {
					let contenders = this.queue.length;
					for (const occupied of this.slots) if (occupied.task?.exchange && !occupied.task.exchange.sent && !occupied.task.exchange.pressure.signal.aborted && contenders-- > 0) occupied.task.exchange.pressure.abort();
					return;
				}
			}
			const nextTask = this.queue[0];
			if (this.computeCapacity) {
				const permit = this.computeCapacity.acquire(this.resumeCompute, () => {
					if (nextTask.exchange && !nextTask.exchange.sent && !nextTask.exchange.pressure.signal.aborted) {
						nextTask.runInContext(() => nextTask.exchange?.pressure.abort());
						return true;
					}
					return false;
				});
				if (!permit) return;
				nextTask.computePermit = permit;
			}
			if (!slot) {
				slot = { nativeSections: createWorkerNativeSectionState() };
				this.slots.add(slot);
			}
			this.retirement.clearIdle(slot);
			const task = this.queue.shift();
			slot.task = task;
			this.activeTasks++;
			task.slot = slot;
			task.startedAt = performance.now();
			task.runInContext(() => {
				try {
					slot.worker?.ref();
				} catch (error) {
					this.fail(slot, toErrorObject(error, "worker reference failed"));
					return;
				}
				prepareWorkerTaskInput(task, (input) => this.sendInput(slot, task, input), (error) => this.finish(task, toErrorObject(error, "worker task preparation failed")), !slot.worker && this.options.prepareWorker ? () => runInWorkerPoolContext(() => this.host.prepareResources()) : void 0);
			});
		}
	}
	createWorker(slot) {
		if ((this.options.idleTimeoutMs ?? 6e4) > 0) {
			const pressure = channel("openclaw.memory.critical");
			pressure.unsubscribe(this.retireIdleOnPressure);
			pressure.subscribe(this.retireIdleOnPressure);
		}
		return createWorkerTaskPoolWorker({
			slot,
			options: this.options,
			host: this.host,
			runInContext: runInWorkerPoolContext,
			unavailableError: (message) => new WorkerTaskError(message, "unavailable"),
			onStarted: (worker) => {
				this.workers++;
				this.workersCreated++;
				this.host.workerStarted(worker, this);
			},
			onMessage: (message) => this.receive(slot, message),
			onFailure: (error) => this.fail(slot, error),
			onExit: (code, counted) => {
				if (counted) this.workers--;
				this.fail(slot, new WorkerTaskError(`worker exited with code ${code}`, "unavailable"));
			}
		});
	}
	sendInput(slot, task, input) {
		if (task.done) return;
		task.preparedAt = performance.now();
		try {
			let worker = slot.worker;
			if (!worker) {
				slot.creating = true;
				try {
					worker = this.createWorker(slot);
				} finally {
					slot.creating = false;
				}
			}
			const transferList = task.options.transferList?.(input);
			if (!task.done) postWorkerTaskInput(worker, slot, task, input, transferList, this.host.captureTaskContext());
		} catch (error) {
			this.fail(slot, new WorkerTaskError(String(error), "unavailable"));
		}
	}
	receive(slot, message) {
		if (slot.retiring) return;
		const task = slot.task;
		if (task && isRecord(message) && (message.status === "request" || message.status === "consumed" || message.status === "notification")) {
			try {
				this.receiveExchange(slot, task, message);
			} catch (error) {
				this.fail(slot, toErrorObject(error, "worker consumption callback failed"));
			}
			return;
		}
		if (!task || !isRecord(message) || (task.options.onRequest || task.options.onRequestSync || message.taskId !== void 0) && message.taskId !== task.id || message.status !== "ok" && message.status !== "failed") {
			this.fail(slot, new WorkerTaskError("invalid worker task response", "unavailable"));
			return;
		}
		const reply = message;
		const retainInput = Boolean(task.exchange || task.options.onInputConsumed && !task.inputConsumed);
		if (reply.status === "failed") {
			this.finish(task, new WorkerTaskError(reply.error, "failed"), void 0, retainInput);
			return;
		}
		try {
			this.options.validateResult?.(reply.value);
		} catch (error) {
			this.fail(slot, toErrorObject(error, "worker result validation failed"));
			return;
		}
		this.finish(task, void 0, reply.value, retainInput);
	}
	armTimeout(task, timeoutMs) {
		clearTimeout(task.timer);
		const deadline = performance.now() + resolveTimerTimeoutMs(timeoutMs, 6e4);
		task.deadline = Math.min(task.deadline ?? deadline, deadline);
		const timeout = Math.max(0, task.deadline - performance.now());
		task.timer = setTimeout(() => this.timeout(task), timeout);
	}
	receiveExchange(slot, task, message) {
		if (message.taskId !== task.id) {
			this.fail(slot, new WorkerTaskError("stale worker exchange", "unavailable"));
			return;
		}
		if (message.status === "notification") {
			task.options.onNotification?.(message.value);
			return;
		}
		if (message.status === "consumed") {
			if (message.id === 0 && !task.inputConsumed) {
				task.inputConsumed = true;
				const release = task.options.onInputConsumed;
				task.options.onInputConsumed = void 0;
				release?.();
			} else if (task.exchange?.sent && message.id === task.exchange.id) {
				const release = task.exchange.onConsumed;
				task.exchange = void 0;
				release?.();
			} else this.fail(slot, new WorkerTaskError("invalid worker consumption receipt", "unavailable"));
			return;
		}
		if (!task.options.onRequest && !task.options.onRequestSync || task.exchange || !Number.isSafeInteger(message.id) || message.id !== task.exchangeSequence + 1) {
			this.fail(slot, new WorkerTaskError("invalid worker exchange", "unavailable"));
			return;
		}
		if (task.options.hostTimeout === "owner") {
			clearTimeout(task.timer);
			task.deadline = void 0;
		}
		const exchange = createWorkerHostExchange(task, message.value);
		task.hostWaitStartedAt = performance.now();
		this.dispatch();
		this.computeCapacity?.requestCheckpoints();
		const accept = (response) => {
			if (!task.done && task.deadline !== void 0 && performance.now() >= task.deadline) this.timeout(task);
			if (task.done || slot.task !== task || slot.retiring) {
				const release = () => {
					try {
						task.runInContext(() => response.onConsumed?.());
					} catch {}
				};
				if (this.slots.has(slot)) (slot.completions ??= []).push(release);
				else release();
				return;
			}
			this.finishHostWait(task);
			exchange.onConsumed = response.onConsumed;
			exchange.sent = true;
			this.armTimeout(task, response.timeoutMs);
			try {
				slot.worker.postMessage({
					taskId: task.id,
					responseId: exchange.id,
					input: response.input
				}, response.transferList);
			} catch (error) {
				this.fail(slot, toErrorObject(error, "worker response delivery failed"));
			}
		};
		const reject = (error) => {
			if (!task.done && slot.task === task) this.fail(slot, toErrorObject(error, "worker host exchange failed"));
		};
		dispatchOwnedWorkerRequest(task, slot, message.value, exchange, {
			accept,
			reject,
			closedError: () => new WorkerTaskError("worker task closed before host dispatch", "unavailable")
		});
	}
	timeout(task) {
		if (task.done) return;
		this.cancel(task, workerTaskTimeoutError(task.exchange, this.options.workerUrl));
	}
	cancel(task, error) {
		if (task.done) return;
		if (task.slot) {
			if (task.slot.worker) this.host.workerRetiring(task.slot.worker, "cancelled");
			if (task.owner) this.finish(task, error, void 0, true);
			else this.fail(task.slot, error);
		} else {
			this.queue.splice(this.queue.indexOf(task), 1);
			this.finish(task, error);
		}
	}
	fail(slot, error) {
		if (slot.retiring) return;
		if (slot.worker) this.host.workerRetiring(slot.worker, "failure");
		if (slot.task?.owner) {
			if (slot.task.done) {
				if (!slot.task.owner.retire) closeOwnedWorkerTask(slot.task, this.ownedSettlement, true).catch(() => void 0);
			} else this.finish(slot.task, error, void 0, true);
		} else if (this.options.restartOnError === false) (this.publicDispatch?.close(error) ?? this.close(error)).catch(() => void 0);
		else if (slot.task) this.finish(slot.task, error, void 0, true);
		else this.retirement.retire(slot).catch(() => void 0);
	}
	finishHostWait(task) {
		const startedAt = task.hostWaitStartedAt;
		if (startedAt !== void 0) {
			task.hostWaitStartedAt = void 0;
			task.hostWaitMs += performance.now() - startedAt;
		}
	}
	finish(task, error, value, retire = false) {
		if (task.done) return;
		this.finishHostWait(task);
		task.done = true;
		task.runInContext(() => task.controller.abort(error));
		clearTimeout(task.timer);
		task.deadline = void 0;
		task.options.signal?.removeEventListener("abort", task.abort);
		const complete = createWorkerTaskCompletion(task, this.completion, error, value);
		if (task.owner) {
			task.owner.complete = complete;
			task.owner.retire ||= retire || Boolean(error && task.slot && task.preparedAt !== void 0);
			if (error) task.reject(error);
			else task.resolve(value);
			if (error || retire) closeOwnedWorkerTask(task, this.ownedSettlement).catch(() => void 0);
			return;
		}
		const slot = task.slot;
		if (slot) {
			slot.task = void 0;
			this.activeTasks--;
			if (retire) {
				(slot.completions ??= []).push(complete);
				this.retirement.retire(slot, "failure").catch((failure) => {
					task.reject(error ? new AggregateError([error, failure], `Worker retirement failed: ${toErrorObject(failure, "worker retirement failed").message}; task failed: ${error.message}`, { cause: failure }) : failure);
				});
				return;
			}
		}
		complete();
		this.dispatch();
		if (slot && !slot.task && !slot.retiring) this.idle(slot);
	}
	releaseAdmission(task) {
		if (task.admitted) {
			task.admitted = false;
			this.pendingTasks--;
			this.pendingBytes -= task.inputBytes;
			this.computeCapacity?.finish(task.inputBytes);
		}
	}
	idle(slot) {
		if (slot.worker && !this.resourceClosures.get(slot.worker)?.pending) slot.worker.unref();
		this.retirement.idle(slot);
	}
};
//#endregion
//#region src/infra/worker-task-capacity.ts
/** All runtime chunks share the same host-owned computation budget. */
function getWorkerComputeCapacity() {
	return resolveGlobalSingleton(Symbol.for("openclaw.workerComputeCapacity"), () => createWorkerComputeCapacity(Math.max(1, availableParallelism() - 1)));
}
//#endregion
//#region src/infra/worker-task-pool-registry.ts
const livePools = resolveGlobalSingleton(Symbol.for("openclaw.workerTaskPools"), () => /* @__PURE__ */ new Set());
const liveWorkerTaskPools = {
	register(pool) {
		livePools.add(pool);
		return pool;
	},
	async close(pool, closures, finish) {
		await joinOwnedWorkerTasks(closures);
		await finish();
		livePools.delete(pool);
	}
};
//#endregion
//#region src/infra/worker-task-host.ts
const prepareResources = createLazyRuntimeModule(() => import("./temp-artifact-cleanup-CdeYA2ua.mjs"));
function createWorkerTaskHost(owner = {}) {
	const source = owner.retainedTransport ? owner.nativeSource ?? captureRetainedNativeWorkerSource({ runtimeGeneration: void 0 }) : void 0;
	return {
		createWorker(url, options) {
			const workerOptions = {
				execArgv: resolveRuntimeWorkerThreadExecArgv(url),
				...options
			};
			if (owner.retainedTransport) {
				const native = createRetainedNativeWorker(url, workerOptions, source, owner.nativeResource);
				return {
					worker: native,
					native
				};
			}
			return { worker: createCpuTrackedWorker(url, workerOptions) };
		},
		prepareResources,
		async releaseTemporaryDirectory(directory) {
			const { removeTemporaryArtifacts } = await prepareResources();
			await removeTemporaryArtifacts(directory, "Worker task");
		},
		captureTaskContext: captureDeletedAgentDatabaseFences,
		receiveMessage: receiveWorkerMemoryPort,
		workerStarted: attributeWorkerToPool,
		workerRetiring: markWorkerRetirement,
		computeCapacity: getWorkerComputeCapacity(),
		pools: liveWorkerTaskPools
	};
}
//#endregion
//#region src/infra/worker-task-pool.ts
/** Existing SDK surface; task custody remains an internal capability. */
var WorkerTaskPool = class {
	constructor(options) {
		this.core = new WorkerTaskPoolCore(options, createWorkerTaskHost(), {
			close: (error) => this.close(error),
			getSnapshot: () => this.getSnapshot()
		});
	}
	run(input, options) {
		return this.core.run(input, options);
	}
	get isClosed() {
		return this.core.isClosed;
	}
	getSnapshot() {
		return this.core.getSnapshot();
	}
	retryFailedRetirements() {
		return this.core.retryFailedRetirements();
	}
	rotate() {
		return this.core.rotate();
	}
	close(error) {
		return this.core.close(error);
	}
};
/** Internal resource owners can retain task custody or use settled ordinary reads. */
function createOwnedWorkerTaskPool(options, ownerOptions) {
	const core = new WorkerTaskPoolCore(options, createWorkerTaskHost(ownerOptions), void 0, ownerOptions);
	return {
		run: (input, taskOptions) => core.run(input, taskOptions),
		rotate: () => core.rotate(),
		runTask: (input, taskOptions) => core.runTask(input, taskOptions),
		startTask: (input, taskOptions) => core.startTask(input, taskOptions),
		closeResources: (key) => core.startCloseResources(key).result,
		startCloseResources: (key) => core.startCloseResources(key),
		startRotate: () => core.startRotate(),
		getSnapshot: () => core.getSnapshot(),
		close: (error) => core.close(error)
	};
}
//#endregion
export { captureRetainedNativeWorkerSource as a, DEFAULT_WORKER_PENDING_BYTES as i, createOwnedWorkerTaskPool as n, WorkerTaskError as r, WorkerTaskPool as t };
