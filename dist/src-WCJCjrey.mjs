import { F as resolveTimerTimeoutMs } from "./number-coercion-CuVhdCBs.mjs";
import { u as toErrorObject } from "./error-coercion-CvJK4lmH.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { t as createRetainedOperation } from "./retained-operation-CODoIe4t.mjs";
import { t as isPromiseLike } from "./promise-like-D7-l5Fsp.mjs";
import { c as waitForWorkerNativeSections, n as cancelWorkerNativeSections, o as releaseWorkerNativeSectionsOnExit, r as createWorkerNativeSectionState, t as areWorkerNativeSectionsSettled } from "./worker-task-native-sections-DVlyZQtL.mjs";
import { AsyncLocalStorage } from "node:async_hooks";
import { availableParallelism } from "node:os";
import { MessageChannel, receiveMessageOnPort } from "node:worker_threads";
import { channel } from "node:diagnostics_channel";
//#region packages/worker-runtime/src/worker-task-capacity.ts
const DEFAULT_WORKER_PENDING_TASKS = 128;
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
export { DEFAULT_WORKER_PENDING_TASKS as a, DEFAULT_WORKER_PENDING_BYTES as i, joinOwnedWorkerTasks as n, createWorkerComputeCapacity as o, WorkerTaskError as r, WorkerTaskPoolCore as t };
