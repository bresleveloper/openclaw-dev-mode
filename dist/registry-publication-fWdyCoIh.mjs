import { a as resolveGlobalSingleton } from "./global-singleton-DrXvEBww.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { n as registerListener, t as notifyListeners } from "./listeners-BogSNJ-R.mjs";
import { i as sqlPublicationAnchor } from "./sql-connection-DmQzXTVz.mjs";
import { a as publishSqliteCommittedState, o as stageSqliteCommittedPublication, s as stageSqliteTransactionState } from "./sqlite-post-commit-22SfWsLt.mjs";
import "./sqlite-worker-contract-DhDutMia.mjs";
import { a as deferSqliteWorkerCommitReceipt, o as observeSqliteWorkerCommittedFacts } from "./sqlite-worker-operation-admission-puNZKEvP.mjs";
import { a as readTrackedStateDatabaseIdentity } from "./openclaw-state-db-handle-B6qa1Bui.mjs";
import { n as hasSqliteCommitReceiptCoverage, t as createSqliteCommitReceipt } from "./sqlite-commit-receipt-DafgyYOc.mjs";
import { randomUUID } from "node:crypto";
import { AsyncLocalStorage } from "node:async_hooks";
import { serialize } from "node:v8";
//#region src/agents/sandbox/registry-publication.ts
const state = resolveGlobalSingleton(Symbol.for("openclaw.sandboxRegistryPublication"), () => ({
	sources: /* @__PURE__ */ new WeakMap(),
	capture: new AsyncLocalStorage(),
	installingFacts: 0,
	facts: /* @__PURE__ */ new Set()
}));
function receiptFor(database, changes) {
	let source = state.sources.get(database);
	if (!source) {
		source = {
			identity: readTrackedStateDatabaseIdentity(sqlPublicationAnchor(database))?.key ?? Symbol("sandbox-registry"),
			incarnation: randomUUID()
		};
		state.sources.set(database, source);
	}
	const facts = new Map(changes.map(({ key, fact }) => [key, fact]));
	return createSqliteCommitReceipt({
		source,
		domain: "sandbox-registry",
		keys: [...facts.keys()],
		readFact: (key) => facts.get(key)
	});
}
function installFacts(change) {
	const failures = [];
	state.installingFacts++;
	try {
		notifyListeners(state.facts, change, (error) => failures.push(error));
	} finally {
		state.installingFacts--;
	}
	if (failures.length) throw new AggregateError(failures, "Sandbox registry fact installation failed");
}
function publication(receipt) {
	let installed = receipt;
	return {
		installFacts: () => installFacts(installed),
		invalidate() {
			installed = {
				...receipt,
				facts: new Map([...receipt.facts.keys()].map((key) => [key, { kind: "unknown" }]))
			};
			installFacts(installed);
		},
		notify() {}
	};
}
/** Typed kernels publish rows; raw SQL/trigger writers remain incomplete and retain live guards. */
const sandboxRegistryPublication = {
	subscribeFacts(listener) {
		return registerListener(state.facts, listener);
	},
	stage(database, rows, removed = false) {
		if (state.installingFacts) throw new Error("Sandbox registry cannot mutate during fact installation");
		const changes = rows.map((row) => ({
			key: JSON.stringify([row.registry_kind, row.container_name]),
			fact: removed ? { kind: "absent" } : {
				kind: "postimage",
				value: { ...row }
			}
		}));
		if (!changes.length) return;
		const captured = state.capture.getStore();
		if (captured) {
			const start = captured.length;
			if (!stageSqliteTransactionState(database, {
				stage: () => captured.push(...changes),
				commit() {},
				rollback: () => captured.splice(start)
			})) throw new Error("Sandbox receipt capture requires its transaction owner");
		}
		const committed = publication(receiptFor(database, changes));
		if (!stageSqliteCommittedPublication(database, committed) && !database.isTransaction) publishSqliteCommittedState(committed);
	}
};
/** Capture the same postimages for native installation and transport, including no-op settlement. */
function withSandboxRegistryWorkerReceipt(database, write) {
	return state.capture.run([], () => {
		const result = write();
		const receipt = receiptFor(database, state.capture.getStore());
		deferSqliteWorkerCommitReceipt(database, serialize(receipt).byteLength <= 33554432 ? receipt : {
			kind: "unknown",
			identity: receipt.source.identity
		}, receipt.facts.size ? "commit" : "settlement");
		return result;
	});
}
function readReceipt(value, identity) {
	if (!isRecord(value) || !isRecord(value.source) || typeof value.source.incarnation !== "string" || !(value.facts instanceof Map) || !hasSqliteCommitReceiptCoverage(value, {
		source: {
			identity,
			incarnation: value.source.incarnation
		},
		domain: "sandbox-registry",
		keys: [...value.facts.keys()]
	}) || ![...value.facts].every(([key, fact]) => typeof key === "string" && (fact.kind === "absent" || fact.kind === "unknown" || fact.kind === "postimage" && isRecord(fact.value) && typeof fact.value.registry_kind === "string" && typeof fact.value.container_name === "string" && key === JSON.stringify([fact.value.registry_kind, fact.value.container_name])))) throw new Error("Sandbox registry commit receipt is invalid");
	return value;
}
/** Native settlement owns pending facts even when the ordinary worker reply is lost. */
function withSandboxRegistryPublication(factory, identity, assertCurrent) {
	return (operation) => {
		let owner;
		try {
			installFacts({
				kind: "pending",
				identity: identity(),
				operation
			});
			owner = factory(operation);
		} catch (error) {
			notifyListeners(state.facts, {
				kind: "settled",
				identity: identity(),
				operation,
				outcome: "unknown"
			});
			throw error;
		}
		const superseded = /* @__PURE__ */ new Set();
		let installing = false;
		let published = false;
		let unknown = false;
		const unsubscribe = sandboxRegistryPublication.subscribeFacts((change) => {
			if (installing) return;
			if ("kind" in change) {
				if (change.identity === identity() && (change.kind === "unknown" || change.kind === "settled" && change.outcome === "unknown")) unknown = true;
			} else if (change.source.identity === identity()) for (const key of change.facts.keys()) superseded.add(key);
		});
		let finished = false;
		const finish = owner.admission.finish.bind(owner.admission);
		owner.admission.finish = () => {
			try {
				finish();
			} finally {
				if (!finished) {
					finished = true;
					unsubscribe();
					notifyListeners(state.facts, {
						kind: "settled",
						identity: identity(),
						operation,
						outcome: published && !unknown && owner.admission.settlement?.kind === "completed" ? "published" : "unknown"
					});
				}
			}
		};
		observeSqliteWorkerCommittedFacts(owner.admission, ({ facts }) => {
			assertCurrent();
			if (isRecord(facts) && facts.kind === "unknown" && facts.identity === identity()) {
				unknown = true;
				installing = true;
				try {
					installFacts({
						kind: "unknown",
						identity: identity()
					});
					published = true;
				} finally {
					installing = false;
				}
				return;
			}
			const receipt = readReceipt(facts, identity());
			const installed = {
				...receipt,
				facts: new Map([...receipt.facts].map(([key, fact]) => [key, unknown || superseded.has(key) ? { kind: "unknown" } : fact]))
			};
			installing = true;
			try {
				publishSqliteCommittedState(publication(installed));
				published = true;
			} finally {
				installing = false;
			}
		});
		return owner;
	};
}
//#endregion
export { withSandboxRegistryPublication as n, withSandboxRegistryWorkerReceipt as r, sandboxRegistryPublication as t };
