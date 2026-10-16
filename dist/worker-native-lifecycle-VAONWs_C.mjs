import { u as toErrorObject } from "./error-coercion-CvJK4lmH.mjs";
import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { a as resolveGlobalSingleton } from "./global-singleton-0m-JziJW.mjs";
import { a as runInDetachedAsyncContext } from "./async-work-scope-BYeX3gh6.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { r as resolveRuntimeWorkerThreadExecArgv } from "./runtime-worker-url-DoBSDhBS.mjs";
import { n as captureSqliteWorkerEnvironmentData } from "./bun-sqlite-library-CBSPJxTD.mjs";
import { t as createRetainedOperation } from "./retained-operation-CODoIe4t.mjs";
import { t as captureRuntimeWorkerSource } from "./runtime-worker-generation-DCJaEqeS.mjs";
import { l as trackNativeWorkerForCpu, n as createCpuTrackedWorker, s as receiveWorkerMemoryPort } from "./worker-cpu-DU6Cf6Aq.mjs";
import { n as createSpawnBrokerHost } from "./host-Dqu6qHYf.mjs";
import { r as decodeNativeWorkerFailure, t as BrokerNativeResourceCloseError } from "./resource-protocol-DwwJYD9n.mjs";
import { n as resolveRuntimeProcessEntrypointUrl } from "./runtime-process-url-D3H3_asn.mjs";
import { AsyncLocalStorage } from "node:async_hooks";
import { MessageChannel, SHARE_ENV, receiveMessageOnPort } from "node:worker_threads";
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
//#endregion
export { closeDefaultRetainedNativeWorkerSource as n, createRetainedNativeWorker as r, captureRetainedNativeWorkerSource as t };
