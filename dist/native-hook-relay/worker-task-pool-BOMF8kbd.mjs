import { o as toErrorObject } from "./errors-Cy4ii9Fo.mjs";
import { i as resolveRuntimeWorkerThreadExecArgv, t as createCpuTrackedWorker } from "./worker-cpu-BlFNjOLd.mjs";
import { A as resolveTimerTimeoutMs, P as isRecord } from "./utils-C25eiuh1.mjs";
import { d as resolveGlobalSingleton } from "./redact-0yyk4gHy.mjs";
import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { t as runBestEffortCleanup } from "./non-fatal-cleanup-BoCq8AND.mjs";
import { availableParallelism } from "node:os";
import { AsyncLocalStorage } from "node:async_hooks";
import { channel } from "node:diagnostics_channel";
import { MessageChannel } from "node:worker_threads";
/** Shared compute admission; database and generation workers keep their own ordering. */
function getWorkerComputeCapacity() {
	return resolveGlobalSingleton(Symbol.for("openclaw.workerComputeCapacity"), () => {
		const limit = Math.max(1, availableParallelism() - 1);
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
	});
}
//#endregion
//#region src/infra/worker-task-native-sections.ts
const CANCELLED = 1;
const SECTION = 2;
resolveGlobalSingleton(Symbol.for("openclaw.workerTaskNativeSection"), () => new AsyncLocalStorage());
function createWorkerNativeSectionState() {
	return new Int32Array(new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT));
}
function cancelWorkerNativeSections(state) {
	Atomics.or(state, 0, CANCELLED);
	Atomics.notify(state, 0);
}
function waitForWorkerNativeSections(state) {
	if (Atomics.load(state, 0) < SECTION) return;
	return (async () => {
		for (;;) {
			const observed = Atomics.load(state, 0);
			if (observed < SECTION) return;
			await Atomics.waitAsync(state, 0, observed).value;
		}
	})();
}
function releaseWorkerNativeSectionsOnExit(state) {
	Atomics.store(state, 0, CANCELLED);
	Atomics.notify(state, 0);
}
//#endregion
//#region src/infra/worker-task-pool-owned.ts
async function joinOwnedWorkerTasks(closures) {
	const errors = (await Promise.allSettled(closures)).flatMap((result) => result.status === "rejected" ? [result.reason] : []);
	if (errors.length === 1) throw errors[0];
	if (errors.length > 1) throw new AggregateError(errors, "Worker task cleanup failed");
}
function joinOwnedWorkerTask(task, settlement, retire = false) {
	const closing = closeOwnedWorkerTask(task, settlement, retire);
	return closing.catch((error) => {
		if (task.owner?.closing === closing) task.owner.closing = void 0;
		throw error;
	}).finally(() => {
		if (task.owner?.closed) {
			const slot = task.slot;
			task.slot = void 0;
			settlement.release(task, slot);
		}
	});
}
function closeOwnedWorkerTask(task, settlement, retire = false) {
	const owner = task.owner;
	if (!owner) return Promise.resolve();
	if (owner.closed) return owner.closing ?? Promise.resolve();
	owner.retire ||= retire;
	if (!task.done) settlement.cancel(task);
	return owner.closing ??= Promise.resolve().then(async () => {
		await task.preparation?.promise;
		const slot = task.slot;
		if (slot && owner.retire) await settlement.retire(slot);
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
	});
}
//#endregion
//#region src/infra/worker-task-pool-completion.ts
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
	const cleanup = createDeferredCore();
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
				transferMs: task.transferMs
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
//#region src/infra/worker-task-pool-resources.ts
/** Keep each pool slot referenced until its resource cleanup settles. */
async function closeWorkerPoolResources(slots, resourceClosures, key) {
	const errors = (await Promise.allSettled([...slots].map((slot) => {
		if (slot.retiring) return slot.retiring;
		const worker = slot.worker;
		if (!worker) return Promise.resolve();
		const closure = resourceClosures.get(worker) ?? { pending: 0 };
		closure.pending += 1;
		resourceClosures.set(worker, closure);
		worker.ref();
		return closeWorkerTaskResources(worker, key).finally(() => {
			closure.pending -= 1;
			if (!closure.pending && !slot.task && !slot.retiring) worker.unref();
		});
	}))).flatMap((result) => result.status === "rejected" ? [result.reason] : []);
	if (errors.length) throw new AggregateError(errors, "Worker resource cleanup failed");
}
/** The pool keeps the Worker referenced until its cleanup receipt or confirmed native exit. */
function closeWorkerTaskResources(worker, key) {
	const { port1, port2 } = new MessageChannel();
	return new Promise((resolve, reject) => {
		let settled = false;
		const finish = (error) => {
			if (settled) return;
			settled = true;
			worker.removeListener("exit", exited);
			port1.close();
			port2.close();
			if (error) reject(error);
			else resolve();
		};
		const exited = () => finish();
		worker.once("exit", exited);
		port1.once("message", (reply) => {
			finish(isRecord(reply) && reply.ok === true ? void 0 : new Error(isRecord(reply) && typeof reply.error === "string" ? reply.error : "Invalid worker resource cleanup receipt"));
		});
		port1.once("messageerror", (error) => finish(toErrorObject(error, "Worker resource cleanup receipt could not be decoded")));
		port1.once("close", () => finish(/* @__PURE__ */ new Error("Worker resource cleanup closed without a receipt")));
		try {
			worker.postMessage({
				closeResource: true,
				key,
				resourcePort: port2
			}, [port2]);
		} catch (error) {
			finish(toErrorObject(error, "Worker resource cleanup could not be sent"));
		}
	});
}
//#endregion
//#region src/infra/worker-task-pool-retirement.ts
function createWorkerTaskPoolRetirement({ slots, options, clearIdleTimer, runInContext, dispatch }) {
	const artifactCleanups = /* @__PURE__ */ new Set();
	function retire(slot) {
		clearIdleTimer(slot.idleTimer);
		cancelWorkerNativeSections(slot.nativeSections);
		return slot.retiring ??= Promise.resolve().then(async () => {
			if (slot.worker) {
				const settlement = waitForWorkerNativeSections(slot.nativeSections);
				if (settlement) await settlement;
				await slot.worker.terminate();
			}
			slot.retired = true;
		}).catch((error) => {
			try {
				Promise.resolve(options.onRetirementFailure?.(error)).catch(() => void 0);
			} catch {}
			throw error;
		}).then(() => {
			const releaseResources = slot.releaseResources;
			if (releaseResources) runInContext(() => {
				const cleanup = runBestEffortCleanup({
					cleanup: releaseResources,
					onError: (error) => process.emitWarning(`Worker task resource release failed: ${String(error)}`)
				});
				artifactCleanups.add(cleanup);
				cleanup.then(() => artifactCleanups.delete(cleanup));
			});
			slot.worker?.removeAllListeners();
			slots.delete(slot);
			for (const complete of slot.completions ?? []) complete();
			slot.completions = void 0;
			dispatch();
		}).catch((error) => {
			slot.retirementFailed = true;
			slot.retiring = void 0;
			throw error;
		});
	}
	/** Join failed native retirements without interrupting healthy tasks. */
	async function retryFailedRetirements() {
		const outcomes = await Promise.allSettled([...slots].filter((slot) => slot.retirementFailed).map((slot) => retire(slot)));
		outcomes.push(...await Promise.allSettled(artifactCleanups));
		const errors = outcomes.flatMap((outcome) => outcome.status === "rejected" ? [toErrorObject(outcome.reason, "worker retirement retry failed")] : []);
		const firstError = errors[0];
		if (firstError) throw errors.length === 1 ? firstError : new AggregateError(errors, "Worker retirement retries failed", { cause: firstError });
	}
	return {
		retire,
		retireIdle(resourceClosures) {
			for (const slot of slots) if (!slot.task && !slot.retiring && !slot.retirementFailed && slot.worker && !resourceClosures.get(slot.worker)?.pending) retire(slot).catch(() => void 0);
		},
		retryFailedRetirements,
		joinArtifacts: () => Promise.all(artifactCleanups)
	};
}
//#endregion
//#region src/infra/worker-task-pool-core.ts
const runInWorkerPoolContext = AsyncLocalStorage.snapshot();
var WorkerTaskError = class extends Error {
	constructor(message, code) {
		super(message);
		this.code = code;
		this.name = "WorkerTaskError";
	}
};
/** Bounded execution workers; each worker accepts one task at a time. */
var WorkerTaskPoolCore = class {
	constructor(options, publicDispatch) {
		this.options = options;
		this.publicDispatch = publicDispatch;
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
			retire: (slot) => this.retirement.retire(slot),
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
		this.rotationFailed = false;
		this.nextTaskId = 0;
		this.setTimeoutFn = setTimeout;
		this.clearTimeoutFn = clearTimeout;
		this.retireIdleOnPressure = () => this.retirement.retireIdle(this.resourceClosures);
		this.maxWorkers = options.maxWorkers ?? availableParallelism();
		this.maxPendingTasks = options.maxPendingTasks ?? 128;
		this.maxPendingBytes = options.maxPendingBytes ?? 268435456;
		for (const [name, value] of Object.entries({
			maxWorkers: this.maxWorkers,
			maxPendingTasks: this.maxPendingTasks,
			maxPendingBytes: this.maxPendingBytes
		})) if (!Number.isSafeInteger(value) || value < 1) throw new RangeError(`${name} must be a positive safe integer`);
		this.computeCapacity = options.sharedCompute ? getWorkerComputeCapacity() : void 0;
		this.retirement = createWorkerTaskPoolRetirement({
			slots: this.slots,
			options,
			clearIdleTimer: (timer) => this.clearTimeoutFn(timer),
			runInContext: runInWorkerPoolContext,
			dispatch: () => this.dispatch()
		});
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
	enqueue(input, options, owned = false, inputBytes = options.inputBytes ?? 0) {
		const task = {
			...createDeferredCore(),
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
			transferMs: 0
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
	retryFailedRetirements() {
		return this.retirement.retryFailedRetirements();
	}
	/** Close a retained native resource without cancelling other paths' tasks. */
	async closeResources(key) {
		await closeWorkerPoolResources(this.slots, this.resourceClosures, key);
	}
	/** Pause dispatch, settle current work and join native exit before restarting the queue. */
	rotate() {
		if (this.rotation) return this.rotation;
		const completion = createDeferredCore();
		this.rotation = completion.promise;
		this.rotationFailed = false;
		this.computeCapacity?.remove(this.resumeCompute);
		const slots = [...this.slots];
		const tasks = slots.flatMap((slot) => slot.task ? [slot.task] : []);
		Promise.allSettled(tasks.map((task) => task.promise)).then(() => Promise.all(slots.map((slot) => this.retirement.retire(slot)))).then(() => this.retirement.joinArtifacts()).then(() => {
			this.rotation = void 0;
			completion.resolve();
			this.dispatch();
		}, (error) => {
			this.rotation = void 0;
			this.rotationFailed = true;
			completion.reject(error);
		});
		return completion.promise;
	}
	close(error = new WorkerTaskError("worker task pool closed", "unavailable")) {
		this.closedError ??= error;
		channel("openclaw.memory.critical").unsubscribe(this.retireIdleOnPressure);
		this.computeCapacity?.remove(this.resumeCompute);
		for (const task of this.queue.splice(0)) this.finish(task, this.closedError);
		for (const slot of this.slots) if (slot.task && !slot.task.owner) this.finish(slot.task, this.closedError, void 0, true);
		const tasks = [...this.ownedTasks];
		const ownedSlots = new Set(tasks.flatMap((task) => task.slot?.task === task ? [task.slot] : []));
		const owned = tasks.map((task) => joinOwnedWorkerTask(task, this.ownedSettlement, true));
		const unowned = [...this.slots].filter((slot) => !ownedSlots.has(slot));
		const closures = [...owned, ...unowned.map((slot) => this.retirement.retire(slot))];
		return (tasks.length ? joinOwnedWorkerTasks(closures) : Promise.all(closures)).then(() => joinWorkerTaskPreparationCleanups(this.completion, this.retirement.joinArtifacts()));
	}
	dispatch() {
		if (!this.slots.size) channel("openclaw.memory.critical").unsubscribe(this.retireIdleOnPressure);
		if (!this.queue.length || this.closedError || this.rotation || this.rotationFailed) this.computeCapacity?.remove(this.resumeCompute);
		while (!this.closedError && !this.rotation && !this.rotationFailed && this.queue.length) {
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
					if (nextTask.exchange && !nextTask.exchange.sent) {
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
			this.clearTimeoutFn(slot.idleTimer);
			const task = this.queue.shift();
			slot.task = task;
			this.activeTasks++;
			task.slot = slot;
			task.startedAt = performance.now();
			slot.worker?.ref();
			task.runInContext(() => this.start(slot, task));
		}
	}
	createWorker(slot) {
		if ((this.options.idleTimeoutMs ?? 6e4) > 0) {
			const pressure = channel("openclaw.memory.critical");
			pressure.unsubscribe(this.retireIdleOnPressure);
			pressure.subscribe(this.retireIdleOnPressure);
		}
		const worker = runInWorkerPoolContext(() => {
			const prepared = this.options.prepareWorker?.();
			slot.releaseResources = prepared?.releaseResources;
			const temporaryDirectory = prepared?.temporaryDirectory;
			if (temporaryDirectory) {
				const releaseResources = slot.releaseResources;
				slot.releaseResources = async () => {
					try {
						const { removeTemporaryArtifacts } = await import("./temp-artifact-cleanup-Bu4AO9jC.mjs");
						await removeTemporaryArtifacts(temporaryDirectory, "Worker task");
					} finally {
						await releaseResources?.();
					}
				};
			}
			const workerUrl = this.options.workerUrl;
			const workerOptions = {
				execArgv: resolveRuntimeWorkerThreadExecArgv(workerUrl),
				...this.options.workerOptions,
				...prepared?.options
			};
			if (slot.retiring) throw new WorkerTaskError("worker creation closed during preparation", "unavailable");
			return createCpuTrackedWorker(workerUrl, workerOptions);
		});
		this.workers++;
		this.workersCreated++;
		slot.worker = worker;
		worker.on("message", (message) => {
			const task = slot.task;
			if (task) task.runInContext(() => this.receive(slot, message));
			else this.receive(slot, message);
		});
		worker.on("error", (error) => this.fail(slot, new WorkerTaskError(String(error), "unavailable")));
		worker.on("messageerror", (error) => this.fail(slot, new WorkerTaskError(String(error), "unavailable")));
		worker.once("exit", (code) => {
			releaseWorkerNativeSectionsOnExit(slot.nativeSections);
			this.workers--;
			this.fail(slot, new WorkerTaskError(`worker exited with code ${code}`, "unavailable"));
		});
		return worker;
	}
	async start(slot, task) {
		const taskInput = task.input;
		delete task.input;
		let input;
		task.preparation = createDeferredCore();
		try {
			try {
				input = typeof taskInput === "function" ? await taskInput() : taskInput;
			} finally {
				task.preparation.resolve();
				task.preparation = void 0;
			}
		} catch (error) {
			this.finish(task, toErrorObject(error, "worker task preparation failed"));
			return;
		}
		if (task.done) return;
		task.preparedAt = performance.now();
		try {
			const worker = slot.worker ?? this.createWorker(slot);
			const transferList = task.options.transferList?.(input);
			if (!task.done) {
				const transferStartedAt = performance.now();
				worker.postMessage({
					input,
					taskId: task.id,
					interactive: Boolean(task.options.onRequest),
					nativeSections: slot.nativeSections.buffer
				}, transferList);
				task.transferMs += performance.now() - transferStartedAt;
			}
		} catch (error) {
			this.fail(slot, new WorkerTaskError(String(error), "unavailable"));
		}
	}
	receive(slot, message) {
		if (slot.retiring) return;
		const task = slot.task;
		if (task && isRecord(message) && (message.status === "request" || message.status === "consumed")) {
			try {
				this.receiveExchange(slot, task, message);
			} catch (error) {
				this.fail(slot, toErrorObject(error, "worker consumption callback failed"));
			}
			return;
		}
		if (!task || !isRecord(message) || (task.options.onRequest || message.taskId !== void 0) && message.taskId !== task.id || message.status !== "ok" && message.status !== "failed") {
			this.fail(slot, new WorkerTaskError("invalid worker task response", "unavailable"));
			return;
		}
		const reply = message;
		if (reply.status === "failed") {
			this.finish(task, new WorkerTaskError(reply.error, "failed"), void 0, Boolean(task.exchange) || Boolean(task.options.onInputConsumed) && !task.inputConsumed);
			return;
		}
		try {
			this.options.validateResult?.(reply.value);
		} catch (error) {
			this.fail(slot, toErrorObject(error, "worker result validation failed"));
			return;
		}
		if (task.exchange || task.options.onInputConsumed && !task.inputConsumed) {
			this.finish(task, void 0, reply.value, true);
			return;
		}
		this.finish(task, void 0, reply.value);
	}
	armTimeout(task, timeoutMs) {
		clearTimeout(task.timer);
		task.timer = setTimeout(() => this.cancel(task, new WorkerTaskError("worker task timed out", "timeout")), resolveTimerTimeoutMs(timeoutMs, 6e4));
	}
	receiveExchange(slot, task, message) {
		if (message.taskId !== task.id) {
			this.fail(slot, new WorkerTaskError("stale worker exchange", "unavailable"));
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
		if (!task.options.onRequest || task.exchange || !Number.isSafeInteger(message.id) || message.id !== task.exchangeSequence + 1) {
			this.fail(slot, new WorkerTaskError("invalid worker exchange", "unavailable"));
			return;
		}
		clearTimeout(task.timer);
		const exchange = {
			id: ++task.exchangeSequence,
			pressure: new AbortController(),
			sent: false,
			onConsumed: void 0
		};
		task.exchange = exchange;
		this.dispatch();
		this.computeCapacity?.requestCheckpoints();
		Promise.resolve().then(() => {
			if (task.done || slot.task !== task) throw new WorkerTaskError("worker task closed before host dispatch", "unavailable");
			return task.options.onRequest(message.value, {
				signal: task.controller.signal,
				yieldSignal: exchange.pressure.signal
			});
		}).then((response) => {
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
		}).catch((error) => {
			if (!task.done && slot.task === task) this.fail(slot, toErrorObject(error, "worker host exchange failed"));
		});
	}
	cancel(task, error) {
		if (task.done) return;
		if (task.slot) {
			if (task.owner) this.finish(task, error, void 0, true);
			else this.fail(task.slot, error);
		} else {
			this.queue.splice(this.queue.indexOf(task), 1);
			this.finish(task, error);
		}
	}
	fail(slot, error) {
		if (slot.retiring) return;
		if (slot.task?.owner) {
			if (slot.task.done) {
				if (!slot.task.owner.retire) closeOwnedWorkerTask(slot.task, this.ownedSettlement, true).catch(() => void 0);
			} else this.finish(slot.task, error, void 0, true);
		} else if (this.options.restartOnError === false) (this.publicDispatch?.close(error) ?? this.close(error)).catch(() => void 0);
		else if (slot.task) this.finish(slot.task, error, void 0, true);
		else this.retirement.retire(slot).catch(() => void 0);
	}
	finish(task, error, value, retire = false) {
		if (task.done) return;
		task.done = true;
		task.runInContext(() => task.controller.abort());
		clearTimeout(task.timer);
		task.options.signal?.removeEventListener("abort", task.abort);
		const complete = createWorkerTaskCompletion(task, this.completion, error, value);
		if (task.owner) {
			task.owner.complete = complete;
			task.owner.retire ||= retire || Boolean(error && task.slot);
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
				this.retirement.retire(slot).catch((failure) => {
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
		const idleMs = this.options.idleTimeoutMs ?? 6e4;
		if (idleMs > 0) {
			slot.idleTimer = runInWorkerPoolContext(() => this.setTimeoutFn(() => void this.retirement.retire(slot).catch(() => void 0), idleMs));
			slot.idleTimer.unref();
		}
	}
};
function createWorkerTaskPoolCore(options, publicDispatch) {
	return new WorkerTaskPoolCore(options, publicDispatch);
}
//#endregion
//#region src/infra/worker-task-pool.ts
/** Existing SDK surface; task custody remains an internal capability. */
var WorkerTaskPool = class {
	constructor(options) {
		this.core = createWorkerTaskPoolCore(options, {
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
//#endregion
export { WorkerTaskPool as t };
