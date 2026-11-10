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
import { toUSVString } from "node:util";
import { serialize } from "node:v8";
//#region src/plugin-state/plugin-state-publication.ts
const state = resolveGlobalSingleton(Symbol.for("openclaw.pluginStatePublication"), () => ({
	sources: /* @__PURE__ */ new WeakMap(),
	capture: new AsyncLocalStorage(),
	reads: new AsyncLocalStorage(),
	installingFacts: 0,
	pending: /* @__PURE__ */ new Map(),
	unavailable: /* @__PURE__ */ new Set(),
	facts: /* @__PURE__ */ new Set(),
	observers: /* @__PURE__ */ new Set()
}));
function sourceFor(db) {
	const anchor = sqlPublicationAnchor(db);
	let source = state.sources.get(anchor);
	if (!source) {
		source = {
			identity: readTrackedStateDatabaseIdentity(anchor)?.key ?? Symbol("untracked-plugin-state"),
			incarnation: randomUUID()
		};
		state.sources.set(anchor, source);
	}
	return source;
}
/** Match SQLite text binding without changing public comparison-token scopes. */
function pluginStatePublicationKey(row) {
	return JSON.stringify([
		row.plugin_id,
		row.namespace,
		toUSVString(row.entry_key)
	]);
}
function captureReceipt(db, facts) {
	return createSqliteCommitReceipt({
		source: sourceFor(db),
		domain: "plugin-state",
		keys: [...facts.keys()],
		readFact: (key) => facts.get(key)
	});
}
function install(change) {
	if (change.kind === "pending") {
		const pending = state.pending.get(change.identity) ?? /* @__PURE__ */ new Set();
		pending.add(change.operationId);
		state.pending.set(change.identity, pending);
	} else if (change.kind === "settled") {
		const pending = state.pending.get(change.identity);
		pending?.delete(change.operationId);
		if (!pending?.size) state.pending.delete(change.identity);
	} else if (change.kind === "unknown") state.unavailable.add(change.identity);
	const errors = [];
	state.installingFacts++;
	try {
		notifyListeners(state.facts, change, (error) => errors.push(error));
	} finally {
		state.installingFacts--;
	}
	if (errors.length) throw new AggregateError(errors, "Plugin state fact installation failed");
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
		notify: () => notifyListeners(state.observers, change)
	};
}
/** Owns committed-fact staging and observation; raw/foreign authority remains separate. */
const pluginStatePublication = {
	stagePostimage: stagePluginStatePostimage,
	stageDeletions: stagePluginStateDeletions,
	/** Install/invalidate prepared facts only; storage mutations belong in postcommit observers. */
	subscribeFacts: (listener) => registerListener(state.facts, listener),
	subscribe: (listener) => registerListener(state.observers, listener)
};
/** Record the actual keyed store read without opening or inspecting another database. */
function recordPluginStateReadDependency(dependency) {
	const capture = state.reads.getStore();
	if (!capture) return;
	if (!capture.accepting) throw new Error("Plugin state read capture has ended");
	capture.keyCount += dependency.keys.length;
	if (capture.keyCount > 1e4) throw new Error("Plugin state ownership reads exceeded 10,000 dependency keys");
	const { assertCurrent, ...source } = dependency;
	capture.dependencies.push({
		...source,
		keys: [...source.keys]
	});
	if (assertCurrent) capture.assertions.push(assertCurrent);
}
/** Pending work is not new committed truth; indeterminate outcomes retire the whole source. */
function pluginStateReadDependenciesAffected(dependencies, change) {
	if (change.kind === "pending" || change.kind === "settled") return false;
	const identity = change.kind === "committed" ? change.receipt.source.identity : change.identity;
	return dependencies.some((dependency) => {
		if (dependency.identity !== void 0 && dependency.identity !== identity) return false;
		if (change.kind === "committed") return dependency.keys.some((key) => change.receipt.facts.has(pluginStatePublicationKey({
			plugin_id: dependency.pluginId,
			namespace: dependency.namespace,
			entry_key: key
		})));
		return change.kind === "unknown";
	});
}
/** Keep the transient witness until its consumer installs the dependencies in its own cache. */
async function capturePluginStateReadDependencies(read) {
	const capture = {
		dependencies: [],
		assertions: [],
		accepting: true,
		keyCount: 0
	};
	let active = true;
	let changed = false;
	const stop = pluginStatePublication.subscribeFacts((change) => {
		if (pluginStateReadDependenciesAffected(capture.dependencies, change)) changed = true;
	});
	const release = () => {
		active = false;
		capture.accepting = false;
		stop();
	};
	const assertCurrent = () => {
		if (!active || changed) throw new Error("Plugin state changed while preparing session ownership");
		for (const assertSourceCurrent of capture.assertions) assertSourceCurrent();
	};
	try {
		const value = await state.reads.run(capture, read);
		capture.accepting = false;
		return {
			value,
			dependencies: Object.freeze(capture.dependencies),
			assertCurrent,
			isCurrent() {
				try {
					assertCurrent();
					return true;
				} catch {
					return false;
				}
			},
			release
		};
	} catch (error) {
		release();
		throw error;
	}
}
function stage(db, facts) {
	if (!facts.size) return;
	if (state.installingFacts) throw new Error("Plugin state cannot mutate during fact installation");
	const anchor = sqlPublicationAnchor(db);
	const capture = state.capture.getStore();
	if (capture) {
		const previous = new Map([...facts.keys()].map((key) => [key, capture.get(key)]));
		stageSqliteTransactionState(anchor, {
			stage: () => {
				for (const [key, fact] of facts) capture.set(key, fact);
			},
			commit() {},
			rollback: () => {
				for (const [key, fact] of previous) if (fact) capture.set(key, fact);
				else capture.delete(key);
			}
		});
	}
	const next = publication(captureReceipt(db, facts));
	if (!stageSqliteCommittedPublication(anchor, next) && !db.isTransaction) publishSqliteCommittedState(next);
}
function stagePluginStatePostimage(db, row) {
	stage(db, /* @__PURE__ */ new Map([[pluginStatePublicationKey(row), {
		kind: "postimage",
		value: { ...row }
	}]]));
}
/** DELETE RETURNING captures exact tombstones, including eviction and whole-namespace clear. */
function stagePluginStateDeletions(db, rows) {
	stage(db, new Map(rows.map((row) => [pluginStatePublicationKey(row), { kind: "absent" }])));
}
/** Lend exact staged facts to a compound owner's existing settlement receipt. */
function capturePluginStateReceipt(db, write) {
	return state.capture.run(/* @__PURE__ */ new Map(), () => ({
		result: write(),
		receipt: captureReceipt(db, state.capture.getStore())
	}));
}
/** Capture the whole native transaction before COMMIT, including keys changed by retention. */
function withPluginStateWorkerReceipt(db, write, additionalFacts) {
	const { result, receipt: captured } = capturePluginStateReceipt(db, write);
	const metadata = additionalFacts?.(result);
	const receipt = {
		...metadata,
		...captured
	};
	deferSqliteWorkerCommitReceipt(sqlPublicationAnchor(db), serialize(receipt).byteLength <= 33554432 ? receipt : {
		...metadata,
		kind: "unknown",
		identity: receipt.source.identity
	}, captured.facts.size === 0 ? "settlement" : "commit");
	return result;
}
function isRow(value) {
	return isRecord(value) && typeof value.plugin_id === "string" && typeof value.namespace === "string" && typeof value.entry_key === "string" && typeof value.value_json === "string" && (typeof value.created_at === "number" || typeof value.created_at === "bigint") && (value.expires_at === null || typeof value.expires_at === "number" || typeof value.expires_at === "bigint");
}
function readReceipt(value) {
	if (!isRecord(value) || !isRecord(value.source) || typeof value.source.identity !== "string" || typeof value.source.incarnation !== "string" || !(value.facts instanceof Map) || !hasSqliteCommitReceiptCoverage(value, {
		source: {
			identity: value.source.identity,
			incarnation: value.source.incarnation
		},
		domain: "plugin-state",
		keys: [...value.facts.keys()]
	}) || ![...value.facts].every(([key, fact]) => typeof key === "string" && (fact.kind === "absent" || fact.kind === "postimage" && isRow(fact.value) && pluginStatePublicationKey(fact.value) === key))) throw new Error("Plugin state commit receipt is invalid");
	return value;
}
/** External effects cannot use facts while a writer is pending or its outcome is unknown. */
function assertPluginStatePublicationSettled(identity) {
	if (state.pending.has(identity) || state.unavailable.has(identity)) throw new Error("Plugin state authority is unavailable");
}
/** Start denial before queueing work; committed-only lease checks remain usable by its owner. */
function beginPluginStatePublication(identity, assertCurrent) {
	const operationId = randomUUID();
	const superseded = /* @__PURE__ */ new Set();
	let installing = false;
	let unknown = false;
	let finished = false;
	const unsubscribe = pluginStatePublication.subscribeFacts((change) => {
		if (installing) return;
		if (change.kind === "committed" && change.receipt.source.identity === identity()) for (const key of change.receipt.facts.keys()) superseded.add(key);
		else if (change.kind === "unknown" && change.identity === identity()) unknown = true;
	});
	const pendingIdentity = identity();
	try {
		install({
			kind: "pending",
			identity: pendingIdentity,
			operationId
		});
	} catch (error) {
		unsubscribe();
		try {
			install({
				kind: "settled",
				identity: pendingIdentity,
				operationId
			});
		} catch {}
		throw error;
	}
	return {
		install(facts) {
			try {
				assertCurrent?.();
				if (finished) throw new Error("Plugin state publication is closed");
				if (isRecord(facts) && facts.kind === "unknown" && facts.identity === identity()) {
					install({
						kind: "unknown",
						identity: identity()
					});
					return;
				}
				const receipt = readReceipt(facts);
				if (receipt.source.identity !== identity()) throw new Error("Plugin state receipt changed owner");
				installing = true;
				publishSqliteCommittedState(publication({
					...receipt,
					facts: new Map([...receipt.facts].map(([key, fact]) => [key, unknown || superseded.has(key) ? { kind: "unknown" } : fact]))
				}));
			} catch (error) {
				install({
					kind: "unknown",
					identity: identity()
				});
				throw error;
			} finally {
				installing = false;
			}
		},
		finish(outcome) {
			if (finished) return;
			finished = true;
			unsubscribe();
			try {
				if (outcome === "unknown") install({
					kind: "unknown",
					identity: identity()
				});
			} finally {
				install({
					kind: "settled",
					identity: pendingIdentity,
					operationId
				});
			}
		}
	};
}
/** A late worker reply cannot overwrite a newer native publication or reopen a closed owner. */
function withPluginStatePublication(createAdmission, context, onCommitted) {
	return (operation) => {
		const owner = createAdmission(operation);
		let pending;
		try {
			pending = beginPluginStatePublication(() => context.admission.identity.key, context.assertPublicationCurrent ?? context.admission.assertCurrent);
		} catch (error) {
			owner.admission.finish();
			throw error;
		}
		let installed = false;
		const finish = owner.admission.finish.bind(owner.admission);
		owner.admission.finish = () => {
			try {
				finish();
			} finally {
				const settlement = owner.admission.settlement;
				pending.finish(settlement?.kind === "completed" && (!settlement.committed || installed) ? "completed" : "unknown");
			}
		};
		observeSqliteWorkerCommittedFacts(owner.admission, ({ facts }) => {
			pending.install(facts);
			installed = true;
			onCommitted?.(facts);
		});
		return owner;
	};
}
//#endregion
export { pluginStatePublication as a, recordPluginStateReadDependency as c, capturePluginStateReceipt as i, withPluginStatePublication as l, beginPluginStatePublication as n, pluginStatePublicationKey as o, capturePluginStateReadDependencies as r, pluginStateReadDependenciesAffected as s, assertPluginStatePublicationSettled as t, withPluginStateWorkerReceipt as u };
