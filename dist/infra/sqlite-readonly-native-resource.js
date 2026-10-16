import { t as createDeferredCore } from "../deferred-D0La5CRk.mjs";
import { c as isRecord } from "../record-coerce-TIsquoVR.mjs";
import { s as readDatabaseFileIdentity } from "../sqlite-worker-identity-KSR14F6C.mjs";
import { s as throwSqliteLifecycleErrors } from "../sqlite-lifecycle-errors-DuOygjcn.mjs";
import { t as isPrivateDirectoryCreationRefused } from "../private-directory-creation-BJJHaRfP.mjs";
import { t as SqliteSnapshotCleanupError } from "../sqlite-readonly-location-cleanup-CPS8QEIp.mjs";
import { a as SqliteSnapshotAllocationRefusedError } from "../sqlite-readonly-worker-session-DK-j16po.mjs";
import { n as createScopedSqliteReadOnlyWorker, p as runSqliteReadOnlyWorkerOnce } from "../sqlite-readonly-worker-TSy0m8v6.mjs";
import { n as hydrateOpenClawStateWorkerError, r as retainOpenClawStateWorkerErrorPayload, t as encodeOpenClawStateWorkerError } from "../openclaw-state-worker-error-Cmtk9G4_.mjs";
import fs from "node:fs/promises";
//#region src/infra/sqlite-readonly-native-resource.ts
function readId(value) {
	if (typeof value !== "number" || !Number.isSafeInteger(value) || value < 1) throw new Error("SQLite native resource requires a positive request identity");
	return value;
}
function readPath(value) {
	if (typeof value !== "string" || !value || value.includes("\0")) throw new Error("SQLite native resource requires a filesystem path");
	return value;
}
function readLaunch(value) {
	if (!isRecord(value) || !isRecord(value.env)) throw new Error("SQLite native resource requires captured launch facts");
	const entries = [];
	for (const [key, item] of Object.entries(value.env)) {
		if (!key || key.includes("=") || key.includes("\0") || item !== void 0 && (typeof item !== "string" || item.includes("\0"))) throw new Error("SQLite native resource received an invalid environment");
		entries.push([key, item]);
	}
	return {
		env: Object.fromEntries(entries),
		cwd: readPath(value.cwd)
	};
}
function readRequest(value) {
	if (!isRecord(value)) throw new Error("SQLite native resource requires a command");
	const id = readId(value.id);
	if (value.type === "copy.cancel") return {
		type: value.type,
		id
	};
	if (value.type === "directory.removed") return {
		type: value.type,
		id,
		directory: readPath(value.directory)
	};
	if (value.type === "session.close") return {
		type: value.type,
		id,
		session: readId(value.session)
	};
	if (value.type === "session.run" && (value.mode === "staging-create" || value.mode === "staging-create-legacy" || value.mode === "staging-retire" || value.mode === "staging-reconcile")) return {
		type: value.type,
		id,
		session: readId(value.session),
		pathname: readPath(value.pathname),
		...value.mode === "staging-create" || value.mode === "staging-create-legacy" ? {
			mode: value.mode,
			preparationId: readId(value.preparationId)
		} : { mode: value.mode }
	};
	if (value.type === "session.create" && isRecord(value.launch) && isRecord(value.launch.transport) && value.launch.transport.kind === "native" && (value.launch.retainLifetime === void 0 || typeof value.launch.retainLifetime === "boolean") && (value.launch.retainOnOperationError === void 0 || typeof value.launch.retainOnOperationError === "boolean")) return {
		type: value.type,
		id,
		session: readId(value.session),
		launch: {
			...readLaunch(value.launch),
			transport: { kind: "native" },
			retainLifetime: value.launch.retainLifetime,
			retainOnOperationError: value.launch.retainOnOperationError
		}
	};
	if (value.type === "copy.run" && (value.mode === "sync" || value.mode === "async") && isRecord(value.launch) && typeof value.launch.deadlineOwnedByCaller === "boolean") {
		const expectedSourceIdentity = value.expectedSourceIdentity === void 0 ? void 0 : readDatabaseFileIdentity(value.expectedSourceIdentity);
		if (expectedSourceIdentity && value.mode !== "sync") throw new Error("SQLite source identity requires artifact-preserving preparation");
		return {
			type: value.type,
			id,
			pathname: readPath(value.pathname),
			mode: value.mode,
			stagingRoot: value.stagingRoot === void 0 ? void 0 : readPath(value.stagingRoot),
			expectedSourceIdentity,
			launch: {
				...readLaunch(value.launch),
				deadlineOwnedByCaller: value.launch.deadlineOwnedByCaller
			}
		};
	}
	throw new Error("SQLite native resource received an unsupported command");
}
/** NativeLifetime installs this owner before delivering the port to its target Worker. */
function createNativeWorkerResource(port, input, ownerPort) {
	if (input !== void 0) throw new Error("SQLite native resource does not accept bootstrap input");
	if (!ownerPort) throw new Error("SQLite native resource requires its host cleanup owner");
	const sendOwnerMessage = ownerPort.postMessage.bind(ownerPort);
	const sessions = /* @__PURE__ */ new Map();
	const directories = /* @__PURE__ */ new Map();
	const uncertainAllocations = [];
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
	ownerPort.on("message", (value) => {
		if (!isRecord(value) || typeof value.id !== "number" || !Number.isSafeInteger(value.id) || value.id < 1 || value.ok !== true && value.ok !== false) {
			loseOwner();
			return;
		}
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
			const message = type === "allocated" ? {
				id,
				type,
				directory,
				preparationId: readId(preparationId)
			} : {
				id,
				type,
				directory
			};
			sendOwnerMessage(message);
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
			let result;
			try {
				result = await session.native.run(request.pathname, { mode: request.mode });
				if (allocating && (typeof result !== "string" || result.length === 0 || result.includes("\0"))) throw new Error("SQLite native allocation returned no exact directory");
			} catch (error) {
				if (allocating && !session.native.notStarted && !(error instanceof SqliteSnapshotAllocationRefusedError) && !isPrivateDirectoryCreationRefused(error)) uncertainAllocations.push(new SqliteSnapshotCleanupError("SQLite snapshot allocation has no exact directory receipt; cleanup is unresolved", { cause: error }));
				throw error;
			}
			if ((request.mode === "staging-create" || request.mode === "staging-create-legacy") && typeof result === "string") {
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
	const receive = (value) => {
		let request;
		try {
			request = readRequest(value);
		} catch (error) {
			if (isRecord(value) && typeof value.id === "number" && Number.isSafeInteger(value.id) && value.id > 0) fail(value.id, error);
			else {
				available = false;
				port.close();
			}
			return;
		}
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
				const failures = [...uncertainAllocations];
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
