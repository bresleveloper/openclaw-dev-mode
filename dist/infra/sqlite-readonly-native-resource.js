import { t as createDeferredCore } from "../deferred-D0La5CRk.mjs";
import { s as throwSqliteLifecycleErrors } from "../sqlite-lifecycle-errors-Ca_9goHE.mjs";
import { m as runSqliteReadOnlyWorkerOnce, r as createScopedSqliteReadOnlyWorker } from "../sqlite-readonly-worker-C2DDLw_y.mjs";
import { t as SqliteSnapshotCleanupError } from "../sqlite-readonly-location-cleanup-zmu6YCue.mjs";
import { n as hydrateOpenClawStateWorkerError, r as retainOpenClawStateWorkerErrorPayload, t as encodeOpenClawStateWorkerError } from "../openclaw-state-worker-error-B93Lf_P2.mjs";
import fs from "node:fs/promises";
//#region src/infra/sqlite-readonly-native-resource.ts
/** NativeLifetime installs this owner before delivering the port to its target Worker. */
function createNativeWorkerResource(port, input, ownerPort) {
	if (input !== void 0) throw new Error("SQLite native resource does not accept bootstrap input");
	if (!ownerPort) throw new Error("SQLite native resource requires its host cleanup owner");
	const sendOwnerMessage = ownerPort.postMessage.bind(ownerPort);
	const sessions = /* @__PURE__ */ new Map();
	const directories = /* @__PURE__ */ new Map();
	const copies = /* @__PURE__ */ new Map();
	const active = /* @__PURE__ */ new Set();
	const ownerRequests = /* @__PURE__ */ new Map();
	let ownerSequence = 0;
	let ownerUnavailable;
	let sealed = false;
	let available = true;
	let closing;
	const loseOwner = (cause) => {
		ownerUnavailable ??= new SqliteSnapshotCleanupError("SQLite snapshot host cleanup owner is unavailable; directory removal is not acknowledged", cause instanceof Error ? { cause } : void 0);
		for (const request of ownerRequests.values()) request.reject(ownerUnavailable);
		ownerRequests.clear();
		return ownerUnavailable;
	};
	ownerPort.on("message", (message) => {
		const value = message;
		const request = ownerRequests.get(value.id);
		if (!request) return;
		ownerRequests.delete(value.id);
		if (value.ok) request.resolve();
		else {
			const error = /* @__PURE__ */ new Error("SQLite snapshot host cleanup refused");
			retainOpenClawStateWorkerErrorPayload(error, value.error);
			request.reject(hydrateOpenClawStateWorkerError(error, { includeOrdinary: true }));
		}
	});
	ownerPort.on("close", loseOwner);
	ownerPort.on("messageerror", loseOwner);
	const notifyOwner = (type, directory, preparationId) => {
		if (ownerUnavailable) return Promise.reject(ownerUnavailable);
		const id = ++ownerSequence;
		const request = createDeferredCore();
		ownerRequests.set(id, request);
		try {
			sendOwnerMessage(type === "allocated" ? {
				id,
				type,
				directory,
				preparationId
			} : {
				id,
				type,
				directory
			});
		} catch (error) {
			loseOwner(error);
		}
		return request.promise;
	};
	const announce = async (directory, owned) => {
		if (!owned.announced) {
			await notifyOwner("allocated", directory, owned.preparationId);
			owned.announced = true;
		}
	};
	const removed = async (directory) => {
		const owned = directories.get(directory);
		if (!owned) throw new Error("SQLite snapshot directory is not owned by this native resource");
		owned.removed = true;
		await announce(directory, owned);
		await notifyOwner("removed", directory);
		directories.delete(directory);
	};
	const send = (message) => {
		if (!available) return;
		try {
			port.postMessage(message);
		} catch {
			available = false;
		}
	};
	const fail = (id, error, retired) => {
		const encoded = encodeOpenClawStateWorkerError(error, { includeOrdinary: true }) ?? encodeOpenClawStateWorkerError(/* @__PURE__ */ new Error("SQLite native resource operation failed"), { includeOrdinary: true });
		if (encoded) send({
			type: "result",
			id,
			ok: false,
			error: encoded,
			retired
		});
	};
	const closeSession = (id, session) => {
		session.closing ??= (async () => {
			await session.native.close();
			await session.native.closed;
			sessions.delete(id);
		})().finally(() => {
			session.closing = void 0;
		});
		return session.closing;
	};
	async function execute(request) {
		if (sealed && request.type !== "session.close" && request.type !== "directory.removed") throw new Error("SQLite native resource is closing");
		if (request.type === "directory.removed") {
			await removed(request.directory);
			return;
		}
		if (request.type === "session.create") {
			if (sessions.has(request.session)) throw new Error("SQLite native session already exists");
			const native = createScopedSqliteReadOnlyWorker(request.launch);
			sessions.set(request.session, {
				native,
				launch: request.launch,
				running: false
			});
			native.closed.then(() => send({
				type: "session.closed",
				session: request.session
			}), () => {});
			return;
		}
		if (request.type === "copy.run") {
			const controller = copies.get(request.id);
			if (!controller) throw new Error("SQLite native copy lost its admission");
			controller.signal.throwIfAborted();
			return await runSqliteReadOnlyWorkerOnce(request.pathname, {
				mode: request.mode,
				stagingRoot: request.stagingRoot,
				expectedSourceIdentity: request.expectedSourceIdentity,
				signal: controller.signal
			}, request.launch);
		}
		const session = sessions.get(request.session);
		if (!session) {
			if (request.type === "session.close") return;
			throw new Error("SQLite native session is closed");
		}
		if (request.type === "session.close") {
			await closeSession(request.session, session);
			return;
		}
		if (session.running || session.closing) throw new Error("SQLite native session is busy");
		if (session.native.isRetired()) throw new Error("SQLite native session is closed");
		session.running = true;
		try {
			const allocating = request.mode === "staging-create" || request.mode === "staging-create-legacy";
			const result = await session.native.run(request.pathname, { mode: request.mode });
			if (allocating && typeof result === "string") {
				const owned = {
					preparationId: request.preparationId,
					session,
					announced: false,
					removed: false
				};
				directories.set(result, owned);
				await announce(result, owned);
			}
			return result;
		} finally {
			session.running = false;
		}
	}
	const receive = (message) => {
		const request = message;
		if (request.type === "copy.cancel") {
			copies.get(request.id)?.abort(/* @__PURE__ */ new Error("SQLite native copy cancelled"));
			return;
		}
		const command = request;
		if (command.type === "copy.run") {
			if (copies.has(command.id)) {
				fail(command.id, /* @__PURE__ */ new Error("SQLite native copy already exists"));
				return;
			}
			copies.set(command.id, new AbortController());
		}
		const work = Promise.resolve().then(() => execute(command)).then((result) => {
			if (result !== void 0 && typeof result !== "string") throw new Error("SQLite native resource returned an invalid location");
			send({
				type: "result",
				id: command.id,
				ok: true,
				value: result,
				retired: command.type === "session.close" ? true : "session" in command ? sessions.get(command.session)?.native.isRetired() : void 0
			});
		}).catch((error) => {
			fail(command.id, error, "session" in command ? sessions.get(command.session)?.native.isRetired() : void 0);
		}).finally(() => {
			if (command.type === "copy.run") copies.delete(command.id);
			active.delete(work);
		});
		active.add(work);
	};
	port.on("message", receive);
	port.on("close", () => {
		available = false;
	});
	port.on("messageerror", () => {
		available = false;
		port.close();
	});
	return {
		encodeCloseError: (error) => encodeOpenClawStateWorkerError(error, { includeOrdinary: true }),
		close() {
			sealed = true;
			return closing ??= (async () => {
				for (const controller of copies.values()) controller.abort(/* @__PURE__ */ new Error("SQLite native resource closed"));
				await Promise.allSettled(active);
				const fences = await Promise.allSettled([...directories].map(async ([directory, owned]) => {
					await announce(directory, owned);
					if (!owned.removed) await notifyOwner("retire", directory);
				}));
				throwSqliteLifecycleErrors(fences.flatMap((outcome) => outcome.status === "rejected" ? [outcome.reason] : []), "SQLite snapshot host cleanup admission failed");
				const outcomes = await Promise.allSettled([...sessions].map(([id, session]) => closeSession(id, session)));
				throwSqliteLifecycleErrors(outcomes.flatMap((outcome) => outcome.status === "rejected" ? [outcome.reason] : []), "SQLite native resource cleanup failed");
				const failures = [];
				for (const [directory, owned] of directories) try {
					if (!owned.removed) {
						await runSqliteReadOnlyWorkerOnce(directory, { mode: "staging-reconcile" }, {
							env: owned.session.launch.env,
							cwd: owned.session.launch.cwd,
							deadlineOwnedByCaller: false
						});
						await fs.rm(directory, {
							force: true,
							recursive: true,
							maxRetries: 3,
							retryDelay: 20
						});
					}
					await removed(directory);
				} catch (error) {
					failures.push(error);
				}
				throwSqliteLifecycleErrors(failures, "SQLite snapshot native directory cleanup failed");
				port.off("message", receive);
				port.close();
				ownerPort.close();
			})().finally(() => {
				closing = void 0;
			});
		}
	};
}
//#endregion
export { createNativeWorkerResource };
