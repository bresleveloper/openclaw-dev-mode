import { d as toErrorObject } from "./error-coercion-BwMr25F8.mjs";
import { a as resolveGlobalSingleton } from "./global-singleton-DrXvEBww.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { t as resolveIdentityPathViaExistingAncestorSync } from "./boundary-path-CAv_plX7.mjs";
import { n as StateDatabaseAdmissionPendingError } from "./gateway-state-owner-record-DMIM5DCR.mjs";
import { r as recordWorkerMessage } from "./worker-message-metrics-CcNXClPZ.mjs";
import { i as sqlPublicationAnchor } from "./sql-connection-DmQzXTVz.mjs";
import { F as retainSqliteDatabaseAdmissionLocation, H as withSqliteDatabaseAdmissionExchange, ht as readSqliteDatabaseAdmissions, i as captureSqliteDatabaseAdmissions, m as installSqliteDatabaseAdmissions, mt as createSqliteDatabaseAdmissionCursor, v as prepareSqliteDatabaseAdmission } from "./sqlite-database-admission-CqdNF9iE.mjs";
import { s as stageSqliteTransactionState } from "./sqlite-post-commit-22SfWsLt.mjs";
import { r as currentSqliteOperationTiming } from "./sqlite-reader-lifecycle-Cw11HwJP.mjs";
import { c as SqliteWorkerError, f as readSqliteWorkerMonotonicNs, s as SqliteWorkerAdmissionTimeoutError } from "./sqlite-worker-contract-DhDutMia.mjs";
import { i as getSqliteDatabaseAdmissionUpstream, n as exchangeDatabaseAdmissions, r as exchangeSqliteDatabaseAdmissions } from "./sqlite-worker-database-admission-relay-CPqKkejS.mjs";
import { i as readAgentDatabaseExecutionAuthority, n as readSqliteWorkerRequestCustody } from "./sqlite-worker-request-custody-Bj59t02j.mjs";
import { MessageChannel, MessagePort, receiveMessageOnPort } from "node:worker_threads";
import { AsyncLocalStorage } from "node:async_hooks";
import { serialize } from "node:v8";
//#region src/infra/sqlite-worker-operation-settlement.ts
function readNativeCommitReceipt(value) {
	if (!isRecord(value) || value.version !== 1 || typeof value.sequence !== "number" || !Number.isSafeInteger(value.sequence) || value.sequence < 1 || !Object.hasOwn(value, "facts")) return;
	return {
		version: 1,
		sequence: value.sequence,
		facts: value.facts
	};
}
const nativeCommitReceipts = resolveGlobalSingleton(Symbol.for("openclaw.sqliteWorkerNativeCommitReceipts"), () => /* @__PURE__ */ new WeakMap());
function deferSqliteWorkerNativeCommitReceipt(owner, database, facts, delivery) {
	const payloadBytes = serialize(facts).byteLength;
	if (payloadBytes > 33554432) throw new SqliteWorkerError("SQLite worker commit receipt exceeds the transport limit", "overloaded");
	const captured = structuredClone(facts);
	const anchor = sqlPublicationAnchor(database);
	const counts = owner.sourceReservations ? owner.pendingReceipts ??= /* @__PURE__ */ new Map() : void 0;
	const pending = (delta) => {
		if (!counts) return;
		const count = (counts.get(anchor) ?? 0) + delta;
		if (count === 0) counts.delete(anchor);
		else counts.set(anchor, count);
	};
	if (!stageSqliteTransactionState(anchor, {
		stage: () => pending(1),
		rollback: () => pending(-1),
		commit() {
			pending(-1);
			const receipt = {
				version: 1,
				sequence: (nativeCommitReceipts.get(owner)?.receipt.sequence ?? 0) + 1,
				facts: captured
			};
			const retained = {
				receipt,
				payloadBytes,
				delivered: false
			};
			nativeCommitReceipts.set(owner, retained);
			owner.committed = { facts: captured };
			if (delivery === "commit") {
				owner.port.postMessage({
					kind: "native-commit",
					committed: receipt,
					payloadBytes
				}, []);
				retained.delivered = true;
			}
		}
	})) throw new Error("SQLite worker receipt requires a transaction publication owner");
}
/** The executing worker calls this only after its backend's native settlement check. */
function settleSqliteWorkerOperationContext(owner, kind) {
	if (owner.settled) return;
	owner.settled = true;
	const retained = nativeCommitReceipts.get(owner);
	const pending = retained?.delivered ? void 0 : retained;
	owner.port.postMessage({
		kind: "native-settlement",
		settlement: {
			kind,
			...pending ? { committed: pending.receipt } : {}
		},
		payloadBytes: pending?.payloadBytes ?? 0
	}, []);
}
const currentSqliteWorkerOperationAdmission = resolveGlobalSingleton(Symbol.for("openclaw.sqliteWorkerOperationAdmission"), () => new AsyncLocalStorage());
//#endregion
//#region src/infra/sqlite-writer-admission-client.ts
const REQUESTED$1 = 0;
const GRANTED$1 = 1;
const TIMED_OUT$1 = 3;
function assertRequestCustody(owner) {
	if (owner.requestCustody && !readSqliteWorkerRequestCustody(owner.requestCustody)) {
		const refusal = new SqliteWorkerError("SQLite worker request custody is revoked", "closed");
		owner.refusal = refusal;
		throw refusal;
	}
	if (owner.executionAuthority && !readAgentDatabaseExecutionAuthority(owner.executionAuthority)) {
		const refusal = new SqliteWorkerError("SQLite execution authority is revoked", "closed");
		owner.refusal = refusal;
		throw refusal;
	}
}
/** Ask the live host owner for a native stage; preparation precedes writer-lock acquisition. */
function requestSqliteWorkerOperationAdmission(request, transferList = []) {
	const scope = currentSqliteWorkerOperationAdmission.getStore();
	if (!scope?.active) throw new SqliteWorkerError("SQLite operation requires its retained admission", "unavailable");
	if (scope.owner.sourceReservations) throw new SqliteWorkerError("SQLite source reservations prohibit host admission", "closed");
	assertRequestCustody(scope.owner);
	const decision = new Int32Array(new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT));
	const startedAt = Date.now();
	const deadlineNs = request.deadlineMs === void 0 ? void 0 : readSqliteWorkerMonotonicNs() + BigInt(request.deadlineMs) * 1000000n;
	scope.port.postMessage({
		...request,
		decision: decision.buffer,
		ports: transferList.filter((value) => value instanceof MessagePort)
	}, transferList);
	while (Atomics.load(decision, 0) === REQUESTED$1) {
		const remainingMs = deadlineNs === void 0 ? void 0 : Number(deadlineNs - readSqliteWorkerMonotonicNs()) / 1e6;
		if (remainingMs !== void 0 && remainingMs <= 0) Atomics.compareExchange(decision, 0, REQUESTED$1, TIMED_OUT$1);
		else Atomics.wait(decision, 0, REQUESTED$1, remainingMs);
	}
	const timing = currentSqliteOperationTiming();
	if (timing) timing.hostAdmissionWaitMs += Date.now() - startedAt;
	const outcome = Atomics.load(decision, 0);
	if (outcome === 4 && request.stage === "prepare" && isRecord(request.facts) && request.facts.kind === "schema-maintenance" && typeof request.facts.databasePath === "string") {
		const databasePath = request.facts.databasePath;
		throw new StateDatabaseAdmissionPendingError(databasePath, `OpenClaw state at ${databasePath} is undergoing schema admission; retry when it finishes.`);
	}
	if (outcome !== GRANTED$1) {
		const refusal = outcome === TIMED_OUT$1 ? new SqliteWorkerAdmissionTimeoutError() : new SqliteWorkerError("SQLite transaction admission was refused", "closed");
		scope.owner.refusal = refusal;
		throw refusal;
	}
	assertRequestCustody(scope.owner);
}
//#endregion
//#region src/infra/sqlite-worker-operation-admission.ts
const REQUESTED = 0;
const GRANTED = 1;
const REFUSED = 2;
const TIMED_OUT = 3;
const commitObserverBindings = /* @__PURE__ */ new WeakMap();
const executionAuthorities = resolveGlobalSingleton(Symbol.for("openclaw.sqliteWorkerExecutionAuthorities"), () => /* @__PURE__ */ new WeakMap());
function bindSqliteWorkerExecutionAuthority(admission, authority) {
	if (executionAuthorities.has(admission)) throw new SqliteWorkerError("SQLite execution authority is already bound", "closed");
	executionAuthorities.set(admission, Object.freeze(authority));
}
function readSqliteWorkerExecutionAuthority(admission) {
	return executionAuthorities.get(admission);
}
/** Private publication binding leaves released SDK admission factories structurally unchanged. */
function observeSqliteWorkerCommittedFacts(admission, observer) {
	const bind = commitObserverBindings.get(admission);
	if (!bind) throw new SqliteWorkerError("SQLite admission has no native receipt owner", "unavailable");
	bind(observer);
}
/** The optional continuation runs under live host authority before releasing the native writer. */
const createSqliteWorkerOperationAdmission = (admit, attachment) => createOperationAdmission(admit, attachment);
/** Task lifetime channels relay a broker's creation grant without acquiring database authority. */
function createSqliteDatabaseAdmissionRelay(assertCurrent) {
	return createOperationAdmission(() => {
		throw new Error("Worker format facts do not grant database authority");
	}, void 0, assertCurrent);
}
function createOperationAdmission(admit, attachment, assertRelayCurrent) {
	const { port1, port2 } = new MessageChannel();
	const inOwnerContext = AsyncLocalStorage.snapshot();
	const decisions = /* @__PURE__ */ new Set();
	const databaseAdmissionCursor = createSqliteDatabaseAdmissionCursor();
	const cleanupFailures = [];
	let closed = false;
	let started = false;
	let observeRequest;
	const commitObservers = [];
	let observingCommit = false;
	let failure;
	let committed;
	let nativeReceipt;
	let settlement;
	let databaseAuthority;
	const waiting = new Int32Array(new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT));
	const recordFailure = (error, source) => {
		if (!failure || failure.source === "domain" && source !== "domain") failure = {
			error,
			source
		};
	};
	const refuse = (decision, error, source) => {
		if (Atomics.compareExchange(decision, 0, REQUESTED, REFUSED) === REQUESTED) {
			recordFailure(error, source);
			Atomics.notify(decision, 0);
		} else if (Atomics.load(decision, 0) === GRANTED) cleanupFailures.push(error);
	};
	const invalidProtocol = (kind, code = "outcome-unknown") => recordFailure(new SqliteWorkerError(`SQLite worker ${kind} is invalid`, code), "protocol");
	const installCommitted = (receipt) => {
		if (nativeReceipt && receipt.sequence <= nativeReceipt.sequence) return;
		nativeReceipt = receipt;
		const publication = { facts: receipt.facts };
		committed = publication;
		observingCommit = true;
		try {
			inOwnerContext(() => {
				for (const observer of commitObservers) observer(publication);
			});
		} catch (error) {
			recordFailure(Object.assign(new SqliteWorkerError("SQLite committed facts publication failed", "outcome-unknown"), { cause: error }), "protocol");
		} finally {
			observingCommit = false;
		}
	};
	const receive = (message) => {
		recordWorkerMessage(isRecord(message) && message.kind === "sqlite-database-admissions" ? "admission" : "authority", "from_worker", isRecord(message) && typeof message.payloadBytes === "number" ? message.payloadBytes : void 0);
		started = true;
		if (isRecord(message) && message.kind === "sqlite-database-admissions") {
			if (!(message.port instanceof MessagePort) || !(message.decision instanceof SharedArrayBuffer) || message.decision.byteLength !== Int32Array.BYTES_PER_ELEMENT || message.location !== void 0 && typeof message.location !== "string" || message.create !== void 0 && typeof message.create !== "boolean" && message.create !== "admitted") {
				recordFailure(new SqliteWorkerError("SQLite admission facts request is invalid", "unavailable"), "protocol");
				return;
			}
			const decision = new Int32Array(message.decision);
			let coldOpenPath;
			try {
				if (closed) throw new SqliteWorkerError("SQLite worker admission is closed", "closed");
				const assertRelayCreation = message.create === "admitted" ? assertRelayCurrent : void 0;
				if (message.create === "admitted" && !assertRelayCreation) throw new SqliteWorkerError("SQLite creation relay is not admitted", "closed");
				const admissions = readSqliteDatabaseAdmissions(message.admissions);
				if (!admissions) throw new SqliteWorkerError("SQLite admission facts request is invalid", "unavailable");
				installSqliteDatabaseAdmissions(admissions);
				let location = message.location;
				let create = false;
				if (message.location && message.create && !prepareSqliteDatabaseAdmission(message.location)) {
					location = resolveIdentityPathViaExistingAncestorSync(message.location);
					const creationLocation = location;
					const authority = databaseAuthority;
					const assertCreate = authority?.assertCreate?.bind(authority);
					if (message.create === "admitted") create = true;
					else if (authority && assertCreate) {
						if (authority.coldOpenPath && resolveIdentityPathViaExistingAncestorSync(authority.coldOpenPath) === creationLocation) coldOpenPath = authority.coldOpenPath;
						inOwnerContext(() => {
							authority.assertRequest?.();
							authority.assertAccess();
							assertCreate(creationLocation);
						});
						coldOpenPath = void 0;
						create = true;
					}
				}
				if (create) assertRelayCreation?.();
				if (closed) throw new SqliteWorkerError("SQLite worker admission is closed", "closed");
				const upstream = getSqliteDatabaseAdmissionUpstream();
				if (upstream) {
					if (upstream.closed) throw new SqliteWorkerError("SQLite admission upstream is closed", "closed");
					installSqliteDatabaseAdmissions(exchangeDatabaseAdmissions(upstream.port, admissions, location, create ? "admitted" : void 0));
				} else if (location) try {
					if (create) prepareSqliteDatabaseAdmission(location, { create: true });
					retainSqliteDatabaseAdmissionLocation(location);
				} catch (error) {
					if (!isRecord(error) || error.code !== "ENOENT") throw error;
				}
				const scope = message.location === void 0 ? void 0 : {
					location: message.location,
					admissions
				};
				const reply = captureSqliteDatabaseAdmissions(databaseAdmissionCursor, scope);
				message.port.postMessage(reply, []);
				recordWorkerMessage("admission", "to_worker");
				Atomics.store(decision, 0, GRANTED);
			} catch (error) {
				if (error instanceof StateDatabaseAdmissionPendingError && error.databasePath === coldOpenPath) Atomics.store(decision, 0, 4);
				else {
					recordFailure(error, "protocol");
					Atomics.store(decision, 0, REFUSED);
				}
			} finally {
				message.port.close();
				Atomics.notify(decision, 0);
			}
			return;
		}
		if (isRecord(message) && message.kind === "native-commit") {
			const receipt = readNativeCommitReceipt(message.committed);
			if (!receipt) {
				invalidProtocol("commit receipt");
				return;
			}
			installCommitted(receipt);
			return;
		}
		if (isRecord(message) && message.kind === "native-settlement") {
			const value = message.settlement;
			const receipt = isRecord(value) ? readNativeCommitReceipt(value.committed) : void 0;
			if (!isRecord(value) || value.kind !== "completed" && value.kind !== "unknown" || value.committed !== void 0 && !receipt) {
				invalidProtocol("native settlement");
				return;
			}
			if (receipt) installCommitted(receipt);
			settlement = {
				kind: value.kind,
				...committed ? { committed } : {}
			};
			return;
		}
		if (!isRecord(message) || !(message.decision instanceof SharedArrayBuffer) || message.decision.byteLength !== Int32Array.BYTES_PER_ELEMENT || message.stage !== "open" && message.stage !== "prepare" && message.stage !== "transaction" && message.stage !== "commit") {
			invalidProtocol("admission request", "unavailable");
			return;
		}
		const decision = new Int32Array(message.decision);
		const deadlineNs = typeof message.deadlineMs === "number" && Number.isFinite(message.deadlineMs) ? readSqliteWorkerMonotonicNs() + BigInt(Math.max(0, Math.ceil(message.deadlineMs))) * 1000000n : void 0;
		const expired = () => {
			if (deadlineNs !== void 0 && readSqliteWorkerMonotonicNs() >= deadlineNs) {
				if (Atomics.compareExchange(decision, 0, REQUESTED, TIMED_OUT) === REQUESTED) Atomics.notify(decision, 0);
			}
			if (Atomics.load(decision, 0) !== TIMED_OUT) return false;
			if (Array.isArray(message.ports)) {
				for (const port of message.ports) if (port instanceof MessagePort) port.close();
			}
			return true;
		};
		if (expired()) return;
		decisions.add(decision);
		const request = {
			stage: message.stage,
			facts: message.facts
		};
		try {
			inOwnerContext(() => observeRequest?.(request));
		} catch (error) {
			refuse(decision, error, "domain");
			return;
		}
		if (closed) {
			refuse(decision, new SqliteWorkerError("SQLite worker admission is closed", "closed"), "authority");
			return;
		}
		const grant = (beforeRelease) => {
			if (closed || expired() || Atomics.load(decision, 0) !== REQUESTED) return false;
			try {
				inOwnerContext(() => databaseAuthority?.assertAccess());
			} catch (error) {
				refuse(decision, error, "authority");
				return false;
			}
			if (closed || expired() || Atomics.load(decision, 0) !== REQUESTED) return false;
			beforeRelease?.();
			if (expired()) return false;
			const granted = Atomics.compareExchange(decision, 0, REQUESTED, GRANTED) === REQUESTED;
			if (granted) Atomics.notify(decision, 0);
			return granted;
		};
		let source = "authority";
		try {
			inOwnerContext(() => {
				databaseAuthority?.assertRequest?.();
				databaseAuthority?.assertAccess();
			});
			if (request.stage === "prepare" && isRecord(request.facts) && request.facts.kind === "schema-maintenance") {
				const authority = databaseAuthority;
				if (!authority || typeof request.facts.databasePath !== "string" || resolveIdentityPathViaExistingAncestorSync(request.facts.databasePath) !== authority.databasePath) throw new SqliteWorkerError("SQLite schema maintenance target differs from its admitted database", "closed");
				inOwnerContext(() => {
					authority.lease ??= authority.acquireSchema();
					authority.lease.assertCurrent();
					grant();
				});
			} else {
				source = "domain";
				inOwnerContext(admit, request, grant);
			}
		} catch (error) {
			if (error instanceof StateDatabaseAdmissionPendingError && databaseAuthority?.coldOpenPath === error.databasePath && !databaseAuthority.lease && request.stage === "prepare" && isRecord(request.facts) && request.facts.kind === "schema-maintenance" && typeof request.facts.databasePath === "string" && resolveIdentityPathViaExistingAncestorSync(request.facts.databasePath) === databaseAuthority.databasePath) {
				if (Atomics.compareExchange(decision, 0, REQUESTED, 4) === REQUESTED) Atomics.notify(decision, 0);
			} else refuse(decision, error, source);
			return;
		} finally {
			decisions.delete(decision);
		}
		if (Atomics.load(decision, 0) === REQUESTED) refuse(decision, new SqliteWorkerError("SQLite worker admission was not granted", "closed"), "domain");
	};
	port1.on("message", receive).unref();
	const service = () => {
		if (observingCommit) return;
		for (let queued = receiveMessageOnPort(port1); queued; queued = receiveMessageOnPort(port1)) receive(queued.message);
	};
	const admission = {
		port: port2,
		attachment: attachment === void 0 ? void 0 : { value: attachment },
		observeRequests(observer) {
			if (closed || observeRequest) throw new SqliteWorkerError("SQLite request observation is already bound or closed", "closed");
			observeRequest = observer;
		},
		bindDatabaseAuthority(authority) {
			if (closed || databaseAuthority) throw new SqliteWorkerError("SQLite database authority is already bound or closed", "closed");
			databaseAuthority = { ...authority };
		},
		get failure() {
			return failure?.error;
		},
		get failureSource() {
			return failure?.source;
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
				if (failure !== void 0) throw toErrorObject(failure.error, "SQLite worker admission failed");
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
			for (const decision of decisions) if (Atomics.load(decision, 0) === REQUESTED) refuse(decision, new SqliteWorkerError("SQLite worker admission is closed", "closed"), "authority");
			port1.close();
			port2.close();
			if (databaseAuthority?.lease) try {
				databaseAuthority.lease.release();
				databaseAuthority.lease = void 0;
			} catch (error) {
				cleanupFailures.push(error);
			}
		}
	};
	commitObserverBindings.set(admission, (observer) => {
		if (closed || started) throw new SqliteWorkerError("SQLite commit observation is closed or started", "closed");
		commitObservers.push(observer);
	});
	return admission;
}
/** Install only the private port belonging to the broker's currently executing operation. */
function withSqliteWorkerOperationAdmission(owner, operation) {
	const scope = {
		owner,
		port: owner.port,
		active: true
	};
	try {
		return runSqliteWorkerAdmissionScope(scope, operation);
	} finally {
		scope.active = false;
	}
}
/** Async factories and cleanup retain the same grant until their accepted work settles. */
async function withSqliteWorkerOperationAdmissionAsync(owner, operation) {
	const scope = {
		owner,
		port: owner.port,
		active: true
	};
	try {
		return await runSqliteWorkerAdmissionScope(scope, operation);
	} finally {
		scope.active = false;
	}
}
function runSqliteWorkerAdmissionScope(scope, operation) {
	return currentSqliteWorkerOperationAdmission.run(scope, () => withSqliteDatabaseAdmissionExchange((admissions, location, create) => {
		if (!scope.active) {
			const upstream = getSqliteDatabaseAdmissionUpstream();
			if (create || !upstream || upstream.closed) throw new SqliteWorkerError("SQLite facts require their retained admission", "unavailable");
			return exchangeDatabaseAdmissions(upstream.port, admissions, location);
		}
		return exchangeSqliteDatabaseAdmissions(scope.port, admissions, location, create);
	}, operation));
}
/** Record facts only after the real transaction commits, before native settlement is announced. */
function deferSqliteWorkerCommitReceipt(database, facts, delivery = "commit") {
	const scope = currentSqliteWorkerOperationAdmission.getStore();
	if (!scope?.active) throw new SqliteWorkerError("SQLite receipt requires its retained admission", "unavailable");
	deferSqliteWorkerNativeCommitReceipt(scope.owner, database, facts, delivery);
}
/** A typed fenced write cannot commit without its destination owner's settlement evidence. */
function assertSqliteWorkerCommitReceiptPending(database) {
	const scope = currentSqliteWorkerOperationAdmission.getStore();
	if (!scope?.active || !scope.owner.pendingReceipts?.get(sqlPublicationAnchor(database))) throw new SqliteWorkerError("SQLite source fence requires a destination commit receipt", "closed");
}
/** Schema work borrows live host authority through the same retained job port. */
function requestSqliteWorkerSchemaMaintenance(databasePath) {
	if (!currentSqliteWorkerOperationAdmission.getStore()) return false;
	requestSqliteWorkerOperationAdmission({
		stage: "prepare",
		facts: {
			kind: "schema-maintenance",
			databasePath
		}
	});
	return true;
}
/** Require owner-prepared data carried by this operation's command envelope. */
function takeSqliteWorkerOperationAdmissionAttachment() {
	const scope = currentSqliteWorkerOperationAdmission.getStore();
	if (!scope?.active) throw new SqliteWorkerError("SQLite operation requires its retained admission", "unavailable");
	if (!scope.owner.attachment) throw new SqliteWorkerError("SQLite operation attachment is unavailable", "unavailable");
	return scope.owner.attachment.value;
}
//#endregion
export { deferSqliteWorkerCommitReceipt as a, requestSqliteWorkerSchemaMaintenance as c, withSqliteWorkerOperationAdmissionAsync as d, requestSqliteWorkerOperationAdmission as f, createSqliteWorkerOperationAdmission as i, takeSqliteWorkerOperationAdmissionAttachment as l, settleSqliteWorkerOperationContext as m, bindSqliteWorkerExecutionAuthority as n, observeSqliteWorkerCommittedFacts as o, currentSqliteWorkerOperationAdmission as p, createSqliteDatabaseAdmissionRelay as r, readSqliteWorkerExecutionAuthority as s, assertSqliteWorkerCommitReceiptPending as t, withSqliteWorkerOperationAdmission as u };
