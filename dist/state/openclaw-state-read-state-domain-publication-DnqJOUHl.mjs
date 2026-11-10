import { n as registerListener, s as resolveGlobalSingleton, t as notifyListeners } from "./openclaw-state-read-listeners-C6ALBiqg.mjs";
import "./openclaw-state-read-worker-cpu-DxXDPrAN.mjs";
import { B as stageSqliteTransactionState, R as publishSqliteCommittedState, z as stageSqliteCommittedPublication } from "./openclaw-state-read-sqlite-database-admission-BXby_hL9.mjs";
import { f as sqlPublicationAnchor } from "./openclaw-state-read-sqlite-reader-lifecycle-CGTFS3iz.mjs";
import { a as isRecord } from "./openclaw-state-read-record-coerce-DWp7lFsP.mjs";
import { a as readTrackedStateDatabaseIdentity } from "./openclaw-state-read-openclaw-state-db-handle-BSLzO3AU.mjs";
import { randomUUID } from "node:crypto";
import { AsyncLocalStorage } from "node:async_hooks";
import { serialize } from "node:v8";
//#region src/infra/sqlite-commit-receipt.ts
/** Capture from the transaction's postimages, without another database read. */
function createSqliteCommitReceipt(params) {
	return {
		version: 1,
		operationId: randomUUID(),
		source: params.source,
		domain: params.domain,
		facts: new Map([...new Set(params.keys)].map((key) => [key, params.readFact(key)]))
	};
}
/**
* Coverage is exact: an omitted key is unknown, never absence. Connection-local
* revisions and data_version are deliberately not compared across receipts.
*/
function hasSqliteCommitReceiptCoverage(receipt, expected) {
	if (!isRecord(receipt) || receipt.version !== 1 || typeof receipt.operationId !== "string" || !receipt.operationId || receipt.domain !== expected.domain || !isRecord(receipt.source) || receipt.source.identity !== expected.source.identity || receipt.source.incarnation !== expected.source.incarnation || !(receipt.facts instanceof Map)) return false;
	const keys = new Set(expected.keys);
	const facts = receipt.facts;
	return facts.size === keys.size && [...keys].every((key) => {
		const fact = facts.get(key);
		return isRecord(fact) && (fact.kind === "absent" || fact.kind === "unchanged" || fact.kind === "unknown" || fact.kind === "postimage" && "value" in fact);
	});
}
//#endregion
//#region src/state/state-domain-publication.ts
const batch = resolveGlobalSingleton(Symbol.for("openclaw.stateDomainPublicationBatch"), () => ({ current: void 0 }));
/** Shared staging mechanics only; domain owners retain projections and authority. */
function createStateDomainPublication(codec) {
	const publication = createKeyedStateDomainPublication({
		domain: codec.domain,
		sourceIdentity: codec.sourceIdentity,
		isFact: (key, fact) => fact.kind === "absent" || fact.kind === "postimage" && codec.isValue(fact.value) && codec.keyOf(fact.value) === key
	});
	return {
		...publication,
		stagePostimages(db, values) {
			publication.stagePostimages(db, values.map((value) => [codec.keyOf(value), value]));
		}
	};
}
/** Domains with compound keys keep their key policy outside the shared receipt lifecycle. */
function createKeyedStateDomainPublication(codec) {
	const state = resolveGlobalSingleton(Symbol.for(`openclaw.stateDomainPublication.${codec.domain}`), () => ({
		sources: /* @__PURE__ */ new WeakMap(),
		capture: new AsyncLocalStorage(),
		facts: /* @__PURE__ */ new Set(),
		observers: /* @__PURE__ */ new Set()
	}));
	const sourceFor = (db) => {
		const anchor = sqlPublicationAnchor(db);
		let source = state.sources.get(anchor);
		if (!source) {
			source = {
				identity: codec.sourceIdentity?.(db) ?? readTrackedStateDatabaseIdentity(db)?.key ?? Symbol(codec.domain),
				incarnation: randomUUID()
			};
			state.sources.set(anchor, source);
		}
		return source;
	};
	const receiptFor = (db, facts) => createSqliteCommitReceipt({
		source: sourceFor(db),
		domain: codec.domain,
		keys: [...facts.keys()],
		readFact: (key) => facts.get(key)
	});
	const install = (change) => {
		const errors = [];
		notifyListeners(state.facts, change, (error) => errors.push(error));
		if (errors.length) throw new AggregateError(errors, codec.installFailureMessage ?? "State domain fact installation failed");
	};
	const publication = (receipt) => {
		let change = {
			kind: "committed",
			receipt
		};
		return {
			installFacts: () => install(change),
			invalidate() {
				change = {
					kind: "unknown",
					identity: receipt.source.identity
				};
				install(change);
			},
			notify: () => notifyListeners(state.observers, change)
		};
	};
	const stage = (db, facts) => {
		if (!facts.size) return;
		const capture = state.capture.getStore();
		if (capture && sqlPublicationAnchor(capture.db) === sqlPublicationAnchor(db)) {
			const previous = new Map([...facts.keys()].map((key) => [key, capture.facts.get(key)]));
			if (!stageSqliteTransactionState(db, {
				stage() {
					for (const [key, fact] of facts) capture.facts.set(key, fact);
				},
				commit() {},
				rollback() {
					for (const [key, fact] of previous) if (fact) capture.facts.set(key, fact);
					else capture.facts.delete(key);
				}
			})) throw new Error("State domain capture requires its owning transaction");
		}
		const next = publication(receiptFor(db, facts));
		if (!stageSqliteCommittedPublication(db, next) && !db.isTransaction) publishSqliteCommittedState(next);
	};
	const readReceipt = (value, isFact = codec.isFact) => {
		if (!isRecord(value) || !isRecord(value.source) || typeof value.source.identity !== "string" || typeof value.source.incarnation !== "string" || !(value.facts instanceof Map) || !hasSqliteCommitReceiptCoverage(value, {
			source: {
				identity: value.source.identity,
				incarnation: value.source.incarnation
			},
			domain: codec.domain,
			keys: [...value.facts.keys()]
		}) || ![...value.facts].every(([key, fact]) => typeof key === "string" && isFact(key, fact))) throw new Error(codec.invalidReceiptMessage ?? "State domain commit receipt is invalid");
		return value;
	};
	return {
		receipt: receiptFor,
		stagePostimages(db, entries) {
			stage(db, new Map(entries.map(([key, value]) => [key, {
				kind: "postimage",
				value: structuredClone(value)
			}])));
		},
		stageDeletions(db, keys) {
			stage(db, new Map(keys.map((key) => [key, { kind: "absent" }])));
		},
		capture(db, operation) {
			const parent = state.capture.getStore();
			return state.capture.run(parent && sqlPublicationAnchor(parent.db) === sqlPublicationAnchor(db) ? parent : {
				db,
				facts: /* @__PURE__ */ new Map()
			}, () => {
				return {
					result: operation(),
					receipt: receiptFor(db, state.capture.getStore().facts)
				};
			});
		},
		/** Leave space for sibling domains and the operation's existing settlement metadata. */
		bound(receipt) {
			return serialize(receipt).byteLength <= 8388608 ? receipt : {
				kind: "unknown",
				identity: receipt.source.identity
			};
		},
		subscribeFacts: (listener) => registerListener(state.facts, listener),
		subscribe: (listener) => registerListener(state.observers, listener),
		begin(owner, isFact = codec.isFact) {
			const operationId = randomUUID();
			const superseded = /* @__PURE__ */ new Set();
			let installing = false;
			let unknown = false;
			let received = false;
			let finished = false;
			const unsubscribe = registerListener(state.facts, (change) => {
				if (installing) return;
				if (change.kind === "committed" && change.receipt.source.identity === owner.identity) for (const key of change.receipt.facts.keys()) superseded.add(key);
				else if (change.kind === "unknown" && change.identity === owner.identity) unknown = true;
			});
			try {
				if (owner.publishPending !== false) install({
					kind: "pending",
					identity: owner.identity,
					operationId
				});
			} catch (error) {
				unsubscribe();
				throw error;
			}
			return {
				committed(value, publish) {
					try {
						owner.assertCurrent();
						if (finished) throw new Error("State domain publication owner is closed");
						if (isRecord(value) && value.kind === "unknown" && value.identity === owner.identity) install({
							kind: "unknown",
							identity: owner.identity
						});
						else {
							const receipt = readReceipt(value, isFact);
							if (receipt.source.identity !== owner.identity) throw new Error("State domain commit receipt changed owner");
							const next = publication({
								...receipt,
								facts: new Map([...receipt.facts].map(([key, fact]) => [key, unknown || superseded.has(key) ? { kind: "unknown" } : fact]))
							});
							const queued = {
								...next,
								installFacts() {
									installing = true;
									try {
										next.installFacts();
									} finally {
										installing = false;
									}
								}
							};
							if (batch.current) batch.current.push(queued);
							else publishSqliteCommittedState(queued);
						}
						received = true;
						publish?.();
					} catch (error) {
						install({
							kind: "unknown",
							identity: owner.identity
						});
						throw error;
					} finally {
						installing = false;
					}
				},
				/** A confirmed rollback preserves prior facts; a missing accepted receipt does not. */
				finish(confirmed, rolledBack = false) {
					if (finished) return;
					finished = true;
					unsubscribe();
					try {
						if (!confirmed || !received && !rolledBack) install({
							kind: "unknown",
							identity: owner.identity
						});
					} finally {
						if (owner.publishPending !== false) install({
							kind: "settled",
							identity: owner.identity,
							operationId
						});
					}
				}
			};
		}
	};
}
//#endregion
export { createStateDomainPublication as n, createKeyedStateDomainPublication as t };
