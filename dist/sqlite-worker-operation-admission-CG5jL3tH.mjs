import { u as toErrorObject } from "./error-coercion-C787aVxk.mjs";
import { i as resolveGlobalSingleton } from "./global-singleton-Dc_stLtU.mjs";
import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { t as deferSqlitePostCommitPublication } from "./sqlite-post-commit-DJbkHzN8.mjs";
import { i as SqliteWorkerError } from "./sqlite-worker-contract-DgNznZvn.mjs";
import { AsyncLocalStorage } from "node:async_hooks";
import { MessageChannel, receiveMessageOnPort } from "node:worker_threads";
import { serialize } from "node:v8";
//#region src/infra/sqlite-worker-operation-admission.ts
const REQUESTED = 0;
const GRANTED = 1;
const REFUSED = 2;
/** Only the factory's admission before agent open may certify this refusal. */
const SqliteWorkerOpenRefusedError = resolveGlobalSingleton(Symbol.for("openclaw.sqliteWorkerOpenRefusedError"), () => class OpenRefusedError extends Error {
	constructor(originalError) {
		super("SQLite worker admission was refused before agent open", { cause: originalError });
		this.originalError = originalError;
		this.name = "SqliteWorkerOpenRefusedError";
	}
});
/** The caller retains real source custody before invoking the synchronous grant. */
function createSqliteWorkerOperationAdmission(admit, attachment) {
	const { port1, port2 } = new MessageChannel();
	if (attachment !== void 0) try {
		port1.postMessage({
			kind: "sqlite-operation-attachment",
			value: attachment
		}, []);
	} catch (error) {
		port1.close();
		port2.close();
		throw error;
	}
	const inOwnerContext = AsyncLocalStorage.snapshot();
	const decisions = /* @__PURE__ */ new Set();
	const cleanupFailures = [];
	let closed = false;
	let failure;
	let committed;
	let settlement;
	const waiting = new Int32Array(new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT));
	const refuse = (decision, error) => {
		if (Atomics.compareExchange(decision, 0, REQUESTED, REFUSED) === REQUESTED) {
			failure ??= error;
			Atomics.notify(decision, 0);
		} else if (Atomics.load(decision, 0) === GRANTED) cleanupFailures.push(error);
	};
	const receive = (message) => {
		if (isRecord(message) && message.kind === "native-commit") {
			if (!isRecord(message.committed) || settlement) {
				failure ??= new SqliteWorkerError("SQLite worker commit receipt is invalid", "outcome-unknown");
				return;
			}
			committed = { facts: message.committed.facts };
			return;
		}
		if (isRecord(message) && message.kind === "native-settlement") {
			const value = message.settlement;
			if (!isRecord(value) || value.kind !== "completed" && value.kind !== "unknown" || value.committed !== void 0 && !isRecord(value.committed) || settlement) {
				failure ??= new SqliteWorkerError("SQLite worker native settlement is invalid", "outcome-unknown");
				return;
			}
			if (isRecord(value.committed)) committed = { facts: value.committed.facts };
			settlement = {
				kind: value.kind,
				...committed ? { committed } : {}
			};
			return;
		}
		if (!isRecord(message) || !(message.decision instanceof SharedArrayBuffer) || message.decision.byteLength !== Int32Array.BYTES_PER_ELEMENT || message.stage !== "open" && message.stage !== "prepare" && message.stage !== "transaction" && message.stage !== "commit") {
			failure ??= new SqliteWorkerError("SQLite worker admission request is invalid", "unavailable");
			return;
		}
		const decision = new Int32Array(message.decision);
		decisions.add(decision);
		if (closed) {
			refuse(decision, new SqliteWorkerError("SQLite worker admission is closed", "closed"));
			return;
		}
		const request = {
			stage: message.stage,
			facts: message.facts
		};
		const grant = () => {
			if (closed) return false;
			const granted = Atomics.compareExchange(decision, 0, REQUESTED, GRANTED) === REQUESTED;
			if (granted) Atomics.notify(decision, 0);
			return granted;
		};
		try {
			inOwnerContext(admit, request, grant);
		} catch (error) {
			refuse(decision, error);
			return;
		} finally {
			decisions.delete(decision);
		}
		if (Atomics.load(decision, 0) === REQUESTED) refuse(decision, new SqliteWorkerError("SQLite worker admission was not granted", "closed"));
	};
	port1.on("message", receive);
	port1.unref();
	const service = () => {
		for (let queued = receiveMessageOnPort(port1); queued; queued = receiveMessageOnPort(port1)) receive(queued.message);
	};
	return {
		port: port2,
		get failure() {
			return failure;
		},
		get cleanupFailures() {
			return cleanupFailures;
		},
		get committed() {
			service();
			return committed;
		},
		get settlement() {
			return settlement;
		},
		waitForSettlement(deadlineMs) {
			while (true) {
				service();
				if (failure !== void 0) throw toErrorObject(failure, "SQLite worker admission failed");
				if (settlement?.kind === "completed") return settlement;
				const remaining = deadlineMs - performance.now();
				if (settlement?.kind === "unknown" || closed || remaining <= 0) throw new SqliteWorkerError("SQLite worker native settlement is unknown", "outcome-unknown");
				Atomics.wait(waiting, 0, 0, Math.min(5, remaining));
			}
		},
		service,
		finish() {
			closed = true;
			service();
			for (const decision of decisions) if (Atomics.load(decision, 0) === REQUESTED) refuse(decision, new SqliteWorkerError("SQLite worker admission is closed", "closed"));
			port1.close();
			port2.close();
		}
	};
}
const currentAdmission = resolveGlobalSingleton(Symbol.for("openclaw.sqliteWorkerOperationAdmission"), () => new AsyncLocalStorage());
/** Install only the private port belonging to the broker's currently executing operation. */
function withSqliteWorkerOperationAdmission(owner, operation) {
	const scope = {
		owner,
		port: owner.port,
		active: true
	};
	try {
		return currentAdmission.run(scope, operation);
	} finally {
		scope.active = false;
	}
}
/** Record facts only after the real transaction commits, before native settlement is announced. */
function deferSqliteWorkerCommitReceipt(database, facts) {
	const scope = currentAdmission.getStore();
	if (!scope?.active) throw new SqliteWorkerError("SQLite receipt requires its retained admission", "unavailable");
	if (serialize(facts).byteLength > 33554432) throw new SqliteWorkerError("SQLite worker commit receipt exceeds the transport limit", "overloaded");
	const captured = structuredClone(facts);
	if (!deferSqlitePostCommitPublication(database, () => {
		scope.owner.committed = { facts: captured };
		scope.owner.port.postMessage({
			kind: "native-commit",
			committed: scope.owner.committed
		}, []);
	})) throw new Error("SQLite worker receipt requires a transaction publication owner");
}
/** The executing worker calls this only after its backend's native settlement check. */
function settleSqliteWorkerOperationContext(owner, kind) {
	if (owner.settled) return;
	owner.settled = true;
	owner.port.postMessage({
		kind: "native-settlement",
		settlement: {
			kind,
			...owner.committed ? { committed: owner.committed } : {}
		}
	}, []);
}
/** Called on the SQLite worker, after transaction entry and before its row mutation. */
function requestSqliteWorkerOperationAdmission(request, transferList = []) {
	const scope = currentAdmission.getStore();
	if (!scope?.active) throw new SqliteWorkerError("SQLite operation requires its retained admission", "unavailable");
	const decision = new Int32Array(new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT));
	scope.port.postMessage({
		...request,
		decision: decision.buffer
	}, transferList);
	while (Atomics.load(decision, 0) === REQUESTED) Atomics.wait(decision, 0, REQUESTED);
	if (Atomics.load(decision, 0) !== GRANTED) throw new SqliteWorkerError("SQLite transaction admission was refused", "closed");
}
/** Consume owner-prepared data from this executing operation's private port. */
function takeSqliteWorkerOperationAdmissionAttachment() {
	const scope = currentAdmission.getStore();
	if (!scope?.active) throw new SqliteWorkerError("SQLite operation requires its retained admission", "unavailable");
	const message = receiveMessageOnPort(scope.port)?.message;
	if (!isRecord(message) || message.kind !== "sqlite-operation-attachment") throw new SqliteWorkerError("SQLite operation attachment is unavailable", "unavailable");
	return message.value;
}
//#endregion
export { settleSqliteWorkerOperationContext as a, requestSqliteWorkerOperationAdmission as i, createSqliteWorkerOperationAdmission as n, takeSqliteWorkerOperationAdmissionAttachment as o, deferSqliteWorkerCommitReceipt as r, withSqliteWorkerOperationAdmission as s, SqliteWorkerOpenRefusedError as t };
