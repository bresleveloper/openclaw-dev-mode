import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { t as createSubsystemLogger } from "./subsystem-DleLyu58.mjs";
import { t as truncateUtf8Prefix } from "./utf8-truncate-_hf7tp13.mjs";
import { randomUUID } from "node:crypto";
//#region src/gateway/desktop/session-registry.ts
const DEFAULT_LINGER_MS = 6e4;
const MAX_OBSERVERS = 8;
const log = createSubsystemLogger("gateway/desktop");
var DesktopSessionStaleOwnerError = class extends Error {
	constructor() {
		super("Desktop session owner epoch is stale");
		this.name = "DesktopSessionStaleOwnerError";
	}
};
var DesktopSessionStoppedError = class extends Error {
	constructor() {
		super("Desktop session stopped before connecting");
		this.name = "DesktopSessionStoppedError";
	}
};
/** Owns per-source desktop sessions and their connected observer lifetimes. */
function createDesktopSessionRegistry(deps = {}) {
	const lingerMs = deps.lingerMs ?? DEFAULT_LINGER_MS;
	const entries = /* @__PURE__ */ new Map();
	const owners = /* @__PURE__ */ new Set();
	const claimedOwnerEpochs = /* @__PURE__ */ new Map();
	const controlListeners = /* @__PURE__ */ new Set();
	const notifyControl = (entry) => {
		for (const listener of controlListeners) if (listener.sourceKey === entry.sourceKey && listener.ownerEpoch === entry.ownerEpoch) listener.changed(entry.controller !== void 0);
	};
	const claimOwnerEpoch = (sourceKey, ownerEpoch) => {
		const claimedEpoch = claimedOwnerEpochs.get(sourceKey);
		if (claimedEpoch !== void 0 && ownerEpoch < claimedEpoch) throw new DesktopSessionStaleOwnerError();
		if (claimedEpoch === void 0 || ownerEpoch > claimedEpoch) {
			claimedOwnerEpochs.set(sourceKey, ownerEpoch);
			return true;
		}
		return false;
	};
	const isCurrent = (entry) => entries.get(entry.sourceKey) === entry && !entry.stopped;
	const closeObserver = (observer, code, reason) => {
		try {
			observer.close(code, reason);
		} catch {}
	};
	const stopEntry = (entry) => {
		if (entry.stopPromise) return entry.stopPromise;
		const stopped = createDeferredCore();
		entry.stopPromise = stopped.promise;
		stopped.promise.catch((error) => {
			log.warn(`Desktop session cleanup failed: ${String(error)}`, { sourceKey: entry.sourceKey });
		});
		(async () => {
			entry.stopped = true;
			clearTimeout(entry.lingerTimer);
			entry.lingerTimer = void 0;
			for (const observer of entry.observers) {
				observer.released = true;
				closeObserver(observer, 1012, "desktop tunnel closed");
			}
			entry.observers.clear();
			entry.controller = void 0;
			notifyControl(entry);
			for (const pending of entry.pendingStreams.values()) {
				pending.reservation.release();
				pending.stream.destroy();
			}
			entry.pendingStreams.clear();
			entry.observerReservations.clear();
			entry.activities.clear();
			if (!entry.readySettled) {
				entry.readySettled = true;
				entry.ready.reject(new DesktopSessionStoppedError());
			}
			await entry.teardown?.();
			await entry.initialization?.catch(() => void 0);
			await entry.teardown?.();
			await entry.dispose?.();
		})().then(() => {
			owners.delete(entry);
			if (entries.get(entry.sourceKey) === entry) entries.delete(entry.sourceKey);
		}).then(stopped.resolve, (error) => {
			entry.stopPromise = void 0;
			stopped.reject(error);
		});
		return stopped.promise;
	};
	const stopEntries = (pending) => {
		const stopped = Promise.allSettled(pending.map(stopEntry)).then((outcomes) => {
			const failure = outcomes.find((outcome) => outcome.status === "rejected");
			if (failure) throw failure.reason;
		});
		stopped.catch(() => void 0);
		return stopped;
	};
	const scheduleLinger = (entry) => {
		if (!isCurrent(entry) || entry.observers.size > 0 || entry.observerReservations.size > 0 || entry.activities.size > 0) return;
		clearTimeout(entry.lingerTimer);
		entry.lingerTimer = setTimeout(() => void stopEntry(entry), lingerMs);
		entry.lingerTimer.unref?.();
	};
	const waitForReady = async (entry) => {
		const result = await entry.ready.promise;
		scheduleLinger(entry);
		return result;
	};
	async function startSession(request) {
		claimOwnerEpoch(request.sourceKey, request.ownerEpoch);
		const current = entries.get(request.sourceKey);
		if (current && request.ownerEpoch === current.ownerEpoch && !current.stopped) return await waitForReady(current);
		const previous = [...owners].filter((entry) => entry.sourceKey === request.sourceKey);
		const ready = createDeferredCore();
		ready.promise.catch(() => void 0);
		const entry = {
			sourceKey: request.sourceKey,
			ownerEpoch: request.ownerEpoch,
			ready,
			readySettled: false,
			observers: /* @__PURE__ */ new Set(),
			observerReservations: /* @__PURE__ */ new Set(),
			activities: /* @__PURE__ */ new Set(),
			pendingStreams: /* @__PURE__ */ new Map(),
			stopped: false,
			...request.teardown ? { teardown: request.teardown } : {},
			...request.dispose ? { dispose: request.dispose } : {}
		};
		entries.set(request.sourceKey, entry);
		owners.add(entry);
		entry.initialization = Promise.resolve().then(async () => {
			await stopEntries(previous);
			if (!isCurrent(entry)) return;
			const result = await request.start(() => isCurrent(entry), () => stopEntry(entry));
			if (!isCurrent(entry)) return;
			entry.readySettled = true;
			entry.ready.resolve(result);
		});
		entry.initialization.catch((error) => {
			if (!entry.readySettled) {
				entry.readySettled = true;
				entry.ready.reject(error instanceof Error ? error : /* @__PURE__ */ new Error("Desktop session failed"));
			}
			stopEntry(entry);
		});
		return await waitForReady(entry);
	}
	async function acquire(request) {
		const result = await startSession(request);
		if (!result) throw new Error("Desktop session attachment is unavailable");
		return result;
	}
	async function activate(request) {
		await startSession({
			...request,
			start: async () => void 0
		});
	}
	function attachObserver(sourceKey, observer) {
		const entry = entries.get(sourceKey);
		if (!entry || !entry.readySettled || entry.stopped || entry.observers.size + entry.observerReservations.size >= MAX_OBSERVERS) return;
		if (observer.ownerEpoch !== entry.ownerEpoch) return;
		clearTimeout(entry.lingerTimer);
		entry.lingerTimer = void 0;
		if (observer.control && entry.controller) {
			const previous = entry.controller;
			previous.released = true;
			entry.observers.delete(previous);
			entry.controller = void 0;
			const reason = observer.operatorName ? `control-taken:${observer.operatorName}` : "control-taken";
			closeObserver(previous, 4e3, truncateUtf8Prefix(reason, 123));
		}
		const attached = {
			...observer,
			released: false
		};
		entry.observers.add(attached);
		if (attached.control) {
			entry.controller = attached;
			notifyControl(entry);
		}
		return { release() {
			if (attached.released) return;
			attached.released = true;
			entry.observers.delete(attached);
			if (entry.controller === attached) {
				entry.controller = void 0;
				notifyControl(entry);
			}
			scheduleLinger(entry);
		} };
	}
	function reserveObserver(sourceKey, ownerEpoch) {
		const entry = entries.get(sourceKey);
		if (!entry || entry.stopped || entry.ownerEpoch !== ownerEpoch || entry.observers.size + entry.observerReservations.size >= MAX_OBSERVERS) return;
		const reservationId = Symbol("desktop-observer");
		entry.observerReservations.add(reservationId);
		clearTimeout(entry.lingerTimer);
		entry.lingerTimer = void 0;
		return { release() {
			if (entry.observerReservations.delete(reservationId)) scheduleLinger(entry);
		} };
	}
	function createStream(params) {
		const controller = new AbortController();
		let ticket;
		let invocation;
		let reservation;
		let attachment;
		let stream;
		let unclaimedTimer;
		let stopped = false;
		const retire = () => {
			if (stopped) return;
			stopped = true;
			clearTimeout(unclaimedTimer);
			ticket?.cancel();
			controller.abort();
			if (!attachment) reservation?.release();
			stream?.destroy();
		};
		const stopStream = async () => {
			retire();
			await invocation?.catch(() => void 0);
			params.onStopped();
		};
		return {
			signal: controller.signal,
			get stopped() {
				return stopped;
			},
			reserve() {
				reservation = reserveObserver(params.sourceKey, params.ownerEpoch);
				return reservation !== void 0;
			},
			async connect(pending, invoke) {
				ticket = pending;
				const operation = invoke();
				invocation = operation;
				const finished = operation.then((result) => {
					throw new Error(result.error?.message?.trim() || "node desktop stream closed before attachment");
				});
				finished.catch(() => void 0);
				operation.finally(() => {
					retire();
					params.onStopped();
				}).catch(() => void 0);
				const attached = await Promise.race([pending.attached, finished]);
				stream = attached.stream;
				if (stopped) stream.destroy();
				return attached;
			},
			publish() {
				if (reservation && stream) attachment = publishStream({
					...params,
					reservation,
					stream
				});
				return attachment;
			},
			expireAt(expiresAtMs) {
				unclaimedTimer = setTimeout(() => {
					if (attachment && hasPendingStream(params.sourceKey, attachment)) stopStream();
				}, Math.max(0, expiresAtMs - Date.now()));
				unclaimedTimer.unref?.();
			},
			stop: stopStream
		};
	}
	/** Keep an active desktop consumer alive independently of browser observers. */
	function retainActivity(sourceKey, ownerEpoch) {
		const entry = entries.get(sourceKey);
		if (!entry || !entry.readySettled || entry.stopped || entry.ownerEpoch !== ownerEpoch) return;
		const activity = Symbol("desktop-activity");
		entry.activities.add(activity);
		clearTimeout(entry.lingerTimer);
		entry.lingerTimer = void 0;
		return {
			isCurrent: () => isCurrent(entry) && entry.activities.has(activity),
			release() {
				if (entry.activities.delete(activity)) scheduleLinger(entry);
			}
		};
	}
	function publishStream(params) {
		const entry = entries.get(params.sourceKey);
		if (!entry || entry.stopped || entry.ownerEpoch !== params.ownerEpoch || params.stream.destroyed || params.stream.readableEnded || params.stream.writableEnded) {
			params.reservation.release();
			params.stream.destroy();
			return;
		}
		const streamId = randomUUID();
		const pending = {
			stream: params.stream,
			reservation: params.reservation
		};
		entry.pendingStreams.set(streamId, pending);
		params.stream.once("close", () => {
			if (entry.pendingStreams.get(streamId) === pending) {
				entry.pendingStreams.delete(streamId);
				params.reservation.release();
			}
		});
		return {
			kind: "stream",
			streamId
		};
	}
	function claimStream(sourceKey, attachment) {
		const entry = entries.get(sourceKey);
		const pending = entry?.pendingStreams.get(attachment.streamId);
		if (!entry || !pending) return;
		entry.pendingStreams.delete(attachment.streamId);
		pending.reservation.release();
		const stream = pending.stream;
		if (stream.destroyed || stream.readableEnded || stream.writableEnded) {
			stream.destroy();
			return;
		}
		return stream;
	}
	function hasPendingStream(sourceKey, attachment) {
		return entries.get(sourceKey)?.pendingStreams.has(attachment.streamId) ?? false;
	}
	function stop(sourceKey, ownerEpoch) {
		return stopEntries([...owners].filter((entry) => entry.sourceKey === sourceKey && (ownerEpoch === void 0 || ownerEpoch === entry.ownerEpoch)));
	}
	/**
	* Retires only owners strictly older than the claimant. An equal epoch shares the
	* session, so fencing must not tear down a peer that claimed the same generation.
	*/
	function stopSuperseded(sourceKey, ownerEpoch) {
		return stopEntries([...owners].filter((entry) => entry.sourceKey === sourceKey && entry.ownerEpoch < ownerEpoch));
	}
	function stopAll() {
		return stopEntries([...owners]);
	}
	return {
		acquire,
		activate,
		attachObserver,
		claimStream,
		createStream,
		retainActivity,
		hasActivity: (sourceKey, ownerEpoch) => {
			const entry = entries.get(sourceKey);
			return entry?.ownerEpoch === ownerEpoch && !entry.stopped && (entry.observers.size > 0 || entry.observerReservations.size > 0 || entry.activities.size > 0);
		},
		hasController: (sourceKey, ownerEpoch) => {
			const entry = entries.get(sourceKey);
			return entry?.ownerEpoch === ownerEpoch && !entry.stopped && entry.controller !== void 0;
		},
		onControlChanged: (sourceKey, ownerEpoch, changed) => {
			const listener = {
				sourceKey,
				ownerEpoch,
				changed
			};
			controlListeners.add(listener);
			return () => {
				controlListeners.delete(listener);
			};
		},
		claimOwnerEpoch,
		isOwnerEpochCurrent: (sourceKey, ownerEpoch) => claimedOwnerEpochs.get(sourceKey) === ownerEpoch,
		stop,
		stopSuperseded,
		stopAll
	};
}
//#endregion
export { DesktopSessionStoppedError as n, createDesktopSessionRegistry as r, DesktopSessionStaleOwnerError as t };
