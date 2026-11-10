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
//#region src/agents/worktrees/capacity-contract.ts
const WORKTREE_CREATE_LEASE_SCOPE = "core:managed-worktrees:create";
const WORKTREE_MUTATION_LEASE_SCOPE = "core:managed-worktrees:mutation";
const WORKTREE_CAPACITY_RESERVATION_SCOPE = "core:managed-worktrees:capacity-reservations";
//#endregion
//#region src/agents/worktrees/registry-publication.ts
const state = resolveGlobalSingleton(Symbol.for("openclaw.worktreeRegistryPublication"), () => ({
	sources: /* @__PURE__ */ new WeakMap(),
	capture: new AsyncLocalStorage(),
	facts: /* @__PURE__ */ new Set(),
	installing: false
}));
function sourceFor(db) {
	let source = state.sources.get(db);
	if (!source) {
		source = {
			identity: readTrackedStateDatabaseIdentity(sqlPublicationAnchor(db))?.key ?? Symbol("untracked-worktree-registry"),
			incarnation: randomUUID()
		};
		state.sources.set(db, source);
	}
	return source;
}
function keyFor(row) {
	return "id" in row ? JSON.stringify(["worktrees", row.id]) : JSON.stringify([
		"state_leases",
		row.scope,
		row.lease_key
	]);
}
function captureReceipt(db, facts) {
	return createSqliteCommitReceipt({
		source: sourceFor(db),
		domain: "worktree-registry",
		keys: [...facts.keys()],
		readFact: (key) => facts.get(key)
	});
}
function install(change) {
	const failures = [];
	state.installing = true;
	try {
		notifyListeners(state.facts, change, (error) => failures.push(error));
	} finally {
		state.installing = false;
	}
	if (failures.length) throw new AggregateError(failures, "Worktree registry fact installation failed");
}
function publication(receipt) {
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
		notify() {}
	};
}
/** Exact owner-written rows only; raw writes and protecting session/placement sets remain separate. */
const worktreeRegistryPublication = {
	subscribeFacts: (listener) => registerListener(state.facts, listener),
	rows(db, rows) {
		stage(db, new Map(rows.map((row) => [keyFor(row), {
			kind: "postimage",
			value: { ...row }
		}])));
	},
	deleted(db, rows) {
		stage(db, new Map(rows.map((row) => [keyFor(row), { kind: "absent" }])));
	}
};
function stage(db, facts) {
	if (!facts.size) return;
	if (state.installing) throw new Error("Worktree registry cannot mutate during fact installation");
	const capture = state.capture.getStore();
	if (capture) {
		const previous = new Map([...facts.keys()].map((key) => [key, capture.get(key)]));
		stageSqliteTransactionState(db, {
			stage: () => facts.forEach((fact, key) => capture.set(key, fact)),
			commit() {},
			rollback: () => previous.forEach((fact, key) => fact ? capture.set(key, fact) : capture.delete(key))
		});
	}
	const next = publication(captureReceipt(db, facts));
	if (!stageSqliteCommittedPublication(db, next) && !db.isTransaction) publishSqliteCommittedState(next);
}
/** The result and existing operation token survive ordinary reply loss without replaying the write. */
function withWorktreeRegistryWorkerReceipt(db, write, receipt) {
	return state.capture.run(/* @__PURE__ */ new Map(), () => {
		const result = write();
		const facts = state.capture.getStore();
		const committed = captureReceipt(db, facts);
		const payload = {
			receipt,
			result: {
				kind: "known",
				value: result
			},
			publication: committed
		};
		if (serialize(payload).byteLength > 33554432) {
			payload.publication = {
				kind: "unknown",
				identity: committed.source.identity
			};
			if (serialize(payload).byteLength > 33554432) payload.result = { kind: "unknown" };
		}
		deferSqliteWorkerCommitReceipt(db, payload, facts.size ? "commit" : "settlement");
		return result;
	});
}
function readWorktreeRegistryWorkerReceipt(value) {
	if (!isRecord(value) || !isRecord(value.result) || !isRecord(value.publication) || value.receipt !== void 0 && typeof value.receipt !== "string" || value.result.kind !== "unknown" && !(value.result.kind === "known" && Object.hasOwn(value.result, "value"))) return;
	const receipt = value.publication;
	const result = value.result.kind === "known" ? {
		kind: "known",
		value: value.result.value
	} : { kind: "unknown" };
	if (receipt.kind === "unknown" && typeof receipt.identity === "string") return {
		publication: {
			kind: "unknown",
			identity: receipt.identity
		},
		result,
		receipt: value.receipt
	};
	if (!isRecord(receipt.source) || typeof receipt.source.identity !== "string" || typeof receipt.source.incarnation !== "string" || !(receipt.facts instanceof Map) || !hasSqliteCommitReceiptCoverage(receipt, {
		source: {
			identity: receipt.source.identity,
			incarnation: receipt.source.incarnation
		},
		domain: "worktree-registry",
		keys: [...receipt.facts.keys()]
	}) || ![...receipt.facts].every(([key, fact]) => {
		if (typeof key !== "string") return false;
		if (fact.kind === "absent") return true;
		if (fact.kind !== "postimage" || !isRecord(fact.value)) return false;
		const row = fact.value;
		return typeof row.id === "string" ? keyFor({ id: row.id }) === key : typeof row.scope === "string" && typeof row.lease_key === "string" && keyFor({
			scope: row.scope,
			lease_key: row.lease_key
		}) === key;
	})) return;
	return {
		publication: receipt,
		result,
		receipt: value.receipt
	};
}
function withWorktreeRegistryPublication(createAdmission, context) {
	return (operation) => {
		const owner = createAdmission(operation);
		const identity = () => context.admission.identity.key;
		const superseded = /* @__PURE__ */ new Set();
		let installing = false;
		let unknown = false;
		let received = false;
		const unsubscribe = worktreeRegistryPublication.subscribeFacts((change) => {
			if (installing) return;
			if (change.kind === "committed" && change.receipt.source.identity === identity()) change.receipt.facts.forEach((_fact, key) => superseded.add(key));
			else if (change.kind === "unknown" && change.identity === identity()) unknown = true;
		});
		const finish = owner.admission.finish.bind(owner.admission);
		let finished = false;
		owner.admission.finish = () => {
			try {
				finish();
			} finally {
				if (!finished) {
					finished = true;
					unsubscribe();
					if (!received || owner.admission.settlement?.kind !== "completed") install({
						kind: "unknown",
						identity: identity()
					});
					install({
						kind: "settled",
						identity: identity(),
						operation
					});
				}
			}
		};
		try {
			install({
				kind: "pending",
				identity: identity(),
				operation
			});
		} catch (error) {
			owner.admission.finish();
			throw error;
		}
		observeSqliteWorkerCommittedFacts(owner.admission, ({ facts }) => {
			const committed = readWorktreeRegistryWorkerReceipt(facts);
			if (!committed) throw new Error("Worktree registry receipt is invalid");
			(context.assertPublicationCurrent ?? context.admission.assertCurrent)();
			const receipt = committed.publication;
			if (("kind" in receipt ? receipt.identity : receipt.source.identity) !== identity()) throw new Error("Worktree registry receipt changed owner");
			installing = true;
			try {
				if ("kind" in receipt) install(receipt);
				else publishSqliteCommittedState(publication({
					...receipt,
					facts: new Map([...receipt.facts].map(([key, fact]) => [key, unknown || superseded.has(key) ? { kind: "unknown" } : fact]))
				}));
				received = true;
			} finally {
				installing = false;
			}
		});
		return owner;
	};
}
//#endregion
export { WORKTREE_CAPACITY_RESERVATION_SCOPE as a, worktreeRegistryPublication as i, withWorktreeRegistryPublication as n, WORKTREE_CREATE_LEASE_SCOPE as o, withWorktreeRegistryWorkerReceipt as r, WORKTREE_MUTATION_LEASE_SCOPE as s, readWorktreeRegistryWorkerReceipt as t };
