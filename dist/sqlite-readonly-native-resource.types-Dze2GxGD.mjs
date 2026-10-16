import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { t as SqliteSnapshotCleanupError } from "./sqlite-readonly-location-cleanup-CPS8QEIp.mjs";
import { n as isSameSqliteReadOnlyWorkerLaunch } from "./sqlite-readonly-worker-session-DK-j16po.mjs";
import { n as hydrateOpenClawStateWorkerError, r as retainOpenClawStateWorkerErrorPayload, t as encodeOpenClawStateWorkerError } from "./openclaw-state-worker-error-Cmtk9G4_.mjs";
import { MessageChannel, receiveMessageOnPort } from "node:worker_threads";
//#region src/infra/sqlite-readonly-native-resource.client.ts
/** The target only transports commands; native child custody remains with NativeLifetime. */
function createSqliteReadOnlyNativeResourceClient(port) {
	const pending = /* @__PURE__ */ new Map();
	const sessions = /* @__PURE__ */ new Map();
	let sequence = 0;
	let sessionSequence = 0;
	let unavailable;
	const fail = (cause) => {
		unavailable ??= new Error("SQLite native resource transport is unavailable; child cleanup is not acknowledged", cause instanceof Error ? { cause } : void 0);
		for (const request of pending.values()) request.completion.reject(unavailable);
		pending.clear();
		return unavailable;
	};
	const receive = (value) => {
		if (!isRecord(value)) {
			fail();
			return;
		}
		if (value.type === "session.closed" && typeof value.session === "number") {
			const session = sessions.get(value.session);
			if (session) {
				session.retired = true;
				session.closed = true;
			}
			return;
		}
		if (value.type !== "result" || typeof value.id !== "number" || value.ok !== true && value.ok !== false || value.retired !== void 0 && typeof value.retired !== "boolean") {
			fail();
			return;
		}
		const request = pending.get(value.id);
		if (!request) return;
		pending.delete(value.id);
		const session = request.session === void 0 ? void 0 : sessions.get(request.session);
		if (session && value.retired !== void 0) session.retired = value.retired;
		if (value.ok) {
			if (value.value !== void 0 && typeof value.value !== "string") {
				request.completion.reject(fail());
				return;
			}
			request.completion.resolve({
				ok: true,
				value: value.value
			});
		} else {
			const error = /* @__PURE__ */ new Error("SQLite native resource operation failed");
			retainOpenClawStateWorkerErrorPayload(error, value.error);
			request.completion.resolve({
				ok: false,
				error: hydrateOpenClawStateWorkerError(error, { includeOrdinary: true })
			});
		}
	};
	const drain = () => {
		if (unavailable) return;
		try {
			for (;;) {
				const next = receiveMessageOnPort(port);
				if (!next) return;
				receive(next.message);
			}
		} catch (error) {
			fail(error);
		}
	};
	const send = (message) => {
		if (unavailable) throw unavailable;
		try {
			port.postMessage(message);
		} catch (error) {
			throw fail(error);
		}
	};
	const request = (command) => {
		drain();
		const id = ++sequence;
		const completion = createDeferredCore();
		pending.set(id, {
			completion,
			session: "session" in command ? command.session : void 0
		});
		try {
			send({
				...command,
				id
			});
		} catch (error) {
			pending.delete(id);
			completion.reject(error);
		}
		return {
			id,
			result: completion.promise
		};
	};
	const unwrap = (result) => {
		if (!result.ok) throw result.error;
		return result.value;
	};
	port.on("message", receive);
	port.on("messageerror", fail);
	port.on("close", fail);
	return {
		async removed(directory) {
			unwrap(await request({
				type: "directory.removed",
				directory
			}).result);
		},
		createSession(launch) {
			const captured = {
				...launch,
				env: { ...launch.env },
				transport: { kind: "native" }
			};
			const session = ++sessionSequence;
			const state = {
				retired: false,
				closed: false
			};
			sessions.set(session, state);
			const ready = request({
				type: "session.create",
				session,
				launch: captured
			}).result.then(unwrap);
			ready.catch(() => void 0);
			let closing;
			let released = false;
			return {
				isRetired() {
					drain();
					return state.retired;
				},
				compatible(other) {
					drain();
					return !unavailable && !closing && !state.retired && isSameSqliteReadOnlyWorkerLaunch(captured, other);
				},
				async run(pathname, options) {
					await ready;
					if (closing || state.retired) throw new Error("SQLite native session is closed");
					const value = unwrap(await request({
						type: "session.run",
						session,
						pathname,
						...options
					}).result);
					if (typeof value !== "string") throw new Error("SQLite native session returned no location");
					return value;
				},
				close() {
					if (released) return Promise.resolve();
					return closing ??= (async () => {
						await ready.catch(() => void 0);
						if (!unavailable || !state.closed) {
							let outcome;
							try {
								outcome = await request({
									type: "session.close",
									session
								}).result;
							} catch (error) {
								if (!unavailable || !state.closed) throw error;
							}
							if (outcome) unwrap(outcome);
						}
						released = true;
						sessions.delete(session);
					})().finally(() => {
						closing = void 0;
					});
				}
			};
		},
		async runOnce(pathname, options, launch) {
			options.signal?.throwIfAborted();
			const call = request({
				type: "copy.run",
				pathname,
				mode: options.mode,
				stagingRoot: options.stagingRoot,
				expectedSourceIdentity: options.expectedSourceIdentity,
				launch: {
					...launch,
					env: { ...launch.env }
				}
			});
			const abort = () => {
				try {
					send({
						type: "copy.cancel",
						id: call.id
					});
				} catch {}
			};
			options.signal?.addEventListener("abort", abort, { once: true });
			if (options.signal?.aborted) abort();
			try {
				const result = await call.result;
				options.signal?.throwIfAborted();
				const value = unwrap(result);
				if (typeof value !== "string") throw new Error("SQLite native copy returned no location");
				return value;
			} finally {
				options.signal?.removeEventListener("abort", abort);
			}
		}
	};
}
/** Host-port framing; the staging owner alone admits readers and retires directories. */
function createSqliteReadOnlyNativeResourceConnection(callbacks) {
	const { port1, port2 } = new MessageChannel();
	const owner = { disposed: false };
	const receive = (value) => {
		if (!isRecord(value) || typeof value.id !== "number" || !Number.isSafeInteger(value.id) || value.id < 1) throw new SqliteSnapshotCleanupError("SQLite snapshot native owner sent an invalid request");
		let reply;
		try {
			if (typeof value.directory !== "string" || !value.directory || value.directory.includes("\0")) throw new SqliteSnapshotCleanupError("SQLite snapshot native owner sent an invalid directory");
			let request;
			if (value.type === "allocated") {
				if (typeof value.preparationId !== "number" || !Number.isSafeInteger(value.preparationId) || value.preparationId < 1) throw new SqliteSnapshotCleanupError("SQLite snapshot has no preparation identity");
				request = {
					id: value.id,
					type: value.type,
					directory: value.directory,
					preparationId: value.preparationId
				};
			} else if (value.type === "retire" || value.type === "removed") request = {
				id: value.id,
				type: value.type,
				directory: value.directory
			};
			else throw new SqliteSnapshotCleanupError("SQLite snapshot native owner sent an unsupported request");
			callbacks.receive(request, owner);
			reply = {
				id: value.id,
				ok: true
			};
		} catch (error) {
			const encoded = encodeOpenClawStateWorkerError(error, { includeOrdinary: true });
			if (!encoded) throw error;
			reply = {
				id: value.id,
				ok: false,
				error: encoded
			};
		}
		port1.postMessage(reply);
	};
	const fail = (error) => {
		callbacks.onFailure(error);
		port1.close();
	};
	const onMessage = (value) => {
		try {
			receive(value);
		} catch (error) {
			fail(error);
		}
	};
	port1.on("message", onMessage);
	port1.on("messageerror", fail);
	return {
		port: port2,
		service() {
			if (owner.disposed) return;
			for (;;) {
				const next = receiveMessageOnPort(port1);
				if (!next) return;
				try {
					receive(next.message);
				} catch (error) {
					fail(error);
					throw error;
				}
			}
		},
		decodeCloseError(payload) {
			const remote = /* @__PURE__ */ new Error("SQLite snapshot staging failed");
			retainOpenClawStateWorkerErrorPayload(remote, payload);
			const error = hydrateOpenClawStateWorkerError(remote, { includeOrdinary: true });
			return error instanceof AggregateError ? error : new SqliteSnapshotCleanupError(error.message, { cause: error });
		},
		dispose() {
			owner.disposed = true;
			callbacks.onDispose(owner);
			port1.removeAllListeners();
			port1.close();
			port2.close();
		}
	};
}
//#endregion
//#region src/infra/sqlite-readonly-native-resource.types.ts
const SQLITE_NATIVE_RESOURCE_PORT = "sqliteSnapshotNativeResource";
//#endregion
export { createSqliteReadOnlyNativeResourceClient as n, createSqliteReadOnlyNativeResourceConnection as r, SQLITE_NATIVE_RESOURCE_PORT as t };
