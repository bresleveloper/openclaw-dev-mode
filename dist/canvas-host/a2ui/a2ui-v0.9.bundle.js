var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJSMin = (cb, mod) => () => (mod || (cb((mod = { exports: {} }).exports, mod), cb = null), mod.exports);
var __copyProps = (to, from, except, desc) => {
	if (from && typeof from === "object" || typeof from === "function") for (var keys = __getOwnPropNames(from), i = 0, n = keys.length, key; i < n; i++) {
		key = keys[i];
		if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
			get: ((k) => from[k]).bind(null, key),
			enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
		});
	}
	return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule || !__hasOwnProp.call(mod, "default") ? __defProp(target, "default", {
	value: mod,
	enumerable: true
}) : target, mod));
/**
* Thrown by a tracked read whose value is currently pending (an async memo /
* `createSignal(asyncFn)` / projection / store derivation that hasn't settled
* yet). Surfacing through the reactive graph is what suspends the consumer
* scope — the nearest enclosing `<Loading>` boundary catches the throw and
* renders its fallback until the source resolves.
*
* App code rarely catches this directly; `<Loading>` is the canonical
* handler. The error type is exposed for advanced cases — e.g. interop layers
* that bridge Solid's pending-throw protocol to a different async strategy,
* or tests that want to assert on the suspension shape.
*
* @example
* ```ts
* // Advanced: distinguish "not ready yet" from a real error in custom
* // boundary plumbing. App code should rely on `<Loading>` / `<Errored>`.
* try {
*   const value = readReactiveSource();
* } catch (err) {
*   if (err instanceof NotReadyError) throw err; // re-throw to suspend
*   reportError(err);
* }
* ```
*/
var NotReadyError = class extends Error {
	source;
	constructor(r) {
		const o = Error;
		const t = o.stackTraceLimit;
		if (t !== void 0) o.stackTraceLimit = 0;
		super();
		if (t !== void 0) o.stackTraceLimit = t;
		this.source = r;
	}
};
var StatusError = class extends Error {
	source;
	constructor(r, o) {
		super(o instanceof Error ? o.message : String(o), { cause: o });
		this.source = r;
	}
};
/** Return the user's error from an internal status wrapper. */ function unwrapStatusError(r) {
	return r instanceof StatusError ? r.cause : r;
}
const REACTIVE_MANUAL_WRITE = 1024;
/** L2, rule 3 — the node's LAST pass was a render effect's read of the
* future as committed (`frameRead`): the frame shows the committed world
* beside a future it also derives from, and re-derives at the landing.
* Survives its own pass's wipe; the next pass's wipe clears it (a pass that
* re-derived the frame — in the future, or without the held read — owes the
* landing nothing). The landing consumes it (the transaction's `_reruns`). */ const REACTIVE_FRAME_READ = 2048;
/**
* A dependency write landed while this subscriber was mid-recompute — a
* nested pull committed beneath one of its reads (#3037). The heap refuses
* RECOMPUTING nodes, so recompute's tail consumes this latch and reschedules:
* values the pass read before the nested commit are stale. Only set for
* links validated this pass (gen-current): a write to an untouched link is
* either re-read later in the pass (fresh) or trimmed with it (not a dep).
*/ const REACTIVE_MISSED_WAKE = 4096;
/** The pass was served a node's ambient staging — written this flush, not
* held. If the flush parks, the pass is the frame's with it (the same sync
* frame as the async): a verdict read cannot break it out. Per pass. */ const REACTIVE_STAGED_READ = 16384;
/** Lanes — the node (a lane's member) was dirtied by the lane's own
* re-staging (a re-guess, lane work re-derived): its next pass is the
* lane's from the start (`recompute`), not a stale reader's re-run by an
* unrelated write (#3460). Consumed by the pass. */ const REACTIVE_LANE_DIRTY = 65536;
/** Lanes (plan sec. 28) — the pass read a lane's value as lane work (`enterLane`): a
* tracked derivation's read of displayed optimism, a verdict read routed
* into the holder's verdict lane. A pass in a lane's seat that read none of
* its world has left the lane (`recompute`'s tail). Per pass. */ const REACTIVE_LANE_READ = 1 << 17;
/** A15's reveal corollary (#3305): a commit published this flight's inputs
* beneath it — the node was pending, nothing staged, when it committed — so
* its committed value is torn against the visible frame. A render effect
* revealing it cannot be a stale reader: it observes the flight (pends,
* holds) instead of showing the pre-flight value. Outlives the flight that
* earned it for as long as the node stays pending, and no longer: the
* commit that lands a value clears it. */ const CONFIG_INPUTS_PUBLISHED = 1024;
/** Lanes (plan sec. 28) — the node has a lane's value (`_x._lane`): a written guess
* (CONFIG_GUESS) or a lane pass's derivation of one. Its lane is
* `_x._transaction`. The gate to the lane arm of `read`; `_value` stays the
* committed truth and `_pendingValue` a transaction's staging throughout —
* a value's world is where it lives, never a bit. */ const CONFIG_OVERRIDE = 2048;
/** Lanes — the node carries a written guess (`optimisticWrite`): its own
* source recomputing it, or a plain write landing on it, is the truth
* (`supersede`). A lane's derived staging is not. */ const CONFIG_GUESS = 8192;
/** The node's pass read a verdict (`isPending`/`latest`): a dependency going
* pending is a question for its next pass — the verdict changed — so the
* propagation re-derives it instead of marking it pending (as a kept-tail
* link does, A30). Set at the window, never cleared: a reader that stopped
* asking re-derives once and goes pending through its own read. */ const CONFIG_VERDICT = 16384;
/** A28 (4): the node was written inside a recompute that ran OUTSIDE a flush
* (a creation-time compute — boundary machinery, a mapArray's first run). Such
* a write is promoted at that recompute's end: readers in the same block see
* it. Cleared when the next flush begins; set only on that rare path. */ const CONFIG_PROMOTED = 1 << 22;
const NOT_PENDING = {};
const defaultContext = {};
/**
* Brand symbol used by `Refreshable<T>` values (projection stores, async
* memos) to expose their underlying computation to `refresh()`. Not part of
* the user-facing API.
*
* @internal
*/ const $REFRESH = Symbol("refresh");
/** Live transactions — opened, unmerged, not landed. Scanned at every seam
* while non-empty; nothing on the plain path. */ const transactions = [];
/** A transaction (listed here) or a lane (lanes.ts lists its own). */ function newTransaction(e, n = null) {
	const t = {
		un: [],
		tn: [[], []],
		sn: [],
		dn: null,
		_parent: n,
		Z: e,
		ye: null,
		tt: 0,
		nt: false,
		nn: null,
		ve: false,
		ln: false,
		T: null
	};
	if (!e) transactions.push(t);
	return t;
}
/** The lane the running pass is work of; set at `recompute`'s head from the
* node, moved by a derivation's lane read, saved and restored around the
* pass. */ let passLane = null;
function setPassLane(e) {
	passLane = e;
}
/** The transaction this flush parks into: set by the first join, merged
* with every further one. Consumed at the seam. A join outside a flush (a
* mount's pending observer, a write to a held node, an action opening)
* schedules the seam that consumes it: membership is the tick's — the same
* synchronous frame — and the next tick's writes are not this one's. */ let flushTransaction = null;
/** The transaction the passes running OUTSIDE a flush this tick derive from
* (a mainline mount, a mainline re-pass): the passes' own (A29, creation-
* time form — "the entry is the pass's alone"): their results are staged
* into it, and nothing else in the tick is — a write made after the mount
* is a mainline write, a render effect mounted beside it a stale reader.
* Inside a flush, or in a tick that already has its transaction (an
* action's body), the frame joins instead (`flushTransaction`) — except a
* first pass a loading boundary that has not shown content catches (`own`,
* A29's boundary exemption, #3540): it is the boundary's, not the tick's,
* and a flush that has joined nothing keeps it pass-scoped as outside one.
* Cleared by the flush the join schedules, and at the end of a flush that
* set it. */ let passTx = null;
function joinPassTx(e, n) {
	if (globalQueue.ee && !n || flushTransaction !== null) return joinFuture(e);
	if (passTx === null) passTx = resolveTx(e);
	else merge$1(resolveTx(e), passTx);
	schedule();
}
/** The transaction holding a node (CONFIG_HELD set), resolved through
* merges; the path is compressed. */ function txOf(e) {
	return e.m.ke = resolveTx(e.m.ke);
}
/** `t` resolved through merges while it is still parked or open; null once
* it has landed. */ function liveTx(e) {
	e = resolveTx(e);
	return transactions.indexOf(e) !== -1 ? e : null;
}
function resolveTx(e) {
	while (e.dn !== null) e = e.dn;
	return e;
}
/** The flush joins transaction `t` — or needs one of its own (`null`: a pass
* went pending with nothing held). Joining a second one merges it into the
* flush's: the work that touched both entangles them (A15). */ function joinFuture(e) {
	const n = flushTransaction;
	if (n === null) flushTransaction = e === null ? newTransaction(false) : resolveTx(e);
	else if (e !== null) merge$1(resolveTx(e), n);
	if (!globalQueue.ee) schedule();
}
/** `t` merges into `f`: the work that touched both entangles them (A15).
* A lane never merges: it is a sub-frame, not a peer — its work is routed
* per pass (`passLane`). */ function merge$1(e, n) {
	e = resolveTx(e);
	n = resolveTx(n);
	if (e === n || e.Z || n.Z) return;
	e.dn = n;
	n.tt += e.tt;
	n.nt ||= e.nt;
	append(n.un, e.un);
	append(n.tn[0], e.tn[0]);
	append(n.tn[1], e.tn[1]);
	append(n.sn, e.sn);
	if (e.T !== null) append(n.T ??= [], e.T);
	transactions.splice(transactions.indexOf(e), 1);
}
/** A15: a hold is a property of the async node — observed pending by a
* render reader. A transaction is blocked while a node it holds, in flight,
* has one: a pending render effect (the frame itself), or a pending held
* node a render effect reads. A stale reader served the committed value
* never went pending, but derives from the flight all the same (#3494) and
* is still linked to it; a memo between them is pending, and held, too — so
* one hop of `_subs` is the chain. Reads of the reader's LAST pass only (the
* link's generation is the pass's): a tail kept for A30 — the committed
* frame's dependency, awaiting the run that retires it — is not a read of
* the flight, and a reader that stopped reading releases it (O3, #3494).
* An errored pass (NotReady included) did not stop: it never got there, and
* its full list stands (A30) — the reads it did not reach still observe. A
* flight nobody renders holds nothing (A29). Only the nodes `t` still owns
* count: one a lane took over since is the lane's to wait on. A guess whose
* own truth is in flight blocks the lane's parent, not the lane — it stands
* in for the flight (A17: "visible until its own fetch settles"). */ function blocked(e) {
	const n = judge;
	judge ??= e;
	const t = e.tt !== 0 || blockedBy(e.un, e) || !!GlobalQueue.cn && GlobalQueue.cn(e);
	judge = n;
	return t;
}
let judge = null;
/** `t`'s own flights only — not its lanes': a flight the frame asked for
* (a refetch, a plain load) is authoritative; a lane's derivation flight is
* not (lanes.ts, the body-end corollary). A pending reader counts only if
* one of the sources it waits on is `t`'s (a render effect marked pending
* by a lane flight, never re-run, is the lane's wait, not the frame's). */ function ownFlights(e) {
	return blockedBy(e.un, e, true);
}
/** A source the pending node waits on that is `t`'s (held by it, or by no
* one) — not another transaction's or lane's work. Itself, when it is the
* source. */ function ownSource(e, n) {
	const t = e.m?.Se;
	if (t === void 0) return true;
	for (const e of t) {
		const t = e.m?.ke;
		if (t == null || resolveTx(t) === n) return true;
	}
	return false;
}
function blockedBy(e, n, t = false) {
	for (let l = 0; l < e.length; l++) {
		const o = e[l];
		if (!(o.G & 1) || o.R & 64 || o.u & 8192 || o.m.ke !== null && txOf(o) !== n || t && !ownSource(o, n)) continue;
		if (o.i === 1) {
			if (onScreen(o, judge ?? n)) return true;
			continue;
		}
		for (let e = o.t; e !== null; e = e.l) {
			const t = e.o;
			if ((t.i === 1 || t.R & 2048 || t.u & 32768 && t.G === 1) && (e.Ue === t.Ge || t.m?.V != null) && !(t.R & 64) && onScreen(t, judge ?? n)) return true;
		}
	}
	return false;
}
/** A frame reader whose say counts for `t`'s hold — `t` the transaction
* being judged: not a zombie whose removal `t` stages (A15 #3463: a re-ask
* in the unmount frame lands its pending on the zombie it unmounts — the
* compiled <Show> of #3372; a zombie blocks every other judgment while it
* is visible, a lane's reveal included: only the commit that disposes it
* makes its say moot), and not behind a fallback (A33: a boundary showing its fallback is the display of
* everything under it, so a reader there is not on screen and holds
* nothing — boundaries.ts). */ function onScreen(e, n) {
	return !(e.R & 32 && removalStagedBy(e, n)) && !(GlobalQueue.se && GlobalQueue.se(e));
}
/** A15 (#3463): a reader whose removal is staged — a zombie, parked by a
* pass awaiting its commit — is still on screen and live for every hold,
* except the transaction staging its removal: for that one its say is moot
* (done, and the commit disposes it; not done, and it stays parked). The
* staging transaction is the one holding the pass that parked the frame:
* the nearest non-zombie ancestor. */ function removalStagedBy(e, n) {
	let t = e;
	while (t !== null && t.R & 32) t = t._parent;
	return t !== null && (t.u & 256) !== 0 && t.m?.ke != null && txOf(t) === resolveTx(n);
}
/** Unchanged passes this flush whose stale dependency tail awaits the
* flush's verdict (A30, #3469): trimmed when the flush commits, kept when
* it parks — the committed frame still derives from the previous pass's
* dependencies, and a write to one of them must reach the node until a
* committing pass replaces it. */ const heldTrims = [];
function heldTrim(e) {
	heldTrims.push(e);
}
/** Zombies popped from the dirty heap this flush (`deferZombie`). The seam
* decides their fate: a park cancels them (the writes that dirtied them are
* held with it); a commit runs the survivors — the ones whose owner is still
* awaiting its commit — in height order, after the commits that would have
* disposed them (#3546). No second heap: the list is the deferral. */ const deferredZombies = [];
function deferZombie(e) {
	deleteFromHeap(e, dirtyQueue);
	e.R &= -4;
	deferredZombies.push(e);
}
/** Put a staged node in a transaction: flagged, stamped, on its landing
* list. */ function holdNode(e, n) {
	e.u |= 256;
	list(e, n);
}
/** Put a node on a transaction's list, once: a node's `_transaction` is the
* transaction whose `_nodes` it is on (every site that sets one does the
* other), so a re-pass, a re-landing or a re-staging adds nothing. */ function list(e, n) {
	const t = ext(e);
	if (t.ke === n) return;
	t.ke = n;
	n.un.push(e);
}
/** Hold the (uncommitted) frame under a held pass: every computed in the
* live child chain, recursively. Plain owners are walked through, not held
* — nothing reads or re-passes them. Once per park, over the parked frames
* only; recomputes pay nothing for it. A lane's node in the frame (listed on
* a lane: a verdict reader broken out of this very hold — display-ahead — or
* a derivation of a guess, CONFIG_OVERRIDE; a lane pass's effect) is the
* lane's, as the seam's own loop has it: "lane work never makes its node
* transaction work" (A15, #3698). Re-listed here it would carry the lane's
* value on the transaction's list, where the landing nulls its transaction
* and `dissolveLane` no longer finds it — a lane node with no lane, which the
* next read of it trips over (`laneRead` → `txOf`). Its frame is the lane's
* too (ruling A: a lane pass's children are the lane's), revealed and
* retired at the lane's seam. */ function holdFrame(e, n) {
	for (let t = e.ge; t !== null; t = t.me) {
		if (t.m?.ke?.Z) continue;
		if (t.re !== void 0 && !(t.u & 256)) holdNode(t, n);
		holdFrame(t, n);
	}
}
const dirtyQueue = {
	Ht: new Array(2e3).fill(void 0),
	C: false,
	He: 0,
	At: 0
};
let clock = 0;
let scheduled = false;
let halted = false;
let haltNotified = false;
let syncDepth = 0;
/** Provenance (A18, #3331): the question being asked — an action's
* sequence while a slice of its body and the flush that carries it run, 0
* otherwise. A guess is stamped with it (lanes.ts; a mainline guess takes a
* fresh sequence: the newest intent), a flight with the question that
* started it (async.ts; mainline is always the current question). An
* answer from an older question than the guess it lands on is stale: held
* silently, it does not move the graph. */ let question = 0;
let questions = 0;
function nextQuestion() {
	return ++questions;
}
function schedule() {
	if (halted) {
		notifyHalted();
		return;
	}
	if (scheduled) return;
	scheduled = true;
	if (!syncDepth && !globalQueue.ee) queueMicrotask(flush);
}
/**
* Permanently halts the reactive system. Called when a user error escapes
* every boundary — app state is undefined at that point, so scheduling stops
* entirely rather than limping along with a half-applied update.
*/
/**
* The key a root owner carries its client error hook under (`render`'s
* `onError`) — registered, so a runtime writes it with no import of the hook
* module (core/error-hooks.ts) and no property mangling in the way. Defined
* HERE, not there: a runtime that only writes the key must not retain the
* hook machinery (pay-for-use).
*/ const ROOT_ERROR_HOOK = Symbol.for("solid-js/root-error-hook");
function haltReactivity(e) {
	if (halted) return;
	halted = true;
	let n = "[REACTIVITY_HALTED]";
	const t = e !== void 0 && globalThis.reportError;
	t || e === void 0 ? console.error(n) : console.error(n, e);
	t && t(e);
}
function notifyHalted() {
	if (haltNotified) return;
	haltNotified = true;
	console.error("[REACTIVITY_HALTED]");
}
var GlobalQueue = class GlobalQueue {
	tn = [[], []];
	ee = false;
	flush() {
		if (this.ee) return;
		this.ee = true;
		resyncUnflushedCompanions();
		passLane = null;
		passTx = null;
		try {
			sweepDormant();
			runHeap(dirtyQueue, GlobalQueue.Ce);
			this.settle();
			clock++;
			scheduled = dirtyQueue.At >= dirtyQueue.He || pendingNodes.length !== 0;
			this.run(1);
			this.run(2);
		} finally {
			this.ee = false;
			passTx = null;
		}
	}
	/** L2 — the seam: end of the pure phase. Commit this flush's staged nodes,
	* or park them with the transaction the flush joined; then land every
	* transaction no frame is waiting on. The landing flush is an ordinary
	* flush: the settle walk (async.ts) re-ran the parked readers in its pure
	* phase, and here no flight the transaction holds has a frame deriving
	* from it (`blocked`). */ settle() {
		if (GlobalQueue.an?.()) runHeap(dirtyQueue, GlobalQueue.Ce);
		const e = flushTransaction;
		flushTransaction = null;
		GlobalQueue.fn?.(e);
		const n = e !== null && !e.Z ? resolveTx(e) : null;
		if (n !== null) {
			const e = pendingNodes.length;
			for (let t = 0; t < e; t++) {
				const e = pendingNodes[t];
				if (!(e.u & 2304) && (e.m === null || e.m.ke === null || !e.m.ke.Z)) {
					if (e.Ae === NOT_PENDING && e.G & 4 && e.i !== 1) continue;
					if (e.Ae !== NOT_PENDING && !(e.G & 5) && e.We && e.We(e.pe, e.Ae) && e.m?.Me == null && e.m?.Be == null) {
						e.Ae = NOT_PENDING;
						e.u &= -129;
						continue;
					}
					holdNode(e, n);
				}
				if (e.u & 128) holdFrame(e, n);
			}
			pendingNodes.length = 0;
			GlobalQueue.Tn?.(n);
			const t = deferredZombies.splice(0).sort((e, n) => e.Le - n.Le);
			for (let e = 0; e < t.length; e++) if ((t[e].R & 96) === 32 && t[e].u & 16384) recompute(t[e]);
		} else {
			commitPendingNodes();
			for (let e = 0; e < heldTrims.length; e++) {
				const n = heldTrims[e];
				if (n.m?.V == null && !n.Fe) trimStaleDeps(n);
			}
		}
		if (heldTrims.length) heldTrims.length = 0;
		const t = this.tn;
		const l = this.tn = [[], []];
		GlobalQueue.Nn?.(n !== null ? stagedReaders : null);
		if (stagedReaders.length) stagedReaders.length = 0;
		this.tn = [[], []];
		for (let e = transactions.length - 1; e >= 0; e--) {
			const n = transactions[e];
			if (blocked(n)) continue;
			transactions.splice(e, 1);
			GlobalQueue.In?.(n);
			land(n);
			e = transactions.length;
		}
		GlobalQueue._n?.();
		GlobalQueue.D?.(n !== null && transactions.indexOf(n) !== -1 ? n : null);
		const o = n && liveTx(n);
		const u = o !== null;
		for (let e = 0; e < 2; e++) {
			if (u) append(o.tn[e], t[e]);
			this.tn[e] = u || l[e].length || this.tn[e].length ? l[e].concat(u ? [] : t[e], this.tn[e]) : t[e];
		}
		if (deferredZombies.length !== 0) {
			const e = deferredZombies.splice(0).sort((e, n) => e.Le - n.Le);
			for (let n = 0; n < e.length; n++) if (!(e[n].R & 64)) recompute(e[n]);
		}
		GlobalQueue.Ee?.();
	}
	run(e) {
		const n = this.tn[e - 1];
		if (n.length) {
			this.tn[e - 1] = [];
			runQueue(n, e);
		}
	}
	enqueue(e, n, t = passLane) {
		if (e) (t !== null ? t : this).tn[e - 1].push(n);
		schedule();
	}
	/** Status reaching the root: pending is absorbed (the root mount defers —
	* dev records it for the ASYNC_OUTSIDE_LOADING_BOUNDARY FYI); an error is
	* unhandled (`false` → the caller halts).
	*
	* L2: this is where a transaction is registered. Pending that reaches an
	* observer (a render effect: the frame) is a frame that cannot show — the
	* flush parks, and the transaction waits on the flight while a frame
	* derives from it (`blocked`). Pending nobody observes holds nothing: a
	* memo in flight that no frame reads is not a frame waiting. (Base: the
	* queue's `_asyncReporters`, INV-3's one registration site.)
	*
	* A boundary between the observer and the root (boundaries.ts) is asked
	* first: a fallback catches what is not ready under it, and the root
	* never hears of it. */ notify(e, n, t, l) {
		if (GlobalQueue.fe && GlobalQueue.fe(e, t & n, l)) return true;
		if (n & 1) {
			if (t & 1) {
				if (passLane === null) joinFuture(null);
			}
			return true;
		}
		return false;
	}
};
/** A15's stale readers: a frame whose LAST pass read a held node as
* committed re-derives on the landed world — next round, after the commits.
* One re-derived since (any later pass cleared the bit: in the transaction,
* or without the held read) owes nothing. A run this transaction stashed
* for it is void (#3322: an effect has one value slot, and the stale pass
* overwrote the value that run was for) — the re-derivation's run replaces
* it. */ function reruns(e) {
	for (let n = 0; n < e.sn.length; n++) {
		const t = e.sn[n];
		if (t.R & 64) continue;
		if (t.R & 2048) {
			t.R &= -2049;
			t.Fe = false;
			for (let e = t.ge; e !== null; e = e.me) if (e.i) e.Fe = false;
			enqueueSub(t);
		}
	}
	e.sn.length = 0;
}
/** The landing: the held frame becomes the frame. */ function land(e) {
	reruns(e);
	if (e.T !== null) GlobalQueue.A(e.T);
	for (let n = 0; n < e.un.length; n++) {
		const t = e.un[n];
		if (t.m.ke === null || txOf(t) !== e) continue;
		t.m.ke = null;
		commitPendingNode(t);
	}
	releaseQueues(e);
}
/** The held runs join this flush's effect phase after its own runs (the
* landing's re-passes, in height order): the frame's effects run as one
* pass would have queued them — a shell re-derived at the landing before a
* boundary swap held since the write (#3540's log order). */ function releaseQueues(e) {
	for (let n = 0; n < 2; n++) {
		append(globalQueue.tn[n], e.tn[n]);
		e.tn[n] = [];
	}
}
/** `a.push(...b)` without the argument-count limit. */ function append(e, n) {
	for (let t = 0; t < n.length; t++) e.push(n[t]);
}
/** Nodes staged this flush (`_pendingValue` set), committed at its end. */ const pendingNodes = [];
/** Passes that read a staging of this flush as the screen — lane work
* (core.ts `stagedRead`), a verdict reader before the frame's verdict
* (verdict.ts): if the frame parks they read a held write — re-derived next
* round (lanes.ts; a lane's runs wait that round). */ const stagedReaders = [];
/** A15's stale reader: `c` was served the committed value of a node `t`
* holds (a render effect, a verdict reader, lane work) and is re-derived
* after `t`'s landing (`_reruns`). Once per pass. */ function staleReader(e, n) {
	if (!(e.R & 2048)) {
		e.R |= REACTIVE_FRAME_READ;
		n.sn.push(e);
	}
}
function queuePendingNode(e) {
	pendingNodes.push(e);
	if (!globalQueue.ee) markUnflushedStaged();
}
/** §12d: bumped by every recompute and every new subscriber edge. A node's
* staged-rewrite skip is sound only while NOTHING recomputed or linked since
* its last notify — a mid-batch pull can clean a marked subscriber, and a
* skipped re-write would leave it stale. */ let notifyEpoch = 0;
function bumpNotifyEpoch() {
	notifyEpoch++;
}
function insertSubs(e) {
	e.ze = notifyEpoch;
	const t = (e.u & 512) !== 0 && e.m?.xe !== void 0;
	for (let n = e.t; n !== null; n = n.l) {
		const e = n.o;
		if (e.R & 4 && n.Ue === e.Ge && n !== e.S) e.R |= REACTIVE_MISSED_WAKE;
		if (t && e.u & 8) {
			e.R |= 256;
			continue;
		}
		enqueueSub(e);
	}
}
/** Lane work re-staged (lanes.ts; `recompute`): the lane's members among
* its subscribers re-derive as the lane's work (REACTIVE_LANE_DIRTY), their
* runs held with it — not as stale readers republishing the committed view
* (#3460). After `insertSubs`. A render effect on no lane is marked too:
* inert for its pass (`recompute` seats a lane only from its own `_x`), it
* is a live write if the effect becomes a zombie later this flush — an
* on-screen reader whose removal an adopted write stages follows the lane
* (the lane-membership ruling, 2026-10-05; `_update`). */ function laneDirty(e, n) {
	for (let t = e.t; t !== null; t = t.l) {
		const e = t.o.m?.ke;
		if (e?.Z ? sameLane(e, n) : t.o.i) t.o.R |= REACTIVE_LANE_DIRTY;
	}
}
/** One lane, or two of one link group (#3335): one reveal unit. */ function sameLane(e, n) {
	return e === n || e.nn !== null && e.nn === n.nn;
}
function commitPendingNode(e) {
	const n = e;
	if (!n.re) {
		e.u &= -385;
		if (e.Ae !== NOT_PENDING) {
			e.pe = e.Ae;
			e.Ae = NOT_PENDING;
		}
		return;
	}
	const t = e.Ae === NOT_PENDING && (n.G & 1) !== 0;
	e.u = t ? e.u & -257 | CONFIG_INPUTS_PUBLISHED : e.u & -1409;
	if (e.Ae !== NOT_PENDING) {
		e.pe = e.Ae;
		e.Ae = NOT_PENDING;
		n.G &= -5;
		if (n.m != null) n.m.be = false, n.m.$e = NOT_PENDING;
		if (e.i && e.i !== 3) {
			e.Fe = true;
			globalQueue.enqueue(e.i, e.J ??= GlobalQueue.X.bind(null, n));
		}
	}
	n._e = false;
	n.R &= -1025;
	if (n.m?.V == null) trimStaleDeps(n);
	if (!(n.G & 1)) n.G &= -5;
	if (!t && n.m != null && (n.m.Me !== null || n.m.Be !== null)) GlobalQueue.he(n, false, true);
}
function commitPendingNodes() {
	for (let e = 0; e < pendingNodes.length; e++) {
		const n = pendingNodes[e];
		if (!(n.u & 2304)) commitPendingNode(n);
	}
	pendingNodes.length = 0;
}
const globalQueue = new GlobalQueue();
function flush(e) {
	if (e) {
		syncDepth++;
		try {
			return e();
		} finally {
			try {
				flush();
			} finally {
				syncDepth--;
			}
		}
	}
	if (globalQueue.ee) return;
	if (halted) return;
	while (scheduled) globalQueue.flush();
}
function runQueue(e, n) {
	for (let t = 0; t < e.length; t++) e[t](n);
}
/**
* Schedule one subscriber to re-run on the next flush: inserted into the
* dirty heap with the `_min` cursor pulled down. Tracked effects ride the
* heap too — the heap visit is their (empty) compute phase, which hands the
* callback to the user queue once the pass has committed (see
* GlobalQueue._update, #3291).
*/ function enqueueSub(e) {
	if (dirtyQueue.He > e.Le) dirtyQueue.He = e.Le;
	insertIntoHeap(e, dirtyQueue);
}
function actualInsertIntoHeap(e, t) {
	const E = (e._parent?.Et ? e._parent.ut?.Le : e._parent?.Le) ?? -1;
	if (E >= e.Le) e.Le = E + 1;
	const n = e.Le;
	const I = t.Ht[n];
	if (I === void 0) t.Ht[n] = e;
	else {
		const t = I.Ke;
		t.je = e;
		e.Ke = t;
		I.Ke = e;
	}
	if (n > t.At) t.At = n;
}
function insertIntoHeap(e, t) {
	let E = e.R;
	if (E & 12) return;
	if (E & 1) e.R = E & -4 | 10;
	else {
		e.R = E | 8;
		if (t.C) markNode(e);
	}
	if (!(E & 16)) actualInsertIntoHeap(e, t);
}
function insertIntoHeapHeight(e, t) {
	let E = e.R;
	if (E & 28) return;
	e.R = E | 16;
	actualInsertIntoHeap(e, t);
}
function deleteFromHeap(e, t) {
	const E = e.R;
	if (!(E & 24)) return;
	e.R = E & -25;
	const n = e.Le;
	if (e.Ke === e) t.Ht[n] = void 0;
	else {
		const E = e.je;
		const I = t.Ht[n];
		const i = E ?? I;
		if (e === I) t.Ht[n] = E;
		else e.Ke.je = E;
		i.Ke = e.Ke;
	}
	e.Ke = e;
	e.je = void 0;
}
function markHeap(e) {
	if (e.C) return;
	e.C = true;
	for (let t = 0; t <= e.At; t++) for (let E = e.Ht[t]; E !== void 0; E = E.je) if (E.R & 8) markNode(E);
}
function markNode(e, t = 2) {
	const E = e.R;
	if ((E & 3) >= t) return;
	e.R = E & -4 | t;
	for (let t = e.t; t !== null; t = t.l) markNode(t.o, 1);
}
function runHeap(e, t) {
	e.C = false;
	for (e.He = 0; e.He <= e.At; e.He++) {
		let E = e.Ht[e.He];
		while (E !== void 0) {
			if (E.R & 8) t(E);
			else adjustHeight(E, e);
			E = e.Ht[e.He];
		}
	}
	e.At = 0;
}
function adjustHeight(e, t) {
	deleteFromHeap(e, t);
	let E = e.Le;
	for (let t = e._; t; t = t.p) {
		const e = t.I;
		if (e.re && e.Le >= E) E = e.Le + 1;
	}
	if (e.Le !== E) {
		e.Le = E;
		for (let E = e.t; E !== null; E = E.l) insertIntoHeapHeight(E.o, t);
	}
}
function markDisposal(e) {
	let n = e.ge;
	while (n) {
		n.R |= 32;
		markDisposal(n);
		n = n.me;
	}
}
function disposeChildren(e, n = false, t) {
	const i = e.R;
	if (i & 64) return;
	if (n && !t && e.m !== null && (e.m.Me !== null || e.m.Be !== null)) disposeChildren(e, false, true);
	if (n) e.R = i | 64;
	if (n && e.re) {
		if (e.m !== null) e.m.De = null;
		if (e.G & 1 && e.m?.ke != null || i & 2048) schedule();
	}
	let l = t ? e.m.Me : e.ge;
	if (t) e.m.Me = null;
	else e.ge = null;
	while (l) {
		const e = l;
		e.u &= -33;
		deleteFromHeap(e, dirtyQueue);
		clearDeps(e);
		l.Je = l;
		disposeChildren(l, true);
		l = l.me;
	}
	if (!t) e.Ye = 0;
	if (n && !t && !(i & 32) && e._parent !== null && !(e._parent.R & 64)) {
		const n = e.Je;
		const t = e.me;
		if (n !== null) n.me = t;
		else e._parent.ge = t;
		if (t !== null) t.Je = n;
		e.Je = null;
	}
	runDisposal(e, t);
	if (n && e.lt) {
		const n = e.lt;
		e.lt = void 0;
		n();
	}
}
function linkChild(e, n) {
	const t = e.ge;
	n.Je = null;
	n.me = t;
	if (t !== null) t.Je = n;
	e.ge = n;
}
function runDisposal(e, n) {
	const t = n ? e.m.Be : e.Pe;
	if (!t) return;
	if (n) e.m.Be = null;
	else e.Pe = null;
	if (Array.isArray(t)) for (let e = t.length - 1; e >= 0; e--) {
		const n = t[e];
		n.call(n);
	}
	else t.call(t);
}
function childId(e, n) {
	let t = e;
	while (t.u & 4 && t._parent) t = t._parent;
	if (t.id != null) return formatId(t.id, n ? t.Ye++ : t.Ye);
	throw new Error("");
}
/**
* Allocates and returns the next stable child id for `owner`. Used by
* hydration plumbing and `createUniqueId`. Not part of the user-facing API.
*
* @internal
*/ function getNextChildId(e) {
	return childId(e, true);
}
/**
* The id a freshly-created node inherits: an explicit `options.id` wins;
* transparent nodes share their parent's id; otherwise the parent's next
* child id is consumed (or `undefined` outside an id-carrying tree).
*/ function inheritId(e, n, t) {
	return e?.id ?? (n ? t?.id : t?.id != null ? getNextChildId(t) : void 0);
}
function formatId(e, n) {
	const t = n.toString(36), i = t.length - 1;
	return e + (i ? String.fromCharCode(64 + i) : "") + t;
}
/**
* Returns the currently-tracking observer (the computation that subscribes to
* reactive reads at this point), or `null` if reads here would be untracked.
* Used by reactive primitives that need to know whether they're inside a
* tracking scope. App code rarely needs this — see `getOwner()` for the
* lifecycle owner instead.
*
* @example
* ```ts
* // Library predicate: only register a hot-path subscription when the
* // caller is inside a tracking scope (memo / effect compute / JSX).
* function trackIfTracked(source: () => unknown) {
*   if (getObserver()) source();
* }
* ```
*/ function getObserver() {
	return tracking ? context : null;
}
/**
* Returns the current reactive **owner** — the lifecycle node that the next
* `cleanup()` / `onCleanup()` / `createSignal()` etc. will be attached to.
*
* Returns `null` if called outside any owner. Capture the owner with
* `getOwner()` and re-enter it later with `runWithOwner(owner, fn)` to attach
* disposables created from a callback (event handler, async resolution, etc.)
* back to a component's lifecycle.
*
* @example
* ```ts
* function defer<T>(fn: () => T) {
*   const owner = getOwner();
*   queueMicrotask(() => runWithOwner(owner, fn));
* }
* ```
*/ function getOwner() {
	return context;
}
/**
* Low-level: registers `fn` as a disposal callback on the current owner.
* Most code should use `onCleanup()` from `solid-js`, which adds dev-mode
* checks. `cleanup()` is the unchecked primitive used by internals.
*/ function cleanup(e) {
	if (!context) return e;
	if (!context.Pe) context.Pe = e;
	else if (Array.isArray(context.Pe)) context.Pe.push(e);
	else context.Pe = [context.Pe, e];
	return e;
}
function disposeRootSelf(e = true) {
	disposeChildren(this, e);
}
/**
* Creates a fresh owner attached as a child of the current owner (or as a
* detached root if there is none). Used by framework internals to group
* cleanups; app code should use `createRoot()` (host a reactive scope outside
* a component) or `runWithOwner()` (re-enter a captured owner).
*
* @internal
*/ function createOwner(e) {
	const n = context;
	const t = e?.transparent ?? false;
	const i = {
		id: inheritId(e, t, n),
		u: t ? 4 : 0,
		Et: true,
		ut: n?.Et ? n.ut : n,
		ge: null,
		me: null,
		Je: null,
		Pe: null,
		U: n?.U || defaultContext,
		Ye: 0,
		m: null,
		_parent: n,
		dispose: disposeRootSelf
	};
	if (n) linkChild(n, i);
	return i;
}
/**
* Creates a reactive root — an owner scope with its own `dispose()`. A root
* created inside an existing owner is owned by it and is disposed when the
* parent is disposed; call `dispose()` to tear it down earlier. To create a
* root that outlives its creator, detach explicitly:
* `runWithOwner(null, () => createRoot(...))`. Pass `id` to seed hydration
* ids for the tree it owns.
*
* `dispose()` tears down every signal, memo, effect, and `onCleanup`
* registered inside the root.
*
* Use this to host long-lived reactive scopes outside of a component (custom
* controllers, app bootstrapping, tests). Inside a component, prefer
* letting Solid's component lifecycle own things.
*
* @example
* ```ts
* // At module level there is no owner, so this root lives until disposed.
* const dispose = createRoot(dispose => {
*   const [n, setN] = createSignal(0);
*   createEffect(() => n(), value => console.log(value));
*   setInterval(() => setN(x => x + 1), 1000);
*   return dispose;
* });
*
* // Later, to tear everything down:
* dispose();
*
* // Inside an owner (component, effect, another root), detach explicitly
* // if the root must outlive its creator:
* const detached = runWithOwner(null, () => createRoot(d => d));
* ```
*
* @description https://docs.solidjs.com/reference/reactive-utilities/create-root
*/ function createRoot$1(e, n) {
	const t = createOwner(n);
	return runWithOwner(t, () => e(() => t.dispose()));
}
/** The store's shared slot-node release handler (store/store.ts installs it
* once) — a live binding read directly by the sweep site: no wrapper frame,
* no null check (a CONFIG_SLOT_NODE node existing implies the store module
* loaded and registered it). */ let slotUnobservedHook;
function setSlotUnobserved(e) {
	slotUnobservedHook = e;
}
function unlinkSubs(e) {
	const n = e.I;
	const o = e.p;
	const l = e.l;
	const t = e.en;
	if (l !== null) l.en = t;
	else n.qe = t;
	if (t !== null) t.l = l;
	else {
		n.t = l;
		if (l === null) {
			if (n.u & 4096) slotUnobservedHook(n);
			else n.m?.Xe?.();
			const e = n;
			e.re && e.u & 32 && !(e.R & 32) && !(e.G & 1) && unobserved(e);
		}
	}
	return o;
}
function trimStaleDeps(e) {
	const n = e.S;
	let o = n !== null ? n.p : e._;
	if (o !== null) {
		do
			o = unlinkSubs(o);
		while (o !== null);
		if (n !== null) n.p = null;
		else e._ = null;
	}
}
function clearDeps(e) {
	let n = e._;
	if (!n) return;
	do
		n = unlinkSubs(n);
	while (n !== null);
	e._ = null;
	e.S = null;
}
function unobserved(e) {
	deleteFromHeap(e, dirtyQueue);
	clearDeps(e);
	disposeChildren(e, true);
}
/**
* Deferred dormancy for never-observed auto-dispose computeds (#3078).
*
* An untracked top-level read of a subscriber-less observation-lifecycle memo
* used to call unobserved() inline at the end of read(). That kept the leak
* closed (the compute links the memo into its deps' sub lists — without a
* teardown point a never-observed memo is retained by its sources forever;
* upstream alien-signals has exactly this retention), but it made reads
* destructive: each read disposed the node, the next read revived it with a
* full recompute in whatever ambient transition/lane context happened to be
* current, so consecutive reads could return different answers with no write
* in between.
*
* Instead, reads queue the node here and the scheduler sweeps at the top of
* the next flush (before runHeap, so a same-tick dirtying is reclaimed
* instead of recomputed). Reads become idempotent within a tick (the node
* stays alive and serves its cache, uniform with observed memos) while
* reclamation still happens within one microtask — the enqueue site arms
* schedule(), so a flush is guaranteed even when no other work is queued.
*/ const dormantNodes = /* @__PURE__ */ new Set();
function sweepDormant() {
	if (dormantNodes.size === 0) return;
	for (const e of dormantNodes) if (!e.t && e.u & 32 && !(e.G & 1) && !(e.R & 96)) unobserved(e);
	dormantNodes.clear();
}
function link(e, n) {
	const o = n.S;
	if (o !== null && o.I === e) return;
	let l = null;
	const t = n.R & 4;
	if (t) {
		l = o !== null ? o.p : n._;
		if (l !== null && l.I === e) {
			l.Ue = n.Ge;
			n.S = l;
			return;
		}
	}
	const s = e.qe;
	if (s !== null && s.o === n && (!t || s.Ue === n.Ge)) return;
	const u = n.S = e.qe = {
		I: e,
		o: n,
		p: l,
		en: s,
		l: null,
		Ue: n.Ge
	};
	if (o !== null) o.p = u;
	else n._ = u;
	if (s !== null) s.l = u;
	else e.t = u;
	bumpNotifyEpoch();
}
function addPendingSource(e, t) {
	if (e.m?.Se?.has(t)) return false;
	(ext(e).Se ??= /* @__PURE__ */ new Set()).add(t);
	return true;
}
function removePendingSource(e, t) {
	const n = e.m?.Se;
	if (!n?.delete(t)) return false;
	if (!n.size) e.m.Se = void 0;
	return true;
}
function clearPendingSources(e) {
	if (e.m !== null) e.m.Se = void 0;
}
function retryReaches(e, t) {
	for (let n = e._; n; n = n.p) {
		const e = n.I;
		if (e === t || e.m?.Se?.has(t)) return true;
	}
	return false;
}
/**
* A loading-window node hit an unready source (sync throw in recompute, or a
* NotReadyError-rejected flight): register for the source's settle — the
* settlePendingSource walk runs off `_pendingSources` + `_blocked` alone —
* with NO read-visible pending status and no downstream propagation. Commit
* #0 keeps serving.
*/ function parkLoadingWindow(e, t) {
	ext(e).Ie = true;
	if (t.source) addPendingSource(e, t.source);
	if (!(e.G & 2)) setPendingError(e, t.source, t);
}
function setPendingError(e, t, n) {
	if (!t) {
		if (e.m !== null) e.m.V = null;
		return;
	}
	if (n instanceof NotReadyError && n.source === t) {
		ext(e).V = n;
		return;
	}
	const r = e.m?.V;
	if (!(r instanceof NotReadyError) || r.source !== t) ext(e).V = new NotReadyError(t);
}
function forEachDependent(e, t) {
	for (let n = e.t; n !== null; n = n.l) t(n.o, n);
}
function releaseIfSettledUnobserved(e) {
	e.re && e.u & 32 && !e.t && !(e.R & 32) && !(e.G & 1) && unobserved(e);
}
function releaseSettledDependents(e) {
	let t;
	const n = /* @__PURE__ */ new Set();
	const visit = (e) => {
		if (n.has(e)) return;
		n.add(e);
		if (!e.t && e.u & 32) (t ??= []).push(e);
		forEachDependent(e, visit);
	};
	forEachDependent(e, visit);
	if (t) for (const e of t) releaseIfSettledUnobserved(e);
}
function settleErroredDependents(e, t) {
	let n = false;
	const r = /* @__PURE__ */ new Set();
	const visit = (e) => {
		if (r.has(e)) return;
		r.add(e);
		if (e.m?.V === t) {
			enqueueSub(e);
			n = true;
		}
		forEachDependent(e, visit);
	};
	forEachDependent(e, visit);
	if (n) schedule();
}
function settlePendingSource(e, t = e) {
	removePendingSource(e, t);
	let n = false;
	let r;
	const o = /* @__PURE__ */ new Set();
	const settle = (f) => {
		if (o.has(f) || t !== e && retryReaches(f, t) || !removePendingSource(f, t)) return f.u & 16384 && enqueueSub(f);
		o.add(f);
		f.Ne = clock;
		const u = f.m?.Se?.values().next().value;
		const i = f.G & 2;
		if (u) {
			if (!i) setPendingError(f, u);
		} else {
			f.G &= -2;
			if (!i) setPendingError(f);
			if (f.u & 256) joinFuture(txOf(f));
			if (f.m?.Ie) {
				enqueueSub(f);
				n = true;
			}
			if (f.m !== null) f.m.Ie = false;
			if (!f.t && f.u & 32) (r ??= []).push(f);
		}
		forEachDependent(f, settle);
	};
	forEachDependent(e, settle);
	if (r) for (const e of r) releaseIfSettledUnobserved(e);
	if (n) schedule();
}
function isThenable(e) {
	return e != null && typeof e === "object" && typeof e.then === "function";
}
/** Fire and clear a node's iterator-flight cancellation hook (#3122). */ function releaseFlightTeardown(e) {
	const t = e.m?.Te;
	if (t != null) {
		e.m.Te = null;
		t();
	}
}
function handleAsync(e, t, n, r) {
	let o = false;
	let f = false;
	if (typeof t === "object" && t !== null) untrack(() => {
		o = t[Symbol.asyncIterator];
		f = !o && isThenable(t);
	});
	if (!f && !o) {
		if (e.m !== null) e.m.De = null;
		e._e = false;
		return t;
	}
	ext(e).De = t;
	e.m.Oe = 2147483647;
	e.m.Se = void 0;
	let u;
	const handleError = (n) => {
		if (e.m?.De !== t) return;
		let o = n instanceof NotReadyError;
		if (o && e._e) {
			if (e.m !== null) e.m.De = null;
			parkLoadingWindow(e, n);
			e.Ne = clock;
			return;
		}
		notifyStatus(e, o ? 1 : 2, n);
		if (o) settlePendingSource(e);
		e.Ne = clock;
		if (!o) releaseSettledDependents(e);
		r?.(n, o);
	};
	const asyncWrite = (r, o) => {
		if (e.m?.De !== t) return;
		if (e.R & 2) return;
		const f = !!(e.G & 4);
		landStatus(e);
		if (n) {
			try {
				n(r);
			} catch (e) {
				handleError(e);
				return;
			}
			if (f) landStatus(e, true);
		} else {
			let t = e.m.Re;
			e.m.Re = null;
			if (f && t && (t = liveTx(t))) holdNode(e, t);
			try {
				setSignal(e, () => r);
			} catch (t) {
				notifyStatus(e, 2, t);
			}
		}
		if (e.Ae === NOT_PENDING) {
			e._e = false;
			trimStaleDeps(e);
		}
		settlePendingSource(e);
		schedule();
		flush();
		o?.();
	};
	const settleAutodispose = () => {
		if (e.u & 32 && !e.t && !(e.G & 1)) {
			unobserved(e);
			return true;
		}
		return false;
	};
	const consumeIterator = (n, r) => {
		const o = n[Symbol.asyncIterator]();
		let f = false;
		let i = false;
		let s = !r;
		const close = () => {
			if (i) return;
			i = true;
			try {
				const e = o.return?.();
				if (isThenable(e)) e.then(void 0, () => {});
			} catch {}
		};
		r ? r(close) : cleanup(close);
		ext(e).Te = close;
		const iterateOrRelease = () => {
			if (!settleAutodispose()) iterate();
		};
		const iterate = () => {
			let n, r, l = false, a = false, c = true;
			const S = o.next();
			(isThenable(S) ? S : { then: (e) => void e(S) }).then((r) => {
				if (c && s) {
					n = r;
					l = true;
					if (r.done) i = true;
				} else if (e.m?.De !== t) return;
				else if (!r.done) {
					f = true;
					asyncWrite(r.value, iterateOrRelease);
				} else {
					i = true;
					if (f) {
						schedule();
						flush();
					} else asyncWrite(void 0);
					settleAutodispose();
				}
			}, (n) => {
				if (c && s) {
					r = n;
					a = true;
				} else if (e.m?.De === t) {
					i = true;
					handleError(n);
					settleAutodispose();
				}
			});
			c = false;
			if (a) {
				i = true;
				handleError(r);
				if (s) throw r;
				return true;
			}
			if (l && !n.done) {
				u = n.value;
				f = true;
				return iterate();
			}
			return l && n.done;
		};
		const l = iterate();
		s = false;
		return f || l;
	};
	let i = null;
	const flattenIfIterable = (e, t) => {
		let n = false;
		if (typeof e === "object" && e !== null) untrack(() => {
			n = e[Symbol.asyncIterator];
		});
		if (!n) return false;
		const r = consumeIterator(e, t);
		if (!t) i = r;
		return true;
	};
	if (f) {
		let n = false, r = false, o, f = true;
		const registerDeferredClose = (t) => {
			if (!e.Pe) e.Pe = t;
			else if (Array.isArray(e.Pe)) e.Pe.push(t);
			else e.Pe = [e.Pe, t];
		};
		t.then((r) => {
			if (f) {
				u = r;
				n = true;
			} else if (e.m?.De === t && !(e.R & 64) && flattenIfIterable(r, registerDeferredClose));
			else {
				asyncWrite(r);
				settleAutodispose();
			}
		}, (e) => {
			if (f) {
				o = e;
				r = true;
			} else {
				handleError(e);
				settleAutodispose();
			}
		});
		f = false;
		if (r) {
			handleError(o);
			throw o;
		} else if (!n) {
			if (e._e) return e.pe;
			throw new NotReadyError(context);
		} else if (!flattenIfIterable(u)) e._e = false;
	}
	if (o) flattenIfIterable(t);
	if (i !== null) {
		if (!i) {
			if (e._e) return e.pe;
			throw new NotReadyError(context);
		}
		e._e = false;
	}
	return u;
}
function clearStatus(e, t = false) {
	if (e.m?.Se) clearPendingSources(e);
	if (e.m?.Ie) {
		if (e.m !== null) e.m.Ie = false;
	}
	e.G = t ? 0 : e.G & 4;
	if (e.m?.V) setPendingError(e);
	const n = statusNotifierOf(e);
	if (n) n.call(e);
}
/**
* Status clear for a flight LANDING (asyncWrite). A landing answers the
* node's OWN question — it retires the node's self entry, not the pending
* state its sources propagated onto it. An input re-asked while this flight
* was up (a second write to the signal feeding `a` while `b`'s first flight
* is in the air, #3373) marks `b` pending on `a` by propagation, with `b`'s
* flight still current: nothing superseded it (the re-ask only changed `a`'s
* status, not yet its value), so the landing arrives, and a full clear made
* `b` answer with the stale value — the newer signal committed beside the
* older derived value (`2 / 1`) for the gap (#3376).
* With another source still pending the node stays derivatively pending on
* it; the landed value is written below (the staged answer is still the
* answer for the inputs it was asked with) and the input's own settle
* releases it, or its value change recomputes the node into a fresh flight.
* `_blocked` clears like a full clear: a landing that passed the `_inFlight`
* guard was not superseded by a re-run (recompute nulls `_inFlight` first),
* so the flag is the flight's own registration throw — the input settling
* unchanged must not re-run the node (an extra flight for the same inputs).
* The node is already STATUS_PENDING in that branch (only notifyStatus fills
* the set, with status; a loading-window park cannot coexist with a live
* flight since registration drops the set), so the flags only change when
* the first landing retires UNINITIALIZED. `_error` must move off self: a
* reader thrown NotReady(self) would park on a retired entry. Companions
* keep their verdict (pending before and after; the write re-syncs them).
*/ function landStatus(e, t = false) {
	const n = e.m?.Se;
	if (n && (n.delete(e), n.size)) {
		e.m.Ie = false;
		if (t) e.G = 1;
		setPendingError(e, n.values().next().value);
	} else clearStatus(e, t);
}
function notifyStatus(e, t, n, r) {
	if (t === 2 && !(n instanceof StatusError) && !(n instanceof NotReadyError)) n = new StatusError(e, n);
	const o = t === 1 && n instanceof NotReadyError ? n.source : void 0;
	if (t === 1 && o) {
		addPendingSource(e, o);
		e.G = 1 | e.G & 4;
		setPendingError(e, o, n);
	} else {
		clearPendingSources(e);
		e.G = t | (t !== 2 ? e.G & 4 : 0);
		ext(e).V = n;
	}
	if (t === 1 && e.u & 8192) {
		if (passLane === null) joinFuture(null);
		return;
	}
	const f = statusNotifierOf(e);
	if (f) {
		f.call(e);
		return;
	}
	propagateStatus(e, t, n);
}
/** The dependents' half of `notifyStatus`: `el`'s status reaches each
* subscriber as a propagated mark (or a re-derive). On its own for a store
* family's leaves, which are not the derive's dependents — the family
* propagates the derive's status from each leaf to the leaf's readers
* (store/projection.ts `wakeFamily`), exactly as a memo's would reach its. */ function propagateStatus(e, t, n, r) {
	const o = t === 1 && n instanceof NotReadyError ? n.source : void 0;
	forEachDependent(e, (r, f) => {
		r.Ne = clock;
		if (r.u & 49152 || t === 1 && f.Ue !== r.Ge) {
			enqueueSub(r);
			schedule();
			return;
		}
		if (t === 1 && o && r.m?.Se?.has(o)) {
			if (passLane === null && (r.u & 2304) === 256 && globalQueue.ee) joinFuture(txOf(r));
			return;
		}
		if (t === 1 && o || t !== 1 && (r.m?.V !== n || r.m?.Se)) {
			if (passLane !== null) GlobalQueue.M(r, passLane, true, e);
			else {
				queuePendingNode(r);
				if (t === 1 && (r.u & 2304) === 256 && !r.i) joinFuture(txOf(r));
			}
			notifyStatus(r, t, n);
		}
	});
}
GlobalQueue.Ce = (e) => {
	if (e.i === 3) {
		deleteFromHeap(e, dirtyQueue);
		e.Fe = true;
		globalQueue.enqueue(2, e.q);
	} else if (e.R & 32 && !(e.R & 65536)) deferZombie(e);
	else recompute(e);
};
GlobalQueue.he = disposeChildren;
let tracking = false;
let context = null;
function recompute(e, t = false) {
	bumpNotifyEpoch();
	const n = e.i;
	const E = passLane;
	setPassLane((e.R & 65536 || (e.u & 10240) === 2048) && e.m?.ke?.Z ? e.m.ke : t && E?._parent.ye != E && (creatorPass(context)?.R ?? 0) & 4 ? E : null);
	if (!t) {
		deleteFromHeap(e, dirtyQueue);
		if (e.m !== null) {
			e.m.De = null;
			releaseFlightTeardown(e);
		}
		if (e.u & 256) {
			const t = txOf(e);
			if (t.Z);
			else if (n !== 1 && !(e.u & 16384)) joinPassTx(t);
			else if (t !== flushTransaction && !(e.G & 4)) {
				e.Ae = NOT_PENDING;
				if (n === 1) e.u &= -257;
			}
		}
		if (n === 3 || e.u & 128) disposeChildren(e);
		else if (e.ge !== null || e.Pe !== null) parkChildren(e);
	}
	const u = !!(e.G & 4);
	const s = e.G & 2 ? e.m?.V : void 0;
	const l = (e.G & 1) !== 0 ? e.m?.Se : void 0;
	const _ = e.m?.Se?.has(e);
	const o = (e.R & 8192) !== 0 && !(e.G & 1 && e.m !== null && !e.m.be);
	const r = context;
	context = e;
	e.S = null;
	e.Ge++;
	e.R = 4 | e.R & 32;
	e.Ne = clock;
	let I = e.Ae !== NOT_PENDING ? e.Ae : e.u & 2048 ? e.m.Z : e.pe;
	let a = e.Le;
	let N = false;
	let f = false;
	let T = tracking;
	tracking = true;
	try {
		if (e.u & 64) {
			I = e.re(I);
			if (e.m !== null) e.m.De = null;
			e._e = false;
		} else {
			const t = e.m?.De;
			const n = e.re(I);
			const E = typeof n === "object" && n !== null;
			const u = e.m?.De !== t;
			I = u || !E ? n : handleAsync(e, n);
			if (!u && !E) {
				if (e.m !== null) e.m.De = null;
				e._e = false;
			}
		}
		if (e.G !== 0 || e.m !== null) clearStatus(e, t);
	} catch (t) {
		const n = t instanceof NotReadyError;
		if (n && e._e) parkLoadingWindow(e, t);
		else {
			if (n) ext(e).Ie = true;
			notifyStatus(e, n ? 1 : 2, t);
			if (n && _ && !e.m?.De) settlePendingSource(e);
			if (n && l) {
				for (const t of l) if (t !== e && !e.m?.Se?.has(t)) settlePendingSource(e, t);
			}
		}
	} finally {
		tracking = T;
		N = (e.R & REACTIVE_MISSED_WAKE) !== 0;
		f = (e.R & 128) !== 0;
		if (!(e.R & 32768)) e.u &= -16385;
		e.R = e.R & 936032 | (t ? e.R & 256 : 0);
		context = r;
		if (e.m !== null) e.m.be = o && (e.G & 1) !== 0;
	}
	if (e.R & 64) {
		clearDeps(e);
		if (e.m !== null) e.m.De = null;
		setPassLane(E);
		return;
	}
	let S = passLane;
	const c = !!e.m?.V;
	if (S !== null) {
		if (GlobalQueue.M(e, S, t, c)) setPassLane(S);
		else S = null;
	}
	if (!e.m?.V) {
		const i = e.Ae !== NOT_PENDING ? e.Ae : e.u & 2048 && e.m.Z !== NOT_PENDING ? e.m.Z : e.pe;
		let o = false;
		try {
			o = !n && u || !e.We || !e.We(i, I);
		} catch (t) {
			notifyStatus(e, 2, t);
		}
		if (n && o && !(e.R & 262144 && !e.Fe && Object.is(e.Ze, I)) && e.Ae === NOT_PENDING) {
			e.Fe = !e.m?.V;
			if (!t || S !== null) globalQueue.enqueue(n, e.J ??= GlobalQueue.X.bind(null, e), S);
		}
		if (!t && S === null && e.u & 8192 && GlobalQueue.Qe(e, I, c));
		else if (c);
		else if (o) {
			if (S !== null) {
				if (n && e.Ae === NOT_PENDING) e.pe = I;
				else if (n || S.ve) e.Ae = I;
				else e.m.Z = I;
			} else if (t ? !((flushTransaction !== null || passTx !== null) && (f || E && e.R & 16384 || (creatorPass(r)?.R ?? 0) & 128)) : n && e.Ae === NOT_PENDING) e.pe = I;
			else {
				e.Ae = I;
				if (t) {
					holdNode(e, flushTransaction ?? passTx);
					e.G |= 4;
				}
			}
			if (e.t !== null) {
				insertSubs(e);
				if (S !== null) laneDirty(e, S);
			}
		} else if (e.Le != a) for (let t = e.t; t !== null; t = t.l) insertIntoHeapHeight(t.o, dirtyQueue);
		if (!o && !e.m?.V) {
			if (s !== void 0) settleErroredDependents(e, s);
			if (l) {
				for (const t of l) if (t !== e) settlePendingSource(e, t);
			}
		}
		if (_ && !(e.G & 5)) settlePendingSource(e);
	}
	if (t && S === null && (f || E && e.R & 16384) && e.G & 1) ext(e).Re = flushTransaction ?? passTx;
	if (!e.m?.V && e.Ae === NOT_PENDING && !(n && e.Fe)) {
		if (t || n === 3) trimStaleDeps(e);
		else heldTrim(e);
	}
	if (e.Ae !== NOT_PENDING || e.m !== null && (e.m.Me !== null || e.m.Be !== null) || (e.G & 5) !== 0 && (!t || (e.G & 1) !== 0)) {
		e.u |= 128;
		if (S === null) queuePendingNode(e);
	}
	setPassLane(E);
	if (N) {
		enqueueSub(e);
		schedule();
	}
}
function updateIfNecessary(e) {
	if (e.R & 68) return;
	if (e.R & 1) for (let t = e._; t; t = t.p) {
		const n = t.I;
		if (n.re) updateIfNecessary(n);
		if (e.R & 2) break;
	}
	if (e.R & 2 || e.m?.V && e.Ne < clock && !e.m?.De) recompute(e);
	e.R = e.R & 937336;
}
function computed$1(e, t) {
	const n = t?.transparent ?? false;
	const E = t !== null && typeof t === "object" && "loadingValue" in t;
	const u = {
		id: inheritId(t, n, context),
		u: (n ? 4 : 0) | (t?.ownedWrite ? 1 : 0) | (!context || t?.lazy ? 32 : 0) | (t?.sync ? 64 : 0) | (t?.ie ? 2 : 0) | (t?.we ?? 0) | 0,
		We: t?.equals ?? isEqual,
		Pe: null,
		U: context?.U ?? defaultContext,
		Ye: 0,
		re: e,
		pe: E ? t.loadingValue : void 0,
		Le: 0,
		je: void 0,
		Ke: null,
		_: null,
		S: null,
		Ge: 0,
		t: null,
		qe: null,
		_parent: context,
		me: null,
		Je: null,
		ge: null,
		R: t?.lazy ? 512 : 0,
		G: E ? 0 : 4,
		Ne: clock,
		Ae: NOT_PENDING,
		ze: -1,
		_e: E,
		m: null
	};
	if (t?.unobserved) ext(u).Xe = t.unobserved;
	setupComputedNode(u, t);
	return u;
}
/** Lazily allocate a node's cold extension (ONE shape for signals and
* computeds — `_x` access stays monomorphic). Installers write through
* this; hot paths read `el._x?._field` gated by the _config presence bits.
* Never call ext() just to store a field's default. */ function ext(e) {
	return e.m ??= {
		De: null,
		Te: null,
		V: void 0,
		Ie: void 0,
		Se: void 0,
		Xe: void 0,
		xe: void 0,
		Me: null,
		Be: null,
		ke: null,
		Re: null,
		be: false,
		$e: NOT_PENDING,
		et: -1,
		Oe: 0,
		Z: NOT_PENDING,
		T: 0
	};
}
/** A tracked read of a held node (the reader derives from its transaction's
* world): the reading pass is marked as having read it (born-held decision
* in `recompute`), and the flush joins the node's transaction — unless the
* reader is a render effect. A render effect is the frame, not a derivation
* (rule 3): in that transaction's own flush, or born into it (uninitialized,
* A29), it reads the staged value and holds nothing of its own; otherwise it
* reads the committed value instead (`frameRead`). A node born into the
* future has no committed value: every reader joins it. A first pass is
* something not ready under a loading boundary that has not shown content:
* the boundary collects it and shows its fallback, and the pass is the
* boundary's, not the tick's (A29's boundary exemption, #3540). */ function joinPass(e, t) {
	e.R |= 128;
	if (t.G & 4 || e.i !== 1) joinPassTx(txOf(t), GlobalQueue.ce?.(e));
}
/** A15's stale reader (shared-hole and reveal corollaries): a render effect
* reading a node held by a transaction that is not the flush's. It is served
* the committed value — a pending one's too — publishes mainline, and is
* re-derived after that transaction's landing (`_reruns`,
* REACTIVE_FRAME_READ) so the frame catches up with it once it is the
* committed world. Not a frame born into that transaction (held and never
* committed — created by one of its held passes, A29): that one reads its
* transaction's values and keeps staging. Not of a flight whose inputs are
* already visible (CONFIG_INPUTS_PUBLISHED, #3305): its committed value
* would tear against them, so the reveal observes the flight instead. Once
* per pass.
*
* Lane work is a stale reader too (maintainer, 2026-10-01: a lane sees the
* screen plus its own guesses). A held write is held because showing it
* would tear against the rest of its frame; a lane revealing a derivation
* of it would show it anyway, beside inputs still committed elsewhere on
* the page. The guess is the one value the user opted into predicting. So
* a lane pass reading a transaction's held node — its parent's or any
* other's — derives from the committed value and is re-derived at that
* landing. The case read-through was built for — a corrected guess whose
* downstream async must refetch with the truth at once, while another of
* the parent's flights is still up — needs none of this: the correction
* dissolves the lane, and the refetching pass is the parent's own, reading
* the truth as a member (`joinPass`). */ function frameRead(e, t) {
	const n = e.u & CONFIG_VERDICT;
	if ((passLane === null || e.G & 4 && t.G & 1) && !n && (e.i !== 1 || t.u & 1024)) return false;
	const E = txOf(t);
	if (E === flushTransaction && passLane === null && !n || e.G & 4 && e.u & 256 && txOf(e) === E) return false;
	staleReader(e, E);
	return true;
}
/** The computed whose pass a creation under `owner` belongs to (a root's is
* its nearest computed ancestor's), or null outside every pass. */ function creatorPass(e) {
	return e !== null && e.Et ? e.ut : e;
}
/** L2 — park the previous pass's frame for this node's commit: the children
* (already allocated — nothing new) and the `_disposal` list move to the
* extension, keep reacting from the heap, and die when the commit publishes
* the frame that replaces them (`commitPendingNode`) or when the owner does. */ function parkChildren(e) {
	markDisposal(e);
	const t = ext(e);
	t.Be = e.Pe;
	t.Me = e.ge;
	e.Pe = null;
	e.ge = null;
	e.Ye = 0;
}
/**
* Build an Effect node with all effect-specific fields baked into a single object literal,
* so V8 sees the full hidden class shape at construction time. Effects always run in lazy
* mode (recompute is called explicitly by `effect()`), so we hardcode the lazy bits and skip
* the auto-dispose CONFIG bit (effect() previously cleared it post-construction).
*/ function createEffectNode(e, t, n, E, u) {
	const s = u?.transparent ?? false;
	const i = {
		id: inheritId(u, s, context),
		u: (s ? 4 : 0) | (u?.ownedWrite ? 1 : 0) | (u?.sync ? 64 : 0) | (u?.we ?? 0) | 0,
		We: false,
		Pe: null,
		U: context?.U ?? defaultContext,
		Ye: 0,
		re: e,
		pe: void 0,
		Le: 0,
		je: void 0,
		Ke: null,
		_: null,
		S: null,
		Ge: 0,
		t: null,
		qe: null,
		_parent: context,
		me: null,
		Je: null,
		ge: null,
		R: 512,
		G: 4,
		Ne: clock,
		Ae: NOT_PENDING,
		ze: -1,
		_e: false,
		Fe: false,
		Ze: void 0,
		st: t,
		it: n,
		lt: void 0,
		i: E,
		m: null
	};
	if (u?.unobserved) ext(i).Xe = u.unobserved;
	setupComputedNode(i, lazyOptions);
	return i;
}
/**
* The shared status notifier for effect nodes, installed once by effect.ts
* at module evaluation (`this`-dispatched — one function serves every
* effect, so nodes never store it). CARVE 4: the boundaries' per-node
* channel (`_x._notifyStatus`) went with them; effects are the only
* display consumers.
*/ let effectStatusNotify = null;
function setEffectStatusNotify(e) {
	effectStatusNotify = e;
}
/** Resolve a node's status notifier: effect nodes (`_type` — EFFECT_PURE is
* 0, and only effect literals carry the field) get the shared notifier.
* Presence doubles as the "display consumer" membership test in the status
* walks, exactly as the per-node field did when every effect carried one. */ function statusNotifierOf(e) {
	return e.i ? effectStatusNotify ?? void 0 : void 0;
}
const lazyOptions = { lazy: true };
function setupComputedNode(e, t) {
	e.Ke = e;
	const n = context?.Et ? context.ut : context;
	if (context) linkChild(context, e);
	if (n) e.Le = n.Le + 1;
	GlobalQueue._t?.(e);
	!t?.lazy && recompute(e, true);
}
function signal$1(e, t) {
	const n = {
		We: t?.equals ?? isEqual,
		u: (t?.ownedWrite ? 1 : 0) | (t?.ie ? 2 : 0),
		pe: e,
		t: null,
		qe: null,
		Ne: clock,
		Ae: NOT_PENDING,
		ze: -1,
		m: null
	};
	if (t?.unobserved) ext(n).Xe = t.unobserved;
	return n;
}
function isEqual(e, t) {
	return e === t;
}
/** A store slot node (CONFIG_SLOT_NODE): the whole node in ONE literal — the
* target and key as back-refs in place of closures (`equals` is a method
* call, `this` the node; the unobserved sweep dispatches to one shared hook,
* graph.ts), the store's wrap cache (`px`/`pxv`: the proxy last served for
* this key and the raw it wrapped — one pointer compare replaces a WeakMap
* lookup per read) and the accessor verdict (`acc`) pre-shaped. No options
* object, no NodeExtension, no post-construction expandos. `ownedWrite` is
* baked in: the setter carries the owned-scope guard; node-level writes are
* the store's notification machinery. The observe literal adds the label
* slot (the store relabels it `store.<key>` when the engine is installed). */ function slotSignal(e, t, n, E, u) {
	return {
		We: t,
		u: 4097,
		pe: e,
		t: null,
		qe: null,
		Ne: clock,
		Ae: NOT_PENDING,
		ze: -1,
		m: null,
		ot: n,
		rt: E,
		acc: u,
		px: void 0,
		pxv: void 0
	};
}
/**
* Runs `fn` outside of any reactive tracking — reads inside `fn` will not
* subscribe the current scope. Returns whatever `fn` returns.
*
* Use `untrack` inside a memo or effect when you need to read a signal once
* without making the surrounding computation depend on its future changes.
*
* Pass a `strictReadLabel` string to enable a dev-mode warning: any reactive
* read inside `fn` that isn't inside a nested tracking scope will log a
* warning naming the label.
*
* @example
* ```ts
* createEffect(
*   () => trigger(),                 // tracks `trigger` only
*   () => {
*     const snapshot = untrack(() => state); // read once, untracked
*     log(snapshot);
*   }
* );
* ```
*/ function untrack(e, t) {
	if (GlobalQueue.It === null && !tracking && true) return e();
	const n = tracking;
	tracking = false;
	try {
		if (GlobalQueue.It) return GlobalQueue.It(e);
		return e();
	} finally {
		tracking = n;
	}
}
/**
* Bring a computed to a readable state: lazy/disposed nodes are (re)computed;
* `refresh` additionally pulls the node fully up to date so its status flags
* reflect the current graph.
*/ function prepareComputed(e, t) {
	if (e.R & 512) {
		e.R &= -513;
		recompute(e, true);
	} else if (e.R & 64) {
		if (e.u & 32) {
			const t = e._parent;
			if (t !== null) {
				if (t.R & 64) {
					e.u &= -33;
					return;
				}
				if (!(e.R & 32)) linkChild(t, e);
			}
			recompute(e, true);
		}
	}
}
/**
* Rule 1 (value selection): does this reader see a STAGED node's COMMITTED
* value? One implementation of the rule the fast paths (read's fast block)
* carry as their trivial ternary. In order:
* - no reader at all (an untracked read) — the committed frame;
* - nothing staged;
* - a children-forbidden reader (createTrackedEffect / onSettled: the frame,
*   never the graph — A32).
* False means the reader derives from the staged value.
*/ function readerSeesCommitted(e, t) {
	return !!(!t || e.Ae === NOT_PENDING || t.u & 16);
}
/** A28 — set when a node is staged (queuePendingNode) OUTSIDE a flush;
* cleared when the next flush begins. The read sites test this one module
* boolean instead of `globalQueue._running`: inside a flush it is false and
* the A28 arm costs nothing; outside, only a tick with unflushed writes pays
* the staged-node check. */ let unflushedStaged = false;
function markUnflushedStaged() {
	unflushedStaged = true;
}
/** A28 — a write becomes visible at flush. Outside a flush, a node holding a
* staged value was written since the last flush: staging commits at flush
* end, so nothing else leaves a node in this state. Inside a flush the rule
* does not apply (A28 (4): promoted within the round). The value an
* unflushed node serves is its committed value, or NOT_PENDING when nothing
* is unflushed. Exempt: promoted writes (A28 (4): a write issued inside a
* recompute is promoted at that recompute's end — boundary and loading
* machinery, signals declared for in-computation writes). */ function unflushedValue(e) {
	if (globalQueue.ee || e.Ae === NOT_PENDING || e.u & 4194304) return NOT_PENDING;
	if (e.u & 256) return e.m.et === clock ? e.m.$e : NOT_PENDING;
	return e.pe;
}
/** A28: a held node rewritten outside a flush keeps the staging the last
* flush left (`_flushed`) until the flush that carries the rewrite — the
* stash is stamped with the clock, which that flush advances. */ function stashFlushed(e) {
	const t = e.m;
	if (t.et !== clock) {
		t.$e = e.Ae;
		t.et = clock;
		unflushedStaged = true;
	}
}
/** Nodes written inside a creation-time recompute (CONFIG_PROMOTED). */ const promotedWrites = [];
/** A derivation served the committed value because of an unflushed write
* (A28) must run again in the flush that carries it — the late-linker case
* (#3337's reason to defer the walk): it linked after the write walked. */ function markLateLinker(e) {
	e.R |= REACTIVE_MISSED_WAKE;
	return true;
}
function resyncUnflushedCompanions() {
	unflushedStaged = false;
	if (promotedWrites.length !== 0) {
		for (const e of promotedWrites) e.u &= -4194305;
		promotedWrites.length = 0;
	}
}
/** A tracked read's pull of a computed: bring it current when the flush has
* reached its height (or the reader is a fresh-pull waiter), and sit the
* reader above it. */ function pullComputed(e, t) {
	if (e.Le >= dirtyQueue.He) {
		markNode(t);
		markHeap(dirtyQueue);
		updateIfNecessary(e);
	} else if (t.u & 65536) updateIfNecessary(e);
	const n = e.Le;
	if (n >= t.Le && e._parent !== t) t.Le = n + 1;
}
function read(e) {
	let t = context;
	if (t?.Et) t = t.ut;
	const n = e;
	const E = e;
	if (typeof n.re === "function") prepareComputed(e);
	if (!n.re && e.m?.xe === void 0 && (!unflushedStaged || e.Ae === NOT_PENDING) && !(e.u & 2048) && true) {
		if (t) {
			if (tracking) link(e, t);
			if (e.u & 256 && !(t.u & 16)) {
				if (frameRead(t, e)) return e.pe;
				joinPass(t, e);
			}
		}
		if (!t || e.Ae === NOT_PENDING || t.u & 16) return e.pe;
		if (t.u & 16384 && stagedScreen(t)) return e.pe;
		stagedRead(t);
		return e.Ae;
	}
	let u = false;
	if (t) {
		if (tracking) {
			link(e, t);
			if (E.re) pullComputed(E, t);
		}
		if (e.u & 256 && !(e.u & 2048) && !(t.u & 16)) {
			if (E.G & 4 || !frameRead(t, e)) joinPass(t, e);
			else u = true;
		}
	}
	if (e.u & 2048) {
		const n = GlobalQueue.Nt(t, e);
		if (n !== NOT_PENDING) return n;
	}
	if (E.G & 1 && !u && !(e.u & 2048) && !(E.G & 4)) {
		if (passLane !== null && !(t?.G & 4)) u = true;
		else if (t !== null && t.u & 16384) u = GlobalQueue.ft(t, E);
	}
	if (E.G & 1 && !u) {
		if (t) {
			if (!(t.u & 16) || E.G & 4) {
				if (!tracking && e !== t) link(e, t);
				throw E.m?.V;
			}
		} else if (E.G & 4) throw E.m?.V;
	}
	if (E.re && E.G & 2) {
		if (tracking && E.Ne < clock) {
			recompute(E);
			return read(e);
		} else throw E.m?.V;
	}
	if (u) return e.pe;
	const s = serve(e, t);
	if (!t && typeof n.re === "function" && e.u & 32 && !(E.G & 1) && !e.t) {
		dormantNodes.add(e);
		schedule();
	}
	return s;
}
/**
* Rule 1, the one slow implementation (DESIGN-CONSOLIDATION move 3b, step
* 6c): the value a reader `c` (null = untracked, no pass) is served from
* `el`. Called by read()'s slow tail; the fast path (read's fast block) keeps
* its trivial ternary by design (perf, see the doc). Arms, in order:
* - a node born staged has nothing for an untracked reader (A19 exception 1);
* - an unflushed write serves committed and re-runs the reader in the
*   carrying flush (A28);
* - readerSeesCommitted, else the staged value.
*/ function serve(e, t) {
	if (e.Ae !== NOT_PENDING && e.G & 4 && (!t || t.u & 16)) throw new NotReadyError(null);
	const n = t && unflushedStaged ? unflushedValue(e) : NOT_PENDING;
	if (n !== NOT_PENDING) {
		markLateLinker(t);
		return n;
	}
	if (readerSeesCommitted(e, t)) return e.pe;
	if (t.u & 16384 && !(e.G & 4) && stagedScreen(t)) return e.pe;
	stagedRead(t, e);
	return e.Ae;
}
/** A pass read a staging of this flush: it derives from what the flush may
* yet hold (REACTIVE_STAGED_READ — the seam decides). Lane work too (plan sec. 28, a
* lane sees the screen plus its own guesses): the staging is the screen if
* the frame commits — one pass, the common case — and a held write if it
* parks, which the seam repairs (`stagedReaders`): the pass re-derives on
* the committed world and its lane's runs wait that round, so the held
* write never shows through the lane. A verdict lane's work likewise: the
* lane holds verdicts, not the frame's other stagings (#3851) — except a
* verdict reader, which answered for itself (the lane seam, lanes.ts). Not
* a read of a node born staged: it has no committed value to re-derive on,
* and a re-run would read the same staging and re-queue every round. */ function stagedRead(e, t) {
	e.R |= REACTIVE_STAGED_READ;
	if (passLane !== null && !(t?.G & 4)) stagedReaders.push(e);
}
/** A10 for a staged node: a verdict reader (the pass entered a window) that
* also reads a frame's proposal plainly sees the screen — `[latest(q), q()]`
* is `[b, a]` — once the frame has a transaction, and re-derives when it
* lands: at this very seam if nothing holds it (the stale run is void,
* #3322 — one run, on the committed world), or with the hold. Before any
* transaction the answer is the seam's and the reader watches it
* (verdict.ts). A node born into the future has no screen: its staging is
* its only value (A29). */ function stagedScreen(e) {
	if (flushTransaction === null) return false;
	staleReader(e, flushTransaction);
	return true;
}
/** A28 (4) — written inside a recompute that runs OUTSIDE a flush (a
* creation-time compute): promoted at that pass's end, visible to the rest of
* the block. Cold: only contextual writes reach here. */ function notePromotedWrite(e) {
	if (globalQueue.ee || e.u & 4194304) return;
	e.u |= CONFIG_PROMOTED;
	promotedWrites.push(e);
}
function setSignal(e, t) {
	const n = e.Ae === NOT_PENDING ? e.pe : e.Ae;
	if (typeof t === "function") t = t(n);
	if (e.u & 2048) return GlobalQueue.Tt(e, t);
	if (e.u & 256) joinFuture(txOf(e));
	if (!(!!(e.G & 4) || !e.We || !e.We(n, t))) return t;
	const u = e.Ae !== NOT_PENDING;
	if (!u) queuePendingNode(e);
	else if (e.u & 256 && !globalQueue.ee) stashFlushed(e);
	e.Ae = t;
	if (context !== null) notePromotedWrite(e);
	if (e.re !== void 0) e.Ne = clock;
	if (u && e.ze === notifyEpoch) return t;
	insertSubs(e);
	schedule();
	return t;
}
/**
* User-facing setter for the memo form of `createSignal(fn)`. A write applies
* first, then derivations re-run (A34 as amended 2026-10-01, rule B; core
* R31): the write stages like any other, and a source change — in this flush
* or a later one, under a hold or on mainline — re-derives with the staged
* write as `prev`. The write never refuses the re-run (the frame-scoped mask
* of #3733/#3740 and #2692's "write wins the tick" before it are gone; call
* order inside a flush was never observable) and on its own never causes one.
* REACTIVE_MANUAL_WRITE only marks the staging as a user proposal — the A34
* (1)/(3) discriminator — until a pass re-derives it or the commit lands it.
*/ function setMemo(e, t) {
	const n = e.u & 256 && !(e.R & 1024) && txOf(e) !== flushTransaction;
	if (n && typeof t === "function") t = t(e.pe);
	const E = setSignal(e, t);
	if (n) {
		e.R = e.R & -2 | 2;
		insertIntoHeap(e, dirtyQueue);
		schedule();
	} else if (e.Ae !== NOT_PENDING) e.R |= REACTIVE_MANUAL_WRITE;
	return E;
}
/**
* Executes `fn` with the given `owner` set as the current owner. Any reactive
* primitives (`createSignal`, `createMemo`, `createEffect`, `onCleanup`,
* `cleanup`, etc.) created inside `fn` are attached to that owner, so they
* are disposed when the owner is disposed.
*
* The classic pattern: capture the current owner with `getOwner()` inside a
* component, then re-enter it from a callback (event handler, async resolve,
* setTimeout) so disposables created in the callback get cleaned up with the
* component.
*
* @example
* ```ts
* function delayed<T>(ms: number, fn: () => T) {
*   const owner = getOwner();
*   setTimeout(() => runWithOwner(owner, fn), ms);
* }
* ```
*/ function runWithOwner(e, t) {
	const n = context;
	const E = tracking;
	context = e;
	tracking = false;
	try {
		return t();
	} finally {
		context = n;
		tracking = E;
	}
}
/** Live lanes (parented). Scanned at every seam while non-empty. */
const lanes = [];
function newLane(e) {
	const n = newTransaction(true, e);
	lanes.push(n);
	return n;
}
/** A lane node's current value: its guess, or the latest it derived — the
* staging a shown lane holds for its next reveal, else its slot; the
* committed value while it has none (its first lane pass in flight). */ function laneValueOf(e) {
	if (!(e.u & 8192) && e.Ae !== NOT_PENDING) return e.Ae;
	const n = e.m.Z;
	return n !== NOT_PENDING ? n : e.pe;
}
/** What the screen shows for a lane's node: the lane's value once the lane
* has revealed, the committed truth before. */ function display(e) {
	const n = e.m.Z;
	return e.m.ke.ve && n !== NOT_PENDING ? n : e.pe;
}
/** Guesses written since the last seam (`[node, value, question, …]`).
* Applied at the seam, once the frame's verdict is known — the parent is
* the frame's transaction, and there is none to be optimistic over when the
* frame commits (the write is as if it never happened: nothing was
* applied). The lane's passes run in the next round of the same flush, so
* the guess is visible at flush like any write (A28). */ const pendingGuesses = [];
/** What the writer sees of a node: an unflushed guess to it, else the
* lane's value or the committed one — what an optimistic updater composes
* on (a store setter's draft too, store/optimistic.ts). */ function guessedValueOf(e) {
	const n = pendingGuessOf(e);
	if (n !== NOT_PENDING) return n;
	return e.u & 2048 ? laneValueOf(e) : e.pe;
}
/** The unflushed guess to `n`, else NOT_PENDING. */ function pendingGuessOf(e) {
	for (let n = pendingGuesses.length - 3; n >= 0; n -= 3) if (pendingGuesses[n] === e) return pendingGuesses[n + 1];
	return NOT_PENDING;
}
function optimisticWrite(e, n) {
	const u = guessedValueOf(e);
	if (typeof n === "function") n = n(u);
	if (e.We && e.We(u, n) && !(e.u & 8192)) return n;
	pendingGuesses.push(e, n, nextQuestion());
	schedule();
	return n;
}
/** The seam: each guess becomes its node's lane value, in a lane — the
* node's own if it carries one (a later write into the same lane), else a
* new one under `parent` (the frame's transaction), under the hold already
* on the node (a guess over that transition's world — the truth it holds
* stays staged beneath, for the lane's end to commit), or under a
* transaction opened for the node's own in-flight refetch (the guess is
* that flight's observer — A17, "visible until its own fetch settles"). No
* parent: the guess is dropped. The truth is untouched; readers are
* dirtied for the next round. */
/** A guess's own truth is in flight: the node's own refetch — or, a store
* leaf's, its family's derive (the slot's flight; store/optimistic.ts
* installs the resolver). A17: the guess stands in for the flight. */ function inFlight$1(e) {
	return (e.G & 1) !== 0 || (e.u & 4096) !== 0 && GlobalQueue.F?.(e) === true;
}
function applyGuesses(e) {
	let n = null;
	for (let u = 0; u < pendingGuesses.length; u += 3) {
		const l = pendingGuesses[u];
		const t = pendingGuesses[u + 1];
		let s = true;
		if (l.u & 2048) {
			s = !l.We || !l.We(laneValueOf(l), t);
			if (!(l.u & 8192)) {
				l.Ae = NOT_PENDING;
				l.u |= CONFIG_GUESS;
			}
			l.m.Z = t;
			const n = txOf(l)._parent;
			if (e !== null && n !== null) merge$1(e, n);
		} else {
			let u;
			if (l.u & 256) u = newLane(txOf(l));
			else {
				if (e === null && inFlight$1(l)) e = newTransaction(false);
				if (e === null) continue;
				u = n ??= newLane(e);
			}
			ext(l).Z = t;
			l.u |= 10240;
			list(l, u);
		}
		ext(l).Oe = pendingGuesses[u + 2];
		if (s) {
			insertSubs(l);
			laneDirty(l, txOf(l));
		}
	}
	pendingGuesses.length = 0;
}
/** The running pass read lane `l`'s work as a derivation: it is `l`'s — or,
* already another lane's, the frame it computes derives from both guesses
* and cannot show one without the other (#3335, A15 for lanes): the two
* lanes are linked — one reveal unit, each blocked while any is — while
* their lifetimes stay their own (#2912: a guess reverts with its own
* action, not with the one it shares a reader with). A nested lane reading
* through an ancestor's guess stays its own (the screen plus its own
* guesses). */ function enterLane(e, n) {
	n.R |= REACTIVE_LANE_READ;
	const u = passLane;
	if (u === null) {
		setPassLane(e);
		if (n.R & 128) stagedRead(n);
		return;
	}
	if (sameLane(u, e)) return setPassLane(e);
	if (under(u, e)) return;
	if (under(e, u)) return setPassLane(e);
	linkLanes(u, e);
	setPassLane(e);
}
/** Is `l` nested under `a` (an ancestor lane)? */ function under(e, n) {
	for (let u = e._parent; u !== null && u.Z; u = u._parent) if (u === n) return true;
	return false;
}
/** One link group (a shared array) for both lanes' groups. */ function linkLanes(e, n) {
	const u = e.nn ?? (e.nn = [e]);
	const l = n.nn;
	if (l === u) return;
	if (l === null) {
		u.push(n);
		n.nn = u;
	} else for (let e = 0; e < l.length; e++) {
		u.push(l[e]);
		l[e].nn = u;
	}
}
/** A linked lane blocked on its own account blocks the group — `blocked(k)`
* without the group recursion. (A guess in `k` whose own truth is in flight
* blocks `k`'s parent, not `k` — nor, through the link, `l`: the guess
* shows, A17.) */ function linkBlocked(e) {
	const n = e.nn;
	if (n !== null) for (let u = 0; u < n.length; u++) {
		const l = n[u];
		if (l !== e && (l.tt !== 0 || ownFlights(l) || nestedBlocked(l))) return true;
	}
	return false;
}
function unlink(e) {
	const n = e.nn;
	if (n === null) return;
	const u = n.indexOf(e);
	if (u !== -1) n.splice(u, 1);
	e.nn = null;
}
/** Verdicts (maintainer, 2026-10-01): `isPending` and `latest` are
* optimistic state the system supplies — a verdict is a guess ("pending,
* until this lands"; "the proposal is the value") decided at the seam like
* a user's, and its readers break out of the hold the same way: work of a
* lane under the holder, shown now, re-derived at the landing, ending with
* it. Judged at the seam like any lane: blocked while a verdict reader's
* own derivation is in flight (lane rule 3), shown otherwise. */ function verdictLane(e) {
	return e.ye ??= newLane(e);
}
/** A lane pass's node (core.ts `recompute`, before its staging; a pending
* propagation under a lane pass, async.ts): listed, carrying the lane's
* value from now (a derivation of a guess — its readers become lane work).
* Entering the lane supersedes a frame staging the node carried: this
* pass's answer replaces it, and the frame's hold on it is over. An
* effect's value slot is private (no lane value). A pass in a lane's seat
* that read none of the lane's world has left it (false): its result is the
* frame's — a derivation whose branch no longer reaches the guess — and no
* hold the lane took over from a transaction stays on it (#3698: lane work
* never makes its node transaction work; a born-held effect's hold went to
* the lane). A pass interrupted before it got there (pending, errored) did
* not leave (A30: it never got there). A first pass under a lane is the
* lane's (ruling A); a guess is written, not derived — it never leaves this
* way. `errored`: the pass has no answer — or, a lane pass's pending
* propagation (async.ts `propagateStatus`), the node gone pending. */ function laneStage(e, n, u, l) {
	if (!(u || l || e.R & 131072 || e.u & 8192)) {
		if (e.m !== null) {
			if (e.m.ke?.Z) e.m.ke = null;
			e.m.Z = NOT_PENDING;
		}
		e.u &= -2305;
		return false;
	}
	if (!e.i) {
		if (!(e.u & 2048)) {
			e.Ae = NOT_PENDING;
			e.u = e.u & -257 | CONFIG_OVERRIDE;
			ext(e);
		}
		if (!l) e.u &= -8193;
	} else if (l) {
		if (l !== true && !(l.G & 4) && (e.u & 256 || e.R & 4) && !e.m?.ke?.Z) {
			queuePendingNode(e);
			return false;
		}
		e.R |= REACTIVE_LANE_DIRTY;
	}
	list(e, n);
	return true;
}
function supersede(e, n, u) {
	const l = txOf(e);
	const t = resolveTx(l._parent ?? l);
	if (u) {
		dissolveLane(l, t, e);
		if (l.ve) e.pe = e.m.Z;
		e.u &= -10241;
		e.m.Z = NOT_PENDING;
		e.Ae = n;
		holdNode(e, t);
		joinFuture(t);
		if (e.t !== null) insertSubs(e);
	} else {
		e.Ae = n;
		e.u |= 256;
		joinFuture(t);
		for (let n = e.t; n !== null; n = n.l) if (n.o.u & 131072) enqueueSub(n.o);
	}
}
/** A lane's end, two ways. `into === null`: the parent landed — the lane's
* values are the truth now: a guess lands the truth staged beneath it or
* reverts to the one it covered (`_value`, untouched by the guess); a
* derivation's latest value commits (its frame with it); what the screen
* showed and changes notifies. Otherwise the lane dissolves into `into`
* (the parent, on a correction): its values are void — what it showed stays
* the screen (`_value` takes it, so the parent's re-derivation compares
* against what is seen), a truth staged beneath a guess is the parent's to
* land, and the runs it held (showing the void guess) are dropped: the
* parent's re-derivation makes the runs that show. */ function dissolveLane(e, n, u) {
	const l = lanes.indexOf(e);
	if (l !== -1) lanes.splice(l, 1);
	unlink(e);
	const t = e.ye;
	if (t !== null) {
		e.ye = null;
		if (lanes.indexOf(t) !== -1) dissolveLane(t, null);
	}
	for (let l = 0; l < e.un.length; l++) {
		const t = e.un[l];
		const s = t.m;
		if (t === u || s.ke !== e) continue;
		const i = t.i;
		const r = t.u & CONFIG_GUESS;
		const o = s.Z;
		const E = e.ve && !i ? o : t.pe;
		const f = laneValueOf(t);
		s.Z = NOT_PENDING;
		t.u &= -10241;
		if (n === null) {
			s.ke = null;
			if (!i && !r) t.Ae = f;
			commitPendingNode(t);
			if (!i) {
				if (t.R & 11 || t.G & 1) t.u |= CONFIG_INPUTS_PUBLISHED;
				if (E !== NOT_PENDING && (!t.We || !t.We(E, t.pe))) insertSubs(t);
			}
		} else if (r) {
			if (t.Ae === NOT_PENDING) t.Ae = covered(t);
			if (e.ve) t.pe = o;
			holdNode(t, n);
			insertSubs(t);
		} else {
			s.ke = null;
			if (!i) {
				if (E !== NOT_PENDING && e.ve) t.Ae = E;
				if (t.G & 1) {
					s.De = null;
					enqueueSub(t);
				}
			}
			if (e.ve) {
				commitPendingNode(t);
				if (!i) t.u |= CONFIG_INPUTS_PUBLISHED;
			} else {
				if (s.Me !== null || s.Be !== null) GlobalQueue.he(t, false, true);
				t.u &= -385;
			}
		}
	}
	if (n === null || e.ve && !e.ln) releaseQueues(e);
	else e.tn[0].length = e.tn[1].length = 0;
}
/** Lanes. A lane's node is read by its reader's kind: an authoritative
* reader (`until`) sees the truth — staged beneath a guess, else committed
* — and is no lane's; an untracked read sees the lane's latest value (A17:
* "direct read shows optimistic"; A28); a children-forbidden reader sees
* the frame (A32). A render effect in the frame's seat reading a lane the
* seam found blocked, or a member whose own flight is up (held or not — the
* lane-membership ruling, 2026-10-05), sees the screen, re-derived at the
* reveal (#3460's stale reader) — or, the node a
* flight that has never shown (nothing to show), waits on it: its own frame
* holds (A15, #3334), not the lane's parent. Any other tracked reader is
* the lane's work from this read — a derivation; a leaf reading a lane that
* has shown, or one the seam has not judged yet (its run waits on the
* verdict: released if the lane shows, held if it blocks) — and sees the
* lane's latest. NOT_PENDING falls through: lane work's read of a pending
* member throws like any. */ function laneRead(e, n) {
	const u = n.u & CONFIG_GUESS;
	if (e !== null && e.u & 131072) return u && n.Ae !== NOT_PENDING ? n.Ae : n.pe;
	if (e === null) return laneValueOf(n);
	const l = txOf(n);
	const t = n.G;
	if (!tracking || e.u & 16) {
		if (passLane === null || e.u & 16) return display(n);
		enterLane(l, e);
		if (!u && t & 1) return NOT_PENDING;
		return laneValueOf(n);
	}
	if (e.i === 1 && (passLane === null || !sameLane(passLane, l))) {
		if (!u) {
			if (t & 1 && n.m.Z === NOT_PENDING) return NOT_PENDING;
			if (n.Ae !== NOT_PENDING && e.u & 256 && flushTransaction !== null && resolveTx(flushTransaction) === txOf(e)) return n.Ae;
		}
		if (l.ln || !u && t & 1) {
			if (!u && !l.ve && t & 4) throw new NotReadyError(null);
			if (!(e.R & 262144)) {
				e.R |= 264192;
				l.sn.push(e);
			}
			return display(n);
		}
	}
	enterLane(l, e);
	if (!u && t & 1) return NOT_PENDING;
	return laneValueOf(n);
}
/** The value a guess covered: the node's committed value — a store slot's
* asked of the store (a chained link follows the inner store's commits). */ function covered(e) {
	return e.u & 4096 && GlobalQueue.rn !== void 0 ? GlobalQueue.rn(e) : e.pe;
}
/** A guess in `l` whose own truth is in flight (its refetch — authoritative:
* the landing supersedes, not the body's end). */ function guessFlights(e) {
	for (let n = 0; n < e.un.length; n++) {
		const u = e.un[n];
		if (u.u & 8192 && u.m.ke === e && inFlight$1(u)) return true;
	}
	return false;
}
/** The seam's verdict on a lane. Blocked — its own flight is up — nothing
* moves: the screen keeps what it shows, the lane's runs wait. Unblocked,
* the lane shows: its values are the screen from now (`_shown`), the
* staging its passes made since the last reveal is promoted, their frames
* (children) apply, the stale readers re-derive (#3460), its runs go. */
/** A18 body-end corollary (#3427), at the seam before the park decision
* (the guesses' own passes have run; a correction's re-derivations run in
* one more pure round and are the parent's flights before it is judged —
* #3409: the indicators clear together): the action body having returned,
* a guess whose own truth is not in flight has no answer coming — the truth
* beneath it is its truth, and the correction starts now rather than at the
* lane's flight. (A guess whose own refetch is up is superseded by its
* landing.) True when a lane was judged. */ function laneCorrections() {
	let e = false;
	const n = lanes.slice();
	for (let u = 0; u < n.length; u++) {
		const l = n[u];
		if (lanes.indexOf(l) === -1) continue;
		const t = resolveTx(l._parent);
		if (!t.nt || t.tt !== 0 || t.Z || ownFlights(t) || guessFlights(l)) continue;
		e = true;
		for (let e = 0; e < l.un.length && lanes.indexOf(l) !== -1; e++) {
			const n = l.un[e];
			if (n.u & 8192 && n.m.ke === l) {
				const e = n.Ae !== NOT_PENDING ? n.Ae : covered(n);
				supersede(n, e, !n.We || !n.We(n.m.Z, e));
			}
		}
	}
	return e;
}
function laneSeam(e, n) {
	if (n || blocked(e)) {
		e.ln = true;
		return;
	}
	e.ln = false;
	e.ve = true;
	reruns(e);
	for (let n = 0; n < e.un.length; n++) {
		const u = e.un[n];
		const l = u.m;
		if (l.ke !== e) continue;
		if (!(u.u & 8192) && !u.i && u.Ae !== NOT_PENDING) {
			l.Z = u.Ae;
			u.Ae = NOT_PENDING;
		}
		if (l.Me !== null || l.Be !== null) GlobalQueue.he(u, false, true);
		u.u &= -129;
	}
	releaseQueues(e);
}
/** The parent landed: its lanes end, nested first. (None is blocked: a
* blocked lane blocks its parent.) */ function endLanes(e) {
	for (let n = lanes.length - 1; n >= 0; n--) {
		const u = lanes[n];
		if (resolveTx(u._parent) !== e) continue;
		endLanes(u);
		dissolveLane(u, null);
	}
}
/** A blocked lane blocks its parent (maintainer, 2026-10-01): the lane's
* pending work derives from the frame's write through the guess, so the
* frame is not complete without it (A15) — landing it would commit the write
* beside a derivation still showing the old one. A guess whose own flight is
* up likewise: the question was asked in this frame. */ function lanesBlocked(e) {
	return e.Z && linkBlocked(e) || nestedBlocked(e);
}
/** The lanes under `t` (its own; a link group's are each other's). */ function nestedBlocked(e) {
	for (let n = 0; n < lanes.length; n++) {
		const u = lanes[n];
		if (resolveTx(u._parent) !== e) continue;
		if (blocked(u) || guessFlights(u)) return true;
	}
	return false;
}
/** A write landing on a lane's node (core.ts `setSignal`: a user's write, an
* async landing). On a guess it is its truth (A18 — an async guess's own
* landing), judged against the guess. On a derivation it is the lane's
* latest: its staging once the lane has shown (promoted at the next
* reveal), its slot before; the lane's members re-derive as its work. */ function laneWrite(e, n) {
	if (e.u & 8192) {
		if (stale(e, question)) {
			e.Ae = n;
			e.u |= 256;
			GlobalQueue.En?.(e, n);
			schedule();
			return n;
		}
		supersede(e, n, !e.We || !e.We(e.m.Z, n));
	} else {
		const u = txOf(e);
		if (e.We && e.We(laneValueOf(e), n)) return n;
		if (u.ve) e.Ae = n;
		else e.m.Z = n;
		if (e.re !== void 0) e.Ne = clock;
		insertSubs(e);
		laneDirty(e, u);
	}
	schedule();
	return n;
}
/** A written guess's own pass finished: its source recomputed it — the
* truth (A18: "the source is whatever recomputes the node"), authoritative
* or the lane's own derivation (a guess over `config().courier` under a
* country guess: the lane's config landing confirms or corrects it). An
* errored pass stages nothing. Provenance (A18, #3331): "the source" is the
* guess's own question or a newer one; an older action's answer landing
* over a newer guess (the two entangled when the newer guess was written)
* is stale — a slow source leaking back in over the user's latest intent.
* It is staged beneath the guess, for the commit like any landing, and
* nothing moves: no downstream re-ask, no pending flip on the guess's
* readers (`isPending` of the guess itself says the held truth differs,
* A24). The guess's own question answering supersedes as usual. */ function laneOutcome(e, n, u) {
	if (u) return true;
	if (stale(e, answered(e))) {
		e.Ae = n;
		e.u |= 256;
		return true;
	}
	supersede(e, n, !e.We || !e.We(e.m.Z, n));
	return true;
}
/** THE provenance test, for a derivation's pass and a write alike: an
* answer to question `q` landing on a guess is stale when `q` is older
* than the guess's own; unstamped (0) and mainline are current. */ function stale(e, n) {
	return n !== 0 && n < e.m.Oe;
}
/** The question a derivation's pass answered: the newest among the stamped
* sources that changed this round (a flight's landing carries the question
* that started it); 0 when none is stamped. */ function answered(e) {
	let n = 0;
	for (let u = e._; u !== null; u = u.p) {
		const e = u.I;
		if (e.m !== null && e.m.Oe > n && e.Ne === clock) n = e.m.Oe;
	}
	return n;
}
GlobalQueue.Nt = laneRead;
GlobalQueue.M = laneStage;
GlobalQueue.Qe = laneOutcome;
GlobalQueue.Tt = laneWrite;
/** The lanes alive before this seam's guesses opened theirs (a prefix of
* `lanes`; nothing dissolves one between here and the seam loop): a lane
* born at the seam has no work to judge yet (its passes run next round) —
* it is neither shown nor blocked until it has. */ let judged = 0;
GlobalQueue.fn = (e) => {
	judged = lanes.length;
	if (pendingGuesses.length !== 0) applyGuesses(e);
};
GlobalQueue.Nn = (e) => {
	const n = [];
	if (e !== null) for (let u = 0; u < e.length; u++) {
		const l = e[u];
		const t = l.m?.ke;
		if (l.R & 64 || t != null && t._parent?.ye === t && (l.u & 16384 ? !(l.R & 524288) : !blocked(t._parent))) continue;
		enqueueSub(l);
		if (t != null && t.Z && n.indexOf(t) === -1) n.push(t);
	}
	for (let e = Math.min(judged, lanes.length) - 1; e >= 0; e--) laneSeam(lanes[e], n.indexOf(lanes[e]) !== -1);
};
GlobalQueue.an = () => lanes.length !== 0 && laneCorrections();
GlobalQueue.In = endLanes;
GlobalQueue.cn = lanesBlocked;
GlobalQueue.ne = verdictLane;
/** The reading pass is the holder's verdict lane's — unless already lane
* work, or already the transaction's (it derives from the future — a held
* node's, or the staging of a write this flush may hold — and the verdict
* does not rescue it: its result shows at the landing, re-derived). A lane
* read, for `recompute`'s tail (REACTIVE_LANE_READ). */ function route(e, t) {
	if (passLane === null && !(e.R & 16512)) setPassLane(verdictLane(t));
	e.R |= REACTIVE_LANE_READ;
}
/** A verdict reader served a flight's committed value (the A31 frame-reader
* case) still observed the flight — A15's stale reader "derives from the
* flight all the same": the frame holds (the flush's transaction opens if
* none has, as the throw would have had it), the reader is that
* transaction's verdict lane's (shown now, with the flight's verdict), and
* re-derives at the landing (REACTIVE_FRAME_READ — which is also what makes
* it a blocker of the hold, `blockedBy`; a probe alone is neither). The
* hold is on the flight: a reader served committed never goes pending, so
* the transaction waits on it only through the flight's node — one that
* went pending this flush is queued for the seam to hold; one in the air
* from before, held by nobody (a lane's derivation whose lane dissolved at
* its parent's landing with the flight still up; a flight nothing displayed,
* #3305), is registered by this, its first observer (A15, #3458): queued for
* the seam as if it had gone pending here, so the transaction has an entry
* for what it now shows a reader of. Held by nothing, it landed at this very
* seam and its `_reruns` re-derived the reader into the same observation,
* every flush (fuzzer F12). True when the reader is served the committed
* value — not over a flight committed beneath inputs already on screen (A15
* reveal corollary, #3305): that value would tear against them, and the
* reveal observes the flight. */ function observeFlight(e, t) {
	if (t.u & 1024) return false;
	if (globalQueue.ee) {
		joinFuture(null);
		if (!(t.u & 256)) queuePendingNode(t);
		verdictRead(e, flushTransaction, true);
	}
	return true;
}
let probing = false;
/** A verdict read of a node a transaction (or lane) holds: the reading pass
* is the holder's verdict lane's and re-derives at the holder's landing
* (`_reruns`, as a stale reader). `isPending` flips at the landing with no
* value notifying anyone (a held write's commit; a held landing's): its
* reader re-derives there. `latest` shows the proposal that lands — a
* rewrite or a landing reaches its reader through the link it holds — so a
* re-run would only repeat the frame. */ function verdictRead(e, t, n = probing) {
	route(e, t);
	if (n) staleReader(e, t);
}
GlobalQueue.ft = observeFlight;
/** A store read inside an untracked `isPending` probe found a live mark on
* a record with no node to carry it (store/affects.ts): not final. */ GlobalQueue.dt = () => {};
/**
* Effects are the leaf nodes of our reactive graph. When their sources change, they are
* automatically added to the queue of effects to re-execute, which will cause them to fetch their
* sources and recompute
*/ function effect$2(e, t, u, E) {
	const r = createEffectNode(e, t, u, !!E?.user ? 2 : 1, E);
	recompute(r, true);
	!E?.defer && r.Ae === NOT_PENDING && !r.m?.ke?.Z && (r.i === 2 || E?.schedule ? globalQueue.enqueue(r.i, runEffect.bind(null, r)) : runEffect(r, r.i));
}
function notifyEffectStatus(e, t) {
	const u = e !== void 0 ? e : this.G;
	const E = t !== void 0 ? t : this.m?.V;
	if (u & 2) {
		globalQueue.notify(this, 1, 0);
		if (this.i === 2) {
			if (this.G & 2) {
				this.Fe = true;
				globalQueue.enqueue(this.i, this.J ??= runEffect.bind(null, this));
			}
			return;
		}
		if (!globalQueue.notify(this, 2, 2)) {
			haltReactivity(unwrapStatusError(E));
			throw E;
		}
	} else if (this.i === 1) globalQueue.notify(this, 3, u, E);
}
function runEffect(e, t) {
	if (!e.Fe || e.R & 64) return;
	if (GlobalQueue.de && GlobalQueue.de(e)) return;
	if (e.G & 2 && e.i === 2) {
		const t = unwrapStatusError(e.m?.V);
		e.Ze = e.pe;
		e.Fe = false;
		try {
			e.it ? e.it(t, () => {
				const t = e.lt;
				e.lt = void 0;
				t?.();
			}) : console.error(t);
		} catch (t) {
			if (!globalQueue.notify(e, 2, 2)) {
				haltReactivity(t);
				throw t;
			}
		}
		return;
	}
	const u = e.m?.V == null;
	const E = e.lt;
	e.lt = void 0;
	try {
		E?.();
		e.lt = e.st(e.pe, e.Ze);
	} catch (t) {
		ext(e).V = new StatusError(e, t);
		e.G |= 2;
		if (!globalQueue.notify(e, 2, 2)) {
			haltReactivity(t);
			throw t;
		}
	} finally {
		e.Ze = e.pe;
		e.Fe = false;
		if (u) trimStaleDeps(e);
	}
}
GlobalQueue.X = runEffect;
setEffectStatusNotify(notifyEffectStatus);
const reported = /* @__PURE__ */ new WeakSet();
/** The nearest root's hook above `owner` (parked under `ROOT_ERROR_HOOK`), else the ambient one. */ function hookFor(e) {
	for (let n = e; n; n = n._parent) {
		const e = n[ROOT_ERROR_HOOK];
		if (e !== void 0) return e;
	}
}
/** Component labels up the owner chain, root first — `_name` where the runtime keeps it. */ function labels(e) {
	const n = [];
	for (let o = e; o; o = o._parent) {
		const e = o._name;
		if (typeof e === "string" && e.length) n.push(e);
	}
	return n.length ? n.reverse() : void 0;
}
/**
* Tells the client error hook about `error`, caught by the boundary whose
* owner is `owner`, thrown by `thrower` (the computation the engine's status
* wrapper named; unknown for a value that never crossed one) — once per
* error object. A throwing hook is reported on the console and otherwise
* ignored — a monitor must never take the app down.
* @internal
*/ function reportClientError(e, n, o) {
	if (e !== null && (typeof e === "object" || typeof e === "function")) {
		if (reported.has(e)) return;
		reported.add(e);
	}
	const t = hookFor(n);
	if (t === void 0) return;
	const i = {};
	const f = labels(n);
	const c = labels(o) ?? f;
	if (c !== void 0) i.ownerPath = c;
	if (f !== void 0) i.boundaryPath = f;
	try {
		t(e, i);
	} catch (e) {
		console.error(e);
	}
}
/**
* Low-level reactive-cleanup primitive. Registers a callback that runs when
* the surrounding owner is disposed.
*
* **In 2.0 user code this is rare.** The two cases where you might reach for
* it have better-shaped tools:
*
* - **Component lifecycle (mount/unmount, listeners, intervals):** use
*   {@link onSettled} and **return** a cleanup function. Setup and teardown
*   stay paired in one block. This replaces the 1.x `onMount` + `onCleanup`
*   pairing.
* - **Cleanup tied to an effect run:** `onCleanup` does not belong in
*   `createEffect`'s apply phase. If a compute phase genuinely needs per-run
*   teardown, that's usually a sign the work should be a memo/projection
*   instead, or moved to `onSettled` if it's lifecycle-shaped.
*
* Where `onCleanup` is the right tool is **library / custom-primitive
* internals** — coordinating disposal inside a `createRoot` body, or wiring
* cleanup to a captured owner via `runWithOwner` from a custom factory.
* Application code rarely needs to write any of those shapes directly.
*
* Must be called inside an owner. Calling outside an owner is a no-op (with a
* dev-mode warning).
*
* Cannot be used inside `createTrackedEffect` or `onSettled` — return a
* cleanup function from the callback body instead.
*
* Cleanups run in unwind order: an owner's children are disposed before its
* own cleanups, and within one owner later registrations run before earlier
* ones. In production a component body shares its enclosing owner, so
* register cleanup before creating children when the order between them
* matters.
*
* @example
* ```ts
* // Library shape: thread a resource's disposal into a *captured* owner
* // from a factory that has no settle-phase setup of its own. `onSettled`
* // would queue a callback we don't need; `onCleanup` is the leaner
* // primitive when the only job is "register disposal on this owner".
* function bindToOwner<T extends { dispose(): void }>(owner: Owner, resource: T): T {
*   runWithOwner(owner, () => onCleanup(() => resource.dispose()));
*   return resource;
* }
* ```
*/ function onCleanup(e) {
	return cleanup(e);
}
function accessor(e) {
	const t = read.bind(null, e);
	t[$REFRESH] = e;
	return t;
}
function createSignal$1(e, t) {
	if (typeof e === "function") {
		const r = computed$1(e, t);
		r.u &= -33;
		return [accessor(r), setMemo.bind(null, r)];
	}
	const r = signal$1(e, t);
	return [accessor(r), setSignal.bind(null, r)];
}
function createMemo$1(e, t) {
	return accessor(computed$1(e, t));
}
/**
* Creates a reactive computation that runs during the render phase as DOM elements
* are created and updated but not necessarily connected.
*
* Same compute / effect split as `createEffect`, but scheduled inside the render
* queue rather than after it. Reach for this only when authoring renderer
* plumbing (custom DOM bindings, JSX-generated `insert()` / `spread()` calls).
* App code should use `createEffect`.
*
* ```typescript
* createRenderEffect<T>(compute, effectFn, options?: EffectOptions);
* ```
* @param compute a function that receives its previous value and returns a new value used to react on a computation
* @param effectFn a function that receives the new value and is used to perform side effects
* @param options `EffectOptions` -- name, defer, schedule, transparent
*
* @example
* ```ts
* // Custom directive: bind an element's textContent to a reactive source.
* function bindText(el: HTMLElement, source: () => string) {
*   createRenderEffect(
*     () => source(),
*     value => { el.textContent = value; }
*   );
* }
* ```
*
* @description https://docs.solidjs.com/reference/secondary-primitives/create-render-effect
*/ function createRenderEffect$1(e, t, r) {
	effect$2(e, t, void 0, r);
}
/** Brand keys the proxy answers directly (never user data). */
const $TRACK = Symbol(0);
const $TARGET = Symbol(0);
const $PROXY = Symbol(0);
const $RECORD = Symbol(0);
const rawValues = /* @__PURE__ */ new WeakSet();
let rawValuesUsed = false;
function isRawValue(e) {
	return rawValuesUsed && rawValues.has(e);
}
/** A shallow store's ingested record: raw by contract (values served
* verbatim, slots replaced by reference). */ function markRawOne(e) {
	if (isWrappable(e)) {
		if (e[$TARGET] !== void 0) return;
		rawValuesUsed = true;
		rawValues.add(e);
	}
}
const OBJECT_PROTO = Object.prototype;
const wrappableProtos = /* @__PURE__ */ new WeakMap();
function isWrappable(e) {
	if (e == null || typeof e !== "object" || Object.isFrozen(e)) return false;
	const r = Object.getPrototypeOf(e);
	if (r === OBJECT_PROTO || r === null) return true;
	if (Array.isArray(e)) return true;
	let a = wrappableProtos.get(r);
	if (a === void 0) {
		a = Object.prototype.toString.call(e) === "[object Object]" && (typeof Node === "undefined" || !(e instanceof Node));
		wrappableProtos.set(r, a);
	}
	return a;
}
let writeOverride = false;
function mapArray(t, s, e) {
	const i = typeof e?.keyed === "function" ? e.keyed : void 0;
	const r = s.length > 1;
	const n = s;
	const o = {
		v: createOwner(),
		ht: 0,
		ct: t,
		wt: [],
		Ot: n,
		yt: [],
		un: [],
		rt: i,
		Mt: i || e?.keyed === false ? [] : void 0,
		gt: r && e?.keyed !== false ? [] : void 0,
		St: e?.keyed === false,
		P: e?.fallback
	};
	const h = computed$1(updateKeyedMap.bind(o), void 0);
	h.u &= -33;
	return accessor(h);
}
const pureOptions = { ownedWrite: true };
function trySmallMove(t, s, e, i) {
	const r = t.wt;
	const n = t.ht - 1;
	const o = [];
	const h = [];
	const f = [];
	let c = 256;
	let a = i;
	let u = i;
	let l = false;
	while (a <= n && u <= e - 1) {
		const t = r[a];
		const i = s[u];
		if (t === i) {
			if (!l) {
				f.push(a, u, 0);
				l = true;
			}
			f[f.length - 1]++;
			a++;
			u++;
			continue;
		}
		l = false;
		let p = -1;
		let d = Math.min(32 - o.length, n - a, c);
		for (let t = 1; t <= d; t++) if (r[a + t] === i) {
			p = t;
			break;
		}
		c -= p === -1 ? d : p;
		let w = -1;
		d = Math.min(32 - h.length, e - 1 - u, c);
		for (let e = 1; e <= d; e++) if (s[u + e] === t) {
			w = e;
			break;
		}
		c -= w === -1 ? d : w;
		if (p !== -1 && (w === -1 || p <= w)) {
			while (p-- > 0) o.push(a++);
			continue;
		}
		if (w !== -1) {
			while (w-- > 0) h.push(u++);
			continue;
		}
		if (c <= 0 || o.length === 32 || h.length === 32) return false;
		o.push(a++);
		h.push(u++);
	}
	for (; a <= n; a++) {
		if (o.length === 32) return false;
		o.push(a);
	}
	for (; u <= e - 1; u++) {
		if (h.length === 32) return false;
		h.push(u);
	}
	return commitSmallMove(t, s, e, o, h, f);
}
/** PHASE 2 of the small-move path, in its OWN function so that a pass which
* only SCANS and bails (a full replace: the first structural pass of a page,
* typically) compiles nothing but the scan — V8 parses and compiles lazily
* per function, and cold `replace` measured +0.5 ms with both phases in one
* body. Pairs displaced sources with destinations (an unmatched destination
* is a replacement/insertion → general path), then commits: slice() the live
* arrays, copy shifted runs, patch displaced pairs, dispose leftovers. */ function commitSmallMove(t, s, e, i, r, n) {
	const o = t.wt;
	let h;
	let f;
	let c;
	if (r.length !== 0) {
		c = new Array(i.length);
		for (f = 0; f < r.length; f++) {
			let t = -1;
			for (h = 0; h < i.length; h++) if (!c[h] && o[i[h]] === s[r[f]]) {
				t = h;
				break;
			}
			if (t === -1) return false;
			c[t] = true;
			r[f] = r[f] << 6 | t;
		}
	}
	if (i.length !== 0 || r.length !== 0) {
		const t = /* @__PURE__ */ new Set();
		for (h = 0; h < i.length; h++) t.add(o[i[h]]);
		for (f = 0; f < r.length; f++) t.add(s[r[f] >> 6]);
		for (let s = 0; s < n.length; s += 3) {
			const e = n[s];
			for (let i = 0, r = n[s + 2]; i < r; i++) if (t.has(o[e + i])) return false;
		}
	}
	const a = t.yt;
	const u = t.un;
	const l = a.slice(0, e);
	const p = u.slice(0, e);
	for (let t = 0; t < n.length; t += 3) {
		const s = n[t];
		const e = n[t + 1];
		if (s !== e) for (let i = 0; i < n[t + 2]; i++) {
			l[e + i] = a[s + i];
			p[e + i] = u[s + i];
		}
	}
	for (f = 0; f < r.length; f++) {
		const t = r[f] >> 6;
		const s = i[r[f] & 63];
		l[t] = a[s];
		p[t] = u[s];
	}
	t.yt = l;
	t.un = p;
	t.ht = e;
	t.wt = s.slice(0);
	for (h = 0; h < i.length; h++) if (c === void 0 || !c[h]) u[i[h]].dispose();
	return true;
}
function updateKeyedMap() {
	this.v.ut = getOwner();
	const t = this.ct() || [], s = t.length;
	t[$TRACK];
	runWithOwner(this.v, () => {
		let e, i, r, n, o = this.Mt ? this.St ? () => {
			r[i] = signal$1(t[i], pureOptions);
			return this.Ot(accessor(r[i]), i);
		} : () => {
			r[i] = signal$1(t[i], pureOptions);
			n && (n[i] = signal$1(i, pureOptions));
			return this.Ot(accessor(r[i]), n ? accessor(n[i]) : void 0);
		} : this.gt ? () => {
			const s = t[i];
			n[i] = signal$1(i, pureOptions);
			return this.Ot(s, accessor(n[i]));
		} : () => {
			const s = t[i];
			return this.Ot(s);
		};
		if (s === 0) {
			if (this.ht !== 0) {
				this.v.dispose(false);
				this.un = [];
				this.wt = [];
				this.yt = [];
				this.ht = 0;
				this.Mt && (this.Mt = []);
				this.gt && (this.gt = []);
			}
			if (this.P && !this.yt[0]) {
				this.un[0]?.dispose();
				this.yt[0] = runWithOwner(this.un[0] = createOwner(), this.P);
			}
		} else if (this.ht === 0) {
			const h = new Array(s);
			const f = new Array(s);
			r = this.Mt && new Array(s);
			n = this.gt && new Array(s);
			try {
				for (i = 0; i < s; i++) h[i] = runWithOwner(f[i] = createOwner(), o);
			} catch (t) {
				for (e = 0; e <= i; e++) f[e]?.dispose();
				throw t;
			}
			if (this.un[0]) this.un[0].dispose();
			this.yt = h;
			this.un = f;
			r && (this.Mt = r);
			n && (this.gt = n);
			this.wt = t.slice(0);
			this.ht = s;
		} else {
			let h, f, c, a, u, l, p, d, w;
			const _ = setSignal;
			for (h = 0, f = Math.min(this.ht, s); h < f && (this.wt[h] === t[h] || this.Mt && compare(this.rt, this.wt[h], t[h])); h++) if (this.Mt) _(this.Mt[h], t[h]);
			for (f = this.ht - 1, c = s - 1; f >= h && c >= h && (this.wt[f] === t[c] || this.Mt && compare(this.rt, this.wt[f], t[c])); f--, c--);
			if (h === s && this.ht === s) {
				this.wt = t.slice(0);
				return;
			}
			if (s <= this.ht && f - h > 64 && this.Mt === void 0 && this.gt === void 0) {
				const e = h + (c - h >> 1);
				const i = t[e];
				const r = Math.min(f, e + 32);
				let n = Math.max(h, e - 32);
				while (n <= r && this.wt[n] !== i) n++;
				if (n <= r && trySmallMove(this, t, s, h)) return;
			}
			const y = s - this.ht;
			const A = new Array(s);
			const M = new Array(s);
			r = this.Mt ? new Array(s) : void 0;
			n = this.gt ? new Array(s) : void 0;
			l = /* @__PURE__ */ new Map();
			p = new Array(c + 1);
			for (i = c; i >= h; i--) {
				a = t[i];
				u = this.rt ? this.rt(a) : a;
				e = l.get(u);
				p[i] = e === void 0 ? -1 : e;
				l.set(u, i);
			}
			for (e = h; e <= f; e++) {
				a = this.wt[e];
				u = this.rt ? this.rt(a) : a;
				i = l.get(u);
				if (i !== void 0 && i !== -1) {
					A[i] = this.yt[e];
					M[i] = this.un[e];
					r && (r[i] = this.Mt[e]);
					n && (n[i] = this.gt[e]);
					i = p[i];
					l.set(u, i);
				} else (d ??= []).push(this.un[e]);
			}
			try {
				for (i = h; i <= c; i++) {
					if (M[i] !== void 0) continue;
					(w ??= []).push(M[i] = createOwner());
					A[i] = runWithOwner(M[i], o);
				}
			} catch (t) {
				if (w) for (e = 0; e < w.length; e++) w[e].dispose();
				throw t;
			}
			for (e = 0; e < h; e++) {
				A[e] = this.yt[e];
				M[e] = this.un[e];
				r && (r[e] = this.Mt[e]);
				n && (n[e] = this.gt[e]);
			}
			for (i = h; i <= c; i++) {
				if (r) _(r[i], t[i]);
				if (n) _(n[i], i);
			}
			for (i = c + 1; i < s; i++) {
				A[i] = this.yt[i - y];
				M[i] = this.un[i - y];
				if (r) {
					r[i] = this.Mt[i - y];
					_(r[i], t[i]);
				}
				if (n) {
					n[i] = this.gt[i - y];
					if (y !== 0) _(n[i], i);
				}
			}
			this.yt = A;
			this.un = M;
			r && (this.Mt = r);
			n && (this.gt = n);
			this.ht = s;
			this.wt = t.slice(0);
			if (d) for (e = 0; e < d.length; e++) d[e].dispose();
		}
	});
	return this.yt;
}
function compare(t, s, e) {
	return t ? t(s) === t(e) : true;
}
/**
* Ownership stamp (#3360): every backing the store ALLOCATES (CoW clones,
* privatized committed backings) carries its owning target under this
* enumerable symbol. One property write replaces the two weak-collection
* registrations (ownership set + raw→target map) a fresh object used to pay
* per draft — V8's identity-hash + ephemeron cost dominated the one-key
* write floor. Enumerable so a spread copy (the plain-data clone path) stays
* on the fast path and carries the stamp along.
*
* Owned backings are never user-reachable (`snapshot` copies them, the traps
* hide the key), so every raw key walk in the store must skip `$OWNER`, and
* ownership is answered by `isOwned` — a user object never carries it.
* Overlay drafts (`Object.create(v)` over an owned `v`) inherit the stamp.
*/
const $OWNER = Symbol(0);
/** raw → target for plain (family-less) stores. Family stores use their own
* map so one raw can wrap once per family (§7b). */ const storeLookup = /* @__PURE__ */ new WeakMap();
function setLookup(e, o) {
	(o.fam?.map ?? storeLookup).set(e, o);
}
function isOwned(e) {
	return e[$OWNER] !== void 0;
}
/** The target wrapping `raw` in `fam` (or the plain lookup). An owned raw
* answers from its stamp; a user raw from the map. */ function lookupTarget(e, o) {
	const t = e[$OWNER];
	return t !== void 0 && t.fam === o ? t : (o?.map ?? storeLookup).get(e);
}
/** Sticky descendants flag up the parent chain (§6d): adoption descends
* into a changed child pair only where a target with nodes exists below. */ function markDescendants(e) {
	let o = e;
	while (o && !o.d) {
		o.d = true;
		o = o.u;
	}
}
/**
* Store — plain stores on L2 (plan sec. 31, S1).
*
* A store is a tree of L2 nodes and nothing else carries reactive state:
*
* - **Leaf nodes** (one per tracked-or-written key, lazy; `slotSignal`, one
*   literal): `_value` committed, `_pendingValue` this batch's staging.
* - **Presence nodes** (`in` tracks presence, not value — R13) and the
*   **deep witness** (`deep()` subscribes one node per record).
* - The **container node** `k` (plan sec. 31.3, Q-A): the `$TRACK` node given a
*   value. `_value` is the committed backing, `_pendingValue` the pending
*   backing the draft mutates — so a write to a key nobody reads has a
*   staging home the scheduler owns, and park/commit/revert of the backing
*   is the hold model's, not a fold ledger of the store's. Structural
*   readers (`ownKeys`, iteration, `$TRACK`, `length`, `deep`) subscribe to
*   it; value readers never do — a key with no leaf reads through the
*   container's visible backing without subscribing (R1: node existence is
*   unobservable).
*
* The committed backing (`t.v`) is owned raw (CoW: a user object is shared
* until the first write privatizes it and its ancestor chain). It mutates at
* exactly one moment — the flush's commit (`_storeCommit`), after the
* container node committed its staging. Reads: context-free readers see the
* committed backing until the flush; a pass sees the staging (signal
* parity, RUL-1); the draft reads its own staging.
*
* Perf contracts (plan sec. 31.4): lazy nodes; one literal per node; O(written) per
* setter (`wk`); overlay drafts for large plain records; no new named
* fields on array targets; zero allocation for adopted-but-unread objects.
*/ let optHooks = null;
function installOptHooks(e) {
	optHooks = e;
}
let affectsHooks = null;
function installAffectsHooks(e) {
	affectsHooks = e;
}
/** Key of the deep-witness slot node (never a user key). */ const $DEEP = Symbol(0);
/** Pre-shaped constructor for OBJECT proxy targets: V8 tips a bare `{}` into
* dictionary mode once ~19 named properties are assigned onto it (the #3044
* `ovl`/`del` fields crossed that line — every trap's field read became a
* hash lookup, a 15% deep-dbmon tick regression). Declaring every field in a
* constructor pre-allocates in-object slots so the map stays fast, with
* headroom for future fields. The prototype is reset to `Object.prototype`
* so proxy-forwarded semantics (getPrototypeOf, constructor) are exactly a
* plain object's. Array targets keep the bare-`[]` path — they must carry
* the array exotic class for `Array.isArray(proxy)`.
*
* ARRAY SHAPE RULE: arrays normalize their named properties to dictionary
* mode as the count grows (V8 13.x: counts ≡ 0 mod 3 from 18 up), so the
* target's named field count is capped at 20 — any future write-side state
* beyond `wk` must ride an extension object (see target.ts), never new
* named fields here. */ function TargetShape() {
	this.v = void 0;
	this.ch = void 0;
	this.pb = void 0;
	this.n = void 0;
	this.h = void 0;
	this.k = void 0;
	this.dk = void 0;
	this.u = void 0;
	this.pk = void 0;
	this.px = void 0;
	this.d = void 0;
	this.a = void 0;
	this.sc = void 0;
	this.kc = void 0;
	this.nc = void 0;
	this.fam = void 0;
	this.s = void 0;
	this.ovl = void 0;
	this.del = void 0;
	this.wk = void 0;
}
TargetShape.prototype = Object.prototype;
function createTarget(e, n, t, r = n?.fam ?? null) {
	const i = Array.isArray(e) ? [] : new TargetShape();
	i.v = e;
	i.ch = e[$TARGET] !== void 0;
	i.pb = null;
	i.n = null;
	i.h = null;
	i.k = null;
	i.dk = null;
	i.wk = null;
	i.u = n;
	i.pk = t;
	i.px = null;
	i.d = false;
	i.a = false;
	i.sc = 0;
	i.kc = 0;
	i.nc = 0;
	i.fam = r;
	i.s = false;
	i.ovl = false;
	i.del = null;
	i.px = new Proxy(i, traps);
	setLookup(e, i);
	return i;
}
function wrap(e, n = null, t = null, r = n?.fam ?? null) {
	if (rawValuesUsed && isRawValue(e)) return e;
	const i = lookupTarget(e, r);
	if (i !== void 0) return i.px;
	const o = e[$TARGET];
	if (o !== void 0 && o.px === e) {
		if (r === null || o.fam === r) return e;
		return createTarget(e, n, t, r).px;
	}
	return createTarget(e, n, t, r).px;
}
/** Unwrap our own proxies to their current backing; leave everything else.
* A projection draft wrapper is registered as its target's alias
* (projection.ts `wrapDraft`) — adopted as a backing, it would forward to
* itself (#3767). */ function unwrapValue(e) {
	if (e == null || typeof e !== "object") return e;
	const n = e[$TARGET];
	if (n !== void 0 && (n.px === e || lookupTarget(e, n.fam) === n) && n.v !== void 0) {
		if (n.ovl) materializePB(n);
		return n.pb ?? n.v;
	}
	return e;
}
const slotNodeEquals = function(e, n) {
	return isEqual(e, n) || sameLogicalSlot(this.ot, e, n);
};
function sameKey(e, n) {
	return e === n || e !== e && n !== n;
}
/** The container node's arrangement guess: the rows (or keys) the setter
* left the container with, in order. Its comparator judges a landing or a
* revert against it by row identity — by key when the family has one
* (the server's object for a guessed row is the same row). */ var LaneView = class {
	rows;
	base;
	removed;
	constructor(e, n, t = null) {
		this.rows = e;
		this.base = n;
		this.removed = t;
	}
};
/** A container node's value as a backing: the base an arrangement guess is
* shown over, else the value itself. */ function asBacking(e) {
	return e instanceof LaneView ? e.base : e;
}
/** The container node's comparator: a staging is a backing (identity — a
* pending backing is never "equal" to the committed one); a lane value is
* an arrangement (`LaneView`), judged by the optimistic machinery. */ const containerEquals = function(e, n) {
	return e === n || optHooks !== null && optHooks.arrangement(this.ot, e, n);
};
function sameLogicalSlot(e, n, t) {
	if (n === null || typeof n !== "object" || t === null || typeof t !== "object") return false;
	const r = lookupTarget(n, e.fam);
	return r !== void 0 && r === lookupTarget(t, e.fam);
}
/** Slot nodes whose last subscriber left while they still held a staging:
* released at the commit that resolves it (`drainFolds`). */ const deferredReleases = /* @__PURE__ */ new Set();
function releaseSlot(e) {
	const n = e.ot;
	const t = e.rt;
	if (t === $TRACK) {
		if (n.k === e) n.k = null;
	} else if (t === $DEEP) {
		if (n.dk === e) n.dk = null;
	} else if (n.n !== null && n.n[t] === e) {
		delete n.n[t];
		n.nc--;
	} else if (n.h !== null && n.h[t] === e) delete n.h[t];
	if (n.fam !== null && n.nc === 0 && n.k === null && n.dk === null && (n.h === null || Reflect.ownKeys(n.h).length === 0)) n.fam.live.delete(n);
}
/** A node was born on `target`: a family target enters the live index. */ function noteNode(e, n, t) {
	if (e.fam !== null) e.fam.live.add(e);
	markDescendants(e);
	if (affectsHooks !== null) affectsHooks.born(e, n, t);
}
setSlotUnobserved((e) => {
	if (e.Ae !== NOT_PENDING || e.u & 2048) deferredReleases.add(e);
	else releaseSlot(e);
});
/** A node born while its container has a staging is born from the two
* frames (A29): committed from the committed backing, the staging from the
* pending one — and held by the container's transaction when the container
* is held (#3706: the unit of the hold is the key — a key the batch left
* unchanged stages nothing and holds no one). */ function bornStaged(e, n, t, r) {
	if (n.We && n.We(n.pe, t)) return;
	queuePendingNode(n);
	n.Ae = t;
	const i = e.k;
	if (i === null) return;
	if ((i.u & 2304) === 256 && heldKeyChanged(e, r)) holdNode(n, txOf(i));
	if (i.u & 4194304) notePromotedWrite(n);
}
function getNode(e, n, t = -1) {
	const r = e.n ??= Object.create(null);
	let i = r[n];
	if (i === void 0) {
		const o = e.pb;
		const l = i = slotSignal(committed(e)[n], slotNodeEquals, e, n, t === -1 ? isOwnAccessor(o ?? e.v, n) : t === 1);
		if (o !== null && !l.acc) bornStaged(e, l, e.del !== null && e.del.has(n) ? void 0 : o[n], n);
		r[n] = i;
		e.nc++;
		noteNode(e, l, n);
	}
	return i;
}
function getHasNode(e, n) {
	const t = e.h ??= Object.create(null);
	let r = t[n];
	if (r === void 0) {
		const i = r = slotSignal(n in committed(e), isEqual, e, n, false);
		const o = e.pb;
		if (o !== null) bornStaged(e, i, n in o && !(e.del !== null && e.del.has(n)), n);
		t[n] = r;
		noteNode(e, i, n);
	}
	return r;
}
/** The container node (plan sec. 31.3): created by the first structural subscription
* or the first write that needs to stage. Its committed value is the
* committed backing. */ function getContainerNode(e) {
	let n = e.k;
	if (n === null) {
		n = e.k = slotSignal(e.v, containerEquals, e, $TRACK, false);
		noteNode(e, n, $TRACK);
		if (e.pb !== null && !directCommit) {
			n.pe = preBatch(e);
			n.Ae = e.pb;
			queuePendingNode(n);
		}
	}
	return n;
}
/** Q-A's escape hatch (plan sec. 33; measured plan sec. 41.4): a staging needs the container
* node as its home only when something can read the frame through it — a
* structural subscriber (the node exists), lane work (the staging is the
* lane's), a pass outside a flush (its write is promoted at the pass's end,
* A28 (4)), or a derive a transaction holds (the staging is the derive's,
* `holdWithDerive`). Otherwise the backing and the fold queue are the whole
* staging: nothing allocates, nothing is swept at the commit (dbmon's tick
* re-created, queued, swept and dropped ~7000 container nodes). If the
* flush parks, the seam materializes and holds the node then
* (`_storePark`) — the one case the staging home exists for. */ function stageOn(e, n) {
	if (e.k === null && passLane === null && (context === null || globalQueue.ee) && !deriveHolds(e)) return;
	const t = getContainerNode(e);
	if (t.Ae === NOT_PENDING) queuePendingNode(t);
	t.Ae = n;
	if (context !== null) notePromotedWrite(t);
	if (e.fam !== null) holdWithDerive(e, t);
}
/** The projection's derive is held by a transaction and this is its own
* write (not a user setter's): the staging is the derive's (`holdWithDerive`). */ function deriveHolds(e) {
	const n = e.fam?.node;
	return n != null && !userWrite && (n.u & 256) !== 0;
}
GlobalQueue.Tn = (e) => {
	for (let n = 0; n < foldList.length; n++) {
		const t = foldList[n];
		if (t.k === null && t.pb !== null) holdNode(getContainerNode(t), e);
	}
};
function bumpDeep(e) {
	if (e.dk !== null) setSignal(e.dk, 1);
}
/** The structural readers' one notification: a membership/arrangement
* change on the container (the staging is already on the node; `setSignal`
* re-stages the same backing and walks the subscribers — and, on later
* steps, routes a held or lane-owned container the way any node is). */ function notifyContainer(e, n) {
	if (e.u & 2048) setSignal(e, n);
	else {
		if (e.u & 256) joinFuture(txOf(e));
		insertSubs(e);
		schedule();
	}
}
const hasOwn$2 = Object.prototype.hasOwnProperty;
const lookupGetter = Object.prototype.__lookupGetter__;
const lookupSetter = Object.prototype.__lookupSetter__;
const propertyIsEnumerable$1 = Object.prototype.propertyIsEnumerable;
function isOwnAccessor(e, n) {
	return hasOwn$2.call(e, n) && (lookupGetter.call(e, n) !== void 0 || lookupSetter.call(e, n) !== void 0);
}
/** Shallow clone into store ownership. Plain data (grade 2) spreads; anything
* else copies descriptors (accessors kept, everything made configurable). */ function cloneRaw(e, n) {
	n.sc || scanAccessorsOnce(n);
	if (n.sc === 2) {
		const t = { ...e };
		t[$OWNER] = n;
		return t;
	}
	const t = Object.getOwnPropertyDescriptors(e);
	for (const r of Reflect.ownKeys(t)) {
		const i = t[r];
		if (r === "length" && Array.isArray(e)) continue;
		i.configurable = true;
		if (!i.get && !i.set) i.writable = true;
		else n.a = true;
	}
	const r = Array.isArray(e) ? Object.defineProperties([], t) : Object.create(Object.getPrototypeOf(e), t);
	r[$OWNER] = n;
	return r;
}
/** Wide plain clone (many keys): null-prototype build, then reset. */ function wideClone(e, n) {
	const t = Object.create(null);
	for (const n of Reflect.ownKeys(e)) t[n] = e[n];
	Object.setPrototypeOf(t, Object.prototype);
	t[$OWNER] = n;
	return t;
}
function copyOwn(e, n, t) {
	const r = Object.getOwnPropertyDescriptor(n, t);
	if (r.get || r.set || !r.enumerable || !r.writable || !r.configurable) Object.defineProperty(e, t, r);
	else e[t] = r.value;
}
/** One descriptor scan per container (grade 1/2, `a`, `kc`). */ function scanAccessorsOnce(e) {
	const n = e.v;
	const t = Reflect.ownKeys(n);
	let r = Object.getPrototypeOf(n) === Object.prototype;
	for (const i of t) {
		if (lookupGetter.call(n, i) !== void 0 || lookupSetter.call(n, i) !== void 0) {
			e.a = true;
			r = false;
			break;
		}
		if (r && !propertyIsEnumerable$1.call(n, i)) r = false;
	}
	e.sc = r ? 2 : 1;
	e.kc = t.length;
	return !e.a;
}
const OVERLAY_MIN_KEYS = 32;
const OVERLAY_REBUILD_MAX_KEYS = 1024;
const OVERLAY_REBUILD_MIN_ADDS = 16;
const WK_ALL = /* @__PURE__ */ new Set();
const plainProto = (e) => {
	const n = Object.getPrototypeOf(e);
	return n === Object.prototype || n === Array.prototype || n === null;
};
/** An overlay with many adds (or any delete) rebuilds the committed
* container at flatten so its shape stays fast (#3689). */ function overlayRebuilds(e, n) {
	if (e.kc > OVERLAY_REBUILD_MAX_KEYS) return false;
	if (e.del !== null && e.del.size !== 0) return true;
	const t = e.wk;
	if (t !== null && t !== WK_ALL && t.size <= OVERLAY_REBUILD_MIN_ADDS) return false;
	const r = e.v;
	let i = 0;
	for (const e of Reflect.ownKeys(n)) if (!hasOwn$2.call(r, e) && ++i > OVERLAY_REBUILD_MIN_ADDS) return true;
	return false;
}
/** Downgrade an overlay to a real clone (a consumer needs a container). */ function materializePB(e) {
	const n = e.pb;
	if (!e.ovl) return n;
	const t = e.sc === 2 ? wideClone(e.v, e) : cloneRaw(e.v, e);
	if (e.del !== null) {
		for (const n of e.del) delete t[n];
		e.kc -= e.del.size;
		e.del = null;
	}
	for (const r of Reflect.ownKeys(n)) e.sc === 2 ? t[r] = n[r] : copyOwn(t, n, r);
	e.pb = t;
	e.ovl = false;
	if (e.k !== null && e.k.Ae === n) e.k.Ae = t;
	return t;
}
/** The batch's pending backing, created on the first draft write: an overlay
* of an owned plain-data record above the key threshold, a clone otherwise.
* Staged on the container node (the scheduler owns its lifetime) and queued
* for the fold at the flush's commit. */ function ensurePB(e) {
	let n = e.pb;
	if (userWrite && e.fam?.opt === true && !pendingNotify.has(e)) return e.pb = optHooks.draft(e);
	if (n !== null && !isOwned(n)) {
		n = e.pb = cloneRaw(n, e);
		const t = e.k;
		if (t !== null && !(t.u & 256)) t.Ae = n;
	} else if (n === null) {
		const t = e.v;
		if (!directCommit) queueFold(e);
		if (!e.ch && !Array.isArray(t) && (e.sc !== 0 ? !e.a : scanAccessorsOnce(e)) && e.kc > OVERLAY_MIN_KEYS && isOwned(t)) {
			n = e.pb = Object.create(t);
			e.ovl = true;
		} else n = e.pb = cloneRaw(t, e);
		if (!directCommit) stageOn(e, n);
	}
	return n;
}
/** Privatize `target`'s committed backing (and its ancestor chain — a shared
* parent cannot point at an owned child). Not a reactive event. */ function privatizeCommitted(e) {
	if (isOwned(e.v)) return;
	const n = e.v;
	e.v = cloneRaw(n, e);
	e.ch = false;
	if (e.u) {
		privatizeCommitted(e.u);
		e.u.v;
		const t = e.u.v;
		const r = parentSlotKey(e, n);
		if (t[r] === n) t[r] = e.v;
	}
}
/** The key this target sits under in its parent — re-resolved by identity
* when an array parent moved it (#3282). Not searched when the slot already
* holds this target's backing (a parent adopted whole carries its children's
* new raws before the children fold — the miss was O(rows) per changed row
* of a keyed reconcile). */ function parentSlotKey(e, n) {
	const t = e.pk;
	const r = e.u.v;
	if (r[t] === n || r[t] === e.v || !Array.isArray(r)) return t;
	const i = r.indexOf(n);
	if (i === -1) return t;
	e.pk = i;
	return i;
}
/** Overlay flatten (#3044): own keys onto the owned committed backing in
* place — the backing keeps its identity. */ function flattenOverlay(e, n) {
	privatizeCommitted(e);
	const t = e.v;
	for (const r of Reflect.ownKeys(n)) e.sc === 2 ? t[r] = n[r] : copyOwn(t, n, r);
	if (e.del !== null) {
		for (const n of e.del) delete t[n];
		e.kc -= e.del.size;
		e.del = null;
	}
	e.pb = null;
	e.ovl = false;
	e.wk = null;
}
/** The fold queue: the targets with a batch open (`pb !== null` IS the
* membership — a target is queued exactly while it carries a staging; the
* drain skips one already folded), in two reusable arrays. Nothing here
* allocates per batch once warm: a dbmon tick queues ~7000 containers, and
* a map built and drained per tick cost ~540 KB of table allocation — most
* of the tick's young-generation GC, and the whole of its gap to `next`
* (plan sec. 41.5).
*
* Beside each target, its PRE-BATCH committed backing — `t.v` as the batch
* opened on it (`foldOlds`, parallel to `foldList`). That one record is the
* fold's base in every case: a draft's backing does not move until the fold
* (so the record is `t.v` still), an adoption swaps it eagerly (the record
* is the frame committed readers keep), a mid-batch privatization or a
* draft over an adopted raw moves it again (the record is what the batch
* started from, which is all the fold wants to know). The record lives
* exactly as long as the batch: a weak map keyed by target kept every
* container's LAST adopted-away backing alive until its next adoption —
* for a keyed reconcile, the whole previous tree promoted out of the
* nursery every tick (the saturated listened-paths shape ran 15–25% over
* the fork, all of it this; plan sec. 43.2) — and for a store adopted
* once, for its lifetime.
*
* The target carries no slot for its record (ARRAY SHAPE RULE, target.ts),
* so a lookup by target (`preBatch`: a container node born onto an open
* staging, a committed-frame read of a node-less staging, a park) indexes
* the list through a map built on first use per batch — the drain itself
* walks the two lists in step and never builds it. */ let foldList = [];
let foldOlds = [];
let foldSpare = [];
let foldOldsSpare = [];
let foldIndex = null;
/** Before the staging is set and before an adoption swaps the backing. */ function queueFold(e) {
	if (e.pb !== null) return;
	schedule();
	if (foldIndex !== null) foldIndex.set(e, foldList.length);
	foldList.push(e);
	foldOlds.push(e.v);
}
/** The committed backing before this batch (valid while `pb !== null`). */ function preBatch(e) {
	if (foldIndex === null) {
		foldIndex = /* @__PURE__ */ new Map();
		for (let e = 0; e < foldList.length; e++) foldIndex.set(foldList[e], e);
	}
	const n = foldIndex.get(e);
	return n === void 0 ? e.v : foldOlds[n];
}
/** The flush committed its pending nodes: fold every pending backing whose
* container node committed (its staging is gone — `_value` is the backing
* now) into the committed home; one a later step holds (its node still
* staged) waits for the flush that commits it. Then the deferred slot
* releases. */ function drainFolds() {
	if (foldList.length !== 0) {
		const e = foldList;
		const n = foldOlds;
		foldList = foldSpare;
		foldOlds = foldOldsSpare;
		foldSpare = e;
		foldOldsSpare = n;
		foldIndex = null;
		for (let t = 0; t < e.length; t++) {
			const r = e[t];
			if (r.pb === null) continue;
			const i = r.k;
			if (i !== null && i.Ae !== NOT_PENDING) {
				foldList.push(r);
				foldOlds.push(n[t]);
			} else foldTarget(r, n[t]);
		}
		e.length = 0;
		n.length = 0;
	}
	if (deferredReleases.size !== 0) {
		for (const e of deferredReleases) if (e.Ae === NOT_PENDING && !(e.u & 2048) && e.t === null) {
			deferredReleases.delete(e);
			releaseSlot(e);
		}
	}
}
/** Core asks: is a slot node's truth in flight? Its family's derive is —
* lanes (A17, #2864: a guess mid-refetch stands in for the flight) and
* marks (an ambient `affects()` over a declared reload lives to the
* landing) read it. */ GlobalQueue.F = (e) => {
	const n = e.ot?.fam;
	return n != null && n.node !== null && (n.node.G & 1) !== 0;
};
/** Core asks (lanes.ts `covered`): the value a slot node's guess covered.
* A chained link's committed value is the inner store's at the last
* read-through — refreshed here, since a guess served the reads since
* (#3672: the revert compares against the base's live value). */ GlobalQueue.rn = (e) => {
	const n = e.ot;
	if (n.ch) {
		const t = e.rt;
		const r = n.v;
		if (n.h !== null && n.h[t] === e) e.pe = untrack(() => t in r);
		else if (n.n !== null && n.n[t] === e) e.pe = untrack(() => unwrapValue(r[t]));
	}
	return e.pe;
};
GlobalQueue._n = () => {
	drainFolds();
	optHooks?.sweep();
};
/** A projection's creation run commits directly (a memo's first value is
* its `_value`, not a staging): the draft still writes a clone of the seed,
* nothing is staged on the nodes, and the setter's exit folds the touched
* containers at once. Only the synchronous first run. */ let directCommit = false;
/** Fold one target's pending backing into its committed home. */ function foldTarget(e, n) {
	{
		const t = e.k;
		const r = e.pb;
		if (r !== null) {
			if (r === e.v) {
				e.pb = null;
				e.wk = null;
			} else if (e.ovl && (e.v !== n || !overlayRebuilds(e, r))) flattenOverlay(e, r);
			else if (e.v !== n) {
				privatizeCommitted(e);
				const t = e.v;
				const i = e.wk;
				if (i !== null && i !== WK_ALL) for (const e of i) if (hasOwn$2.call(r, e)) copyOwn(t, r, e);
				else delete t[e];
				else {
					for (const e of Reflect.ownKeys(r)) {
						const i = Object.getOwnPropertyDescriptor(r, e);
						if (i.get || i.set || !i.enumerable || !i.writable || !i.configurable) Object.defineProperty(t, e, i);
						else if (i.value !== n[e] || !hasOwn$2.call(n, e)) t[e] = i.value;
					}
					for (const e of Reflect.ownKeys(n)) if (!hasOwn$2.call(r, e)) delete t[e];
				}
				e.pb = null;
				e.wk = null;
			} else {
				e.v = e.ovl ? materializePB(e) : r;
				e.ch = e.v[$TARGET] !== void 0;
				e.pb = null;
				e.wk = null;
			}
		}
		if (t !== null) {
			if (t.t === null) e.k = null;
			else if (t.pe instanceof LaneView) t.pe.base = e.v;
			else t.pe = e.v;
		}
		if (e.v !== n && e.u) {
			const t = parentSlotKey(e, n);
			if (e.u.v[t] === n) {
				privatizeCommitted(e.u);
				e.u.v;
				e.u.v[t] = e.v;
			}
		}
	}
}
/** A user setter wrote a key whose staging is a derivation another
* transaction holds (A34 (3), #3612): the hold re-derives over the write. */ let heldDerivationHit = false;
/** The open setter is a USER'S (`storeSetter(…, guard = true)`), not the
* derive's draft or landing. */ let userWrite = false;
function heldDerivation(e, n, t) {
	if (e.fam === null || true) return false;
	if (n !== void 0) return (n.u & 262400) === 256 && txOf(n) !== flushTransaction;
	const r = e.k;
	return r !== null && (r.u & 256) !== 0 && txOf(r) !== flushTransaction && heldKeyChanged(e, t);
}
/** Setter exit: one node write per changed observed key (the leaves stage
* like signals — holds and lanes engage here on later steps), presence and
* deep witnesses, and the container when membership changed. */ function notifyWrites(e) {
	let n = e.pb;
	if (n === null) return;
	const t = e.v;
	const r = e.n;
	const i = e.wk;
	const o = i === WK_ALL || e.a === true || !plainProto(e.ovl ? e.v : n) ? null : i;
	if (e.fam !== null && !heldDerivationHit && o !== null) {
		for (const n of o) if (heldDerivation(e, r?.[n], n)) {
			heldDerivationHit = true;
			break;
		}
	}
	if (r !== null) {
		const i = o ?? Reflect.ownKeys(r);
		for (const o of i) {
			const i = r[o];
			if (i === void 0) continue;
			if (i.acc === true || hasOwn$2.call(n, o) && lookupGetter.call(n, o) !== void 0) {
				i.acc = isOwnAccessor(n, o);
				const e = Object.getOwnPropertyDescriptor(t, o);
				const r = Object.getOwnPropertyDescriptor(n, o);
				if (e && (e.get || e.set) || r && (r.get || r.set)) {
					if (e?.get !== r?.get || e?.set !== r?.set || e?.value !== r?.value) setSignal(i, () => FORCE);
					continue;
				}
				if (!isEqual(e?.value, r?.value)) setSignal(i, () => r?.value);
				continue;
			}
			const l = e.del !== null && e.del.has(o) ? void 0 : n[o];
			setSignal(i, () => l);
			if (e.fam !== null) {
				i.u &= -262145;
				holdWithDerive(e, i);
			}
		}
	}
	const l = e.h;
	if (l !== null) {
		const t = o ?? Reflect.ownKeys(l);
		for (const r of t) {
			const t = l[r];
			if (t !== void 0) {
				setSignal(t, r in n && !(e.del !== null && e.del.has(r)));
				if (e.fam !== null) holdWithDerive(e, t);
			}
		}
	}
	if (e.dk !== null) {
		if (e.del !== null && e.del.size !== 0) bumpDeep(e);
		else for (const r of o ?? Reflect.ownKeys(n)) {
			if (r === $OWNER) continue;
			const i = n[r];
			const o = t[r];
			if (i !== null && typeof i === "object" ? !targetsEqual(o, i) : !isEqual(o, i)) {
				bumpDeep(e);
				break;
			}
		}
	}
	const u = e.k;
	if (u !== null && (u.t !== null || u.u & 2048)) {
		let r;
		if (e.ovl) {
			r = e.del !== null && e.del.size !== 0;
			if (!r) {
				for (const e of Reflect.ownKeys(n)) if (!hasOwn$2.call(t, e)) {
					r = true;
					break;
				}
			}
		} else r = Array.isArray(n) && Array.isArray(t) ? arrayStructureChanged(t, n) : membershipChanged(t, n);
		if (r) notifyContainer(u, n);
	}
}
/** Accessor-node wake sentinel: readers re-run and re-invoke the getter. */ const FORCE = Symbol();
/** Two raws that wrap to the same target are the same logical value. */ function targetsEqual(e, n) {
	if (e === null || typeof e !== "object" || n === null || typeof n !== "object") return false;
	const t = lookupTarget(e, null);
	return t !== void 0 && t === lookupTarget(n, null);
}
/** Positional identity IS content for arrays (R15). */ function arrayStructureChanged(e, n) {
	if (e.length !== n.length) return true;
	for (let t = 0; t < n.length; t++) {
		const r = e[t];
		const i = n[t];
		if (!isEqual(r, i) && !targetsEqual(r, i)) return true;
	}
	return false;
}
function membershipChanged(e, n) {
	const t = Reflect.ownKeys(n);
	if (Reflect.ownKeys(e).length - +isOwned(e) !== t.length - +isOwned(n)) return true;
	for (const n of t) if (n !== $OWNER && !(n in e)) return true;
	return false;
}
const pendingNotify = /* @__PURE__ */ new Set();
function inDraft(e) {
	return false;
}
/** Shallow store: values served verbatim (a nested store proxy still wraps
* into the family so writes stay isolated). */ function serveShallow(e, n, t) {
	if (t !== null && typeof t === "object" && t[$TARGET] !== void 0) return draftServe(e, wrap(t, e, n));
	return t;
}
/** A child proxy served to a draft joins the draft's scope. */ function draftServe(e, n) {
	return n;
}
/** The committed backing: the container node's committed value while a
* batch is staged on it (an adoption swaps `t.v` eagerly — INTERNALS §3,
* "adoption is eager by contract" — and the node keeps the frame committed
* readers under a hold still see), `t.v` otherwise. */ function committed(e) {
	const n = e.k;
	if (n !== null) return n.Ae !== NOT_PENDING ? asBacking(n.pe) : e.v;
	return e.pb !== null ? preBatch(e) : e.v;
}
/** The pass that sees this flush's staging (signal parity — `read()`'s
* staged arm): the computation running (`context`, never the owner — a
* handler, an effect callback or `onSettled` has an owner but no pass),
* unless it is a frame reader (children-forbidden, A32). Null = the
* committed frame. */ function stagingReader() {
	let e = context;
	if (e === null) return null;
	if (e.Et) e = e.ut ?? null;
	return e === null || e.u & 16 ? null : e;
}
/** The backing a read serves (RUL-1, signal parity): the draft and the write
* override read the pending backing; a tracked reader reads it too — only
* for presence and descriptors, its leaf (born from the two frames) decides
* the value through core; a context-free or frame reader the committed
* backing; a pass reading UNTRACKED asks the container node — `read()`
* without a link: the node's value is the backing, chosen by the hold rules
* (a render effect outside the parking flush sees committed and re-derives
* at the landing; a memo joins the future; a staging is marked read). */
/** The backing a read of `target` is served from — the truth (committed,
* or the staging a pass may see). An optimistic family's lane values are
* NOT composed here: a guessed key always has its node, and the node is
* what serves its value (`nodeValue`); presence and enumeration compose
* per key / per walk (`optimisticHas`, `enumerationSource`). */ function readSource(e, n, t = false) {
	const r = e.pb;
	if (r === null) return e.v;
	if (inDraft(e) || writeOverride) return r;
	const i = e.k;
	if (n !== void 0) {
		const t = e.n?.[n];
		if (t !== void 0 && t.u & 2048) return committed(e);
	}
	const o = i !== null && (i.u & 256) !== 0;
	if (o && n !== void 0 && !heldKeyChanged(e, n, t)) return r;
	const l = stagingReader();
	if (l === null) {
		if (getObserver() !== null) return r;
		if (familyAhead(e)) return r;
		return o ? asBacking(i.pe) : e.v;
	}
	if (!o) {
		if (l.R & 16384 && !(l.u & 16400)) return r;
		if (n !== void 0 && !keyChanged(e, n, t)) return committed(e);
		if (i === null) {
			if (l.u & 16384 && stagedScreen(l)) return committed(e);
			stagedRead(l);
			return r;
		}
	}
	return asBacking(untrack(() => read(i)));
}
/** Did the HELD staging (the container node's, not a mainline layer above
* it) change `key`? */ function heldKeyChanged(e, n, t = true) {
	return changedBetween(e, e.k.pe, e.k.Ae, n, t);
}
/** A family target's unheld staging, read with no pass (a handler). */ function familyAhead(e) {
	return e.fam !== null && context === null && !(e.k !== null && e.k.u & 256);
}
/** Did this batch change `key` — value (slot equality), presence, and (for
* a `shape` reader — a descriptor read, a node's hold) enumerability or
* accessor-ness? A swapped or non-plain prototype, or a chained backing,
* changes every key (#3706: those hold the whole container).
*
* A VALUE read asks without `shape`: a key whose value is the same in both
* frames serves the same value from either, whatever its descriptor did —
* and the descriptor probes (`__lookupGetter__`, `propertyIsEnumerable`,
* twice each) are the cost of the question on a wide container read under
* a staging (a keyed reconcile's 1k rows, read by `mapArray` in the flush
* that staged them: ~3× the tick). A container with accessors seen (`a`)
* keeps the full test — a getter's answer is not a slot's. */ function keyChanged(e, n, t = true) {
	return changedBetween(e, committed(e), e.pb, n, t);
}
function changedBetween(e, n, t, r, i) {
	if (e.ch || t[$TARGET] !== void 0 || Object.getPrototypeOf(t) !== Object.getPrototypeOf(n) || !plainProto(n)) return true;
	if (e.del !== null && e.del.has(r)) return r in n;
	const o = hasOwn$2.call(t, r) || e.ovl && hasOwn$2.call(e.v, r);
	if (o !== hasOwn$2.call(n, r)) return true;
	if (!o) return false;
	if ((i || e.a) && (isOwnAccessor(n, r) || isOwnAccessor(t, r) || propertyIsEnumerable$1.call(n, r) !== propertyIsEnumerable$1.call(t, r))) return true;
	const l = t[r];
	const u = n[r];
	return !isEqual(u, l) && !sameLogicalSlot(e, u, l);
}
/** Value of a key with a leaf: core's — `read()` links a tracked reader and,
* tracked or not, applies the hold and A28 rules a signal's read does. A
* projection's unheld staging is ahead for a handler (`familyAhead`). */ function nodeValue(e, n, t) {
	let r = read(e);
	if (e.Ae !== NOT_PENDING && !(e.u & 256) && context === null && t.fam !== null) r = e.Ae;
	return r === FORCE ? n : r;
}
/** Serve a present data key: link the leaf for a tracked reader (creating it
* on first read), wrap a wrappable child through the per-node wrap cache. */ function serveDataKey(e, n, t, r, i, o = -1) {
	const l = e.ch && r === e.v;
	let u = t;
	if (!inDraft(e) && true) {
		if (i === void 0 && getObserver() !== null) i = getNode(e, n, o);
		if (i !== void 0) {
			const n = nodeValue(i, t, e);
			if (l) {
				i.pe = t;
				if (i.u & 2048) u = n;
			} else u = n;
		}
	}
	if (e.s) return serveShallow(e, n, u);
	if (e.ch && !l && u !== null && typeof u === "object" && u[$TARGET]?.px !== u) u = resolveChainedRaw(e, n, u);
	if (i !== void 0) {
		if (i.pxv === u && u !== void 0) return draftServe(e, i.px);
		if (!isWrappable(u)) return u;
		const t = wrap(u, e, n);
		i.px = t;
		i.pxv = u;
		return draftServe(e, t);
	}
	if (!isWrappable(u)) return u;
	return draftServe(e, wrap(u, e, n));
}
/** Is `n` among `c`'s dependencies (any pass's — a kept tail included)? */ function linkedTo(e, n) {
	for (let t = e._; t !== null; t = t.p) if (t.I === n) return true;
	return false;
}
/** The projection's obligation (plan sec. 31.7 Q-B): before any value is served
* through a family target, the derive — the firewall — is brought up to
* date WITHOUT the reader subscribing to it. Core's `read()` of the
* firewall with no link does all of it: the pull, the status gate
* (uninitialized / pending → NotReady, errored → the error; a verdict
* window judges it; a pending source registers the reader for the landing)
* and the reader's height. The derive's own draft ops are exempt (the write
* override): the derive is the author. */ function pullFamily(e) {
	const n = e.fam.node;
	if (n === null || inDraft(e)) return;
	if (n.G & 3) {
		const t = context;
		if (t !== null && t.i === 1 && n.u & 256 && flushTransaction !== txOf(n) && !linkedTo(t, n)) return;
		const r = e.fam.overlaid;
		if (n.G & 1 && r !== void 0 && r.size !== 0) return;
		read(n);
	} else untrack(() => read(n));
}
/** A projection's writes are its derive's: a staging made while the derive
* is held (a flight up — its continuation writes after an `await`, a
* callback's late write) belongs to the derive's transaction and reveals
* with it, never drained early — and answers the derive's question: a quiet
* re-ask's landing is quiet through its reveal (A19 exc. 2; the leaf's own
* classification, as core reads it — `heldNotFinal`). */ function holdWithDerive(e, n) {
	const t = e.fam?.node;
	if (t !== void 0 && t !== null && t.u & 256 && n.Ae !== NOT_PENDING && !(n.u & 2304)) {
		holdNode(n, txOf(t));
		n.m.be = t.m.be;
	}
}
/** A chained backing's child (§7b): a raw the inner family owns, or holds
* at this key, is served as the inner store's wrapper — never a fresh
* raw-keyed one — so the chained targets are the same objects across
* settled and pending views. */ function resolveChainedRaw(e, n, t) {
	const r = e.v[$TARGET];
	if (r.ch) {
		const e = resolveChainedRaw(r, n, t);
		return e === t ? t : wrap(e, r, n);
	}
	const i = lookupTarget(t, r.fam);
	if (i !== void 0) return i.px;
	if ((r.v[n] === t || r.pb?.[n] === t) && isWrappable(t)) return wrap(t, r, n);
	return t;
}
/** The backing a structural read serves: a tracked reader subscribes to the
* container and reads the frame core serves it — committed or staging by
* the hold rules (`read()` on the node: the node's value IS the backing);
* anyone else reads by `readSource`. */ function enumerationSource(e) {
	if (!inDraft(e) && getObserver() !== null) {
		const n = asBacking(read(getContainerNode(e)));
		return e.fam?.opt === true ? optHooks.view(e, n) : n;
	}
	const n = readSource(e);
	return optRead(e) ? optHooks.view(e, n) : n;
}
/** A read on an optimistic family that composes the lanes' values: not the
* draft's (it composed already), not a derive's write-override read (the
* derive composes on the truth). */ function optRead(e) {
	return e.fam !== null && e.fam.opt === true && !inDraft(e) && true;
}
/** Pollution keys are never served from the prototype (core R30). */ const UNSAFE_KEYS = /* @__PURE__ */ new Set([
	"__proto__",
	"prototype",
	"constructor"
]);
const traps = {
	get(e, n, t) {
		if (typeof n !== "string") {
			if (n === $TARGET) return e;
			if (n === $PROXY) return t;
			if (n === $OWNER) return void 0;
			if (n === $RECORD) return void 0;
			if (n === $REFRESH) return e.fam?.node ?? void 0;
			if (n === $TRACK) {
				if (e.fam !== null) pullFamily(e);
				if (!inDraft(e) && getObserver() !== null) {
					read(getContainerNode(e));
					const n = readSource(e);
					if (n[$TARGET] !== void 0) n[$TRACK];
				}
				return;
			}
		}
		if (e.fam !== null) pullFamily(e);
		const r = e.n?.[n];
		{
			const t = r;
			if (t !== void 0 && t.acc !== true && (!e.ch || t.u & 2048)) {
				const r = nodeValue(t, void 0, e);
				if (r === null || typeof r !== "object") return r;
				if (e.s) return serveShallow(e, n, r);
				if (t.pxv === r) return t.px;
				if (isWrappable(r)) {
					const i = wrap(r, e, n);
					t.px = i;
					t.pxv = r;
					return i;
				}
				return r;
			}
		}
		const i = readSource(e, n);
		if (e.del !== null && i === e.pb && e.del.has(n)) {
			if (!inDraft(e) && getObserver() !== null) read(getNode(e, n));
			return;
		}
		let o = -1;
		{
			let l;
			if (r !== void 0) l = r.acc === true;
			else if (!inDraft(e) && getObserver() !== null) {
				l = isOwnAccessor(i, n);
				if (i === (e.pb ?? e.v)) o = l ? 1 : 0;
			} else l = false;
			if (l) {
				if (!inDraft(e) && getObserver() !== null) read(r ?? getNode(e, n, o));
				const l = Reflect.get(i, n, t);
				if (e.s) return serveShallow(e, n, l);
				return isWrappable(l) ? draftServe(e, wrap(l, e, n)) : l;
			}
		}
		const l = e.ovl && i === e.pb;
		if ((n === "constructor" || n === "__proto__" || n === "prototype") && !hasOwn$2.call(i, n) && !(l && hasOwn$2.call(e.v, n))) return void 0;
		let u = i[n];
		if (u === void 0 ? !hasOwn$2.call(i, n) && !(l && hasOwn$2.call(e.v, n)) : false) {
			u = Reflect.get(i, n, t);
			if (typeof u === "function") return u;
			if (e.ch && i === e.v) return serveDataKey(e, n, u, i, r, o);
			if (u === void 0 && !inDraft(e)) {
				if (getObserver() !== null) read(getNode(e, n, o));
				const t = e.n?.[n];
				if (t) {
					const r = nodeValue(t, void 0, e);
					if (e.s) return serveShallow(e, n, r);
					return isWrappable(r) ? draftServe(e, wrap(r, e, n)) : r;
				}
			}
			if (e.s) return serveShallow(e, n, u);
			return isWrappable(u) ? draftServe(e, wrap(u, e, n)) : u;
		}
		if (typeof u === "function" && !hasOwn$2.call(i, n) && !(l && hasOwn$2.call(e.v, n))) return u;
		return serveDataKey(e, n, u, i, r, o);
	},
	has(e, n) {
		if (n === $TARGET || n === $PROXY || n === $TRACK) return true;
		if (n === $OWNER || n === $RECORD) return false;
		if (e.fam !== null) pullFamily(e);
		const t = readSource(e, n);
		if (!inDraft(e) && true) {
			if (getObserver() !== null) {
				const r = getHasNode(e, n);
				const i = read(r);
				if (!e.ch || t !== e.v) return !!i;
				const o = n in t;
				r.pe = o;
				if (r.u & 2048) return !!i;
				return o;
			} else if (optRead(e)) {
				const t = optHooks.has(e, n);
				if (t !== void 0) return t;
			}
		}
		return n in t && !(e.del !== null && t === e.pb && e.del.has(n));
	},
	ownKeys(e) {
		if (e.fam !== null) pullFamily(e);
		return visibleKeys(e, enumerationSource(e));
	},
	getOwnPropertyDescriptor(e, n) {
		if (n === $OWNER || n === $RECORD) return void 0;
		const t = getObserver();
		if (e.fam !== null) pullFamily(e);
		const r = t !== null && !inDraft(e) && true;
		const i = r && observerHoldsContainer(e, t);
		let o;
		if (i) o = enumerationSource(e);
		else if (r) {
			const t = getHasNode(e, n);
			const r = read(t);
			o = readSource(e, n, true);
			if (!r && (!e.ch || t.u & 2048 || !(n in o))) return void 0;
		} else o = readSource(e, n, true);
		let l;
		if (!i && optRead(e)) {
			const t = optHooks.descriptor(e, n);
			if (t === null) return void 0;
			l = t;
		}
		l ??= visibleDescriptor(e, o, n);
		if (l === void 0) return void 0;
		if (!(n === "length" && Array.isArray(e))) l.configurable = true;
		return l;
	},
	set(e, n, t) {
		const r = inDraft(e);
		const i = !r && writeOverride;
		if (!r && !i) return true;
		if (n === "__proto__") return true;
		const o = e.s ? t : unwrapValue(t);
		const l = ensurePB(e);
		pendingNotify.add(e);
		if (Array.isArray(l)) {
			if (n === "length") e.wk = WK_ALL;
			else if (e.wk !== WK_ALL) {
				const t = e.wk ??= /* @__PURE__ */ new Set();
				t.add(n);
				t.add("length");
			}
		} else {
			if (e.wk !== WK_ALL) (e.wk ??= /* @__PURE__ */ new Set()).add(n);
			if (!(n in l)) e.kc++;
		}
		if (UNSAFE_KEYS.has(n)) {
			Object.defineProperty(l, n, {
				value: o,
				writable: true,
				enumerable: true,
				configurable: true
			});
			if (e.del !== null) e.del.delete(n);
			return true;
		}
		if (e.ovl && e.sc !== 2 && !hasOwn$2.call(l, n)) Object.defineProperty(l, n, {
			value: o,
			writable: true,
			enumerable: true,
			configurable: true
		});
		else l[n] = o;
		if (e.del !== null) e.del.delete(n);
		if (e.s && o !== null && typeof o === "object") markRawOne(o);
		if (i) notifyWrites(e);
		return true;
	},
	defineProperty(e, n, t) {
		const r = inDraft(e);
		const i = !r && writeOverride;
		if (!r && !i) return true;
		if (n === "__proto__") return true;
		if (t.get || t.set) e.a = true;
		if ("value" in t) t = {
			...t,
			value: unwrapValue(t.value)
		};
		const o = ensurePB(e);
		if (e.a || !(t.enumerable && t.writable && t.configurable)) e.sc = 1;
		pendingNotify.add(e);
		if (e.wk !== WK_ALL) (e.wk ??= /* @__PURE__ */ new Set()).add(n);
		Object.defineProperty(o, n, t);
		if (e.del !== null) e.del.delete(n);
		if (i) notifyWrites(e);
		return true;
	},
	deleteProperty(e, n) {
		const t = inDraft(e);
		const r = !t && writeOverride;
		if (!t && !r) return true;
		const i = ensurePB(e);
		pendingNotify.add(e);
		if (e.wk !== WK_ALL) (e.wk ??= /* @__PURE__ */ new Set()).add(n);
		delete i[n];
		if (e.ovl && hasOwn$2.call(e.v, n)) (e.del ??= /* @__PURE__ */ new Set()).add(n);
		if (r) notifyWrites(e);
		return true;
	}
};
/** Is `obs` subscribed to the container BY THIS PASS (its enumerator holds
* it)? A link left from a previous pass is stale — the reader must subscribe
* to the key's presence node or a later add never re-runs it. */ function observerHoldsContainer(e, n) {
	const t = e.k;
	if (t === null) return false;
	const r = t.qe;
	return r !== null && r.o === n && (!(n.R & 4) || r.Ue === n.Ge);
}
function visibleKeys(e, n) {
	let t;
	if (e.ovl && n === e.pb) {
		t = Reflect.ownKeys(e.v);
		const r = e.del;
		if (r !== null && r.size !== 0) t = t.filter((e) => !r.has(e));
		for (const r of Reflect.ownKeys(n)) if (!hasOwn$2.call(e.v, r)) t.push(r);
	} else t = Reflect.ownKeys(n);
	for (let e = t.length - 1; e >= 0 && typeof t[e] === "symbol"; e--) if (t[e] === $OWNER) {
		t.splice(e, 1);
		break;
	}
	return t;
}
function visibleDescriptor(e, n, t) {
	let r = Object.getOwnPropertyDescriptor(n, t);
	if (e.ovl && n === e.pb) {
		if (e.del !== null && e.del.has(t)) return void 0;
		if (r === void 0) r = Object.getOwnPropertyDescriptor(e.v, t);
	}
	return r;
}
/**
* Store — the store half of `affects()` (plan sec. 29, plan sec. 37; A24 (4), #2882,
* #2893, #2904).
*
* A mark on a store is a mark on nodes (affects.ts: a count on the node, a
* dependency walk at probe time): `affects(record, key)` marks the slot's
* leaf; `affects(record)` marks a carrier (the record's `$AFFECTS` leaf)
* and every live node in the record's subtree — the edges existing readers
* subscribed through. Coverage is by RAW IDENTITY, not read path (#2882: a
* captured row proxy, a derived store sharing the source's raw, never read
* through the declaration's proxy): the identities reachable at the
* declaration are the mark's `scope`, so a node born inside the window on
* a covered record inherits the mark (released with the carrier's last),
* and an untracked probe through a record with no nodes is witnessed into
* the verdict. A mark declared on a draft (inside a setter) or over an
* optimistic family walks the view the writer sees.
*
* Installed by `store/index.ts`: a program with stores carries it; one
* without pays nothing (affects.ts asks `GlobalQueue._storeMarks`).
*/
/** The keyless mark's carrier key: a leaf of the record no read serves. */ const $AFFECTS = Symbol(0);
const scopes = /* @__PURE__ */ new Map();
/** The nodes an `affects(store[, key])` declaration marks (affects.ts
* registers each). */ function storeMarks(e, n) {
	if (n === void 0) {
		const n = getNode(e, $AFFECTS);
		let o = scopes.get(n);
		if (o === void 0) scopes.set(n, o = {
			scope: /* @__PURE__ */ new Set(),
			inherited: []
		});
		const t = [n];
		walk(e.px, o, t, e.fam, /* @__PURE__ */ new Set());
		return t;
	}
	const o = e.n?.[n] ?? getNode(e, n);
	let t = scopes.get(o);
	if (t === void 0) scopes.set(o, t = {
		scope: /* @__PURE__ */ new Set(),
		inherited: [],
		key: n
	});
	t.scope.add(e.v);
	if (e.pb !== null) t.scope.add(e.pb);
	return [o];
}
/** The identities reachable from `value` into the scope (the draft's and
* the committed backing both, when a draft is open; an optimistic family's
* view), every live node under each record into `found`. Untracked by
* construction: raws, never traps. */ function walk(e, n, o, t, s) {
	if (!isWrappable(e)) return;
	const f = e[$TARGET] ?? lookupTarget(e, t);
	let i = f !== void 0 ? f.pb ?? f.v : e;
	if (s.has(i)) return;
	s.add(i);
	n.scope.add(i);
	if (f !== void 0) {
		if (f.pb !== null) n.scope.add(f.v);
		if (f.fam?.opt === true) i = optHooks.view(f, i, true);
		const e = f.n;
		if (e !== null) {
			for (const n of Reflect.ownKeys(e)) if (n !== $AFFECTS) o.push(e[n]);
		}
		const s = f.h;
		if (s !== null) for (const e of Reflect.ownKeys(s)) o.push(s[e]);
		if (f.k !== null) o.push(f.k);
		if (f.dk !== null) o.push(f.dk);
		t = f.fam ?? t;
	}
	for (const e of Reflect.ownKeys(i)) {
		if (e === $OWNER) continue;
		const f = Object.getOwnPropertyDescriptor(i, e);
		if (f === void 0 || f.get !== void 0) continue;
		walk(f.value, n, o, t, s);
	}
}
/** A live scope covering `t`'s identity (keyed: for `key`). Chained
* backings (§7b): a view's backing is another store's proxy — marks cover
* the BASE raw, so every identity along the chain is checked. */ function covering(e, n, o) {
	for (const [t, s] of scopes) {
		if (t === o || s.key !== void 0 && s.key !== n) continue;
		for (let n = e.v;;) {
			if (s.scope.has(n)) return t;
			const e = n?.[$TARGET];
			if (e === void 0) break;
			const o = e.pb ?? e.v;
			if (o === n) break;
			n = o;
		}
	}
	return null;
}
installAffectsHooks({
	born(e, n, o) {
		if (o === $AFFECTS) return;
		const t = covering(e, o, n);
		if (t === null) return;
		GlobalQueue.h(n);
		scopes.get(t).inherited.push(n);
	},
	witness(e, n) {
		const o = e.n?.[$AFFECTS];
		if (o !== void 0 && o.m !== null && o.m.T !== 0 || covering(e, n) !== null) GlobalQueue.dt();
	}
});
GlobalQueue.O = storeMarks;
/** The carrier's last mark released (affects.ts): its scope dies, and the
* nodes that inherited the mark release theirs. */ GlobalQueue.N = (e) => {
	const n = scopes.get(e);
	if (n === void 0) return;
	scopes.delete(e);
	GlobalQueue.A(n.inherited);
};
/**
* Store — optimistic stores on lanes (plan sec. 31, S4; INTERNALS §3/§7, RUL-3).
*
* No store-side layer, no backup snapshots, no retaining ledger: a user
* write to an optimistic store is a GUESS on the written key's node
* (`optimisticWrite` — the same write `createOptimistic`'s setter makes),
* a presence guess on its presence node, and, when membership or
* arrangement changed, an arrangement guess on the container node. Lanes
* do the rest: the guess shows under the action's hold, a landing beneath
* it stages as truth and confirms it when equal (A18/A24), the action's
* settle dissolves it (a revert to the value it covered, or the landed
* truth). The committed backing is never touched by a guess.
*
* Reads compose: a reader of an overlaid target sees the truth it is served
* with the lanes' values over it (`optimisticView` — per node, by the same
* rule a leaf read follows: what the lane shows).
*
* Landings (Q-D, plan sec. 31.7): the derive's output is reconciled against the
* optimistic VIEW — a row the guess added and the server returns with the
* same key in the same position keeps its proxy (the row target adopts the
* server object), its leaves write truth beneath their guesses, and the
* container's arrangement guess is confirmed silently (`LaneView`'s
* comparator) — `For` does not run. Retained-setter replay (the
* 2026-08-31b continuation half) is not built here; the matrix decides.
*/ const hasOwn$1 = Object.prototype.hasOwnProperty;
/** A user setter's writes on an optimistic family, as guesses: one per
* changed key's leaf, one per presence change, the container's arrangement
* when membership or order changed. `pb` is the draft (a clone of the view
* the user saw); `old` the view it composed on. */
/** An optimistic setter's targets whose staging was set aside (`draft`),
* restored when the setter's writes become guesses (`writes`). */ const optStaged = /* @__PURE__ */ new Map();
function writerBacking(e) {
	const n = committed(e);
	const t = n[$TARGET];
	return t === void 0 ? n : optimisticView(t, writerBacking(t), laneValueOf, true);
}
/** The user's draft on an optimistic family: a clone of the view the user
* saw — the committed frame with the lanes' values and the tick's own
* unflushed guesses over it (#3665). A staging already on the target (a
* landing adopted this flush) is set aside for the setter's duration: the
* guesses go over it, it stays the truth beneath. */ function optimisticDraft(e) {
	if (e.pb !== null) optStaged.set(e, e.pb);
	return cloneRaw(optimisticView(e, writerBacking(e), laneValueOf, true), e);
}
function notifyOptimisticWrites(e, n) {
	const t = writerBacking(e);
	const i = optimisticView(e, t, laneValueOf, true);
	const r = Array.isArray(n);
	const o = e.ch ? e.v : null;
	const guess = (e, n, i, r) => {
		if (o !== null) e.pe = i ? n in t : unwrapValue(t[n]);
		optimisticWrite(e, () => r);
	};
	let s = false;
	for (const t of Reflect.ownKeys(n)) {
		if (r && t === "length" || t === $OWNER) continue;
		const f = n[t];
		const a = unwrapValue(o && f ? resolveChainedRaw(e, t, f) : f);
		if (!(t in i)) {
			guess(getNode(e, t), t, false, a);
			guess(getHasNode(e, t), t, true, true);
			s = true;
		} else {
			const n = i[t];
			const f = unwrapValue(o && n ? resolveChainedRaw(e, t, n) : n);
			if (!isEqual(f, a) && !targetsEqual(f, a)) {
				guess(getNode(e, t), t, false, a);
				if (r) s = true;
			}
		}
	}
	for (const t of Reflect.ownKeys(i)) {
		if (r && t === "length" || t === $OWNER) continue;
		if (t in n) continue;
		guess(getNode(e, t), t, false, void 0);
		guess(getHasNode(e, t), t, true, false);
		s = true;
	}
	if (r && i.length !== n.length) {
		guess(getNode(e, "length"), "length", false, n.length);
		s = true;
	}
	if (s) {
		const o = r ? n.map(unwrapValue) : shallowKeys(n);
		let s = null;
		const f = e.fam.key;
		if (r && f !== null && f !== void 0) {
			const e = /* @__PURE__ */ new Set();
			for (let n = 0; n < o.length; n++) {
				const t = isWrappable(o[n]) ? f(o[n]) : void 0;
				if (t !== void 0) e.add(t);
			}
			for (let n = 0; n < i.length; n++) {
				const t = unwrapValue(i[n]);
				const r = isWrappable(t) ? f(t) : void 0;
				if (r !== void 0 && !e.has(r)) (s ??= /* @__PURE__ */ new Set()).add(r);
			}
		}
		optimisticWrite(getContainerNode(e), new LaneView(o, t, s));
	}
	if (e.dk !== null) optimisticWrite(e.dk, {});
	markOverlaid(e);
	const f = optStaged.get(e);
	if (f === void 0) return null;
	optStaged.delete(e);
	return f;
}
/** The container comparator's lane arm (store.ts `containerEquals`): an
* arrangement guess (`LaneView`) against a landing or another arrangement,
* by row identity — by key when the family has one. */ function arrangement(e, n, t) {
	const i = n instanceof LaneView;
	const r = t instanceof LaneView;
	if (!i && !r) return false;
	return arrangementEqual(i ? n.rows : n, r ? t.rows : t, e.fam?.key ?? null);
}
function rowSame(e, n, t) {
	if (isEqual(e, n) || targetsEqual(e, n)) return true;
	if (t === null || !isWrappable(e) || !isWrappable(n)) return false;
	const i = t(unwrapValue(e));
	const r = t(unwrapValue(n));
	return i !== void 0 && sameKey(i, r);
}
function arrangementEqual(e, n, t) {
	if (Array.isArray(e) !== Array.isArray(n)) return false;
	if (Array.isArray(e)) {
		if (e.length !== n.length) return false;
		for (let i = 0; i < e.length; i++) if (!rowSame(e[i], n[i], t)) return false;
		return true;
	}
	const i = Reflect.ownKeys(e).filter((e) => e !== $OWNER);
	const r = Reflect.ownKeys(n).filter((e) => e !== $OWNER);
	if (i.length !== r.length) return false;
	for (const e of i) if (!(e in n)) return false;
	return true;
}
/** Write `incoming` into the draft `draft` (a store proxy inside a user's
* setter): arrays match rows by key (position when unkeyed) and recurse into
* the matched row's draft; objects recurse into a wrappable pair, assign
* otherwise; keys `incoming` lacks are deleted. */ function reconcileDraft(e, n, t) {
	if (Array.isArray(n)) {
		const i = e.length;
		const r = new Array(i);
		for (let n = 0; n < i; n++) r[n] = e[n];
		let o = null;
		if (t !== null) {
			o = /* @__PURE__ */ new Map();
			for (let e = 0; e < i; e++) {
				const n = unwrapValue(r[e]);
				if (!isWrappable(n)) continue;
				const i = t(n);
				if (i !== void 0 && !o.has(i)) o.set(i, r[e]);
			}
		}
		for (let s = 0; s < n.length; s++) {
			const f = n[s];
			let a;
			if (isWrappable(f)) {
				if (o !== null) {
					const e = t(f);
					if (e !== void 0) a = o.get(e);
				} else if (s < i && isWrappable(unwrapValue(r[s]))) a = r[s];
			}
			if (a !== void 0) {
				if (unwrapValue(a) !== f) reconcileDraft(a, f, t);
				if (e[s] !== a) e[s] = a;
			} else if (unwrapValue(e[s]) !== f) e[s] = f;
		}
		if (e.length !== n.length) e.length = n.length;
		return;
	}
	for (const i of Object.keys(n)) {
		const r = n[i];
		const o = e[i];
		const s = unwrapValue(o);
		if (isWrappable(r) && isWrappable(s) && Array.isArray(r) === Array.isArray(s) && (t === null || Array.isArray(r) || sameKey(t(r), t(s)))) {
			if (s !== r) reconcileDraft(o, r, t);
		} else if (s !== r) e[i] = r;
	}
	for (const t of Object.keys(e)) if (!(t in n)) delete e[t];
}
/** Q-D (plan sec. 39): an OLDER question's truth landed beneath an arrangement
* guess (`laneWrite` held it — another action's landing is not this guess's
* answer). The guess is re-based over it: order from the guess, rows from
* the truth by key (a guessed row the truth has is the truth's object — the
* row target adopted it, its proxy survives), guessed rows the truth lacks
* kept (the guess's own landing judges them), truth rows the guess lacks
* appended. The composed arrangement becomes the lane's value on every
* index whose row the committed backing does not already show — compared
* BY KEY, never by raw identity: the same key's new object is the same row
* (its target adopted it) and the slot stays the committed backing's — (a
* node is born for it as the lane's derivation), on `length` only when the
* committed length differs, and as the `LaneView`'s base for structural
* reads. Unkeyed families compose
* positionally — the guess stands as written (the documented residue). */ GlobalQueue.En = (e, n) => {
	const t = e.ot;
	if (t === void 0 || e.rt !== $TRACK) return;
	const i = e.m.Z;
	if (!(i instanceof LaneView)) return;
	if (!Array.isArray(n) || !Array.isArray(i.rows)) {
		i.base = n;
		return;
	}
	const r = t.fam?.key ?? null;
	if (r === null) return;
	const o = /* @__PURE__ */ new Map();
	for (let e = 0; e < n.length; e++) {
		const t = n[e];
		const i = isWrappable(t) ? r(t) : void 0;
		if (i !== void 0 && !o.has(i)) o.set(i, t);
	}
	const s = /* @__PURE__ */ new Set();
	const f = [];
	const a = i.rows;
	for (let e = 0; e < a.length; e++) {
		const n = a[e];
		const t = isWrappable(n) ? r(n) : void 0;
		const i = t !== void 0 ? o.get(t) : void 0;
		if (i !== void 0) {
			f.push(i);
			s.add(t);
		} else f.push(n);
	}
	const l = i.removed;
	for (let e = 0; e < n.length; e++) {
		const t = n[e];
		const i = isWrappable(t) ? r(t) : void 0;
		if (i !== void 0 && !s.has(i) && (l === null || !l.has(i))) f.push(t);
	}
	i.rows = f;
	i.base = f;
	const u = txOf(e);
	const c = committed(t);
	const d = t.n;
	for (let e = 0; e < f.length; e++) {
		const n = d?.[e];
		if (n === void 0) {
			if (!sameRow(c[e], f[e], r)) laneSet(getNode(t, e), f[e], u);
		} else if (!sameRow(n.u & 2048 ? n.m.Z : c[e], f[e], r)) laneSet(n, f[e], u);
	}
	if (d !== null) {
		for (let e = f.length;; e++) {
			const n = d[e];
			if (n === void 0) break;
			laneSet(n, void 0, u);
		}
		const e = d.length;
		if (e !== void 0 && (e.u & 2048 || c.length !== f.length)) laneSet(e, f.length, u);
	}
};
function sameRow(e, n, t) {
	if (e === n) return true;
	if (!isWrappable(e) || !isWrappable(n)) return false;
	const i = t(unwrapValue(e));
	return i !== void 0 && sameKey(i, t(unwrapValue(n)));
}
/** A composed value becomes the lane's on `node`: a guess re-based, or a
* node that was not the lane's becomes its derivation (its committed value
* untouched beneath; the lane's end commits the latest). */ function laneSet(e, n, t) {
	const i = ext(e);
	if (!(e.u & 2048)) {
		e.u |= CONFIG_OVERRIDE;
		list(e, t);
	} else if (i.Z === n) return;
	i.Z = n;
	if (e.t !== null) {
		insertSubs(e);
		laneDirty(e, t);
	}
}
installOptHooks({
	draft: optimisticDraft,
	writes: notifyOptimisticWrites,
	arrangement,
	reconcile: reconcileDraft,
	view: (e, n, t = false) => t ? optimisticView(e, n, laneValueOf, true) : optimisticView(e, n),
	has: optimisticHas,
	descriptor: optimisticOwnDescriptor,
	sweep: sweepOverlaid
});
function shallowKeys(e) {
	const n = {};
	for (const t of Reflect.ownKeys(e)) if (t !== $OWNER) n[t] = unwrapValue(e[t]);
	return n;
}
/** Families with a target carrying a lane value — swept at the flush's
* commit (`sweepOverlaid`): a target none of whose nodes is a lane's any
* more leaves its family's `overlaid`. (Not on the read path: a guess is
* pending between the setter and the seam, and a read in between must not
* take the target for clean.) */ const overlaidFamilies = /* @__PURE__ */ new Set();
function markOverlaid(e) {
	const n = e.fam;
	(n.overlaid ??= /* @__PURE__ */ new Set()).add(e);
	overlaidFamilies.add(n);
}
function sweepOverlaid() {
	if (overlaidFamilies.size === 0) return;
	for (const e of overlaidFamilies) {
		const n = e.overlaid;
		for (const e of n) if (!carriesLane(e)) {
			n.delete(e);
			if (e.ch) rebaseChained(e);
			const t = e.k;
			if (t !== null && t.pe instanceof LaneView) t.pe = t.pe.base;
		}
		if (n.size === 0) overlaidFamilies.delete(e);
	}
}
/** A chained view's lanes ended: its nodes are links (§7b) whose committed
* value is the inner store's at the guess, not now — the inner may have
* moved underneath the guess (the base committed while the view showed
* its arrangement, #3672/F1). Re-base each node on the inner's truth and
* re-derive the readers whose shown value it is not. */ function rebaseChained(e) {
	const n = e.v;
	let t = false;
	const i = e.n;
	if (i !== null) for (const e of Reflect.ownKeys(i)) {
		const r = i[e];
		const o = untrack(() => unwrapValue(n[e]));
		if (r.We && r.We(r.pe, o)) continue;
		r.pe = o;
		if (r.t !== null && r.ze !== notifyEpoch) {
			insertSubs(r);
			t = true;
		}
	}
	const r = e.h;
	if (r !== null) for (const e of Reflect.ownKeys(r)) {
		const i = r[e];
		const o = untrack(() => e in n);
		if (i.pe === o) continue;
		i.pe = o;
		if (i.t !== null && i.ze !== notifyEpoch) {
			insertSubs(i);
			t = true;
		}
	}
	const o = e.k;
	if (o !== null && o.t !== null && o.pe instanceof LaneView && o.ze !== notifyEpoch) {
		const i = Array.isArray(n) ? untrack(() => n.map(unwrapValue)) : n;
		if (!arrangementEqual(o.pe.rows, i, e.fam?.key ?? null)) {
			insertSubs(o);
			t = true;
		}
	}
	if (t) schedule();
}
function carriesLane(e) {
	if (e.k !== null && e.k.u & 2048) return true;
	if (e.dk !== null && e.dk.u & 2048) return true;
	const n = e.n;
	if (n !== null) {
		for (const e of Reflect.ownKeys(n)) if (n[e].u & 2048) return true;
	}
	const t = e.h;
	if (t !== null) {
		for (const e of Reflect.ownKeys(t)) if (t[e].u & 2048) return true;
	}
	return false;
}
function overlaid(e) {
	const n = e.fam;
	return n !== null && n.opt === true && n.overlaid !== void 0 && n.overlaid.has(e);
}
/** What a lane node shows an untracked reader here: core's rule (`read`
* without a link — the lane's world inside its own pass, the screen
* outside, a verdict window's answer under one). */ const shown = (e) => untrack(() => read(e));
/** An untracked `key in store` on an optimistic family: the presence guess
* (what its lane shows) when the key carries one; `undefined` when not —
* the backing answers. */ function optimisticHas(e, n) {
	if (!overlaid(e)) return void 0;
	const t = e.h?.[n];
	if (t !== void 0 && t.u & 2048) return !!shown(t);
	const i = e.n?.[n];
	if (i !== void 0 && i.u & 2048) return shown(i) !== void 0;
}
/** A descriptor read of a guessed key: synthesized from the lane's value
* (`null`: the guess removed the key; `undefined`: no guess — the backing
* describes it). */ function optimisticOwnDescriptor(e, n) {
	const t = optimisticHas(e, n);
	if (t === void 0) return void 0;
	if (!t) return null;
	const i = e.n?.[n];
	const r = i !== void 0 && i.u & 2048 ? shown(i) : e.v[n];
	if (n === "length" && Array.isArray(e.v)) return {
		value: r,
		writable: true,
		enumerable: false,
		configurable: false
	};
	return {
		value: r,
		writable: true,
		enumerable: true,
		configurable: true
	};
}
/** The truth `src` with the target's lane values over it: each overlaid
* leaf's value (`pick`: what the lane shows, or — for `latest` — the lane's
* latest), each presence guess as a key added or removed, the array
* length. Returns `src` itself when nothing is overlaid. */ function optimisticView(e, n, t = shown, i = false) {
	if (!i && !overlaid(e)) return n;
	let r = null;
	const ensure = () => r ??= Array.isArray(n) ? [...n] : { ...n };
	const o = e.n;
	if (o !== null) for (const e of Reflect.ownKeys(o)) {
		const r = o[e];
		let s;
		if (r.u & 2048) s = t(r);
		else if (!i || (s = pendingGuessOf(r)) === NOT_PENDING) continue;
		if (e === "length" && Array.isArray(n)) {
			if (n.length !== s) ensure().length = s;
		} else if (!isEqual(n[e], s) || !hasOwn$1.call(n, e)) ensure()[e] = s;
	}
	const s = e.h;
	if (s !== null) for (const e of Reflect.ownKeys(s)) {
		const o = s[e];
		let f;
		if (o.u & 2048) f = t(o);
		else if (!i || (f = pendingGuessOf(o)) === NOT_PENDING) continue;
		if (!!!f && e in (r ?? n)) delete ensure()[e];
	}
	return r ?? n;
}
/** Live marks, every scope — the gate on the probe's walk. */
let active = 0;
/** Marks declared outside a transaction: released at the next seam. */ const ambient = [];
/** The verdict readers downstream of `node` — through derivations, stopping
* at effects — re-derive: the mark's one notification (a probe's answer
* changed with no value notifying anyone). */ function repoll(e, t = /* @__PURE__ */ new Set()) {
	for (let n = e.t; n !== null; n = n.l) {
		const e = n.o;
		if (t.has(e)) continue;
		t.add(e);
		if (e.u & 16384) enqueueSub(e);
		if (!e.i) repoll(e, t);
	}
}
/** A node is covered by a live mark iff it carries one, or derives — through
* its current dependencies — from one that does. A real error outranks an
* inherited mark (A24 (c)): coverage does not flow through an errored node
* (a direct mark on one still reads pending). Mid-recompute, only the
* validated prefix of the dependency list is this pass's. */ function marked(e, t) {
	if (e.m !== null && e.m.T !== 0) return true;
	const n = e;
	if (n.G & 2 || t.has(e)) return false;
	t.add(e);
	const r = n.R & 4 ? n.S : void 0;
	if (r !== null) for (let e = n._ ?? null; e !== null; e = e.p) {
		if (marked(e.I, t)) return true;
		if (e === r) break;
	}
	return false;
}
/** Releases one scope's marks (a landed transaction's, the ambient list at
* the seam): a node whose last mark drops re-derives its verdict readers. */ function release$1(e) {
	for (let t = 0; t < e.length; t++) {
		const n = e[t];
		active--;
		if (--n.m.T === 0) {
			repoll(n);
			GlobalQueue.N?.(n);
		}
	}
	e.length = 0;
}
function mark(e) {
	ext(e).T++;
	active++;
}
GlobalQueue.C = (e) => active !== 0 && marked(e, /* @__PURE__ */ new Set());
GlobalQueue.h = mark;
GlobalQueue.A = release$1;
GlobalQueue.D = (e) => {
	if (ambient.length === 0) return;
	if (e !== null) {
		const t = e.T ??= [];
		for (let e = 0; e < ambient.length; e++) t.push(ambient[e]);
		ambient.length = 0;
		return;
	}
	let t = 0;
	const n = [];
	for (let e = 0; e < ambient.length; e++) {
		const r = ambient[e];
		if (inFlight(r)) ambient[t++] = r;
		else n.push(r);
	}
	ambient.length = t;
	if (n.length !== 0) release$1(n);
};
function inFlight(e) {
	return (e.G & 1) !== 0 || (e.u & 4096) !== 0 && GlobalQueue.F?.(e) === true;
}
/**
* Resolves nested accessors and arrays in a children tree to their rendered
* values. See the `children()` helper in solid-js for the memoized form.
*/
function flatten(r, t) {
	if (typeof r === "function" && !r.length) {
		if (t?.doNotUnwrap) return r;
		do
			r = r();
		while (typeof r === "function" && !r.length);
	}
	if (t?.skipNonRendered && (r == null || r === true || r === false || r === "")) return;
	if (Array.isArray(r)) {
		let e = [];
		if (flattenArray(r, e, t)) return () => {
			let r = [];
			flattenArray(e, r, {
				...t,
				doNotUnwrap: false
			});
			return r;
		};
		return e;
	}
	return r;
}
function flattenArray(r, t = [], e) {
	let o = null;
	let f = false;
	for (let n = 0; n < r.length; n++) try {
		let o = r[n];
		if (typeof o === "function" && !o.length) {
			if (e?.doNotUnwrap) {
				t.push(o);
				f = true;
				continue;
			}
			do
				o = o();
			while (typeof o === "function" && !o.length);
		}
		if (Array.isArray(o)) f = flattenArray(o, t, e) || f;
		else if (e?.skipNonRendered && (o == null || o === true || o === false || o === "")) {} else t.push(o);
	} catch (r) {
		if (!(r instanceof NotReadyError)) throw r;
		o = r;
	}
	if (o) throw o;
	return f;
}
/**
* Boundaries — the display consumers between a frame reader and the root:
* `createLoadingBoundary` (`<Loading>`) and `createErrorBoundary`
* (`<Errored>`).
*
* A boundary is an owner whose context names it (`BOUNDARY`), so every node
* created under it finds it in O(1) and the enclosing boundaries through
* `_parent`; a `tree` (the content, flattened) and an `output` that shows
* the tree or the fallback. The output is a frame reader (CONFIG_REDERIVE):
* status reaching it from its content re-derives it instead of marking it,
* and its pass decides.
*
* Status protocol (B5). A frame reader under a boundary that goes pending or
* errors tells `GlobalQueue.notify`, which asks `catchStatus` before the
* root: the nearest boundary of that status that is collecting — an error
* boundary always; a loading boundary that has not shown content yet, or
* whose `on` just changed — records the reader and shows its fallback, and
* the root never hears of it (no transaction is opened: A33, a fallback-
* caught flight holds nothing). A loading boundary showing content forwards:
* the root holds the frame as for any reader. The tree's own status takes
* the same route from the output's pass (`read(tree)` throws it).
*
* The hold (`blocked`, scheduler.ts) asks `hidden`: a reader behind a
* fallback — any boundary on its chain whose last pass chose the fallback —
* is not on screen and holds nothing. An error boundary flipping to its
* fallback is the same as a loading one resetting: every reader under it
* stops counting, and a flight whose only visible reader that was loses its
* hold (maintainer, 2026-10-01).
*
* Reveal. The seam (`boundarySeam`) drops readers that settled, died, or
* landed and committed; a fallback with none left re-derives its output,
* which reads the tree again. A reader that landed but is held (CONFIG_HELD,
* its value staged in a transaction) is not settled: the content reveals at
* the commit, with the rest of the frame (#3540).
*
* `on` (loading only): a tracked function whose reads re-arm the boundary.
* A pass of it after the mount arms the boundary for the flush: anything
* pending under it — already (its forwarded readers), or going pending later
* in the same heap — is collected and the fallback shows now, with the
* change's frame; nothing pending, and the arm is a no-op at the seam.
*/
/** Context key: the nearest boundary of a node, inherited at creation. */ const BOUNDARY = Symbol("");
let revealHooks = null;
function setRevealHooks(e) {
	revealHooks = e;
}
/** Boundaries with readers to sweep (or an arm to resolve) at the seam. */ const collecting = /* @__PURE__ */ new Set();
const boundaryOf = (e) => e.U[BOUNDARY];
/** Catches what reaches it: an error boundary always; a loading one until it
* has shown content, or while re-armed. */ const isCollecting = (e) => e.i === 2 || !e.L || e.k;
/** The reader goes to the fallback: recorded, and the output re-derives
* (a no-op while the output's own pass is running — its post-check
* decides). */ function caught(e, n, r) {
	if (e.i === 2) {
		r ??= n.m?.V;
		n = r?.source ?? n;
		const t = unwrapStatusError(r);
		setSignal(e.V, t);
		reportClientError(t, e.v, n);
	}
	e.H.add(n);
	collecting.add(e);
	if (e.k) flip(e);
	if (!e.P) redraw(e);
	if (e.B !== null) revealHooks.j(e.B);
}
/** A re-armed boundary found something pending: fresh again, and the swap
* the arming pass asked for is that pass's lane's (if any): the output is
* the lane's work from its next pass's head — not a re-pass of the
* transaction holding its pending content, which would entangle that
* transaction with the arming frame's (#3540 `on: () => latest(dep)`). */ function flip(e) {
	e.L = false;
	e.Z = e.W;
	if (e.Z !== null && e.K !== null) GlobalQueue.M(e.K, e.Z, true, false);
}
function redraw(e) {
	if (e.K !== null && !(e.K.R & 96)) {
		enqueueSub(e.K);
		schedule();
	}
}
/** GlobalQueue._catch: status from a frame reader, nearest boundary first.
* A loading boundary on the way records a pending reader whether or not it
* catches it (its `on` may collect it later). */ function catchStatus(e, n, r) {
	if (n === 0) {
		if (collecting.size !== 0) {
			for (let n = boundaryOf(e); n !== void 0; n = n._parent ?? void 0) if (!(e.G & unsettled(n)) && n.H.delete(e) && n.H.size === 0) {
				if (n.P) redraw(n);
				if (n.B !== null) revealHooks.j(n.B);
			}
		}
		return false;
	}
	for (let t = boundaryOf(e); t !== void 0; t = t._parent ?? void 0) {
		if (!(t.i & n)) continue;
		if (isCollecting(t)) {
			caught(t, e, r);
			return true;
		}
		t.H.add(e);
		collecting.add(t);
	}
	return false;
}
/** The nearest boundary on `r`'s chain showing its fallback, if any. */ function hiddenBy(e) {
	for (let n = boundaryOf(e); n !== void 0; n = n._parent ?? void 0) if (n.P) return n;
}
/** GlobalQueue._hidden: behind a fallback. */ function hidden(e) {
	return hiddenBy(e) !== void 0;
}
/** GlobalQueue._heldRun: a queued run behind a fallback waits for the reveal
* (maintainer, 2026-10-02: the queue is held, the synchronous first render
* goes through). A user effect's, which would read a DOM that is not
* attached ("many depend on reading the DOM, something that can't happen
* off screen"); a render effect's update too — a Portal or a head-tag
* library writes outside the hidden subtree, and a queued render run is
* what mounts them. A user effect's first run is scheduled like every other,
* so a mount under a fallback defers it too; a render effect's first run is
* synchronous on creation and never comes here. The run's `_modified` stays
* set; the reveal re-queues it by type (`release`), and a boundary above
* still showing its fallback holds it again then. */ function heldRun(e) {
	const n = hiddenBy(e);
	if (n === void 0) return false;
	(n.Y ??= /* @__PURE__ */ new Set()).add(e);
	return true;
}
/** Drop the readers that settled or died. Settled: a loading reader no
* longer pending; an error's source neither errored nor in flight. A reader
* that landed but is held (its value staged in a transaction) is not: the
* content reveals at the commit, with its run. The tree is: the output reads
* it and enters the transaction itself (its committed value shows until the
* landing). */ const unsettled = (e) => e.i === 2 ? 3 : 1;
function prune(e, n) {
	const r = unsettled(e);
	for (const t of e.H) if (t.R & 64) e.H.delete(t);
	else if (!(t.G & r)) {
		if (t !== e.$ && (t.u & 2304) === 256) {
			if (!n) continue;
			joinFuture(txOf(t));
		}
		e.H.delete(t);
	}
	return e.H.size;
}
/** Reveal order: a slot is ready when its content can show — it has shown
* content, or nothing under it is unready (the tree neither pending nor
* born held, no reader waited on). */ function ready(e) {
	return e.L || !(e.$.G & 1) && !(e.$.u & 256 && (e.K === null || e.K.G & 4)) && prune(e, false) === 0;
}
/** GlobalQueue._boundarySeam, end of the seam: readers that settled, died,
* or landed and committed are dropped; a fallback with none left reveals
* next round. An arm resolves: nothing collected, nothing happened. */ function boundarySeam() {
	for (const e of collecting) {
		const n = e.K.R;
		if (n & 64) {
			collecting.delete(e);
			continue;
		}
		if (n & 32) continue;
		prune(e, false);
		e.k = false;
		if (e.H.size === 0) {
			collecting.delete(e);
			if (e.P) redraw(e);
			if (e.B !== null) revealHooks.j(e.B);
		}
	}
}
GlobalQueue.fe = catchStatus;
GlobalQueue.ce = (e) => e.G & 4 && catchStatus(e, 1);
GlobalQueue.se = hidden;
GlobalQueue.Ee = boundarySeam;
GlobalQueue.de = heldRun;
const isController = (t) => t instanceof RevealController;
const slotReady = (t) => isController(t) ? t.Rt() : ready(t);
const slotMinReady = (t) => isController(t) ? t.Ct() : ready(t);
/** Force a slot's state. A boundary re-derives its output when it changes;
* a nested controller passes the state on to its own slots. Released
* (`!gated`), a nested controller leaves its parent's ownership and runs its
* own order; a boundary leaves when it has shown content (boundaries.ts). */ function setSlotState(t, e, s, r) {
	if (isController(t)) {
		t.te = s;
		t.le = r;
		t.vt();
		if (!s && t.Lt && t._parent === e) t._parent = null;
		return;
	}
	if (t.te !== s || t.le !== r) {
		t.te = s;
		t.le = r;
		redraw(t);
	}
}
var RevealController = class {
	qt;
	Vt;
	Ft = [];
	/** The controller gating this one, until it releases this one. */
	_parent = null;
	/** The state a parent forces on this whole group. */
	te = false;
	le = false;
	Lt = true;
	Qt = true;
	Ut = false;
	constructor(t, e) {
		this.qt = t;
		this.Vt = e;
	}
	/** A slot that has left this controller's ownership: a boundary that has
	* shown content, a nested group that is ready. Shown is shown — it counts
	* as ready whatever happens to it later (a re-arm gates nobody else). */ bt(t) {
		return (isController(t) ? t._parent : t.B) !== this;
	}
	/** The slots this controller still owns, in registration order — the
	* ones the order's state is forced on. */ xt(t) {
		for (let e = 0; e < this.Ft.length; e++) {
			const s = this.Ft[e];
			if (!this.bt(s) && t(s) === false) return false;
		}
		return true;
	}
	/** Readiness is judged over every slot, done ones as ready. */ Rt() {
		for (let t = 0; t < this.Ft.length; t++) {
			const e = this.Ft[t];
			if (!this.bt(e) && !slotReady(e)) return false;
		}
		return true;
	}
	/** Something visible to show under its own order — what an enclosing
	* `together` waits for: `together` — every slot minimally ready;
	* `sequential` — the first slot; `natural` — any. */ Ct() {
		const t = untrack(this.qt);
		const e = this.Ft;
		if (e.length === 0) return true;
		if (t === "sequential") return this.bt(e[0]) || slotMinReady(e[0]);
		for (let s = 0; s < e.length; s++) {
			const r = this.bt(e[s]) || slotMinReady(e[s]);
			if (t === "natural" ? r : !r) return t === "natural";
		}
		return t !== "natural";
	}
	ae(t) {
		if (this.Ft.includes(t)) return;
		this.Ft.push(t);
		const e = untrack(this.qt) === "sequential" && !!untrack(this.Vt);
		if (isController(t)) {
			t._parent = this;
			t.te = true;
			t.le = e;
			t.vt();
		} else {
			t.B = this;
			t.te = true;
			t.le = e;
		}
		untrack(() => this.vt());
	}
	ue(t) {
		const e = this.Ft.indexOf(t);
		if (e >= 0) this.Ft.splice(e, 1);
		untrack(() => this.vt());
	}
	/** Apply the order to the owned slots — or, gated by a parent, its state
	* to all of them. */ vt() {
		if (this.Ut) return;
		this.Ut = true;
		const t = this.Lt;
		const e = this.Qt;
		try {
			const t = untrack(this.qt);
			const e = t === "sequential" && !!untrack(this.Vt);
			if (this.te) this.xt((t) => setSlotState(t, this, true, this.le));
			else if (t === "natural") this.xt((t) => {
				if (isController(t)) setSlotState(t, this, false, false);
				else setSlotState(t, this, !ready(t), false);
			});
			else if (t === "together") {
				const t = this.xt(slotMinReady);
				this.xt((e) => setSlotState(e, this, !t, false));
			} else {
				let t = false;
				this.xt((s) => {
					if (t) return setSlotState(s, this, true, e);
					if (slotReady(s)) return setSlotState(s, this, false, false);
					t = true;
					setSlotState(s, this, isController(s) ? false : true, false);
				});
			}
		} finally {
			this.Lt = this.Rt();
			this.Qt = this.Ct();
			this.Ut = false;
		}
		if (this._parent !== null && (t !== this.Lt || e !== this.Qt)) this._parent.vt();
	}
};
setRevealHooks({
	ae: (t, e) => t.ae(e),
	ue: (t, e) => t.ue(e),
	j: (t) => t.vt()
});
Object.freeze({});
const IS_DEV = false;
const sharedConfig$1 = {
	hydrating: false,
	registry: void 0,
	done: false
};
const createSignal = (...args) => {
	return createSignal$1(...args);
};
const createRoot = (...args) => createRoot$1(...args);
const createRenderEffect = (...args) => createRenderEffect$1(...args);
function createComponent(Comp, props, name) {
	return untrack(() => Comp(props || {}));
}
const narrowedError = (name) => `Stale read from <${name}>.`;
function For(props) {
	const options = "fallback" in props ? {
		keyed: props.keyed,
		fallback: () => props.fallback
	} : { keyed: props.keyed };
	const owner = getOwner();
	let mapped;
	const create = () => runWithOwner(owner, () => mapArray(() => props.each, props.children, options));
	if (sharedConfig$1.hydrating) mapped = create();
	const list = () => (mapped ?? (mapped = create()))();
	return list;
}
function Show(props) {
	const keyed = props.keyed;
	const conditionValue = createMemo$1(() => props.when, void 0);
	const condition = keyed ? conditionValue : createMemo$1(conditionValue, {
		equals: (a, b) => !a === !b,
		sync: true
	});
	return createMemo$1(() => {
		const c = condition();
		if (c) {
			const child = props.children;
			return typeof child === "function" && child.length > 0 ? keyed ? untrack(() => child(c), IS_DEV) : untrack(() => child(() => {
				if (!untrack(condition)) throw narrowedError("Show");
				return conditionValue();
			}), IS_DEV) : child;
		}
		return props.fallback;
	}, { sync: true });
}
const sharedConfig = sharedConfig$1;
const $$SLOT = /*#__PURE__*/ Symbol("slot");
const $$HOST = /*#__PURE__*/ Symbol("host");
const transparentOptions = {
	transparent: true,
	sync: true
};
function effect$1(fn, effectFn, options) {
	const nodeOptions = options ? {
		sync: true,
		...options,
		transparent: !options.scope
	} : transparentOptions;
	createRenderEffect(fn, effectFn, nodeOptions);
}
function reconcileArrays(parentNode, a, b, marker) {
	let bLength = b.length, aEnd = a.length, bEnd = bLength, aStart = 0, bStart = 0, tail = a[aEnd - 1], tailTag = tail[$$SLOT], after = tail.parentNode === parentNode && (!tailTag || tailTag === marker) ? tail.nextSibling : marker || null, map = null, anchor, anchorTag;
	const isLive = (n) => {
		if (!n) return false;
		const tag = n[$$SLOT];
		return n.parentNode === parentNode && (!tag || tag === marker);
	};
	while (aStart < aEnd || bStart < bEnd) {
		if (a[aStart] === b[bStart] && isLive(a[aStart])) {
			aStart++;
			bStart++;
			continue;
		}
		while (a[aEnd - 1] === b[bEnd - 1] && isLive(a[aEnd - 1])) {
			aEnd--;
			bEnd--;
		}
		if (aEnd === aStart) {
			let node;
			if (bEnd < bLength) {
				if (bStart) {
					const prev = b[bStart - 1];
					const prevTag = prev[$$SLOT];
					node = prev.parentNode === parentNode && (!prevTag || prevTag === marker) ? prev.nextSibling : after;
				} else node = b[bEnd - bStart];
			} else node = after;
			while (bStart < bEnd) {
				const n = b[bStart++];
				parentNode.insertBefore(n, node);
				if (marker) n[$$SLOT] = marker;
			}
		} else if (bEnd === bStart) while (aStart < aEnd) {
			const n = a[aStart++];
			if (!map || !map.has(n)) {
				const tag = n[$$SLOT];
				if (n.parentNode === parentNode && (!tag || tag === marker)) n.remove();
			}
		}
		else if ((anchor = a[aStart]) === b[bEnd - 1] && b[bStart] === a[aEnd - 1] && anchor.parentNode === parentNode && (!(anchorTag = anchor[$$SLOT]) || anchorTag === marker)) {
			if (marker) do {
				const n = a[--aEnd];
				parentNode.insertBefore(n, anchor);
				n[$$SLOT] = marker;
				bStart++;
				if (aStart >= aEnd - 1 || bStart >= bEnd) break;
			} while (a[aStart] === b[bEnd - 1] && b[bStart] === a[aEnd - 1]);
			else do {
				parentNode.insertBefore(a[--aEnd], anchor);
				bStart++;
				if (aStart >= aEnd - 1 || bStart >= bEnd) break;
			} while (a[aStart] === b[bEnd - 1] && b[bStart] === a[aEnd - 1]);
		} else {
			if (!map) {
				map = /* @__PURE__ */ new Map();
				let i = bStart;
				while (i < bEnd) map.set(b[i], i++);
			}
			const index = map.get(a[aStart]);
			if (index != null) {
				if (bStart < index && index < bEnd) {
					let i = aStart, sequence = 1, t;
					while (++i < aEnd && i < bEnd) {
						if ((t = map.get(a[i])) == null || t !== index + sequence) break;
						sequence++;
					}
					if (sequence > index - bStart) {
						const head = a[aStart];
						const headTag = head[$$SLOT];
						const node = head.parentNode === parentNode && (!headTag || headTag === marker) ? head : after;
						while (bStart < index) {
							const n = b[bStart++];
							parentNode.insertBefore(n, node);
							if (marker) n[$$SLOT] = marker;
						}
					} else {
						const oldNode = a[aStart++];
						const newNode = b[bStart++];
						const oldTag = oldNode[$$SLOT];
						if (oldNode.parentNode === parentNode && (!oldTag || oldTag === marker)) parentNode.replaceChild(newNode, oldNode);
						else parentNode.insertBefore(newNode, after);
						if (marker) newNode[$$SLOT] = marker;
					}
				} else aStart++;
			} else {
				const n = a[aStart++];
				const nTag = n[$$SLOT];
				if (n.parentNode === parentNode && (!nTag || nTag === marker)) n.remove();
			}
		}
	}
}
const EVENT_KEY = "_$$";
const $$EVENT_OWNER = "_$SOLID_EVENT_OWNER";
const INNER_OWNED = {};
const delegatedEvents = /* @__PURE__ */ new Set();
const delegatedContainers = /* @__PURE__ */ new Map();
function render(code, element, init, options = {}) {
	let disposer;
	registerDelegatedRoot(element);
	try {
		createRoot((dispose) => {
			disposer = dispose;
			if (options.onError) getOwner()[ROOT_ERROR_HOOK] = options.onError;
			if (element === document) {
				const tree = code();
				effect$1(() => flatten(tree), () => {});
			} else {
				const tree = code();
				insert(element, () => tree, element.firstChild ? null : void 0, init, {
					...options.insertOptions,
					schedule: true
				});
			}
		}, { id: options.renderId });
		flush();
	} catch (err) {
		if (disposer) disposer();
		unregisterDelegatedRoot(element);
		throw err;
	}
	return () => {
		disposer();
		unregisterDelegatedRoot(element);
		element.textContent = "";
	};
}
function create(html, bypassGuard, flag) {
	const t = document.createElement("template");
	t.innerHTML = html;
	return flag === 2 ? t.content.firstChild.firstChild : t.content.firstChild;
}
function template(html, flag) {
	let node;
	return flag === 1 ? (bypassGuard) => document.importNode(node || (node = create(html, bypassGuard, flag)), true) : (bypassGuard) => (node || (node = create(html, bypassGuard, flag))).cloneNode(true);
}
function registerDelegatedRoot(root) {
	const state = registerDelegatedContainer(root, root);
	if (state) state.roots = (state.roots || 0) + 1;
}
function unregisterDelegatedRoot(root) {
	const state = delegatedContainers.get(root);
	if (state) state.roots > 1 ? state.roots-- : delete state.roots;
	unregisterDelegatedContainer(root, root);
}
function registerDelegatedContainer(container, owner = container) {
	if (!container || !owner) return;
	let state = delegatedContainers.get(container);
	if (!state) delegatedContainers.set(container, state = {
		owners: /* @__PURE__ */ new Map(),
		handlers: /* @__PURE__ */ new Map()
	});
	state.owners.set(owner, (state.owners.get(owner) || 0) + 1);
	delegatedEvents.forEach((name) => attachDelegatedEvent(name, container, state));
	return state;
}
function unregisterDelegatedContainer(container, owner = container) {
	const state = delegatedContainers.get(container);
	if (!state) return;
	const count = state.owners.get(owner);
	if (count > 1) state.owners.set(owner, count - 1);
	else state.owners.delete(owner);
	if (state.owners.size) return;
	state.handlers.forEach((handler, name) => container.removeEventListener(name, handler));
	delegatedContainers.delete(container);
}
function attachDelegatedEvent(name, container, state) {
	if (state.handlers.has(name)) return;
	const handler = (e) => eventHandler(e, container, state);
	state.handlers.set(name, handler);
	container.addEventListener(name, handler);
}
function findOwner(target, state) {
	let node = target;
	let distance = 0;
	while (node) {
		if (state.owners.has(node)) return {
			owner: node,
			distance
		};
		distance++;
		node = node._$host || node.parentNode || node.host;
	}
}
const SCOPE_OPTIONS = { scope: true };
function insert(parent, accessor, marker, initial, options) {
	const multi = marker !== void 0;
	const host = options && options.host;
	if (multi && !initial) initial = [];
	if (typeof accessor !== "function") {
		accessor = normalize(accessor, initial, multi, true);
		if (typeof accessor !== "function") {
			insertExpression(parent, accessor, initial, marker);
			host && tagHost(accessor, host);
			return;
		}
	}
	if (multi && initial.length === 0) {
		const placeholder = document.createTextNode("");
		parent.insertBefore(placeholder, marker);
		initial = [placeholder];
	}
	let current = initial;
	effect$1((prev) => {
		const value = normalize(accessor(), current, multi, true);
		if (typeof value !== "function") return value;
		effect$1(() => normalize(value, current, multi), (inner) => {
			current = insertExpression(parent, inner, current, marker);
			host && tagHost(current, host);
		}, prev !== void 0 && !(options && options.schedule) ? {
			...options,
			schedule: true
		} : options);
		return INNER_OWNED;
	}, (value) => {
		if (value === INNER_OWNED) return;
		current = insertExpression(parent, value, current, marker);
		host && tagHost(current, host);
	}, accessor.$s ? options ? {
		...options,
		scope: true
	} : SCOPE_OPTIONS : options);
}
function isHydrating(node) {
	if (!sharedConfig.hydrating) return false;
	if (sharedConfig.isClaiming && !sharedConfig.isClaiming()) return false;
	if (!node || node.isConnected) return true;
	const roots = sharedConfig.claimRoots;
	if (roots) {
		for (let i = 0; i < roots.length; i++) if (roots[i].contains(node)) return true;
	}
	return false;
}
function eventHandler(e, container, state) {
	const prev = e[$$EVENT_OWNER];
	let resumeNode;
	if (prev) {
		if (prev === true || prev === container || !container.contains(prev)) return;
		resumeNode = prev;
	}
	const owner = state && (state.owners.size === 1 && state.owners.has(container) ? container : findOwner(e.target, state)?.owner);
	if (state && !owner) return;
	if (owner && owner === resumeNode) return;
	e[$$EVENT_OWNER] = owner || true;
	let node = resumeNode || e.target;
	const key = EVENT_KEY + e.type;
	const oriTarget = e.target;
	const boundary = owner || container || e.currentTarget;
	const retarget = (value) => Object.defineProperty(e, "target", {
		configurable: true,
		value
	});
	const handleNode = () => {
		const handler = node[key];
		if (handler && !node.disabled) {
			const data = node[`${key}Data`];
			data !== void 0 ? handler.call(node, data, e) : typeof handler === "function" ? handler.call(node, e) : handler.handleEvent(e);
			if (e.cancelBubble) return;
		}
		node.host && typeof node.host !== "string" && !node.host._$host && node.contains(e.target) && retarget(node.host);
		return true;
	};
	const walkUpTree = () => {
		while (node && handleNode()) {
			if (node === boundary || node.parentNode === boundary) break;
			node = node._$host || node.parentNode || node.host;
		}
	};
	Object.defineProperty(e, "currentTarget", {
		configurable: true,
		get() {
			return node || boundary || document;
		}
	});
	if (resumeNode) {
		if (resumeNode === e.target) node = resumeNode._$host || resumeNode.parentNode || resumeNode.host;
		if (node && node !== boundary) walkUpTree();
	} else if (e.composedPath) {
		const path = e.composedPath();
		if (path.length) {
			retarget(path[0]);
			for (let i = 0; i < path.length; i++) {
				node = path[i];
				if (!handleNode()) break;
				if (node._$host) {
					node = node._$host;
					walkUpTree();
					break;
				}
				if (node === boundary || node.parentNode === boundary) break;
			}
		} else walkUpTree();
	} else walkUpTree();
	retarget(oriTarget);
}
function insertExpression(parent, value, current, marker) {
	if (value === current) return value;
	const t = typeof value, multi = marker !== void 0;
	if (t === "string" || t === "number") {
		const tc = typeof current;
		if (tc === "string" || tc === "number") parent.firstChild.data = value;
		else if (ownsAllChildren(parent, current)) parent.textContent = value;
		else {
			removeOwnedChildren(parent, current);
			parent.insertBefore(document.createTextNode(value), parent.firstChild);
		}
	} else if (value === void 0) cleanChildren(parent, current, marker);
	else if (value.nodeType) {
		if (Array.isArray(current)) cleanChildren(parent, current, multi ? marker : null, value);
		else if (current != null && current.nodeType) current.parentNode === parent ? parent.replaceChild(value, current) : parent.appendChild(value);
		else if (current != null && parent.firstChild) parent.replaceChild(value, parent.firstChild);
		else parent.appendChild(value);
		if (marker) value[$$SLOT] = marker;
	} else if (Array.isArray(value)) {
		const currentArray = Array.isArray(current);
		for (let i = 0, len = value.length; i < len; i++) {
			const item = value[i], t = typeof item;
			if (t === "string" || t === "number") {
				const prev = currentArray ? current[i] : void 0;
				if (prev && prev.nodeType === 3) {
					if (prev.data !== "" + item) prev.data = item;
					value[i] = prev;
				} else value[i] = document.createTextNode(item);
			}
		}
		if (value.length === 0) cleanChildren(parent, current, marker);
		else if (currentArray) {
			if (current.length === 0) appendNodes(parent, value, marker);
			else reconcileArrays(parent, current, value, marker);
		} else {
			if (current != null) cleanChildren(parent, current);
			appendNodes(parent, value);
		}
	}
	return value;
}
function normalize(value, current, multi, doNotUnwrap) {
	value = flatten(value, {
		skipNonRendered: true,
		doNotUnwrap
	});
	if (doNotUnwrap && typeof value === "function") return value;
	if (multi && !Array.isArray(value)) value = [value != null ? value : ""];
	if (sharedConfig.hydrating && Array.isArray(value)) for (let i = 0, len = value.length; i < len; i++) {
		const item = value[i], prev = current && current[i], t = typeof item;
		if ((t === "string" || t === "number") && prev && prev.nodeType === 3 && isHydrating(prev)) value[i] = prev;
	}
	return value;
}
function tagHost(value, host) {
	if (Array.isArray(value)) for (let i = 0, len = value.length; i < len; i++) tagHost(value[i], host);
	else if (value && value.nodeType && value[$$HOST] !== host) {
		value[$$HOST] = host;
		Object.defineProperty(value, "_$host", {
			get: host,
			configurable: true
		});
	}
}
function appendNodes(parent, array, marker = null) {
	for (let i = 0, len = array.length; i < len; i++) {
		const n = array[i];
		parent.insertBefore(n, marker);
		if (marker) n[$$SLOT] = marker;
	}
}
function ownsAllChildren(parent, current) {
	if (current == null) return true;
	if (Array.isArray(current)) return current.length ? parent.firstChild === current[0] && parent.lastChild === current[current.length - 1] : parent.firstChild === null;
	if (current === "") return parent.firstChild === null;
	if (current.nodeType) return parent.firstChild === current && parent.lastChild === current;
	const first = parent.firstChild;
	return first !== null && first.nodeType === 3 && parent.lastChild === first;
}
function removeOwnedChildren(parent, current) {
	if (Array.isArray(current)) for (let i = 0; i < current.length; i++) {
		const el = current[i];
		if (el.parentNode === parent) el.remove();
	}
	else if (current.nodeType) {
		if (current.parentNode === parent) current.remove();
	} else {
		const first = parent.firstChild;
		if (first && first.nodeType === 3) first.remove();
	}
}
function cleanChildren(parent, current, marker, replacement) {
	if (marker === void 0) {
		if (ownsAllChildren(parent, current)) return parent.textContent = "";
		return removeOwnedChildren(parent, current);
	}
	if (current.length) {
		let inserted = false;
		for (let i = current.length - 1; i >= 0; i--) {
			const el = current[i];
			if (replacement !== el) {
				const tag = el[$$SLOT];
				const owns = el.parentNode === parent && (!tag || tag === marker);
				if (replacement && !inserted && !i) owns ? parent.replaceChild(replacement, el) : parent.insertBefore(replacement, marker);
				else if (owns) el.remove();
			} else inserted = true;
		}
	} else if (replacement) parent.insertBefore(replacement, marker);
	if (replacement && marker) replacement[$$SLOT] = marker;
}
var util;
(function(util) {
	util.assertEqual = (_) => {};
	function assertIs(_arg) {}
	util.assertIs = assertIs;
	function assertNever(_x) {
		throw new Error();
	}
	util.assertNever = assertNever;
	util.arrayToEnum = (items) => {
		const obj = {};
		for (const item of items) obj[item] = item;
		return obj;
	};
	util.getValidEnumValues = (obj) => {
		const validKeys = util.objectKeys(obj).filter((k) => typeof obj[obj[k]] !== "number");
		const filtered = {};
		for (const k of validKeys) filtered[k] = obj[k];
		return util.objectValues(filtered);
	};
	util.objectValues = (obj) => {
		return util.objectKeys(obj).map(function(e) {
			return obj[e];
		});
	};
	util.objectKeys = typeof Object.keys === "function" ? (obj) => Object.keys(obj) : (object) => {
		const keys = [];
		for (const key in object) if (Object.prototype.hasOwnProperty.call(object, key)) keys.push(key);
		return keys;
	};
	util.find = (arr, checker) => {
		for (const item of arr) if (checker(item)) return item;
	};
	util.isInteger = typeof Number.isInteger === "function" ? (val) => Number.isInteger(val) : (val) => typeof val === "number" && Number.isFinite(val) && Math.floor(val) === val;
	function joinValues(array, separator = " | ") {
		return array.map((val) => typeof val === "string" ? `'${val}'` : val).join(separator);
	}
	util.joinValues = joinValues;
	util.jsonStringifyReplacer = (_, value) => {
		if (typeof value === "bigint") return value.toString();
		return value;
	};
})(util || (util = {}));
var objectUtil;
(function(objectUtil) {
	objectUtil.mergeShapes = (first, second) => {
		return {
			...first,
			...second
		};
	};
})(objectUtil || (objectUtil = {}));
const ZodParsedType = util.arrayToEnum([
	"string",
	"nan",
	"number",
	"integer",
	"float",
	"boolean",
	"date",
	"bigint",
	"symbol",
	"function",
	"undefined",
	"null",
	"array",
	"object",
	"unknown",
	"promise",
	"void",
	"never",
	"map",
	"set"
]);
const getParsedType = (data) => {
	switch (typeof data) {
		case "undefined": return ZodParsedType.undefined;
		case "string": return ZodParsedType.string;
		case "number": return Number.isNaN(data) ? ZodParsedType.nan : ZodParsedType.number;
		case "boolean": return ZodParsedType.boolean;
		case "function": return ZodParsedType.function;
		case "bigint": return ZodParsedType.bigint;
		case "symbol": return ZodParsedType.symbol;
		case "object":
			if (Array.isArray(data)) return ZodParsedType.array;
			if (data === null) return ZodParsedType.null;
			if (data.then && typeof data.then === "function" && data.catch && typeof data.catch === "function") return ZodParsedType.promise;
			if (typeof Map !== "undefined" && data instanceof Map) return ZodParsedType.map;
			if (typeof Set !== "undefined" && data instanceof Set) return ZodParsedType.set;
			if (typeof Date !== "undefined" && data instanceof Date) return ZodParsedType.date;
			return ZodParsedType.object;
		default: return ZodParsedType.unknown;
	}
};
const ZodIssueCode = util.arrayToEnum([
	"invalid_type",
	"invalid_literal",
	"custom",
	"invalid_union",
	"invalid_union_discriminator",
	"invalid_enum_value",
	"unrecognized_keys",
	"invalid_arguments",
	"invalid_return_type",
	"invalid_date",
	"invalid_string",
	"too_small",
	"too_big",
	"invalid_intersection_types",
	"not_multiple_of",
	"not_finite"
]);
var ZodError = class ZodError extends Error {
	get errors() {
		return this.issues;
	}
	constructor(issues) {
		super();
		this.issues = [];
		this.addIssue = (sub) => {
			this.issues = [...this.issues, sub];
		};
		this.addIssues = (subs = []) => {
			this.issues = [...this.issues, ...subs];
		};
		const actualProto = new.target.prototype;
		if (Object.setPrototypeOf) Object.setPrototypeOf(this, actualProto);
		else this.__proto__ = actualProto;
		this.name = "ZodError";
		this.issues = issues;
	}
	format(_mapper) {
		const mapper = _mapper || function(issue) {
			return issue.message;
		};
		const fieldErrors = { _errors: [] };
		const processError = (error) => {
			for (const issue of error.issues) if (issue.code === "invalid_union") issue.unionErrors.map(processError);
			else if (issue.code === "invalid_return_type") processError(issue.returnTypeError);
			else if (issue.code === "invalid_arguments") processError(issue.argumentsError);
			else if (issue.path.length === 0) fieldErrors._errors.push(mapper(issue));
			else {
				let curr = fieldErrors;
				let i = 0;
				while (i < issue.path.length) {
					const el = issue.path[i];
					if (!(i === issue.path.length - 1)) curr[el] = curr[el] || { _errors: [] };
					else {
						curr[el] = curr[el] || { _errors: [] };
						curr[el]._errors.push(mapper(issue));
					}
					curr = curr[el];
					i++;
				}
			}
		};
		processError(this);
		return fieldErrors;
	}
	static assert(value) {
		if (!(value instanceof ZodError)) throw new Error(`Not a ZodError: ${value}`);
	}
	toString() {
		return this.message;
	}
	get message() {
		return JSON.stringify(this.issues, util.jsonStringifyReplacer, 2);
	}
	get isEmpty() {
		return this.issues.length === 0;
	}
	flatten(mapper = (issue) => issue.message) {
		const fieldErrors = {};
		const formErrors = [];
		for (const sub of this.issues) if (sub.path.length > 0) {
			const firstEl = sub.path[0];
			fieldErrors[firstEl] = fieldErrors[firstEl] || [];
			fieldErrors[firstEl].push(mapper(sub));
		} else formErrors.push(mapper(sub));
		return {
			formErrors,
			fieldErrors
		};
	}
	get formErrors() {
		return this.flatten();
	}
};
ZodError.create = (issues) => {
	return new ZodError(issues);
};
const errorMap = (issue, _ctx) => {
	let message;
	switch (issue.code) {
		case ZodIssueCode.invalid_type:
			if (issue.received === ZodParsedType.undefined) message = "Required";
			else message = `Expected ${issue.expected}, received ${issue.received}`;
			break;
		case ZodIssueCode.invalid_literal:
			message = `Invalid literal value, expected ${JSON.stringify(issue.expected, util.jsonStringifyReplacer)}`;
			break;
		case ZodIssueCode.unrecognized_keys:
			message = `Unrecognized key(s) in object: ${util.joinValues(issue.keys, ", ")}`;
			break;
		case ZodIssueCode.invalid_union:
			message = `Invalid input`;
			break;
		case ZodIssueCode.invalid_union_discriminator:
			message = `Invalid discriminator value. Expected ${util.joinValues(issue.options)}`;
			break;
		case ZodIssueCode.invalid_enum_value:
			message = `Invalid enum value. Expected ${util.joinValues(issue.options)}, received '${issue.received}'`;
			break;
		case ZodIssueCode.invalid_arguments:
			message = `Invalid function arguments`;
			break;
		case ZodIssueCode.invalid_return_type:
			message = `Invalid function return type`;
			break;
		case ZodIssueCode.invalid_date:
			message = `Invalid date`;
			break;
		case ZodIssueCode.invalid_string:
			if (typeof issue.validation === "object") {
				if ("includes" in issue.validation) {
					message = `Invalid input: must include "${issue.validation.includes}"`;
					if (typeof issue.validation.position === "number") message = `${message} at one or more positions greater than or equal to ${issue.validation.position}`;
				} else if ("startsWith" in issue.validation) message = `Invalid input: must start with "${issue.validation.startsWith}"`;
				else if ("endsWith" in issue.validation) message = `Invalid input: must end with "${issue.validation.endsWith}"`;
				else util.assertNever(issue.validation);
			} else if (issue.validation !== "regex") message = `Invalid ${issue.validation}`;
			else message = "Invalid";
			break;
		case ZodIssueCode.too_small:
			if (issue.type === "array") message = `Array must contain ${issue.exact ? "exactly" : issue.inclusive ? `at least` : `more than`} ${issue.minimum} element(s)`;
			else if (issue.type === "string") message = `String must contain ${issue.exact ? "exactly" : issue.inclusive ? `at least` : `over`} ${issue.minimum} character(s)`;
			else if (issue.type === "number") message = `Number must be ${issue.exact ? `exactly equal to ` : issue.inclusive ? `greater than or equal to ` : `greater than `}${issue.minimum}`;
			else if (issue.type === "bigint") message = `Number must be ${issue.exact ? `exactly equal to ` : issue.inclusive ? `greater than or equal to ` : `greater than `}${issue.minimum}`;
			else if (issue.type === "date") message = `Date must be ${issue.exact ? `exactly equal to ` : issue.inclusive ? `greater than or equal to ` : `greater than `}${new Date(Number(issue.minimum))}`;
			else message = "Invalid input";
			break;
		case ZodIssueCode.too_big:
			if (issue.type === "array") message = `Array must contain ${issue.exact ? `exactly` : issue.inclusive ? `at most` : `less than`} ${issue.maximum} element(s)`;
			else if (issue.type === "string") message = `String must contain ${issue.exact ? `exactly` : issue.inclusive ? `at most` : `under`} ${issue.maximum} character(s)`;
			else if (issue.type === "number") message = `Number must be ${issue.exact ? `exactly` : issue.inclusive ? `less than or equal to` : `less than`} ${issue.maximum}`;
			else if (issue.type === "bigint") message = `BigInt must be ${issue.exact ? `exactly` : issue.inclusive ? `less than or equal to` : `less than`} ${issue.maximum}`;
			else if (issue.type === "date") message = `Date must be ${issue.exact ? `exactly` : issue.inclusive ? `smaller than or equal to` : `smaller than`} ${new Date(Number(issue.maximum))}`;
			else message = "Invalid input";
			break;
		case ZodIssueCode.custom:
			message = `Invalid input`;
			break;
		case ZodIssueCode.invalid_intersection_types:
			message = `Intersection results could not be merged`;
			break;
		case ZodIssueCode.not_multiple_of:
			message = `Number must be a multiple of ${issue.multipleOf}`;
			break;
		case ZodIssueCode.not_finite:
			message = "Number must be finite";
			break;
		default:
			message = _ctx.defaultError;
			util.assertNever(issue);
	}
	return { message };
};
let overrideErrorMap = errorMap;
function getErrorMap() {
	return overrideErrorMap;
}
const makeIssue = (params) => {
	const { data, path, errorMaps, issueData } = params;
	const fullPath = [...path, ...issueData.path || []];
	const fullIssue = {
		...issueData,
		path: fullPath
	};
	if (issueData.message !== void 0) return {
		...issueData,
		path: fullPath,
		message: issueData.message
	};
	let errorMessage = "";
	const maps = errorMaps.filter((m) => !!m).slice().reverse();
	for (const map of maps) errorMessage = map(fullIssue, {
		data,
		defaultError: errorMessage
	}).message;
	return {
		...issueData,
		path: fullPath,
		message: errorMessage
	};
};
function addIssueToContext(ctx, issueData) {
	const overrideMap = getErrorMap();
	const issue = makeIssue({
		issueData,
		data: ctx.data,
		path: ctx.path,
		errorMaps: [
			ctx.common.contextualErrorMap,
			ctx.schemaErrorMap,
			overrideMap,
			overrideMap === errorMap ? void 0 : errorMap
		].filter((x) => !!x)
	});
	ctx.common.issues.push(issue);
}
var ParseStatus = class ParseStatus {
	constructor() {
		this.value = "valid";
	}
	dirty() {
		if (this.value === "valid") this.value = "dirty";
	}
	abort() {
		if (this.value !== "aborted") this.value = "aborted";
	}
	static mergeArray(status, results) {
		const arrayValue = [];
		for (const s of results) {
			if (s.status === "aborted") return INVALID;
			if (s.status === "dirty") status.dirty();
			arrayValue.push(s.value);
		}
		return {
			status: status.value,
			value: arrayValue
		};
	}
	static async mergeObjectAsync(status, pairs) {
		const syncPairs = [];
		for (const pair of pairs) {
			const key = await pair.key;
			const value = await pair.value;
			syncPairs.push({
				key,
				value
			});
		}
		return ParseStatus.mergeObjectSync(status, syncPairs);
	}
	static mergeObjectSync(status, pairs) {
		const finalObject = {};
		for (const pair of pairs) {
			const { key, value } = pair;
			if (key.status === "aborted") return INVALID;
			if (value.status === "aborted") return INVALID;
			if (key.status === "dirty") status.dirty();
			if (value.status === "dirty") status.dirty();
			if (key.value !== "__proto__" && (typeof value.value !== "undefined" || pair.alwaysSet)) finalObject[key.value] = value.value;
		}
		return {
			status: status.value,
			value: finalObject
		};
	}
};
const INVALID = Object.freeze({ status: "aborted" });
const DIRTY = (value) => ({
	status: "dirty",
	value
});
const OK = (value) => ({
	status: "valid",
	value
});
const isAborted = (x) => x.status === "aborted";
const isDirty = (x) => x.status === "dirty";
const isValid = (x) => x.status === "valid";
const isAsync = (x) => typeof Promise !== "undefined" && x instanceof Promise;
var errorUtil;
(function(errorUtil) {
	errorUtil.errToObj = (message) => typeof message === "string" ? { message } : message || {};
	errorUtil.toString = (message) => typeof message === "string" ? message : message?.message;
})(errorUtil || (errorUtil = {}));
var ParseInputLazyPath = class {
	constructor(parent, value, path, key) {
		this._cachedPath = [];
		this.parent = parent;
		this.data = value;
		this._path = path;
		this._key = key;
	}
	get path() {
		if (!this._cachedPath.length) {
			if (Array.isArray(this._key)) this._cachedPath.push(...this._path, ...this._key);
			else this._cachedPath.push(...this._path, this._key);
		}
		return this._cachedPath;
	}
};
const handleResult = (ctx, result) => {
	if (isValid(result)) return {
		success: true,
		data: result.value
	};
	else {
		if (!ctx.common.issues.length) throw new Error("Validation failed but no issues detected.");
		return {
			success: false,
			get error() {
				if (this._error) return this._error;
				const error = new ZodError(ctx.common.issues);
				this._error = error;
				return this._error;
			}
		};
	}
};
function processCreateParams(params) {
	if (!params) return {};
	const { errorMap, invalid_type_error, required_error, description } = params;
	if (errorMap && (invalid_type_error || required_error)) throw new Error(`Can't use "invalid_type_error" or "required_error" in conjunction with custom error map.`);
	if (errorMap) return {
		errorMap,
		description
	};
	const customMap = (iss, ctx) => {
		const { message } = params;
		if (iss.code === "invalid_enum_value") return { message: message ?? ctx.defaultError };
		if (typeof ctx.data === "undefined") return { message: message ?? required_error ?? ctx.defaultError };
		if (iss.code !== "invalid_type") return { message: ctx.defaultError };
		return { message: message ?? invalid_type_error ?? ctx.defaultError };
	};
	return {
		errorMap: customMap,
		description
	};
}
var ZodType = class {
	get description() {
		return this._def.description;
	}
	_getType(input) {
		return getParsedType(input.data);
	}
	_getOrReturnCtx(input, ctx) {
		return ctx || {
			common: input.parent.common,
			data: input.data,
			parsedType: getParsedType(input.data),
			schemaErrorMap: this._def.errorMap,
			path: input.path,
			parent: input.parent
		};
	}
	_processInputParams(input) {
		return {
			status: new ParseStatus(),
			ctx: {
				common: input.parent.common,
				data: input.data,
				parsedType: getParsedType(input.data),
				schemaErrorMap: this._def.errorMap,
				path: input.path,
				parent: input.parent
			}
		};
	}
	_parseSync(input) {
		const result = this._parse(input);
		if (isAsync(result)) throw new Error("Synchronous parse encountered promise.");
		return result;
	}
	_parseAsync(input) {
		const result = this._parse(input);
		return Promise.resolve(result);
	}
	parse(data, params) {
		const result = this.safeParse(data, params);
		if (result.success) return result.data;
		throw result.error;
	}
	safeParse(data, params) {
		const ctx = {
			common: {
				issues: [],
				async: params?.async ?? false,
				contextualErrorMap: params?.errorMap
			},
			path: params?.path || [],
			schemaErrorMap: this._def.errorMap,
			parent: null,
			data,
			parsedType: getParsedType(data)
		};
		const result = this._parseSync({
			data,
			path: ctx.path,
			parent: ctx
		});
		return handleResult(ctx, result);
	}
	"~validate"(data) {
		const ctx = {
			common: {
				issues: [],
				async: !!this["~standard"].async
			},
			path: [],
			schemaErrorMap: this._def.errorMap,
			parent: null,
			data,
			parsedType: getParsedType(data)
		};
		if (!this["~standard"].async) try {
			const result = this._parseSync({
				data,
				path: [],
				parent: ctx
			});
			return isValid(result) ? { value: result.value } : { issues: ctx.common.issues };
		} catch (err) {
			if (err?.message?.toLowerCase()?.includes("encountered")) this["~standard"].async = true;
			ctx.common = {
				issues: [],
				async: true
			};
		}
		return this._parseAsync({
			data,
			path: [],
			parent: ctx
		}).then((result) => isValid(result) ? { value: result.value } : { issues: ctx.common.issues });
	}
	async parseAsync(data, params) {
		const result = await this.safeParseAsync(data, params);
		if (result.success) return result.data;
		throw result.error;
	}
	async safeParseAsync(data, params) {
		const ctx = {
			common: {
				issues: [],
				contextualErrorMap: params?.errorMap,
				async: true
			},
			path: params?.path || [],
			schemaErrorMap: this._def.errorMap,
			parent: null,
			data,
			parsedType: getParsedType(data)
		};
		const maybeAsyncResult = this._parse({
			data,
			path: ctx.path,
			parent: ctx
		});
		const result = await (isAsync(maybeAsyncResult) ? maybeAsyncResult : Promise.resolve(maybeAsyncResult));
		return handleResult(ctx, result);
	}
	refine(check, message) {
		const getIssueProperties = (val) => {
			if (typeof message === "string" || typeof message === "undefined") return { message };
			else if (typeof message === "function") return message(val);
			else return message;
		};
		return this._refinement((val, ctx) => {
			const result = check(val);
			const setError = () => ctx.addIssue({
				code: ZodIssueCode.custom,
				...getIssueProperties(val)
			});
			if (typeof Promise !== "undefined" && result instanceof Promise) return result.then((data) => {
				if (!data) {
					setError();
					return false;
				} else return true;
			});
			if (!result) {
				setError();
				return false;
			} else return true;
		});
	}
	refinement(check, refinementData) {
		return this._refinement((val, ctx) => {
			if (!check(val)) {
				ctx.addIssue(typeof refinementData === "function" ? refinementData(val, ctx) : refinementData);
				return false;
			} else return true;
		});
	}
	_refinement(refinement) {
		return new ZodEffects({
			schema: this,
			typeName: ZodFirstPartyTypeKind.ZodEffects,
			effect: {
				type: "refinement",
				refinement
			}
		});
	}
	superRefine(refinement) {
		return this._refinement(refinement);
	}
	constructor(def) {
		/** Alias of safeParseAsync */
		this.spa = this.safeParseAsync;
		this._def = def;
		this.parse = this.parse.bind(this);
		this.safeParse = this.safeParse.bind(this);
		this.parseAsync = this.parseAsync.bind(this);
		this.safeParseAsync = this.safeParseAsync.bind(this);
		this.spa = this.spa.bind(this);
		this.refine = this.refine.bind(this);
		this.refinement = this.refinement.bind(this);
		this.superRefine = this.superRefine.bind(this);
		this.optional = this.optional.bind(this);
		this.nullable = this.nullable.bind(this);
		this.nullish = this.nullish.bind(this);
		this.array = this.array.bind(this);
		this.promise = this.promise.bind(this);
		this.or = this.or.bind(this);
		this.and = this.and.bind(this);
		this.transform = this.transform.bind(this);
		this.brand = this.brand.bind(this);
		this.default = this.default.bind(this);
		this.catch = this.catch.bind(this);
		this.describe = this.describe.bind(this);
		this.pipe = this.pipe.bind(this);
		this.readonly = this.readonly.bind(this);
		this.isNullable = this.isNullable.bind(this);
		this.isOptional = this.isOptional.bind(this);
		this["~standard"] = {
			version: 1,
			vendor: "zod",
			validate: (data) => this["~validate"](data)
		};
	}
	optional() {
		return ZodOptional.create(this, this._def);
	}
	nullable() {
		return ZodNullable.create(this, this._def);
	}
	nullish() {
		return this.nullable().optional();
	}
	array() {
		return ZodArray.create(this);
	}
	promise() {
		return ZodPromise.create(this, this._def);
	}
	or(option) {
		return ZodUnion.create([this, option], this._def);
	}
	and(incoming) {
		return ZodIntersection.create(this, incoming, this._def);
	}
	transform(transform) {
		return new ZodEffects({
			...processCreateParams(this._def),
			schema: this,
			typeName: ZodFirstPartyTypeKind.ZodEffects,
			effect: {
				type: "transform",
				transform
			}
		});
	}
	default(def) {
		const defaultValueFunc = typeof def === "function" ? def : () => def;
		return new ZodDefault({
			...processCreateParams(this._def),
			innerType: this,
			defaultValue: defaultValueFunc,
			typeName: ZodFirstPartyTypeKind.ZodDefault
		});
	}
	brand() {
		return new ZodBranded({
			typeName: ZodFirstPartyTypeKind.ZodBranded,
			type: this,
			...processCreateParams(this._def)
		});
	}
	catch(def) {
		const catchValueFunc = typeof def === "function" ? def : () => def;
		return new ZodCatch({
			...processCreateParams(this._def),
			innerType: this,
			catchValue: catchValueFunc,
			typeName: ZodFirstPartyTypeKind.ZodCatch
		});
	}
	describe(description) {
		const This = this.constructor;
		return new This({
			...this._def,
			description
		});
	}
	pipe(target) {
		return ZodPipeline.create(this, target);
	}
	readonly() {
		return ZodReadonly.create(this);
	}
	isOptional() {
		return this.safeParse(void 0).success;
	}
	isNullable() {
		return this.safeParse(null).success;
	}
};
const cuidRegex = /^c[^\s-]{8,}$/i;
const cuid2Regex = /^[0-9a-z]+$/;
const ulidRegex = /^[0-9A-HJKMNP-TV-Z]{26}$/i;
const uuidRegex = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/i;
const nanoidRegex = /^[a-z0-9_-]{21}$/i;
const jwtRegex = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/;
const durationRegex = /^[-+]?P(?!$)(?:(?:[-+]?\d+Y)|(?:[-+]?\d+[.,]\d+Y$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:(?:[-+]?\d+W)|(?:[-+]?\d+[.,]\d+W$))?(?:(?:[-+]?\d+D)|(?:[-+]?\d+[.,]\d+D$))?(?:T(?=[\d+-])(?:(?:[-+]?\d+H)|(?:[-+]?\d+[.,]\d+H$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:[-+]?\d+(?:[.,]\d+)?S)?)??$/;
const emailRegex = /^(?!\.)(?!.*\.\.)([A-Z0-9_'+\-\.]*)[A-Z0-9_+-]@([A-Z0-9][A-Z0-9\-]*\.)+[A-Z]{2,}$/i;
const _emojiRegex = `^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$`;
let emojiRegex$1;
const ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/;
const ipv4CidrRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/(3[0-2]|[12]?[0-9])$/;
const ipv6Regex = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/;
const ipv6CidrRegex = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/;
const base64Regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
const base64urlRegex = /^([0-9a-zA-Z-_]{4})*(([0-9a-zA-Z-_]{2}(==)?)|([0-9a-zA-Z-_]{3}(=)?))?$/;
const dateRegexSource = `((\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-((0[13578]|1[02])-(0[1-9]|[12]\\d|3[01])|(0[469]|11)-(0[1-9]|[12]\\d|30)|(02)-(0[1-9]|1\\d|2[0-8])))`;
const dateRegex = new RegExp(`^${dateRegexSource}$`);
function timeRegexSource(args) {
	let secondsRegexSource = `[0-5]\\d`;
	if (args.precision) secondsRegexSource = `${secondsRegexSource}\\.\\d{${args.precision}}`;
	else if (args.precision == null) secondsRegexSource = `${secondsRegexSource}(\\.\\d+)?`;
	const secondsQuantifier = args.precision ? "+" : "?";
	return `([01]\\d|2[0-3]):[0-5]\\d(:${secondsRegexSource})${secondsQuantifier}`;
}
function timeRegex(args) {
	return new RegExp(`^${timeRegexSource(args)}$`);
}
function datetimeRegex(args) {
	let regex = `${dateRegexSource}T${timeRegexSource(args)}`;
	const opts = [];
	opts.push(args.local ? `Z?` : `Z`);
	if (args.offset) opts.push(`([+-]\\d{2}:?\\d{2})`);
	regex = `${regex}(${opts.join("|")})`;
	return new RegExp(`^${regex}$`);
}
function isValidIP(ip, version) {
	if ((version === "v4" || !version) && ipv4Regex.test(ip)) return true;
	if ((version === "v6" || !version) && ipv6Regex.test(ip)) return true;
	return false;
}
function isValidJWT(jwt, alg) {
	if (!jwtRegex.test(jwt)) return false;
	try {
		const [header] = jwt.split(".");
		if (!header) return false;
		const base64 = header.replace(/-/g, "+").replace(/_/g, "/").padEnd(header.length + (4 - header.length % 4) % 4, "=");
		const decoded = JSON.parse(atob(base64));
		if (typeof decoded !== "object" || decoded === null) return false;
		if ("typ" in decoded && decoded?.typ !== "JWT") return false;
		if (!decoded.alg) return false;
		if (alg && decoded.alg !== alg) return false;
		return true;
	} catch {
		return false;
	}
}
function isValidCidr(ip, version) {
	if ((version === "v4" || !version) && ipv4CidrRegex.test(ip)) return true;
	if ((version === "v6" || !version) && ipv6CidrRegex.test(ip)) return true;
	return false;
}
var ZodString = class ZodString extends ZodType {
	_parse(input) {
		if (this._def.coerce) input.data = String(input.data);
		if (this._getType(input) !== ZodParsedType.string) {
			const ctx = this._getOrReturnCtx(input);
			addIssueToContext(ctx, {
				code: ZodIssueCode.invalid_type,
				expected: ZodParsedType.string,
				received: ctx.parsedType
			});
			return INVALID;
		}
		const status = new ParseStatus();
		let ctx = void 0;
		for (const check of this._def.checks) if (check.kind === "min") {
			if (input.data.length < check.value) {
				ctx = this._getOrReturnCtx(input, ctx);
				addIssueToContext(ctx, {
					code: ZodIssueCode.too_small,
					minimum: check.value,
					type: "string",
					inclusive: true,
					exact: false,
					message: check.message
				});
				status.dirty();
			}
		} else if (check.kind === "max") {
			if (input.data.length > check.value) {
				ctx = this._getOrReturnCtx(input, ctx);
				addIssueToContext(ctx, {
					code: ZodIssueCode.too_big,
					maximum: check.value,
					type: "string",
					inclusive: true,
					exact: false,
					message: check.message
				});
				status.dirty();
			}
		} else if (check.kind === "length") {
			const tooBig = input.data.length > check.value;
			const tooSmall = input.data.length < check.value;
			if (tooBig || tooSmall) {
				ctx = this._getOrReturnCtx(input, ctx);
				if (tooBig) addIssueToContext(ctx, {
					code: ZodIssueCode.too_big,
					maximum: check.value,
					type: "string",
					inclusive: true,
					exact: true,
					message: check.message
				});
				else if (tooSmall) addIssueToContext(ctx, {
					code: ZodIssueCode.too_small,
					minimum: check.value,
					type: "string",
					inclusive: true,
					exact: true,
					message: check.message
				});
				status.dirty();
			}
		} else if (check.kind === "email") {
			if (!emailRegex.test(input.data)) {
				ctx = this._getOrReturnCtx(input, ctx);
				addIssueToContext(ctx, {
					validation: "email",
					code: ZodIssueCode.invalid_string,
					message: check.message
				});
				status.dirty();
			}
		} else if (check.kind === "emoji") {
			if (!emojiRegex$1) emojiRegex$1 = new RegExp(_emojiRegex, "u");
			if (!emojiRegex$1.test(input.data)) {
				ctx = this._getOrReturnCtx(input, ctx);
				addIssueToContext(ctx, {
					validation: "emoji",
					code: ZodIssueCode.invalid_string,
					message: check.message
				});
				status.dirty();
			}
		} else if (check.kind === "uuid") {
			if (!uuidRegex.test(input.data)) {
				ctx = this._getOrReturnCtx(input, ctx);
				addIssueToContext(ctx, {
					validation: "uuid",
					code: ZodIssueCode.invalid_string,
					message: check.message
				});
				status.dirty();
			}
		} else if (check.kind === "nanoid") {
			if (!nanoidRegex.test(input.data)) {
				ctx = this._getOrReturnCtx(input, ctx);
				addIssueToContext(ctx, {
					validation: "nanoid",
					code: ZodIssueCode.invalid_string,
					message: check.message
				});
				status.dirty();
			}
		} else if (check.kind === "cuid") {
			if (!cuidRegex.test(input.data)) {
				ctx = this._getOrReturnCtx(input, ctx);
				addIssueToContext(ctx, {
					validation: "cuid",
					code: ZodIssueCode.invalid_string,
					message: check.message
				});
				status.dirty();
			}
		} else if (check.kind === "cuid2") {
			if (!cuid2Regex.test(input.data)) {
				ctx = this._getOrReturnCtx(input, ctx);
				addIssueToContext(ctx, {
					validation: "cuid2",
					code: ZodIssueCode.invalid_string,
					message: check.message
				});
				status.dirty();
			}
		} else if (check.kind === "ulid") {
			if (!ulidRegex.test(input.data)) {
				ctx = this._getOrReturnCtx(input, ctx);
				addIssueToContext(ctx, {
					validation: "ulid",
					code: ZodIssueCode.invalid_string,
					message: check.message
				});
				status.dirty();
			}
		} else if (check.kind === "url") try {
			new URL(input.data);
		} catch {
			ctx = this._getOrReturnCtx(input, ctx);
			addIssueToContext(ctx, {
				validation: "url",
				code: ZodIssueCode.invalid_string,
				message: check.message
			});
			status.dirty();
		}
		else if (check.kind === "regex") {
			check.regex.lastIndex = 0;
			if (!check.regex.test(input.data)) {
				ctx = this._getOrReturnCtx(input, ctx);
				addIssueToContext(ctx, {
					validation: "regex",
					code: ZodIssueCode.invalid_string,
					message: check.message
				});
				status.dirty();
			}
		} else if (check.kind === "trim") input.data = input.data.trim();
		else if (check.kind === "includes") {
			if (!input.data.includes(check.value, check.position)) {
				ctx = this._getOrReturnCtx(input, ctx);
				addIssueToContext(ctx, {
					code: ZodIssueCode.invalid_string,
					validation: {
						includes: check.value,
						position: check.position
					},
					message: check.message
				});
				status.dirty();
			}
		} else if (check.kind === "toLowerCase") input.data = input.data.toLowerCase();
		else if (check.kind === "toUpperCase") input.data = input.data.toUpperCase();
		else if (check.kind === "startsWith") {
			if (!input.data.startsWith(check.value)) {
				ctx = this._getOrReturnCtx(input, ctx);
				addIssueToContext(ctx, {
					code: ZodIssueCode.invalid_string,
					validation: { startsWith: check.value },
					message: check.message
				});
				status.dirty();
			}
		} else if (check.kind === "endsWith") {
			if (!input.data.endsWith(check.value)) {
				ctx = this._getOrReturnCtx(input, ctx);
				addIssueToContext(ctx, {
					code: ZodIssueCode.invalid_string,
					validation: { endsWith: check.value },
					message: check.message
				});
				status.dirty();
			}
		} else if (check.kind === "datetime") {
			if (!datetimeRegex(check).test(input.data)) {
				ctx = this._getOrReturnCtx(input, ctx);
				addIssueToContext(ctx, {
					code: ZodIssueCode.invalid_string,
					validation: "datetime",
					message: check.message
				});
				status.dirty();
			}
		} else if (check.kind === "date") {
			if (!dateRegex.test(input.data)) {
				ctx = this._getOrReturnCtx(input, ctx);
				addIssueToContext(ctx, {
					code: ZodIssueCode.invalid_string,
					validation: "date",
					message: check.message
				});
				status.dirty();
			}
		} else if (check.kind === "time") {
			if (!timeRegex(check).test(input.data)) {
				ctx = this._getOrReturnCtx(input, ctx);
				addIssueToContext(ctx, {
					code: ZodIssueCode.invalid_string,
					validation: "time",
					message: check.message
				});
				status.dirty();
			}
		} else if (check.kind === "duration") {
			if (!durationRegex.test(input.data)) {
				ctx = this._getOrReturnCtx(input, ctx);
				addIssueToContext(ctx, {
					validation: "duration",
					code: ZodIssueCode.invalid_string,
					message: check.message
				});
				status.dirty();
			}
		} else if (check.kind === "ip") {
			if (!isValidIP(input.data, check.version)) {
				ctx = this._getOrReturnCtx(input, ctx);
				addIssueToContext(ctx, {
					validation: "ip",
					code: ZodIssueCode.invalid_string,
					message: check.message
				});
				status.dirty();
			}
		} else if (check.kind === "jwt") {
			if (!isValidJWT(input.data, check.alg)) {
				ctx = this._getOrReturnCtx(input, ctx);
				addIssueToContext(ctx, {
					validation: "jwt",
					code: ZodIssueCode.invalid_string,
					message: check.message
				});
				status.dirty();
			}
		} else if (check.kind === "cidr") {
			if (!isValidCidr(input.data, check.version)) {
				ctx = this._getOrReturnCtx(input, ctx);
				addIssueToContext(ctx, {
					validation: "cidr",
					code: ZodIssueCode.invalid_string,
					message: check.message
				});
				status.dirty();
			}
		} else if (check.kind === "base64") {
			if (!base64Regex.test(input.data)) {
				ctx = this._getOrReturnCtx(input, ctx);
				addIssueToContext(ctx, {
					validation: "base64",
					code: ZodIssueCode.invalid_string,
					message: check.message
				});
				status.dirty();
			}
		} else if (check.kind === "base64url") {
			if (!base64urlRegex.test(input.data)) {
				ctx = this._getOrReturnCtx(input, ctx);
				addIssueToContext(ctx, {
					validation: "base64url",
					code: ZodIssueCode.invalid_string,
					message: check.message
				});
				status.dirty();
			}
		} else util.assertNever(check);
		return {
			status: status.value,
			value: input.data
		};
	}
	_regex(regex, validation, message) {
		return this.refinement((data) => regex.test(data), {
			validation,
			code: ZodIssueCode.invalid_string,
			...errorUtil.errToObj(message)
		});
	}
	_addCheck(check) {
		return new ZodString({
			...this._def,
			checks: [...this._def.checks, check]
		});
	}
	email(message) {
		return this._addCheck({
			kind: "email",
			...errorUtil.errToObj(message)
		});
	}
	url(message) {
		return this._addCheck({
			kind: "url",
			...errorUtil.errToObj(message)
		});
	}
	emoji(message) {
		return this._addCheck({
			kind: "emoji",
			...errorUtil.errToObj(message)
		});
	}
	uuid(message) {
		return this._addCheck({
			kind: "uuid",
			...errorUtil.errToObj(message)
		});
	}
	nanoid(message) {
		return this._addCheck({
			kind: "nanoid",
			...errorUtil.errToObj(message)
		});
	}
	cuid(message) {
		return this._addCheck({
			kind: "cuid",
			...errorUtil.errToObj(message)
		});
	}
	cuid2(message) {
		return this._addCheck({
			kind: "cuid2",
			...errorUtil.errToObj(message)
		});
	}
	ulid(message) {
		return this._addCheck({
			kind: "ulid",
			...errorUtil.errToObj(message)
		});
	}
	base64(message) {
		return this._addCheck({
			kind: "base64",
			...errorUtil.errToObj(message)
		});
	}
	base64url(message) {
		return this._addCheck({
			kind: "base64url",
			...errorUtil.errToObj(message)
		});
	}
	jwt(options) {
		return this._addCheck({
			kind: "jwt",
			...errorUtil.errToObj(options)
		});
	}
	ip(options) {
		return this._addCheck({
			kind: "ip",
			...errorUtil.errToObj(options)
		});
	}
	cidr(options) {
		return this._addCheck({
			kind: "cidr",
			...errorUtil.errToObj(options)
		});
	}
	datetime(options) {
		if (typeof options === "string") return this._addCheck({
			kind: "datetime",
			precision: null,
			offset: false,
			local: false,
			message: options
		});
		return this._addCheck({
			kind: "datetime",
			precision: typeof options?.precision === "undefined" ? null : options?.precision,
			offset: options?.offset ?? false,
			local: options?.local ?? false,
			...errorUtil.errToObj(options?.message)
		});
	}
	date(message) {
		return this._addCheck({
			kind: "date",
			message
		});
	}
	time(options) {
		if (typeof options === "string") return this._addCheck({
			kind: "time",
			precision: null,
			message: options
		});
		return this._addCheck({
			kind: "time",
			precision: typeof options?.precision === "undefined" ? null : options?.precision,
			...errorUtil.errToObj(options?.message)
		});
	}
	duration(message) {
		return this._addCheck({
			kind: "duration",
			...errorUtil.errToObj(message)
		});
	}
	regex(regex, message) {
		return this._addCheck({
			kind: "regex",
			regex,
			...errorUtil.errToObj(message)
		});
	}
	includes(value, options) {
		return this._addCheck({
			kind: "includes",
			value,
			position: options?.position,
			...errorUtil.errToObj(options?.message)
		});
	}
	startsWith(value, message) {
		return this._addCheck({
			kind: "startsWith",
			value,
			...errorUtil.errToObj(message)
		});
	}
	endsWith(value, message) {
		return this._addCheck({
			kind: "endsWith",
			value,
			...errorUtil.errToObj(message)
		});
	}
	min(minLength, message) {
		return this._addCheck({
			kind: "min",
			value: minLength,
			...errorUtil.errToObj(message)
		});
	}
	max(maxLength, message) {
		return this._addCheck({
			kind: "max",
			value: maxLength,
			...errorUtil.errToObj(message)
		});
	}
	length(len, message) {
		return this._addCheck({
			kind: "length",
			value: len,
			...errorUtil.errToObj(message)
		});
	}
	/**
	* Equivalent to `.min(1)`
	*/
	nonempty(message) {
		return this.min(1, errorUtil.errToObj(message));
	}
	trim() {
		return new ZodString({
			...this._def,
			checks: [...this._def.checks, { kind: "trim" }]
		});
	}
	toLowerCase() {
		return new ZodString({
			...this._def,
			checks: [...this._def.checks, { kind: "toLowerCase" }]
		});
	}
	toUpperCase() {
		return new ZodString({
			...this._def,
			checks: [...this._def.checks, { kind: "toUpperCase" }]
		});
	}
	get isDatetime() {
		return !!this._def.checks.find((ch) => ch.kind === "datetime");
	}
	get isDate() {
		return !!this._def.checks.find((ch) => ch.kind === "date");
	}
	get isTime() {
		return !!this._def.checks.find((ch) => ch.kind === "time");
	}
	get isDuration() {
		return !!this._def.checks.find((ch) => ch.kind === "duration");
	}
	get isEmail() {
		return !!this._def.checks.find((ch) => ch.kind === "email");
	}
	get isURL() {
		return !!this._def.checks.find((ch) => ch.kind === "url");
	}
	get isEmoji() {
		return !!this._def.checks.find((ch) => ch.kind === "emoji");
	}
	get isUUID() {
		return !!this._def.checks.find((ch) => ch.kind === "uuid");
	}
	get isNANOID() {
		return !!this._def.checks.find((ch) => ch.kind === "nanoid");
	}
	get isCUID() {
		return !!this._def.checks.find((ch) => ch.kind === "cuid");
	}
	get isCUID2() {
		return !!this._def.checks.find((ch) => ch.kind === "cuid2");
	}
	get isULID() {
		return !!this._def.checks.find((ch) => ch.kind === "ulid");
	}
	get isIP() {
		return !!this._def.checks.find((ch) => ch.kind === "ip");
	}
	get isCIDR() {
		return !!this._def.checks.find((ch) => ch.kind === "cidr");
	}
	get isBase64() {
		return !!this._def.checks.find((ch) => ch.kind === "base64");
	}
	get isBase64url() {
		return !!this._def.checks.find((ch) => ch.kind === "base64url");
	}
	get minLength() {
		let min = null;
		for (const ch of this._def.checks) if (ch.kind === "min") {
			if (min === null || ch.value > min) min = ch.value;
		}
		return min;
	}
	get maxLength() {
		let max = null;
		for (const ch of this._def.checks) if (ch.kind === "max") {
			if (max === null || ch.value < max) max = ch.value;
		}
		return max;
	}
};
ZodString.create = (params) => {
	return new ZodString({
		checks: [],
		typeName: ZodFirstPartyTypeKind.ZodString,
		coerce: params?.coerce ?? false,
		...processCreateParams(params)
	});
};
function floatSafeRemainder(val, step) {
	const valDecCount = (val.toString().split(".")[1] || "").length;
	const stepDecCount = (step.toString().split(".")[1] || "").length;
	const decCount = valDecCount > stepDecCount ? valDecCount : stepDecCount;
	return Number.parseInt(val.toFixed(decCount).replace(".", "")) % Number.parseInt(step.toFixed(decCount).replace(".", "")) / 10 ** decCount;
}
var ZodNumber = class ZodNumber extends ZodType {
	constructor() {
		super(...arguments);
		this.min = this.gte;
		this.max = this.lte;
		this.step = this.multipleOf;
	}
	_parse(input) {
		if (this._def.coerce) input.data = Number(input.data);
		if (this._getType(input) !== ZodParsedType.number) {
			const ctx = this._getOrReturnCtx(input);
			addIssueToContext(ctx, {
				code: ZodIssueCode.invalid_type,
				expected: ZodParsedType.number,
				received: ctx.parsedType
			});
			return INVALID;
		}
		let ctx = void 0;
		const status = new ParseStatus();
		for (const check of this._def.checks) if (check.kind === "int") {
			if (!util.isInteger(input.data)) {
				ctx = this._getOrReturnCtx(input, ctx);
				addIssueToContext(ctx, {
					code: ZodIssueCode.invalid_type,
					expected: "integer",
					received: "float",
					message: check.message
				});
				status.dirty();
			}
		} else if (check.kind === "min") {
			if (check.inclusive ? input.data < check.value : input.data <= check.value) {
				ctx = this._getOrReturnCtx(input, ctx);
				addIssueToContext(ctx, {
					code: ZodIssueCode.too_small,
					minimum: check.value,
					type: "number",
					inclusive: check.inclusive,
					exact: false,
					message: check.message
				});
				status.dirty();
			}
		} else if (check.kind === "max") {
			if (check.inclusive ? input.data > check.value : input.data >= check.value) {
				ctx = this._getOrReturnCtx(input, ctx);
				addIssueToContext(ctx, {
					code: ZodIssueCode.too_big,
					maximum: check.value,
					type: "number",
					inclusive: check.inclusive,
					exact: false,
					message: check.message
				});
				status.dirty();
			}
		} else if (check.kind === "multipleOf") {
			if (floatSafeRemainder(input.data, check.value) !== 0) {
				ctx = this._getOrReturnCtx(input, ctx);
				addIssueToContext(ctx, {
					code: ZodIssueCode.not_multiple_of,
					multipleOf: check.value,
					message: check.message
				});
				status.dirty();
			}
		} else if (check.kind === "finite") {
			if (!Number.isFinite(input.data)) {
				ctx = this._getOrReturnCtx(input, ctx);
				addIssueToContext(ctx, {
					code: ZodIssueCode.not_finite,
					message: check.message
				});
				status.dirty();
			}
		} else util.assertNever(check);
		return {
			status: status.value,
			value: input.data
		};
	}
	gte(value, message) {
		return this.setLimit("min", value, true, errorUtil.toString(message));
	}
	gt(value, message) {
		return this.setLimit("min", value, false, errorUtil.toString(message));
	}
	lte(value, message) {
		return this.setLimit("max", value, true, errorUtil.toString(message));
	}
	lt(value, message) {
		return this.setLimit("max", value, false, errorUtil.toString(message));
	}
	setLimit(kind, value, inclusive, message) {
		return new ZodNumber({
			...this._def,
			checks: [...this._def.checks, {
				kind,
				value,
				inclusive,
				message: errorUtil.toString(message)
			}]
		});
	}
	_addCheck(check) {
		return new ZodNumber({
			...this._def,
			checks: [...this._def.checks, check]
		});
	}
	int(message) {
		return this._addCheck({
			kind: "int",
			message: errorUtil.toString(message)
		});
	}
	positive(message) {
		return this._addCheck({
			kind: "min",
			value: 0,
			inclusive: false,
			message: errorUtil.toString(message)
		});
	}
	negative(message) {
		return this._addCheck({
			kind: "max",
			value: 0,
			inclusive: false,
			message: errorUtil.toString(message)
		});
	}
	nonpositive(message) {
		return this._addCheck({
			kind: "max",
			value: 0,
			inclusive: true,
			message: errorUtil.toString(message)
		});
	}
	nonnegative(message) {
		return this._addCheck({
			kind: "min",
			value: 0,
			inclusive: true,
			message: errorUtil.toString(message)
		});
	}
	multipleOf(value, message) {
		return this._addCheck({
			kind: "multipleOf",
			value,
			message: errorUtil.toString(message)
		});
	}
	finite(message) {
		return this._addCheck({
			kind: "finite",
			message: errorUtil.toString(message)
		});
	}
	safe(message) {
		return this._addCheck({
			kind: "min",
			inclusive: true,
			value: Number.MIN_SAFE_INTEGER,
			message: errorUtil.toString(message)
		})._addCheck({
			kind: "max",
			inclusive: true,
			value: Number.MAX_SAFE_INTEGER,
			message: errorUtil.toString(message)
		});
	}
	get minValue() {
		let min = null;
		for (const ch of this._def.checks) if (ch.kind === "min") {
			if (min === null || ch.value > min) min = ch.value;
		}
		return min;
	}
	get maxValue() {
		let max = null;
		for (const ch of this._def.checks) if (ch.kind === "max") {
			if (max === null || ch.value < max) max = ch.value;
		}
		return max;
	}
	get isInt() {
		return !!this._def.checks.find((ch) => ch.kind === "int" || ch.kind === "multipleOf" && util.isInteger(ch.value));
	}
	get isFinite() {
		let max = null;
		let min = null;
		for (const ch of this._def.checks) if (ch.kind === "finite" || ch.kind === "int" || ch.kind === "multipleOf") return true;
		else if (ch.kind === "min") {
			if (min === null || ch.value > min) min = ch.value;
		} else if (ch.kind === "max") {
			if (max === null || ch.value < max) max = ch.value;
		}
		return Number.isFinite(min) && Number.isFinite(max);
	}
};
ZodNumber.create = (params) => {
	return new ZodNumber({
		checks: [],
		typeName: ZodFirstPartyTypeKind.ZodNumber,
		coerce: params?.coerce || false,
		...processCreateParams(params)
	});
};
var ZodBigInt = class ZodBigInt extends ZodType {
	constructor() {
		super(...arguments);
		this.min = this.gte;
		this.max = this.lte;
	}
	_parse(input) {
		if (this._def.coerce) try {
			input.data = BigInt(input.data);
		} catch {
			return this._getInvalidInput(input);
		}
		if (this._getType(input) !== ZodParsedType.bigint) return this._getInvalidInput(input);
		let ctx = void 0;
		const status = new ParseStatus();
		for (const check of this._def.checks) if (check.kind === "min") {
			if (check.inclusive ? input.data < check.value : input.data <= check.value) {
				ctx = this._getOrReturnCtx(input, ctx);
				addIssueToContext(ctx, {
					code: ZodIssueCode.too_small,
					type: "bigint",
					minimum: check.value,
					inclusive: check.inclusive,
					message: check.message
				});
				status.dirty();
			}
		} else if (check.kind === "max") {
			if (check.inclusive ? input.data > check.value : input.data >= check.value) {
				ctx = this._getOrReturnCtx(input, ctx);
				addIssueToContext(ctx, {
					code: ZodIssueCode.too_big,
					type: "bigint",
					maximum: check.value,
					inclusive: check.inclusive,
					message: check.message
				});
				status.dirty();
			}
		} else if (check.kind === "multipleOf") {
			if (input.data % check.value !== BigInt(0)) {
				ctx = this._getOrReturnCtx(input, ctx);
				addIssueToContext(ctx, {
					code: ZodIssueCode.not_multiple_of,
					multipleOf: check.value,
					message: check.message
				});
				status.dirty();
			}
		} else util.assertNever(check);
		return {
			status: status.value,
			value: input.data
		};
	}
	_getInvalidInput(input) {
		const ctx = this._getOrReturnCtx(input);
		addIssueToContext(ctx, {
			code: ZodIssueCode.invalid_type,
			expected: ZodParsedType.bigint,
			received: ctx.parsedType
		});
		return INVALID;
	}
	gte(value, message) {
		return this.setLimit("min", value, true, errorUtil.toString(message));
	}
	gt(value, message) {
		return this.setLimit("min", value, false, errorUtil.toString(message));
	}
	lte(value, message) {
		return this.setLimit("max", value, true, errorUtil.toString(message));
	}
	lt(value, message) {
		return this.setLimit("max", value, false, errorUtil.toString(message));
	}
	setLimit(kind, value, inclusive, message) {
		return new ZodBigInt({
			...this._def,
			checks: [...this._def.checks, {
				kind,
				value,
				inclusive,
				message: errorUtil.toString(message)
			}]
		});
	}
	_addCheck(check) {
		return new ZodBigInt({
			...this._def,
			checks: [...this._def.checks, check]
		});
	}
	positive(message) {
		return this._addCheck({
			kind: "min",
			value: BigInt(0),
			inclusive: false,
			message: errorUtil.toString(message)
		});
	}
	negative(message) {
		return this._addCheck({
			kind: "max",
			value: BigInt(0),
			inclusive: false,
			message: errorUtil.toString(message)
		});
	}
	nonpositive(message) {
		return this._addCheck({
			kind: "max",
			value: BigInt(0),
			inclusive: true,
			message: errorUtil.toString(message)
		});
	}
	nonnegative(message) {
		return this._addCheck({
			kind: "min",
			value: BigInt(0),
			inclusive: true,
			message: errorUtil.toString(message)
		});
	}
	multipleOf(value, message) {
		return this._addCheck({
			kind: "multipleOf",
			value,
			message: errorUtil.toString(message)
		});
	}
	get minValue() {
		let min = null;
		for (const ch of this._def.checks) if (ch.kind === "min") {
			if (min === null || ch.value > min) min = ch.value;
		}
		return min;
	}
	get maxValue() {
		let max = null;
		for (const ch of this._def.checks) if (ch.kind === "max") {
			if (max === null || ch.value < max) max = ch.value;
		}
		return max;
	}
};
ZodBigInt.create = (params) => {
	return new ZodBigInt({
		checks: [],
		typeName: ZodFirstPartyTypeKind.ZodBigInt,
		coerce: params?.coerce ?? false,
		...processCreateParams(params)
	});
};
var ZodBoolean = class extends ZodType {
	_parse(input) {
		if (this._def.coerce) input.data = Boolean(input.data);
		if (this._getType(input) !== ZodParsedType.boolean) {
			const ctx = this._getOrReturnCtx(input);
			addIssueToContext(ctx, {
				code: ZodIssueCode.invalid_type,
				expected: ZodParsedType.boolean,
				received: ctx.parsedType
			});
			return INVALID;
		}
		return OK(input.data);
	}
};
ZodBoolean.create = (params) => {
	return new ZodBoolean({
		typeName: ZodFirstPartyTypeKind.ZodBoolean,
		coerce: params?.coerce || false,
		...processCreateParams(params)
	});
};
var ZodDate = class ZodDate extends ZodType {
	_parse(input) {
		if (this._def.coerce) input.data = new Date(input.data);
		if (this._getType(input) !== ZodParsedType.date) {
			const ctx = this._getOrReturnCtx(input);
			addIssueToContext(ctx, {
				code: ZodIssueCode.invalid_type,
				expected: ZodParsedType.date,
				received: ctx.parsedType
			});
			return INVALID;
		}
		if (Number.isNaN(input.data.getTime())) {
			addIssueToContext(this._getOrReturnCtx(input), { code: ZodIssueCode.invalid_date });
			return INVALID;
		}
		const status = new ParseStatus();
		let ctx = void 0;
		for (const check of this._def.checks) if (check.kind === "min") {
			if (input.data.getTime() < check.value) {
				ctx = this._getOrReturnCtx(input, ctx);
				addIssueToContext(ctx, {
					code: ZodIssueCode.too_small,
					message: check.message,
					inclusive: true,
					exact: false,
					minimum: check.value,
					type: "date"
				});
				status.dirty();
			}
		} else if (check.kind === "max") {
			if (input.data.getTime() > check.value) {
				ctx = this._getOrReturnCtx(input, ctx);
				addIssueToContext(ctx, {
					code: ZodIssueCode.too_big,
					message: check.message,
					inclusive: true,
					exact: false,
					maximum: check.value,
					type: "date"
				});
				status.dirty();
			}
		} else util.assertNever(check);
		return {
			status: status.value,
			value: new Date(input.data.getTime())
		};
	}
	_addCheck(check) {
		return new ZodDate({
			...this._def,
			checks: [...this._def.checks, check]
		});
	}
	min(minDate, message) {
		return this._addCheck({
			kind: "min",
			value: minDate.getTime(),
			message: errorUtil.toString(message)
		});
	}
	max(maxDate, message) {
		return this._addCheck({
			kind: "max",
			value: maxDate.getTime(),
			message: errorUtil.toString(message)
		});
	}
	get minDate() {
		let min = null;
		for (const ch of this._def.checks) if (ch.kind === "min") {
			if (min === null || ch.value > min) min = ch.value;
		}
		return min != null ? new Date(min) : null;
	}
	get maxDate() {
		let max = null;
		for (const ch of this._def.checks) if (ch.kind === "max") {
			if (max === null || ch.value < max) max = ch.value;
		}
		return max != null ? new Date(max) : null;
	}
};
ZodDate.create = (params) => {
	return new ZodDate({
		checks: [],
		coerce: params?.coerce || false,
		typeName: ZodFirstPartyTypeKind.ZodDate,
		...processCreateParams(params)
	});
};
var ZodSymbol = class extends ZodType {
	_parse(input) {
		if (this._getType(input) !== ZodParsedType.symbol) {
			const ctx = this._getOrReturnCtx(input);
			addIssueToContext(ctx, {
				code: ZodIssueCode.invalid_type,
				expected: ZodParsedType.symbol,
				received: ctx.parsedType
			});
			return INVALID;
		}
		return OK(input.data);
	}
};
ZodSymbol.create = (params) => {
	return new ZodSymbol({
		typeName: ZodFirstPartyTypeKind.ZodSymbol,
		...processCreateParams(params)
	});
};
var ZodUndefined = class extends ZodType {
	_parse(input) {
		if (this._getType(input) !== ZodParsedType.undefined) {
			const ctx = this._getOrReturnCtx(input);
			addIssueToContext(ctx, {
				code: ZodIssueCode.invalid_type,
				expected: ZodParsedType.undefined,
				received: ctx.parsedType
			});
			return INVALID;
		}
		return OK(input.data);
	}
};
ZodUndefined.create = (params) => {
	return new ZodUndefined({
		typeName: ZodFirstPartyTypeKind.ZodUndefined,
		...processCreateParams(params)
	});
};
var ZodNull = class extends ZodType {
	_parse(input) {
		if (this._getType(input) !== ZodParsedType.null) {
			const ctx = this._getOrReturnCtx(input);
			addIssueToContext(ctx, {
				code: ZodIssueCode.invalid_type,
				expected: ZodParsedType.null,
				received: ctx.parsedType
			});
			return INVALID;
		}
		return OK(input.data);
	}
};
ZodNull.create = (params) => {
	return new ZodNull({
		typeName: ZodFirstPartyTypeKind.ZodNull,
		...processCreateParams(params)
	});
};
var ZodAny = class extends ZodType {
	constructor() {
		super(...arguments);
		this._any = true;
	}
	_parse(input) {
		return OK(input.data);
	}
};
ZodAny.create = (params) => {
	return new ZodAny({
		typeName: ZodFirstPartyTypeKind.ZodAny,
		...processCreateParams(params)
	});
};
var ZodUnknown = class extends ZodType {
	constructor() {
		super(...arguments);
		this._unknown = true;
	}
	_parse(input) {
		return OK(input.data);
	}
};
ZodUnknown.create = (params) => {
	return new ZodUnknown({
		typeName: ZodFirstPartyTypeKind.ZodUnknown,
		...processCreateParams(params)
	});
};
var ZodNever = class extends ZodType {
	_parse(input) {
		const ctx = this._getOrReturnCtx(input);
		addIssueToContext(ctx, {
			code: ZodIssueCode.invalid_type,
			expected: ZodParsedType.never,
			received: ctx.parsedType
		});
		return INVALID;
	}
};
ZodNever.create = (params) => {
	return new ZodNever({
		typeName: ZodFirstPartyTypeKind.ZodNever,
		...processCreateParams(params)
	});
};
var ZodVoid = class extends ZodType {
	_parse(input) {
		if (this._getType(input) !== ZodParsedType.undefined) {
			const ctx = this._getOrReturnCtx(input);
			addIssueToContext(ctx, {
				code: ZodIssueCode.invalid_type,
				expected: ZodParsedType.void,
				received: ctx.parsedType
			});
			return INVALID;
		}
		return OK(input.data);
	}
};
ZodVoid.create = (params) => {
	return new ZodVoid({
		typeName: ZodFirstPartyTypeKind.ZodVoid,
		...processCreateParams(params)
	});
};
var ZodArray = class ZodArray extends ZodType {
	_parse(input) {
		const { ctx, status } = this._processInputParams(input);
		const def = this._def;
		if (ctx.parsedType !== ZodParsedType.array) {
			addIssueToContext(ctx, {
				code: ZodIssueCode.invalid_type,
				expected: ZodParsedType.array,
				received: ctx.parsedType
			});
			return INVALID;
		}
		if (def.exactLength !== null) {
			const tooBig = ctx.data.length > def.exactLength.value;
			const tooSmall = ctx.data.length < def.exactLength.value;
			if (tooBig || tooSmall) {
				addIssueToContext(ctx, {
					code: tooBig ? ZodIssueCode.too_big : ZodIssueCode.too_small,
					minimum: tooSmall ? def.exactLength.value : void 0,
					maximum: tooBig ? def.exactLength.value : void 0,
					type: "array",
					inclusive: true,
					exact: true,
					message: def.exactLength.message
				});
				if (tooBig) return INVALID;
				status.dirty();
			}
		}
		if (def.minLength !== null) {
			if (ctx.data.length < def.minLength.value) {
				addIssueToContext(ctx, {
					code: ZodIssueCode.too_small,
					minimum: def.minLength.value,
					type: "array",
					inclusive: true,
					exact: false,
					message: def.minLength.message
				});
				status.dirty();
			}
		}
		if (def.maxLength !== null) {
			if (ctx.data.length > def.maxLength.value) {
				addIssueToContext(ctx, {
					code: ZodIssueCode.too_big,
					maximum: def.maxLength.value,
					type: "array",
					inclusive: true,
					exact: false,
					message: def.maxLength.message
				});
				return INVALID;
			}
		}
		if (ctx.common.async) return Promise.all([...ctx.data].map((item, i) => {
			return def.type._parseAsync(new ParseInputLazyPath(ctx, item, ctx.path, i));
		})).then((result) => {
			return ParseStatus.mergeArray(status, result);
		});
		const result = [...ctx.data].map((item, i) => {
			return def.type._parseSync(new ParseInputLazyPath(ctx, item, ctx.path, i));
		});
		return ParseStatus.mergeArray(status, result);
	}
	get element() {
		return this._def.type;
	}
	min(minLength, message) {
		return new ZodArray({
			...this._def,
			minLength: {
				value: minLength,
				message: errorUtil.toString(message)
			}
		});
	}
	max(maxLength, message) {
		return new ZodArray({
			...this._def,
			maxLength: {
				value: maxLength,
				message: errorUtil.toString(message)
			}
		});
	}
	length(len, message) {
		return new ZodArray({
			...this._def,
			exactLength: {
				value: len,
				message: errorUtil.toString(message)
			}
		});
	}
	nonempty(message) {
		return this.min(1, message);
	}
};
ZodArray.create = (schema, params) => {
	return new ZodArray({
		type: schema,
		minLength: null,
		maxLength: null,
		exactLength: null,
		typeName: ZodFirstPartyTypeKind.ZodArray,
		...processCreateParams(params)
	});
};
function deepPartialify(schema) {
	if (schema instanceof ZodObject) {
		const newShape = {};
		for (const key in schema.shape) {
			const fieldSchema = schema.shape[key];
			newShape[key] = ZodOptional.create(deepPartialify(fieldSchema));
		}
		return new ZodObject({
			...schema._def,
			shape: () => newShape
		});
	} else if (schema instanceof ZodArray) return new ZodArray({
		...schema._def,
		type: deepPartialify(schema.element)
	});
	else if (schema instanceof ZodOptional) return ZodOptional.create(deepPartialify(schema.unwrap()));
	else if (schema instanceof ZodNullable) return ZodNullable.create(deepPartialify(schema.unwrap()));
	else if (schema instanceof ZodTuple) return ZodTuple.create(schema.items.map((item) => deepPartialify(item)));
	else return schema;
}
var ZodObject = class ZodObject extends ZodType {
	constructor() {
		super(...arguments);
		this._cached = null;
		/**
		* @deprecated In most cases, this is no longer needed - unknown properties are now silently stripped.
		* If you want to pass through unknown properties, use `.passthrough()` instead.
		*/
		this.nonstrict = this.passthrough;
		/**
		* @deprecated Use `.extend` instead
		*  */
		this.augment = this.extend;
	}
	_getCached() {
		if (this._cached !== null) return this._cached;
		const shape = this._def.shape();
		const keys = util.objectKeys(shape);
		this._cached = {
			shape,
			keys
		};
		return this._cached;
	}
	_parse(input) {
		if (this._getType(input) !== ZodParsedType.object) {
			const ctx = this._getOrReturnCtx(input);
			addIssueToContext(ctx, {
				code: ZodIssueCode.invalid_type,
				expected: ZodParsedType.object,
				received: ctx.parsedType
			});
			return INVALID;
		}
		const { status, ctx } = this._processInputParams(input);
		const { shape, keys: shapeKeys } = this._getCached();
		const extraKeys = [];
		if (!(this._def.catchall instanceof ZodNever && this._def.unknownKeys === "strip")) {
			for (const key in ctx.data) if (!shapeKeys.includes(key)) extraKeys.push(key);
		}
		const pairs = [];
		for (const key of shapeKeys) {
			const keyValidator = shape[key];
			const value = ctx.data[key];
			pairs.push({
				key: {
					status: "valid",
					value: key
				},
				value: keyValidator._parse(new ParseInputLazyPath(ctx, value, ctx.path, key)),
				alwaysSet: key in ctx.data
			});
		}
		if (this._def.catchall instanceof ZodNever) {
			const unknownKeys = this._def.unknownKeys;
			if (unknownKeys === "passthrough") for (const key of extraKeys) pairs.push({
				key: {
					status: "valid",
					value: key
				},
				value: {
					status: "valid",
					value: ctx.data[key]
				}
			});
			else if (unknownKeys === "strict") {
				if (extraKeys.length > 0) {
					addIssueToContext(ctx, {
						code: ZodIssueCode.unrecognized_keys,
						keys: extraKeys
					});
					status.dirty();
				}
			} else if (unknownKeys === "strip") {} else throw new Error(`Internal ZodObject error: invalid unknownKeys value.`);
		} else {
			const catchall = this._def.catchall;
			for (const key of extraKeys) {
				const value = ctx.data[key];
				pairs.push({
					key: {
						status: "valid",
						value: key
					},
					value: catchall._parse(new ParseInputLazyPath(ctx, value, ctx.path, key)),
					alwaysSet: key in ctx.data
				});
			}
		}
		if (ctx.common.async) return Promise.resolve().then(async () => {
			const syncPairs = [];
			for (const pair of pairs) {
				const key = await pair.key;
				const value = await pair.value;
				syncPairs.push({
					key,
					value,
					alwaysSet: pair.alwaysSet
				});
			}
			return syncPairs;
		}).then((syncPairs) => {
			return ParseStatus.mergeObjectSync(status, syncPairs);
		});
		else return ParseStatus.mergeObjectSync(status, pairs);
	}
	get shape() {
		return this._def.shape();
	}
	strict(message) {
		errorUtil.errToObj;
		return new ZodObject({
			...this._def,
			unknownKeys: "strict",
			...message !== void 0 ? { errorMap: (issue, ctx) => {
				const defaultError = this._def.errorMap?.(issue, ctx).message ?? ctx.defaultError;
				if (issue.code === "unrecognized_keys") return { message: errorUtil.errToObj(message).message ?? defaultError };
				return { message: defaultError };
			} } : {}
		});
	}
	strip() {
		return new ZodObject({
			...this._def,
			unknownKeys: "strip"
		});
	}
	passthrough() {
		return new ZodObject({
			...this._def,
			unknownKeys: "passthrough"
		});
	}
	extend(augmentation) {
		return new ZodObject({
			...this._def,
			shape: () => ({
				...this._def.shape(),
				...augmentation
			})
		});
	}
	/**
	* Prior to zod@1.0.12 there was a bug in the
	* inferred type of merged objects. Please
	* upgrade if you are experiencing issues.
	*/
	merge(merging) {
		return new ZodObject({
			unknownKeys: merging._def.unknownKeys,
			catchall: merging._def.catchall,
			shape: () => ({
				...this._def.shape(),
				...merging._def.shape()
			}),
			typeName: ZodFirstPartyTypeKind.ZodObject
		});
	}
	setKey(key, schema) {
		return this.augment({ [key]: schema });
	}
	catchall(index) {
		return new ZodObject({
			...this._def,
			catchall: index
		});
	}
	pick(mask) {
		const shape = {};
		for (const key of util.objectKeys(mask)) if (mask[key] && this.shape[key]) shape[key] = this.shape[key];
		return new ZodObject({
			...this._def,
			shape: () => shape
		});
	}
	omit(mask) {
		const shape = {};
		for (const key of util.objectKeys(this.shape)) if (!mask[key]) shape[key] = this.shape[key];
		return new ZodObject({
			...this._def,
			shape: () => shape
		});
	}
	/**
	* @deprecated
	*/
	deepPartial() {
		return deepPartialify(this);
	}
	partial(mask) {
		const newShape = {};
		for (const key of util.objectKeys(this.shape)) {
			const fieldSchema = this.shape[key];
			if (mask && !mask[key]) newShape[key] = fieldSchema;
			else newShape[key] = fieldSchema.optional();
		}
		return new ZodObject({
			...this._def,
			shape: () => newShape
		});
	}
	required(mask) {
		const newShape = {};
		for (const key of util.objectKeys(this.shape)) if (mask && !mask[key]) newShape[key] = this.shape[key];
		else {
			let newField = this.shape[key];
			while (newField instanceof ZodOptional) newField = newField._def.innerType;
			newShape[key] = newField;
		}
		return new ZodObject({
			...this._def,
			shape: () => newShape
		});
	}
	keyof() {
		return createZodEnum(util.objectKeys(this.shape));
	}
};
ZodObject.create = (shape, params) => {
	return new ZodObject({
		shape: () => shape,
		unknownKeys: "strip",
		catchall: ZodNever.create(),
		typeName: ZodFirstPartyTypeKind.ZodObject,
		...processCreateParams(params)
	});
};
ZodObject.strictCreate = (shape, params) => {
	return new ZodObject({
		shape: () => shape,
		unknownKeys: "strict",
		catchall: ZodNever.create(),
		typeName: ZodFirstPartyTypeKind.ZodObject,
		...processCreateParams(params)
	});
};
ZodObject.lazycreate = (shape, params) => {
	return new ZodObject({
		shape,
		unknownKeys: "strip",
		catchall: ZodNever.create(),
		typeName: ZodFirstPartyTypeKind.ZodObject,
		...processCreateParams(params)
	});
};
var ZodUnion = class extends ZodType {
	_parse(input) {
		const { ctx } = this._processInputParams(input);
		const options = this._def.options;
		function handleResults(results) {
			for (const result of results) if (result.result.status === "valid") return result.result;
			for (const result of results) if (result.result.status === "dirty") {
				ctx.common.issues.push(...result.ctx.common.issues);
				return result.result;
			}
			const unionErrors = results.map((result) => new ZodError(result.ctx.common.issues));
			addIssueToContext(ctx, {
				code: ZodIssueCode.invalid_union,
				unionErrors
			});
			return INVALID;
		}
		if (ctx.common.async) return Promise.all(options.map(async (option) => {
			const childCtx = {
				...ctx,
				common: {
					...ctx.common,
					issues: []
				},
				parent: null
			};
			return {
				result: await option._parseAsync({
					data: ctx.data,
					path: ctx.path,
					parent: childCtx
				}),
				ctx: childCtx
			};
		})).then(handleResults);
		else {
			let dirty = void 0;
			const issues = [];
			for (const option of options) {
				const childCtx = {
					...ctx,
					common: {
						...ctx.common,
						issues: []
					},
					parent: null
				};
				const result = option._parseSync({
					data: ctx.data,
					path: ctx.path,
					parent: childCtx
				});
				if (result.status === "valid") return result;
				else if (result.status === "dirty" && !dirty) dirty = {
					result,
					ctx: childCtx
				};
				if (childCtx.common.issues.length) issues.push(childCtx.common.issues);
			}
			if (dirty) {
				ctx.common.issues.push(...dirty.ctx.common.issues);
				return dirty.result;
			}
			const unionErrors = issues.map((issues) => new ZodError(issues));
			addIssueToContext(ctx, {
				code: ZodIssueCode.invalid_union,
				unionErrors
			});
			return INVALID;
		}
	}
	get options() {
		return this._def.options;
	}
};
ZodUnion.create = (types, params) => {
	return new ZodUnion({
		options: types,
		typeName: ZodFirstPartyTypeKind.ZodUnion,
		...processCreateParams(params)
	});
};
const getDiscriminator = (type) => {
	if (type instanceof ZodLazy) return getDiscriminator(type.schema);
	else if (type instanceof ZodEffects) return getDiscriminator(type.innerType());
	else if (type instanceof ZodLiteral) return [type.value];
	else if (type instanceof ZodEnum) return type.options;
	else if (type instanceof ZodNativeEnum) return util.objectValues(type.enum);
	else if (type instanceof ZodDefault) return getDiscriminator(type._def.innerType);
	else if (type instanceof ZodUndefined) return [void 0];
	else if (type instanceof ZodNull) return [null];
	else if (type instanceof ZodOptional) return [void 0, ...getDiscriminator(type.unwrap())];
	else if (type instanceof ZodNullable) return [null, ...getDiscriminator(type.unwrap())];
	else if (type instanceof ZodBranded) return getDiscriminator(type.unwrap());
	else if (type instanceof ZodReadonly) return getDiscriminator(type.unwrap());
	else if (type instanceof ZodCatch) return getDiscriminator(type._def.innerType);
	else return [];
};
var ZodDiscriminatedUnion = class ZodDiscriminatedUnion extends ZodType {
	_parse(input) {
		const { ctx } = this._processInputParams(input);
		if (ctx.parsedType !== ZodParsedType.object) {
			addIssueToContext(ctx, {
				code: ZodIssueCode.invalid_type,
				expected: ZodParsedType.object,
				received: ctx.parsedType
			});
			return INVALID;
		}
		const discriminator = this.discriminator;
		const discriminatorValue = ctx.data[discriminator];
		const option = this.optionsMap.get(discriminatorValue);
		if (!option) {
			addIssueToContext(ctx, {
				code: ZodIssueCode.invalid_union_discriminator,
				options: Array.from(this.optionsMap.keys()),
				path: [discriminator]
			});
			return INVALID;
		}
		if (ctx.common.async) return option._parseAsync({
			data: ctx.data,
			path: ctx.path,
			parent: ctx
		});
		else return option._parseSync({
			data: ctx.data,
			path: ctx.path,
			parent: ctx
		});
	}
	get discriminator() {
		return this._def.discriminator;
	}
	get options() {
		return this._def.options;
	}
	get optionsMap() {
		return this._def.optionsMap;
	}
	/**
	* The constructor of the discriminated union schema. Its behaviour is very similar to that of the normal z.union() constructor.
	* However, it only allows a union of objects, all of which need to share a discriminator property. This property must
	* have a different value for each object in the union.
	* @param discriminator the name of the discriminator property
	* @param types an array of object schemas
	* @param params
	*/
	static create(discriminator, options, params) {
		const optionsMap = /* @__PURE__ */ new Map();
		for (const type of options) {
			const discriminatorValues = getDiscriminator(type.shape[discriminator]);
			if (!discriminatorValues.length) throw new Error(`A discriminator value for key \`${discriminator}\` could not be extracted from all schema options`);
			for (const value of discriminatorValues) {
				if (optionsMap.has(value)) throw new Error(`Discriminator property ${String(discriminator)} has duplicate value ${String(value)}`);
				optionsMap.set(value, type);
			}
		}
		return new ZodDiscriminatedUnion({
			typeName: ZodFirstPartyTypeKind.ZodDiscriminatedUnion,
			discriminator,
			options,
			optionsMap,
			...processCreateParams(params)
		});
	}
};
function mergeValues(a, b) {
	const aType = getParsedType(a);
	const bType = getParsedType(b);
	if (a === b) return {
		valid: true,
		data: a
	};
	else if (aType === ZodParsedType.object && bType === ZodParsedType.object) {
		const bKeys = util.objectKeys(b);
		const sharedKeys = util.objectKeys(a).filter((key) => bKeys.indexOf(key) !== -1);
		const newObj = {
			...a,
			...b
		};
		for (const key of sharedKeys) {
			const sharedValue = mergeValues(a[key], b[key]);
			if (!sharedValue.valid) return { valid: false };
			newObj[key] = sharedValue.data;
		}
		return {
			valid: true,
			data: newObj
		};
	} else if (aType === ZodParsedType.array && bType === ZodParsedType.array) {
		if (a.length !== b.length) return { valid: false };
		const newArray = [];
		for (let index = 0; index < a.length; index++) {
			const itemA = a[index];
			const itemB = b[index];
			const sharedValue = mergeValues(itemA, itemB);
			if (!sharedValue.valid) return { valid: false };
			newArray.push(sharedValue.data);
		}
		return {
			valid: true,
			data: newArray
		};
	} else if (aType === ZodParsedType.date && bType === ZodParsedType.date && +a === +b) return {
		valid: true,
		data: a
	};
	else return { valid: false };
}
var ZodIntersection = class extends ZodType {
	_parse(input) {
		const { status, ctx } = this._processInputParams(input);
		const handleParsed = (parsedLeft, parsedRight) => {
			if (isAborted(parsedLeft) || isAborted(parsedRight)) return INVALID;
			const merged = mergeValues(parsedLeft.value, parsedRight.value);
			if (!merged.valid) {
				addIssueToContext(ctx, { code: ZodIssueCode.invalid_intersection_types });
				return INVALID;
			}
			if (isDirty(parsedLeft) || isDirty(parsedRight)) status.dirty();
			return {
				status: status.value,
				value: merged.data
			};
		};
		if (ctx.common.async) return Promise.all([this._def.left._parseAsync({
			data: ctx.data,
			path: ctx.path,
			parent: ctx
		}), this._def.right._parseAsync({
			data: ctx.data,
			path: ctx.path,
			parent: ctx
		})]).then(([left, right]) => handleParsed(left, right));
		else return handleParsed(this._def.left._parseSync({
			data: ctx.data,
			path: ctx.path,
			parent: ctx
		}), this._def.right._parseSync({
			data: ctx.data,
			path: ctx.path,
			parent: ctx
		}));
	}
};
ZodIntersection.create = (left, right, params) => {
	return new ZodIntersection({
		left,
		right,
		typeName: ZodFirstPartyTypeKind.ZodIntersection,
		...processCreateParams(params)
	});
};
var ZodTuple = class ZodTuple extends ZodType {
	_parse(input) {
		const { status, ctx } = this._processInputParams(input);
		if (ctx.parsedType !== ZodParsedType.array) {
			addIssueToContext(ctx, {
				code: ZodIssueCode.invalid_type,
				expected: ZodParsedType.array,
				received: ctx.parsedType
			});
			return INVALID;
		}
		if (ctx.data.length < this._def.items.length) {
			addIssueToContext(ctx, {
				code: ZodIssueCode.too_small,
				minimum: this._def.items.length,
				inclusive: true,
				exact: false,
				type: "array"
			});
			return INVALID;
		}
		if (!this._def.rest && ctx.data.length > this._def.items.length) {
			addIssueToContext(ctx, {
				code: ZodIssueCode.too_big,
				maximum: this._def.items.length,
				inclusive: true,
				exact: false,
				type: "array"
			});
			status.dirty();
		}
		const items = [...ctx.data].map((item, itemIndex) => {
			const schema = this._def.items[itemIndex] || this._def.rest;
			if (!schema) return null;
			return schema._parse(new ParseInputLazyPath(ctx, item, ctx.path, itemIndex));
		}).filter((x) => !!x);
		if (ctx.common.async) return Promise.all(items).then((results) => {
			return ParseStatus.mergeArray(status, results);
		});
		else return ParseStatus.mergeArray(status, items);
	}
	get items() {
		return this._def.items;
	}
	rest(rest) {
		return new ZodTuple({
			...this._def,
			rest
		});
	}
};
ZodTuple.create = (schemas, params) => {
	if (!Array.isArray(schemas)) throw new Error("You must pass an array of schemas to z.tuple([ ... ])");
	return new ZodTuple({
		items: schemas,
		typeName: ZodFirstPartyTypeKind.ZodTuple,
		rest: null,
		...processCreateParams(params)
	});
};
var ZodRecord = class ZodRecord extends ZodType {
	get keySchema() {
		return this._def.keyType;
	}
	get valueSchema() {
		return this._def.valueType;
	}
	_parse(input) {
		const { status, ctx } = this._processInputParams(input);
		if (ctx.parsedType !== ZodParsedType.object) {
			addIssueToContext(ctx, {
				code: ZodIssueCode.invalid_type,
				expected: ZodParsedType.object,
				received: ctx.parsedType
			});
			return INVALID;
		}
		const pairs = [];
		const keyType = this._def.keyType;
		const valueType = this._def.valueType;
		for (const key in ctx.data) pairs.push({
			key: keyType._parse(new ParseInputLazyPath(ctx, key, ctx.path, key)),
			value: valueType._parse(new ParseInputLazyPath(ctx, ctx.data[key], ctx.path, key)),
			alwaysSet: key in ctx.data
		});
		if (ctx.common.async) return ParseStatus.mergeObjectAsync(status, pairs);
		else return ParseStatus.mergeObjectSync(status, pairs);
	}
	get element() {
		return this._def.valueType;
	}
	static create(first, second, third) {
		if (second instanceof ZodType) return new ZodRecord({
			keyType: first,
			valueType: second,
			typeName: ZodFirstPartyTypeKind.ZodRecord,
			...processCreateParams(third)
		});
		return new ZodRecord({
			keyType: ZodString.create(),
			valueType: first,
			typeName: ZodFirstPartyTypeKind.ZodRecord,
			...processCreateParams(second)
		});
	}
};
var ZodMap = class extends ZodType {
	get keySchema() {
		return this._def.keyType;
	}
	get valueSchema() {
		return this._def.valueType;
	}
	_parse(input) {
		const { status, ctx } = this._processInputParams(input);
		if (ctx.parsedType !== ZodParsedType.map) {
			addIssueToContext(ctx, {
				code: ZodIssueCode.invalid_type,
				expected: ZodParsedType.map,
				received: ctx.parsedType
			});
			return INVALID;
		}
		const keyType = this._def.keyType;
		const valueType = this._def.valueType;
		const pairs = [...ctx.data.entries()].map(([key, value], index) => {
			return {
				key: keyType._parse(new ParseInputLazyPath(ctx, key, ctx.path, [index, "key"])),
				value: valueType._parse(new ParseInputLazyPath(ctx, value, ctx.path, [index, "value"]))
			};
		});
		if (ctx.common.async) {
			const finalMap = /* @__PURE__ */ new Map();
			return Promise.resolve().then(async () => {
				for (const pair of pairs) {
					const key = await pair.key;
					const value = await pair.value;
					if (key.status === "aborted" || value.status === "aborted") return INVALID;
					if (key.status === "dirty" || value.status === "dirty") status.dirty();
					finalMap.set(key.value, value.value);
				}
				return {
					status: status.value,
					value: finalMap
				};
			});
		} else {
			const finalMap = /* @__PURE__ */ new Map();
			for (const pair of pairs) {
				const key = pair.key;
				const value = pair.value;
				if (key.status === "aborted" || value.status === "aborted") return INVALID;
				if (key.status === "dirty" || value.status === "dirty") status.dirty();
				finalMap.set(key.value, value.value);
			}
			return {
				status: status.value,
				value: finalMap
			};
		}
	}
};
ZodMap.create = (keyType, valueType, params) => {
	return new ZodMap({
		valueType,
		keyType,
		typeName: ZodFirstPartyTypeKind.ZodMap,
		...processCreateParams(params)
	});
};
var ZodSet = class ZodSet extends ZodType {
	_parse(input) {
		const { status, ctx } = this._processInputParams(input);
		if (ctx.parsedType !== ZodParsedType.set) {
			addIssueToContext(ctx, {
				code: ZodIssueCode.invalid_type,
				expected: ZodParsedType.set,
				received: ctx.parsedType
			});
			return INVALID;
		}
		const def = this._def;
		if (def.minSize !== null) {
			if (ctx.data.size < def.minSize.value) {
				addIssueToContext(ctx, {
					code: ZodIssueCode.too_small,
					minimum: def.minSize.value,
					type: "set",
					inclusive: true,
					exact: false,
					message: def.minSize.message
				});
				status.dirty();
			}
		}
		if (def.maxSize !== null) {
			if (ctx.data.size > def.maxSize.value) {
				addIssueToContext(ctx, {
					code: ZodIssueCode.too_big,
					maximum: def.maxSize.value,
					type: "set",
					inclusive: true,
					exact: false,
					message: def.maxSize.message
				});
				return INVALID;
			}
		}
		const valueType = this._def.valueType;
		function finalizeSet(elements) {
			const parsedSet = /* @__PURE__ */ new Set();
			for (const element of elements) {
				if (element.status === "aborted") return INVALID;
				if (element.status === "dirty") status.dirty();
				parsedSet.add(element.value);
			}
			return {
				status: status.value,
				value: parsedSet
			};
		}
		const elements = [...ctx.data.values()].map((item, i) => valueType._parse(new ParseInputLazyPath(ctx, item, ctx.path, i)));
		if (ctx.common.async) return Promise.all(elements).then((elements) => finalizeSet(elements));
		else return finalizeSet(elements);
	}
	min(minSize, message) {
		return new ZodSet({
			...this._def,
			minSize: {
				value: minSize,
				message: errorUtil.toString(message)
			}
		});
	}
	max(maxSize, message) {
		return new ZodSet({
			...this._def,
			maxSize: {
				value: maxSize,
				message: errorUtil.toString(message)
			}
		});
	}
	size(size, message) {
		return this.min(size, message).max(size, message);
	}
	nonempty(message) {
		return this.min(1, message);
	}
};
ZodSet.create = (valueType, params) => {
	return new ZodSet({
		valueType,
		minSize: null,
		maxSize: null,
		typeName: ZodFirstPartyTypeKind.ZodSet,
		...processCreateParams(params)
	});
};
var ZodFunction = class ZodFunction extends ZodType {
	constructor() {
		super(...arguments);
		this.validate = this.implement;
	}
	_parse(input) {
		const { ctx } = this._processInputParams(input);
		if (ctx.parsedType !== ZodParsedType.function) {
			addIssueToContext(ctx, {
				code: ZodIssueCode.invalid_type,
				expected: ZodParsedType.function,
				received: ctx.parsedType
			});
			return INVALID;
		}
		function makeArgsIssue(args, error) {
			return makeIssue({
				data: args,
				path: ctx.path,
				errorMaps: [
					ctx.common.contextualErrorMap,
					ctx.schemaErrorMap,
					getErrorMap(),
					errorMap
				].filter((x) => !!x),
				issueData: {
					code: ZodIssueCode.invalid_arguments,
					argumentsError: error
				}
			});
		}
		function makeReturnsIssue(returns, error) {
			return makeIssue({
				data: returns,
				path: ctx.path,
				errorMaps: [
					ctx.common.contextualErrorMap,
					ctx.schemaErrorMap,
					getErrorMap(),
					errorMap
				].filter((x) => !!x),
				issueData: {
					code: ZodIssueCode.invalid_return_type,
					returnTypeError: error
				}
			});
		}
		const params = { errorMap: ctx.common.contextualErrorMap };
		const fn = ctx.data;
		if (this._def.returns instanceof ZodPromise) {
			const me = this;
			return OK(async function(...args) {
				const error = new ZodError([]);
				const parsedArgs = await me._def.args.parseAsync(args, params).catch((e) => {
					error.addIssue(makeArgsIssue(args, e));
					throw error;
				});
				const result = await Reflect.apply(fn, this, parsedArgs);
				return await me._def.returns._def.type.parseAsync(result, params).catch((e) => {
					error.addIssue(makeReturnsIssue(result, e));
					throw error;
				});
			});
		} else {
			const me = this;
			return OK(function(...args) {
				const parsedArgs = me._def.args.safeParse(args, params);
				if (!parsedArgs.success) throw new ZodError([makeArgsIssue(args, parsedArgs.error)]);
				const result = Reflect.apply(fn, this, parsedArgs.data);
				const parsedReturns = me._def.returns.safeParse(result, params);
				if (!parsedReturns.success) throw new ZodError([makeReturnsIssue(result, parsedReturns.error)]);
				return parsedReturns.data;
			});
		}
	}
	parameters() {
		return this._def.args;
	}
	returnType() {
		return this._def.returns;
	}
	args(...items) {
		return new ZodFunction({
			...this._def,
			args: ZodTuple.create(items).rest(ZodUnknown.create())
		});
	}
	returns(returnType) {
		return new ZodFunction({
			...this._def,
			returns: returnType
		});
	}
	implement(func) {
		return this.parse(func);
	}
	strictImplement(func) {
		return this.parse(func);
	}
	static create(args, returns, params) {
		return new ZodFunction({
			args: args ? args : ZodTuple.create([]).rest(ZodUnknown.create()),
			returns: returns || ZodUnknown.create(),
			typeName: ZodFirstPartyTypeKind.ZodFunction,
			...processCreateParams(params)
		});
	}
};
var ZodLazy = class extends ZodType {
	get schema() {
		return this._def.getter();
	}
	_parse(input) {
		const { ctx } = this._processInputParams(input);
		return this._def.getter()._parse({
			data: ctx.data,
			path: ctx.path,
			parent: ctx
		});
	}
};
ZodLazy.create = (getter, params) => {
	return new ZodLazy({
		getter,
		typeName: ZodFirstPartyTypeKind.ZodLazy,
		...processCreateParams(params)
	});
};
var ZodLiteral = class extends ZodType {
	_parse(input) {
		if (input.data !== this._def.value) {
			const ctx = this._getOrReturnCtx(input);
			addIssueToContext(ctx, {
				received: ctx.data,
				code: ZodIssueCode.invalid_literal,
				expected: this._def.value
			});
			return INVALID;
		}
		return {
			status: "valid",
			value: input.data
		};
	}
	get value() {
		return this._def.value;
	}
};
ZodLiteral.create = (value, params) => {
	return new ZodLiteral({
		value,
		typeName: ZodFirstPartyTypeKind.ZodLiteral,
		...processCreateParams(params)
	});
};
function createZodEnum(values, params) {
	return new ZodEnum({
		values,
		typeName: ZodFirstPartyTypeKind.ZodEnum,
		...processCreateParams(params)
	});
}
var ZodEnum = class ZodEnum extends ZodType {
	_parse(input) {
		if (typeof input.data !== "string") {
			const ctx = this._getOrReturnCtx(input);
			const expectedValues = this._def.values;
			addIssueToContext(ctx, {
				expected: util.joinValues(expectedValues),
				received: ctx.parsedType,
				code: ZodIssueCode.invalid_type
			});
			return INVALID;
		}
		if (!this._cache) this._cache = new Set(this._def.values);
		if (!this._cache.has(input.data)) {
			const ctx = this._getOrReturnCtx(input);
			const expectedValues = this._def.values;
			addIssueToContext(ctx, {
				received: ctx.data,
				code: ZodIssueCode.invalid_enum_value,
				options: expectedValues
			});
			return INVALID;
		}
		return OK(input.data);
	}
	get options() {
		return this._def.values;
	}
	get enum() {
		const enumValues = {};
		for (const val of this._def.values) enumValues[val] = val;
		return enumValues;
	}
	get Values() {
		const enumValues = {};
		for (const val of this._def.values) enumValues[val] = val;
		return enumValues;
	}
	get Enum() {
		const enumValues = {};
		for (const val of this._def.values) enumValues[val] = val;
		return enumValues;
	}
	extract(values, newDef = this._def) {
		return ZodEnum.create(values, {
			...this._def,
			...newDef
		});
	}
	exclude(values, newDef = this._def) {
		return ZodEnum.create(this.options.filter((opt) => !values.includes(opt)), {
			...this._def,
			...newDef
		});
	}
};
ZodEnum.create = createZodEnum;
var ZodNativeEnum = class extends ZodType {
	_parse(input) {
		const nativeEnumValues = util.getValidEnumValues(this._def.values);
		const ctx = this._getOrReturnCtx(input);
		if (ctx.parsedType !== ZodParsedType.string && ctx.parsedType !== ZodParsedType.number) {
			const expectedValues = util.objectValues(nativeEnumValues);
			addIssueToContext(ctx, {
				expected: util.joinValues(expectedValues),
				received: ctx.parsedType,
				code: ZodIssueCode.invalid_type
			});
			return INVALID;
		}
		if (!this._cache) this._cache = new Set(util.getValidEnumValues(this._def.values));
		if (!this._cache.has(input.data)) {
			const expectedValues = util.objectValues(nativeEnumValues);
			addIssueToContext(ctx, {
				received: ctx.data,
				code: ZodIssueCode.invalid_enum_value,
				options: expectedValues
			});
			return INVALID;
		}
		return OK(input.data);
	}
	get enum() {
		return this._def.values;
	}
};
ZodNativeEnum.create = (values, params) => {
	return new ZodNativeEnum({
		values,
		typeName: ZodFirstPartyTypeKind.ZodNativeEnum,
		...processCreateParams(params)
	});
};
var ZodPromise = class extends ZodType {
	unwrap() {
		return this._def.type;
	}
	_parse(input) {
		const { ctx } = this._processInputParams(input);
		if (ctx.parsedType !== ZodParsedType.promise && ctx.common.async === false) {
			addIssueToContext(ctx, {
				code: ZodIssueCode.invalid_type,
				expected: ZodParsedType.promise,
				received: ctx.parsedType
			});
			return INVALID;
		}
		const promisified = ctx.parsedType === ZodParsedType.promise ? ctx.data : Promise.resolve(ctx.data);
		return OK(promisified.then((data) => {
			return this._def.type.parseAsync(data, {
				path: ctx.path,
				errorMap: ctx.common.contextualErrorMap
			});
		}));
	}
};
ZodPromise.create = (schema, params) => {
	return new ZodPromise({
		type: schema,
		typeName: ZodFirstPartyTypeKind.ZodPromise,
		...processCreateParams(params)
	});
};
var ZodEffects = class extends ZodType {
	innerType() {
		return this._def.schema;
	}
	sourceType() {
		return this._def.schema._def.typeName === ZodFirstPartyTypeKind.ZodEffects ? this._def.schema.sourceType() : this._def.schema;
	}
	_parse(input) {
		const { status, ctx } = this._processInputParams(input);
		const effect = this._def.effect || null;
		const checkCtx = {
			addIssue: (arg) => {
				addIssueToContext(ctx, arg);
				if (arg.fatal) status.abort();
				else status.dirty();
			},
			get path() {
				return ctx.path;
			}
		};
		checkCtx.addIssue = checkCtx.addIssue.bind(checkCtx);
		if (effect.type === "preprocess") {
			const processed = effect.transform(ctx.data, checkCtx);
			if (ctx.common.async) return Promise.resolve(processed).then(async (processed) => {
				if (status.value === "aborted") return INVALID;
				const result = await this._def.schema._parseAsync({
					data: processed,
					path: ctx.path,
					parent: ctx
				});
				if (result.status === "aborted") return INVALID;
				if (result.status === "dirty") return DIRTY(result.value);
				if (status.value === "dirty") return DIRTY(result.value);
				return result;
			});
			else {
				if (status.value === "aborted") return INVALID;
				const result = this._def.schema._parseSync({
					data: processed,
					path: ctx.path,
					parent: ctx
				});
				if (result.status === "aborted") return INVALID;
				if (result.status === "dirty") return DIRTY(result.value);
				if (status.value === "dirty") return DIRTY(result.value);
				return result;
			}
		}
		if (effect.type === "refinement") {
			const executeRefinement = (acc) => {
				const result = effect.refinement(acc, checkCtx);
				if (ctx.common.async) return Promise.resolve(result);
				if (result instanceof Promise) throw new Error("Async refinement encountered during synchronous parse operation. Use .parseAsync instead.");
				return acc;
			};
			if (ctx.common.async === false) {
				const inner = this._def.schema._parseSync({
					data: ctx.data,
					path: ctx.path,
					parent: ctx
				});
				if (inner.status === "aborted") return INVALID;
				if (inner.status === "dirty") status.dirty();
				executeRefinement(inner.value);
				return {
					status: status.value,
					value: inner.value
				};
			} else return this._def.schema._parseAsync({
				data: ctx.data,
				path: ctx.path,
				parent: ctx
			}).then((inner) => {
				if (inner.status === "aborted") return INVALID;
				if (inner.status === "dirty") status.dirty();
				return executeRefinement(inner.value).then(() => {
					return {
						status: status.value,
						value: inner.value
					};
				});
			});
		}
		if (effect.type === "transform") {
			if (ctx.common.async === false) {
				const base = this._def.schema._parseSync({
					data: ctx.data,
					path: ctx.path,
					parent: ctx
				});
				if (!isValid(base)) return INVALID;
				const result = effect.transform(base.value, checkCtx);
				if (result instanceof Promise) throw new Error(`Asynchronous transform encountered during synchronous parse operation. Use .parseAsync instead.`);
				return {
					status: status.value,
					value: result
				};
			} else return this._def.schema._parseAsync({
				data: ctx.data,
				path: ctx.path,
				parent: ctx
			}).then((base) => {
				if (!isValid(base)) return INVALID;
				return Promise.resolve(effect.transform(base.value, checkCtx)).then((result) => ({
					status: status.value,
					value: result
				}));
			});
		}
		util.assertNever(effect);
	}
};
ZodEffects.create = (schema, effect, params) => {
	return new ZodEffects({
		schema,
		typeName: ZodFirstPartyTypeKind.ZodEffects,
		effect,
		...processCreateParams(params)
	});
};
ZodEffects.createWithPreprocess = (preprocess, schema, params) => {
	return new ZodEffects({
		schema,
		effect: {
			type: "preprocess",
			transform: preprocess
		},
		typeName: ZodFirstPartyTypeKind.ZodEffects,
		...processCreateParams(params)
	});
};
var ZodOptional = class extends ZodType {
	_parse(input) {
		if (this._getType(input) === ZodParsedType.undefined) return OK(void 0);
		return this._def.innerType._parse(input);
	}
	unwrap() {
		return this._def.innerType;
	}
};
ZodOptional.create = (type, params) => {
	return new ZodOptional({
		innerType: type,
		typeName: ZodFirstPartyTypeKind.ZodOptional,
		...processCreateParams(params)
	});
};
var ZodNullable = class extends ZodType {
	_parse(input) {
		if (this._getType(input) === ZodParsedType.null) return OK(null);
		return this._def.innerType._parse(input);
	}
	unwrap() {
		return this._def.innerType;
	}
};
ZodNullable.create = (type, params) => {
	return new ZodNullable({
		innerType: type,
		typeName: ZodFirstPartyTypeKind.ZodNullable,
		...processCreateParams(params)
	});
};
var ZodDefault = class extends ZodType {
	_parse(input) {
		const { ctx } = this._processInputParams(input);
		let data = ctx.data;
		if (ctx.parsedType === ZodParsedType.undefined) data = this._def.defaultValue();
		return this._def.innerType._parse({
			data,
			path: ctx.path,
			parent: ctx
		});
	}
	removeDefault() {
		return this._def.innerType;
	}
};
ZodDefault.create = (type, params) => {
	return new ZodDefault({
		innerType: type,
		typeName: ZodFirstPartyTypeKind.ZodDefault,
		defaultValue: typeof params.default === "function" ? params.default : () => params.default,
		...processCreateParams(params)
	});
};
var ZodCatch = class extends ZodType {
	_parse(input) {
		const { ctx } = this._processInputParams(input);
		const newCtx = {
			...ctx,
			common: {
				...ctx.common,
				issues: []
			}
		};
		const result = this._def.innerType._parse({
			data: newCtx.data,
			path: newCtx.path,
			parent: { ...newCtx }
		});
		if (isAsync(result)) return result.then((result) => {
			return {
				status: "valid",
				value: result.status === "valid" ? result.value : this._def.catchValue({
					get error() {
						return new ZodError(newCtx.common.issues);
					},
					input: newCtx.data
				})
			};
		});
		else return {
			status: "valid",
			value: result.status === "valid" ? result.value : this._def.catchValue({
				get error() {
					return new ZodError(newCtx.common.issues);
				},
				input: newCtx.data
			})
		};
	}
	removeCatch() {
		return this._def.innerType;
	}
};
ZodCatch.create = (type, params) => {
	return new ZodCatch({
		innerType: type,
		typeName: ZodFirstPartyTypeKind.ZodCatch,
		catchValue: typeof params.catch === "function" ? params.catch : () => params.catch,
		...processCreateParams(params)
	});
};
var ZodNaN = class extends ZodType {
	_parse(input) {
		if (this._getType(input) !== ZodParsedType.nan) {
			const ctx = this._getOrReturnCtx(input);
			addIssueToContext(ctx, {
				code: ZodIssueCode.invalid_type,
				expected: ZodParsedType.nan,
				received: ctx.parsedType
			});
			return INVALID;
		}
		return {
			status: "valid",
			value: input.data
		};
	}
};
ZodNaN.create = (params) => {
	return new ZodNaN({
		typeName: ZodFirstPartyTypeKind.ZodNaN,
		...processCreateParams(params)
	});
};
var ZodBranded = class extends ZodType {
	_parse(input) {
		const { ctx } = this._processInputParams(input);
		const data = ctx.data;
		return this._def.type._parse({
			data,
			path: ctx.path,
			parent: ctx
		});
	}
	unwrap() {
		return this._def.type;
	}
};
var ZodPipeline = class ZodPipeline extends ZodType {
	_parse(input) {
		const { status, ctx } = this._processInputParams(input);
		if (ctx.common.async) {
			const handleAsync = async () => {
				const inResult = await this._def.in._parseAsync({
					data: ctx.data,
					path: ctx.path,
					parent: ctx
				});
				if (inResult.status === "aborted") return INVALID;
				if (inResult.status === "dirty") {
					status.dirty();
					return DIRTY(inResult.value);
				} else return this._def.out._parseAsync({
					data: inResult.value,
					path: ctx.path,
					parent: ctx
				});
			};
			return handleAsync();
		} else {
			const inResult = this._def.in._parseSync({
				data: ctx.data,
				path: ctx.path,
				parent: ctx
			});
			if (inResult.status === "aborted") return INVALID;
			if (inResult.status === "dirty") {
				status.dirty();
				return {
					status: "dirty",
					value: inResult.value
				};
			} else return this._def.out._parseSync({
				data: inResult.value,
				path: ctx.path,
				parent: ctx
			});
		}
	}
	static create(a, b) {
		return new ZodPipeline({
			in: a,
			out: b,
			typeName: ZodFirstPartyTypeKind.ZodPipeline
		});
	}
};
var ZodReadonly = class extends ZodType {
	_parse(input) {
		const result = this._def.innerType._parse(input);
		const freeze = (data) => {
			if (isValid(data)) data.value = Object.freeze(data.value);
			return data;
		};
		return isAsync(result) ? result.then((data) => freeze(data)) : freeze(result);
	}
	unwrap() {
		return this._def.innerType;
	}
};
ZodReadonly.create = (type, params) => {
	return new ZodReadonly({
		innerType: type,
		typeName: ZodFirstPartyTypeKind.ZodReadonly,
		...processCreateParams(params)
	});
};
ZodObject.lazycreate;
var ZodFirstPartyTypeKind;
(function(ZodFirstPartyTypeKind) {
	ZodFirstPartyTypeKind["ZodString"] = "ZodString";
	ZodFirstPartyTypeKind["ZodNumber"] = "ZodNumber";
	ZodFirstPartyTypeKind["ZodNaN"] = "ZodNaN";
	ZodFirstPartyTypeKind["ZodBigInt"] = "ZodBigInt";
	ZodFirstPartyTypeKind["ZodBoolean"] = "ZodBoolean";
	ZodFirstPartyTypeKind["ZodDate"] = "ZodDate";
	ZodFirstPartyTypeKind["ZodSymbol"] = "ZodSymbol";
	ZodFirstPartyTypeKind["ZodUndefined"] = "ZodUndefined";
	ZodFirstPartyTypeKind["ZodNull"] = "ZodNull";
	ZodFirstPartyTypeKind["ZodAny"] = "ZodAny";
	ZodFirstPartyTypeKind["ZodUnknown"] = "ZodUnknown";
	ZodFirstPartyTypeKind["ZodNever"] = "ZodNever";
	ZodFirstPartyTypeKind["ZodVoid"] = "ZodVoid";
	ZodFirstPartyTypeKind["ZodArray"] = "ZodArray";
	ZodFirstPartyTypeKind["ZodObject"] = "ZodObject";
	ZodFirstPartyTypeKind["ZodUnion"] = "ZodUnion";
	ZodFirstPartyTypeKind["ZodDiscriminatedUnion"] = "ZodDiscriminatedUnion";
	ZodFirstPartyTypeKind["ZodIntersection"] = "ZodIntersection";
	ZodFirstPartyTypeKind["ZodTuple"] = "ZodTuple";
	ZodFirstPartyTypeKind["ZodRecord"] = "ZodRecord";
	ZodFirstPartyTypeKind["ZodMap"] = "ZodMap";
	ZodFirstPartyTypeKind["ZodSet"] = "ZodSet";
	ZodFirstPartyTypeKind["ZodFunction"] = "ZodFunction";
	ZodFirstPartyTypeKind["ZodLazy"] = "ZodLazy";
	ZodFirstPartyTypeKind["ZodLiteral"] = "ZodLiteral";
	ZodFirstPartyTypeKind["ZodEnum"] = "ZodEnum";
	ZodFirstPartyTypeKind["ZodEffects"] = "ZodEffects";
	ZodFirstPartyTypeKind["ZodNativeEnum"] = "ZodNativeEnum";
	ZodFirstPartyTypeKind["ZodOptional"] = "ZodOptional";
	ZodFirstPartyTypeKind["ZodNullable"] = "ZodNullable";
	ZodFirstPartyTypeKind["ZodDefault"] = "ZodDefault";
	ZodFirstPartyTypeKind["ZodCatch"] = "ZodCatch";
	ZodFirstPartyTypeKind["ZodPromise"] = "ZodPromise";
	ZodFirstPartyTypeKind["ZodBranded"] = "ZodBranded";
	ZodFirstPartyTypeKind["ZodPipeline"] = "ZodPipeline";
	ZodFirstPartyTypeKind["ZodReadonly"] = "ZodReadonly";
})(ZodFirstPartyTypeKind || (ZodFirstPartyTypeKind = {}));
const stringType = ZodString.create;
const numberType = ZodNumber.create;
ZodNaN.create;
ZodBigInt.create;
const booleanType = ZodBoolean.create;
ZodDate.create;
ZodSymbol.create;
ZodUndefined.create;
ZodNull.create;
const anyType = ZodAny.create;
const unknownType = ZodUnknown.create;
ZodNever.create;
ZodVoid.create;
const arrayType = ZodArray.create;
const objectType = ZodObject.create;
ZodObject.strictCreate;
const unionType = ZodUnion.create;
ZodDiscriminatedUnion.create;
const intersectionType = ZodIntersection.create;
ZodTuple.create;
const recordType = ZodRecord.create;
ZodMap.create;
ZodSet.create;
ZodFunction.create;
const lazyType = ZodLazy.create;
const literalType = ZodLiteral.create;
const enumType = ZodEnum.create;
ZodNativeEnum.create;
ZodPromise.create;
ZodEffects.create;
ZodOptional.create;
ZodNullable.create;
ZodEffects.createWithPreprocess;
ZodPipeline.create;
const coerce = {
	string: ((arg) => ZodString.create({
		...arg,
		coerce: true
	})),
	number: ((arg) => ZodNumber.create({
		...arg,
		coerce: true
	})),
	boolean: ((arg) => ZodBoolean.create({
		...arg,
		coerce: true
	})),
	bigint: ((arg) => ZodBigInt.create({
		...arg,
		coerce: true
	})),
	date: ((arg) => ZodDate.create({
		...arg,
		coerce: true
	}))
};
/**
* Base class for all A2UI specific errors.
*
* Includes a machine-readable `code` for categorical handling and ensures
* proper stack trace capturing.
*
* @example
* ```ts
* throw new A2uiError('Failed to process payload', 'PROCESSING_ERROR');
* ```
*/
var A2uiError = class extends Error {
	/**
	* Initializes a new `A2uiError` instance.
	*
	* @param message Human-readable error description.
	* @param code Machine-readable error category code.
	*/
	constructor(message, code = "UNKNOWN_ERROR") {
		super(message);
		this.name = this.constructor.name;
		this.code = code;
		if (Error.captureStackTrace) Error.captureStackTrace(this, this.constructor);
	}
};
/**
* Error thrown when JSON validation fails or schema validation mismatches occur.
*/
var A2uiValidationError = class extends A2uiError {
	/**
	* Initializes a new `A2uiValidationError` instance.
	*
	* @param message Error description detailing the validation failure.
	* @param details Additional error context or Zod validation issues.
	* @param code Optional error category code.
	*/
	constructor(message, details, code = "VALIDATION_ERROR") {
		super(message, code);
		this.details = details;
	}
};
/**
* Error thrown during DataModel mutations (invalid paths, type mismatches).
*/
var A2uiDataError = class extends A2uiError {
	/**
	* Initializes a new `A2uiDataError` instance.
	*
	* @param message Error description.
	* @param path Target data model path where the mutation failed.
	*/
	constructor(message, path) {
		super(message, "DATA_ERROR");
		this.path = path;
	}
};
/**
* Error thrown during string interpolation and function evaluation.
*/
var A2uiExpressionError = class extends A2uiError {
	/**
	* Initializes a new `A2uiExpressionError` instance.
	*
	* @param message Error description.
	* @param expression Evaluated expression string.
	* @param details Additional error details.
	*/
	constructor(message, expression, details) {
		super(message, "EXPRESSION_ERROR");
		this.expression = expression;
		this.details = details;
	}
};
/**
* Error thrown for structural issues in the UI tree (missing surfaces, duplicate components).
*/
var A2uiStateError = class extends A2uiError {
	/**
	* Initializes a new `A2uiStateError` instance.
	*
	* @param message Error description.
	*/
	constructor(message) {
		super(message, "STATE_ERROR");
	}
};
/**
* Error thrown during catalog management, loading, or resolution.
*
* Raised when a catalog declares no protocol version, fails schema validation,
* or when a function call or component references an unresolvable catalog ID.
*/
var A2uiCatalogError = class extends A2uiError {
	/**
	* Initializes a new `A2uiCatalogError` instance.
	*
	* @param message Human-readable error description.
	* @param code Machine-readable error category code. Defaults to `'CATALOG_ERROR'`.
	*/
	constructor(message, code = "CATALOG_ERROR") {
		super(message, code);
	}
};
/**
* Error thrown when component tree integrity checks fail (duplicate IDs, dangling references, missing root).
*/
var A2uiIntegrityError = class extends A2uiValidationError {
	/**
	* Initializes a new `A2uiIntegrityError` instance.
	*
	* @param message Error description.
	* @param details Additional error details.
	* @param code Error category code. Defaults to 'INTEGRITY_ERROR'.
	*/
	constructor(message, details, code = "INTEGRITY_ERROR") {
		super(message, details, code);
		this.name = "A2uiIntegrityError";
	}
};
/**
* Error thrown when global or function call recursion depth limits are exceeded.
*/
var A2uiRecursionError = class extends A2uiValidationError {
	/**
	* Initializes a new `A2uiRecursionError` instance.
	*
	* @param message Error description.
	* @param details Additional error details.
	* @param code Error category code. Defaults to 'RECURSION_ERROR'.
	*/
	constructor(message, details, code = "RECURSION_ERROR") {
		super(message, details, code);
		this.name = "A2uiRecursionError";
	}
};
/**
* Standard error codes for A2UI RPC failures.
*/
var RpcErrorCode;
(function(RpcErrorCode) {
	/** Malformed, missing, or unsupported function call payload or name. */
	RpcErrorCode["INVALID_FUNCTION_CALL"] = "INVALID_FUNCTION_CALL";
	/** Runtime failure or unhandled exception during function execution. */
	RpcErrorCode["EXECUTION_ERROR"] = "EXECUTION_ERROR";
	/** Requested function that is not registered in any available catalog. */
	RpcErrorCode["UNKNOWN_FUNCTION"] = "UNKNOWN_FUNCTION";
	/** Unspecified or unrecognized error condition. */
	RpcErrorCode["UNKNOWN_ERROR"] = "UNKNOWN_ERROR";
	/** Remote function call that timed out before receiving a response. */
	RpcErrorCode["TIMEOUT"] = "TIMEOUT";
	/** Function call that was cancelled or aborted before completing. */
	RpcErrorCode["CANCELLED"] = "CANCELLED";
	/** RPC handler disposal while a function call was pending or initiated. */
	RpcErrorCode["DISPOSED"] = "DISPOSED";
	/** Duplicate function call identifier that is already pending. */
	RpcErrorCode["DUPLICATE"] = "DUPLICATE";
	/** Missing outbound message listener required to transmit agent function calls. */
	RpcErrorCode["NO_LISTENER"] = "NO_LISTENER";
})(RpcErrorCode || (RpcErrorCode = {}));
/**
* Error thrown when an A2UI RPC operation fails, times out, or is cancelled.
*/
var A2uiRpcError = class extends A2uiError {
	/**
	* Initializes a new `A2uiRpcError` instance.
	*
	* @param message Human-readable error description.
	* @param code Category code or string identifying the RPC error.
	* @param functionCallId Optional identifier of the failed function call.
	* @param details Optional structured error details.
	*/
	constructor(message, code = RpcErrorCode.UNKNOWN_ERROR, functionCallId, details) {
		const resolvedCode = code || RpcErrorCode.UNKNOWN_ERROR;
		super(`[${resolvedCode}] ${message}`, resolvedCode);
		this.functionCallId = functionCallId;
		this.details = details;
		this.name = "A2uiRpcError";
	}
};
/**
* Stamps the child-reference kind into the schema's zod metadata. Methods
* like `.describe()` and `.optional()` rebuild schemas from `_def`, so the
* flag survives them; the `REF:` description remains the wire-facing pointer
* the capabilities generator resolves into a `$ref`.
*/
function markChildRef(schema, ref) {
	schema._def.a2uiChildRef = ref;
	return schema;
}
/**
* Extracts the child reference kind associated with a Zod schema, if present.
*
* @param schema Zod schema to inspect.
* @returns The child reference kind or undefined if not marked.
*/
function childRefKindOf(schema) {
	return schema?._def?.a2uiChildRef;
}
/**
* The maximum number of arguments accepted in a single function call.
*
* Caps the work a single call can schedule, so an oversized `args` payload
* cannot exhaust memory by creating one reactive listener per key (CWE-400).
* Enforced by `DataContext.validateFunctionArgs` before any argument is
* resolved.
*/
const MAX_FUNCTION_CALL_ARGS = 1e3;
objectType({
	"component": stringType().describe("The type name of the component."),
	"id": lazyType(() => ComponentIdSchema$2).optional(),
	"weight": numberType().optional()
}).passthrough().describe("A generic A2UI component definition.");
/**
* @fileoverview Shared runtime types and helper schemas for A2UI rendering
* engines.
*
* Defines unversioned, internal types, schemas, and helper utilities consumed
* by shared runtime modules (such as GenericBinder, DataContext,
* ExpressionParser, and SchemaLoader).
*
* This module represents the runtime superset of the modern protocol lineage
* (v0.9 and above), aligned with the most recent dynamic value evaluation
* model. Version-isolated wire validation and catalog schemas are maintained
* separately in src/v<version>/ directories, e.g. src/v1_0/.
*/
const ComponentIdSchema$2 = markChildRef(stringType().describe("REF:common_types.json#/$defs/ComponentId|The unique identifier for a component, used for both definitions and references within the same surface."), "component-id");
const DataBindingSchema$2 = objectType({ "path": stringType().describe("A JSON Pointer path to a value in the data model.") }).describe("REF:common_types.json#/$defs/DataBinding");
const FunctionCallSchema$2 = objectType({
	"call": stringType().describe("The name of the function to call."),
	"args": recordType(stringType(), unknownType()).describe("Arguments passed to the function.").optional(),
	"returnType": enumType([
		"string",
		"number",
		"boolean",
		"array",
		"object",
		"any",
		"void"
	]).describe("The expected return type of the function call.").optional(),
	"catalogId": stringType().describe("The catalog ID for this function, overriding any surface-level default catalogId.").optional()
}).describe("REF:common_types.json#/$defs/FunctionCall|Invokes a named function, combining common function properties with the catalog function definition.");
const DynamicStringSchema$2 = unionType([
	stringType(),
	DataBindingSchema$2,
	FunctionCallSchema$2
]).describe("REF:common_types.json#/$defs/DynamicString|Represents a string");
const DynamicBooleanSchema$2 = unionType([
	booleanType(),
	DataBindingSchema$2,
	FunctionCallSchema$2
]).describe("REF:common_types.json#/$defs/DynamicBoolean|A boolean value that can be a literal, a path, or a function call returning a boolean.");
const AccessibilityAttributesSchema$2 = objectType({
	"label": DynamicStringSchema$2.optional(),
	"description": DynamicStringSchema$2.optional(),
	"live": enumType([
		"off",
		"polite",
		"assertive"
	]).default("off").describe("Controls screen reader announcements for dynamic updates (WAI-ARIA aria-live). 'polite' waits for user pause; 'assertive' interrupts immediately for alerts.").optional(),
	"hidden": DynamicBooleanSchema$2.optional()
}).describe("REF:common_types.json#/$defs/AccessibilityAttributes|Attributes to enhance accessibility when using assistive technologies like screen readers or model understanding.");
const ExtensionsSchema$1 = recordType(stringType(), unknownType()).superRefine((value, ctx) => {
	for (const key in value) if (!key.match(/^[\p{XID_Start}_][\p{XID_Continue}]*$/u)) ctx.addIssue({
		path: [key],
		code: ZodIssueCode.custom,
		message: `Invalid extension key "${key}": Keys MUST be Unicode identifiers (UAX #31).`
	});
}).describe("REF:#/$defs/Extensions|Optional extension metadata. Keys MUST be Unicode identifiers (UAX #31). Keys starting with 'a2ui_' are reserved for official extensions.");
objectType({
	"id": ComponentIdSchema$2,
	"accessibility": AccessibilityAttributesSchema$2.optional(),
	"catalogId": stringType().describe("The catalog ID for this component, overriding any surface-level default catalogId.").optional(),
	"metadata": objectType({ "extensions": ExtensionsSchema$1.optional() }).strict().describe("Optional component-level metadata for vendor extensions.").optional()
}).describe("REF:common_types.json#/$defs/ComponentCommon");
const ChildListSchema$2 = markChildRef(unionType([arrayType(ComponentIdSchema$2).describe("A static list of child component IDs."), objectType({
	"componentId": ComponentIdSchema$2,
	"path": stringType().describe("The path to the list of component property objects in the data model.")
}).describe("A template for generating a dynamic list of children.")]).describe("REF:common_types.json#/$defs/ChildList"), "child-list");
const DynamicValueSchema$2 = unionType([
	stringType(),
	numberType(),
	booleanType(),
	arrayType(unknownType()),
	DataBindingSchema$2,
	FunctionCallSchema$2,
	recordType(stringType(), unknownType()).refine((obj) => !obj || !("path" in obj) && !("call" in obj))
]).describe("REF:common_types.json#/$defs/DynamicValue|A value that can be a literal, a path, or a function call returning any type.");
const DynamicNumberSchema$2 = unionType([
	numberType(),
	DataBindingSchema$2,
	FunctionCallSchema$2
]).describe("REF:common_types.json#/$defs/DynamicNumber|Represents a value that can be either a literal number, a path to a number in the data model, or a function call returning a number.");
const DynamicStringListSchema$2 = unionType([
	arrayType(stringType()),
	DataBindingSchema$2,
	FunctionCallSchema$2
]).describe("REF:common_types.json#/$defs/DynamicStringList|Represents a value that can be either a literal array of strings, a path to a string array in the data model, or a function call returning a string array.");
const CheckRuleSchema$2 = objectType({
	"condition": unionType([
		DynamicBooleanSchema$2,
		DataBindingSchema$2,
		FunctionCallSchema$2
	]).describe("Path or function call evaluating to a structured validation result object."),
	"message": stringType().describe("Optional fallback error message.").optional()
}).describe("REF:common_types.json#/$defs/CheckRule|A single validation check rule applied to an input component. The condition function or path evaluates to a structured validation result object.");
const CheckableSchema$2 = objectType({ "checks": arrayType(CheckRuleSchema$2).describe("A list of checks to perform. These are function calls that must return a boolean indicating validity.").optional() }).describe("REF:common_types.json#/$defs/Checkable|Properties for components that support renderer-side checks.");
const ActionSchema$3 = unionType([
	objectType({ "event": objectType({
		"name": stringType().describe("The name of the action to be dispatched to the server."),
		"context": recordType(stringType(), unknownType()).describe("A JSON object containing the key-value pairs for the action context. Values can be literals or paths. Use literal values unless the value must be dynamically bound to the data model. Do NOT use paths for static IDs.").optional()
	}).strict().describe("The event to dispatch to the server.") }).strict().describe("Triggers a server-side event."),
	objectType({ "functionCall": FunctionCallSchema$2 }).strict().describe("Executes a local client-side function."),
	objectType({ "event": objectType({
		"name": stringType().describe("The name of the action to be dispatched to the agent."),
		"userMessage": DynamicStringSchema$2.optional(),
		"context": recordType(stringType(), unknownType()).describe("A JSON object containing the key-value pairs for the action context. Values can be literals or paths. Use literal values unless the value must be dynamically bound to the data model. Do NOT use paths for static IDs.").optional()
	}).strict().describe("The event to dispatch to the agent.") }).strict().describe("Triggers an agent-side event."),
	objectType({ "functionCall": FunctionCallSchema$2 }).strict().describe("Executes a renderer or agent-side function.")
]).describe("REF:common_types.json#/$defs/Action|Defines an interaction handler that can either trigger an agent-side event or execute a local renderer-side function.");
const CallIdSchema$1 = stringType().describe("REF:common_types.json#/$defs/CallId|The unique identifier for a function call.");
objectType({
	"call": stringType().describe("The name of the function to call."),
	"catalogId": stringType().describe("The catalog ID for this function, overriding any surface-level default catalogId.").optional()
}).describe("REF:common_types.json#/$defs/FunctionCommon|Baseline envelope properties common to all function calls. Function-specific argument schemas (\\'args\\') are defined individually by each function in the active catalog."), objectType({
	"call": literalType("@index"),
	"args": objectType({ "offset": DynamicNumberSchema$2.optional() }).strict().optional()
}).strict().describe("REF:common_types.json#/$defs/IndexSystemFunction|Returns the 0-based index of the current item when rendering a dynamic list from a template. This function MUST ONLY be available when evaluating template items within a list context."), objectType({
	"component": literalType("Surface").optional(),
	"child": literalType("root").optional()
}).strict().describe("REF:common_types.json#/$defs/Surface|The reserved canonical container component representing an A2UI surface. The Surface component is immutable and always has \\'child\\': \\'root\\'."), objectType({
	"functionCallId": CallIdSchema$1,
	"value": unknownType().describe("The return value of the function.").optional(),
	"error": objectType({
		"code": stringType(),
		"message": stringType()
	}).strict().describe("An error object indicating failure of the function execution.").optional()
}).strict().describe("REF:common_types.json#/$defs/FunctionResponse|The return response matching a callAgentFunction or callRendererFunction invocation.");
/**
* Official SemVer 2.0.0 regular expression from https://semver.org/,
* extended with optional leading 'v'/'V' and optional patch component for protocol compatibility.
*
* Capturing groups:
* 1: major (0|[1-9]\d*)
* 2: minor (0|[1-9]\d*)
* 3: patch (optional 0|[1-9]\d*)
* 4: prerelease (optional dot-separated identifiers)
* 5: buildmetadata (optional dot-separated identifiers)
*/
const SEMVER_REGEX = /^[vV]?(0|[1-9]\d*)\.(0|[1-9]\d*)(?:\.(0|[1-9]\d*))?(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/;
/**
* Normalizes a version string by stripping any leading 'v'/'V' and replacing underscores with dots in the core release segment.
*
* Preserves pre-release ('-') and build metadata ('+') suffixes intact.
*
* Examples:
*   'v1_0' -> '1.0'
*   'V1_0' -> '1.0'
*   'v0_9_1' -> '0.9.1'
*   '1_0_0-dev_release' -> '1.0.0-dev_release'
*
* @param version The raw version string to normalize.
* @return The normalized version string, or empty string if input is falsy.
*/
function normalizeVersionString(version) {
	if (!version || typeof version !== "string") return "";
	const text = version.trim().replace(/^[vV]/, "");
	const dashIdx = text.indexOf("-");
	const plusIdx = text.indexOf("+");
	let splitIdx = text.length;
	if (dashIdx !== -1 && plusIdx !== -1) splitIdx = Math.min(dashIdx, plusIdx);
	else if (dashIdx !== -1) splitIdx = dashIdx;
	else if (plusIdx !== -1) splitIdx = plusIdx;
	return `${text.slice(0, splitIdx).replace(/_/g, ".")}${text.slice(splitIdx)}`;
}
/**
* Parses a semantic version string according to SemVer 2.0.0.
*
* @param versionStr The version string to parse.
* @return A SemVer object if valid, or null if the string cannot be parsed.
*/
function parseSemVer(versionStr) {
	if (!versionStr || typeof versionStr !== "string") return null;
	const match = versionStr.trim().match(SEMVER_REGEX);
	if (!match) return null;
	return {
		major: parseInt(match[1], 10),
		minor: parseInt(match[2], 10),
		patch: match[3] !== void 0 ? parseInt(match[3], 10) : 0,
		prerelease: match[4] ? match[4].split(".") : [],
		build: match[5] ? match[5].split(".") : []
	};
}
/**
* Converts a string or partial SemVer object into a normalized SemVer representation.
*
* @param v The version string or object to convert.
* @return A SemVer object if valid, or null otherwise.
*/
function toSemVer(v) {
	if (!v) return null;
	if (typeof v === "object") {
		const obj = v;
		if (typeof obj.major !== "number" || !Number.isInteger(obj.major) || obj.major < 0 || typeof obj.minor === "number" && (!Number.isInteger(obj.minor) || obj.minor < 0) || typeof obj.patch === "number" && (!Number.isInteger(obj.patch) || obj.patch < 0)) return null;
		return {
			major: obj.major,
			minor: typeof obj.minor === "number" ? obj.minor : 0,
			patch: typeof obj.patch === "number" ? obj.patch : 0,
			prerelease: Array.isArray(obj.prerelease) ? obj.prerelease : [],
			build: Array.isArray(obj.build) ? obj.build : []
		};
	}
	return parseSemVer(normalizeVersionString(v));
}
/**
* Formats a semantic version into a canonical string representation.
*
* For standard versions with zero patch and no pre-release or build metadata,
* returns `${major}.${minor}` (e.g. '0.8', '0.9', '1.0').
* For versions with non-zero patch, pre-release identifiers, or build metadata,
* returns the full SemVer string (e.g. '0.9.1', '1.0.0-beta.1').
*
* @param version The version string or SemVer object to canonicalize.
* @return The canonical version string, or null if the input cannot be parsed.
*/
function toCanonicalVersion(version) {
	if (!version) return null;
	const parsed = toSemVer(version);
	if (!parsed) return null;
	if (parsed.patch === 0 && parsed.prerelease.length === 0 && parsed.build.length === 0) return `${parsed.major}.${parsed.minor}`;
	const pre = parsed.prerelease.length > 0 ? `-${parsed.prerelease.join(".")}` : "";
	const bld = parsed.build.length > 0 ? `+${parsed.build.join(".")}` : "";
	return `${parsed.major}.${parsed.minor}.${parsed.patch}${pre}${bld}`;
}
/**
* Compares two dot-separated pre-release identifiers per SemVer 2.0.0 Rule 11.4.
*
* @param idA First pre-release identifier.
* @param idB Second pre-release identifier.
* @return Negative number if idA < idB, 0 if equal, positive number if idA > idB.
*/
function comparePrereleaseId(idA, idB) {
	const isNumA = /^\d+$/.test(idA);
	const isNumB = /^\d+$/.test(idB);
	if (isNumA && isNumB) {
		if (idA.length !== idB.length) return idA.length - idB.length;
		if (idA < idB) return -1;
		if (idA > idB) return 1;
		return 0;
	}
	if (isNumA) return -1;
	if (isNumB) return 1;
	if (idA < idB) return -1;
	if (idA > idB) return 1;
	return 0;
}
/**
* Compares pre-release identifier lists per SemVer 2.0.0 Rules 11.3 and 11.4.
*
* @param preA First list of pre-release identifiers.
* @param preB Second list of pre-release identifiers.
* @return Negative number if preA < preB, 0 if equal, positive number if preA > preB.
*/
function comparePrereleaseLists(preA, preB) {
	if (preA.length === 0 && preB.length === 0) return 0;
	if (preA.length === 0) return 1;
	if (preB.length === 0) return -1;
	const minLen = Math.min(preA.length, preB.length);
	for (let i = 0; i < minLen; i++) {
		const diff = comparePrereleaseId(preA[i], preB[i]);
		if (diff !== 0) return diff;
	}
	return preA.length - preB.length;
}
/**
* Compares two semantic version strings or SemVer objects according to SemVer 2.0.0 precedence rules (Section 11).
*
* 1. Precedence is determined by comparing major, minor, and patch numerically.
* 2. When major, minor, and patch are equal, a pre-release version has lower precedence than a normal version (e.g. 1.0.0-alpha < 1.0.0).
* 3. Precedence for two pre-release versions is determined by comparing dot-separated identifiers from left to right.
* 4. Build metadata does NOT figure into precedence.
*
* @param a First version string or SemVer object.
* @param b Second version string or SemVer object.
* @return Negative number if a < b, 0 if a == b, positive number if a > b.
*/
function compareSemVer(a, b) {
	const versionA = toSemVer(a);
	const versionB = toSemVer(b);
	if (!versionA && !versionB) return 0;
	if (!versionA) return -1;
	if (!versionB) return 1;
	if (versionA.major !== versionB.major) return versionA.major - versionB.major;
	if (versionA.minor !== versionB.minor) return versionA.minor - versionB.minor;
	if (versionA.patch !== versionB.patch) return versionA.patch - versionB.patch;
	return comparePrereleaseLists(versionA.prerelease, versionB.prerelease);
}
/**
* Checks if a given version string is at least the target minimum version.
*
* @param version The version string to check (e.g. 'v1.0', 'v1.1', 'v2.0').
* @param minVersion The minimum version requirement (e.g. 'v1.0', '1.0.0').
* @return Whether version is at least minVersion.
*/
function isAtLeastVersion(version, minVersion) {
	if (!version) return false;
	const parsed = toSemVer(version);
	const minParsed = toSemVer(minVersion);
	if (!parsed || !minParsed) return false;
	return compareSemVer(parsed, minParsed) >= 0;
}
/**
* Identifiers permitted by the v1.0 specification, per UAX #31.
*
* The pattern matches `specification/v1_0/json/common_types.json`, which uses
* `XID_Start` and `XID_Continue` rather than the unprefixed `ID_Start` and
* `ID_Continue`. The two differ on a handful of code points that are not
* closed under NFKC, so the distinction is observable; `XID` is normative.
*
* Python reaches the same set through `str.isidentifier()`, whose definition is
* `XID_Start` plus `_` for the first code point and `XID_Continue` thereafter.
* Note that neither side rejects language keywords: `class` is a valid A2UI
* identifier in both SDKs.
*/
const UAX31_IDENTIFIER = /^[\p{XID_Start}_][\p{XID_Continue}]*$/u;
/**
* Checks whether a name is a valid A2UI identifier.
*
* A single leading `@` is permitted and ignored, accommodating the reserved
* system-function prefix such as `@index`. Only one is allowed, so `@@index` is
* rejected, as is a bare `@`.
*
* Mirrors `is_valid_uax31_identifier` in
* `python/a2ui_core/src/a2ui/core/catalog/catalog.py`.
*
* @param name Identifier to test.
* @returns Whether `name` satisfies UAX #31 after stripping one optional
*   leading `@`.
*/
function isValidUax31Identifier(name) {
	if (!name) return false;
	const testName = name.startsWith("@") ? name.slice(1) : name;
	return UAX31_IDENTIFIER.test(testName);
}
/**
* Asserts that an identifier satisfies UAX #31.
*
* Throws an {@link A2uiCatalogError} when the identifier is invalid.
*
* @param name Identifier to check.
* @param context Description of what the identifier names, used in the error message.
* @throws {A2uiCatalogError} If `name` is not a valid UAX #31 identifier.
*/
function assertUax31Identifier(name, context) {
	if (!isValidUax31Identifier(name)) throw new A2uiCatalogError(`Invalid UAX #31 ${context}`);
}
const COMMON_TYPE_SCHEMAS = {
	DynamicString: DynamicStringSchema$2,
	DynamicNumber: DynamicNumberSchema$2,
	DynamicBoolean: DynamicBooleanSchema$2,
	DynamicStringList: DynamicStringListSchema$2,
	DynamicValue: DynamicValueSchema$2,
	ComponentId: ComponentIdSchema$2,
	ChildList: ChildListSchema$2,
	Action: ActionSchema$3,
	CheckRule: CheckRuleSchema$2,
	Checkable: CheckableSchema$2,
	AccessibilityAttributes: AccessibilityAttributesSchema$2,
	DataBinding: DataBindingSchema$2,
	FunctionCall: FunctionCallSchema$2
};
/**
* Resolves a JSON Pointer within a root JSON document.
*
* Follows RFC 6901 pointer unescaping (~1 -> /, ~0 -> ~).
*
* @param rootDoc Root JSON document to resolve within.
* @param pointer RFC 6901 JSON pointer string.
* @returns The resolved document subtree, or undefined if not found.
*/
function resolveJsonPointer(rootDoc, pointer) {
	if (!pointer.startsWith("#/")) return void 0;
	const segments = pointer.slice(2).split("/").map((s) => s.replace(/~1/g, "/").replace(/~0/g, "~"));
	let curr = rootDoc;
	for (const seg of segments) if (curr && typeof curr === "object" && seg in curr) curr = curr[seg];
	else return;
	return typeof curr === "object" && curr !== null ? curr : void 0;
}
/**
* Resolves a standard protocol `$ref` to its corresponding common type schema.
*
* @param ref JSON Schema reference string.
* @returns The matching Zod schema, or undefined if not a known protocol definition.
*/
function resolveProtocolRef(ref) {
	const defName = ref.split(/#\/(?:\$defs|definitions)\//)[1];
	return defName ? COMMON_TYPE_SCHEMAS[defName] : void 0;
}
/**
* Converts an array of JSON Schema enum values to a Zod schema.
*
* @param values Allowed enum values.
* @returns Zod enum, literal, or union schema representing the allowed values.
*/
function convertEnumToZod(values) {
	if (values.length === 0) return unknownType();
	if (values.every((v) => typeof v === "string")) return enumType(values);
	if (values.length === 1) return literalType(values[0]);
	return unionType(values.map((v) => literalType(v)));
}
/**
* Serializes a value to canonical JSON with deterministically sorted object keys.
*
* Produces identical strings for semantically equivalent values regardless of
* object property insertion order.
*
* @param val Value to serialize.
* @returns Deterministic JSON string representation.
*/
function canonicalJsonStringify(val) {
	if (val === null || typeof val !== "object") return JSON.stringify(val);
	if (Array.isArray(val)) return `[${val.map(canonicalJsonStringify).join(",")}]`;
	return `{${Object.keys(val).sort().map((k) => `${JSON.stringify(k)}:${canonicalJsonStringify(val[k])}`).join(",")}}`;
}
/**
* Applies `not`, `default`, and `description` modifiers to a converted Zod schema.
*
* @param baseZod Base Zod schema before modifiers.
* @param propSchema Raw property schema definition.
* @param rootDoc Optional root schema document for resolving nested references.
* @param visitedPointers Set of JSON pointer references currently being resolved.
* @param defCache Cache of previously converted definition schemas.
* @returns The modified Zod schema.
*/
function finalizePropertyZod(baseZod, propSchema, rootDoc, visitedPointers, defCache) {
	let result = baseZod;
	if (propSchema.not && typeof propSchema.not === "object") {
		const notSchema = convertPropertyToZod(propSchema.not, rootDoc, new Set(visitedPointers), defCache);
		result = result.refine((val) => !notSchema.safeParse(val).success, { message: "Value matched prohibited \"not\" schema" });
	}
	if (propSchema.default !== void 0) result = result.default(propSchema.default);
	if (typeof propSchema.description === "string") result = result.describe(propSchema.description);
	return result;
}
/**
* Converts a JSON Schema `$ref` pointer into a Zod schema.
*
* Resolves standard protocol definitions from common types, as well as local
* `#/$defs/...` pointers within the root document. Handles recursive references
* using `z.lazy` and caches resolved schemas to break cycles.
*
* @param ref JSON Schema reference string.
* @param propSchema Property schema containing the reference.
* @param rootDoc Root schema document containing definition targets.
* @param visitedPointers Set of reference pointers currently on the resolution stack.
* @param defCache Cache mapping reference strings to resolved Zod schemas.
* @returns Converted Zod schema, or undefined if the reference cannot be resolved.
*/
function convertRefToZod(ref, propSchema, rootDoc, visitedPointers, defCache) {
	const resolvedProtocol = resolveProtocolRef(ref);
	if (resolvedProtocol) {
		const defName = ref.split(/#\/(?:\$defs|definitions)\//)[1];
		const desc = typeof propSchema.description === "string" ? `REF:common_types.json#/$defs/${defName}|${propSchema.description}` : resolvedProtocol.description;
		return desc ? resolvedProtocol.describe(desc) : resolvedProtocol;
	}
	if (rootDoc && ref.startsWith("#/")) {
		const localTarget = resolveJsonPointer(rootDoc, ref);
		if (!localTarget) return unknownType().superRefine((_val, ctx) => {
			ctx.addIssue({
				code: ZodIssueCode.custom,
				message: `Unresolvable schema reference: '${ref}'`
			});
		});
		if (visitedPointers.has(ref)) {
			let cached = defCache.get(ref);
			return lazyType(() => {
				if (!cached) {
					cached = defCache.get(ref) ?? convertPropertyToZod(localTarget, rootDoc, /* @__PURE__ */ new Set([ref]), defCache);
					defCache.set(ref, cached);
				}
				return cached;
			});
		}
		let zodType = defCache.get(ref);
		if (!zodType) {
			const nextVisited = new Set(visitedPointers);
			nextVisited.add(ref);
			zodType = convertPropertyToZod(localTarget, rootDoc, nextVisited, defCache);
			defCache.set(ref, zodType);
		}
		if (typeof propSchema.description === "string") zodType = zodType.describe(propSchema.description);
		return zodType;
	}
}
/**
* Converts `oneOf` or `anyOf` JSON Schema unions into a Zod schema.
*
* Enforces mutual exclusivity for `oneOf` unions by verifying that valid values
* match exactly one branch. Preserves metadata such as `default`, `description`,
* and dynamic string annotations for enum/DataBinding unions.
*
* @param propSchema Schema containing `oneOf` or `anyOf` branches.
* @param rootDoc Root schema document for resolving nested references.
* @param visitedPointers Set of reference pointers currently on the resolution stack.
* @param defCache Cache mapping reference strings to resolved Zod schemas.
* @returns Converted Zod union schema, or undefined if no valid branches exist.
*/
function convertUnionToZod(propSchema, rootDoc, visitedPointers, defCache) {
	const isOneOf = Array.isArray(propSchema.oneOf);
	const branches = (propSchema.oneOf || propSchema.anyOf).filter((b) => typeof b === "object" && b !== null);
	if (branches.length === 0) return void 0;
	const enumBranch = branches.find((b) => Array.isArray(b.enum));
	const hasBinding = branches.some((b) => typeof b.$ref === "string" && b.$ref.includes("DataBinding"));
	const zodBranches = branches.map((b) => convertPropertyToZod(b, rootDoc, new Set(visitedPointers), defCache));
	let unionZod;
	if (zodBranches.length === 1) unionZod = zodBranches[0];
	else {
		const baseUnion = unionType([
			zodBranches[0],
			zodBranches[1],
			...zodBranches.slice(2)
		]);
		unionZod = isOneOf ? anyType().superRefine((val, ctx) => {
			let matches = 0;
			for (const b of zodBranches) if (b.safeParse(val).success && ++matches > 1) {
				ctx.addIssue({
					code: ZodIssueCode.custom,
					message: "Value matched more than one schema in oneOf"
				});
				return;
			}
		}).pipe(baseUnion) : baseUnion;
	}
	if (propSchema.default !== void 0) unionZod = unionZod.default(propSchema.default);
	const desc = (typeof propSchema.description === "string" ? propSchema.description : void 0) || (enumBranch && hasBinding ? "REF:common_types.json#/$defs/DynamicString" : void 0);
	return desc ? unionZod.describe(desc) : unionZod;
}
/**
* Converts a JSON Schema property definition into a runtime Zod schema.
*
* Handles `$ref` pointers, unions (`oneOf`, `anyOf`), enums, const values,
* arrays with boundary constraints and uniqueness, strings with length and pattern
* validations, numbers with minimum/maximum/multipleOf bounds, booleans, and nested
* objects with property maps and additionalProperties constraints.
*
* @param propSchema Raw JSON Schema property definition.
* @param rootDoc Optional root schema document for resolving references.
* @param visitedPointers Set of reference pointers currently being resolved.
* @param defCache Cache of resolved definition schemas to handle recursion and avoid duplicate work.
* @returns Runtime Zod schema enforcing the declared JSON Schema constraints.
*/
function convertPropertyToZod(propSchema, rootDoc, visitedPointers = /* @__PURE__ */ new Set(), defCache = /* @__PURE__ */ new Map()) {
	if (!propSchema || typeof propSchema !== "object") return unknownType();
	if (propSchema.$ref && typeof propSchema.$ref === "string") {
		const resolvedRef = convertRefToZod(propSchema.$ref, propSchema, rootDoc, visitedPointers, defCache);
		if (resolvedRef) return resolvedRef;
	}
	if (Array.isArray(propSchema.oneOf) || Array.isArray(propSchema.anyOf)) {
		const resolvedUnion = convertUnionToZod(propSchema, rootDoc, visitedPointers, defCache);
		if (resolvedUnion) return resolvedUnion;
	}
	if (propSchema.const !== void 0) return finalizePropertyZod(literalType(propSchema.const), propSchema, rootDoc, visitedPointers, defCache);
	if (Array.isArray(propSchema.enum) && propSchema.enum.length > 0) return finalizePropertyZod(convertEnumToZod(propSchema.enum), propSchema, rootDoc, visitedPointers, defCache);
	if (propSchema.type === "array") {
		const itemSchema = propSchema.items && typeof propSchema.items === "object" ? convertPropertyToZod(propSchema.items, rootDoc, new Set(visitedPointers), defCache) : unknownType();
		let arr = arrayType(itemSchema);
		if (typeof propSchema.minItems === "number") arr = arr.min(propSchema.minItems);
		if (typeof propSchema.maxItems === "number") arr = arr.max(propSchema.maxItems);
		if (propSchema.uniqueItems === true) arr = arr.refine((items) => new Set(items.map(canonicalJsonStringify)).size === items.length, { message: "Array items must be unique" });
		return finalizePropertyZod(arr, propSchema, rootDoc, visitedPointers, defCache);
	}
	switch (propSchema.type) {
		case "string": {
			let s = stringType();
			if (typeof propSchema.minLength === "number") s = s.min(propSchema.minLength);
			if (typeof propSchema.maxLength === "number") s = s.max(propSchema.maxLength);
			if (typeof propSchema.pattern === "string") try {
				s = s.regex(new RegExp(propSchema.pattern, "u"));
			} catch {}
			return finalizePropertyZod(s, propSchema, rootDoc, visitedPointers, defCache);
		}
		case "integer":
		case "number": {
			let n = propSchema.type === "integer" ? numberType().int() : numberType();
			if (typeof propSchema.minimum === "number") n = n.min(propSchema.minimum);
			if (typeof propSchema.maximum === "number") n = n.max(propSchema.maximum);
			if (typeof propSchema.exclusiveMinimum === "number") n = n.gt(propSchema.exclusiveMinimum);
			if (typeof propSchema.exclusiveMaximum === "number") n = n.lt(propSchema.exclusiveMaximum);
			if (typeof propSchema.multipleOf === "number") n = n.multipleOf(propSchema.multipleOf);
			return finalizePropertyZod(n, propSchema, rootDoc, visitedPointers, defCache);
		}
		case "boolean": return finalizePropertyZod(booleanType(), propSchema, rootDoc, visitedPointers, defCache);
		case "object": {
			const props = propSchema.properties;
			let obj;
			if (typeof props === "object" && props !== null) {
				const required = Array.isArray(propSchema.required) ? new Set(propSchema.required.filter((r) => typeof r === "string")) : /* @__PURE__ */ new Set();
				const baseObj = objectType(convertPropertiesToShape(props, required, false, rootDoc, visitedPointers, defCache));
				obj = propSchema.additionalProperties === false || propSchema.unevaluatedProperties === false ? baseObj.strict() : baseObj.passthrough();
			} else obj = recordType(unknownType());
			return finalizePropertyZod(obj, propSchema, rootDoc, visitedPointers, defCache);
		}
		default: return finalizePropertyZod(unknownType(), propSchema, rootDoc, visitedPointers, defCache);
	}
}
/**
* Converts a dictionary of property definitions into a Zod raw shape map.
*
* Marks fields as optional unless present in `requiredSet`.
*
* @param properties Property name to property schema mapping.
* @param requiredSet Set of required property names.
* @param omitEnvelopeFields Whether to omit component envelope fields (`id`, `component`).
* @param rootDoc Optional root schema document for reference resolution.
* @param visitedPointers Set of reference pointers currently on the resolution stack.
* @param defCache Cache mapping reference strings to resolved Zod schemas.
* @returns Map of property names to Zod schemas representing the shape.
*/
function convertPropertiesToShape(properties, requiredSet, omitEnvelopeFields = false, rootDoc, visitedPointers, defCache = /* @__PURE__ */ new Map()) {
	const shape = {};
	for (const [propName, propSchema] of Object.entries(properties)) {
		if (omitEnvelopeFields && (propName === "component" || propName === "id")) continue;
		const zodField = convertPropertyToZod(typeof propSchema === "object" && propSchema !== null ? propSchema : {}, rootDoc, visitedPointers ? new Set(visitedPointers) : /* @__PURE__ */ new Set(), defCache);
		shape[propName] = requiredSet.has(propName) ? zodField : zodField.optional();
	}
	return shape;
}
/**
* Collects all property definitions and constraints from a component schema.
*
* Resolves local document `$defs` and canonical protocol `ComponentCommon` references.
*
* @param schema Component schema definition.
* @param rootDoc Root schema document containing definition targets.
* @param visitedPointers Set of reference pointers currently being resolved to prevent cycles.
* @returns Array of property schema definitions extracted from the schema and its `allOf` hierarchy.
*/
function collectComponentSubSchemas(schema, rootDoc, visitedPointers = /* @__PURE__ */ new Set()) {
	const result = [];
	if (!schema || typeof schema !== "object") return result;
	if (Array.isArray(schema.allOf)) for (const sub of schema.allOf) {
		if (!sub || typeof sub !== "object") continue;
		if (typeof sub.$ref === "string") {
			const ref = sub.$ref;
			if (ref.includes("common_types.json") && ref.includes("ComponentCommon")) result.push({ properties: { accessibility: AccessibilityAttributesSchema$2.optional() } });
			else if (ref.startsWith("#/")) {
				if (!visitedPointers.has(ref)) {
					visitedPointers.add(ref);
					const target = resolveJsonPointer(rootDoc, ref);
					if (target) result.push(...collectComponentSubSchemas(target, rootDoc, visitedPointers));
				}
			}
		} else result.push(...collectComponentSubSchemas(sub, rootDoc, visitedPointers));
	}
	if (schema.properties) result.push(schema);
	return result;
}
/**
* Converts a raw component JSON schema definition into a Zod object schema.
*
* Merges sub-schemas from `allOf` compositions, applies required fields, and
* respects `additionalProperties` and `unevaluatedProperties` constraints.
*
* @param rawSchema Raw component schema definition.
* @param rootDoc Root schema document for resolving references.
* @param omitEnvelopeFields Whether to omit envelope fields (`id`, `component`). Defaults to true.
* @param defCache Cache mapping reference strings to resolved Zod schemas.
* @returns Zod object schema validating component properties.
*/
function convertComponentJsonSchemaToZod(rawSchema, rootDoc, omitEnvelopeFields = true, defCache = /* @__PURE__ */ new Map()) {
	const shape = {};
	const schemasToMerge = collectComponentSubSchemas(rawSchema, rootDoc);
	const requiredSet = /* @__PURE__ */ new Set();
	for (const s of schemasToMerge) if (Array.isArray(s.required)) s.required.forEach((r) => {
		if (typeof r === "string") requiredSet.add(r);
	});
	for (const s of schemasToMerge) {
		const propShape = convertPropertiesToShape(s.properties || {}, requiredSet, omitEnvelopeFields, rootDoc, void 0, defCache);
		Object.assign(shape, propShape);
	}
	const obj = objectType(shape);
	return rawSchema.unevaluatedProperties === true || typeof rawSchema.unevaluatedProperties === "object" && rawSchema.unevaluatedProperties !== null || rawSchema.additionalProperties === true || typeof rawSchema.additionalProperties === "object" && rawSchema.additionalProperties !== null ? obj.passthrough() : obj.strict();
}
/**
* Converts a function argument JSON schema definition into a Zod object schema.
*
* Maps function argument schemas to object properties, requiring fields listed in
* `required` and applying strictness or passthrough based on `additionalProperties`.
*
* @param rawSchema Raw function arguments schema.
* @param rootDoc Optional root schema document for reference resolution.
* @param defCache Cache mapping reference strings to resolved Zod schemas.
* @returns Zod object schema validating function arguments.
*/
function convertFunctionArgsJsonSchemaToZod(rawSchema, rootDoc, defCache = /* @__PURE__ */ new Map()) {
	const requiredSet = new Set(Array.isArray(rawSchema.required) ? rawSchema.required.filter((r) => typeof r === "string") : []);
	const shape = convertPropertiesToShape(rawSchema.properties || {}, requiredSet, false, rootDoc, void 0, defCache);
	const obj = objectType(shape);
	return rawSchema.unevaluatedProperties === true || typeof rawSchema.unevaluatedProperties === "object" && rawSchema.unevaluatedProperties !== null || rawSchema.additionalProperties === true || typeof rawSchema.additionalProperties === "object" && rawSchema.additionalProperties !== null ? obj.passthrough() : obj.strict();
}
/**
* Parses raw catalog function definitions into typed FunctionApi objects.
*
* Validates UAX #31 identifier requirements when targeting protocol v1.0 or higher,
* filters against permitted function names, and converts parameter schemas to Zod validators.
*
* @param rawFunctions Raw function definitions from the catalog schema (array or dictionary).
* @param rootDoc Optional root schema document for reference resolution.
* @param permittedNames Optional set of allowed function names from `anyFunction.oneOf`.
* @param isAtLeastV10 Whether the catalog targets protocol v1.0 or higher.
* @returns Array of parsed FunctionApi objects.
* @throws {A2uiCatalogError} If a function or argument identifier fails UAX #31 validation in v1.0+.
*/
function parseFunctionDefinitions(rawFunctions, rootDoc, permittedNames, isAtLeastV10 = false) {
	const result = [];
	if (!rawFunctions) return result;
	const defCache = /* @__PURE__ */ new Map();
	/** Validates a function's own name and its declared argument names. */
	const assertFunctionIdentifiers = (name, args) => {
		if (!isAtLeastV10) return;
		assertUax31Identifier(name, `function identifier: '${name}'`);
		if (args && typeof args === "object") for (const argName of Object.keys(args)) assertUax31Identifier(argName, `argument identifier: '${argName}' in function '${name}'`);
	};
	if (Array.isArray(rawFunctions)) {
		for (const fn of rawFunctions) if (fn && typeof fn === "object" && typeof fn.name === "string") {
			assertFunctionIdentifiers(fn.name, fn.parameters);
			if (permittedNames && !permittedNames.has(fn.name)) continue;
			const paramSchema = fn.parameters && typeof fn.parameters === "object" ? convertFunctionArgsJsonSchemaToZod(fn.parameters, rootDoc, defCache) : recordType(unknownType());
			result.push({
				name: fn.name,
				description: typeof fn.description === "string" ? fn.description : void 0,
				returnType: typeof fn.returnType === "string" ? fn.returnType : "any",
				allowedCallers: fn.allowedCallers,
				requiresUserActivation: fn.requiresUserActivation,
				schema: paramSchema
			});
		}
		return result;
	}
	if (typeof rawFunctions === "object" && rawFunctions !== null) for (const [name, defn] of Object.entries(rawFunctions)) {
		const rawDefn = defn && typeof defn === "object" ? defn : {};
		assertFunctionIdentifiers(name, rawDefn.properties && typeof rawDefn.properties === "object" ? rawDefn.properties : rawDefn.parameters);
		if (permittedNames && !permittedNames.has(name)) continue;
		if (!defn || typeof defn !== "object") continue;
		const d = defn;
		const props = d.properties;
		let argsSchema = props?.args ?? d.args ?? d.parameters;
		if (!argsSchema && props && !("call" in props) && !("function" in props)) argsSchema = d;
		else if (argsSchema && typeof argsSchema === "object" && !("properties" in argsSchema) && !("type" in argsSchema)) argsSchema = {
			type: "object",
			properties: argsSchema,
			required: d.required,
			additionalProperties: d.additionalProperties
		};
		const paramSchema = argsSchema && typeof argsSchema === "object" ? convertFunctionArgsJsonSchemaToZod(argsSchema, rootDoc, defCache) : recordType(unknownType());
		const returnType = (typeof d.returnType === "string" ? d.returnType : void 0) ?? (typeof props?.returnType?.const === "string" ? (props?.returnType).const : "any");
		const allowedCallers = d.allowedCallers ?? props?.allowedCallers?.const;
		const requiresUserActivation = d.requiresUserActivation ?? props?.requiresUserActivation?.const;
		result.push({
			name,
			description: typeof d.description === "string" ? d.description : void 0,
			returnType,
			allowedCallers,
			requiresUserActivation,
			schema: paramSchema
		});
	}
	return result;
}
/**
* Extracts permitted definition names matching a reference prefix from a `oneOf` array.
*
* @param oneOf Array of reference schema objects from `anyComponent` or `anyFunction`.
* @param prefix Prefix to match and strip, such as `#/components/` or `#/functions/`.
* @returns Set of unescaped allowed names, or undefined if `oneOf` is not an array.
*/
function extractPermittedNames(oneOf, prefix) {
	if (!Array.isArray(oneOf)) return void 0;
	const permitted = /* @__PURE__ */ new Set();
	for (const item of oneOf) if (typeof item?.$ref === "string" && item.$ref.startsWith(prefix)) {
		const unescapedName = item.$ref.slice(prefix.length).replace(/~([01])/g, (_, p1) => p1 === "1" ? "/" : "~");
		permitted.add(unescapedName);
	}
	return permitted;
}
/**
* Parses raw catalog component schemas into typed ComponentApi definitions.
*
* Validates UAX #31 identifier requirements for v1.0+ specifications, filters
* components if permitted names are specified, and transforms JSON schemas into
* runtime Zod schemas.
*
* @param componentsMap Mapping of component name to raw component schema definition.
* @param catalogSchema Enclosing raw catalog schema for resolving local references.
* @param isAtLeastV10 Whether the catalog targets protocol v1.0 or higher.
* @param permittedNames Optional set of allowed component names from anyComponent.oneOf.
* @returns Array of parsed ComponentApi objects with validation schemas and hierarchy constraints.
* @throws {A2uiCatalogError} If a component or property identifier fails UAX #31 validation in v1.0+.
*/
function parseCatalogComponents(componentsMap, catalogSchema, isAtLeastV10, permittedNames) {
	const components = [];
	const defCache = /* @__PURE__ */ new Map();
	for (const [name, rawCompSchema] of Object.entries(componentsMap)) {
		const rawComp = rawCompSchema || {};
		if (isAtLeastV10) {
			assertUax31Identifier(name, `component identifier: '${name}'`);
			const props = rawComp.properties;
			if (props && typeof props === "object") for (const propName of Object.keys(props)) assertUax31Identifier(propName, `property identifier: '${propName}' in component '${name}'`);
		}
		if (permittedNames && !permittedNames.has(name)) continue;
		const zodSchema = convertComponentJsonSchemaToZod(rawComp, catalogSchema, true, defCache);
		components.push({
			name,
			schema: zodSchema,
			allowedParents: Array.isArray(rawComp.allowedParents) ? rawComp.allowedParents.filter((p) => typeof p === "string") : void 0,
			allowedChildren: Array.isArray(rawComp.allowedChildren) ? rawComp.allowedChildren.filter((c) => typeof c === "string") : void 0
		});
	}
	return components;
}
/**
* Extracts and compiles the theme schema from a catalog definition if present.
*
* Checks top-level theme, themeSchema, styles, and $defs.theme definitions.
*
* @param catalogSchema Raw catalog schema or capabilities definition object.
* @param defs Optional $defs mapping from the root schema.
* @returns Compiled Zod object schema for theme tokens, or undefined if not declared.
*/
function parseThemeSchema(catalogSchema, defs) {
	const rawTheme = catalogSchema.theme ?? catalogSchema.themeSchema ?? catalogSchema.styles ?? defs?.theme;
	if (rawTheme && typeof rawTheme === "object") return convertComponentJsonSchemaToZod(rawTheme, catalogSchema, false);
}
/**
* Loads a raw A2UI catalog schema into a typed Catalog instance.
*
* Parses component and function definitions, extracts hierarchy constraints (`allowedParents`,
* `allowedChildren`), unescapes RFC 6901 JSON pointers, and builds runtime Zod validators.
*
* @param catalogSchema Raw catalog schema or capabilities definition object.
* @param protocolVersion Protocol version to use when the schema does not declare
*   one. Catalog schemas published before v1.0 omit `protocolVersion`; when
*   neither the caller nor the schema supplies it, `DEFAULT_PROTOCOL_VERSION`
*   applies.
* @returns Fully-typed Catalog instance configured with components, functions, and metadata.
* @throws {Error} If the catalog ID is missing or not a string.
*/
function loadCatalogFromSchema(catalogSchema, protocolVersion) {
	const catalogId = catalogSchema.catalogId ?? catalogSchema.$id ?? catalogSchema.id;
	if (!catalogId || typeof catalogId !== "string") throw new Error("Catalog ID must be specified via catalog metadata ('catalogId' or '$id').");
	const defs = catalogSchema.$defs;
	const anyComp = defs?.anyComponent;
	const permittedNames = extractPermittedNames(anyComp?.oneOf, "#/components/");
	const resolvedVersion = protocolVersion ?? catalogSchema.protocolVersion ?? "0.9";
	const isAtLeastV10 = isAtLeastVersion(resolvedVersion, "1.0");
	const components = parseCatalogComponents(catalogSchema.components ?? {}, catalogSchema, isAtLeastV10, permittedNames);
	const anyFunc = defs?.anyFunction;
	const permittedFunctionNames = extractPermittedNames(anyFunc?.oneOf, "#/functions/");
	return new Catalog(catalogId, resolvedVersion, components, parseFunctionDefinitions(catalogSchema.functions, catalogSchema, permittedFunctionNames, isAtLeastV10), parseThemeSchema(catalogSchema, defs), typeof catalogSchema.instructions === "string" ? catalogSchema.instructions : void 0);
}
const ignoreOverride = Symbol("Let zodToJsonSchema decide on which parser to use");
const defaultOptions = {
	name: void 0,
	$refStrategy: "root",
	basePath: ["#"],
	effectStrategy: "input",
	pipeStrategy: "all",
	dateStrategy: "format:date-time",
	mapStrategy: "entries",
	removeAdditionalStrategy: "passthrough",
	allowedAdditionalProperties: true,
	rejectedAdditionalProperties: false,
	definitionPath: "definitions",
	target: "jsonSchema7",
	strictUnions: false,
	definitions: {},
	errorMessages: false,
	markdownDescription: false,
	patternStrategy: "escape",
	applyRegexFlags: false,
	emailStrategy: "format:email",
	base64Strategy: "contentEncoding:base64",
	nameStrategy: "ref",
	openAiAnyTypeName: "OpenAiAnyType"
};
const getDefaultOptions = (options) => typeof options === "string" ? {
	...defaultOptions,
	name: options
} : {
	...defaultOptions,
	...options
};
const getRefs = (options) => {
	const _options = getDefaultOptions(options);
	const currentPath = _options.name !== void 0 ? [
		..._options.basePath,
		_options.definitionPath,
		_options.name
	] : _options.basePath;
	return {
		..._options,
		flags: { hasReferencedOpenAiAnyType: false },
		currentPath,
		propertyPath: void 0,
		seen: new Map(Object.entries(_options.definitions).map(([name, def]) => [def._def, {
			def: def._def,
			path: [
				..._options.basePath,
				_options.definitionPath,
				name
			],
			jsonSchema: void 0
		}]))
	};
};
function addErrorMessage(res, key, errorMessage, refs) {
	if (!refs?.errorMessages) return;
	if (errorMessage) res.errorMessage = {
		...res.errorMessage,
		[key]: errorMessage
	};
}
function setResponseValueAndErrors(res, key, value, errorMessage, refs) {
	res[key] = value;
	addErrorMessage(res, key, errorMessage, refs);
}
const getRelativePath = (pathA, pathB) => {
	let i = 0;
	for (; i < pathA.length && i < pathB.length; i++) if (pathA[i] !== pathB[i]) break;
	return [(pathA.length - i).toString(), ...pathB.slice(i)].join("/");
};
function parseAnyDef(refs) {
	if (refs.target !== "openAi") return {};
	const anyDefinitionPath = [
		...refs.basePath,
		refs.definitionPath,
		refs.openAiAnyTypeName
	];
	refs.flags.hasReferencedOpenAiAnyType = true;
	return { $ref: refs.$refStrategy === "relative" ? getRelativePath(anyDefinitionPath, refs.currentPath) : anyDefinitionPath.join("/") };
}
function parseArrayDef(def, refs) {
	const res = { type: "array" };
	if (def.type?._def && def.type?._def?.typeName !== ZodFirstPartyTypeKind.ZodAny) res.items = parseDef(def.type._def, {
		...refs,
		currentPath: [...refs.currentPath, "items"]
	});
	if (def.minLength) setResponseValueAndErrors(res, "minItems", def.minLength.value, def.minLength.message, refs);
	if (def.maxLength) setResponseValueAndErrors(res, "maxItems", def.maxLength.value, def.maxLength.message, refs);
	if (def.exactLength) {
		setResponseValueAndErrors(res, "minItems", def.exactLength.value, def.exactLength.message, refs);
		setResponseValueAndErrors(res, "maxItems", def.exactLength.value, def.exactLength.message, refs);
	}
	return res;
}
function parseBigintDef(def, refs) {
	const res = {
		type: "integer",
		format: "int64"
	};
	if (!def.checks) return res;
	for (const check of def.checks) switch (check.kind) {
		case "min":
			if (refs.target === "jsonSchema7") {
				if (check.inclusive) setResponseValueAndErrors(res, "minimum", check.value, check.message, refs);
				else setResponseValueAndErrors(res, "exclusiveMinimum", check.value, check.message, refs);
			} else {
				if (!check.inclusive) res.exclusiveMinimum = true;
				setResponseValueAndErrors(res, "minimum", check.value, check.message, refs);
			}
			break;
		case "max":
			if (refs.target === "jsonSchema7") {
				if (check.inclusive) setResponseValueAndErrors(res, "maximum", check.value, check.message, refs);
				else setResponseValueAndErrors(res, "exclusiveMaximum", check.value, check.message, refs);
			} else {
				if (!check.inclusive) res.exclusiveMaximum = true;
				setResponseValueAndErrors(res, "maximum", check.value, check.message, refs);
			}
			break;
		case "multipleOf": setResponseValueAndErrors(res, "multipleOf", check.value, check.message, refs);
	}
	return res;
}
function parseBooleanDef() {
	return { type: "boolean" };
}
function parseBrandedDef(_def, refs) {
	return parseDef(_def.type._def, refs);
}
const parseCatchDef = (def, refs) => {
	return parseDef(def.innerType._def, refs);
};
function parseDateDef(def, refs, overrideDateStrategy) {
	const strategy = overrideDateStrategy ?? refs.dateStrategy;
	if (Array.isArray(strategy)) return { anyOf: strategy.map((item, i) => parseDateDef(def, refs, item)) };
	switch (strategy) {
		case "string":
		case "format:date-time": return {
			type: "string",
			format: "date-time"
		};
		case "format:date": return {
			type: "string",
			format: "date"
		};
		case "integer": return integerDateParser(def, refs);
	}
}
const integerDateParser = (def, refs) => {
	const res = {
		type: "integer",
		format: "unix-time"
	};
	if (refs.target === "openApi3") return res;
	for (const check of def.checks) switch (check.kind) {
		case "min":
			setResponseValueAndErrors(res, "minimum", check.value, check.message, refs);
			break;
		case "max": setResponseValueAndErrors(res, "maximum", check.value, check.message, refs);
	}
	return res;
};
function parseDefaultDef(_def, refs) {
	return {
		...parseDef(_def.innerType._def, refs),
		default: _def.defaultValue()
	};
}
function parseEffectsDef(_def, refs) {
	return refs.effectStrategy === "input" ? parseDef(_def.schema._def, refs) : parseAnyDef(refs);
}
function parseEnumDef(def) {
	return {
		type: "string",
		enum: Array.from(def.values)
	};
}
const isJsonSchema7AllOfType = (type) => {
	if ("type" in type && type.type === "string") return false;
	return "allOf" in type;
};
function parseIntersectionDef(def, refs) {
	const allOf = [parseDef(def.left._def, {
		...refs,
		currentPath: [
			...refs.currentPath,
			"allOf",
			"0"
		]
	}), parseDef(def.right._def, {
		...refs,
		currentPath: [
			...refs.currentPath,
			"allOf",
			"1"
		]
	})].filter((x) => !!x);
	let unevaluatedProperties = refs.target === "jsonSchema2019-09" ? { unevaluatedProperties: false } : void 0;
	const mergedAllOf = [];
	allOf.forEach((schema) => {
		if (isJsonSchema7AllOfType(schema)) {
			mergedAllOf.push(...schema.allOf);
			if (schema.unevaluatedProperties === void 0) unevaluatedProperties = void 0;
		} else {
			let nestedSchema = schema;
			if ("additionalProperties" in schema && schema.additionalProperties === false) {
				const { additionalProperties, ...rest } = schema;
				nestedSchema = rest;
			} else unevaluatedProperties = void 0;
			mergedAllOf.push(nestedSchema);
		}
	});
	return mergedAllOf.length ? {
		allOf: mergedAllOf,
		...unevaluatedProperties
	} : void 0;
}
function parseLiteralDef(def, refs) {
	const parsedType = typeof def.value;
	if (parsedType !== "bigint" && parsedType !== "number" && parsedType !== "boolean" && parsedType !== "string") return { type: Array.isArray(def.value) ? "array" : "object" };
	if (refs.target === "openApi3") return {
		type: parsedType === "bigint" ? "integer" : parsedType,
		enum: [def.value]
	};
	return {
		type: parsedType === "bigint" ? "integer" : parsedType,
		const: def.value
	};
}
let emojiRegex = void 0;
/**
* Generated from the regular expressions found here as of 2024-05-22:
* https://github.com/colinhacks/zod/blob/master/src/types.ts.
*
* Expressions with /i flag have been changed accordingly.
*/
const zodPatterns = {
	/**
	* `c` was changed to `[cC]` to replicate /i flag
	*/
	cuid: /^[cC][^\s-]{8,}$/,
	cuid2: /^[0-9a-z]+$/,
	ulid: /^[0-9A-HJKMNP-TV-Z]{26}$/,
	/**
	* `a-z` was added to replicate /i flag
	*/
	email: /^(?!\.)(?!.*\.\.)([a-zA-Z0-9_'+\-\.]*)[a-zA-Z0-9_+-]@([a-zA-Z0-9][a-zA-Z0-9\-]*\.)+[a-zA-Z]{2,}$/,
	/**
	* Constructed a valid Unicode RegExp
	*
	* Lazily instantiate since this type of regex isn't supported
	* in all envs (e.g. React Native).
	*
	* See:
	* https://github.com/colinhacks/zod/issues/2433
	* Fix in Zod:
	* https://github.com/colinhacks/zod/commit/9340fd51e48576a75adc919bff65dbc4a5d4c99b
	*/
	emoji: () => {
		if (emojiRegex === void 0) emojiRegex = RegExp("^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$", "u");
		return emojiRegex;
	},
	/**
	* Unused
	*/
	uuid: /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/,
	/**
	* Unused
	*/
	ipv4: /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/,
	ipv4Cidr: /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/(3[0-2]|[12]?[0-9])$/,
	/**
	* Unused
	*/
	ipv6: /^(([a-f0-9]{1,4}:){7}|::([a-f0-9]{1,4}:){0,6}|([a-f0-9]{1,4}:){1}:([a-f0-9]{1,4}:){0,5}|([a-f0-9]{1,4}:){2}:([a-f0-9]{1,4}:){0,4}|([a-f0-9]{1,4}:){3}:([a-f0-9]{1,4}:){0,3}|([a-f0-9]{1,4}:){4}:([a-f0-9]{1,4}:){0,2}|([a-f0-9]{1,4}:){5}:([a-f0-9]{1,4}:){0,1})([a-f0-9]{1,4}|(((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2}))\.){3}((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2})))$/,
	ipv6Cidr: /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/,
	base64: /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/,
	base64url: /^([0-9a-zA-Z-_]{4})*(([0-9a-zA-Z-_]{2}(==)?)|([0-9a-zA-Z-_]{3}(=)?))?$/,
	nanoid: /^[a-zA-Z0-9_-]{21}$/,
	jwt: /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/
};
function parseStringDef(def, refs) {
	const res = { type: "string" };
	if (def.checks) for (const check of def.checks) switch (check.kind) {
		case "min":
			setResponseValueAndErrors(res, "minLength", typeof res.minLength === "number" ? Math.max(res.minLength, check.value) : check.value, check.message, refs);
			break;
		case "max":
			setResponseValueAndErrors(res, "maxLength", typeof res.maxLength === "number" ? Math.min(res.maxLength, check.value) : check.value, check.message, refs);
			break;
		case "email":
			switch (refs.emailStrategy) {
				case "format:email":
					addFormat(res, "email", check.message, refs);
					break;
				case "format:idn-email":
					addFormat(res, "idn-email", check.message, refs);
					break;
				case "pattern:zod": addPattern(res, zodPatterns.email, check.message, refs);
			}
			break;
		case "url":
			addFormat(res, "uri", check.message, refs);
			break;
		case "uuid":
			addFormat(res, "uuid", check.message, refs);
			break;
		case "regex":
			addPattern(res, check.regex, check.message, refs);
			break;
		case "cuid":
			addPattern(res, zodPatterns.cuid, check.message, refs);
			break;
		case "cuid2":
			addPattern(res, zodPatterns.cuid2, check.message, refs);
			break;
		case "startsWith":
			addPattern(res, RegExp(`^${escapeLiteralCheckValue(check.value, refs)}`), check.message, refs);
			break;
		case "endsWith":
			addPattern(res, RegExp(`${escapeLiteralCheckValue(check.value, refs)}$`), check.message, refs);
			break;
		case "datetime":
			addFormat(res, "date-time", check.message, refs);
			break;
		case "date":
			addFormat(res, "date", check.message, refs);
			break;
		case "time":
			addFormat(res, "time", check.message, refs);
			break;
		case "duration":
			addFormat(res, "duration", check.message, refs);
			break;
		case "length":
			setResponseValueAndErrors(res, "minLength", typeof res.minLength === "number" ? Math.max(res.minLength, check.value) : check.value, check.message, refs);
			setResponseValueAndErrors(res, "maxLength", typeof res.maxLength === "number" ? Math.min(res.maxLength, check.value) : check.value, check.message, refs);
			break;
		case "includes":
			addPattern(res, RegExp(escapeLiteralCheckValue(check.value, refs)), check.message, refs);
			break;
		case "ip":
			if (check.version !== "v6") addFormat(res, "ipv4", check.message, refs);
			if (check.version !== "v4") addFormat(res, "ipv6", check.message, refs);
			break;
		case "base64url":
			addPattern(res, zodPatterns.base64url, check.message, refs);
			break;
		case "jwt":
			addPattern(res, zodPatterns.jwt, check.message, refs);
			break;
		case "cidr":
			if (check.version !== "v6") addPattern(res, zodPatterns.ipv4Cidr, check.message, refs);
			if (check.version !== "v4") addPattern(res, zodPatterns.ipv6Cidr, check.message, refs);
			break;
		case "emoji":
			addPattern(res, zodPatterns.emoji(), check.message, refs);
			break;
		case "ulid":
			addPattern(res, zodPatterns.ulid, check.message, refs);
			break;
		case "base64":
			switch (refs.base64Strategy) {
				case "format:binary":
					addFormat(res, "binary", check.message, refs);
					break;
				case "contentEncoding:base64":
					setResponseValueAndErrors(res, "contentEncoding", "base64", check.message, refs);
					break;
				case "pattern:zod": addPattern(res, zodPatterns.base64, check.message, refs);
			}
			break;
		case "nanoid": addPattern(res, zodPatterns.nanoid, check.message, refs);
	}
	return res;
}
function escapeLiteralCheckValue(literal, refs) {
	return refs.patternStrategy === "escape" ? escapeNonAlphaNumeric(literal) : literal;
}
const ALPHA_NUMERIC = /* @__PURE__ */ new Set("ABCDEFGHIJKLMNOPQRSTUVXYZabcdefghijklmnopqrstuvxyz0123456789");
function escapeNonAlphaNumeric(source) {
	let result = "";
	for (let i = 0; i < source.length; i++) {
		if (!ALPHA_NUMERIC.has(source[i])) result += "\\";
		result += source[i];
	}
	return result;
}
function addFormat(schema, value, message, refs) {
	if (schema.format || schema.anyOf?.some((x) => x.format)) {
		if (!schema.anyOf) schema.anyOf = [];
		if (schema.format) {
			schema.anyOf.push({
				format: schema.format,
				...schema.errorMessage && refs.errorMessages && { errorMessage: { format: schema.errorMessage.format } }
			});
			delete schema.format;
			if (schema.errorMessage) {
				delete schema.errorMessage.format;
				if (Object.keys(schema.errorMessage).length === 0) delete schema.errorMessage;
			}
		}
		schema.anyOf.push({
			format: value,
			...message && refs.errorMessages && { errorMessage: { format: message } }
		});
	} else setResponseValueAndErrors(schema, "format", value, message, refs);
}
function addPattern(schema, regex, message, refs) {
	if (schema.pattern || schema.allOf?.some((x) => x.pattern)) {
		if (!schema.allOf) schema.allOf = [];
		if (schema.pattern) {
			schema.allOf.push({
				pattern: schema.pattern,
				...schema.errorMessage && refs.errorMessages && { errorMessage: { pattern: schema.errorMessage.pattern } }
			});
			delete schema.pattern;
			if (schema.errorMessage) {
				delete schema.errorMessage.pattern;
				if (Object.keys(schema.errorMessage).length === 0) delete schema.errorMessage;
			}
		}
		schema.allOf.push({
			pattern: stringifyRegExpWithFlags(regex, refs),
			...message && refs.errorMessages && { errorMessage: { pattern: message } }
		});
	} else setResponseValueAndErrors(schema, "pattern", stringifyRegExpWithFlags(regex, refs), message, refs);
}
function stringifyRegExpWithFlags(regex, refs) {
	if (!refs.applyRegexFlags || !regex.flags) return regex.source;
	const flags = {
		i: regex.flags.includes("i"),
		m: regex.flags.includes("m"),
		s: regex.flags.includes("s")
	};
	const source = flags.i ? regex.source.toLowerCase() : regex.source;
	let pattern = "";
	let isEscaped = false;
	let inCharGroup = false;
	let inCharRange = false;
	for (let i = 0; i < source.length; i++) {
		if (isEscaped) {
			pattern += source[i];
			isEscaped = false;
			continue;
		}
		if (flags.i) {
			if (inCharGroup) {
				if (source[i].match(/[a-z]/)) {
					if (inCharRange) {
						pattern += source[i];
						pattern += `${source[i - 2]}-${source[i]}`.toUpperCase();
						inCharRange = false;
					} else if (source[i + 1] === "-" && source[i + 2]?.match(/[a-z]/)) {
						pattern += source[i];
						inCharRange = true;
					} else pattern += `${source[i]}${source[i].toUpperCase()}`;
					continue;
				}
			} else if (source[i].match(/[a-z]/)) {
				pattern += `[${source[i]}${source[i].toUpperCase()}]`;
				continue;
			}
		}
		if (flags.m) {
			if (source[i] === "^") {
				pattern += `(^|(?<=[\r\n]))`;
				continue;
			} else if (source[i] === "$") {
				pattern += `($|(?=[\r\n]))`;
				continue;
			}
		}
		if (flags.s && source[i] === ".") {
			pattern += inCharGroup ? `${source[i]}\r\n` : `[${source[i]}\r\n]`;
			continue;
		}
		pattern += source[i];
		if (source[i] === "\\") isEscaped = true;
		else if (inCharGroup && source[i] === "]") inCharGroup = false;
		else if (!inCharGroup && source[i] === "[") inCharGroup = true;
	}
	try {
		new RegExp(pattern);
	} catch {
		console.warn(`Could not convert regex pattern at ${refs.currentPath.join("/")} to a flag-independent form! Falling back to the flag-ignorant source`);
		return regex.source;
	}
	return pattern;
}
function parseRecordDef(def, refs) {
	if (refs.target === "openAi") console.warn("Warning: OpenAI may not support records in schemas! Try an array of key-value pairs instead.");
	if (refs.target === "openApi3" && def.keyType?._def.typeName === ZodFirstPartyTypeKind.ZodEnum) return {
		type: "object",
		required: def.keyType._def.values,
		properties: def.keyType._def.values.reduce((acc, key) => ({
			...acc,
			[key]: parseDef(def.valueType._def, {
				...refs,
				currentPath: [
					...refs.currentPath,
					"properties",
					key
				]
			}) ?? parseAnyDef(refs)
		}), {}),
		additionalProperties: refs.rejectedAdditionalProperties
	};
	const schema = {
		type: "object",
		additionalProperties: parseDef(def.valueType._def, {
			...refs,
			currentPath: [...refs.currentPath, "additionalProperties"]
		}) ?? refs.allowedAdditionalProperties
	};
	if (refs.target === "openApi3") return schema;
	if (def.keyType?._def.typeName === ZodFirstPartyTypeKind.ZodString && def.keyType._def.checks?.length) {
		const { type, ...keyType } = parseStringDef(def.keyType._def, refs);
		return {
			...schema,
			propertyNames: keyType
		};
	} else if (def.keyType?._def.typeName === ZodFirstPartyTypeKind.ZodEnum) return {
		...schema,
		propertyNames: { enum: def.keyType._def.values }
	};
	else if (def.keyType?._def.typeName === ZodFirstPartyTypeKind.ZodBranded && def.keyType._def.type._def.typeName === ZodFirstPartyTypeKind.ZodString && def.keyType._def.type._def.checks?.length) {
		const { type, ...keyType } = parseBrandedDef(def.keyType._def, refs);
		return {
			...schema,
			propertyNames: keyType
		};
	}
	return schema;
}
function parseMapDef(def, refs) {
	if (refs.mapStrategy === "record") return parseRecordDef(def, refs);
	return {
		type: "array",
		maxItems: 125,
		items: {
			type: "array",
			items: [parseDef(def.keyType._def, {
				...refs,
				currentPath: [
					...refs.currentPath,
					"items",
					"items",
					"0"
				]
			}) || parseAnyDef(refs), parseDef(def.valueType._def, {
				...refs,
				currentPath: [
					...refs.currentPath,
					"items",
					"items",
					"1"
				]
			}) || parseAnyDef(refs)],
			minItems: 2,
			maxItems: 2
		}
	};
}
function parseNativeEnumDef(def) {
	const object = def.values;
	const actualValues = Object.keys(def.values).filter((key) => {
		return typeof object[object[key]] !== "number";
	}).map((key) => object[key]);
	const parsedTypes = Array.from(new Set(actualValues.map((values) => typeof values)));
	return {
		type: parsedTypes.length === 1 ? parsedTypes[0] === "string" ? "string" : "number" : ["string", "number"],
		enum: actualValues
	};
}
function parseNeverDef(refs) {
	return refs.target === "openAi" ? void 0 : { not: parseAnyDef({
		...refs,
		currentPath: [...refs.currentPath, "not"]
	}) };
}
function parseNullDef(refs) {
	return refs.target === "openApi3" ? {
		enum: ["null"],
		nullable: true
	} : { type: "null" };
}
const primitiveMappings = {
	ZodString: "string",
	ZodNumber: "number",
	ZodBigInt: "integer",
	ZodBoolean: "boolean",
	ZodNull: "null"
};
function parseUnionDef(def, refs) {
	if (refs.target === "openApi3") return asAnyOf(def, refs);
	const options = def.options instanceof Map ? Array.from(def.options.values()) : def.options;
	if (options.every((x) => x._def.typeName in primitiveMappings && (!x._def.checks || !x._def.checks.length))) {
		const types = options.reduce((types, x) => {
			const type = primitiveMappings[x._def.typeName];
			return type && !types.includes(type) ? [...types, type] : types;
		}, []);
		return { type: types.length > 1 ? types : types[0] };
	} else if (options.every((x) => x._def.typeName === "ZodLiteral" && !x.description)) {
		const types = options.reduce((acc, x) => {
			const type = typeof x._def.value;
			switch (type) {
				case "string":
				case "number":
				case "boolean": return [...acc, type];
				case "bigint": return [...acc, "integer"];
				case "object": if (x._def.value === null) return [...acc, "null"];
				default: return acc;
			}
		}, []);
		if (types.length === options.length) {
			const uniqueTypes = types.filter((x, i, a) => a.indexOf(x) === i);
			return {
				type: uniqueTypes.length > 1 ? uniqueTypes : uniqueTypes[0],
				enum: options.reduce((acc, x) => {
					return acc.includes(x._def.value) ? acc : [...acc, x._def.value];
				}, [])
			};
		}
	} else if (options.every((x) => x._def.typeName === "ZodEnum")) return {
		type: "string",
		enum: options.reduce((acc, x) => [...acc, ...x._def.values.filter((x) => !acc.includes(x))], [])
	};
	return asAnyOf(def, refs);
}
const asAnyOf = (def, refs) => {
	const anyOf = (def.options instanceof Map ? Array.from(def.options.values()) : def.options).map((x, i) => parseDef(x._def, {
		...refs,
		currentPath: [
			...refs.currentPath,
			"anyOf",
			`${i}`
		]
	})).filter((x) => !!x && (!refs.strictUnions || typeof x === "object" && Object.keys(x).length > 0));
	return anyOf.length ? { anyOf } : void 0;
};
function parseNullableDef(def, refs) {
	if ([
		"ZodString",
		"ZodNumber",
		"ZodBigInt",
		"ZodBoolean",
		"ZodNull"
	].includes(def.innerType._def.typeName) && (!def.innerType._def.checks || !def.innerType._def.checks.length)) {
		if (refs.target === "openApi3") return {
			type: primitiveMappings[def.innerType._def.typeName],
			nullable: true
		};
		return { type: [primitiveMappings[def.innerType._def.typeName], "null"] };
	}
	if (refs.target === "openApi3") {
		const base = parseDef(def.innerType._def, {
			...refs,
			currentPath: [...refs.currentPath]
		});
		if (base && "$ref" in base) return {
			allOf: [base],
			nullable: true
		};
		return base && {
			...base,
			nullable: true
		};
	}
	const base = parseDef(def.innerType._def, {
		...refs,
		currentPath: [
			...refs.currentPath,
			"anyOf",
			"0"
		]
	});
	return base && { anyOf: [base, { type: "null" }] };
}
function parseNumberDef(def, refs) {
	const res = { type: "number" };
	if (!def.checks) return res;
	for (const check of def.checks) switch (check.kind) {
		case "int":
			res.type = "integer";
			addErrorMessage(res, "type", check.message, refs);
			break;
		case "min":
			if (refs.target === "jsonSchema7") {
				if (check.inclusive) setResponseValueAndErrors(res, "minimum", check.value, check.message, refs);
				else setResponseValueAndErrors(res, "exclusiveMinimum", check.value, check.message, refs);
			} else {
				if (!check.inclusive) res.exclusiveMinimum = true;
				setResponseValueAndErrors(res, "minimum", check.value, check.message, refs);
			}
			break;
		case "max":
			if (refs.target === "jsonSchema7") {
				if (check.inclusive) setResponseValueAndErrors(res, "maximum", check.value, check.message, refs);
				else setResponseValueAndErrors(res, "exclusiveMaximum", check.value, check.message, refs);
			} else {
				if (!check.inclusive) res.exclusiveMaximum = true;
				setResponseValueAndErrors(res, "maximum", check.value, check.message, refs);
			}
			break;
		case "multipleOf": setResponseValueAndErrors(res, "multipleOf", check.value, check.message, refs);
	}
	return res;
}
function parseObjectDef(def, refs) {
	const forceOptionalIntoNullable = refs.target === "openAi";
	const result = {
		type: "object",
		properties: {}
	};
	const required = [];
	const shape = def.shape();
	for (const propName in shape) {
		let propDef = shape[propName];
		if (propDef === void 0 || propDef._def === void 0) continue;
		let propOptional = safeIsOptional(propDef);
		if (propOptional && forceOptionalIntoNullable) {
			if (propDef._def.typeName === "ZodOptional") propDef = propDef._def.innerType;
			if (!propDef.isNullable()) propDef = propDef.nullable();
			propOptional = false;
		}
		const parsedDef = parseDef(propDef._def, {
			...refs,
			currentPath: [
				...refs.currentPath,
				"properties",
				propName
			],
			propertyPath: [
				...refs.currentPath,
				"properties",
				propName
			]
		});
		if (parsedDef === void 0) continue;
		result.properties[propName] = parsedDef;
		if (!propOptional) required.push(propName);
	}
	if (required.length) result.required = required;
	const additionalProperties = decideAdditionalProperties(def, refs);
	if (additionalProperties !== void 0) result.additionalProperties = additionalProperties;
	return result;
}
function decideAdditionalProperties(def, refs) {
	if (def.catchall._def.typeName !== "ZodNever") return parseDef(def.catchall._def, {
		...refs,
		currentPath: [...refs.currentPath, "additionalProperties"]
	});
	switch (def.unknownKeys) {
		case "passthrough": return refs.allowedAdditionalProperties;
		case "strict": return refs.rejectedAdditionalProperties;
		case "strip": return refs.removeAdditionalStrategy === "strict" ? refs.allowedAdditionalProperties : refs.rejectedAdditionalProperties;
	}
}
function safeIsOptional(schema) {
	try {
		return schema.isOptional();
	} catch {
		return true;
	}
}
const parseOptionalDef = (def, refs) => {
	if (refs.currentPath.toString() === refs.propertyPath?.toString()) return parseDef(def.innerType._def, refs);
	const innerSchema = parseDef(def.innerType._def, {
		...refs,
		currentPath: [
			...refs.currentPath,
			"anyOf",
			"1"
		]
	});
	return innerSchema ? { anyOf: [{ not: parseAnyDef(refs) }, innerSchema] } : parseAnyDef(refs);
};
const parsePipelineDef = (def, refs) => {
	if (refs.pipeStrategy === "input") return parseDef(def.in._def, refs);
	else if (refs.pipeStrategy === "output") return parseDef(def.out._def, refs);
	const a = parseDef(def.in._def, {
		...refs,
		currentPath: [
			...refs.currentPath,
			"allOf",
			"0"
		]
	});
	return { allOf: [a, parseDef(def.out._def, {
		...refs,
		currentPath: [
			...refs.currentPath,
			"allOf",
			a ? "1" : "0"
		]
	})].filter((x) => x !== void 0) };
};
function parsePromiseDef(def, refs) {
	return parseDef(def.type._def, refs);
}
function parseSetDef(def, refs) {
	const schema = {
		type: "array",
		uniqueItems: true,
		items: parseDef(def.valueType._def, {
			...refs,
			currentPath: [...refs.currentPath, "items"]
		})
	};
	if (def.minSize) setResponseValueAndErrors(schema, "minItems", def.minSize.value, def.minSize.message, refs);
	if (def.maxSize) setResponseValueAndErrors(schema, "maxItems", def.maxSize.value, def.maxSize.message, refs);
	return schema;
}
function parseTupleDef(def, refs) {
	if (def.rest) return {
		type: "array",
		minItems: def.items.length,
		items: def.items.map((x, i) => parseDef(x._def, {
			...refs,
			currentPath: [
				...refs.currentPath,
				"items",
				`${i}`
			]
		})).reduce((acc, x) => x === void 0 ? acc : [...acc, x], []),
		additionalItems: parseDef(def.rest._def, {
			...refs,
			currentPath: [...refs.currentPath, "additionalItems"]
		})
	};
	else return {
		type: "array",
		minItems: def.items.length,
		maxItems: def.items.length,
		items: def.items.map((x, i) => parseDef(x._def, {
			...refs,
			currentPath: [
				...refs.currentPath,
				"items",
				`${i}`
			]
		})).reduce((acc, x) => x === void 0 ? acc : [...acc, x], [])
	};
}
function parseUndefinedDef(refs) {
	return { not: parseAnyDef(refs) };
}
function parseUnknownDef(refs) {
	return parseAnyDef(refs);
}
const parseReadonlyDef = (def, refs) => {
	return parseDef(def.innerType._def, refs);
};
const selectParser = (def, typeName, refs) => {
	switch (typeName) {
		case ZodFirstPartyTypeKind.ZodString: return parseStringDef(def, refs);
		case ZodFirstPartyTypeKind.ZodNumber: return parseNumberDef(def, refs);
		case ZodFirstPartyTypeKind.ZodObject: return parseObjectDef(def, refs);
		case ZodFirstPartyTypeKind.ZodBigInt: return parseBigintDef(def, refs);
		case ZodFirstPartyTypeKind.ZodBoolean: return parseBooleanDef();
		case ZodFirstPartyTypeKind.ZodDate: return parseDateDef(def, refs);
		case ZodFirstPartyTypeKind.ZodUndefined: return parseUndefinedDef(refs);
		case ZodFirstPartyTypeKind.ZodNull: return parseNullDef(refs);
		case ZodFirstPartyTypeKind.ZodArray: return parseArrayDef(def, refs);
		case ZodFirstPartyTypeKind.ZodUnion:
		case ZodFirstPartyTypeKind.ZodDiscriminatedUnion: return parseUnionDef(def, refs);
		case ZodFirstPartyTypeKind.ZodIntersection: return parseIntersectionDef(def, refs);
		case ZodFirstPartyTypeKind.ZodTuple: return parseTupleDef(def, refs);
		case ZodFirstPartyTypeKind.ZodRecord: return parseRecordDef(def, refs);
		case ZodFirstPartyTypeKind.ZodLiteral: return parseLiteralDef(def, refs);
		case ZodFirstPartyTypeKind.ZodEnum: return parseEnumDef(def);
		case ZodFirstPartyTypeKind.ZodNativeEnum: return parseNativeEnumDef(def);
		case ZodFirstPartyTypeKind.ZodNullable: return parseNullableDef(def, refs);
		case ZodFirstPartyTypeKind.ZodOptional: return parseOptionalDef(def, refs);
		case ZodFirstPartyTypeKind.ZodMap: return parseMapDef(def, refs);
		case ZodFirstPartyTypeKind.ZodSet: return parseSetDef(def, refs);
		case ZodFirstPartyTypeKind.ZodLazy: return () => def.getter()._def;
		case ZodFirstPartyTypeKind.ZodPromise: return parsePromiseDef(def, refs);
		case ZodFirstPartyTypeKind.ZodNaN:
		case ZodFirstPartyTypeKind.ZodNever: return parseNeverDef(refs);
		case ZodFirstPartyTypeKind.ZodEffects: return parseEffectsDef(def, refs);
		case ZodFirstPartyTypeKind.ZodAny: return parseAnyDef(refs);
		case ZodFirstPartyTypeKind.ZodUnknown: return parseUnknownDef(refs);
		case ZodFirstPartyTypeKind.ZodDefault: return parseDefaultDef(def, refs);
		case ZodFirstPartyTypeKind.ZodBranded: return parseBrandedDef(def, refs);
		case ZodFirstPartyTypeKind.ZodReadonly: return parseReadonlyDef(def, refs);
		case ZodFirstPartyTypeKind.ZodCatch: return parseCatchDef(def, refs);
		case ZodFirstPartyTypeKind.ZodPipeline: return parsePipelineDef(def, refs);
		case ZodFirstPartyTypeKind.ZodFunction:
		case ZodFirstPartyTypeKind.ZodVoid:
		case ZodFirstPartyTypeKind.ZodSymbol: return;
		default: return ((_) => void 0)(typeName);
	}
};
function parseDef(def, refs, forceResolution = false) {
	const seenItem = refs.seen.get(def);
	if (refs.override) {
		const overrideResult = refs.override?.(def, refs, seenItem, forceResolution);
		if (overrideResult !== ignoreOverride) return overrideResult;
	}
	if (seenItem && !forceResolution) {
		const seenSchema = get$ref(seenItem, refs);
		if (seenSchema !== void 0) return seenSchema;
	}
	const newItem = {
		def,
		path: refs.currentPath,
		jsonSchema: void 0
	};
	refs.seen.set(def, newItem);
	const jsonSchemaOrGetter = selectParser(def, def.typeName, refs);
	const jsonSchema = typeof jsonSchemaOrGetter === "function" ? parseDef(jsonSchemaOrGetter(), refs) : jsonSchemaOrGetter;
	if (jsonSchema) addMeta(def, refs, jsonSchema);
	if (refs.postProcess) {
		const postProcessResult = refs.postProcess(jsonSchema, def, refs);
		newItem.jsonSchema = jsonSchema;
		return postProcessResult;
	}
	newItem.jsonSchema = jsonSchema;
	return jsonSchema;
}
const get$ref = (item, refs) => {
	switch (refs.$refStrategy) {
		case "root": return { $ref: item.path.join("/") };
		case "relative": return { $ref: getRelativePath(refs.currentPath, item.path) };
		case "none":
		case "seen":
			if (item.path.length < refs.currentPath.length && item.path.every((value, index) => refs.currentPath[index] === value)) {
				console.warn(`Recursive reference detected at ${refs.currentPath.join("/")}! Defaulting to any`);
				return parseAnyDef(refs);
			}
			return refs.$refStrategy === "seen" ? parseAnyDef(refs) : void 0;
	}
};
const addMeta = (def, refs, jsonSchema) => {
	if (def.description) {
		jsonSchema.description = def.description;
		if (refs.markdownDescription) jsonSchema.markdownDescription = def.description;
	}
	return jsonSchema;
};
const zodToJsonSchema = (schema, options) => {
	const refs = getRefs(options);
	let definitions = typeof options === "object" && options.definitions ? Object.entries(options.definitions).reduce((acc, [name, schema]) => ({
		...acc,
		[name]: parseDef(schema._def, {
			...refs,
			currentPath: [
				...refs.basePath,
				refs.definitionPath,
				name
			]
		}, true) ?? parseAnyDef(refs)
	}), {}) : void 0;
	const name = typeof options === "string" ? options : options?.nameStrategy === "title" ? void 0 : options?.name;
	const main = parseDef(schema._def, name === void 0 ? refs : {
		...refs,
		currentPath: [
			...refs.basePath,
			refs.definitionPath,
			name
		]
	}, false) ?? parseAnyDef(refs);
	const title = typeof options === "object" && options.name !== void 0 && options.nameStrategy === "title" ? options.name : void 0;
	if (title !== void 0) main.title = title;
	if (refs.flags.hasReferencedOpenAiAnyType) {
		if (!definitions) definitions = {};
		if (!definitions[refs.openAiAnyTypeName]) definitions[refs.openAiAnyTypeName] = {
			type: [
				"string",
				"number",
				"integer",
				"boolean",
				"array",
				"null"
			],
			items: { $ref: refs.$refStrategy === "relative" ? "1" : [
				...refs.basePath,
				refs.definitionPath,
				refs.openAiAnyTypeName
			].join("/") }
		};
	}
	const combined = name === void 0 ? definitions ? {
		...main,
		[refs.definitionPath]: definitions
	} : main : {
		$ref: [
			...refs.$refStrategy === "relative" ? [] : refs.basePath,
			refs.definitionPath,
			name
		].join("/"),
		[refs.definitionPath]: {
			...definitions,
			[name]: main
		}
	};
	if (refs.target === "jsonSchema7") combined.$schema = "http://json-schema.org/draft-07/schema#";
	else if (refs.target === "jsonSchema2019-09" || refs.target === "openAi") combined.$schema = "https://json-schema.org/draft/2019-09/schema#";
	if (refs.target === "openAi" && ("anyOf" in combined || "oneOf" in combined || "allOf" in combined || "type" in combined && Array.isArray(combined.type))) console.warn("Warning: OpenAI may not support schemas with unions as roots! Try wrapping it in an object property.");
	return combined;
};
/**
* Standard $defs dictionary for A2UI v0.8 catalog JSON schemas.
*/
const V08_STANDARD_DEFS = {
	"ComponentId": {
		"description": "The unique identifier for a component, used for both definitions and references within the same surface.",
		"type": "string"
	},
	"TextItem": {
		"additionalProperties": false,
		"description": "The value of the text field. This can be a literal string or a reference to a value in the data model ('path', e.g. '/user/name').",
		"properties": {
			"literalString": { "type": "string" },
			"path": { "type": "string" }
		},
		"type": "object"
	},
	"UrlItem": {
		"additionalProperties": false,
		"description": "The URL of the audio to be played. This can be a literal string ('literal') or a reference to a value in the data model ('path', e.g. '/song/url').",
		"properties": {
			"literalString": { "type": "string" },
			"path": { "type": "string" }
		},
		"type": "object"
	},
	"AltTextItem": {
		"additionalProperties": false,
		"description": "The alt text for the image. This can be a literal string ('literal') or a reference to a value in the data model ('path', e.g. '/thumbnail/altText').",
		"properties": {
			"literalString": { "type": "string" },
			"path": { "type": "string" }
		},
		"type": "object"
	},
	"NameItem": {
		"additionalProperties": false,
		"description": "The name of the icon to display. This can be a literal string or a reference to a value in the data model ('path', e.g. '/form/submit').",
		"properties": {
			"literalString": {
				"enum": [
					"accountCircle",
					"add",
					"arrowBack",
					"arrowForward",
					"attachFile",
					"calendarToday",
					"call",
					"camera",
					"check",
					"close",
					"delete",
					"download",
					"edit",
					"event",
					"error",
					"favorite",
					"favoriteOff",
					"folder",
					"help",
					"home",
					"info",
					"locationOn",
					"lock",
					"lockOpen",
					"mail",
					"menu",
					"moreVert",
					"moreHoriz",
					"notificationsOff",
					"notifications",
					"payment",
					"person",
					"phone",
					"photo",
					"print",
					"refresh",
					"search",
					"send",
					"settings",
					"share",
					"shoppingCart",
					"star",
					"starHalf",
					"starOff",
					"upload",
					"visibility",
					"visibilityOff",
					"warning"
				],
				"type": "string"
			},
			"path": { "type": "string" }
		},
		"type": "object"
	},
	"DescriptionItem": {
		"additionalProperties": false,
		"description": "A description of the audio, such as a title or summary. This can be a literal string or a reference to a value in the data model ('path', e.g. '/song/title').",
		"properties": {
			"literalString": { "type": "string" },
			"path": { "type": "string" }
		},
		"type": "object"
	},
	"ChildrenItem": {
		"additionalProperties": false,
		"description": "Defines the children. Use 'explicitList' for a fixed set of children, or 'template' to generate children from a data list.",
		"properties": {
			"explicitList": {
				"items": { "type": "string" },
				"type": "array"
			},
			"template": {
				"$ref": "#/$defs/TemplateItem",
				"description": "A template for generating a dynamic list of children from a data model list. `componentId` is the component to use as a template, and `dataBinding` is the path to the map of components in the data model. Values in the map will define the list of children."
			}
		},
		"type": "object"
	},
	"TemplateItem": {
		"additionalProperties": false,
		"description": "A template for generating a dynamic list of children from a data model list. `componentId` is the component to use as a template, and `dataBinding` is the path to the map of components in the data model. Values in the map will define the list of children.",
		"properties": {
			"componentId": { "type": "string" },
			"dataBinding": { "type": "string" }
		},
		"required": ["componentId", "dataBinding"],
		"type": "object"
	},
	"TabItemItem": {
		"additionalProperties": false,
		"properties": {
			"child": { "type": "string" },
			"title": { "$ref": "#/$defs/TitleItem" }
		},
		"required": ["title", "child"],
		"type": "object"
	},
	"TitleItem": {
		"additionalProperties": false,
		"description": "The tab title. Defines the value as either a literal value or a path to data model value (e.g. '/options/title').",
		"properties": {
			"literalString": { "type": "string" },
			"path": { "type": "string" }
		},
		"type": "object"
	},
	"ActionItem": {
		"additionalProperties": false,
		"description": "The client-side action to be dispatched when the button is clicked. It includes the action's name and an optional context payload.",
		"properties": {
			"context": {
				"items": { "$ref": "#/$defs/ContextItem" },
				"type": "array"
			},
			"name": { "type": "string" }
		},
		"required": ["name"],
		"type": "object"
	},
	"ContextItem": {
		"additionalProperties": false,
		"properties": {
			"key": { "type": "string" },
			"value": {
				"$ref": "#/$defs/ValueItem",
				"description": "Defines the value to be included in the context as either a literal value or a path to a data model value (e.g. '/user/name')."
			}
		},
		"required": ["key", "value"],
		"type": "object"
	},
	"ValueItem": {
		"additionalProperties": false,
		"description": "The current value of the slider. This can be a literal number ('literalNumber') or a reference to a value in the data model ('path', e.g. '/restaurant/cost').",
		"properties": {
			"literalNumber": { "type": "number" },
			"path": { "type": "string" }
		},
		"type": "object"
	},
	"LabelItem": {
		"additionalProperties": false,
		"description": "The label for the slider. This can be a literal string or a reference to a value in the data model ('path').",
		"properties": {
			"literalString": { "type": "string" },
			"path": { "type": "string" }
		},
		"type": "object"
	},
	"OptionItem": {
		"additionalProperties": false,
		"properties": {
			"label": {
				"$ref": "#/$defs/LabelItem",
				"description": "The text to display for this option. This can be a literal string or a reference to a value in the data model (e.g. '/option/label')."
			},
			"value": {
				"description": "The value to be associated with this option when selected.",
				"type": "string"
			}
		},
		"required": ["label", "value"],
		"type": "object"
	},
	"SelectionItem": {
		"additionalProperties": false,
		"description": "The currently selected values for the component. This can be a literal array of strings or a path to an array in the data model('path', e.g. '/hotel/options').",
		"properties": {
			"literalArray": {
				"items": { "type": "string" },
				"type": "array"
			},
			"path": { "type": "string" }
		},
		"type": "object"
	}
};
/**
* Child reference analysis configuration for A2UI v0.9 and v0.9.1 schemas.
*/
const V09_CHILD_REF_OPTIONS = {
	childRefNames: /* @__PURE__ */ new Set([
		"ComponentId",
		"Child",
		"ChildComponentId"
	]),
	childListRefNames: /* @__PURE__ */ new Set([
		"ChildList",
		"TemplateChildList",
		"ChildrenItem",
		"TemplateItem"
	])
};
/**
* Standard $defs dictionary for A2UI v0.9 and v0.9.1 catalog JSON schemas.
*/
const V09_STANDARD_DEFS = {
	"ComponentId": {
		"type": "string",
		"description": "The unique identifier for a component, used for both definitions and references within the same surface."
	},
	"AccessibilityAttributes": {
		"type": "object",
		"description": "Attributes to enhance accessibility when using assistive technologies like screen readers.",
		"properties": {
			"label": {
				"$ref": "#/$defs/DynamicString",
				"description": "A short string, typically 1 to 3 words, used by assistive technologies to convey the purpose or intent of an element. For example, an input field might have an accessible label of 'User ID' or a button might be labeled 'Submit'."
			},
			"description": {
				"$ref": "#/$defs/DynamicString",
				"description": "Additional information provided by assistive technologies about an element such as instructions, format requirements, or result of an action. For example, a mute button might have a label of 'Mute' and a description of 'Silences notifications about this conversation'."
			}
		}
	},
	"ComponentCommon": {
		"type": "object",
		"properties": {
			"id": { "$ref": "#/$defs/ComponentId" },
			"accessibility": { "$ref": "#/$defs/AccessibilityAttributes" }
		},
		"required": ["id"]
	},
	"ChildList": { "oneOf": [{
		"type": "array",
		"items": { "$ref": "#/$defs/ComponentId" },
		"description": "A static list of child component IDs."
	}, {
		"type": "object",
		"description": "A template for generating a dynamic list of children from a data model list. The `componentId` is the component to use as a template.",
		"properties": {
			"componentId": { "$ref": "#/$defs/ComponentId" },
			"path": {
				"type": "string",
				"description": "The path to the list of component property objects in the data model."
			}
		},
		"required": ["componentId", "path"],
		"additionalProperties": false
	}] },
	"DataBinding": {
		"type": "object",
		"properties": { "path": {
			"type": "string",
			"description": "A JSON Pointer path to a value in the data model."
		} },
		"required": ["path"],
		"additionalProperties": false
	},
	"DynamicValue": {
		"description": "A value that can be a literal, a path, or a function call returning any type.",
		"oneOf": [
			{ "type": "string" },
			{ "type": "number" },
			{ "type": "boolean" },
			{ "type": "array" },
			{ "$ref": "#/$defs/DataBinding" },
			{ "$ref": "#/$defs/FunctionCall" }
		]
	},
	"DynamicString": {
		"description": "Represents a string",
		"oneOf": [
			{ "type": "string" },
			{ "$ref": "#/$defs/DataBinding" },
			{ "allOf": [{ "$ref": "#/$defs/FunctionCall" }, { "properties": { "returnType": { "const": "string" } } }] }
		]
	},
	"DynamicNumber": {
		"description": "Represents a value that can be either a literal number, a path to a number in the data model, or a function call returning a number.",
		"oneOf": [
			{ "type": "number" },
			{ "$ref": "#/$defs/DataBinding" },
			{ "allOf": [{ "$ref": "#/$defs/FunctionCall" }, { "properties": { "returnType": { "const": "number" } } }] }
		]
	},
	"DynamicBoolean": {
		"description": "A boolean value that can be a literal, a path, or a function call returning a boolean.",
		"oneOf": [
			{ "type": "boolean" },
			{ "$ref": "#/$defs/DataBinding" },
			{ "allOf": [{ "$ref": "#/$defs/FunctionCall" }, { "properties": { "returnType": { "const": "boolean" } } }] }
		]
	},
	"DynamicStringList": {
		"description": "Represents a value that can be either a literal array of strings, a path to a string array in the data model, or a function call returning a string array.",
		"oneOf": [
			{
				"type": "array",
				"items": { "type": "string" }
			},
			{ "$ref": "#/$defs/DataBinding" },
			{ "allOf": [{ "$ref": "#/$defs/FunctionCall" }, { "properties": { "returnType": { "const": "array" } } }] }
		]
	},
	"FunctionCall": {
		"type": "object",
		"description": "Invokes a named function on the client.",
		"properties": {
			"call": {
				"type": "string",
				"description": "The name of the function to call."
			},
			"args": {
				"type": "object",
				"description": "Arguments passed to the function.",
				"additionalProperties": { "anyOf": [{ "$ref": "#/$defs/DynamicValue" }, {
					"type": "object",
					"description": "A literal object argument (e.g. configuration)."
				}] }
			},
			"returnType": {
				"type": "string",
				"description": "The expected return type of the function call.",
				"enum": [
					"string",
					"number",
					"boolean",
					"array",
					"object",
					"any",
					"void"
				],
				"default": "boolean"
			}
		},
		"required": ["call"],
		"oneOf": [{ "$ref": "catalog.json#/$defs/anyFunction" }]
	},
	"CheckRule": {
		"type": "object",
		"description": "A single validation rule applied to an input component.",
		"properties": {
			"condition": { "$ref": "#/$defs/DynamicBoolean" },
			"message": {
				"type": "string",
				"description": "The error message to display if the check fails."
			}
		},
		"required": ["condition", "message"],
		"additionalProperties": false
	},
	"Checkable": {
		"description": "Properties for components that support client-side checks.",
		"type": "object",
		"properties": { "checks": {
			"type": "array",
			"description": "A list of checks to perform. These are function calls that must return a boolean indicating validity.",
			"items": { "$ref": "#/$defs/CheckRule" }
		} }
	},
	"Action": {
		"description": "Defines an interaction handler that can either trigger a server-side event or execute a local client-side function.",
		"oneOf": [{
			"type": "object",
			"description": "Triggers a server-side event.",
			"properties": { "event": {
				"type": "object",
				"description": "The event to dispatch to the server.",
				"properties": {
					"name": {
						"type": "string",
						"description": "The name of the action to be dispatched to the server."
					},
					"context": {
						"type": "object",
						"description": "A JSON object containing the key-value pairs for the action context. Values can be literals or paths. Use literal values unless the value must be dynamically bound to the data model. Do NOT use paths for static IDs.",
						"additionalProperties": { "$ref": "#/$defs/DynamicValue" }
					}
				},
				"required": ["name"],
				"additionalProperties": false
			} },
			"required": ["event"],
			"additionalProperties": false
		}, {
			"type": "object",
			"description": "Executes a local client-side function.",
			"properties": { "functionCall": { "$ref": "#/$defs/FunctionCall" } },
			"required": ["functionCall"],
			"additionalProperties": false
		}]
	}
};
/*
* @license
* Copyright 2024 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   https://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
const STANDARD_DEFS_BY_VERSION = {
	"0.8": V08_STANDARD_DEFS,
	"0.9": V09_STANDARD_DEFS,
	"0.9.1": V09_STANDARD_DEFS,
	"1.0": {
		"ComponentId": {
			"type": "string",
			"description": "The unique identifier for a component, used for both definitions and references within the same surface."
		},
		"CallId": {
			"type": "string",
			"description": "The unique identifier for a function call."
		},
		"AccessibilityAttributes": {
			"type": "object",
			"description": "Attributes to enhance accessibility when using assistive technologies like screen readers or model understanding.",
			"properties": {
				"label": {
					"$ref": "#/$defs/DynamicString",
					"description": "A short string, typically 1 to 3 words, used by assistive technologies to convey the purpose or intent of an element. For example, an input field might have an accessible label of 'User ID' or a button might be labeled 'Submit'."
				},
				"description": {
					"$ref": "#/$defs/DynamicString",
					"description": "Additional information provided by assistive technologies about an element such as instructions, format requirements, or result of an action. For example, a mute button might have a label of 'Mute' and a description of 'Silences notifications about this conversation'."
				},
				"live": {
					"type": "string",
					"enum": [
						"off",
						"polite",
						"assertive"
					],
					"default": "off",
					"description": "Controls screen reader announcements for dynamic updates (WAI-ARIA aria-live). 'polite' waits for user pause; 'assertive' interrupts immediately for alerts."
				},
				"hidden": {
					"$ref": "#/$defs/DynamicBoolean",
					"description": "Hides the element and its children from assistive technologies when true. Default is false."
				}
			},
			"additionalProperties": false
		},
		"Extensions": {
			"type": "object",
			"description": "Optional extension metadata. Keys MUST be Unicode identifiers (UAX #31). Keys starting with 'a2ui_' are reserved for official extensions.",
			"patternProperties": { "^[\\p{XID_Start}_][\\p{XID_Continue}]*$": {} },
			"additionalProperties": false
		},
		"ComponentCommon": {
			"type": "object",
			"properties": {
				"id": { "$ref": "#/$defs/ComponentId" },
				"catalogId": {
					"type": "string",
					"description": "The catalog ID for this component, overriding any surface-level default catalogId."
				},
				"accessibility": { "$ref": "#/$defs/AccessibilityAttributes" },
				"metadata": {
					"type": "object",
					"description": "Optional component-level metadata for vendor extensions.",
					"properties": { "extensions": { "$ref": "#/$defs/Extensions" } },
					"additionalProperties": false
				}
			},
			"required": ["id"]
		},
		"Child": {
			"$ref": "#/$defs/ComponentId",
			"description": "A reference to a single child component ID."
		},
		"ChildList": { "oneOf": [{
			"type": "array",
			"items": { "$ref": "#/$defs/ComponentId" },
			"description": "A static list of child component IDs."
		}, {
			"type": "object",
			"description": "A template for generating a dynamic list of children from a data model list. The `componentId` is the component to use as a template.",
			"properties": {
				"componentId": { "$ref": "#/$defs/ComponentId" },
				"path": {
					"type": "string",
					"description": "The path to the list of component property objects in the data model."
				}
			},
			"required": ["componentId", "path"],
			"additionalProperties": false
		}] },
		"DataBinding": {
			"type": "object",
			"properties": { "path": {
				"type": "string",
				"description": "A JSON Pointer path to a value in the data model."
			} },
			"required": ["path"],
			"additionalProperties": false
		},
		"DynamicValue": {
			"description": "A value that can be a literal, a path, or a function call returning any type.",
			"oneOf": [
				{ "type": "string" },
				{ "type": "number" },
				{ "type": "boolean" },
				{ "type": "array" },
				{
					"type": "object",
					"not": { "anyOf": [{ "required": ["path"] }, { "required": ["call"] }] }
				},
				{ "$ref": "#/$defs/DataBinding" },
				{ "$ref": "#/$defs/FunctionCall" }
			]
		},
		"DynamicString": {
			"description": "Represents a string",
			"oneOf": [
				{ "type": "string" },
				{ "$ref": "#/$defs/DataBinding" },
				{ "$ref": "#/$defs/FunctionCall" }
			]
		},
		"DynamicNumber": {
			"description": "Represents a value that can be either a literal number, a path to a number in the data model, or a function call returning a number.",
			"oneOf": [
				{ "type": "number" },
				{ "$ref": "#/$defs/DataBinding" },
				{ "$ref": "#/$defs/FunctionCall" }
			]
		},
		"DynamicBoolean": {
			"description": "A boolean value that can be a literal, a path, or a function call returning a boolean.",
			"oneOf": [
				{ "type": "boolean" },
				{ "$ref": "#/$defs/DataBinding" },
				{ "$ref": "#/$defs/FunctionCall" }
			]
		},
		"DynamicStringList": {
			"description": "Represents a value that can be either a literal array of strings, a path to a string array in the data model, or a function call returning a string array.",
			"oneOf": [
				{
					"type": "array",
					"items": { "type": "string" }
				},
				{ "$ref": "#/$defs/DataBinding" },
				{ "$ref": "#/$defs/FunctionCall" }
			]
		},
		"FunctionCommon": {
			"type": "object",
			"description": "Baseline envelope properties common to all function calls. Function-specific argument schemas ('args') are defined individually by each function in the active catalog.",
			"properties": {
				"call": {
					"type": "string",
					"description": "The name of the function to call."
				},
				"catalogId": {
					"type": "string",
					"description": "The catalog ID for this function, overriding any surface-level default catalogId."
				}
			},
			"required": ["call"]
		},
		"IndexSystemFunction": {
			"type": "object",
			"description": "Returns the 0-based index of the current item when rendering a dynamic list from a template. This function MUST ONLY be available when evaluating template items within a list context.",
			"returnType": "number",
			"properties": {
				"call": { "const": "@index" },
				"args": {
					"type": "object",
					"properties": { "offset": {
						"$ref": "#/$defs/DynamicNumber",
						"description": "Optional. An offset to add to the 0-based index (e.g., 1 for 1-based indexing). Defaults to 0.",
						"default": 0
					} },
					"unevaluatedProperties": false
				}
			},
			"required": ["call"],
			"unevaluatedProperties": false
		},
		"FunctionCall": {
			"type": "object",
			"description": "Invokes a named function, combining common function properties with the catalog function definition.",
			"allOf": [{ "$ref": "#/$defs/FunctionCommon" }, { "oneOf": [{ "$ref": "catalog.json#/$defs/anyFunction" }, { "$ref": "#/$defs/IndexSystemFunction" }] }],
			"unevaluatedProperties": false
		},
		"CheckRule": {
			"type": "object",
			"description": "A single validation check rule applied to an input component. The condition function or path evaluates to a structured validation result object.",
			"properties": {
				"condition": {
					"oneOf": [{ "$ref": "#/$defs/DataBinding" }, { "$ref": "#/$defs/FunctionCall" }],
					"description": "Path or function call evaluating to a structured validation result object."
				},
				"message": {
					"type": "string",
					"description": "Optional fallback error message."
				}
			},
			"required": ["condition"],
			"additionalProperties": false
		},
		"Checkable": {
			"description": "Properties for components that support renderer-side checks.",
			"type": "object",
			"properties": { "checks": {
				"type": "array",
				"description": "A list of checks to perform. These are function calls that must return a boolean indicating validity.",
				"items": { "$ref": "#/$defs/CheckRule" }
			} }
		},
		"Action": {
			"description": "Defines an interaction handler that can either trigger an agent-side event or execute a local renderer-side function.",
			"oneOf": [{
				"type": "object",
				"description": "Triggers an agent-side event.",
				"properties": { "event": {
					"type": "object",
					"description": "The event to dispatch to the agent.",
					"properties": {
						"name": {
							"type": "string",
							"description": "The name of the action to be dispatched to the agent."
						},
						"userMessage": {
							"$ref": "#/$defs/DynamicString",
							"description": "An optional human-readable message describing the action performed by the user, to present in conversation history or user feedback."
						},
						"context": {
							"type": "object",
							"description": "A JSON object containing the key-value pairs for the action context. Values can be literals or paths. Use literal values unless the value must be dynamically bound to the data model. Do NOT use paths for static IDs.",
							"additionalProperties": { "$ref": "#/$defs/DynamicValue" }
						}
					},
					"required": ["name"],
					"additionalProperties": false
				} },
				"required": ["event"],
				"additionalProperties": false
			}, {
				"type": "object",
				"description": "Executes a renderer or agent-side function.",
				"properties": { "functionCall": { "$ref": "#/$defs/FunctionCall" } },
				"required": ["functionCall"],
				"additionalProperties": false
			}]
		},
		"Surface": {
			"title": "Surface Container Component",
			"description": "The reserved canonical container component representing an A2UI surface. The Surface component is immutable and always has 'child': 'root'.",
			"type": "object",
			"allowedParents": [],
			"properties": {
				"component": { "const": "Surface" },
				"child": { "const": "root" }
			},
			"additionalProperties": false
		},
		"FunctionResponse": {
			"type": "object",
			"description": "The return response matching a callAgentFunction or callRendererFunction invocation.",
			"properties": {
				"functionCallId": {
					"$ref": "#/$defs/CallId",
					"description": "The unique ID matching the initiating function call."
				},
				"value": { "description": "The return value of the function." },
				"error": {
					"type": "object",
					"description": "An error object indicating failure of the function execution.",
					"properties": {
						"code": { "type": "string" },
						"message": { "type": "string" }
					},
					"required": ["code", "message"],
					"additionalProperties": false
				}
			},
			"required": ["functionCallId"],
			"oneOf": [{ "required": ["value"] }, { "required": ["error"] }],
			"additionalProperties": false
		}
	}
};
/**
* Resolves the appropriate standard $defs dictionary based on options or catalog configuration.
*/
function getStandardDefsForCatalog(_catalog, options) {
	if (options?.standardDefs) return options.standardDefs;
	if (options?.protocolVersion) {
		const key = toCanonicalVersion(options.protocolVersion) ?? normalizeVersionString(options.protocolVersion);
		if (key in STANDARD_DEFS_BY_VERSION) return STANDARD_DEFS_BY_VERSION[key];
	}
	return V09_STANDARD_DEFS;
}
/**
* Transforms a schema node with a REF description into a `$ref` definition node.
*/
function transformRefDescriptionNode(obj) {
	if (typeof obj.description !== "string" || !obj.description.startsWith("REF:")) return false;
	const content = obj.description.substring(4);
	const pipeIndex = content.indexOf("|");
	const ref = pipeIndex === -1 ? content : content.substring(0, pipeIndex);
	const desc = pipeIndex === -1 ? "" : content.substring(pipeIndex + 1);
	const savedDefault = obj.default;
	for (const key of Object.keys(obj)) delete obj[key];
	obj["$ref"] = ref.startsWith("#") ? ref : `#/$defs/${ref.split("/").pop()}`;
	if (savedDefault !== void 0) obj["default"] = savedDefault;
	if (desc) obj["description"] = desc;
	return true;
}
/**
* Normalizes property schema structures like anyOf and additionalProperties.
*/
function cleanSchemaProperties(obj) {
	if (Array.isArray(obj.anyOf)) {
		obj.oneOf = obj.anyOf;
		delete obj.anyOf;
	}
	if (obj.additionalProperties && typeof obj.additionalProperties === "object" && Object.keys(obj.additionalProperties).length === 0) obj.additionalProperties = true;
	if (obj.unevaluatedProperties && typeof obj.unevaluatedProperties === "object" && Object.keys(obj.unevaluatedProperties).length === 0) obj.unevaluatedProperties = true;
	if ("$schema" in obj) delete obj["$schema"];
}
/**
* Cleans auto-generated Zod schema artifacts and transforms REF markers into explicit `$ref` objects.
*
* Removes schema metadata and converts `REF:<url>|<desc>` description markers into `$ref` references.
*
* @param node The schema object or array node to sanitize in place.
* @param visited Set of visited objects to prevent infinite recursion on cyclic structures.
*/
function cleanSchemaNode(node, visited = /* @__PURE__ */ new Set()) {
	if (typeof node !== "object" || node === null) return;
	if (visited.has(node)) return;
	visited.add(node);
	if (Array.isArray(node)) {
		for (const item of node) cleanSchemaNode(item, visited);
		return;
	}
	const obj = node;
	if (transformRefDescriptionNode(obj)) return;
	cleanSchemaProperties(obj);
	for (const key of Object.keys(obj)) cleanSchemaNode(obj[key], visited);
}
function processTheme(catalog, defs) {
	if (!catalog.themeSchema) return;
	const themeRaw = zodToJsonSchema(catalog.themeSchema, {
		target: "jsonSchema2019-09",
		$refStrategy: "none"
	});
	cleanSchemaNode(themeRaw);
	if (themeRaw.definitions && typeof themeRaw.definitions === "object") {
		Object.assign(defs, themeRaw.definitions);
		delete themeRaw.definitions;
	} else if (themeRaw.$defs && typeof themeRaw.$defs === "object") {
		Object.assign(defs, themeRaw.$defs);
		delete themeRaw.$defs;
	}
	const isV08 = catalog.id.includes("v0_8") || catalog.id.includes("v0.8");
	defs["theme"] = {
		type: "object",
		properties: themeRaw.properties || {},
		...Array.isArray(themeRaw.required) && themeRaw.required.length > 0 ? { required: themeRaw.required } : {},
		...isV08 ? {} : { additionalProperties: themeRaw.additionalProperties !== void 0 ? themeRaw.additionalProperties : true }
	};
}
/**
* Extracts raw Zod properties, required fields, and definitions from a component API schema.
*/
function extractZodComponentSchema(comp, defs) {
	if (!comp.schema || typeof comp.schema !== "object" || !("safeParse" in comp.schema)) return {
		props: {},
		reqList: [],
		additionalProps: void 0
	};
	const rawZod = zodToJsonSchema(comp.schema, {
		target: "jsonSchema2019-09",
		$refStrategy: "none"
	});
	cleanSchemaNode(rawZod);
	if (rawZod.definitions && typeof rawZod.definitions === "object") Object.assign(defs, rawZod.definitions);
	else if (rawZod.$defs && typeof rawZod.$defs === "object") Object.assign(defs, rawZod.$defs);
	const props = rawZod.properties || {};
	const reqList = Array.isArray(rawZod.required) ? rawZod.required.filter((r) => r !== "component" && r !== "id") : [];
	const rawExtra = rawZod.unevaluatedProperties ?? rawZod.additionalProperties;
	return {
		props,
		reqList,
		additionalProps: typeof rawExtra === "boolean" || typeof rawExtra === "object" && rawExtra !== null ? rawExtra : void 0
	};
}
function processSingleComponent(name, comp, defs, _catalog, options) {
	const { props, reqList, additionalProps } = extractZodComponentSchema(comp, defs);
	const { component: _ignoredComp, id: _ignoredId, ...sanitizedProps } = props;
	const innerProperties = {
		id: { $ref: "#/$defs/ComponentId" },
		...sanitizedProps,
		component: { const: name }
	};
	const innerRequired = [
		"id",
		...reqList,
		"component"
	];
	let compSchemaObj;
	if (options?.componentEnvelopeRef) compSchemaObj = {
		allOf: [{ $ref: options.componentEnvelopeRef }, {
			type: "object",
			properties: innerProperties,
			required: innerRequired
		}],
		unevaluatedProperties: additionalProps !== void 0 ? additionalProps : false
	};
	else compSchemaObj = {
		type: "object",
		properties: innerProperties,
		required: innerRequired,
		unevaluatedProperties: additionalProps !== void 0 ? additionalProps : false
	};
	if (comp.allowedParents && comp.allowedParents.length > 0) compSchemaObj["allowedParents"] = comp.allowedParents;
	if (comp.allowedChildren && comp.allowedChildren.length > 0) compSchemaObj["allowedChildren"] = comp.allowedChildren;
	return compSchemaObj;
}
function processComponents(catalog, schema, defs, options) {
	if (catalog.components.size === 0) {
		schema["components"] = {};
		return;
	}
	const componentsMap = {};
	for (const [name, comp] of catalog.components.entries()) componentsMap[name] = processSingleComponent(name, comp, defs, catalog, options);
	schema["components"] = componentsMap;
	defs["anyComponent"] = {
		oneOf: Array.from(catalog.components.keys()).map((name) => ({ $ref: `#/components/${name}` })),
		discriminator: { propertyName: "component" }
	};
}
function processSingleFunction(_name, fn, defs) {
	let paramSchemaObj;
	if (fn.schema && typeof fn.schema === "object" && "safeParse" in fn.schema) {
		const rawZod = zodToJsonSchema(fn.schema, {
			target: "jsonSchema2019-09",
			$refStrategy: "none"
		});
		cleanSchemaNode(rawZod);
		if (rawZod.definitions && typeof rawZod.definitions === "object") {
			Object.assign(defs, rawZod.definitions);
			delete rawZod.definitions;
		} else if (rawZod.$defs && typeof rawZod.$defs === "object") {
			Object.assign(defs, rawZod.$defs);
			delete rawZod.$defs;
		}
		paramSchemaObj = rawZod;
	} else paramSchemaObj = {
		type: "object",
		properties: {}
	};
	if (fn.description && paramSchemaObj.description === void 0) paramSchemaObj.description = fn.description;
	if (paramSchemaObj.type === "object") {
		const rawExtra = paramSchemaObj.unevaluatedProperties ?? paramSchemaObj.additionalProperties;
		const additionalProps = typeof rawExtra === "boolean" || typeof rawExtra === "object" && rawExtra !== null ? rawExtra : void 0;
		if (paramSchemaObj.additionalProperties !== void 0) delete paramSchemaObj.additionalProperties;
		paramSchemaObj.unevaluatedProperties = additionalProps !== void 0 ? additionalProps : false;
	}
	return paramSchemaObj;
}
function processFunctions(catalog, schema, defs) {
	if (catalog.functions.size === 0) return;
	const functionsMap = {};
	for (const [name, fn] of catalog.functions.entries()) functionsMap[name] = processSingleFunction(name, fn, defs);
	schema["functions"] = functionsMap;
	defs["anyFunction"] = { oneOf: Array.from(catalog.functions.keys()).map((name) => ({ $ref: `#/functions/${name}` })) };
}
function collectReferencedDefs(node, referenced, visited = /* @__PURE__ */ new Set()) {
	if (typeof node !== "object" || node === null) return;
	if (visited.has(node)) return;
	visited.add(node);
	if (typeof node["$ref"] === "string") {
		const ref = node["$ref"];
		if (ref.startsWith("#/$defs/")) referenced.add(ref.substring(8));
	}
	if (Array.isArray(node)) for (const item of node) collectReferencedDefs(item, referenced, visited);
	else for (const val of Object.values(node)) collectReferencedDefs(val, referenced, visited);
}
/**
* Reconstructs a specification-compliant A2UI catalog JSON Schema document from a Catalog instance.
*
* Converts component and function Zod schemas into standardized JSON Schema definitions,
* merging sub-definitions, resolving common type references, and building union schemas.
*
* @param catalog The catalog instance to serialize.
* @param options Optional configuration options such as component envelope wrapping.
* @returns Specification-compliant A2UI Catalog JSON Schema object.
*/
function generateCatalogSchema(catalog, options) {
	const schema = {
		$schema: "https://json-schema.org/draft/2020-12/schema",
		catalogId: catalog.id
	};
	if (catalog.instructions) schema["instructions"] = catalog.instructions;
	const defs = {};
	processTheme(catalog, defs);
	processComponents(catalog, schema, defs, options);
	processFunctions(catalog, schema, defs);
	const standardDefs = getStandardDefsForCatalog(catalog, options);
	let defsCountBefore;
	do {
		defsCountBefore = Object.keys(defs).length;
		const referenced = /* @__PURE__ */ new Set();
		collectReferencedDefs(schema, referenced);
		collectReferencedDefs(defs, referenced);
		if (referenced.has("DynamicString") || referenced.has("DynamicNumber") || referenced.has("DynamicBoolean") || referenced.has("DynamicValue")) {
			referenced.add("DataBinding");
			referenced.add("FunctionCall");
		}
		for (const refName of referenced) if (refName in standardDefs && !(refName in defs)) defs[refName] = standardDefs[refName];
	} while (Object.keys(defs).length > defsCountBefore);
	if (Object.keys(defs).length > 0) schema["$defs"] = defs;
	return schema;
}
/**
* Extracts the target definition name from a JSON Schema `$ref` pointer or URI.
*
* Examples:
* - `https://a2ui.org/specification/v1_0/common_types.json#/$defs/ChildList` -> `ChildList`
* - `common_types.json#/definitions/ComponentId` -> `ComponentId`
* - `#/definitions/Child` -> `Child`
*
* @param ref The JSON Schema reference string or URI.
* @returns Target definition name.
*/
function extractRefDefName(ref) {
	if (!ref) return "";
	const hashIdx = ref.lastIndexOf("#");
	return (hashIdx !== -1 ? ref.slice(hashIdx + 1) : ref).split("/").filter(Boolean).pop() ?? "";
}
function unwrapNextZodLayer(current, visited) {
	if (!current?._def) return null;
	if (visited) {
		if (visited.has(current)) return null;
		visited.add(current);
	}
	switch (current._def.typeName) {
		case "ZodOptional":
		case "ZodNullable":
		case "ZodDefault":
		case "ZodReadonly": return current._def.innerType;
		case "ZodBranded": return current._def.type;
		case "ZodEffects": return current._def.schema;
		case "ZodLazy": return current._def.getter();
		default: return null;
	}
}
function getDescriptions(type) {
	const descriptions = [];
	const visited = /* @__PURE__ */ new Set();
	let current = type;
	while (current) {
		if (current.description) descriptions.push(current.description);
		if (current._def?.description) descriptions.push(current._def.description);
		const next = unwrapNextZodLayer(current, visited);
		if (!next) break;
		current = next;
	}
	return descriptions;
}
function unwrapZodType(type) {
	const visited = /* @__PURE__ */ new Set();
	let current = type;
	while (current) {
		const next = unwrapNextZodLayer(current, visited);
		if (!next) break;
		current = next;
	}
	return current;
}
function checkDirectJsonRef(ref, options) {
	if (!ref) return null;
	const defName = extractRefDefName(ref);
	const childListNames = options.childListRefNames;
	const childNames = options.childRefNames;
	if (childListNames.has(defName)) return {
		isChild: false,
		isChildList: true
	};
	if (childNames.has(defName)) return {
		isChild: true,
		isChildList: false
	};
	return null;
}
function checkCombinerList(list, options) {
	let hasChild = false;
	for (const sub of list) {
		if (typeof sub !== "object" || sub === null) continue;
		const subRes = checkJsonSchemaRef(sub, options);
		if (subRes.isChildList) return {
			isChild: false,
			isChildList: true
		};
		if (subRes.isChild) hasChild = true;
	}
	return hasChild ? {
		isChild: true,
		isChildList: false
	} : null;
}
function checkCombinerRefs(schema, options) {
	let hasChild = false;
	for (const combiner of [
		"oneOf",
		"anyOf",
		"allOf"
	]) {
		const list = schema[combiner];
		if (!Array.isArray(list)) continue;
		const res = checkCombinerList(list, options);
		if (res?.isChildList) return res;
		if (res?.isChild) hasChild = true;
	}
	return hasChild ? {
		isChild: true,
		isChildList: false
	} : null;
}
function checkJsonSchemaRef(schema, options) {
	const directMatch = checkDirectJsonRef(typeof schema.$ref === "string" ? schema.$ref : "", options);
	if (directMatch) return directMatch;
	if (schema.type === "array" && schema.items) {
		const itemsRes = checkJsonSchemaRef(schema.items, options);
		if (itemsRes.isChild || itemsRes.isChildList) return {
			isChild: false,
			isChildList: true
		};
	}
	const combinerMatch = checkCombinerRefs(schema, options);
	if (combinerMatch) return combinerMatch;
	if (schema.type === "object" && schema.properties && ("componentId" in schema.properties && ("path" in schema.properties || "dataBinding" in schema.properties) || "explicitList" in schema.properties || "template" in schema.properties)) return {
		isChild: false,
		isChildList: true
	};
	return {
		isChild: false,
		isChildList: false
	};
}
function isTemplateShape(unwrappedOpt) {
	if (unwrappedOpt?._def?.typeName === "ZodObject" && typeof unwrappedOpt._def.shape === "function") {
		const shape = unwrappedOpt._def.shape();
		return Boolean(shape.componentId && (shape.path || shape.dataBinding) || shape.explicitList || shape.template);
	}
	return false;
}
function isArrayOfChild(unwrappedOpt, options) {
	if (unwrappedOpt?._def?.typeName === "ZodArray") return analyzeChildRefSchema(unwrapZodType(unwrappedOpt._def.type), options).isChild;
	return false;
}
function analyzeUnionOptions(options, analysisOptions) {
	let hasTemplate = false;
	let hasArrayOfChild = false;
	let hasChildRef = false;
	for (const opt of options) {
		const unwrappedOpt = unwrapZodType(opt);
		if (isTemplateShape(unwrappedOpt)) hasTemplate = true;
		if (isArrayOfChild(unwrappedOpt, analysisOptions)) hasArrayOfChild = true;
		const optRes = analyzeChildRefSchema(unwrappedOpt, analysisOptions);
		if (optRes.isChildList) return {
			isChild: false,
			isChildList: true
		};
		if (optRes.isChild) hasChildRef = true;
	}
	if (hasTemplate || hasArrayOfChild) return {
		isChild: false,
		isChildList: true
	};
	if (hasChildRef) return {
		isChild: true,
		isChildList: false
	};
	return {
		isChild: false,
		isChildList: false
	};
}
function isChildListDescription(desc, childListNames) {
	if (!desc) return false;
	if (desc.startsWith("REF:")) {
		const refTarget = extractRefDefName(desc.substring(4).split("|")[0]);
		if (childListNames.has(refTarget)) return true;
	}
	const refTarget = extractRefDefName(desc.split("|")[0]);
	if (refTarget && childListNames.has(refTarget)) return true;
	const trimmed = desc.trim();
	if (childListNames.has(trimmed)) return true;
	return false;
}
function isChildDescription(desc, childNames) {
	if (!desc) return false;
	if (desc.startsWith("REF:")) {
		const refTarget = extractRefDefName(desc.substring(4).split("|")[0]);
		if (childNames.has(refTarget)) return true;
	}
	const refTarget = extractRefDefName(desc.split("|")[0]);
	if (refTarget && childNames.has(refTarget)) return true;
	const trimmed = desc.trim();
	if (childNames.has(trimmed)) return true;
	return false;
}
function checkDescriptionChildRef(descriptions, options) {
	const childListNames = options.childListRefNames;
	const childNames = options.childRefNames;
	for (const desc of descriptions) {
		if (isChildListDescription(desc, childListNames)) return {
			isChild: false,
			isChildList: true
		};
		if (isChildDescription(desc, childNames)) return {
			isChild: true,
			isChildList: false
		};
	}
	return null;
}
function analyzeZodArray(elem, options) {
	const elemRes = analyzeChildRefSchema(elem, options);
	if (elemRes.isChild || elemRes.isChildList) return {
		isChild: false,
		isChildList: true
	};
	return {
		isChild: false,
		isChildList: false
	};
}
/**
* Analyzes a property schema (Zod schema or JSON Schema definition) to determine
* if it represents a single component child reference (ComponentId) or child list (ChildList).
*
* Inspects explicit metadata stamps (`markChildRef`), $ref pointer targets (e.g.
* `common_types.json#/$defs/ChildList`, `common_types.json#/$defs/ComponentId`,
* `common_types.json#/$defs/Child`), schema descriptions with REF: prefixes,
* structural unions (`{ componentId, path }` templates), and arrays of component IDs.
*
* @param schema Zod schema, JSON Schema object, or property schema definition.
* @param options Required configuration specifying recognized child definition names.
* @returns ChildRefAnalysis containing `isChild` and `isChildList` booleans.
*/
function analyzeChildRefSchema(schema, options) {
	if (!schema || typeof schema !== "object") return {
		isChild: false,
		isChildList: false
	};
	const directKind = childRefKindOf(schema);
	if (directKind === "component-id") return {
		isChild: true,
		isChildList: false
	};
	if (directKind === "child-list") return {
		isChild: false,
		isChildList: true
	};
	const descMatch = checkDescriptionChildRef(getDescriptions(schema), options);
	if (descMatch) return descMatch;
	const current = unwrapZodType(schema);
	if (!current?._def) return checkJsonSchemaRef(schema, options);
	const unwrappedKind = childRefKindOf(current);
	if (unwrappedKind === "component-id") return {
		isChild: true,
		isChildList: false
	};
	if (unwrappedKind === "child-list") return {
		isChild: false,
		isChildList: true
	};
	const typeName = current._def.typeName;
	if (typeName === "ZodArray") return analyzeZodArray(unwrapZodType(current._def.type), options);
	if (typeName === "ZodUnion") return analyzeUnionOptions(current._def.options ?? [], options);
	if (typeName === "ZodObject" && typeof current._def.shape === "function") {
		const shape = current._def.shape();
		if (shape.componentId && (shape.path || shape.dataBinding) || shape.explicitList || shape.template) return {
			isChild: false,
			isChildList: true
		};
	}
	return {
		isChild: false,
		isChildList: false
	};
}
function addNestedRef(acc, key, subKey) {
	const existing = acc.nestedRefs[key];
	if (existing) {
		existing.add(subKey);
		return;
	}
	acc.nestedRefs[key] = /* @__PURE__ */ new Set([subKey]);
}
function inspectShapeField(key, fieldSchema, acc, options) {
	const res = analyzeChildRefSchema(fieldSchema, options);
	if (res.isChildList) {
		acc.listRefs.add(key);
		return;
	}
	if (res.isChild) {
		acc.singleRefs.add(key);
		return;
	}
	const inner = unwrapZodType(fieldSchema);
	if (inner?._def?.typeName !== "ZodArray") return;
	const elem = unwrapZodType(inner._def.type);
	if (elem?._def?.typeName !== "ZodObject" || typeof elem._def.shape !== "function") return;
	const elemShape = elem._def.shape();
	for (const [subKey, subSchema] of Object.entries(elemShape)) {
		const subRes = analyzeChildRefSchema(subSchema, options);
		if (subRes.isChild || subRes.isChildList) {
			acc.listRefs.add(key);
			addNestedRef(acc, key, subKey);
		}
	}
}
/**
* Returns the `properties` of an array property's item schema, or null when the
* schema is not an array of inline structured objects.
*/
function rawArrayItemProperties(propSchema) {
	if (typeof propSchema !== "object" || propSchema === null) return null;
	const schema = propSchema;
	if (schema["type"] !== "array" && !("items" in schema)) return null;
	const items = schema["items"];
	if (typeof items !== "object" || items === null) return null;
	const itemProps = items["properties"];
	if (typeof itemProps !== "object" || itemProps === null) return null;
	return itemProps;
}
function inspectRawProperties(properties, acc, options) {
	for (const [key, propSchema] of Object.entries(properties)) {
		const res = analyzeChildRefSchema(propSchema, options);
		if (res.isChildList) {
			acc.listRefs.add(key);
			continue;
		}
		if (res.isChild) {
			acc.singleRefs.add(key);
			continue;
		}
		const itemProps = rawArrayItemProperties(propSchema);
		if (!itemProps) continue;
		for (const [subKey, subSchema] of Object.entries(itemProps)) {
			const subRes = analyzeChildRefSchema(subSchema, options);
			if (subRes.isChild || subRes.isChildList) {
				acc.listRefs.add(key);
				addNestedRef(acc, key, subKey);
			}
		}
	}
}
function inspectComponentSchema(schema, acc, options) {
	if (!schema) return;
	const current = unwrapZodType(schema);
	if (current?._def?.typeName === "ZodObject" && typeof current._def.shape === "function") {
		const shape = current._def.shape();
		for (const [key, fieldSchema] of Object.entries(shape)) inspectShapeField(key, fieldSchema, acc, options);
		return;
	}
	if (typeof schema === "object" && schema !== null && "properties" in schema) {
		const rawProps = schema.properties;
		if (typeof rawProps === "object" && rawProps !== null) inspectRawProperties(rawProps, acc, options);
	}
}
/**
* Builds a ComponentRefMap dynamically by inspecting component Zod schemas.
*
* @param catalogOrComponents Catalog instance, array of ComponentApi objects, or Map of ComponentApis.
* @param options Required configuration specifying recognized child definition names.
* @returns ComponentRefMap containing single, list, and nested reference properties.
*/
function buildComponentRefMap(catalogOrComponents, options) {
	const refMap = {};
	const componentApis = typeof catalogOrComponents?.components?.values === "function" ? Array.from(catalogOrComponents.components.values()) : Array.isArray(catalogOrComponents) ? catalogOrComponents : Array.from(catalogOrComponents.values());
	for (const compApi of componentApis) {
		const acc = {
			singleRefs: /* @__PURE__ */ new Set(),
			listRefs: /* @__PURE__ */ new Set(),
			nestedRefs: {}
		};
		inspectComponentSchema(compApi.schema, acc, options);
		refMap[compApi.name] = {
			singleRefs: acc.singleRefs,
			listRefs: acc.listRefs,
			nestedRefs: acc.nestedRefs
		};
	}
	return refMap;
}
/**
* Creates a typed FunctionImplementation from an API definition and an execution callback.
*
* @param api The function API definition containing name, schema, and metadata.
* @param execute The execution handler callback.
* @returns A complete FunctionImplementation object.
*/
function createFunctionImplementation(api, execute) {
	return {
		name: api.name,
		returnType: api.returnType,
		schema: api.schema,
		allowedCallers: api.allowedCallers,
		requiresUserActivation: api.requiresUserActivation,
		description: api.description,
		execute
	};
}
/**
* Collection of available components and functions.
*
* The `F` parameter distinguishes catalogs that carry executable function
* implementations (`FunctionImplementation`, the default and the only kind a
* renderer should hold) from schema-only catalogs (`FunctionApi`), whose
* functions are signatures loaded from catalog JSON with no code attached.
* Consumers that need to execute functions, such as `NodeResolver`, constrain
* `F` to `FunctionImplementation` so a schema-only catalog is rejected at
* compile time rather than resolving values to `undefined` at runtime.
*/
var Catalog = class {
	/**
	* Dynamically reconstructs and memoizes the unified standard A2UI catalog JSON Schema document.
	*/
	get catalogSchema() {
		if (!this.cachedCatalogSchema) this.cachedCatalogSchema = generateCatalogSchema(this);
		return this.cachedCatalogSchema;
	}
	/**
	* Lazily computed component reference map for child reference extraction and topology validation.
	*/
	get componentRefMap() {
		if (!this._componentRefMap) this._componentRefMap = buildComponentRefMap(this, V09_CHILD_REF_OPTIONS);
		return this._componentRefMap;
	}
	/**
	* Initializes a new `Catalog`.
	*
	* @param id Unique identifier for the catalog, usually a URI.
	* @param protocolVersion Protocol specification version this catalog targets.
	* @param components Component definitions to register.
	* @param functions Function definitions to register.
	* @param themeSchema Optional schema for this catalog's theme parameters.
	* @param instructions Optional system instructions or usage guidelines.
	* @throws {A2uiCatalogError} If `protocolVersion` is empty or not provided.
	*/
	constructor(id, protocolVersion, components = [], functions = [], themeSchema, instructions) {
		if (!protocolVersion) throw new A2uiCatalogError("protocolVersion must be provided.");
		this.id = id;
		this.protocolVersion = protocolVersion;
		const compMap = /* @__PURE__ */ new Map();
		for (const comp of components) compMap.set(comp.name, comp);
		this.components = compMap;
		const funcMap = /* @__PURE__ */ new Map();
		for (const fn of functions) funcMap.set(fn.name, fn);
		this.functions = funcMap;
		this.themeSchema = themeSchema;
		this.instructions = instructions;
		this.invoker = (name, rawArgs, ctx, abortSignal) => {
			const fn = this.functions.get(name);
			if (!fn) throw new A2uiExpressionError(`Function not found in catalog '${this.id}': ${name}`, name);
			const execute = fn.execute;
			if (typeof execute !== "function") throw new A2uiExpressionError(`Function '${name}' in catalog '${this.id}' is schema-only and has no implementation.`, name);
			try {
				const safeArgs = fn.schema.parse(rawArgs);
				return execute.call(fn, safeArgs, ctx, abortSignal);
			} catch (e) {
				if (e?.name === "ZodError" || e instanceof ZodError) throw new A2uiExpressionError(`Validation failed for function '${name}': ${e.message}`, name, e.errors ?? e.issues);
				throw e;
			}
		};
	}
	/**
	* Constructs a schema-only Catalog directly from a raw A2UI catalog schema.
	*
	* @param catalogSchema Raw catalog schema or client capabilities payload object.
	* @param protocolVersion Protocol version to use when the schema does not
	*   declare one. Catalog schemas published before v1.0 omit the field, in
	*   which case `DEFAULT_PROTOCOL_VERSION` applies.
	* @returns A new Catalog populated with component and function schemas.
	* @throws {Error} If the catalog ID is missing or not a string.
	*/
	static fromSchema(catalogSchema, protocolVersion) {
		return loadCatalogFromSchema(catalogSchema, protocolVersion);
	}
};
/**
* Event emitter implementation supporting subscriptions and asynchronous broadcasting.
*/
var EventEmitter = class {
	constructor() {
		this.listeners = /* @__PURE__ */ new Set();
	}
	/**
	* Subscribes to the event.
	*
	* @param listener The listener function to call when the event is emitted.
	* @returns A subscription object that can be used to unsubscribe.
	*/
	subscribe(listener) {
		this.listeners.add(listener);
		return { unsubscribe: () => this.listeners.delete(listener) };
	}
	/**
	* Emits an event to all subscribers.
	*
	* @param data The data to pass to subscribers.
	*/
	async emit(data) {
		for (const listener of this.listeners) try {
			await listener(data);
		} catch (e) {
			console.error("EventEmitter error:", e);
		}
	}
	/**
	* Removes all registered listeners and disposes the emitter.
	*/
	dispose() {
		this.listeners.clear();
	}
};
var i$9 = Symbol.for("preact-signals");
function t$7() {
	if (!(v$2 > 1)) {
		var i, t = !1;
		(function() {
			var i = c$8;
			c$8 = void 0;
			while (void 0 !== i) {
				var t = i.S;
				if (t.v === i.v) {
					for (var n = t.t; void 0 !== n; n = n.x) if (n.i === i.i) n.i = t.i;
				}
				i = i.o;
			}
		})();
		while (void 0 !== h$4) {
			var n = h$4;
			h$4 = void 0;
			s$9++;
			while (void 0 !== n) {
				var r = n.u;
				n.u = void 0;
				n.f &= -3;
				if (!(8 & n.f) && w$1(n)) try {
					n.c();
				} catch (n) {
					if (!t) {
						i = n;
						t = !0;
					}
				}
				n = r;
			}
		}
		s$9 = 0;
		v$2--;
		if (t) throw i;
	} else v$2--;
}
function n$11(i) {
	if (v$2 > 0) return i();
	e$12 = ++u$5;
	v$2++;
	try {
		return i();
	} finally {
		t$7();
	}
}
var r$9;
var o$11 = void 0;
function f$4(i) {
	var t = o$11, n = r$9;
	o$11 = void 0;
	r$9 = void 0;
	try {
		return i();
	} finally {
		o$11 = t;
		r$9 = n;
	}
}
var h$4 = void 0;
var v$2 = 0;
var s$9 = 0;
var u$5 = 0;
var e$12 = 0;
var c$8 = void 0;
var d$3 = 0;
function a$3(i) {
	if (void 0 !== o$11) {
		var t = i.n;
		if (void 0 === t || t.t !== o$11) {
			t = {
				i: 0,
				S: i,
				p: o$11.s,
				n: void 0,
				t: o$11,
				e: void 0,
				x: void 0,
				r: t
			};
			if (void 0 !== o$11.s) o$11.s.n = t;
			o$11.s = t;
			i.n = t;
			if (32 & o$11.f) i.S(t);
			return t;
		} else if (-1 === t.i) {
			t.i = 0;
			if (void 0 !== t.n) {
				t.n.p = t.p;
				if (void 0 !== t.p) t.p.n = t.n;
				t.p = o$11.s;
				t.n = void 0;
				o$11.s.n = t;
				o$11.s = t;
			}
			return t;
		}
	}
}
function l$4(i, t) {
	this.v = i;
	this.i = 0;
	this.n = void 0;
	this.t = void 0;
	this.l = 0;
	this.W = null == t ? void 0 : t.watched;
	this.Z = null == t ? void 0 : t.unwatched;
	this.name = null == t ? void 0 : t.name;
}
l$4.prototype.brand = i$9;
l$4.prototype.h = function() {
	return !0;
};
l$4.prototype.S = function(i) {
	var t = this, n = this.t;
	if (n !== i && void 0 === i.e) {
		i.x = n;
		this.t = i;
		if (void 0 !== n) n.e = i;
		else f$4(function() {
			var i;
			null == (i = t.W) || i.call(t);
		});
	}
};
l$4.prototype.U = function(i) {
	var t = this;
	if (void 0 !== this.t) {
		var n = i.e, r = i.x;
		if (void 0 !== n) {
			n.x = r;
			i.e = void 0;
		}
		if (void 0 !== r) {
			r.e = n;
			i.x = void 0;
		}
		if (i === this.t) {
			this.t = r;
			if (void 0 === r) f$4(function() {
				var i;
				null == (i = t.Z) || i.call(t);
			});
		}
	}
};
l$4.prototype.subscribe = function(i) {
	var t = this;
	return j$2(function() {
		var n = t.value;
		f$4(function() {
			return i(n);
		});
	}, { name: "sub" });
};
l$4.prototype.valueOf = function() {
	return this.value;
};
l$4.prototype.toString = function() {
	return this.value + "";
};
l$4.prototype.toJSON = function() {
	return this.value;
};
l$4.prototype.peek = function() {
	var i = this;
	return f$4(function() {
		return i.value;
	});
};
Object.defineProperty(l$4.prototype, "value", {
	get: function() {
		var i = a$3(this);
		if (void 0 !== i) i.i = this.i;
		return this.v;
	},
	set: function(i) {
		if (i !== this.v) {
			if (s$9 > 100) throw new Error("Cycle detected");
			(function(i) {
				if (0 !== v$2 && 0 === s$9) {
					if (i.l !== e$12) {
						i.l = e$12;
						c$8 = {
							S: i,
							v: i.v,
							i: i.i,
							o: c$8
						};
					}
				}
			})(this);
			this.v = i;
			this.i++;
			d$3++;
			v$2++;
			try {
				for (var n = this.t; void 0 !== n; n = n.x) n.t.N();
			} finally {
				t$7();
			}
		}
	}
});
function y$2(i, t) {
	return new l$4(i, t);
}
function w$1(i) {
	for (var t = i.s; void 0 !== t; t = t.n) if (t.S.i !== t.i || !t.S.h() || t.S.i !== t.i) return !0;
	return !1;
}
function _$1(i) {
	for (var t = i.s; void 0 !== t; t = t.n) {
		var n = t.S.n;
		if (void 0 !== n) t.r = n;
		t.S.n = t;
		t.i = -1;
		if (void 0 === t.n) {
			i.s = t;
			break;
		}
	}
}
function b$2(i) {
	var t = i.s, n = void 0;
	while (void 0 !== t) {
		var r = t.p;
		if (-1 === t.i) {
			t.S.U(t);
			if (void 0 !== r) r.n = t.n;
			if (void 0 !== t.n) t.n.p = r;
		} else n = t;
		t.S.n = t.r;
		if (void 0 !== t.r) t.r = void 0;
		t = r;
	}
	i.s = n;
}
function p$3(i, t) {
	l$4.call(this, void 0, t);
	this.x = i;
	this.s = void 0;
	this.g = d$3 - 1;
	this.f = 4;
}
p$3.prototype = new l$4();
p$3.prototype.h = function() {
	this.f &= -3;
	if (1 & this.f) return !1;
	if (32 == (36 & this.f)) return !0;
	this.f &= -5;
	if (this.g === d$3) return !0;
	this.g = d$3;
	this.f |= 1;
	if (this.i > 0 && !w$1(this)) {
		this.f &= -2;
		return !0;
	}
	var i = o$11;
	try {
		_$1(this);
		o$11 = this;
		var t = this.x();
		if (16 & this.f || this.v !== t || 0 === this.i) {
			this.v = t;
			this.f &= -17;
			this.i++;
		}
	} catch (i) {
		this.v = i;
		this.f |= 16;
		this.i++;
	}
	o$11 = i;
	b$2(this);
	this.f &= -2;
	return !0;
};
p$3.prototype.S = function(i) {
	if (void 0 === this.t) {
		this.f |= 36;
		for (var t = this.s; void 0 !== t; t = t.n) t.S.S(t);
	}
	l$4.prototype.S.call(this, i);
};
p$3.prototype.U = function(i) {
	if (void 0 !== this.t) {
		l$4.prototype.U.call(this, i);
		if (void 0 === this.t) {
			this.f &= -33;
			for (var t = this.s; void 0 !== t; t = t.n) t.S.U(t);
		}
	}
};
p$3.prototype.N = function() {
	if (!(2 & this.f)) {
		this.f |= 6;
		for (var i = this.t; void 0 !== i; i = i.x) i.t.N();
	}
};
Object.defineProperty(p$3.prototype, "value", { get: function() {
	if (1 & this.f) throw new Error("Cycle detected");
	var i = a$3(this);
	this.h();
	if (void 0 !== i) i.i = this.i;
	if (16 & this.f) throw this.v;
	return this.v;
} });
function g$1(i, t) {
	return new p$3(i, t);
}
function S$2(i) {
	var n = i.m;
	i.m = void 0;
	if ("function" == typeof n) {
		v$2++;
		var r = o$11;
		o$11 = void 0;
		try {
			n();
		} catch (t) {
			i.f &= -2;
			i.f |= 8;
			m$2(i);
			throw t;
		} finally {
			o$11 = r;
			t$7();
		}
	}
}
function m$2(i) {
	for (var t = i.s; void 0 !== t; t = t.n) t.S.U(t);
	i.x = void 0;
	i.s = void 0;
	S$2(i);
}
function x$1(i) {
	if (o$11 !== this) throw new Error("Out-of-order effect");
	b$2(this);
	o$11 = i;
	this.f &= -2;
	if (8 & this.f) m$2(this);
	t$7();
}
function E$1(i, t) {
	this.x = i;
	this.m = void 0;
	this.s = void 0;
	this.u = void 0;
	this.f = 32;
	this.name = null == t ? void 0 : t.name;
	if (r$9) r$9.push(this);
}
E$1.prototype.c = function() {
	var i = this.S();
	try {
		if (8 & this.f) return;
		if (void 0 === this.x) return;
		var t = this.x();
		if ("function" == typeof t) this.m = t;
	} finally {
		i();
	}
};
E$1.prototype.S = function() {
	if (1 & this.f) throw new Error("Cycle detected");
	this.f |= 1;
	this.f &= -9;
	S$2(this);
	_$1(this);
	v$2++;
	var i = o$11;
	o$11 = this;
	return x$1.bind(this, i);
};
E$1.prototype.N = function() {
	if (!(2 & this.f)) {
		this.f |= 2;
		this.u = h$4;
		h$4 = this;
	}
};
E$1.prototype.d = function() {
	this.f |= 8;
	if (!(1 & this.f)) m$2(this);
};
E$1.prototype.dispose = function() {
	this.d();
};
function j$2(i, t) {
	var n = new E$1(i, t);
	try {
		n.c();
	} catch (i) {
		n.d();
		throw i;
	}
	var r = n.d.bind(n);
	r[Symbol.dispose] = r;
	return r;
}
let signalImpl;
let computedImpl;
let effectImpl;
let batchWriteImpl;
let isSignalImpl;
let getValueImpl;
let setValueImpl;
let peekValueImpl;
setSignalImplementation({
	signal: y$2,
	computed: g$1,
	effect: j$2,
	batchWrite: n$11,
	isSignal: (val) => !!val && typeof val === "object" && "value" in val && "peek" in val,
	getValue: (signal) => signal.value,
	setValue: (signal, value) => {
		if (!(signal instanceof p$3)) signal.value = value;
	},
	peekValue: (signal) => signal.peek()
});
/**
* Configures the active reactive signals implementation backend.
*
* Enables swapping the underlying reactivity library at runtime.
*
* @param impl Pluggable signal implementation operations.
*/
function setSignalImplementation(impl) {
	signalImpl = impl.signal;
	computedImpl = impl.computed;
	effectImpl = impl.effect;
	batchWriteImpl = impl.batchWrite;
	isSignalImpl = impl.isSignal;
	getValueImpl = impl.getValue;
	setValueImpl = impl.setValue;
	peekValueImpl = impl.peekValue;
}
/**
* Creates a reactive state signal initialized to the specified value.
*
* @param initialValue Initial value of the signal.
* @returns A reactive state signal.
*/
function signal(initialValue) {
	return signalImpl(initialValue);
}
/**
* Creates a derived reactive signal that recomputes when dependencies change.
*
* @param computeFn Calculation callback producing the derived value.
* @returns A reactive read-only computed signal.
*/
function computed(computeFn) {
	return computedImpl(computeFn);
}
/**
* Runs a side-effect callback reactively when accessed signals change.
*
* @param effectFn Callback to execute, optionally returning a cleanup function.
* @returns A disposal function that cancels the effect subscription.
*/
function effect(effectFn) {
	return effectImpl(effectFn);
}
/**
* Batches multiple signal updates to defer subscriber notifications until complete.
*
* @param batchFn Callback enclosing signal mutations.
*/
function batchWrite(batchFn) {
	return batchWriteImpl(batchFn);
}
/**
* Checks whether a given value is a reactive Signal.
*
* @param val Value to test.
* @returns Whether the value is a Signal.
*/
function isSignal(val) {
	return isSignalImpl(val);
}
/**
* Reads the current value of a signal, subscribing the active reactive context.
*
* @param signal Target signal to read.
* @returns The current value of the signal.
*/
function getValue(signal) {
	return getValueImpl(signal);
}
/**
* Updates the current value of a writable signal, notifying subscribers.
*
* @param signal Target signal to update.
* @param value New value to assign.
*/
function setValue(signal, value) {
	setValueImpl(signal, value);
}
/**
* Reads the current value of a signal without creating a reactive subscription.
*
* @param signal Target signal to read.
* @returns The current value of the signal.
*/
function peekValue(signal) {
	return peekValueImpl(signal);
}
function isNumeric(value) {
	return /^(0|[1-9]\d*)$/.test(value);
}
/**
* The maximum array index that auto-vivification and array mutations will expand to.
* Prevents OOM and thread hangs from excessively large indices.
*/
const MAX_ARRAY_INDEX = 1e4;
/**
* Keys forbidden in path resolution to prevent prototype pollution
* vulnerabilities. Accessing or mutating these keys via object paths can allow
* attackers to modify Object.prototype or Function.prototype.
*/
const FORBIDDEN_KEYS = /* @__PURE__ */ new Set([
	"__proto__",
	"constructor",
	"prototype"
]);
/**
* Observable data store representing the renderer-side state.
*
* Handles JSON Pointer path resolution, mutation, and reactive subscriptions.
*/
var DataModel = class {
	/**
	* Initializes a new `DataModel` instance.
	*
	* @param initialData Initial data for the model. Defaults to an empty object.
	*/
	constructor(initialData = {}) {
		this.data = {};
		this.signals = /* @__PURE__ */ new Map();
		this.subscriptions = /* @__PURE__ */ new Set();
		this.data = initialData;
	}
	/**
	* Retrieves a Preact Signal for a specific data path.
	*
	* This provides a reactive way to access a value. If the value at the path
	* changes via `set()`, the signal will automatically be updated.
	*
	* @param path The JSON pointer path to create or retrieve a signal for.
	* @returns A Preact Signal representing the value at the specified path.
	* @throws {A2uiDataError} If path is null, undefined, or contains forbidden
	*     segments (`__proto__`, `constructor`, `prototype`).
	*/
	getSignal(path) {
		const normalizedPath = this.normalizePath(path);
		if (!this.signals.has(normalizedPath)) this.signals.set(normalizedPath, signal(this.get(normalizedPath)));
		return this.signals.get(normalizedPath);
	}
	/**
	* Updates the model at the specific path and notifies all relevant signals.
	* If path is '/' or empty, replaces the entire root.
	*
	* Note on `undefined` values:
	* - For objects: Setting a property to `undefined` removes the key from the
	* object.
	* - For arrays: Setting an index to `undefined` sets that index to
	* `undefined` but preserves the array length (sparse array).
	*
	* @param path The JSON pointer path to set value for.
	* @param value The value to set at the specified path.
	* @returns This `DataModel` instance for chaining.
	* @throws {A2uiDataError} If path is null, undefined, invalid for
	*     arrays/primitives, exceeds max array bounds, or contains forbidden
	*     segments (`__proto__`, `constructor`, `prototype`).
	*/
	set(path, value) {
		if (path === null || path === void 0) throw new A2uiDataError("Path cannot be null or undefined.");
		if (path === "/" || path === "") {
			this.data = value === null || value === void 0 ? {} : value;
			this.notifyAllSignals();
			return this;
		}
		const segments = this.parsePath(path);
		const lastSegment = segments.pop();
		if ((value === void 0 || value === null) && this.get(path) === void 0) return this;
		if (this.data === void 0 || this.data === null) this.data = {};
		else if (typeof this.data !== "object") throw new A2uiDataError(`Cannot set path '${path}': the data model root is a primitive value.`, path);
		let current = this.data;
		for (let i = 0; i < segments.length; i++) {
			const segment = segments[i];
			if (Array.isArray(current)) {
				if (!isNumeric(segment)) throw new A2uiDataError(`Cannot use non-numeric segment '${segment}' on an array in path '${path}'.`, path);
				const index = parseInt(segment, 10);
				if (index > 1e4) throw new A2uiDataError(`Cannot set path '${path}': array index '${segment}' exceeds maximum supported index (${MAX_ARRAY_INDEX}).`, path);
				const val = current[index];
				if (val !== void 0 && val !== null && typeof val !== "object") throw new A2uiDataError(`Cannot set path '${path}': segment '${segment}' is a primitive value.`, path);
				if (val === void 0 || val === null) {
					const nextSegment = i < segments.length - 1 ? segments[i + 1] : lastSegment;
					if (isNumeric(nextSegment)) {
						if (parseInt(nextSegment, 10) > 1e4) throw new A2uiDataError(`Cannot set path '${path}': array index '${nextSegment}' exceeds maximum supported index (${MAX_ARRAY_INDEX}).`, path);
						current[index] = [];
					} else current[index] = {};
				}
			} else {
				const hasOwnProp = Object.prototype.hasOwnProperty.call(current, segment);
				if (hasOwnProp) {
					const propVal = current[segment];
					if (propVal !== void 0 && propVal !== null && typeof propVal !== "object") throw new A2uiDataError(`Cannot set path '${path}': segment '${segment}' is a primitive value.`, path);
				}
				if (!hasOwnProp || current[segment] === void 0 || current[segment] === null) {
					const nextSegment = i < segments.length - 1 ? segments[i + 1] : lastSegment;
					if (isNumeric(nextSegment)) {
						if (parseInt(nextSegment, 10) > 1e4) throw new A2uiDataError(`Cannot set path '${path}': array index '${nextSegment}' exceeds maximum supported index (${MAX_ARRAY_INDEX}).`, path);
						current[segment] = [];
					} else current[segment] = {};
				}
			}
			current = current[segment];
		}
		if (Array.isArray(current)) {
			if (!isNumeric(lastSegment)) throw new A2uiDataError(`Cannot use non-numeric segment '${lastSegment}' on an array in path '${path}'.`, path);
			if (parseInt(lastSegment, 10) > 1e4) throw new A2uiDataError(`Cannot set path '${path}': array index '${lastSegment}' exceeds maximum supported index (${MAX_ARRAY_INDEX}).`, path);
		}
		if (value === void 0 || value === null) {
			if (Array.isArray(current)) {
				const idx = parseInt(lastSegment, 10);
				if (idx < current.length) current[idx] = void 0;
			} else delete current[lastSegment];
		} else current[lastSegment] = value;
		this.notifySignals(path);
		return this;
	}
	/**
	* Deletes the value at the specified JSON pointer path.
	*
	* If `path` is `'/'` or empty, resets the root data model to an empty object.
	*
	* @param path The JSON pointer path to remove.
	* @returns This `DataModel` instance for chaining.
	*/
	delete(path) {
		return this.set(path, void 0);
	}
	/**
	* Resolves a relative path against a base context path.
	*
	* @param path The path to resolve.
	* @param contextPath The base path (optional).
	* @returns The resolved absolute path.
	*/
	static resolvePath(path, contextPath) {
		if (path.startsWith("/")) return path;
		if (contextPath) return `${contextPath.endsWith("/") ? contextPath : `${contextPath}/`}${path}`;
		return `/${path}`;
	}
	/**
	* Retrieves data at a specific JSON pointer path.
	*
	* @template T The expected type of the returned value. Defaults to `any`.
	* @param path The JSON pointer path to read from.
	* @returns The value at the specified path, or undefined if not found.
	* @throws {A2uiDataError} If path is null, undefined, or contains forbidden
	*     segments (`__proto__`, `constructor`, `prototype`).
	*/
	get(path) {
		if (path === null || path === void 0) throw new A2uiDataError("Path cannot be null or undefined.");
		if (path === "/" || path === "") return this.data;
		const segments = this.parsePath(path);
		let current = this.data;
		for (const segment of segments) {
			if (current === void 0 || current === null || typeof current !== "object") return;
			if (Array.isArray(current)) {
				if (!isNumeric(segment)) return;
				const index = parseInt(segment, 10);
				if (index < 0 || index >= current.length) return;
				current = current[index];
			} else {
				if (!Object.prototype.hasOwnProperty.call(current, segment)) return;
				current = current[segment];
			}
		}
		return current;
	}
	/**
	* Checks whether a JSON pointer path physically exists in the data model.
	*
	* Differentiates between a path holding an explicit `null` value (`true`) and
	* a path that is absent from the object or array hierarchy (`false`).
	*
	* @param path Absolute JSON pointer path to check.
	* @returns Whether every segment along `path` exists in the hierarchy.
	*/
	hasPath(path) {
		if (path === null || path === void 0) return false;
		return this.get(path) !== void 0;
	}
	/**
	* Subscribes to changes at the specified data path.
	*
	* This is a backwards-compatible layer using Preact Signals internally. It
	* allows listeners to be notified whenever the value at the specified path
	* (or any of its ancestors/descendants) changes.
	*
	* @param path The JSON pointer path to observe.
	* @param onChange A callback fired whenever the value changes.
	* @returns A `DataSubscription` containing the initial value and an
	*     `unsubscribe` method.
	* @throws {A2uiDataError} If path is null, undefined, or contains forbidden
	*     segments (`__proto__`, `constructor`, `prototype`).
	*/
	subscribe(path, onChange) {
		const sig = this.getSignal(path);
		let isSync = true;
		let currentValue = peekValue(sig);
		const dispose = effect(() => {
			const val = getValue(sig);
			currentValue = val;
			if (!isSync) onChange(val);
		});
		isSync = false;
		this.subscriptions.add(dispose);
		return {
			get value() {
				return currentValue;
			},
			unsubscribe: () => {
				dispose();
				this.subscriptions.delete(dispose);
			}
		};
	}
	/**
	* Clears all internal subscriptions and active signals.
	*/
	dispose() {
		for (const dispose of this.subscriptions) dispose();
		this.subscriptions.clear();
		this.signals.clear();
	}
	normalizePath(path) {
		if (path.length > 1 && path.endsWith("/")) return path.slice(0, -1);
		return path || "/";
	}
	parsePath(path) {
		return path.split("/").filter((p) => p.length > 0).map((rawSegment) => {
			const segment = rawSegment.replace(/~([01])/g, (_, g) => g === "1" ? "/" : "~");
			if (FORBIDDEN_KEYS.has(segment)) throw new A2uiDataError(`Forbidden path segment '${segment}' in path '${path}'.`, path);
			return segment;
		});
	}
	notifySignals(path) {
		const normalizedPath = this.normalizePath(path);
		batchWrite(() => {
			this.updateSignal(normalizedPath);
			let parentPath = normalizedPath;
			while (parentPath !== "/" && parentPath !== "") {
				parentPath = parentPath.substring(0, parentPath.lastIndexOf("/")) || "/";
				this.updateSignal(parentPath);
			}
			for (const subPath of this.signals.keys()) if (this.isDescendant(subPath, normalizedPath)) this.updateSignal(subPath);
		});
	}
	updateSignal(path) {
		const sig = this.signals.get(path);
		if (sig) {
			const val = this.get(path);
			if (Array.isArray(val)) setValue(sig, val.slice());
			else if (typeof val === "object" && val !== null) setValue(sig, { ...val });
			else setValue(sig, val);
		}
	}
	notifyAllSignals() {
		batchWrite(() => {
			for (const path of this.signals.keys()) this.updateSignal(path);
		});
	}
	isDescendant(childPath, parentPath) {
		if (parentPath === "/" || parentPath === "") return childPath !== "/";
		return childPath.startsWith(parentPath + "/");
	}
};
/** Regex pattern matching valid JSON Pointer syntax (RFC 6901 compliant with optional relative path). */
const RELAXED_PATH_PATTERN = /^(?:(?:\/(?:[^~/]|~[01])*)*|(?:[^~/]|~[01])+(?:\/(?:[^~/]|~[01])*)*)$/;
/**
* Yields `[referencedId, path]` pairs for every child reference reachable from a
* property value.
*
* @param val The property value to walk.
* @param currentPath The property path accumulated so far.
* @param nestedKeys Item sub-keys the catalog declared as child references, for
*   a list property whose items are structured objects. When omitted, every
*   sub-key of such an item is walked.
*/
function* extractPointers(val, currentPath, nestedKeys) {
	if (typeof val === "string") yield [val, currentPath];
	else if (Array.isArray(val)) for (let idx = 0; idx < val.length; idx++) {
		const item = val[idx];
		yield* extractPointers(item, `${currentPath}[${idx}]`, nestedKeys);
	}
	else if (typeof val === "object" && val !== null) {
		const obj = val;
		if ("componentId" in obj && typeof obj.componentId === "string" && ("path" in obj || "dataBinding" in obj)) yield [obj.componentId, `${currentPath}.componentId`];
		else if (nestedKeys?.size) {
			for (const subKey of nestedKeys) if (subKey in obj) yield* extractPointers(obj[subKey], `${currentPath}.${subKey}`);
		} else for (const [subKey, subVal] of Object.entries(obj)) yield* extractPointers(subVal, `${currentPath}.${subKey}`);
	}
}
function getOrCreateRefMap(catalog) {
	return catalog.componentRefMap;
}
/**
* Extracts child component IDs referenced by a component property definition.
*
* @param component Component definition object containing properties and metadata.
* @param catalogOrRefMap Mapping defining single and list reference fields per component type or Catalog instance.
* @yields Tuple of `[referencedId, propertyPath]` for each child reference found.
*
* @example
* ```ts
* const refs = Array.from(getComponentReferences(boxComponent, catalog));
* ```
*/
function* getComponentReferences(component, catalogOrRefMap) {
	if (!component || typeof component !== "object") return;
	const refFieldsMap = catalogOrRefMap instanceof Catalog ? getOrCreateRefMap(catalogOrRefMap) : catalogOrRefMap;
	const compVal = component.component;
	let compType = "";
	let props = component;
	if (typeof compVal === "string") compType = compVal;
	else if (typeof compVal === "object" && compVal !== null) {
		const compObj = compVal;
		compType = Object.keys(compObj)[0] ?? "";
		props = compObj[compType] ?? {};
	}
	if (!compType || typeof props !== "object" || props === null) return;
	const childRefs = refFieldsMap[compType];
	const singleRefs = childRefs ? childRefs.singleRefs : /* @__PURE__ */ new Set();
	const listRefs = childRefs ? childRefs.listRefs : /* @__PURE__ */ new Set();
	const nestedRefs = childRefs?.nestedRefs;
	for (const [key, value] of Object.entries(props)) if (singleRefs.has(key) || listRefs.has(key)) yield* extractPointers(value, key, nestedRefs?.[key]);
}
Object.freeze({
	allowOrphanComponents: false,
	allowDanglingReferences: false,
	allowMissingRoot: false,
	allowUnknownElements: false
});
Object.freeze({
	allowOrphanComponents: true,
	allowDanglingReferences: true,
	allowMissingRoot: true,
	allowUnknownElements: true
});
function traverseRecursionAndPaths(item, globalDepth, funcDepth) {
	if (globalDepth > 50) throw new A2uiRecursionError(`Global recursion limit exceeded: Depth > 50`);
	if (Array.isArray(item)) {
		for (const x of item) traverseRecursionAndPaths(x, globalDepth + 1, funcDepth);
		return;
	}
	if (typeof item === "object" && item !== null) {
		const obj = item;
		if ("path" in obj && typeof obj.path === "string") {
			const path = obj.path;
			if (!RELAXED_PATH_PATTERN.test(path)) throw new A2uiValidationError(`Invalid path syntax: '${path}'`);
		}
		const isFunctionCallWrapper = "functionCall" in obj && typeof obj.functionCall === "object" && obj.functionCall !== null;
		const isBareFunctionCall = "call" in obj && "args" in obj;
		if (isFunctionCallWrapper) {
			if (funcDepth >= 5) throw new A2uiRecursionError(`Recursion limit exceeded: functionCall depth > 5`);
			for (const [k, v] of Object.entries(obj)) if (k === "functionCall") traverseRecursionAndPaths(v, globalDepth + 1, funcDepth + 1);
			else traverseRecursionAndPaths(v, globalDepth + 1, funcDepth);
		} else if (isBareFunctionCall) {
			if (funcDepth >= 5) throw new A2uiRecursionError(`Recursion limit exceeded: functionCall depth > 5`);
			for (const [k, v] of Object.entries(obj)) if (k === "args") traverseRecursionAndPaths(v, globalDepth + 1, funcDepth + 1);
			else traverseRecursionAndPaths(v, globalDepth + 1, funcDepth);
		} else for (const v of Object.values(obj)) traverseRecursionAndPaths(v, globalDepth + 1, funcDepth);
	}
}
/**
* Traverses a JSON data payload to validate path syntax and recursion limits.
*
* @param data Data payload or component hierarchy to evaluate.
* @throws {A2uiRecursionError} If global structure depth or function call depth exceeds limits.
* @throws {A2uiValidationError} If an invalid JSON Pointer path format is encountered.
*/
function validateRecursionAndPaths(data) {
	traverseRecursionAndPaths(data, 0, 0);
}
/**
* Collection model of components on a surface supporting topology validation and cycle detection.
*/
var SurfaceComponentsModel = class {
	/**
	* Initializes a new `SurfaceComponentsModel` instance.
	*
	* @param catalogOrRefMap Optional Catalog or precomputed ComponentRefMap used for schema-driven child reference extraction.
	*/
	constructor(catalogOrRefMap) {
		this.components = /* @__PURE__ */ new Map();
		this._onCreated = new EventEmitter();
		this._onDeleted = new EventEmitter();
		/** Event source firing when a new component is added to the model. */
		this.onCreated = this._onCreated;
		/** Event source firing when a component is removed from the model. */
		this.onDeleted = this._onDeleted;
		if (catalogOrRefMap) this.setCatalog(catalogOrRefMap);
	}
	/**
	* Associates a catalog or reference map with this model for schema-driven child detection.
	*
	* @param catalogOrRefMap Catalog instance or ComponentRefMap.
	*/
	setCatalog(catalogOrRefMap) {
		this.refMap = catalogOrRefMap instanceof Catalog ? catalogOrRefMap.componentRefMap : catalogOrRefMap;
	}
	/**
	* Retrieves a component by its ID.
	*
	* @param id The ID of the component to retrieve.
	* @returns The component model, or undefined if not found.
	*/
	get(id) {
		return this.components.get(id);
	}
	/**
	* Returns a copy of the internal component map.
	*
	* @returns Map of component models keyed by component ID.
	*/
	getAll() {
		return new Map(this.components);
	}
	/**
	* Checks whether a component with the specified ID exists in the model.
	*
	* @param id Component identifier to check.
	* @returns Whether the component exists in the model.
	*/
	has(id) {
		return this.components.has(id);
	}
	/**
	* Returns an iterator over the component ID and model entries.
	*/
	get entries() {
		return this.components.entries();
	}
	/**
	* Returns an iterator over all component IDs in the model.
	*/
	get keys() {
		return this.components.keys();
	}
	/**
	* Returns an iterator over all component models in the model.
	*/
	get values() {
		return this.components.values();
	}
	/**
	* Total number of components in the model.
	*/
	get size() {
		return this.components.size;
	}
	/**
	* Returns a readonly map of all active components in the model.
	*/
	get componentsMap() {
		return this.components;
	}
	/**
	* Adds a component to the model.
	* Throws an error if a component with the same ID already exists.
	*
	* @param component The component to add.
	*/
	addComponent(component) {
		if (this.components.has(component.id)) throw new A2uiStateError(`Component with id '${component.id}' already exists.`);
		this.components.set(component.id, component);
		this._onCreated.emit(component);
	}
	/**
	* Removes a component from the model by its ID.
	* Disposes of the component upon removal.
	*
	* @param id The ID of the component to remove.
	*/
	removeComponent(id) {
		const component = this.components.get(id);
		if (component) {
			this.components.delete(id);
			component.dispose();
			this._onDeleted.emit(id);
		}
	}
	/**
	* Extracts child component references for a given component identifier.
	*
	* @param componentId The ID of the component whose children should be resolved.
	* @returns Array of tuples containing `[referencedId, propertyPath]`.
	*/
	getChildReferences(componentId) {
		const comp = this.components.get(componentId);
		if (!comp) return [];
		const refMap = comp.catalog?.components.size ? comp.catalog.componentRefMap : this.refMap ?? comp.catalog?.componentRefMap ?? {};
		return Array.from(getComponentReferences({
			id: comp.id,
			component: comp.type,
			...comp.properties
		}, refMap));
	}
	/**
	* Returns array of referenced child component IDs for a given component identifier.
	*
	* @param componentId The ID of the component whose child IDs should be retrieved.
	* @returns Array of unique child component IDs.
	*/
	getChildIds(componentId) {
		return this.getChildReferences(componentId).map(([refId]) => refId);
	}
	/**
	* Detects self-references, circular dependencies, and exceeds depth limits via DFS.
	*
	* @param options Configuration specifying root node, max depth, or allowing missing root.
	* @returns Set of visited component identifiers.
	* @throws {A2uiRecursionError} When self-reference, cycle, or max depth limit is exceeded.
	*/
	detectCycles(options = {}) {
		const rootId = options.rootId ?? "root";
		const maxDepth = options.maxDepth ?? 50;
		const allowMissingRoot = options.allowMissingRoot ?? false;
		for (const comp of this.components.values()) for (const [childId, fieldName] of this.getChildReferences(comp.id)) if (childId === comp.id) throw new A2uiRecursionError(`Circular reference detected: Component '${comp.id}' references itself in field '${fieldName}' (Self-reference detected)`);
		const visited = /* @__PURE__ */ new Set();
		const recursionStack = /* @__PURE__ */ new Set();
		const dfs = (nodeId, depth) => {
			if (depth > maxDepth) throw new A2uiRecursionError(`Global recursion limit exceeded: logical depth > ${maxDepth}`);
			visited.add(nodeId);
			recursionStack.add(nodeId);
			const childIds = this.getChildIds(nodeId);
			for (const childId of childIds) {
				if (!this.components.has(childId)) continue;
				if (!visited.has(childId)) dfs(childId, depth + 1);
				else if (recursionStack.has(childId)) throw new A2uiRecursionError(`Circular reference detected involving component '${childId}'`);
			}
			recursionStack.delete(nodeId);
		};
		if (allowMissingRoot) {
			const sortedIds = Array.from(this.components.keys()).sort();
			for (const nodeId of sortedIds) if (!visited.has(nodeId)) dfs(nodeId, 0);
		} else if (this.components.has(rootId)) dfs(rootId, 0);
		return visited;
	}
	/**
	* Validates topology, completeness, and references across the component hierarchy.
	*
	* @param options Validation settings (allowMissingRoot, allowDanglingReferences, allowOrphanComponents).
	* @throws {A2uiIntegrityError} If missing root, dangling references, or orphan components exist.
	* @throws {A2uiRecursionError} If self-reference, cycle, or depth limit is detected.
	*/
	validateTopology(options = {}) {
		if (this.components.size === 0) return;
		const rootId = options.rootId ?? "root";
		const allowMissingRoot = options.allowMissingRoot ?? false;
		const allowDanglingReferences = options.allowDanglingReferences ?? false;
		const allowOrphanComponents = options.allowOrphanComponents ?? false;
		if (!allowMissingRoot && !this.components.has(rootId)) throw new A2uiIntegrityError(`Missing root component: No component has id='${rootId}'`);
		if (!allowDanglingReferences) {
			for (const comp of this.components.values()) for (const [childId, fieldName] of this.getChildReferences(comp.id)) if (!this.components.has(childId)) throw new A2uiIntegrityError(`Component '${comp.id}' references non-existent component '${childId}' in field '${fieldName}' (Dangling reference '${childId}' in component '${comp.id}')`);
		}
		const visited = this.detectCycles({
			rootId,
			allowMissingRoot,
			maxDepth: options.maxDepth
		});
		if (!allowOrphanComponents && !allowMissingRoot) {
			if (visited.size < this.components.size) {
				const orphans = Array.from(this.components.keys()).filter((id) => !visited.has(id)).sort();
				if (orphans.length > 0) throw new A2uiIntegrityError(`Component '${orphans[0]}' is not reachable from '${rootId}' (Orphaned component '${orphans[0]}' is not reachable from root)`);
			}
		}
	}
	/**
	* Performs non-throwing validation of references and topology across the component graph.
	* Returns an array containing the first validation error encountered, or an empty array if valid.
	*
	* @param options Validation options.
	* @returns Array of validation error objects.
	*/
	validateReferences(options = {}) {
		const errors = [];
		try {
			this.validateTopology(options);
		} catch (err) {
			if (err instanceof A2uiValidationError) errors.push(err);
			else if (err instanceof Error) errors.push(new A2uiValidationError(err.message));
		}
		return errors;
	}
	/**
	* Disposes the model, clearing all components and update event emitters.
	*/
	dispose() {
		for (const component of this.components.values()) component.dispose();
		this.components.clear();
		this._onCreated.dispose();
		this._onDeleted.dispose();
	}
};
/**
* State model for a single UI surface.
*
* Coordinates data binding, component state, and action dispatching.
*
* @template T Concrete type of the ComponentApi from the catalog.
* @template F The catalog's function kind. Every state and messaging
*   capability of the surface works with a schema-only catalog
*   (`SurfaceModel<T, FunctionApi>`); only node-tree resolution needs
*   implementations.
*/
var SurfaceModel = class {
	/**
	* Initializes a new `SurfaceModel` instance.
	*
	* @param id Unique identifier for this surface.
	* @param defaultCatalog Catalog that resolves components and functions that
	*   do not name a catalog explicitly.
	* @param availableCatalogs Every catalog a payload on this surface may select
	*   by `catalogId`, keyed by that identifier. The message processor populates
	*   it with the catalogs whose protocol version is compatible with the
	*   surface's own.
	* @param theme Theme to apply to this surface.
	* @param sendDataModel Whether the renderer sends the full data model with actions.
	* @param dataModel Optional custom DataModel instance. If provided, the SurfaceModel assumes
	*   full ownership of its lifecycle and will dispose it when dispose() is called.
	* @param rootId Identifier of the root component on this surface (defaults to `'root'`).
	*/
	constructor(id, defaultCatalog, availableCatalogs = /* @__PURE__ */ new Map(), theme = {}, sendDataModel = false, dataModel, rootId = "root") {
		this.id = id;
		this.defaultCatalog = defaultCatalog;
		this.theme = theme;
		this.sendDataModel = sendDataModel;
		this.rootId = rootId;
		this._onAction = new EventEmitter();
		this._onError = new EventEmitter();
		this._onWarning = new EventEmitter();
		/** Event source firing whenever an action is dispatched from this surface. */
		this.onAction = this._onAction;
		/** Event source firing whenever an error occurs on this surface. */
		this.onError = this._onError;
		/** Event source firing whenever a non-fatal warning occurs on this surface. */
		this.onWarning = this._onWarning;
		if (availableCatalogs !== void 0 && availableCatalogs !== null && !(availableCatalogs instanceof Map)) throw new TypeError("availableCatalogs must be a Map, or undefined/null. Note that availableCatalogs is now the 3rd argument to SurfaceModel and theme is the 4th argument.");
		const catalogs = new Map(availableCatalogs ?? []);
		if (defaultCatalog?.id && !catalogs.has(defaultCatalog.id)) catalogs.set(defaultCatalog.id, defaultCatalog);
		this.availableCatalogs = catalogs;
		this.dataModel = dataModel ?? new DataModel({});
		this.componentsModel = new SurfaceComponentsModel(defaultCatalog);
	}
	/**
	* The surface's default catalog.
	*
	* @deprecated Use {@link defaultCatalog}. Renamed for symmetry with the other
	*   SDKs now that a surface can carry more than one catalog. This alias will
	*   be removed in a future release.
	*/
	get catalog() {
		return this.defaultCatalog;
	}
	/**
	* Dispatches an action from this surface to registered listeners.
	*
	* Resolves event action payload details, propagates any explicit `catalogId`,
	* and emits an `ActionPayload` via `onAction`. Local function actions (`functionCall`)
	* are executed locally and are not emitted as agent actions.
	*
	* @param payload Action payload (name and context) to dispatch.
	* @param sourceComponentId Identifier of the component that triggered the action.
	* @returns A promise that resolves once all registered listeners have processed the action.
	*/
	async dispatchAction(payload, sourceComponentId) {
		if (!payload || typeof payload !== "object") return;
		const eventPayload = extractActionTarget(payload);
		if (!eventPayload) return;
		const name = eventPayload.name;
		if (!name || typeof name !== "string") return;
		const rawContext = eventPayload.context;
		const context = rawContext && typeof rawContext === "object" && !Array.isArray(rawContext) ? rawContext : {};
		const actionToDispatch = {
			name,
			surfaceId: this.id,
			sourceComponentId,
			timestamp: (/* @__PURE__ */ new Date()).toISOString(),
			context
		};
		const catalogId = eventPayload.catalogId ?? payload.catalogId;
		if (typeof catalogId === "string" && catalogId) actionToDispatch.catalogId = catalogId;
		if (typeof eventPayload.userMessage === "string" && eventPayload.userMessage.length > 0) actionToDispatch.userMessage = eventPayload.userMessage;
		await this._onAction.emit(actionToDispatch);
	}
	/**
	* Dispatches an error from this surface to registered listeners.
	*
	* @param error Error payload to dispatch, conforming to the renderer-to-agent schema.
	* @returns A promise that resolves once all registered listeners have processed the error.
	*/
	async dispatchError(error) {
		await this._onError.emit({
			...error,
			surfaceId: this.id
		});
	}
	/**
	* Dispatches a non-fatal warning from this surface to registered listeners.
	*
	* @param warning The warning payload to dispatch.
	* @returns Promise that resolves once listeners have handled the warning.
	*/
	async dispatchWarning(warning) {
		await this._onWarning.emit({
			...warning,
			surfaceId: this.id
		});
	}
	/**
	* Disposes the surface, data model, components, and event emitters.
	*/
	dispose() {
		this.dataModel.dispose();
		this.componentsModel.dispose();
		this._onAction.dispose();
		this._onError.dispose();
		this._onWarning.dispose();
	}
};
/**
* Extracts the inner action target payload (`event` or direct action payload).
*
* @param payload Raw action payload object.
* @returns The unwrapped action object, or `null` if none is present.
*/
function extractActionTarget(payload) {
	if ("event" in payload && payload.event && typeof payload.event === "object") return payload.event;
	if ("name" in payload && typeof payload.name === "string") return payload;
	return null;
}
/**
* Root state model managing a collection of active surfaces.
*
* @template T Component API type definition.
*/
var SurfaceGroupModel = class {
	constructor() {
		this.surfaces = /* @__PURE__ */ new Map();
		this.surfaceUnsubscribers = /* @__PURE__ */ new Map();
		this._onSurfaceCreated = new EventEmitter();
		this._onSurfaceDeleted = new EventEmitter();
		this._onAction = new EventEmitter();
		/** Event source firing when a new surface is added. */
		this.onSurfaceCreated = this._onSurfaceCreated;
		/** Event source firing when a surface is removed. */
		this.onSurfaceDeleted = this._onSurfaceDeleted;
		/** Event source firing when an action is dispatched from any surface in the group. */
		this.onAction = this._onAction;
	}
	/**
	* Adds a surface to the group.
	*
	* Ignores if a surface with the same ID already exists.
	*
	* @param surface The surface model to add.
	*/
	addSurface(surface) {
		if (this.surfaces.has(surface.id)) {
			console.warn(`Surface ${surface.id} already exists. Ignoring.`);
			return;
		}
		this.surfaces.set(surface.id, surface);
		const sub = surface.onAction.subscribe((action) => this._onAction.emit(action));
		this.surfaceUnsubscribers.set(surface.id, sub);
		this._onSurfaceCreated.emit(surface);
	}
	/**
	* Removes a surface from the group by its ID.
	*
	* Disposes of the surface upon removal.
	*
	* @param id The ID of the surface to remove.
	*/
	deleteSurface(id) {
		const surface = this.surfaces.get(id);
		if (surface) {
			const sub = this.surfaceUnsubscribers.get(id);
			if (sub) {
				sub.unsubscribe();
				this.surfaceUnsubscribers.delete(id);
			}
			this.surfaces.delete(id);
			surface.dispose();
			this._onSurfaceDeleted.emit(id);
		}
	}
	/**
	* Retrieves a surface by its ID.
	*
	* @param id The ID of the surface to retrieve.
	* @returns The surface model, or undefined if not found.
	*/
	getSurface(id) {
		return this.surfaces.get(id);
	}
	/**
	* Readonly map of all active surfaces keyed by surface ID.
	*/
	get surfacesMap() {
		return this.surfaces;
	}
	/**
	* Disposes the group and all contained surfaces.
	*/
	dispose() {
		for (const id of Array.from(this.surfaces.keys())) this.deleteSurface(id);
		this._onSurfaceCreated.dispose();
		this._onSurfaceDeleted.dispose();
		this._onAction.dispose();
	}
};
/**
* State model for an individual UI component.
*/
var ComponentModel = class {
	/**
	* Initializes a new `ComponentModel` instance.
	*
	* @param id The unique identifier for this component.
	* @param type The component type name.
	* @param initialProperties The initial properties for the component.
	* @param catalog Optional catalog associated with this component.
	*/
	constructor(id, type, initialProperties, catalog) {
		this.id = id;
		this.type = type;
		this.catalog = catalog;
		this._onUpdated = new EventEmitter();
		/**
		* Event source firing whenever component properties are updated.
		*/
		this.onUpdated = this._onUpdated;
		this._properties = initialProperties;
	}
	/**
	* Current properties of the component.
	*/
	get properties() {
		return this._properties;
	}
	set properties(newProperties) {
		this._properties = newProperties;
		this._onUpdated.emit(this);
	}
	/**
	* Disposes the component model and its update event emitters.
	*/
	dispose() {
		this._onUpdated.dispose();
	}
	/**
	* Serialized JSON representation of the component definition.
	*/
	get componentTree() {
		return {
			id: this.id,
			type: this.type,
			...this._properties
		};
	}
};
/**
* Formats a single Zod issue into a human-readable diagnostic message.
*
* Direct attribute extraction is used so that issue details (such as unrecognized
* property keys or invalid enum options) are preserved even when running in
* optimized/minified production builds where Zod's internal error map messages
* may be obfuscated or stripped.
*
* @param err Zod validation issue to format.
* @return Human-readable formatted error message.
*/
function formatZodIssue(err) {
	const path = err.path.join(".") || "root";
	switch (err.code) {
		case ZodIssueCode.invalid_union: {
			const unionIssues = err.unionErrors?.flatMap((uErr) => uErr.issues);
			if (unionIssues && unionIssues.length > 0) return unionIssues.map(formatZodIssue).join("; ");
			return `${path}: Invalid union`;
		}
		case ZodIssueCode.unrecognized_keys: return `${path}: Unrecognized key(s) in object: ${err.keys.map((k) => `'${k}'`).join(", ")}`;
		case ZodIssueCode.invalid_enum_value: {
			const issue = err;
			return `${path}: Invalid enum value. Expected ${issue.options.map((o) => String(o)).join(" | ")}, received '${String(issue.received)}'`;
		}
		case ZodIssueCode.invalid_type: {
			const issue = err;
			return `${path}: Expected ${issue.expected}, received ${issue.received}`;
		}
		case ZodIssueCode.custom: return `${path}: ${err.message}`;
		default: return err.message ? `${path}: ${err.message}` : `${path}: Validation error (${err.code})`;
	}
}
/**
* Default explicit catalog-to-message protocol compatibility mapping.
*
* Maps an incoming message or surface protocol version to the set of catalog
* protocol specification versions that it can accommodate.
*/
const DEFAULT_CATALOG_COMPATIBILITY = {
	"0.8": /* @__PURE__ */ new Set(["0.8"]),
	"0.9": /* @__PURE__ */ new Set(["0.9", "0.9.1"]),
	"0.9.1": /* @__PURE__ */ new Set(["0.9.1", "0.9"]),
	"1.0": /* @__PURE__ */ new Set(["1.0"])
};
/**
* Evaluates whether a catalog protocol version is compatible with an incoming message or surface version.
*
* Compatibility is verified against explicit supported version sets.
* Minor formatting differences ('v1.0', '1.0', '1.0.0', 'v1_0') normalize to the same canonical version.
*
* @param catalogVersion The catalog's declared protocol version.
* @param messageVersion The incoming message or surface declared protocol version.
* @param compatibilityMap Optional explicit compatibility mapping. Defaults to DEFAULT_CATALOG_COMPATIBILITY.
* @return Whether the catalog version is compatible with the message version.
*/
function isCatalogVersionCompatible(catalogVersion, messageVersion, compatibilityMap = DEFAULT_CATALOG_COMPATIBILITY) {
	if (!catalogVersion || !messageVersion) return false;
	const catalogCanonical = toCanonicalVersion(catalogVersion);
	const messageCanonical = toCanonicalVersion(messageVersion);
	if (catalogCanonical && messageCanonical) {
		if (catalogCanonical === messageCanonical) return true;
		const compatible = compatibilityMap[messageCanonical];
		if (compatible && compatible.has(catalogCanonical)) return true;
		const catalogSemver = toSemVer(catalogVersion);
		const messageSemver = toSemVer(messageVersion);
		if (catalogSemver && messageSemver && catalogSemver.major >= 1 && catalogSemver.major === messageSemver.major) return true;
		return false;
	}
	if (typeof catalogVersion !== "string" || typeof messageVersion !== "string") return false;
	const normalizedCatalog = normalizeVersionString(catalogVersion);
	const normalizedMessage = normalizeVersionString(messageVersion);
	return normalizedCatalog.length > 0 && normalizedCatalog === normalizedMessage;
}
let globalKnownActionsProvider;
/**
* Registers a provider callback to dynamically supply known action keys across adapters.
*
* @param provider Callback returning a ReadonlySet of all known action keys.
*/
function registerKnownActionsProvider(provider) {
	globalKnownActionsProvider = provider;
}
function validateActionSurfaceIds(msgObj, actionKeys) {
	for (const key of actionKeys) {
		const actionVal = msgObj[key];
		if (actionVal && typeof actionVal === "object") {
			const actionObj = actionVal;
			if ("surfaceId" in actionObj && actionObj.surfaceId !== void 0 && typeof actionObj.surfaceId !== "string") throw new A2uiValidationError("surfaceId must be a string");
		}
	}
}
/**
* Base abstract class providing common payload unwrapping, schema validation,
* and error formatting for protocol version adapters.
*/
var BaseVersionAdapter = class {
	/** Canonical catalog protocol versions compatible with this adapter. */
	get compatibleCatalogVersions() {
		const canonical = toCanonicalVersion(this.version);
		return canonical ? /* @__PURE__ */ new Set([canonical]) : /* @__PURE__ */ new Set();
	}
	/** Set of valid message action keys supported by this protocol version. */
	get validActions() {
		return new Set(this.getNativeActionKeys());
	}
	/** Checks if a catalog protocol version is compatible with this adapter. */
	isCatalogCompatible(catalogVersion) {
		if (!catalogVersion) return false;
		return isCatalogVersionCompatible(catalogVersion, this.version);
	}
	extractOperations(payload) {
		if (!payload || typeof payload !== "object") return [];
		if (Array.isArray(payload)) return payload.flatMap((item) => this.extractOperations(item));
		const msgObj = payload;
		if (Array.isArray(msgObj.messages)) return this.extractOperations(msgObj.messages);
		const nativeActionKeys = this.getNativeActionKeys();
		validateActionSurfaceIds(msgObj, nativeActionKeys);
		const presentNativeKeys = nativeActionKeys.filter((k) => k in msgObj).sort();
		if (presentNativeKeys.length > 1) throw new A2uiValidationError(`Message contains multiple conflicting update actions: ${presentNativeKeys.join(", ")}.`);
		if (presentNativeKeys.length === 0) {
			const allKnown = globalKnownActionsProvider ? globalKnownActionsProvider() : new Set(nativeActionKeys);
			const otherAction = Object.keys(msgObj).find((k) => allKnown.has(k) && !nativeActionKeys.includes(k));
			const sortedAllowed = nativeActionKeys.slice().sort().join(", ");
			if (otherAction) throw new A2uiValidationError(`Invalid ${this.version} message: action '${otherAction}' is not supported in protocol version ${this.version}. Allowed actions: ${sortedAllowed}.`);
			throw new A2uiValidationError(`Invalid ${this.version} message: message must contain exactly one update action: ${sortedAllowed}.`);
		}
		const preparedPayload = this.preparePayloadForValidation(msgObj);
		const parseResult = this.schema.safeParse(preparedPayload);
		if (!parseResult.success) {
			const formattedErrors = parseResult.error.errors.map(formatZodIssue).join("; ");
			throw new A2uiValidationError(`Invalid ${this.version} message: ${formattedErrors}`, parseResult.error);
		}
		return this.extractOperationsFromObject(msgObj);
	}
	/**
	* Normalizes the message object before running schema validation.
	*
	* Defaults to attaching `version` if not present.
	*
	* @param msgObj Raw message object.
	* @returns Normalized message payload for schema validation.
	*/
	preparePayloadForValidation(msgObj) {
		return "version" in msgObj ? msgObj : {
			version: this.version,
			...msgObj
		};
	}
};
/**
* Base primitives
*/
const exactlyOneKey = (val, ctx) => {
	const keys = Object.keys(val).filter((k) => val[k] !== void 0);
	if (keys.length !== 1) ctx.addIssue({
		code: ZodIssueCode.custom,
		message: `Must define exactly one property, found ${keys.length} (${keys.join(", ")}).`
	});
};
const StringValueSchema = objectType({
	path: stringType().optional(),
	literalString: stringType().optional(),
	literal: stringType().optional()
}).strict().superRefine(exactlyOneKey);
const DataValueMapItemSchema = lazyType(() => objectType({
	key: stringType(),
	valueString: stringType().optional(),
	valueNumber: numberType().optional(),
	valueBoolean: booleanType().optional(),
	valueMap: arrayType(DataValueMapItemSchema).optional()
}).strict().superRefine((val, ctx) => {
	let count = 0;
	if (val.valueString !== void 0) count++;
	if (val.valueNumber !== void 0) count++;
	if (val.valueBoolean !== void 0) count++;
	if (val.valueMap !== void 0) count++;
	if (count !== 1) ctx.addIssue({
		code: ZodIssueCode.custom,
		message: `Value map item must have exactly one value property (valueString, valueNumber, valueBoolean, valueMap), found ${count}.`
	});
}));
function createDataValueSchema(options = {}) {
	const maxDepth = options.maxDepth ?? 5;
	return DataValueMapItemSchema.superRefine((val, ctx) => {
		const checkDepth = (v, currentDepth) => {
			if (currentDepth > maxDepth) {
				ctx.addIssue({
					code: ZodIssueCode.custom,
					message: `valueMap recursion exceeded maximum depth of ${maxDepth}.`
				});
				return;
			}
			if (v.valueMap && Array.isArray(v.valueMap)) for (const item of v.valueMap) checkDepth(item, currentDepth + 1);
		};
		checkDepth(val, 1);
	});
}
const DataValueSchema = createDataValueSchema();
objectType({
	path: stringType().optional(),
	literalNumber: numberType().optional(),
	literal: numberType().optional()
}).strict().superRefine(exactlyOneKey);
objectType({
	path: stringType().optional(),
	literalBoolean: booleanType().optional(),
	literal: booleanType().optional()
}).strict().superRefine(exactlyOneKey);
/**
* Action Schema for components that trigger user actions
*/
const ActionSchema$2 = objectType({
	name: stringType().describe("A unique name identifying the action (e.g., 'submitForm')."),
	context: arrayType(objectType({
		key: stringType(),
		value: objectType({
			path: stringType().describe("A data binding reference to a location in the data model (e.g., '/user/name').").optional(),
			literalString: stringType().describe("A fixed, hardcoded string value.").optional(),
			literalNumber: numberType().optional(),
			literalBoolean: booleanType().optional()
		}).describe("The dynamic value. Define EXACTLY ONE of the nested properties.").strict().superRefine(exactlyOneKey)
	})).describe("A key-value map of data bindings to be resolved when the action is triggered.").optional()
});
objectType({
	text: StringValueSchema,
	usageHint: enumType([
		"h1",
		"h2",
		"h3",
		"h4",
		"h5",
		"caption",
		"body"
	]).optional()
});
objectType({
	url: StringValueSchema,
	usageHint: enumType([
		"icon",
		"avatar",
		"smallFeature",
		"mediumFeature",
		"largeFeature",
		"header"
	]).optional(),
	fit: enumType([
		"contain",
		"cover",
		"fill",
		"none",
		"scale-down"
	]).optional(),
	altText: StringValueSchema.optional()
});
objectType({ name: StringValueSchema });
objectType({ url: StringValueSchema });
objectType({
	url: StringValueSchema,
	description: StringValueSchema.optional().describe("A label, title, or placeholder text.")
});
objectType({ tabItems: arrayType(objectType({
	title: objectType({
		path: stringType().describe("A data binding reference to a location in the data model (e.g., '/user/name').").optional(),
		literalString: stringType().describe("A fixed, hardcoded string value.").optional()
	}),
	child: stringType().describe("A reference to a component instance by its unique ID.")
}).strict().superRefine((val, ctx) => {
	if (!val.title) ctx.addIssue({
		code: ZodIssueCode.custom,
		message: "Tab item is missing 'title'."
	});
	if (!val.child) ctx.addIssue({
		code: ZodIssueCode.custom,
		message: "Tab item is missing 'child'."
	});
	if (val.title) exactlyOneKey(val.title, ctx);
})).describe("A list of tabs, each with a title and a child component ID.") });
objectType({
	axis: enumType(["horizontal", "vertical"]).optional().describe("The orientation."),
	color: stringType().optional().describe("The color of the divider (e.g., hex code or semantic name)."),
	thickness: numberType().optional().describe("The thickness of the divider.")
});
objectType({
	entryPointChild: stringType().describe("The ID of the component (e.g., a button) that triggers the modal."),
	contentChild: stringType().describe("The ID of the component to display as the modal's content.")
});
objectType({
	child: stringType().describe("The ID of the component to display as the button's content."),
	action: ActionSchema$2.describe("Represents a user-initiated action."),
	primary: booleanType().optional().describe("Indicates if this button should be styled as the primary action.")
});
objectType({
	label: StringValueSchema,
	value: objectType({
		path: stringType().describe("A data binding reference to a location in the data model (e.g., '/user/name').").optional(),
		literalBoolean: booleanType().optional()
	}).strict().superRefine(exactlyOneKey)
});
objectType({
	text: StringValueSchema.optional(),
	label: StringValueSchema.describe("A label, title, or placeholder text."),
	textFieldType: enumType([
		"shortText",
		"number",
		"date",
		"longText",
		"obscured"
	]).optional(),
	validationRegexp: stringType().optional().describe("A regex string to validate the input.")
});
objectType({
	value: StringValueSchema,
	enableDate: booleanType().optional(),
	enableTime: booleanType().optional(),
	outputFormat: stringType().optional().describe("The string format for the output (e.g., 'YYYY-MM-DD').")
});
objectType({
	selections: objectType({
		path: stringType().describe("A data binding reference to a location in the data model (e.g., '/user/name').").optional(),
		literalArray: arrayType(stringType()).optional()
	}).strict().superRefine(exactlyOneKey),
	options: arrayType(objectType({
		label: objectType({
			path: stringType().describe("A data binding reference to a location in the data model (e.g., '/user/name').").optional(),
			literalString: stringType().describe("A fixed, hardcoded string value.").optional()
		}).strict().superRefine(exactlyOneKey),
		value: stringType()
	})).optional(),
	maxAllowedSelections: numberType().optional(),
	type: enumType(["checkbox", "chips"]).optional(),
	filterable: booleanType().optional()
});
objectType({
	value: objectType({
		path: stringType().describe("A data binding reference to a location in the data model (e.g., '/user/name').").optional(),
		literalNumber: numberType().optional()
	}).strict().superRefine(exactlyOneKey),
	minValue: numberType().optional(),
	maxValue: numberType().optional(),
	label: StringValueSchema.optional()
});
const ComponentArrayTemplateSchema = objectType({
	componentId: stringType(),
	dataBinding: stringType()
});
const ComponentArrayReferenceSchema = objectType({
	explicitList: arrayType(stringType()).optional(),
	template: ComponentArrayTemplateSchema.describe("A template for generating a dynamic list of children from a data model list. `componentId` is the component to use as a template, and `dataBinding` is the path to the map of components in the data model. Values in the map will define the list of children.").optional()
}).strict().superRefine(exactlyOneKey);
objectType({
	children: ComponentArrayReferenceSchema,
	distribution: enumType([
		"start",
		"center",
		"end",
		"spaceBetween",
		"spaceAround",
		"spaceEvenly"
	]).optional(),
	alignment: enumType([
		"start",
		"center",
		"end",
		"stretch"
	]).optional()
});
objectType({
	children: ComponentArrayReferenceSchema,
	distribution: enumType([
		"start",
		"center",
		"end",
		"spaceBetween",
		"spaceAround",
		"spaceEvenly"
	]).optional(),
	alignment: enumType([
		"start",
		"center",
		"end",
		"stretch"
	]).optional()
});
objectType({
	children: ComponentArrayReferenceSchema,
	direction: enumType(["vertical", "horizontal"]).optional(),
	alignment: enumType([
		"start",
		"center",
		"end",
		"stretch"
	]).optional()
});
objectType({ child: stringType().describe("The ID of the component to be rendered inside the card.") });
const ValueMapSchema = DataValueSchema.describe("A single data entry. Exactly one 'value*' property should be provided alongside the key.");
const ComponentPropertiesSchema = recordType(anyType()).refine((val) => Object.keys(val).length === 1, "A wrapper object that MUST contain exactly one key, which is the name of the component type (e.g., 'Heading').");
const ComponentInstanceSchema = objectType({
	id: stringType().describe("The unique identifier for this component."),
	weight: numberType().optional().describe("The relative weight of this component within a Row or Column. This corresponds to the CSS 'flex-grow' property. Note: this may ONLY be set when the component is a direct descendant of a Row or Column."),
	component: ComponentPropertiesSchema.describe("A wrapper object that MUST contain exactly one key, which is the name of the component type (e.g., 'Heading'). The value is an object containing the properties for that specific component.")
}).strict().describe("Represents a *single* component in a UI widget tree. This component could be one of many supported types.");
const BeginRenderingMessageSchema = objectType({
	surfaceId: stringType().describe("The unique identifier for the UI surface to be rendered."),
	catalogId: stringType().optional().describe("The identifier of the component catalog to use for this surface. If omitted, the client MUST default to the standard catalog for this A2UI version (https://a2ui.org/specification/v0_8/standard_catalog_definition.json)."),
	root: stringType().describe("The ID of the root component to render."),
	styles: objectType({
		font: stringType().optional().describe("The primary font for the UI."),
		primaryColor: stringType().regex(/^#[0-9a-fA-F]{6}$/).optional().describe("The primary UI color as a hexadecimal code (e.g., '#00BFFF').")
	}).strict().optional().describe("Styling information for the UI.")
}).strict().describe("Signals the client to begin rendering a surface with a root component and specific styles.");
const SurfaceUpdateMessageSchema = objectType({
	surfaceId: stringType().describe("The unique identifier for the UI surface to be updated. If you are adding a new surface this *must* be a new, unique identified that has never been used for any existing surfaces shown."),
	components: arrayType(ComponentInstanceSchema).min(1).describe("A list containing all UI components for the surface.")
}).strict().superRefine((data, ctx) => {
	const componentIds = /* @__PURE__ */ new Set();
	for (const c of data.components) if (c.id) {
		if (componentIds.has(c.id)) ctx.addIssue({
			code: ZodIssueCode.custom,
			message: `Duplicate component ID found: ${c.id}`,
			path: ["components"]
		});
		componentIds.add(c.id);
	}
	const checkRefs = (ids, componentId) => {
		for (const id of ids) if (id && !componentIds.has(id)) ctx.addIssue({
			code: ZodIssueCode.custom,
			message: `Component '${componentId}' references non-existent component ID '${id}'.`,
			path: ["components"]
		});
	};
	for (const component of data.components) {
		if (!component.id || !component.component) continue;
		const componentTypes = Object.keys(component.component);
		if (componentTypes.length !== 1) continue;
		const componentType = componentTypes[0];
		const properties = component.component[componentType];
		switch (componentType) {
			case "Row":
			case "Column":
			case "List":
				if (properties.children && !Array.isArray(properties.children)) {
					const hasExplicit = !!properties.children.explicitList;
					const hasTemplate = !!properties.children.template;
					if (hasExplicit && hasTemplate || !hasExplicit && !hasTemplate) ctx.addIssue({
						code: ZodIssueCode.custom,
						message: `Component '${component.id}' must have either 'explicitList' or 'template' in children, but not both or neither.`
					});
					if (hasExplicit) checkRefs(properties.children.explicitList, component.id);
					if (hasTemplate) checkRefs([properties.children.template?.componentId], component.id);
				}
				break;
			case "Card":
				if (properties.child) checkRefs([properties.child], component.id);
				break;
			case "Tabs":
				if (properties.tabItems && Array.isArray(properties.tabItems)) properties.tabItems.forEach((tab) => {
					if (tab.child) checkRefs([tab.child], component.id);
				});
				break;
			case "Modal":
				checkRefs([properties.entryPointChild, properties.contentChild], component.id);
				break;
			case "Button": if (properties.child) checkRefs([properties.child], component.id);
		}
	}
}).describe("Updates a surface with a new set of components.");
const DataModelUpdateMessageSchema = objectType({
	surfaceId: stringType().describe("The unique identifier for the UI surface this data model update applies to."),
	path: stringType().optional().describe("An optional path to a location within the data model (e.g., '/user/name'). If omitted, or set to '/', the entire data model will be replaced."),
	contents: arrayType(ValueMapSchema).describe("An array of data entries. Each entry must contain a 'key' and exactly one corresponding typed 'value*' property.")
}).strict().describe("Updates the data model for a surface.");
const DeleteSurfaceMessageSchema$2 = objectType({ surfaceId: stringType().describe("The unique identifier for the UI surface to be deleted.") }).strict().describe("Signals the client to delete the surface identified by 'surfaceId'.");
const A2uiMessageSchema$1 = objectType({
	beginRendering: BeginRenderingMessageSchema.optional(),
	surfaceUpdate: SurfaceUpdateMessageSchema.optional(),
	dataModelUpdate: DataModelUpdateMessageSchema.optional(),
	deleteSurface: DeleteSurfaceMessageSchema$2.optional()
}).strict().superRefine((data, ctx) => {
	if (Object.keys(data).filter((k) => [
		"beginRendering",
		"surfaceUpdate",
		"dataModelUpdate",
		"deleteSurface"
	].includes(k)).length !== 1) ctx.addIssue({
		code: ZodIssueCode.custom,
		message: "A2UI Protocol message must have exactly one of: surfaceUpdate, dataModelUpdate, beginRendering, deleteSurface."
	});
}).describe("Describes a JSON payload for an A2UI (Agent to UI) message, which is used to dynamically construct and update user interfaces. A message MUST contain exactly ONE of the action properties: 'beginRendering', 'surfaceUpdate', 'dataModelUpdate', or 'deleteSurface'.");
function normalizeV08Component(comp) {
	if (!comp || typeof comp !== "object") return {
		id: "",
		component: ""
	};
	const c = comp;
	let componentName = typeof c.component === "string" ? c.component : "";
	const props = {};
	for (const [k, v] of Object.entries(c)) if (k !== "component" && k !== "id") props[k] = v;
	if (c.component && typeof c.component === "object") {
		const obj = c.component;
		const keys = Object.keys(obj);
		if (keys.length > 0) {
			componentName = keys[0];
			const compProps = obj[keys[0]];
			if (compProps && typeof compProps === "object" && compProps !== null && !Array.isArray(compProps)) Object.assign(props, compProps);
		}
	}
	return {
		...props,
		id: String(c.id ?? ""),
		component: componentName
	};
}
/**
* Protocol version adapter for specification v0.8.
*/
var V0Point8Adapter = class extends BaseVersionAdapter {
	constructor() {
		super(...arguments);
		this.version = "v0.8";
		this.schema = A2uiMessageSchema$1;
	}
	getNativeActionKeys() {
		return [
			"beginRendering",
			"surfaceUpdate",
			"dataModelUpdate",
			"deleteSurface"
		];
	}
	preparePayloadForValidation(msgObj) {
		const msgWithoutVersion = { ...msgObj };
		delete msgWithoutVersion.version;
		return msgWithoutVersion;
	}
	extractOperationsFromObject(msgObj) {
		const ops = [];
		if ("beginRendering" in msgObj) {
			const cs = msgObj.beginRendering;
			ops.push({
				type: "createSurface",
				surfaceId: String(cs?.surfaceId ?? ""),
				catalogId: typeof cs?.catalogId === "string" ? cs.catalogId : void 0,
				theme: cs?.theme ?? cs?.styles,
				sendDataModel: Boolean(cs?.sendDataModel),
				components: Array.isArray(cs?.components) ? cs.components.map(normalizeV08Component) : void 0,
				dataModel: cs?.dataModel && typeof cs.dataModel === "object" && !Array.isArray(cs.dataModel) ? cs.dataModel : void 0,
				version: typeof msgObj.version === "string" ? msgObj.version : this.version,
				rootId: typeof cs?.root === "string" && cs.root ? cs.root : void 0
			});
		}
		if ("surfaceUpdate" in msgObj) {
			const uc = msgObj.surfaceUpdate;
			ops.push({
				type: "updateComponents",
				surfaceId: String(uc?.surfaceId ?? ""),
				components: Array.isArray(uc?.components) ? uc.components.map(normalizeV08Component) : []
			});
		}
		if ("dataModelUpdate" in msgObj) {
			const ud = msgObj.dataModelUpdate;
			const surfaceId = String(ud?.surfaceId ?? "");
			if (Array.isArray(ud?.contents)) {
				for (const item of ud.contents) if (item && typeof item === "object" && typeof item.key === "string") {
					const val = "valueNumber" in item ? item.valueNumber : "valueString" in item ? item.valueString : "valueBoolean" in item ? item.valueBoolean : "valueObject" in item ? item.valueObject : "valueArray" in item ? item.valueArray : item.value;
					ops.push({
						type: "updateDataModel",
						surfaceId,
						path: item.key,
						value: val
					});
				}
			} else ops.push({
				type: "updateDataModel",
				surfaceId,
				path: typeof ud?.path === "string" ? ud.path : void 0,
				value: ud?.value
			});
		}
		if ("deleteSurface" in msgObj) {
			const ds = msgObj.deleteSurface;
			ops.push({
				type: "deleteSurface",
				surfaceId: String(ds?.surfaceId ?? "")
			});
		}
		return ops;
	}
};
const A2uiMessageSchema = unionType([
	objectType({
		"version": enumType(["v0.9", "v0.9.1"]),
		"createSurface": objectType({
			"surfaceId": stringType().describe("The unique identifier for the UI surface to be rendered."),
			"catalogId": stringType().describe("A string that uniquely identifies this catalog. It is recommended to prefix this with an internet domain that you own, to avoid conflicts e.g. mycompany.com:somecatalog'."),
			"theme": anyType().optional(),
			"sendDataModel": booleanType().describe("If true, the client will send the full data model of this surface in the metadata of every A2A message sent to the server that created the surface. Defaults to false.").optional()
		}).strict().describe("Signals the client to create a new surface and begin rendering it. It is an error to send 'createSurface' for a surfaceId that already exists without first deleting it. When this message is sent, the client will expect 'updateComponents' and/or 'updateDataModel' messages for the same surfaceId that define the component tree.")
	}).strict(),
	objectType({
		"version": enumType(["v0.9", "v0.9.1"]),
		"updateComponents": objectType({
			"surfaceId": stringType().describe("The unique identifier for the UI surface to be updated."),
			"components": arrayType(recordType(stringType(), anyType())).min(1).describe("A list containing all UI components for the surface.")
		}).strict().describe("Updates a surface with a new set of components. This message can be sent multiple times to update the component tree of an existing surface. One of the components in one of the components lists MUST have an 'id' of 'root' to serve as the root of the component tree. A createSurface message MUST have been previously sent for the 'surfaceId' in this message; the surface's catalog is the one specified by that createSurface.")
	}).strict(),
	objectType({
		"version": enumType(["v0.9", "v0.9.1"]),
		"updateDataModel": objectType({
			"surfaceId": stringType().describe("The unique identifier for the UI surface this data model update applies to."),
			"path": stringType().describe("An optional path to a location within the data model (e.g., '/user/name'). If omitted, or set to '/', refers to the entire data model.").optional(),
			"value": anyType().describe("The data to be updated in the data model. If present, the value at 'path' is replaced (or created). If omitted, the key at 'path' is removed.").optional()
		}).strict().describe("Updates the data model for an existing surface. This message can be sent multiple times to update the data model. A createSurface message MUST have been previously sent for the 'surfaceId' in this message; the surface's catalog is the one specified by that createSurface.")
	}).strict(),
	objectType({
		"version": enumType(["v0.9", "v0.9.1"]),
		"deleteSurface": objectType({ "surfaceId": stringType().describe("The unique identifier for the UI surface to be deleted.") }).strict().describe("Signals the client to delete the surface identified by 'surfaceId'. A createSurface message MUST have been previously sent for the 'surfaceId' in this message; the surface's catalog is the one specified by that createSurface.")
	}).strict()
]);
objectType({ messages: arrayType(A2uiMessageSchema).describe("A list of messages.") }).strict().describe("An object wrapping a list of messages.");
/**
* Protocol version adapter for specification v0.9 and v0.9.1.
*/
var V0Point9Adapter = class extends BaseVersionAdapter {
	constructor() {
		super(...arguments);
		this.version = "v0.9";
		this.schema = A2uiMessageSchema;
	}
	get compatibleCatalogVersions() {
		return /* @__PURE__ */ new Set(["0.9", "0.9.1"]);
	}
	getNativeActionKeys() {
		return [
			"createSurface",
			"updateComponents",
			"updateDataModel",
			"deleteSurface"
		];
	}
	extractOperationsFromObject(msgObj) {
		const ops = [];
		if ("createSurface" in msgObj) {
			const cs = msgObj.createSurface;
			ops.push({
				type: "createSurface",
				surfaceId: String(cs?.surfaceId || ""),
				catalogId: typeof cs?.catalogId === "string" ? cs.catalogId : void 0,
				theme: cs?.theme,
				sendDataModel: Boolean(cs?.sendDataModel),
				components: Array.isArray(cs?.components) ? cs.components : void 0,
				dataModel: cs?.dataModel && typeof cs.dataModel === "object" && !Array.isArray(cs.dataModel) ? cs.dataModel : void 0,
				version: typeof msgObj.version === "string" ? msgObj.version : this.version
			});
		}
		if ("updateComponents" in msgObj) {
			const uc = msgObj.updateComponents;
			ops.push({
				type: "updateComponents",
				surfaceId: String(uc?.surfaceId || ""),
				components: Array.isArray(uc?.components) ? uc.components : []
			});
		}
		if ("updateDataModel" in msgObj) {
			const ud = msgObj.updateDataModel;
			ops.push({
				type: "updateDataModel",
				surfaceId: String(ud?.surfaceId || ""),
				path: typeof ud?.path === "string" ? ud.path : void 0,
				value: ud?.value
			});
		}
		if ("deleteSurface" in msgObj) {
			const ds = msgObj.deleteSurface;
			ops.push({
				type: "deleteSurface",
				surfaceId: String(ds?.surfaceId || "")
			});
		}
		return ops;
	}
};
/**
* All supported internal operation type discriminator strings.
*/
const INTERNAL_OPERATION_TYPES = [
	"createSurface",
	"updateComponents",
	"updateDataModel",
	"deleteSurface",
	"callRendererFunction",
	"agentFunctionResponse"
];
/**
* Determines whether a given value is a valid {@link InternalOperation}.
*
* @param payload The candidate value to inspect.
* @returns `true` if the payload conforms to an internal operation structure; otherwise `false`.
*/
function isInternalOperation(payload) {
	return typeof payload === "object" && payload !== null && "type" in payload && typeof payload.type === "string" && INTERNAL_OPERATION_TYPES.includes(payload.type);
}
objectType({
	"componentId": lazyType(() => ComponentIdSchema$1),
	"path": stringType().describe("The path to the list of component property objects in the data model.")
}).strict().describe("REF:#/$defs/TemplateChildList|A template for generating a dynamic list of children from a data model list. The `componentId` is the component to use as a template.");
/** Zod schema validating a non-empty array of UI component payloads. */
const ComponentsListSchema = arrayType(lazyType(() => ComponentCommonSchema$1.extend({ component: stringType() }).passthrough().refine((comp) => comp.component !== "Surface", { message: "Component type cannot be \"Surface\". \"Surface\" is a top-level protocol container defined in createSurface, not a child component." }))).min(1);
recordType(stringType(), anyType());
const ComponentIdSchema$1 = markChildRef(stringType().describe("REF:#/$defs/ComponentId|The unique identifier for a component, used for both definitions and references within the same surface."), "component-id");
const CallIdSchema = stringType().describe("REF:#/$defs/CallId|The unique identifier for a function call.");
const DataBindingSchema$1 = objectType({ "path": stringType().describe("A JSON Pointer path to a value in the data model.") }).strict().describe("REF:#/$defs/DataBinding");
const FunctionCommonSchema = objectType({
	"call": stringType().describe("The name of the function to call."),
	"catalogId": stringType().describe("The catalog ID for this function, overriding any surface-level default catalogId.").optional()
}).describe("REF:#/$defs/FunctionCommon|Baseline envelope properties common to all function calls. Function-specific argument schemas ('args') are defined individually by each function in the active catalog.");
const FunctionCallSchema$1 = recordType(stringType(), anyType()).and(intersectionType(FunctionCommonSchema, anyType())).describe("REF:#/$defs/FunctionCall|Invokes a named function, combining common function properties with the catalog function definition.");
const DynamicStringSchema$1 = unionType([
	stringType(),
	DataBindingSchema$1,
	FunctionCallSchema$1
]).describe("REF:#/$defs/DynamicString|Represents a string");
const DynamicBooleanSchema$1 = unionType([
	booleanType(),
	DataBindingSchema$1,
	FunctionCallSchema$1
]).describe("REF:#/$defs/DynamicBoolean|A boolean value that can be a literal, a path, or a function call returning a boolean.");
const AccessibilityAttributesSchema$1 = objectType({
	"label": DynamicStringSchema$1.optional(),
	"description": DynamicStringSchema$1.optional(),
	"live": enumType([
		"off",
		"polite",
		"assertive"
	]).describe("Controls screen reader announcements for dynamic updates (WAI-ARIA aria-live). 'polite' waits for user pause; 'assertive' interrupts immediately for alerts.").default("off"),
	"hidden": DynamicBooleanSchema$1.optional()
}).strict().describe("REF:#/$defs/AccessibilityAttributes|Attributes to enhance accessibility when using assistive technologies like screen readers or model understanding.");
const ExtensionsSchema = recordType(stringType(), unknownType()).superRefine((value, ctx) => {
	for (const key in value) if (!key.match(/^[\p{XID_Start}_][\p{XID_Continue}:-]*$/u)) ctx.addIssue({
		path: [key],
		code: ZodIssueCode.custom,
		message: `Invalid extension key "${key}": Keys MUST be Unicode identifiers (UAX #31).`
	});
}).describe("REF:#/$defs/Extensions|Optional extension metadata. Keys MUST be Unicode identifiers (UAX #31). Keys starting with 'a2ui_' are reserved for official extensions.");
const ComponentCommonSchema$1 = objectType({
	"id": ComponentIdSchema$1,
	"catalogId": stringType().describe("The catalog ID for this component, overriding any surface-level default catalogId.").optional(),
	"accessibility": AccessibilityAttributesSchema$1.optional(),
	"metadata": objectType({ "extensions": ExtensionsSchema.optional() }).strict().describe("Optional component-level metadata for vendor extensions.").optional()
}).describe("REF:#/$defs/ComponentCommon");
markChildRef(unionType([arrayType(ComponentIdSchema$1).describe("A static list of child component IDs."), objectType({
	"componentId": ComponentIdSchema$1,
	"path": stringType().describe("The path to the list of component property objects in the data model.")
}).strict().describe("A template for generating a dynamic list of children from a data model list. The `componentId` is the component to use as a template.")]).describe("REF:#/$defs/ChildList"), "child-list");
const DynamicValueSchema$1 = unionType([
	stringType(),
	numberType(),
	booleanType(),
	arrayType(anyType()),
	recordType(stringType(), unknownType()).refine((obj) => !obj || !("path" in obj) && !("call" in obj)),
	DataBindingSchema$1,
	FunctionCallSchema$1
]).describe("REF:#/$defs/DynamicValue|A value that can be a literal, a path, or a function call returning any type.");
const DynamicNumberSchema$1 = unionType([
	numberType(),
	DataBindingSchema$1,
	FunctionCallSchema$1
]).describe("REF:#/$defs/DynamicNumber|Represents a value that can be either a literal number, a path to a number in the data model, or a function call returning a number.");
unionType([
	arrayType(stringType()),
	DataBindingSchema$1,
	FunctionCallSchema$1
]).describe("REF:#/$defs/DynamicStringList|Represents a value that can be either a literal array of strings, a path to a string array in the data model, or a function call returning a string array.");
objectType({
	"call": literalType("@index"),
	"args": objectType({ "offset": DynamicNumberSchema$1.optional() }).optional()
}).describe("REF:#/$defs/IndexSystemFunction|Returns the 0-based index of the current item when rendering a dynamic list from a template. This function MUST ONLY be available when evaluating template items within a list context.");
objectType({ "checks": arrayType(objectType({
	"condition": unionType([DataBindingSchema$1, FunctionCallSchema$1]).describe("Path or function call evaluating to a structured validation result object."),
	"message": stringType().describe("Optional fallback error message.").optional()
}).strict().describe("REF:#/$defs/CheckRule|A single validation check rule applied to an input component. The condition function or path evaluates to a structured validation result object.")).describe("A list of checks to perform. These are function calls that must return a boolean indicating validity.").optional() }).describe("REF:#/$defs/Checkable|Properties for components that support renderer-side checks.");
unionType([objectType({ "event": objectType({
	"name": stringType().describe("The name of the action to be dispatched to the agent."),
	"userMessage": DynamicStringSchema$1.optional(),
	"context": recordType(stringType(), DynamicValueSchema$1).describe("A JSON object containing the key-value pairs for the action context. Values can be literals or paths. Use literal values unless the value must be dynamically bound to the data model. Do NOT use paths for static IDs.").optional()
}).strict().describe("The event to dispatch to the agent.") }).strict().describe("Triggers an agent-side event."), objectType({ "functionCall": FunctionCallSchema$1 }).strict().describe("Executes a renderer or agent-side function.")]).describe("REF:#/$defs/Action|Defines an interaction handler that can either trigger an agent-side event or execute a local renderer-side function.");
objectType({
	"component": literalType("Surface").optional(),
	"child": literalType("root").optional()
}).strict().describe("REF:#/$defs/Surface|The reserved canonical container component representing an A2UI surface. The Surface component is immutable and always has 'child': 'root'.");
const FunctionResponseSchema = objectType({
	"functionCallId": CallIdSchema,
	"value": anyType().describe("The return value of the function.").optional(),
	"error": objectType({
		"code": stringType(),
		"message": stringType()
	}).strict().describe("An error object indicating failure of the function execution.").optional()
}).strict().superRefine((val, ctx) => {
	const hasValue = "value" in val;
	const hasError = "error" in val;
	if (hasValue && hasError || !hasValue && !hasError) ctx.addIssue({
		code: ZodIssueCode.custom,
		message: "FunctionResponse must have either \"value\" or \"error\", but not both or neither."
	});
}).describe("REF:#/$defs/FunctionResponse|The return response matching a callAgentFunction or callRendererFunction invocation.");
const AgentToRendererMessageSchema = unionType([
	objectType({
		"version": literalType("v1.0"),
		"createSurface": objectType({
			"surfaceId": stringType().describe("The unique identifier for the UI surface to be rendered. It must be globally unique for the renderer's lifetime."),
			"catalogId": stringType().describe("A string that uniquely identifies the default catalog for this surface. It is recommended to prefix this with an internet domain that you own, to avoid conflicts e.g. 'mycompany.com:somecatalog'. Components and function calls that do not explicitly specify a catalogId will use this surface-level default catalogId.").optional(),
			"sendDataModel": booleanType().describe("If true, the renderer will send the full data model of this surface in the metadata of every A2A message sent to the agent that created the surface. Defaults to false.").optional(),
			"components": ComponentsListSchema.optional(),
			"dataModel": recordType(stringType(), anyType()).describe("The initial root data model object for the surface.").optional(),
			"metadata": objectType({ "extensions": ExtensionsSchema.optional() }).strict().describe("Optional surface-level metadata.").optional()
		}).strict().describe("Signals the renderer to create a new surface and begin rendering it. Creating a surface implicitly instantiates the canonical 'Surface' container component ('common_types.json#/$defs/Surface') with 'child': 'root'. It is an error to try to create a surface with an existing ID without first deleting it; surfaceId MUST be globally unique for the renderer's lifetime. When this message is sent, the renderer expects 'updateComponents' and/or 'updateDataModel' messages for the same surfaceId to define the component tree.")
	}).strict(),
	objectType({
		"version": literalType("v1.0"),
		"updateComponents": objectType({
			"surfaceId": stringType().describe("The unique identifier for the UI surface to be updated. It must be globally unique for the renderer's lifetime."),
			"components": ComponentsListSchema
		}).strict().describe("Updates a surface with a new set of components. This message can be sent multiple times to update the component tree of an existing surface. One of the components in one of the components lists MUST have an 'id' of 'root' to serve as the root of the component tree. The createSurface message MUST have been previously sent for this surfaceId.")
	}).strict(),
	objectType({
		"version": literalType("v1.0"),
		"updateDataModel": objectType({
			"surfaceId": stringType().describe("The unique identifier for the UI surface this data model update applies to. It must be globally unique for the renderer's lifetime."),
			"path": stringType().describe("An optional path to a location within the data model (e.g., '/user/name'). If omitted, or set to '/', refers to the entire data model.").optional(),
			"value": anyType().describe("The data to be updated in the data model. To delete the key/value at 'path', set 'value' explicitly to null.")
		}).strict().describe("Updates the data model for an existing surface. This message can be sent multiple times to update the data model. The createSurface message MUST have been previously sent for this surfaceId.")
	}).strict(),
	objectType({
		"version": literalType("v1.0"),
		"deleteSurface": objectType({ "surfaceId": stringType().describe("The unique identifier for the UI surface to be deleted. It must be globally unique for the renderer's lifetime.") }).strict().describe("Signals the renderer to delete the surface identified by 'surfaceId'. The createSurface message MUST have been previously sent for this surfaceId.")
	}).strict(),
	objectType({
		"version": literalType("v1.0"),
		"callRendererFunction": objectType({
			"functionCallId": CallIdSchema,
			"callFunction": intersectionType(FunctionCallSchema$1, anyType())
		}).strict().describe("Signals the renderer to execute a function locally on behalf of the agent.")
	}).strict(),
	objectType({
		"version": literalType("v1.0"),
		"agentFunctionResponse": FunctionResponseSchema
	}).strict()
]);
/**
* Protocol version adapter for specification v1.0.
*/
var V1Point0Adapter = class extends BaseVersionAdapter {
	constructor() {
		super(...arguments);
		this.version = "v1.0";
		this.schema = AgentToRendererMessageSchema;
	}
	getNativeActionKeys() {
		return [...INTERNAL_OPERATION_TYPES];
	}
	extractOperationsFromObject(msgObj) {
		const ops = [];
		if ("createSurface" in msgObj) {
			const cs = msgObj.createSurface;
			ops.push({
				type: "createSurface",
				surfaceId: String(cs?.surfaceId || ""),
				catalogId: typeof cs?.catalogId === "string" ? cs.catalogId : void 0,
				sendDataModel: Boolean(cs?.sendDataModel),
				components: Array.isArray(cs?.components) ? cs.components : void 0,
				dataModel: cs?.dataModel && typeof cs.dataModel === "object" && !Array.isArray(cs.dataModel) ? cs.dataModel : void 0,
				version: typeof msgObj.version === "string" ? msgObj.version : this.version
			});
		}
		if ("updateComponents" in msgObj) {
			const uc = msgObj.updateComponents;
			ops.push({
				type: "updateComponents",
				surfaceId: String(uc?.surfaceId || ""),
				components: Array.isArray(uc?.components) ? uc.components : []
			});
		}
		if ("updateDataModel" in msgObj) {
			const ud = msgObj.updateDataModel;
			ops.push({
				type: "updateDataModel",
				surfaceId: String(ud?.surfaceId || ""),
				path: typeof ud?.path === "string" ? ud.path : void 0,
				value: ud?.value
			});
		}
		if ("deleteSurface" in msgObj) {
			const ds = msgObj.deleteSurface;
			ops.push({
				type: "deleteSurface",
				surfaceId: String(ds?.surfaceId || "")
			});
		}
		if ("callRendererFunction" in msgObj) {
			const crf = msgObj.callRendererFunction;
			const cf = crf?.callFunction || {};
			ops.push({
				type: "callRendererFunction",
				functionCallId: String(crf?.functionCallId || ""),
				call: String(cf?.call || ""),
				version: this.version,
				catalogId: typeof cf?.catalogId === "string" ? cf.catalogId : void 0,
				args: cf?.args && typeof cf.args === "object" && !Array.isArray(cf.args) ? cf.args : {}
			});
		}
		if ("agentFunctionResponse" in msgObj) {
			const afr = msgObj.agentFunctionResponse;
			ops.push({
				type: "agentFunctionResponse",
				functionCallId: String(afr?.functionCallId || ""),
				version: this.version,
				value: afr?.value,
				error: afr?.error && typeof afr.error === "object" ? afr.error : void 0
			});
		}
		return ops;
	}
};
/**
* Resolves version adapters for protocol specification versions.
*/
var VersionAdapterFactory = class {
	constructor() {
		this.adapters = /* @__PURE__ */ new Map([
			["0.8", new V0Point8Adapter()],
			["0.9", new V0Point9Adapter()],
			["0.9.1", new V0Point9Adapter()],
			["1.0", new V1Point0Adapter()]
		]);
	}
	/**
	* Returns the aggregated set of all action keys supported by all registered adapters.
	*
	* @return A set of all supported action key strings.
	*/
	getAllKnownActions() {
		const actions = /* @__PURE__ */ new Set();
		for (const adapter of this.adapters.values()) if (adapter.validActions) for (const action of adapter.validActions) actions.add(action);
		return actions;
	}
	/**
	* Dynamically registers a version adapter on this factory instance.
	*
	* @param adapter The version adapter instance to register.
	*/
	registerAdapter(adapter) {
		const key = toCanonicalVersion(adapter.version) ?? normalizeVersionString(adapter.version);
		this.adapters.set(key, adapter);
	}
	/**
	* Resolves the version adapter for the specified version string from this factory instance.
	*
	* @param version The protocol version string (e.g. 'v1.0').
	* @return The matching version adapter.
	* @throws A2uiValidationError if the version string is unsupported.
	*/
	getAdapter(version) {
		const key = toCanonicalVersion(version) ?? normalizeVersionString(version);
		const adapter = this.adapters.get(key);
		if (!adapter) throw new A2uiValidationError(`[VersionAdapterFactory] Unsupported protocol version '${version}'. Supported versions: ${Array.from(new Set(Array.from(this.adapters.keys()).map((k) => k.startsWith("v") ? k : `v${k}`))).sort().join(", ")}.`);
		return adapter;
	}
	/**
	* Resolves the version adapter directly from an incoming message payload using this factory instance.
	*
	* @param payload The raw JSON message payload.
	* @returns The resolved version adapter.
	* @throws A2uiValidationError if the payload is missing a valid 'version' string.
	*/
	resolveFromPayload(payload) {
		const item = Array.isArray(payload) ? payload[0] : payload;
		if (typeof item === "object" && item !== null) {
			if ("messages" in item && Array.isArray(item.messages)) return this.resolveFromPayload(item.messages);
			if ("version" in item) {
				const ver = item.version;
				if (typeof ver !== "string") throw new A2uiValidationError(`[VersionAdapterFactory] Message payload is missing a valid 'version' string: 'version' property must be a string, got ${typeof ver}.`);
				return this.getAdapter(ver);
			}
			if ("beginRendering" in item || "surfaceUpdate" in item || "dataModelUpdate" in item || "deleteSurface" in item) return this.getAdapter("v0.8");
		}
		throw new A2uiValidationError("[VersionAdapterFactory] Message payload is missing a valid 'version' string.");
	}
	/**
	* Registers a version adapter on the default singleton factory instance.
	*
	* @param adapter Version adapter instance to register.
	*/
	static registerAdapter(adapter) {
		defaultVersionAdapterFactory.registerAdapter(adapter);
	}
	/**
	* Resolves a version adapter for the specified version from the default singleton factory instance.
	*
	* @param version Protocol version string.
	* @return Matching version adapter.
	*/
	static getAdapter(version) {
		return defaultVersionAdapterFactory.getAdapter(version);
	}
	/**
	* Resolves a version adapter directly from a payload using the default singleton factory instance.
	*
	* @param payload Raw JSON message payload.
	* @returns Resolved version adapter.
	*/
	static resolveFromPayload(payload) {
		return defaultVersionAdapterFactory.resolveFromPayload(payload);
	}
	/**
	* Returns the aggregated set of all action keys supported by all registered adapters
	* from the default singleton factory instance.
	*
	* @return A set of all supported action key strings.
	*/
	static getAllKnownActions() {
		return defaultVersionAdapterFactory.getAllKnownActions();
	}
};
/** Default singleton version adapter factory instance. */
const defaultVersionAdapterFactory = new VersionAdapterFactory();
registerKnownActionsProvider(() => defaultVersionAdapterFactory.getAllKnownActions());
const schemaKeysCache = /* @__PURE__ */ new WeakMap();
/**
* Extracts declared property keys from a Zod schema representing an object with fixed keys.
*
* Traverses Zod wrappers (`ZodEffects`, `ZodOptional`, `ZodNullable`, `ZodDefault`,
* `ZodCatch`, `ZodIntersection`, `ZodUnion`) and returns the set of allowed key names.
*
* @param schema Zod schema to inspect.
* @returns Set of allowed property names, or `null` if arbitrary keys are permitted or undetermined.
*/
function getKnownSchemaKeys(schema) {
	if (schemaKeysCache.has(schema)) return schemaKeysCache.get(schema);
	const result = (() => {
		let current = schema;
		while (current) {
			if (current instanceof ZodObject || current._def?.typeName === "ZodObject") {
				if (current._def?.unknownKeys === "passthrough") return null;
				const shape = typeof current.shape === "function" ? current.shape() : current.shape;
				if (shape && typeof shape === "object") return new Set(Object.keys(shape));
				return null;
			}
			if (current instanceof ZodEffects || current._def?.typeName === "ZodEffects") {
				current = current._def.schema;
				continue;
			}
			if (current instanceof ZodOptional || current instanceof ZodNullable || current._def?.typeName === "ZodOptional" || current._def?.typeName === "ZodNullable") {
				current = current._def.innerType;
				continue;
			}
			if (current instanceof ZodDefault || current._def?.typeName === "ZodDefault") {
				current = current._def.innerType;
				continue;
			}
			if (current instanceof ZodCatch || current._def?.typeName === "ZodCatch") {
				current = current._def.innerType;
				continue;
			}
			if (current instanceof ZodIntersection || current._def?.typeName === "ZodIntersection") {
				const leftKeys = getKnownSchemaKeys(current._def.left);
				const rightKeys = getKnownSchemaKeys(current._def.right);
				if (!leftKeys || !rightKeys) return null;
				return /* @__PURE__ */ new Set([...leftKeys, ...rightKeys]);
			}
			if (current instanceof ZodUnion || current._def?.typeName === "ZodUnion") {
				const options = current._def.options;
				const allKeys = /* @__PURE__ */ new Set();
				for (const opt of options) {
					const k = getKnownSchemaKeys(opt);
					if (!k) return null;
					for (const key of k) allKeys.add(key);
				}
				return allKeys;
			}
			return null;
		}
		return null;
	})();
	schemaKeysCache.set(schema, result);
	return result;
}
/**
* Validates a function call's arguments against the catalog function schema and global limits.
*
* Functions have a strict contract: supplying unknown or excessive arguments breaks that contract
* and causes an A2uiExpressionError rather than silently stripping them. Validating arguments before
* creating reactive nodes also prevents uncontrolled resource consumption.
*
* @param functionName Name of the function being validated.
* @param rawArgs Raw argument map to validate against the function schema.
* @param catalog Optional catalog providing the function's schema.
* @throws {A2uiExpressionError} If argument count exceeds `MAX_FUNCTION_CALL_ARGS`, unknown arguments are supplied, or arguments exceed expected count.
*/
function validateFunctionArgs(functionName, rawArgs, catalog) {
	if (!rawArgs || typeof rawArgs !== "object" || Array.isArray(rawArgs)) return;
	const suppliedKeys = Object.keys(rawArgs);
	if (suppliedKeys.length > 1e3) throw new A2uiExpressionError(`Function call '${functionName}' exceeds maximum allowed arguments count (${MAX_FUNCTION_CALL_ARGS})`, functionName);
	const fn = catalog?.functions?.get?.(functionName);
	if (!fn?.schema) return;
	const knownKeys = getKnownSchemaKeys(fn.schema);
	if (!knownKeys) return;
	for (const key of suppliedKeys) if (!knownKeys.has(key)) throw new A2uiExpressionError(`Unknown argument '${key}' passed to function '${functionName}'`, functionName);
	if (suppliedKeys.length > knownKeys.size) throw new A2uiExpressionError(`Too many arguments for function '${functionName}': expected at most ${knownKeys.size}, received ${suppliedKeys.length}`, functionName);
}
/**
* Resolves the 0-based iteration index from a context or its ancestor chain.
*
* Checks for an explicit index first, then checks whether the trailing
* segment of the data path is numeric, walking the parent context chain until a
* match is found.
*
* @param startCtx Initial context or context-like object to inspect.
* @returns The resolved 0-based iteration index, or `undefined` if outside an iteration scope.
*/
function resolveContextIndex(startCtx) {
	let ctx = startCtx;
	while (ctx) {
		if (ctx.explicitIndex !== void 0 && Number.isFinite(ctx.explicitIndex)) return ctx.explicitIndex;
		if (!(ctx instanceof DataContext) && typeof ctx.getIndex === "function") {
			const idx = ctx.getIndex();
			if (idx !== void 0 && Number.isFinite(idx)) return idx;
		}
		if (!(ctx instanceof DataContext) && typeof ctx.index === "number" && Number.isFinite(ctx.index)) return ctx.index;
		if (typeof ctx.path === "string") {
			const parts = ctx.path.split("/").filter(Boolean);
			if (parts.length > 0 && /^\d+$/.test(parts[parts.length - 1])) return parseInt(parts[parts.length - 1], 10);
		}
		ctx = ctx.parent;
	}
}
/**
* The maximum allowed recursion depth for evaluating nested dynamic values or function calls.
* Prevents call stack exhaustion on deeply nested expression payloads.
*/
const MAX_DYNAMIC_VALUE_DEPTH = 1e3;
/**
* Scoped view of the main DataModel for resolving DynamicValues within a component hierarchy.
*
* Automatically resolves relative paths against the component's current scope
* and provides tools for evaluating complex, reactive expressions.
*/
var DataContext = class DataContext {
	/**
	* Initializes a new DataContext instance.
	*
	* @param surface The surface model this context belongs to.
	* @param path The absolute path in the DataModel that this context is scoped to.
	* @param index Optional explicit collection iteration index.
	* @param parent Optional parent DataContext in the scope chain.
	*/
	constructor(surface, path, index, parent) {
		this.surface = surface;
		this.path = path;
		this.dataModel = surface.dataModel;
		this.functionInvoker = surface.defaultCatalog.invoker;
		this.explicitIndex = index;
		this.parent = parent;
		this.warnedPaths = parent ? parent.warnedPaths : /* @__PURE__ */ new Set();
	}
	/**
	* Returns the 0-based iteration index if this context (or an ancestor context)
	* is scoped to a collection template item, or `undefined` when outside any
	* collection template scope.
	*
	* Mirrors `DataContext.index` in Python: checks an explicit `explicitIndex` first,
	* then checks strictly the trailing segment of `ctx.path`, walking `ctx.parent`.
	*
	* @returns The 0-based iteration index, or `undefined` if outside an iteration scope.
	*/
	getIndex() {
		return resolveContextIndex(this);
	}
	/** Active iteration index if inside a collection template scope, or `undefined`. */
	get index() {
		return this.getIndex();
	}
	/**
	* Mutates the underlying DataModel at the specified path.
	*
	* @param path JSON pointer path, resolved relative to this context's `path` if not absolute.
	* @param value New value to store in the DataModel.
	*/
	set(path, value) {
		const absolutePath = this.resolvePath(path);
		this.dataModel.set(absolutePath, value);
	}
	/**
	* Checks whether an object represents a data binding.
	*
	* @param val Candidate object to inspect.
	* @returns Whether the object has a string `path` and is not a component reference.
	*/
	static isDataBindingObject(val) {
		return "path" in val && typeof val.path === "string" && !("componentId" in val);
	}
	/**
	* Checks whether an object represents a function call.
	*
	* @param val Candidate object to inspect.
	* @returns Whether the object has a string `call` property.
	*/
	static isFunctionCallObject(val) {
		return "call" in val && typeof val.call === "string";
	}
	/**
	* Checks whether a value contains any dynamic parts (path bindings or
	* function calls) at any nesting depth that require resolution.
	*
	* @param value The value or data structure to inspect.
	* @returns Whether the value contains any dynamic path bindings or function calls.
	*/
	static containsDynamicValue(value) {
		if (value === null || typeof value !== "object") return false;
		if (Array.isArray(value)) return value.some((item) => DataContext.containsDynamicValue(item));
		const rec = value;
		if (DataContext.isDataBindingObject(rec) || DataContext.isFunctionCallObject(rec)) return true;
		return Object.values(rec).some((v) => DataContext.containsDynamicValue(v));
	}
	/**
	* Emits a warning if a data binding path does not exist in the data model.
	*
	* @param absolutePath Absolute JSON pointer path to check.
	*/
	emitMissingDataBindingWarning(absolutePath) {
		if (typeof this.dataModel?.hasPath === "function" && !this.dataModel.hasPath(absolutePath) && !this.warnedPaths.has(absolutePath)) {
			this.warnedPaths.add(absolutePath);
			this.surface?.dispatchWarning?.({
				code: "MISSING_DATA_BINDING",
				path: absolutePath,
				message: `Preflight DataBinding Warning: The bound JSON Pointer '${absolutePath}' does not physically exist in the active DataModel. Evaluating to None.`
			});
		}
	}
	/**
	* Synchronously evaluates a DynamicValue into its concrete runtime value.
	*
	* Evaluates the value once at the current moment without creating reactive subscriptions.
	* Use `subscribeDynamicValue` for reactive updates.
	* @param value The DynamicValue object or raw value from the A2UI JSON payload.
	* @param depth The current recursion depth when evaluating nested arguments or expressions.
	* @returns The synchronously resolved value.
	*/
	resolveDynamicValue(value, depth = 0) {
		if (depth > 1e3) {
			const err = new A2uiExpressionError(`Maximum dynamic value nesting depth exceeded (${MAX_DYNAMIC_VALUE_DEPTH})`);
			this.dispatchExpressionError(err, "DynamicValue");
			return;
		}
		if (value === null || typeof value !== "object") return value;
		if (Array.isArray(value)) {
			if (!DataContext.containsDynamicValue(value)) return value;
			return value.map((item) => this.resolveDynamicValue(item, depth + 1));
		}
		const rec = value;
		if (DataContext.isDataBindingObject(rec)) {
			const absolutePath = this.resolvePath(value.path);
			const val = this.dataModel.get(absolutePath);
			if (val === void 0) this.emitMissingDataBindingWarning(absolutePath);
			return val;
		}
		if (DataContext.isFunctionCallObject(rec)) return this.resolveFunctionCallValue(value, depth);
		return this.resolvePlainObjectValue(rec, depth);
	}
	/**
	* Resolves a function call by validating arguments and invoking the function.
	*
	* @param call Function call definition to execute.
	* @param depth Current recursion depth for nested expression tracking.
	* @returns The resolved function return value.
	*/
	resolveFunctionCallValue(call, depth = 0) {
		let targetCatalog;
		try {
			targetCatalog = this.resolveFunctionCatalog(call.catalogId);
			validateFunctionArgs(call.call, call.args, targetCatalog);
		} catch (e) {
			this.dispatchExpressionError(e, call.call);
			return;
		}
		const args = {};
		for (const [key, argVal] of Object.entries(call.args ?? {})) args[key] = this.resolveDynamicValue(argVal, depth + 1);
		const abortController = new AbortController();
		const result = this.evaluateFunctionReactive(call.call, args, abortController.signal, call.catalogId, targetCatalog.invoker);
		if (result === void 0) return;
		return isSignal(result) ? peekValue(result) : result;
	}
	/**
	* Recursively resolves dynamic values nested inside a plain object.
	*
	* @param rec Plain object dictionary to resolve.
	* @param depth Current recursion depth for nested expression tracking.
	* @returns A copy of the object with all nested dynamic values resolved.
	*/
	resolvePlainObjectValue(rec, depth = 0) {
		if (!DataContext.containsDynamicValue(rec)) return rec;
		const resolved = {};
		for (const [k, v] of Object.entries(rec)) resolved[k] = this.resolveDynamicValue(v, depth + 1);
		return resolved;
	}
	/**
	* Reactively listens to changes in a DynamicValue.
	*
	* Whenever the underlying data or function dependencies change, the `onChange`
	* callback fires with the freshly evaluated result.
	*
	* @template V Expected type of the resolved value.
	* @param value The DynamicValue or raw value to evaluate and observe.
	* @param onChange Callback fired whenever the evaluated result changes.
	* @returns A subscription containing the current value and an `unsubscribe` method.
	*/
	subscribeDynamicValue(value, onChange) {
		const sig = this.resolveSignal(value);
		let isSync = true;
		let currentValue = peekValue(sig);
		const dispose = effect(() => {
			const val = getValue(sig);
			currentValue = val;
			if (!isSync) onChange(val);
		});
		isSync = false;
		return {
			get value() {
				return currentValue;
			},
			unsubscribe: () => {
				dispose();
				sig.unsubscribe?.();
			}
		};
	}
	/**
	* Resolves a DynamicValue into a reactive Signal.
	*
	* Recursively resolves any nested path bindings or function calls into a
	* single reactive `Signal`. Changes to underlying data or function dependencies
	* cause the signal's value to update.
	*
	* @template V Expected type of the signal value.
	* @param value The DynamicValue or raw value to evaluate and observe.
	* @param depth The current recursion depth when evaluating nested arguments or expressions.
	* @returns A reactive Signal containing the result of the evaluation.
	*/
	resolveSignal(value, depth = 0) {
		if (depth > 1e3) {
			const err = new A2uiExpressionError(`Maximum dynamic value nesting depth exceeded (${MAX_DYNAMIC_VALUE_DEPTH})`);
			this.dispatchExpressionError(err, typeof value === "object" && value && "call" in value ? value.call : "DynamicValue");
			return signal(void 0);
		}
		if (typeof value !== "object" || value === null) return signal(value);
		if (Array.isArray(value)) {
			if (!DataContext.containsDynamicValue(value)) return signal(value);
			const itemSignals = value.map((item) => this.resolveSignal(item, depth + 1));
			const resultSig = computed(() => itemSignals.map((s) => getValue(s)));
			resultSig.unsubscribe = () => {
				for (const s of itemSignals) s.unsubscribe?.();
			};
			return resultSig;
		}
		const rec = value;
		if (DataContext.isDataBindingObject(rec)) {
			const absolutePath = this.resolvePath(value.path);
			this.emitMissingDataBindingWarning(absolutePath);
			return this.dataModel.getSignal(absolutePath);
		}
		if (DataContext.isFunctionCallObject(rec)) {
			const call = value;
			let targetCatalog;
			try {
				targetCatalog = this.resolveFunctionCatalog(call.catalogId);
				validateFunctionArgs(call.call, call.args, targetCatalog);
			} catch (e) {
				this.dispatchExpressionError(e, call.call);
				return signal(void 0);
			}
			const argSignals = {};
			for (const [key, argVal] of Object.entries(call.args ?? {})) argSignals[key] = this.resolveSignal(argVal, depth + 1);
			if (Object.keys(argSignals).length === 0) {
				const abortController = new AbortController();
				const result = this.evaluateFunctionReactive(call.call, {}, abortController.signal, call.catalogId, targetCatalog.invoker);
				const sig = isSignal(result) ? result : signal(result);
				sig.unsubscribe = () => abortController.abort();
				return sig;
			}
			const keys = Object.keys(argSignals);
			const resultSig = signal(void 0);
			let abortController;
			let innerUnsubscribe;
			const argsSig = computed(() => {
				const argsRecord = {};
				for (let i = 0; i < keys.length; i++) argsRecord[keys[i]] = getValue(argSignals[keys[i]]);
				return argsRecord;
			});
			const stopper = effect(() => {
				try {
					const args = getValue(argsSig);
					if (abortController) abortController.abort();
					if (innerUnsubscribe) {
						innerUnsubscribe();
						innerUnsubscribe = void 0;
					}
					abortController = new AbortController();
					const res = this.evaluateFunctionReactive(call.call, args, abortController.signal, call.catalogId, targetCatalog.invoker);
					if (isSignal(res)) innerUnsubscribe = effect(() => {
						setValue(resultSig, getValue(res));
					});
					else setValue(resultSig, res);
				} catch (e) {
					this.dispatchExpressionError(e, call.call);
					setValue(resultSig, void 0);
				}
			});
			resultSig.unsubscribe = () => {
				stopper();
				if (innerUnsubscribe) innerUnsubscribe();
				if (abortController) abortController.abort();
				for (let i = 0; i < keys.length; i++) argSignals[keys[i]].unsubscribe?.();
			};
			return resultSig;
		}
		if (!DataContext.containsDynamicValue(rec)) return signal(value);
		const entrySignals = Object.entries(rec).map(([k, v]) => [k, this.resolveSignal(v)]);
		const objSig = computed(() => {
			const resolved = {};
			for (const [k, s] of entrySignals) resolved[k] = getValue(s);
			return resolved;
		});
		const prevUnsubscribe = objSig.unsubscribe?.bind(objSig);
		objSig.unsubscribe = () => {
			prevUnsubscribe?.();
			for (const [, s] of entrySignals) s.unsubscribe?.();
		};
		return objSig;
	}
	/**
	* Resolves an action by evaluating its top-level dynamic values.
	*
	* For event actions, resolves each value in the context map.
	* For function call actions, evaluates the function call.
	*
	* @param action The Action object to resolve.
	* @returns The resolved action payload or function execution result.
	*/
	resolveAction(action) {
		if ("event" in action) {
			const resolvedContext = {};
			if (action.event.context) for (const [key, value] of Object.entries(action.event.context)) resolvedContext[key] = this.resolveDynamicValue(value);
			return { event: {
				...action.event,
				context: resolvedContext
			} };
		}
		if ("functionCall" in action) return this.resolveDynamicValue(action.functionCall);
		return action;
	}
	/**
	* Resolves the catalog against which a function call executes.
	*
	* @param catalogId Identifier of the catalog named by the call, if specified.
	* @returns The resolved Catalog instance, or the surface default catalog if omitted.
	* @throws {A2uiCatalogError} If the call names a catalog ID that cannot be
	*   resolved on this surface. This is reported as a catalog fault rather than
	*   a missing function, since the function may exist in a catalog that is not
	*   available here.
	*/
	resolveFunctionCatalog(catalogId) {
		if (catalogId === void 0) return this.surface.defaultCatalog;
		const target = this.surface.availableCatalogs?.get(catalogId);
		if (!target) throw new A2uiCatalogError(`Catalog not found: ${catalogId}`);
		return target;
	}
	/**
	* Evaluates a catalog function and returns its reactive Signal or static value.
	*
	* Resolves the appropriate function invoker from the specified catalog or
	* surface default, invokes the function with this context, and dispatches an
	* expression error if execution throws.
	*
	* @template V Expected return type of the function evaluation.
	* @param name Name of the function to evaluate.
	* @param args Resolved arguments to pass to the function.
	* @param abortSignal Optional abort signal to cancel asynchronous execution.
	* @param catalogId Optional catalog ID override declaring the function.
	* @param resolvedInvoker Optional pre-resolved function invoker to avoid redundant catalog lookup.
	* @returns The evaluated result as a reactive `Signal` or static value, or `undefined` on failure.
	*/
	evaluateFunctionReactive(name, args, abortSignal, catalogId, resolvedInvoker) {
		const invoker = resolvedInvoker ?? (catalogId === void 0 ? this.functionInvoker : this.resolveFunctionCatalog(catalogId).invoker);
		try {
			return invoker(name, args, this, abortSignal);
		} catch (e) {
			this.dispatchExpressionError(e, name);
			return;
		}
	}
	dispatchExpressionError(e, name) {
		if (e instanceof ZodError || typeof e === "object" && e !== null && e.name === "ZodError") {
			const zodErr = e;
			const err = new A2uiExpressionError(`Validation failed for function '${name}': ${zodErr.message}`, name, zodErr.errors ?? zodErr.issues);
			this.surface.dispatchError({
				code: "EXPRESSION_ERROR",
				message: err.message,
				expression: name,
				details: err.details
			});
		} else if (e instanceof A2uiExpressionError) this.surface.dispatchError({
			code: "EXPRESSION_ERROR",
			message: e.message,
			expression: e.expression,
			details: e.details
		});
		else {
			const errObj = typeof e === "object" && e !== null ? e : {};
			this.surface.dispatchError({
				code: "EXPRESSION_ERROR",
				message: errObj.message ?? `An unexpected error occurred in function ${name}.`,
				expression: name
			});
		}
	}
	/**
	* Creates a child DataContext scoped to a deeper relative path.
	*
	* @param relativePath The path relative to the current context's path.
	* @param index Optional explicit iteration index for this nested scope.
	* @returns A new DataContext instance pointing to the resolved absolute path.
	*/
	nested(relativePath, index) {
		const newPath = this.resolvePath(relativePath);
		return new DataContext(this.surface, newPath, index, this);
	}
	resolvePath(path) {
		if (path.startsWith("/")) return path;
		if (path === "" || path === ".") return this.path;
		let base = this.path;
		if (base.endsWith("/") && base.length > 1) base = base.slice(0, -1);
		if (base === "/") base = "";
		return `${base}/${path}`;
	}
};
/**
* System function definition for computing iteration indices in array contexts.
*
* Evaluates the 0-based iteration index with an optional numerical offset.
*/
const IndexApi = {
	/** Name of the system function. */
	name: "@index",
	/** Declared return type for catalog type checking. */
	returnType: "number",
	/** Scope of callers permitted to invoke this function. */
	allowedCallers: "rendererOnly",
	/** Zod schema validating function arguments. */
	schema: objectType({ "offset": coerce.number().optional() })
};
createFunctionImplementation(IndexApi, (args, context) => {
	const offset = typeof args.offset === "number" && Number.isFinite(args.offset) ? args.offset : 0;
	const index = resolveContextIndex(context);
	if (index === void 0 || !Number.isFinite(index)) throw new A2uiValidationError("@index function can only be evaluated inside a collection template iteration scope.");
	return index + offset;
});
/**
* Envelope keys that are addressed by the processor rather than described by a
* component's property schema, and so must be removed before the payload is
* checked against that schema.
*/
const COMPONENT_ENVELOPE_KEYS = [
	"id",
	"component",
	"catalogId",
	"catalogID"
];
/**
* Validates A2UI payloads against the schemas of a single catalog.
*
* The validator is deliberately scoped to one catalog. Multi-catalog payloads
* are resolved to a target catalog by the caller, which then constructs a
* validator for it; that keeps catalog resolution and schema checking in
* separate places and mirrors Python's `PayloadValidator`.
*
* Every method throws on failure rather than returning a list of problems.
* Python's `validate_component` returns its errors instead, but TypeScript
* callers, in particular `MessageProcessor`, depend on an exception to trigger
* atomic rollback of a partially applied update.
*
* Identifier checks apply only to catalogs declaring protocol version 1.0 or
* later, matching the version gate Python applies.
*/
var PayloadValidator = class {
	/**
	* Initializes a new `PayloadValidator`.
	*
	* @param catalog Catalog whose schemas define what a valid payload is.
	* @param config Validation strictness. When omitted, unknown components and
	*   functions are tolerated.
	*/
	constructor(catalog, config) {
		this.catalog = catalog;
		this.config = config;
		this.enforceIdentifiers = isAtLeastVersion(catalog.protocolVersion, "1.0");
	}
	/**
	* Whether unrecognized components and functions are tolerated.
	*
	* An absent config means the caller is not validating at all, so unknown
	* elements pass. This preserves the gate `MessageProcessor` applied before
	* this class existed, and matches Python, whose `validate_components_update`
	* returns early when `config is None`.
	*/
	get allowUnknown() {
		return this.config ? this.config.allowUnknownElements ?? false : true;
	}
	/**
	* Validates a single component payload against its catalog definition,
	* including any nested function calls within its properties.
	*
	* @param comp Raw component payload, including its `id` and `component`
	*   envelope keys.
	* @param knownType Component type to assume when the payload omits
	*   `component`, as happens on a partial update to an existing component.
	* @throws {A2uiValidationError} If the identifier, the component type, any
	*   property, or any nested function call fails validation.
	*/
	validateComponent(comp, knownType) {
		const id = comp["id"];
		if (typeof id !== "string" || !id) throw new A2uiValidationError(`Component '${comp["component"]}' is missing an 'id'; entries require a valid string 'id'.`);
		this.assertIdentifier(id, `Component id '${id}' must be a valid UAX #31 identifier`);
		const declaredType = comp["component"];
		const componentType = typeof declaredType === "string" ? declaredType : knownType;
		if (!componentType) throw new A2uiValidationError(`Cannot create component ${id} without a type.`);
		const componentApi = this.catalog.components.get(componentType);
		if (!componentApi) {
			if (!this.allowUnknown) throw new A2uiValidationError(`Unknown component type '${componentType}' not found in catalog '${this.catalog.id}'.`);
			return;
		}
		const properties = stripEnvelopeKeys(comp);
		const result = componentApi.schema.safeParse(properties);
		if (!result.success) throw new A2uiValidationError(`Validation failed for component '${componentType}' (${id}): ${result.error.errors.map(formatZodIssue).join(", ")}`, result.error.issues);
		this.validateNestedFunctions(properties);
	}
	/**
	* Asserts that a function name and all its argument keys satisfy UAX #31 identifier syntax.
	*
	* @param name Function name to check.
	* @param args Function arguments object whose keys are checked.
	* @throws {A2uiValidationError} If the function name or any argument key is not a valid UAX #31 identifier.
	*/
	assertFunctionIdentifiers(name, args) {
		this.assertIdentifier(name, `Function name '${name}' must be a valid UAX #31 identifier`);
		if (args && typeof args === "object" && !Array.isArray(args)) {
			const keys = Object.keys(args);
			if (keys.length > 1e3) throw new A2uiValidationError(`Function call '${name}' exceeds maximum allowed arguments count (${MAX_FUNCTION_CALL_ARGS})`);
			for (const argName of keys) this.assertIdentifier(argName, `Function argument '${argName}' in function '${name}' must be a valid UAX #31 identifier`);
		}
	}
	/**
	* Recursively walks a component's property values and validates any nested
	* function call objects against their target catalog.
	*
	* @param val Property value or subtree to inspect.
	* @throws {A2uiValidationError} If any nested function call fails schema or identifier validation.
	*/
	validateNestedFunctions(val) {
		if (Array.isArray(val)) {
			for (const item of val) this.validateNestedFunctions(item);
			return;
		}
		if (typeof val !== "object" || val === null) return;
		const record = val;
		const rawName = record["call"] ?? record["function"];
		if (typeof rawName === "string" && rawName.length > 0) {
			const rawArgs = record["args"];
			const argsDict = rawArgs !== void 0 ? rawArgs : {};
			const callCatalogId = typeof record["catalogId"] === "string" && record["catalogId"].length > 0 ? record["catalogId"] : void 0;
			if (callCatalogId && callCatalogId !== this.catalog.id) this.assertFunctionIdentifiers(rawName, argsDict);
			else this.validateFunction(rawName, argsDict);
		}
		for (const [k, v] of Object.entries(record)) if (k !== "id" && k !== "component") this.validateNestedFunctions(v);
	}
	/**
	* Validates the arguments of a function call against the catalog definition.
	*
	* @param name Name of the function being called.
	* @param args Arguments supplied by the payload.
	* @returns The parsed arguments object (including any schema defaults).
	* @throws {A2uiValidationError} If the function name, an argument name, or an
	*   argument value fails validation.
	*/
	validateFunction(name, args) {
		this.assertFunctionIdentifiers(name, args);
		const fn = this.catalog.functions.get(name) ?? (this.enforceIdentifiers && name === "@index" ? IndexApi : void 0);
		if (!fn) {
			if (!this.allowUnknown) throw new A2uiValidationError(`Unrecognized function '${name}'`);
			return args ?? {};
		}
		if (!fn.schema) {
			if (args !== void 0 && (typeof args !== "object" || args === null || Array.isArray(args))) throw new A2uiValidationError(`Validation failed for function '${name}': Expected object, received ${Array.isArray(args) ? "array" : typeof args}`);
			return args ?? {};
		}
		const result = fn.schema.safeParse(args ?? {});
		if (!result.success) throw new A2uiValidationError(`Validation failed for function '${name}': ${result.error.errors.map(formatZodIssue).join(", ")}`, result.error.issues);
		return result.data;
	}
	/**
	* Validates a surface theme against the catalog's theme schema.
	*
	* A catalog that declares no theme schema accepts any theme.
	*
	* @param theme Theme payload supplied on `createSurface`.
	* @returns The parsed theme, which a schema may have defaulted or coerced.
	* @throws {A2uiValidationError} If the theme does not satisfy the schema.
	*/
	validateTheme(theme) {
		const themeSchema = this.catalog.themeSchema;
		if (!themeSchema) return theme;
		const result = themeSchema.safeParse(theme);
		if (!result.success) throw new A2uiValidationError(`Validation failed for theme: ${result.error.errors.map(formatZodIssue).join(", ")}`, result.error.issues);
		return result.data;
	}
	/**
	* Asserts that an identifier is valid if identifier enforcement is enabled.
	*
	* @param name Identifier to check.
	* @param message Error message to use when validation fails.
	* @throws {A2uiValidationError} If identifier enforcement is active and `name` is invalid.
	*/
	assertIdentifier(name, message) {
		if (!this.enforceIdentifiers) return;
		if (!isValidUax31Identifier(name)) throw new A2uiValidationError(message);
	}
};
/**
* Strips processor envelope keys from a component payload, returning only component properties.
*
* @param comp Raw component payload.
* @returns New object holding only schema-described properties.
*/
function stripEnvelopeKeys(comp) {
	const properties = {};
	for (const [key, value] of Object.entries(comp)) {
		if (COMPONENT_ENVELOPE_KEYS.includes(key)) continue;
		properties[key] = value;
	}
	return properties;
}
/**
* Manages bidirectional RPC function execution between renderer and server agent.
*/
var RpcHandler = class {
	constructor(optionsOrCatalogs, outboundListener) {
		this.pendingAgentCalls = /* @__PURE__ */ new Map();
		this.isDisposed = false;
		if (Array.isArray(optionsOrCatalogs)) {
			this.catalogs = optionsOrCatalogs;
			this.outboundListener = outboundListener;
			this.defaultTimeoutMs = 3e4;
		} else {
			const options = optionsOrCatalogs ?? {};
			this.catalogs = options.catalogs ?? [];
			this.outboundListener = options.outboundListener;
			this.defaultTimeoutMs = options.defaultTimeoutMs ?? 3e4;
		}
	}
	/**
	* Whether this RPC handler has been disposed.
	*/
	get disposed() {
		return this.isDisposed;
	}
	/**
	* Executes a remote renderer function requested by the server agent.
	*
	* @param message Inbound callRendererFunction message.
	* @param context DataContext for function execution.
	* @param isUserActivated Whether execution occurs in an active user gesture context.
	* @returns A promise resolving to the renderer function response message.
	*/
	async handleCallRendererFunction(message, context, isUserActivated = false) {
		const validationError = this.validateInboundMessage(message);
		if (validationError) {
			await this.emitOutboundResponse(validationError);
			return validationError;
		}
		const { version, callRendererFunction } = message;
		const { functionCallId, callFunction } = callRendererFunction;
		const { call, catalogId, args } = callFunction;
		const resolved = this.resolveFunctionImplementation(catalogId, call, context, version);
		if ("error" in resolved) {
			const errorResponse = this.createResponseError(functionCallId, RpcErrorCode.INVALID_FUNCTION_CALL, resolved.error, version);
			await this.emitOutboundResponse(errorResponse);
			return errorResponse;
		}
		const accessError = this.checkExecutionPermissions(resolved.funcImpl, call, isUserActivated);
		if (accessError) {
			const errorResponse = this.createResponseError(functionCallId, RpcErrorCode.INVALID_FUNCTION_CALL, accessError, version);
			await this.emitOutboundResponse(errorResponse);
			return errorResponse;
		}
		const parsedArgsResult = this.parseArguments(resolved.catalog, resolved.funcImpl, args, call);
		if ("error" in parsedArgsResult) {
			const errorResponse = this.createResponseError(functionCallId, RpcErrorCode.INVALID_FUNCTION_CALL, parsedArgsResult.error, version);
			await this.emitOutboundResponse(errorResponse);
			return errorResponse;
		}
		const response = await this.executeFunctionSafely(resolved.funcImpl, parsedArgsResult.args, context, functionCallId, version);
		await this.emitOutboundResponse(response);
		return response;
	}
	/**
	* Processes an inbound agent function response to resolve or reject the matching pending outbound call.
	*
	* @param message Inbound agent function response message.
	*/
	handleAgentFunctionResponse(message) {
		if (!message || !message.agentFunctionResponse) return;
		const { functionCallId, value, error } = message.agentFunctionResponse;
		const pending = this.pendingAgentCalls.get(functionCallId);
		if (!pending) return;
		this.pendingAgentCalls.delete(functionCallId);
		if (error) {
			const errCode = error.code ?? RpcErrorCode.UNKNOWN_ERROR;
			const errMsg = error.message ?? "Agent function execution failed";
			pending.reject(new A2uiRpcError(errMsg, errCode, functionCallId, error));
		} else pending.resolve(value);
	}
	/**
	* Invokes a remote function on the server agent using an options bag.
	*
	* @template T Expected return value type of the agent function.
	* @param surfaceId Identifier of the surface requesting execution.
	* @param call Function call details.
	* @param options Optional invocation options (custom functionCallId, timeoutMs).
	* @returns A promise resolving to the agent function return value.
	* @throws {A2uiRpcError} If the handler is disposed, no listener is configured, the call is invalid or duplicate, or invocation times out or fails.
	*/
	callAgentFunction(surfaceId, call, options) {
		if (this.isDisposed) return Promise.reject(new A2uiRpcError("RpcHandler has been disposed.", RpcErrorCode.DISPOSED));
		if (!this.outboundListener) return Promise.reject(new A2uiRpcError("Cannot call agent function without outboundListener configured.", RpcErrorCode.NO_LISTENER));
		if (!call || !call.call) return Promise.reject(new A2uiRpcError("Missing or invalid function call name.", RpcErrorCode.INVALID_FUNCTION_CALL));
		const opts = options ?? {};
		const functionCallId = opts.functionCallId ?? this.generateFunctionCallId();
		const effectiveTimeoutMs = opts.timeoutMs ?? this.defaultTimeoutMs;
		if (this.pendingAgentCalls.has(functionCallId)) return Promise.reject(new A2uiRpcError(`A call with functionCallId '${functionCallId}' is already pending.`, RpcErrorCode.DUPLICATE, functionCallId));
		const normalized = {
			functionCallId,
			call,
			effectiveTimeoutMs,
			version: opts.version
		};
		return this.dispatchAgentCall(surfaceId, normalized);
	}
	/**
	* Disposes the RPC handler and cancels all pending agent function calls with a `CANCELLED` error.
	*/
	dispose() {
		if (this.isDisposed) return;
		this.isDisposed = true;
		for (const [id, pending] of this.pendingAgentCalls.entries()) pending.reject(new A2uiRpcError(`RpcHandler disposed while call '${id}' was pending.`, RpcErrorCode.CANCELLED, id));
		this.pendingAgentCalls.clear();
	}
	/**
	* Sends an outbound renderer response message to the outbound listener.
	*
	* @param response Renderer function response message to transmit.
	*/
	async emitOutboundResponse(response) {
		if (this.outboundListener) try {
			const res = this.outboundListener(response);
			if (res && typeof res.catch === "function") await res;
		} catch {}
	}
	/**
	* Validates an inbound renderer function call message.
	*
	* @param message Inbound message to validate.
	* @returns An error response if validation fails; otherwise `null`.
	*/
	validateInboundMessage(message) {
		if (!message) return this.createResponseError("unknown", RpcErrorCode.INVALID_FUNCTION_CALL, "Inbound message is null or undefined.", "unknown");
		const version = message.version;
		if (this.isDisposed) return this.createResponseError(message.callRendererFunction?.functionCallId ?? "unknown", RpcErrorCode.DISPOSED, "RpcHandler has been disposed.", version);
		if (!message.callRendererFunction?.callFunction) return this.createResponseError(message.callRendererFunction?.functionCallId ?? "unknown", RpcErrorCode.INVALID_FUNCTION_CALL, "Malformed message: missing callRendererFunction or callFunction.", version);
		return null;
	}
	/**
	* Resolves the catalog and function implementation for the requested call.
	*
	* @param catalogId Optional catalog identifier specified in the call.
	* @param call Function name to resolve.
	* @param context Optional data context providing a default surface catalog.
	* @param expectedVersion Optional protocol version to check compatibility against.
	* @returns The resolved function implementation and catalog, or an error descriptor.
	*/
	resolveFunctionImplementation(catalogId, call, context, expectedVersion) {
		let catalog;
		if (catalogId) {
			catalog = this.catalogs.find((c) => c.id === catalogId);
			if (!catalog) return { error: `Catalog not found: ${catalogId}` };
		} else if (context?.surface?.defaultCatalog) catalog = context.surface.defaultCatalog;
		if (!catalog) return { error: "No catalog available for function resolution." };
		if (catalog.protocolVersion && expectedVersion) {
			if (!isCatalogVersionCompatible(catalog.protocolVersion, expectedVersion)) return { error: `Catalog '${catalog.id}' specification version (${catalog.protocolVersion}) does not match message protocol version (${expectedVersion}).` };
		}
		const funcImpl = catalog.functions?.get(call);
		if (!funcImpl) return { error: `Function not found: ${call}` };
		return {
			funcImpl,
			catalog
		};
	}
	/**
	* Verifies caller boundary permissions and user activation requirements for a function.
	*
	* @param funcImpl Function implementation to inspect.
	* @param call Function name being invoked.
	* @param isUserActivated Whether execution occurs within an active user gesture context.
	* @returns An error message if permissions are not satisfied; otherwise `null`.
	*/
	checkExecutionPermissions(funcImpl, call, isUserActivated) {
		const boundary = funcImpl.allowedCallers ?? "rendererOnly";
		if (!(boundary === "rendererOrAgent" || boundary === "agentOnly")) return `Function '${call}' cannot be called by agent (allowedCallers is ${boundary}).`;
		if (funcImpl.requiresUserActivation && !isUserActivated) return `Function '${call}' requires user activation context to execute.`;
		return null;
	}
	/**
	* Validates and parses function arguments against the catalog function schema.
	*
	* @param catalog Catalog declaring the function.
	* @param _funcImpl Function implementation.
	* @param args Raw argument dictionary.
	* @param call Function name being invoked.
	* @returns Parsed arguments on success, or an error descriptor on validation failure.
	*/
	parseArguments(catalog, _funcImpl, args, call) {
		try {
			return { args: new PayloadValidator(catalog, { allowUnknownElements: false }).validateFunction(call, args) };
		} catch (err) {
			return { error: `Invalid function arguments for '${call}': ${this.extractErrorMessage(err)}` };
		}
	}
	/**
	* Executes a catalog function implementation, catching unhandled exceptions and formatting the response.
	*
	* Unwraps reactive signals and maps any thrown errors to an `EXECUTION_ERROR` response.
	*
	* @param funcImpl Function implementation to execute.
	* @param args Validated function arguments.
	* @param context Data context for function evaluation.
	* @param functionCallId Identifier of the function call.
	* @param version Protocol version for the response message.
	* @returns A promise resolving to the renderer function response message.
	*/
	async executeFunctionSafely(funcImpl, args, context, functionCallId, version) {
		const respVersion = version || "v1.0";
		try {
			const rawResult = await Promise.resolve(funcImpl.execute(args, context));
			const unwrapped = isSignal(rawResult) ? getValue(rawResult) : rawResult;
			return {
				version: respVersion,
				rendererFunctionResponse: {
					functionCallId,
					value: unwrapped !== void 0 ? unwrapped : null
				}
			};
		} catch (err) {
			const errMsg = this.extractErrorMessage(err);
			return {
				version: respVersion,
				rendererFunctionResponse: {
					functionCallId,
					error: {
						code: RpcErrorCode.EXECUTION_ERROR,
						message: errMsg || "An error occurred during function execution."
					}
				}
			};
		}
	}
	/**
	* Generates a unique function call identifier.
	*
	* @returns A unique call identifier string.
	*/
	generateFunctionCallId() {
		if (typeof globalThis.crypto?.randomUUID === "function") return globalThis.crypto.randomUUID();
		const randSuffix = Math.random().toString(36).substring(2, 15).padEnd(13, "0");
		return `call-${Date.now()}-${randSuffix}`;
	}
	/**
	* Dispatches an outbound agent function call and registers a pending promise with timeout handling.
	*
	* @template T Expected return value type.
	* @param surfaceId Identifier of the surface initiating the call.
	* @param callInfo Normalized agent call parameters.
	* @returns A promise resolving to the agent function return value.
	*/
	dispatchAgentCall(surfaceId, callInfo) {
		const { functionCallId, call, effectiveTimeoutMs, version } = callInfo;
		return new Promise((resolve, reject) => {
			let timer;
			const cleanup = () => {
				if (timer) {
					clearTimeout(timer);
					timer = void 0;
				}
				this.pendingAgentCalls.delete(functionCallId);
			};
			timer = this.createTimeoutTimer(functionCallId, call.call, effectiveTimeoutMs, cleanup, reject);
			this.pendingAgentCalls.set(functionCallId, {
				resolve: (val) => {
					cleanup();
					resolve(val);
				},
				reject: (err) => {
					cleanup();
					reject(err);
				}
			});
			this.sendOutboundMessage(surfaceId, functionCallId, call, version, cleanup, reject);
		});
	}
	/**
	* Creates a timeout timer for a pending agent function call.
	*
	* @param functionCallId Identifier of the pending function call.
	* @param callName Name of the function being called.
	* @param timeoutMs Duration in milliseconds before timeout expiry.
	* @param cleanup Teardown callback to invoke when the timer fires.
	* @param reject Rejection callback to reject the pending promise with a `TIMEOUT` error.
	* @returns The timer handle, or `undefined` if timeout is disabled.
	*/
	createTimeoutTimer(functionCallId, callName, timeoutMs, cleanup, reject) {
		if (timeoutMs <= 0) return void 0;
		return setTimeout(() => {
			if (this.pendingAgentCalls.delete(functionCallId)) {
				cleanup();
				reject(new A2uiRpcError(`Agent function call '${callName}' timed out after ${timeoutMs}ms.`, RpcErrorCode.TIMEOUT, functionCallId));
			}
		}, timeoutMs);
	}
	/**
	* Transmits an outbound callAgentFunction message to the registered outbound listener.
	*
	* @param surfaceId Identifier of the surface initiating the call.
	* @param functionCallId Identifier of the function call.
	* @param call Function call specification.
	* @param version Optional protocol version string.
	* @param cleanup Teardown callback invoked on failure.
	* @param reject Rejection callback invoked if transmission throws or rejects.
	*/
	sendOutboundMessage(surfaceId, functionCallId, call, version, cleanup, reject) {
		const outboundMsg = {
			version: version || "v1.0",
			callAgentFunction: {
				surfaceId,
				functionCallId,
				callFunction: call
			}
		};
		try {
			const result = this.outboundListener(outboundMsg);
			if (result && typeof result.catch === "function") result.catch((err) => {
				cleanup();
				reject(err);
			});
		} catch (err) {
			cleanup();
			reject(err);
		}
	}
	/**
	* Extracts a human-readable message string from an unknown error value.
	*
	* @param err Unknown error caught in a try/catch block.
	* @returns Formatted error message string.
	*/
	extractErrorMessage(err) {
		return err instanceof Error ? err.message : String(err);
	}
	/**
	* Constructs a renderer function error response message.
	*
	* @param functionCallId Identifier of the function call that failed.
	* @param code RPC error code or string category.
	* @param message Human-readable error description.
	* @param version Protocol version string.
	* @returns Formatted renderer function response message containing the error.
	*/
	createResponseError(functionCallId, code, message, version) {
		return {
			version: version || "v1.0",
			rendererFunctionResponse: {
				functionCallId,
				error: {
					code,
					message
				}
			}
		};
	}
};
/**
* Central processor for A2UI protocol messages and surface state management.
*
* @template T Concrete type of the ComponentApi.
*/
var MessageProcessor = class {
	/**
	* Initializes a new `MessageProcessor` instance.
	*
	* @param catalogs List of available component catalogs.
	* @param actionHandler Global handler for actions dispatched from all surfaces.
	* @param options Configuration options for the processor.
	*/
	constructor(catalogs, actionHandler, options) {
		this.catalogs = catalogs;
		this.actionHandler = actionHandler;
		this.model = new SurfaceGroupModel();
		this.adapterRegistry = options?.adapterRegistry ?? defaultVersionAdapterFactory;
		this.rpc = new RpcHandler({
			catalogs: this.catalogs,
			outboundListener: options?.outboundListener,
			defaultTimeoutMs: options?.defaultTimeoutMs
		});
		if (options?.validationConfig) this.validationConfig = {
			allowOrphanComponents: false,
			allowDanglingReferences: false,
			allowMissingRoot: false,
			allowUnknownElements: false,
			...options.validationConfig
		};
		else this.validationConfig = void 0;
		if (this.actionHandler) this.model.onAction.subscribe(this.actionHandler);
	}
	/**
	* Invokes a remote function on the server agent using an options bag.
	*
	* @param surfaceId The ID of the surface requesting execution.
	* @param call The function call details.
	* @param options Optional invocation options (custom functionCallId, timeoutMs).
	* @returns A promise resolving to the agent function return value.
	*/
	callAgentFunction(surfaceId, call, options) {
		return this.rpc.callAgentFunction(surfaceId, call, options);
	}
	/**
	* Disposes the MessageProcessor, tearing down active surfaces and rejecting pending RPC calls.
	*/
	dispose() {
		this.rpc.dispose();
	}
	/**
	* Generates the renderer capabilities object for the current processor.
	*
	* @param options Configuration for capability generation.
	* @returns The capabilities object.
	*/
	getRendererCapabilities(options) {
		if (!options?.versions || options.versions.length === 0) throw new A2uiValidationError("At least one protocol version must be provided in CapabilitiesOptions to generate renderer capabilities.");
		const versions = options.versions;
		const result = {};
		for (const ver of versions) {
			const versionCaps = { supportedCatalogIds: this.catalogs.map((c) => c.id) };
			const inlineCatalogs = options?.includeInlineCatalogs ? this.catalogs.map((c) => {
				if (compareSemVer(ver, "1.0") >= 0) return generateCatalogSchema(c, {
					componentEnvelopeRef: options?.componentEnvelopeRef,
					protocolVersion: ver
				});
				return this.generateLegacyInlineCatalog(c, options?.componentEnvelopeRef ?? "common_types.json#/$defs/ComponentCommon");
			}) : void 0;
			if (inlineCatalogs) versionCaps.inlineCatalogs = inlineCatalogs;
			result[ver] = versionCaps;
		}
		return result;
	}
	/**
	* Generates the client/renderer capabilities object for the current processor.
	*
	* @deprecated Use `getRendererCapabilities` instead.
	* @param options Configuration for capability generation.
	* @returns The capabilities object.
	*/
	getClientCapabilities(options) {
		return this.getRendererCapabilities(options);
	}
	/**
	* Generates a backwards-compatible inline catalog representation for v0.8/v0.9/v0.9.1.
	*
	* @param catalog The catalog instance to serialize.
	* @param componentEnvelopeRef Reference URI for the component base envelope.
	* @returns Legacy inline catalog object with array-based functions and flat theme properties.
	*/
	generateLegacyInlineCatalog(catalog, componentEnvelopeRef = "common_types.json#/$defs/ComponentCommon") {
		const rawSchema = generateCatalogSchema(catalog, { componentEnvelopeRef });
		const components = rawSchema.components || {};
		const rawFunctions = rawSchema.functions;
		const functions = [];
		for (const fn of catalog.functions.values()) {
			const fnDef = rawFunctions?.[fn.name];
			functions.push({
				name: fn.name,
				description: fn.description,
				returnType: fn.returnType,
				parameters: fnDef?.properties?.args ?? {
					type: "object",
					properties: {}
				}
			});
		}
		const theme = rawSchema.$defs?.theme?.properties;
		return {
			catalogId: catalog.id,
			components,
			...functions.length > 0 ? { functions } : {},
			...theme ? { theme } : {}
		};
	}
	/**
	* Serializes active surface data models configured for client-to-agent reporting.
	*
	* If version is provided, returns data models only for surfaces compatible with that version.
	* If version is omitted:
	*   - Automatically derives the protocol version from the active surface(s) with sendDataModel.
	*   - If active surfaces have conflicting protocol versions, throws A2uiValidationError.
	*
	* @param version Optional target protocol version to filter surfaces.
	* @returns Serialized data model payload, or undefined if no matching surfaces exist.
	*/
	getRendererDataModel(version) {
		const enabledSurfaces = Array.from(this.model.surfacesMap.values()).filter((s) => s.sendDataModel);
		if (enabledSurfaces.length === 0) return;
		if (version !== void 0) {
			const surfaces = {};
			for (const surface of enabledSurfaces) {
				const catVer = surface.defaultCatalog?.protocolVersion;
				if (!catVer || isCatalogVersionCompatible(catVer, version)) surfaces[surface.id] = surface.dataModel.get("/");
			}
			if (Object.keys(surfaces).length === 0) return;
			return {
				version,
				surfaces
			};
		}
		const versionsSet = /* @__PURE__ */ new Set();
		for (const surface of enabledSurfaces) if (surface.defaultCatalog?.protocolVersion) {
			const canonical = toCanonicalVersion(surface.defaultCatalog.protocolVersion);
			const canonicalVer = canonical ? `v${canonical}` : surface.defaultCatalog.protocolVersion;
			versionsSet.add(canonicalVer);
		}
		if (versionsSet.size > 1) throw new A2uiValidationError(`Multiple protocol versions detected among active surfaces: ${Array.from(versionsSet).sort().join(", ")}. Specify a target protocol version in getRendererDataModel(version).`);
		const verStr = versionsSet.size === 1 ? versionsSet.values().next().value : "v1.0";
		const surfaces = {};
		for (const surface of enabledSurfaces) surfaces[surface.id] = surface.dataModel.get("/");
		return {
			version: verStr,
			surfaces
		};
	}
	/**
	* Aggregates active client/renderer data models.
	*
	* @deprecated Use `getRendererDataModel` instead.
	* @param version Optional target protocol version to format data models for.
	* @returns Serialized data model payload, or undefined if no matching surfaces exist.
	*/
	getClientDataModel(version) {
		return this.getRendererDataModel(version);
	}
	/**
	* Resolves a relative path against a context path.
	*
	* @deprecated Use `DataModel.resolvePath` instead.
	* @param path The path to resolve.
	* @param contextPath The base path (optional).
	* @returns The resolved absolute path.
	*/
	resolvePath(path, contextPath) {
		return DataModel.resolvePath(path, contextPath);
	}
	/**
	* Gets a read-only map of active surfaces managed by this processor.
	*
	* @returns Map of surface models keyed by surface identifier.
	*/
	getSurfaces() {
		return this.model.surfacesMap;
	}
	/**
	* Retrieves an active surface by its ID.
	*
	* @param id The surface ID.
	* @returns The matching surface model, or undefined if not found.
	*/
	getSurface(id) {
		return this.model.getSurface(id);
	}
	/**
	* Subscribes to surface creation events.
	*
	* @param handler Callback invoked when a surface is created.
	* @returns A subscription object to unsubscribe.
	*/
	onSurfaceCreated(handler) {
		return this.model.onSurfaceCreated.subscribe(handler);
	}
	/**
	* Subscribes to surface deletion events.
	*
	* @param handler Callback invoked when a surface is deleted.
	* @returns A subscription object to unsubscribe.
	*/
	onSurfaceDeleted(handler) {
		return this.model.onSurfaceDeleted.subscribe(handler);
	}
	/**
	* Processes a list of messages, a message wrapper, or raw operations synchronously.
	*
	* @param messages The messages or operations to process.
	* @param context Contextual execution options.
	*/
	processMessages(messages, context) {
		const operations = this.prepareOperations(messages);
		for (const op of operations) this.processOperation(op, context);
	}
	/**
	* Asynchronously processes messages, executing RPC calls and returning all produced responses.
	*
	* @param messages The messages or operations to process.
	* @param context Contextual execution options.
	* @returns Array of rendererFunctionResponse messages produced during execution.
	*/
	async processMessagesAsync(messages, context) {
		const operations = this.prepareOperations(messages);
		const responses = [];
		for (const op of operations) {
			const resp = await this.processOperationAsync(op, context);
			if (resp) responses.push(resp);
		}
		return responses;
	}
	prepareOperations(messages) {
		if (!messages || Array.isArray(messages) && messages.length === 0) return [];
		if (this.validationConfig) validateRecursionAndPaths(messages);
		if (this.validationConfig?.targetVersion) this.validateTargetVersion(messages);
		if (isInternalOperation(messages)) return [messages];
		return this.adapterRegistry.resolveFromPayload(messages).extractOperations(messages);
	}
	validateTargetVersion(messages) {
		const expected = this.validationConfig?.targetVersion;
		if (!expected) return;
		const checkMsg = (msg) => {
			if (typeof msg === "object" && msg !== null && "version" in msg) {
				const msgVer = msg.version;
				if (msgVer) {
					if ((toCanonicalVersion(msgVer) ?? msgVer) !== (toCanonicalVersion(expected) ?? expected)) throw new A2uiValidationError(`Message version '${msgVer}' does not match expected target version '${expected}'`);
				}
			}
		};
		if (Array.isArray(messages)) for (const m of messages) checkMsg(m);
		else checkMsg(messages);
	}
	applyStateOperation(op) {
		if (this.validationConfig?.allowedMessages && !this.validationConfig.allowedMessages.includes(op.type)) throw new A2uiValidationError(`Operation '${op.type}' is not permitted by ValidationConfig.allowedMessages`);
		switch (op.type) {
			case "createSurface":
				this.processCreateSurfaceOp(op);
				break;
			case "deleteSurface":
				this.processDeleteSurfaceOp(op);
				break;
			case "updateComponents":
				this.processUpdateComponentsOp(op);
				break;
			case "updateDataModel":
				this.processUpdateDataModelOp(op);
				break;
			case "agentFunctionResponse": this.rpc.handleAgentFunctionResponse({
				version: op.version ?? "v1.0",
				agentFunctionResponse: {
					functionCallId: op.functionCallId,
					value: op.value,
					error: op.error
				}
			});
		}
	}
	/**
	* Resolves the DataContext for an inbound RPC callRendererFunction operation.
	*
	* @param op Operation containing optional catalog and function call identifiers.
	* @returns A DataContext attached to an existing matching surface or a fallback surface.
	*/
	resolveRpcDataContext(op) {
		const targetCatalog = (op.catalogId ? this.catalogs.find((c) => c.id === op.catalogId) : void 0) ?? this.catalogs[0];
		const surface = (op.catalogId ? Array.from(this.model.surfacesMap.values()).find((s) => s.defaultCatalog?.id === op.catalogId || s.availableCatalogs?.has(op.catalogId)) : void 0) ?? this.model.surfacesMap.values().next().value;
		if (surface) return new DataContext(surface, "/");
		const fallbackSurfaceId = `_rpc_fallback_${op.functionCallId || "default"}`;
		const availableCatalogs = /* @__PURE__ */ new Map();
		for (const cat of this.catalogs) if (targetCatalog?.protocolVersion && cat.protocolVersion && isCatalogVersionCompatible(targetCatalog.protocolVersion, cat.protocolVersion)) availableCatalogs.set(cat.id, cat);
		if (targetCatalog) availableCatalogs.set(targetCatalog.id, targetCatalog);
		return new DataContext(new SurfaceModel(fallbackSurfaceId, targetCatalog, availableCatalogs), "/");
	}
	/**
	* Processes a single canonical internal operation.
	*
	* @param op The internal operation to execute.
	* @param context Contextual execution options.
	*/
	processOperation(op, context) {
		if (op.type === "callRendererFunction") {
			const dataContext = this.resolveRpcDataContext(op);
			const isUserActivated = context?.isUserActivated ?? op.isUserActivated ?? false;
			const callMsg = {
				version: op.version ?? "v1.0",
				callRendererFunction: {
					functionCallId: op.functionCallId,
					callFunction: {
						call: op.call,
						catalogId: op.catalogId,
						args: op.args
					}
				}
			};
			this.rpc.handleCallRendererFunction(callMsg, dataContext, isUserActivated).catch((err) => {
				console.error(`Unhandled error in callRendererFunction (${op.call}):`, err);
			});
			return;
		}
		this.applyStateOperation(op);
	}
	async processOperationAsync(op, context) {
		if (op.type === "callRendererFunction") {
			const dataContext = this.resolveRpcDataContext(op);
			const isUserActivated = context?.isUserActivated ?? op.isUserActivated ?? false;
			const callMsg = {
				version: op.version ?? "v1.0",
				callRendererFunction: {
					functionCallId: op.functionCallId,
					callFunction: {
						call: op.call,
						catalogId: op.catalogId,
						args: op.args
					}
				}
			};
			return await this.rpc.handleCallRendererFunction(callMsg, dataContext, isUserActivated);
		}
		this.applyStateOperation(op);
		return null;
	}
	processCreateSurfaceOp(op) {
		const { surfaceId, catalogId, theme, sendDataModel, components, dataModel } = op;
		const catalog = catalogId !== void 0 ? this.catalogs.find((c) => c.id === catalogId) : this.catalogs[0];
		if (!catalog) throw new A2uiStateError(`Catalog not found: ${catalogId}`);
		const msgVersion = op.version;
		if (catalog.protocolVersion && msgVersion && !isCatalogVersionCompatible(catalog.protocolVersion, msgVersion)) throw new A2uiValidationError(`Surface '${surfaceId}' catalog '${catalogId ?? catalog.id}' specification version (${catalog.protocolVersion}) does not match message protocol version (${msgVersion}).`);
		if (this.model.getSurface(surfaceId)) throw new A2uiStateError(`Surface ${surfaceId} already exists.`);
		let validatedTheme = theme;
		if (theme && catalog.themeSchema) try {
			validatedTheme = new PayloadValidator(catalog, this.validationConfig).validateTheme(theme);
		} catch (err) {
			if (err instanceof A2uiValidationError) throw new A2uiValidationError(err.message.replace(/^Validation failed for theme:/, `Validation failed for theme on surface '${surfaceId}':`), err.details);
			throw err;
		}
		const surface = new SurfaceModel(surfaceId, catalog, new Map(this.catalogs.filter((c) => isCatalogVersionCompatible(c.protocolVersion, catalog.protocolVersion)).map((c) => [c.id, c])), validatedTheme, sendDataModel ?? false, void 0, op.rootId ?? "root");
		this.model.addSurface(surface);
		if (dataModel) surface.dataModel.set("/", dataModel);
		if (components && components.length > 0) this.processUpdateComponentsOp({
			type: "updateComponents",
			surfaceId,
			components
		});
	}
	processDeleteSurfaceOp(op) {
		if (!op.surfaceId) return;
		this.model.deleteSurface(op.surfaceId);
	}
	validateComponentProperties(comp, surface) {
		const { id, component } = comp;
		const rawCatalogId = comp.catalogId ?? comp.catalogID;
		if (typeof id !== "string" || !id) throw new A2uiValidationError(`Component '${component}' is missing an 'id'; entries require a valid string 'id'.`);
		let targetCatalog = surface.defaultCatalog;
		if (typeof rawCatalogId === "string" && rawCatalogId) {
			const found = surface.availableCatalogs.get(rawCatalogId);
			if (!found) {
				const known = this.catalogs.find((c) => c.id === rawCatalogId);
				if (!known) throw new A2uiValidationError(`Unknown catalog ID '${rawCatalogId}' for component '${id}'. Available catalogs: ${this.catalogs.map((c) => c.id).join(", ")}`);
				throw new A2uiValidationError(`Component '${id}' catalog '${rawCatalogId}' specification version (${known.protocolVersion}) does not match surface default catalog version (${surface.defaultCatalog.protocolVersion}).`);
			}
			targetCatalog = found;
		}
		const existing = surface.componentsModel.get(id);
		new PayloadValidator(targetCatalog, this.validationConfig).validateComponent(comp, existing?.type);
	}
	applyComponentUpdate(comp, surface) {
		const { id, component, ...properties } = comp;
		if (typeof id !== "string") return;
		const rawCatalogId = comp.catalogId ?? comp.catalogID;
		const existing = surface.componentsModel.get(id);
		let targetCatalog = surface.defaultCatalog;
		if (typeof rawCatalogId === "string" && rawCatalogId) {
			const found = surface.availableCatalogs.get(rawCatalogId);
			if (found) targetCatalog = found;
		}
		if (existing) {
			const componentType = typeof component === "string" ? component : existing.type;
			if (componentType !== existing.type || rawCatalogId && existing.catalog?.id !== targetCatalog.id) {
				surface.componentsModel.removeComponent(id);
				const newComponent = new ComponentModel(id, componentType, properties, targetCatalog);
				surface.componentsModel.addComponent(newComponent);
			} else existing.properties = properties;
		} else {
			if (typeof component !== "string" || !component) throw new A2uiValidationError(`Cannot create component ${id} without a type.`);
			const newComponent = new ComponentModel(id, component, properties, targetCatalog);
			surface.componentsModel.addComponent(newComponent);
		}
	}
	processUpdateComponentsOp(op) {
		if (!op.surfaceId) return;
		const surface = this.model.getSurface(op.surfaceId);
		if (!surface) throw new A2uiStateError(`Surface not found for message: ${op.surfaceId}`);
		for (const comp of op.components) this.validateComponentProperties(comp, surface);
		this.validateCompositionConstraints(surface, op.components);
		this.validateCandidateTopology(surface, op.components);
		for (const comp of op.components) this.applyComponentUpdate(comp, surface);
	}
	processUpdateDataModelOp(op) {
		if (!op.surfaceId) return;
		const surface = this.model.getSurface(op.surfaceId);
		if (!surface) throw new A2uiStateError(`Surface not found for message: ${op.surfaceId}`);
		const path = op.path || "/";
		const value = op.value;
		surface.dataModel.set(path, value);
	}
	validateParentConstraints(id, componentType, allowedParents, parents) {
		if (!parents || parents.length === 0) {
			if ((id === "root" || this.validationConfig && this.validationConfig.allowOrphanComponents === false) && !allowedParents.includes("Surface")) throw new A2uiValidationError(`Component '${id}' (${componentType}) cannot be placed under parent 'Surface' (Surface). Allowed parents: ${JSON.stringify(allowedParents)}.`, void 0, "UNALLOWED_PARENT");
			return;
		}
		for (const parentInfo of parents) if (!allowedParents.includes(parentInfo.parentType)) throw new A2uiValidationError(`Component '${id}' (${componentType}) cannot be placed under parent '${parentInfo.parentId}' (${parentInfo.parentType || "unknown"}). Allowed parents: ${JSON.stringify(allowedParents)}.`, void 0, "UNALLOWED_PARENT");
	}
	validateChildConstraints(id, componentType, allowedChildren, children, typeMap) {
		for (const childId of children) {
			const childType = typeMap.get(childId);
			if (childType && !allowedChildren.includes(childType)) throw new A2uiValidationError(`Container '${id}' (${componentType}) cannot contain child '${childId}' (${childType}). Allowed children: ${JSON.stringify(allowedChildren)}.`, void 0, "UNALLOWED_CHILD");
		}
	}
	buildCompositionTopology(surface, newComponents) {
		const typeMap = /* @__PURE__ */ new Map();
		const compCatalogMap = /* @__PURE__ */ new Map();
		const childMap = /* @__PURE__ */ new Map();
		for (const [id, model] of surface.componentsModel.entries) {
			typeMap.set(id, model.type);
			if (model.catalog) compCatalogMap.set(id, model.catalog);
			const children = surface.componentsModel.getChildIds(id);
			if (children.length > 0) childMap.set(id, children);
		}
		for (const comp of newComponents) {
			const { id, component, ...props } = comp;
			if (typeof id !== "string") continue;
			let compCatalog = surface.defaultCatalog;
			const rawCatalogId = comp.catalogId ?? comp.catalogID;
			if (typeof rawCatalogId === "string" && rawCatalogId) {
				const found = surface.availableCatalogs.get(rawCatalogId);
				if (found) {
					compCatalog = found;
					compCatalogMap.set(id, found);
				}
			}
			const existing = surface.componentsModel.get(id);
			const compType = (typeof component === "string" ? component : existing?.type) ?? "";
			if (compType) typeMap.set(id, compType);
			const compDef = {
				id,
				component: compType,
				...props
			};
			const children = Array.from(getComponentReferences(compDef, compCatalog)).map(([childId]) => childId);
			if (children.length > 0) childMap.set(id, children);
			else childMap.delete(id);
		}
		const parentMap = /* @__PURE__ */ new Map();
		for (const [parentId, children] of childMap.entries()) {
			const parentType = typeMap.get(parentId) || "Unknown";
			for (const childId of children) {
				const parents = parentMap.get(childId) ?? [];
				parents.push({
					parentId,
					parentType
				});
				parentMap.set(childId, parents);
			}
		}
		return {
			typeMap,
			compCatalogMap,
			childMap,
			parentMap
		};
	}
	validateCompositionConstraints(surface, newComponents) {
		const { typeMap, compCatalogMap, childMap, parentMap } = this.buildCompositionTopology(surface, newComponents);
		for (const [id, componentType] of typeMap.entries()) {
			const componentApi = (compCatalogMap.get(id) ?? surface.defaultCatalog).components.get(componentType);
			if (!componentApi) continue;
			if (componentApi.allowedParents && componentApi.allowedParents.length > 0) this.validateParentConstraints(id, componentType, componentApi.allowedParents, parentMap.get(id));
			if (componentApi.allowedChildren && componentApi.allowedChildren.length > 0) this.validateChildConstraints(id, componentType, componentApi.allowedChildren, childMap.get(id) || [], typeMap);
		}
	}
	validateCandidateTopology(surface, newComponents) {
		if (!this.validationConfig) return;
		const candidateModel = new SurfaceComponentsModel(surface.defaultCatalog);
		for (const [id, comp] of surface.componentsModel.entries) candidateModel.addComponent(new ComponentModel(id, comp.type, comp.properties, comp.catalog));
		for (const comp of newComponents) {
			const { id, component, ...properties } = comp;
			if (typeof id !== "string" || !id) continue;
			const rawCatalogId = comp.catalogId ?? comp.catalogID;
			let targetCatalog = surface.defaultCatalog;
			if (typeof rawCatalogId === "string" && rawCatalogId) {
				const found = surface.availableCatalogs.get(rawCatalogId);
				if (found) targetCatalog = found;
			}
			const existing = candidateModel.get(id);
			const componentType = (typeof component === "string" ? component : existing?.type) || "";
			if (!componentType) continue;
			if (existing) {
				if (componentType !== existing.type || rawCatalogId && existing.catalog?.id !== targetCatalog.id) {
					candidateModel.removeComponent(id);
					candidateModel.addComponent(new ComponentModel(id, componentType, properties, targetCatalog));
				} else existing.properties = properties;
			} else candidateModel.addComponent(new ComponentModel(id, componentType, properties, targetCatalog));
		}
		candidateModel.validateTopology({
			...this.validationConfig,
			rootId: this.validationConfig.rootId ?? surface.rootId
		});
	}
};
/**
* Context provided to components during rendering.
*
* Provides access to the component's model, the data context, and action dispatching.
*/
var ComponentContext = class {
	/**
	* Initializes a new `ComponentContext` instance.
	*
	* @param surface The surface model the component belongs to.
	* @param componentId The ID of the component.
	* @param dataModelBasePath The base path for data model access (default: '/').
	* @param parentDataContext Optional parent DataContext in the component tree.
	* @param index Optional explicit collection iteration index.
	*/
	constructor(surface, componentId, dataModelBasePath = "/", parentDataContext, index) {
		const model = surface.componentsModel.get(componentId);
		if (!model) throw new A2uiStateError(`Component not found: ${componentId}`);
		this.componentModel = model;
		this.surfaceComponents = surface.componentsModel;
		this.theme = surface.theme;
		this.dataContext = new DataContext(surface, dataModelBasePath, index, parentDataContext);
		this._actionDispatcher = (action) => surface.dispatchAction(action, this.componentModel.id);
	}
	/**
	* Dispatches an action from the component.
	*
	* @param action The action to dispatch.
	* @returns A promise that resolves when action dispatching completes.
	*/
	dispatchAction(action) {
		return this._actionDispatcher(action);
	}
};
/**
* Traverses a Zod schema tree to build a `BehaviorNode` map.
*
* Enables GenericBinder to determine how to handle raw JSON properties
* without hardcoding logic for specific component types.
*
* @param schema Zod schema to inspect.
* @returns Root BehaviorNode describing schema properties.
*/
function scrapeSchemaBehavior(schema) {
	return getFieldBehavior(schema);
}
/**
* Unwraps Zod wrapper schemas (ZodOptional, ZodNullable, ZodDefault,
* ZodReadonly, ZodEffects, ZodBranded, ZodLazy) to retrieve the underlying inner schema type.
*
* @param type Zod schema to unwrap.
* @returns The inner Zod schema.
*/
function unwrapZodSchema(type) {
	let current = type;
	while (current) {
		const typeName = current._def?.typeName;
		if (typeName === "ZodOptional" || typeName === "ZodNullable" || typeName === "ZodDefault" || typeName === "ZodReadonly") current = current._def.innerType;
		else if (typeName === "ZodEffects") current = current._def.schema;
		else if (typeName === "ZodBranded") current = current._def.type;
		else if (typeName === "ZodLazy") current = current._def.getter();
		else break;
	}
	return current;
}
/**
* Extracts the definition name from a schema's REF: description, if present.
* Walks the schema wrapper chain to locate the first non-empty description.
*
* @param type Zod schema to inspect.
* @returns Target definition name, or an empty string.
*/
function getRefDefName(type) {
	let current = type;
	let desc = "";
	while (current) {
		desc = current.description ?? current._def?.description ?? "";
		if (desc) break;
		const typeName = current._def?.typeName;
		if (typeName === "ZodOptional" || typeName === "ZodNullable" || typeName === "ZodDefault" || typeName === "ZodReadonly") current = current._def.innerType;
		else if (typeName === "ZodEffects") current = current._def.schema;
		else if (typeName === "ZodBranded") current = current._def.type;
		else if (typeName === "ZodLazy") current = current._def.getter();
		else break;
	}
	if (!desc || !desc.startsWith("REF:")) return "";
	return extractRefDefName(desc.slice(4).split("|")[0]);
}
/**
* Checks whether a schema represents a checkable validation rule or list of rules.
*
* @param type Zod schema to inspect.
* @returns Whether the schema represents a checkable field.
*/
function isCheckableField(type) {
	const defName = getRefDefName(type);
	if (defName === "Checkable" || defName === "CheckRule") return true;
	const current = unwrapZodSchema(type);
	if (current?._def?.typeName === "ZodArray") {
		const elem = current._def.type;
		if (getRefDefName(elem) === "CheckRule") return true;
	}
	return false;
}
function isActionOption(option) {
	if (getRefDefName(option) === "Action") return true;
	const def = unwrapZodSchema(option)._def;
	return def?.typeName === "ZodObject" && Boolean(def.shape?.().event);
}
function isDynamicOption(option) {
	const refDef = getRefDefName(option);
	if (refDef === "DataBinding" || refDef.startsWith("Dynamic")) return true;
	const def = unwrapZodSchema(option)._def;
	if (def?.typeName !== "ZodObject") return false;
	const shape = def.shape?.() || {};
	const hasComponentId = Object.values(shape).some((prop) => getRefDefName(prop) === "ComponentId");
	return Boolean(shape.path) && !hasComponentId;
}
function isChildListOption(option) {
	if (childRefKindOf(option) === "child-list" || getRefDefName(option) === "ChildList") return true;
	const def = unwrapZodSchema(option)._def;
	if (def?.typeName !== "ZodObject") return false;
	const shape = def.shape?.() || {};
	return Object.values(shape).some((prop) => getRefDefName(prop) === "ComponentId");
}
function isDynamicDef(defName, typeName) {
	return (defName === "DataBinding" || defName.startsWith("Dynamic")) && typeName !== "ZodObject" && typeName !== "ZodArray";
}
function matchUnionBehavior(options) {
	if (options.some(isActionOption)) return { type: "ACTION" };
	if (options.some(isDynamicOption)) return { type: "DYNAMIC" };
	if (options.some(isChildListOption)) return { type: "STRUCTURAL" };
}
function scrapeObjectShape(objShape) {
	const shape = {};
	for (const [key, value] of Object.entries(objShape)) shape[key] = getFieldBehavior(value);
	return shape;
}
/**
* Recursively maps a Zod schema to its corresponding BehaviorNode.
*
* @param type Zod schema to inspect.
* @returns Behavior node representing runtime handling for the schema.
*/
function getFieldBehavior(type) {
	const defName = getRefDefName(type);
	if (isCheckableField(type)) return { type: "CHECKABLE" };
	if (defName === "Action") return { type: "ACTION" };
	const current = unwrapZodSchema(type);
	if (childRefKindOf(current) === "child-list" || defName === "ChildList") return { type: "STRUCTURAL" };
	if (isDynamicDef(defName, current._def?.typeName)) return { type: "DYNAMIC" };
	if (current._def.typeName === "ZodUnion") {
		const unionBehavior = matchUnionBehavior(current._def.options);
		if (unionBehavior) return unionBehavior;
	}
	if (current._def.typeName === "ZodArray") return {
		type: "ARRAY",
		element: getFieldBehavior(current._def.type)
	};
	if (current._def.typeName === "ZodObject") return {
		type: "OBJECT",
		shape: scrapeObjectShape(current._def.shape())
	};
	return { type: "STATIC" };
}
/**
* The maximum number of children materialized by dynamic ChildList templates.
* Prevents unbounded resource consumption (CWE-400) when bound to massive arrays.
*/
const MAX_DYNAMIC_CHILD_LIST_SIZE = 1e4;
/**
* Safely bounds array length for dynamic child lists to prevent unbounded memory allocation.
* Returns an array of at most MAX_DYNAMIC_CHILD_LIST_SIZE items.
*/
function getSafeChildList(value) {
	if (!Array.isArray(value)) return [];
	return value.length > 1e4 ? value.slice(0, MAX_DYNAMIC_CHILD_LIST_SIZE) : value;
}
/**
* Reactive property binder transforming raw A2UI component JSON into strongly-typed resolved props.
*
* Connects component properties to the data context, resolves dynamic bindings,
* actions, structural templates, and validation checks.
*
* @template T Component property interface.
*/
var GenericBinder = class {
	/**
	* Creates a new binder for the given component context and schema.
	*
	* @param context Component context providing state and event dispatching.
	* @param schema Zod schema defining the component properties.
	*/
	constructor(context, schema) {
		this.dataListeners = [];
		this.propsListeners = [];
		/** Snapshot of currently resolved properties. */
		this.currentProps = {};
		this.isConnected = false;
		this.actionClosures = /* @__PURE__ */ new Map();
		this.context = context;
		this.behaviorTree = scrapeSchemaBehavior(schema);
		if (this.behaviorTree.type !== "OBJECT") this.behaviorTree = {
			type: "OBJECT",
			shape: {}
		};
		this.resolveInitialProps();
	}
	resolveInitialProps() {
		const props = this.context.componentModel.properties;
		const resolved = this.resolveAndBind(props, this.behaviorTree, [], true);
		this.currentProps = {
			...this.currentProps,
			...resolved || {}
		};
	}
	connect() {
		if (this.isConnected) return;
		this.isConnected = true;
		const sub = this.context.componentModel.onUpdated.subscribe(() => {
			this.rebuildAllBindings();
		});
		this.compUnsub = () => sub.unsubscribe();
		this.rebuildAllBindings();
	}
	rebuildAllBindings() {
		this.dataListeners.forEach((l) => l());
		this.dataListeners = [];
		const props = this.context.componentModel.properties;
		const resolved = this.resolveAndBind(props, this.behaviorTree, [], false);
		this.currentProps = {
			...this.currentProps,
			...resolved || {}
		};
		this.notify();
	}
	bindDynamicValue(value, path, isSync) {
		const bound = this.context.dataContext.subscribeDynamicValue(value, (newVal) => {
			this.updateDeepValue(path, newVal);
			this.notify();
		});
		if (!isSync) this.dataListeners.push(() => bound.unsubscribe());
		else bound.unsubscribe();
		return bound.value;
	}
	/**
	* Synchronously evaluates dynamic expressions within a nested object tree.
	*
	* Traverses objects and arrays, resolving JSON pointer paths and function calls
	* against the current data context without creating persistent reactive subscriptions.
	*
	* @param val Raw value, nested object, or dynamic expression to evaluate.
	* @param depth Current recursion depth, bounded by MAX_DYNAMIC_VALUE_DEPTH.
	* @returns Evaluated data structure with dynamic expressions resolved.
	*/
	resolveDeepSync(val, depth = 0) {
		if (typeof val !== "object" || val === null) return val;
		if (depth > 1e3) return void 0;
		if ("path" in val || "call" in val) return this.context.dataContext.resolveDynamicValue(val, depth);
		if (Array.isArray(val)) return val.map((item) => this.resolveDeepSync(item, depth + 1));
		const res = {};
		for (const [k, v] of Object.entries(val)) res[k] = this.resolveDeepSync(v, depth + 1);
		return res;
	}
	/**
	* Resolves a server-bound `event` action payload at invocation time, preserving
	* the `event` wrapper while evaluating nested `context` and `userMessage` fields.
	*/
	resolveEventAction(val) {
		if (typeof val !== "object" || val === null) return val;
		const obj = val;
		if ("event" in obj && typeof obj.event === "object" && obj.event !== null) {
			const ev = obj.event;
			const resolvedEvent = {
				...ev,
				context: ev.context ? this.resolveDeepSync(ev.context, 1) : void 0
			};
			if (ev["userMessage"] !== void 0) resolvedEvent["userMessage"] = this.resolveDeepSync(ev["userMessage"], 1);
			return {
				...obj,
				event: resolvedEvent
			};
		}
		if ("name" in obj) {
			const resolved = {
				...obj,
				context: obj.context ? this.resolveDeepSync(obj.context, 1) : void 0
			};
			if (obj["userMessage"] !== void 0) resolved["userMessage"] = this.resolveDeepSync(obj["userMessage"], 1);
			return resolved;
		}
		return this.resolveDeepSync(val, 0);
	}
	bindAction(value, path) {
		const cacheKey = path.join("/");
		const cached = this.actionClosures.get(cacheKey);
		if (cached && jsonEquals(cached.raw, value)) return cached.closure;
		const closure = () => {
			if (value && typeof value === "object") {
				const valObj = value;
				const fc = valObj.functionCall && typeof valObj.functionCall === "object" ? valObj.functionCall : valObj;
				if (typeof fc.call === "string") {
					this.context.dataContext.resolveDynamicValue(fc);
					return;
				}
			}
			this.context.dispatchAction(this.resolveEventAction(value));
		};
		this.actionClosures.set(cacheKey, {
			raw: value,
			closure
		});
		return closure;
	}
	mapTemplateChildren(rawArray, templateComponentId, templatePath) {
		const arr = getSafeChildList(rawArray);
		const listContext = this.context.dataContext.nested(templatePath);
		return arr.map((_, i) => ({
			id: templateComponentId,
			basePath: listContext.nested(String(i)).path
		}));
	}
	bindStructuralTemplate(value, path, isSync) {
		if (!value || typeof value !== "object" || Array.isArray(value)) return value;
		const templateObj = value;
		const templatePath = typeof templateObj.path === "string" ? templateObj.path : void 0;
		const templateComponentId = typeof templateObj.componentId === "string" ? templateObj.componentId : void 0;
		if (!templatePath || !templateComponentId) return value;
		const bound = this.context.dataContext.subscribeDynamicValue({ path: templatePath }, (newVal) => {
			const resolvedChildren = this.mapTemplateChildren(newVal, templateComponentId, templatePath);
			this.updateDeepValue(path, resolvedChildren);
			this.notify();
		});
		if (!isSync) this.dataListeners.push(() => bound.unsubscribe());
		else bound.unsubscribe();
		return this.mapTemplateChildren(bound.value, templateComponentId, templatePath);
	}
	extractValidationResult(val, fallbackMessage) {
		if (typeof val === "object" && val !== null && "valid" in val) {
			const customMessage = val.message;
			return {
				valid: Boolean(val.valid),
				message: customMessage !== void 0 && customMessage !== null ? String(customMessage) : fallbackMessage
			};
		}
		return {
			valid: Boolean(val),
			message: fallbackMessage
		};
	}
	bindCheckable(value, path, isSync) {
		const rules = Array.isArray(value) ? value : [];
		const ruleResults = rules.map(() => ({
			valid: true,
			message: ""
		}));
		const parentPath = path.slice(0, -1);
		const updateValidationState = () => {
			const errors = ruleResults.filter((r) => !r.valid).map((r) => r.message);
			this.updateDeepValue([...parentPath, "isValid"], errors.length === 0);
			this.updateDeepValue([...parentPath, "validationErrors"], errors);
			this.notify();
		};
		rules.forEach((rule, index) => {
			const ruleObj = typeof rule === "object" && rule !== null ? rule : void 0;
			const condition = ruleObj && ruleObj.condition !== void 0 ? ruleObj.condition : rule;
			const message = typeof ruleObj?.message === "string" ? ruleObj.message : "Validation failed";
			ruleResults[index].message = message;
			const bound = this.context.dataContext.subscribeDynamicValue(condition, (newVal) => {
				ruleResults[index] = this.extractValidationResult(newVal, message);
				updateValidationState();
			});
			if (!isSync) this.dataListeners.push(() => bound.unsubscribe());
			else bound.unsubscribe();
			ruleResults[index] = this.extractValidationResult(bound.value, message);
		});
		const initialErrors = ruleResults.filter((r) => !r.valid).map((r) => r.message);
		this.updateDeepValue([...parentPath, "isValid"], initialErrors.length === 0);
		this.updateDeepValue([...parentPath, "validationErrors"], initialErrors);
		return value;
	}
	bindObject(valObj, shape, path, isSync) {
		const result = {};
		for (const [k, v] of Object.entries(valObj)) {
			const childBehavior = shape[k] || { type: "STATIC" };
			result[k] = this.resolveAndBind(v, childBehavior, [...path, k], isSync);
		}
		for (const [k, childBehavior] of Object.entries(shape)) if (childBehavior.type === "DYNAMIC") {
			const setterName = `set${k.charAt(0).toUpperCase() + k.slice(1)}`;
			const rawPropValue = valObj[k];
			result[setterName] = (newValue) => {
				if (rawPropValue && typeof rawPropValue === "object" && "path" in rawPropValue) {
					const pathVal = rawPropValue.path;
					if (typeof pathVal === "string") this.context.dataContext.set(pathVal, newValue);
				}
			};
		}
		return result;
	}
	resolveAndBind(value, behavior, path, isSync) {
		if (value === void 0 || value === null) return value;
		switch (behavior.type) {
			case "DYNAMIC": return this.bindDynamicValue(value, path, isSync);
			case "ACTION": return this.bindAction(value, path);
			case "STRUCTURAL": return this.bindStructuralTemplate(value, path, isSync);
			case "CHECKABLE": return this.bindCheckable(value, path, isSync);
			case "STATIC": return value;
			case "ARRAY":
				if (!Array.isArray(value)) return value;
				return value.map((item, index) => this.resolveAndBind(item, behavior.element, [...path, index.toString()], isSync));
			case "OBJECT":
				if (typeof value !== "object") return value;
				return this.bindObject(value, behavior.shape, path, isSync);
		}
	}
	updateDeepValue(path, newValue) {
		this.currentProps = this.cloneAndUpdate(this.currentProps, path, newValue);
	}
	cloneAndUpdate(obj, path, newValue) {
		if (path.length === 0) return newValue;
		const [key, ...rest] = path;
		if (Array.isArray(obj)) {
			const newArr = [...obj];
			newArr[Number(key)] = this.cloneAndUpdate(newArr[Number(key)], rest, newValue);
			return newArr;
		} else {
			const record = typeof obj === "object" && obj !== null ? obj : {};
			return {
				...record,
				[key]: this.cloneAndUpdate(record[key], rest, newValue)
			};
		}
	}
	/**
	* Disposes all active data subscriptions and detaches component listeners.
	*/
	dispose() {
		if (!this.isConnected) return;
		this.isConnected = false;
		this.dataListeners.forEach((l) => l());
		this.dataListeners = [];
		if (this.compUnsub) {
			this.compUnsub();
			this.compUnsub = void 0;
		}
	}
	notify() {
		this.propsListeners.forEach((l) => l(this.currentProps));
	}
	/**
	* Subscribes to prop change notifications.
	*
	* @param listener Callback invoked whenever resolved properties update.
	* @returns A subscription object to unsubscribe.
	*/
	subscribe(listener) {
		if (this.propsListeners.length === 0) this.connect();
		this.propsListeners.push(listener);
		return { unsubscribe: () => {
			this.propsListeners = this.propsListeners.filter((l) => l !== listener);
			if (this.propsListeners.length === 0) this.dispose();
		} };
	}
	/**
	* Current snapshot of resolved component properties.
	*/
	get snapshot() {
		return this.currentProps;
	}
};
/**
* Evaluates structural equality between two JSON-compatible values.
*
* @param a First value to compare.
* @param b Second value to compare.
* @returns Whether the two values are structurally equal.
*/
function jsonEquals(a, b) {
	if (Object.is(a, b)) return true;
	if (typeof a !== "object" || typeof b !== "object" || a === null || b === null) return false;
	if (Array.isArray(a) || Array.isArray(b)) {
		if (!Array.isArray(a) || !Array.isArray(b) || a.length !== b.length) return false;
		return a.every((item, index) => jsonEquals(item, b[index]));
	}
	const aKeys = Object.keys(a);
	const bKeys = Object.keys(b);
	if (aKeys.length !== bKeys.length) return false;
	return aKeys.every((key) => Object.prototype.hasOwnProperty.call(b, key) && jsonEquals(a[key], b[key]));
}
/**
* Resolved dynamic value snapshot in a node's properties.
*
* Captures the current value pinned at the time of emission. A new binding instance
* is emitted through the node's properties whenever the underlying value changes.
*
* Literal and function-call values resolve to a read-only `ResolvedBinding`, preventing
* accidental writes without explicitly narrowing to {@link WritableBinding}.
*/
var ResolvedBinding = class {
	/**
	* Creates a new `ResolvedBinding` instance.
	*
	* @param value The resolved snapshot value.
	*/
	constructor(value) {
		this.value = value;
	}
};
/**
* Writable resolved dynamic binding backed by a mutable data model path.
*/
var WritableBinding = class extends ResolvedBinding {
	/**
	* Creates a new `WritableBinding` instance.
	*
	* @param value Current snapshot value.
	* @param set Setter callback to update the underlying model.
	* @param path Authored data path.
	*/
	constructor(value, set, path) {
		super(value);
		this.set = set;
		this.path = path;
	}
};
/**
* Narrows a `ResolvedBinding` to a `WritableBinding`.
*
* @param binding The binding to check.
* @returns Whether the binding is writable.
*/
function isWritable(binding) {
	return binding instanceof WritableBinding;
}
/**
* Compares two bindings for equivalence during change detection.
*
* Returns true if both bindings have identical writability, write destination path,
* and structurally equal snapshot values.
*
* @param a First binding.
* @param b Second binding.
* @returns Whether the two bindings are equivalent.
*/
function sameBinding(a, b) {
	if (isWritable(a) !== isWritable(b)) return false;
	if (isWritable(a) && isWritable(b) && a.path !== b.path) return false;
	return valueEquals(a.value, b.value);
}
function valueEquals(a, b) {
	if (Object.is(a, b)) return true;
	if (Array.isArray(a) && Array.isArray(b)) return a.length === b.length && a.every((item, i) => valueEquals(item, b[i]));
	if (isPlainObject$1(a) && isPlainObject$1(b)) {
		const aKeys = Object.keys(a);
		const bKeys = Object.keys(b);
		return aKeys.length === bKeys.length && aKeys.every((key) => key in b && valueEquals(a[key], b[key]));
	}
	return false;
}
function isPlainObject$1(value) {
	if (typeof value !== "object" || value === null) return false;
	const proto = Object.getPrototypeOf(value);
	return proto === Object.prototype || proto === null;
}
/** The component type name used for pending and cyclic placeholder nodes. */
const PLACEHOLDER_TYPE = "Placeholder";
/**
* Narrows an unknown value to a `ComponentNode`.
*
* @param value The value to inspect.
* @returns Whether the value is a `ComponentNode`.
*/
function isComponentNode(value) {
	return value instanceof MutableComponentNode;
}
/**
* Mutable implementation of `ComponentNode`.
*
* Used internally by the node resolver to construct, update, and dispose nodes.
*/
var MutableComponentNode = class {
	/**
	* Creates a new `MutableComponentNode` instance.
	*
	* @param instanceId Unique instance identifier in the tree.
	* @param componentId The component ID from the payload.
	* @param type The component type name.
	* @param dataPath Data model scope path.
	* @param initialProps Initial resolved properties.
	* @param impl Optional catalog component definition.
	* @param state Initial resolution state.
	*/
	constructor(instanceId, componentId, type, dataPath, initialProps, impl, state = "resolved") {
		this._onDestroyed = new EventEmitter();
		this.onDestroyed = this._onDestroyed;
		this.cleanups = [];
		this._disposed = false;
		this.instanceId = instanceId;
		this.componentId = componentId;
		this.type = type;
		this.dataPath = dataPath;
		this.props = signal(initialProps);
		this.impl = impl;
		this.state = state;
	}
	/** Whether this node has been disposed. */
	get disposed() {
		return this._disposed;
	}
	/** Whether this node is an unresolved placeholder. */
	get isPlaceholder() {
		return this.state !== "resolved";
	}
	/**
	* Registers teardown work to run when this node is disposed.
	*
	* @param cleanup Teardown callback.
	*/
	addCleanup(cleanup) {
		this.cleanups.push(cleanup);
	}
	/**
	* Serializes the resolved tree for debugging and headless assertions.
	*
	* @returns Serialized JSON-compatible representation.
	*/
	toJSON() {
		if (this.isPlaceholder) return {
			id: this.componentId,
			type: this.type,
			state: this.state
		};
		const serialized = {
			id: this.componentId,
			type: this.type
		};
		const props = peekValue(this.props);
		for (const [key, value] of Object.entries(props)) serialized[key] = serializeValue(value);
		return serialized;
	}
	/**
	* Replaces resolved properties, emitting only when a shallow comparison detects a change.
	*
	* @param next Next property dictionary.
	*/
	setProps(next) {
		if (this._disposed) return;
		if (!shallowEqual(peekValue(this.props), next)) setValue(this.props, next);
	}
	/**
	* Tears down this node by running cleanups and firing destruction events.
	*
	* This operation is idempotent.
	*/
	dispose() {
		if (this._disposed) return;
		this._disposed = true;
		for (const cleanup of this.cleanups) try {
			cleanup();
		} catch (e) {
			console.error(`ComponentNode cleanup error (${this.instanceId}):`, e);
		}
		this.cleanups = [];
		this._onDestroyed.emit();
		this._onDestroyed.dispose();
	}
};
function serializeValue(value) {
	if (isComponentNode(value)) return value.toJSON();
	if (value instanceof ResolvedBinding) return serializeValue(value.value);
	if (typeof value === "function") return "<Action>";
	if (Array.isArray(value)) return value.map(serializeValue);
	if (value && typeof value === "object") {
		const result = {};
		for (const [key, inner] of Object.entries(value)) result[key] = serializeValue(inner);
		return result;
	}
	return value;
}
function shallowEqual(a, b) {
	if (Object.is(a, b)) return true;
	const aKeys = Object.keys(a);
	const bKeys = Object.keys(b);
	if (aKeys.length !== bKeys.length) return false;
	for (const key of aKeys) if (!Object.is(a[key], b[key])) return false;
	return true;
}
/**
* Classification reads the child-reference marker `ComponentIdSchema` and
* `ChildListSchema` carry in their zod metadata, which survives
* `.describe()` and other schema-rebuilding methods. The `REF:` description
* pointers below are recognized as well, for schemas that author the
* pointer by hand rather than deriving from those two.
*/
const COMPONENT_ID_REF = "REF:common_types.json#/$defs/ComponentId";
const CHILD_LIST_REF = "REF:common_types.json#/$defs/ChildList";
const EMPTY_REF_FIELDS$1 = /* @__PURE__ */ new Map();
const refFieldsCache = /* @__PURE__ */ new WeakMap();
/**
* Extracts the child-referencing properties and their kinds from a component Zod schema.
*
* @param schema Component Zod schema to inspect.
* @returns Map of child-referencing property names to their reference kinds.
*/
function extractRefFields(schema) {
	const cached = refFieldsCache.get(schema);
	if (cached) return cached;
	const unwrapped = unwrap(schema);
	if (unwrapped.schema._def.typeName !== "ZodObject") {
		refFieldsCache.set(schema, EMPTY_REF_FIELDS$1);
		return EMPTY_REF_FIELDS$1;
	}
	const fields = /* @__PURE__ */ new Map();
	const shape = unwrapped.schema.shape;
	for (const [key, value] of Object.entries(shape)) {
		const field = unwrap(value);
		if (marksChildList(field) || isChildListUnion(field.schema)) {
			fields.set(key, { kind: "list" });
			continue;
		}
		if (marksComponentId(field)) {
			fields.set(key, { kind: "single" });
			continue;
		}
		if (field.schema._def.typeName === "ZodArray") {
			const element = unwrap(field.schema._def.type);
			if (marksComponentId(element)) {
				fields.set(key, { kind: "list" });
				continue;
			}
			if (element.schema._def.typeName === "ZodObject") {
				const subKeys = /* @__PURE__ */ new Set();
				const elementShape = element.schema.shape;
				for (const [subKey, subValue] of Object.entries(elementShape)) if (marksComponentId(unwrap(subValue))) subKeys.add(subKey);
				if (subKeys.size > 0) fields.set(key, {
					kind: "nested",
					keys: subKeys
				});
			}
		}
	}
	const result = fields;
	refFieldsCache.set(schema, result);
	return result;
}
function unwrap(schema) {
	const descriptions = [];
	const refs = /* @__PURE__ */ new Set();
	let current = schema;
	for (;;) {
		if (current.description) descriptions.push(current.description);
		const ref = childRefKindOf(current);
		if (ref) refs.add(ref);
		const typeName = current._def.typeName;
		if (typeName === "ZodOptional" || typeName === "ZodNullable" || typeName === "ZodDefault") current = current._def.innerType;
		else if (typeName === "ZodEffects") current = current._def.schema;
		else return {
			schema: current,
			descriptions,
			refs
		};
	}
}
function marksComponentId(field) {
	return field.refs.has("component-id") || hasPointer(field.descriptions, COMPONENT_ID_REF);
}
function marksChildList(field) {
	return field.refs.has("child-list") || hasPointer(field.descriptions, CHILD_LIST_REF);
}
function hasPointer(descriptions, pointer) {
	return descriptions.some((d) => d.startsWith(pointer));
}
/** Matches the binder's STRUCTURAL detection for `ChildList`-shaped unions. */
function isChildListUnion(schema) {
	if (schema._def.typeName !== "ZodUnion") return false;
	return schema._def.options.some((o) => {
		if (o._def.typeName !== "ZodObject") return false;
		const shape = o.shape;
		return shape.componentId && shape.path;
	});
}
const ROOT_COMPONENT_ID = "root";
const ROOT_DATA_PATH = "/";
const EMPTY_REF_FIELDS = /* @__PURE__ */ new Map();
/**
* Resolves a surface model's flat component dictionary into a reactive tree of `ComponentNode`s.
*
* Child references become `ComponentNode` objects, template `ChildList`s spawn one node per array item,
* not-yet-arrived components appear as placeholder nodes and are upgraded in place, and every node's
* binder and data subscriptions are torn down when its parent stops referencing it or the resolver is disposed.
*
* Construction requires a catalog whose functions are executable (`F extends FunctionImplementation`).
*/
var NodeResolver = class {
	/**
	* Creates a new `NodeResolver` instance.
	*
	* @param surface Surface model to observe.
	* @param catalog Catalog containing component schemas and function implementations.
	* @throws {A2uiStateError} If the catalog instance differs from the surface's catalog.
	*/
	constructor(surface, catalog) {
		this.records = /* @__PURE__ */ new Map();
		this.nodesByEdge = /* @__PURE__ */ new Map();
		this.nodesByComponentId = /* @__PURE__ */ new Map();
		/** Parents holding a placeholder for a component id, awaiting its arrival. */
		this.pendingParents = /* @__PURE__ */ new Map();
		/** Errors already dispatched, keyed by component id, then data path. */
		this.dispatchedErrors = /* @__PURE__ */ new Map();
		this.modelSubs = [];
		this._disposed = false;
		if (catalog !== surface.defaultCatalog) throw new A2uiStateError("NodeResolver requires the same catalog instance its surface was constructed with.");
		this.surface = surface;
		this.catalog = catalog;
		this.rootId = surface.rootId ?? ROOT_COMPONENT_ID;
		this.rootNode = signal(void 0);
		this.modelSubs.push(surface.componentsModel.onCreated.subscribe((component) => this.onComponentCreated(component)));
		this.modelSubs.push(surface.componentsModel.onDeleted.subscribe((id) => this.onComponentDeleted(id)));
		if (surface.componentsModel.get(this.rootId)) this.buildRoot();
	}
	/**
	* Dispatches once per (code, component, path) for as long as the condition
	* persists: the record is cleared when the component is deleted, when a
	* node for the pair resolves, or when a cyclic stand-in's edge goes away,
	* so a condition that is fixed and later reintroduced reports again.
	*/
	dispatchOnce(code, componentId, dataPath, message) {
		let byPath = this.dispatchedErrors.get(componentId);
		if (!byPath) {
			byPath = /* @__PURE__ */ new Map();
			this.dispatchedErrors.set(componentId, byPath);
		}
		let codes = byPath.get(dataPath);
		if (!codes) {
			codes = /* @__PURE__ */ new Set();
			byPath.set(dataPath, codes);
		}
		if (codes.has(code)) return;
		codes.add(code);
		this.surface.dispatchError({
			code,
			message
		});
	}
	clearDispatched(componentId, dataPath) {
		const byPath = this.dispatchedErrors.get(componentId);
		if (byPath?.delete(dataPath) && byPath.size === 0) this.dispatchedErrors.delete(componentId);
	}
	/** Total count of live nodes in the tree, including placeholders. */
	get activeNodeCount() {
		return this.records.size;
	}
	/** Whether this resolver has been disposed. */
	get disposed() {
		return this._disposed;
	}
	/**
	* Tears down the entire node tree and disconnects model event listeners.
	*
	* This operation is idempotent.
	*/
	dispose() {
		if (this._disposed) return;
		this._disposed = true;
		for (const sub of this.modelSubs) sub.unsubscribe();
		this.modelSubs.length = 0;
		for (const node of [...this.records.keys()]) this.disposeNode(node);
		this.pendingParents.clear();
		this.dispatchedErrors.clear();
		this.rootRecord = void 0;
		setValue(this.rootNode, void 0);
	}
	/** No-op while a root record exists; root deletion clears it so a re-sent root rebuilds. */
	buildRoot() {
		if (this.rootRecord) return;
		const rootEdgeKey = `>${escapeIdPart(this.rootId)}>${escapeIdPart(this.rootId)}@/`;
		const node = this.createNode(this.rootId, ROOT_DATA_PATH, rootEdgeKey, void 0);
		this.rootRecord = this.records.get(node);
		setValue(this.rootNode, node);
	}
	onComponentCreated(component) {
		if (this._disposed) return;
		if (component.id === this.rootId) {
			const current = this.surface.componentsModel.get(this.rootId);
			if (this.rootRecord && this.rootRecord.componentModel !== current) {
				this.disposeNode(this.rootRecord.node);
				this.rootRecord = void 0;
				if (!current) setValue(this.rootNode, void 0);
			}
			if (current) this.buildRoot();
		}
		const waiting = this.pendingParents.get(component.id);
		if (waiting) {
			this.pendingParents.delete(component.id);
			for (const parent of waiting) {
				const record = this.records.get(parent);
				if (record && !parent.disposed) this.materialize(record);
			}
		}
	}
	onComponentDeleted(id) {
		if (this._disposed) return;
		this.dispatchedErrors.delete(id);
		const model = this.surface.componentsModel.get(id);
		const affected = this.nodesByComponentId.get(id);
		if (!affected) return;
		const parentsToRefresh = /* @__PURE__ */ new Set();
		let rootAffected = false;
		for (const node of [...affected]) {
			const record = this.records.get(node);
			if (!record) continue;
			if (record.parent) parentsToRefresh.add(record.parent);
			else rootAffected = true;
		}
		if (rootAffected && this.rootRecord) {
			if (!model) {
				this.disposeNode(this.rootRecord.node);
				this.rootRecord = void 0;
				setValue(this.rootNode, void 0);
			} else if (this.rootRecord.componentModel !== model) {
				this.disposeNode(this.rootRecord.node);
				this.rootRecord = void 0;
				this.buildRoot();
			}
		}
		for (const parent of parentsToRefresh) {
			const record = this.records.get(parent);
			if (record && !parent.disposed) this.materialize(record);
		}
	}
	/**
	* Creates a node for one (componentId, dataPath) edge. A missing component
	* definition yields a placeholder node and registers the parent for a
	* refresh when the definition arrives.
	*/
	createNode(componentId, dataPath, edgeKey, parent, occurrence = 1) {
		const model = this.surface.componentsModel.get(componentId);
		if (!model) {
			const record = this.registerNode(new MutableComponentNode(instanceIdFor(componentId, dataPath, occurrence), componentId, PLACEHOLDER_TYPE, dataPath, {}, void 0, "pending"), {
				edgeKey,
				parent,
				occurrence,
				refFields: EMPTY_REF_FIELDS
			});
			if (parent) this.registerPendingParent(componentId, parent);
			return record.node;
		}
		const compCatalog = (model.catalog?.components.size ? model.catalog : void 0) ?? this.catalog;
		const api = compCatalog.components.get(model.type);
		if (!api) {
			this.dispatchOnce("UNKNOWN_COMPONENT_TYPE", componentId, dataPath, `Component '${componentId}' has type '${model.type}', which is not in catalog '${compCatalog.id}'.`);
			return this.registerNode(new MutableComponentNode(instanceIdFor(componentId, dataPath, occurrence), componentId, model.type, dataPath, {}, void 0, "unknown-type"), {
				edgeKey,
				parent,
				occurrence,
				refFields: EMPTY_REF_FIELDS,
				componentModel: model
			}).node;
		}
		this.clearDispatched(componentId, dataPath);
		const parentDataContext = parent ? this.records.get(parent)?.context?.dataContext : void 0;
		const context = new ComponentContext(this.surface, componentId, dataPath, parentDataContext);
		const binder = new GenericBinder(context, api.schema);
		const record = this.registerNode(new MutableComponentNode(instanceIdFor(componentId, dataPath, occurrence), componentId, model.type, dataPath, {}, api), {
			edgeKey,
			parent,
			occurrence,
			refFields: extractRefFields(api.schema),
			behavior: scrapeSchemaBehavior(api.schema),
			context,
			componentModel: model,
			binder
		});
		record.binderSub = binder.subscribe((raw) => {
			record.lastBinderProps = raw;
			this.materialize(record);
		});
		record.lastBinderProps = binder.snapshot;
		this.materialize(record);
		return record.node;
	}
	registerNode(node, partial) {
		const record = {
			node,
			edgeKey: partial.edgeKey,
			parent: partial.parent,
			occurrence: partial.occurrence,
			refFields: partial.refFields,
			behavior: partial.behavior,
			context: partial.context,
			componentModel: partial.componentModel,
			binder: partial.binder,
			childEdges: /* @__PURE__ */ new Map()
		};
		this.records.set(node, record);
		this.nodesByEdge.set(partial.edgeKey, node);
		let byId = this.nodesByComponentId.get(node.componentId);
		if (!byId) {
			byId = /* @__PURE__ */ new Set();
			this.nodesByComponentId.set(node.componentId, byId);
		}
		byId.add(node);
		return record;
	}
	/**
	* Returns the node for a child edge, reusing the cached node when the edge
	* is unchanged and replacing it (placeholder upgrade or downgrade, id
	* change, type change) when it is not.
	*/
	childNode(componentId, dataPath, edgeKey, parent, occurrence = 1) {
		const existing = this.nodesByEdge.get(edgeKey);
		if (this.isCyclic(componentId, dataPath, parent)) {
			if (existing && !existing.disposed && existing.isPlaceholder && this.records.get(existing)?.occurrence === occurrence) return existing;
			if (existing && !existing.disposed) this.disposeNode(existing);
			this.dispatchOnce("CYCLIC_REFERENCE", componentId, dataPath, `Component '${componentId}' at '${dataPath}' is referenced by one of its own descendants; rendering a placeholder instead.`);
			return this.registerNode(new MutableComponentNode(instanceIdFor(componentId, dataPath, occurrence), componentId, PLACEHOLDER_TYPE, dataPath, {}, void 0, "cyclic"), {
				edgeKey,
				parent,
				occurrence,
				refFields: EMPTY_REF_FIELDS
			}).node;
		}
		if (existing && !existing.disposed) {
			const model = this.surface.componentsModel.get(componentId);
			const compCatalog = (model?.catalog?.components.size ? model.catalog : void 0) ?? this.catalog;
			const api = model ? compCatalog.components.get(model.type) : void 0;
			const existingRecord = this.records.get(existing);
			if (existing.componentId === componentId && existing.dataPath === dataPath && existingRecord?.occurrence === occurrence && (existing.isPlaceholder ? model === void 0 && existing.state === "pending" || model !== void 0 && api === void 0 && existing.state === "unknown-type" && existingRecord?.componentModel === model : model !== void 0 && existing.type === model.type && existingRecord?.componentModel === model)) {
				if (existing.state === "pending") this.registerPendingParent(componentId, parent);
				return existing;
			}
			this.disposeNode(existing);
		}
		return this.createNode(componentId, dataPath, edgeKey, parent, occurrence);
	}
	/** Registers a parent to be refreshed when `componentId` arrives. */
	registerPendingParent(componentId, parent) {
		let waiting = this.pendingParents.get(componentId);
		if (!waiting) {
			waiting = /* @__PURE__ */ new Set();
			this.pendingParents.set(componentId, waiting);
		}
		waiting.add(parent);
	}
	/** True when (componentId, dataPath) already appears in the parent chain. */
	isCyclic(componentId, dataPath, parent) {
		for (let node = parent; node; node = this.records.get(node)?.parent) if (node.componentId === componentId && node.dataPath === dataPath) return true;
		return false;
	}
	/**
	* Rebuilds a node's resolved props from its binder output: child reference
	* properties become live `ComponentNode`s, children this parent no longer
	* references are disposed, and unchanged values keep reference identity so
	* the shallow comparison in `MutableComponentNode.setProps` stays exact.
	*/
	materialize(record) {
		if (record.node.disposed) return;
		const next = { ...record.lastBinderProps ?? record.binder?.snapshot ?? {} };
		const newEdges = /* @__PURE__ */ new Map();
		const modelProps = record.componentModel?.properties;
		if (modelProps) {
			for (const key of record.refFields.keys()) if (key in next && !(key in modelProps)) delete next[key];
		}
		const occurrences = /* @__PURE__ */ new Map();
		const resolveChild = (slot, componentId, dataPath) => {
			const occurrenceKey = `${escapeIdPart(componentId)}@${escapeIdPart(dataPath)}`;
			const occurrence = (occurrences.get(occurrenceKey) ?? 0) + 1;
			occurrences.set(occurrenceKey, occurrence);
			const edgeKey = `${record.edgeKey}>${slot}>${occurrenceKey}`;
			const child = this.childNode(componentId, dataPath, edgeKey, record.node, occurrence);
			newEdges.set(edgeKey, child);
			return child;
		};
		for (const [key, ref] of record.refFields) switch (ref.kind) {
			case "single": {
				const value = next[key];
				if (typeof value === "string" && value) next[key] = resolveChild(escapeIdPart(key), value, record.node.dataPath);
				break;
			}
			case "list": {
				const value = next[key];
				if (!Array.isArray(value)) break;
				next[key] = getSafeChildList(value).map((item, index) => {
					if (typeof item === "string" && item) return resolveChild(`${escapeIdPart(key)}[${index}]`, item, record.node.dataPath);
					if (item && typeof item === "object" && !Array.isArray(item)) {
						const entry = item;
						if (typeof entry.id === "string" && typeof entry.basePath === "string") return resolveChild(`${escapeIdPart(key)}[${index}]`, entry.id, entry.basePath);
						if (typeof entry.componentId === "string" && entry.componentId) return resolveChild(`${escapeIdPart(key)}[${index}]`, entry.componentId, record.node.dataPath);
					}
					return item;
				});
				break;
			}
			case "nested": {
				const value = next[key];
				if (!Array.isArray(value)) break;
				next[key] = value.map((item, index) => {
					if (!item || typeof item !== "object" || Array.isArray(item)) return item;
					const entry = { ...item };
					let resolvedAny = false;
					for (const subKey of ref.keys) {
						const childId = entry[subKey];
						if (typeof childId === "string" && childId) {
							entry[subKey] = resolveChild(`${escapeIdPart(key)}[${index}].${escapeIdPart(subKey)}`, childId, record.node.dataPath);
							resolvedAny = true;
						}
					}
					return resolvedAny ? entry : item;
				});
				break;
			}
		}
		for (const [edgeKey, child] of record.childEdges) if (!newEdges.has(edgeKey)) {
			this.disposeNode(child);
			if (child.isPlaceholder) {
				if (![...newEdges.values()].some((other) => other.isPlaceholder && other.componentId === child.componentId)) {
					const waiting = this.pendingParents.get(child.componentId);
					if (waiting) {
						waiting.delete(record.node);
						if (waiting.size === 0) this.pendingParents.delete(child.componentId);
					}
				}
			}
		}
		record.childEdges = newEdges;
		const wrapped = record.behavior && record.context ? wrapDynamicValues(next, record.behavior, modelProps ?? {}, record.context.dataContext) : next;
		const previous = peekValue(record.node.props);
		for (const key of Object.keys(wrapped)) wrapped[key] = stabilize(previous[key], wrapped[key]);
		record.node.setProps(wrapped);
	}
	/** Disposes a node and, through parent-scoped ownership, its subtree. */
	disposeNode(node) {
		if (node.disposed) return;
		const record = this.records.get(node);
		if (record) {
			for (const child of record.childEdges.values()) this.disposeNode(child);
			record.childEdges.clear();
			record.binderSub?.unsubscribe();
			record.binderSub = void 0;
			if (this.nodesByEdge.get(record.edgeKey) === node) this.nodesByEdge.delete(record.edgeKey);
			this.records.delete(node);
		}
		const byId = this.nodesByComponentId.get(node.componentId);
		if (byId) {
			byId.delete(node);
			if (byId.size === 0) this.nodesByComponentId.delete(node.componentId);
		}
		for (const [componentId, waiting] of this.pendingParents) {
			waiting.delete(node);
			if (waiting.size === 0) this.pendingParents.delete(componentId);
		}
		if (node.state === "cyclic") this.clearDispatched(node.componentId, node.dataPath);
		node.dispose();
	}
};
/**
* Escapes the characters that carry meaning in composed instance ids and
* edge keys (`~`, `#`, `[`, `]`, `>`, `@`), so a component id, data path, or
* property name containing them cannot collide with the composed form of a
* different tuple. Parts without these characters are unchanged.
*/
const ID_PART_ESCAPES = {
	"~": "~0",
	"#": "~1",
	"[": "~2",
	"]": "~3",
	">": "~4",
	"@": "~5"
};
function escapeIdPart(part) {
	return part.replace(/[~#[\]>@]/g, (match) => ID_PART_ESCAPES[match]);
}
function instanceIdFor(componentId, dataPath, occurrence) {
	const trimmed = dataPath.replace(/\/+$/, "") || ROOT_DATA_PATH;
	const base = dataPath === ROOT_DATA_PATH ? escapeIdPart(componentId) : `${escapeIdPart(componentId)}-[${escapeIdPart(trimmed)}]`;
	return occurrence > 1 ? `${base}#${occurrence}` : base;
}
/**
* Converts every position the schema classifies as DYNAMIC into a
* `ResolvedBinding`: the binder's resolved value as the snapshot, plus a
* write capability iff the payload gave the value as a `{"path": ...}`
* binding, writing through the component's scoped data context. The binder's
* synthesized `set<Prop>` siblings are dropped: they silently swallow writes
* to literal-valued properties, whereas a read-only `ResolvedBinding` has no `set`,
* making such writes a type error.
*/
function wrapDynamicValues(value, behavior, raw, dataContext) {
	switch (behavior.type) {
		case "DYNAMIC": {
			const path = raw && typeof raw === "object" && !Array.isArray(raw) && typeof raw.path === "string" ? raw.path : void 0;
			if (path === void 0) return new ResolvedBinding(value);
			return new WritableBinding(value, (newValue) => dataContext.set(path, newValue), path);
		}
		case "ARRAY": {
			if (!Array.isArray(value)) return value;
			const rawItems = Array.isArray(raw) ? raw : [];
			return value.map((item, index) => wrapDynamicValues(item, behavior.element, rawItems[index], dataContext));
		}
		case "OBJECT": {
			if (!value || typeof value !== "object" || Array.isArray(value)) return value;
			const setterNames = /* @__PURE__ */ new Set();
			for (const [key, childBehavior] of Object.entries(behavior.shape)) if (childBehavior.type === "DYNAMIC") setterNames.add(`set${key.charAt(0).toUpperCase()}${key.slice(1)}`);
			const rawRecord = raw && typeof raw === "object" && !Array.isArray(raw) ? raw : {};
			const out = {};
			for (const [key, item] of Object.entries(value)) {
				if (setterNames.has(key)) continue;
				out[key] = wrapDynamicValues(item, behavior.shape[key] ?? { type: "STATIC" }, rawRecord[key], dataContext);
			}
			for (const [key, childBehavior] of Object.entries(behavior.shape)) if (childBehavior.type === "DYNAMIC" && !(key in out)) out[key] = new ResolvedBinding(void 0);
			return out;
		}
		default: return value;
	}
}
/**
* Returns `prev` whenever `next` is structurally identical to it, so
* unchanged props keep reference identity across rebuilds. Child
* `ComponentNode`s and action closures compare by identity, and
* `ResolvedBinding`s by `sameBinding`.
*/
function stabilize(prev, next) {
	if (Object.is(prev, next)) return next;
	if (prev instanceof ResolvedBinding && next instanceof ResolvedBinding) return sameBinding(prev, next) ? prev : next;
	if (isComponentNode(prev) || isComponentNode(next)) return next;
	if (Array.isArray(prev) && Array.isArray(next) && prev.length === next.length) {
		let allSame = true;
		const out = next.map((item, i) => {
			const stabilized = stabilize(prev[i], item);
			if (!Object.is(stabilized, prev[i])) allSame = false;
			return stabilized;
		});
		return allSame ? prev : out;
	}
	if (isPlainObject(prev) && isPlainObject(next)) {
		const prevKeys = Object.keys(prev);
		const nextKeys = Object.keys(next);
		if (prevKeys.length === nextKeys.length) {
			let allSame = true;
			const out = {};
			for (const key of nextKeys) {
				const stabilized = stabilize(prev[key], next[key]);
				out[key] = stabilized;
				if (!(key in prev) || !Object.is(stabilized, prev[key])) allSame = false;
			}
			return allSame ? prev : out;
		}
	}
	return next;
}
function isPlainObject(value) {
	if (!value || typeof value !== "object" || Array.isArray(value) || isComponentNode(value)) return false;
	const proto = Object.getPrototypeOf(value);
	return proto === Object.prototype || proto === null;
}
const FunctionDefinitionSchema = objectType({
	"name": stringType().describe("The unique name of the function."),
	"description": stringType().describe("A human-readable description of what the function does and how to use it.").optional(),
	"parameters": recordType(stringType(), anyType()),
	"returnType": enumType([
		"string",
		"number",
		"boolean",
		"array",
		"object",
		"any",
		"void"
	]).describe("The type of value this function returns.")
}).strict().describe("Describes a function's interface.");
const InlineCatalogSchema = objectType({
	"catalogId": stringType().describe("Unique identifier for this catalog."),
	"components": recordType(stringType(), recordType(stringType(), anyType())).describe("Definitions for UI components supported by this catalog.").optional(),
	"functions": arrayType(FunctionDefinitionSchema).describe("Definitions for functions supported by this catalog.").optional(),
	"theme": recordType(stringType(), recordType(stringType(), anyType())).describe("A schema that defines a catalog of A2UI theme properties. Each key is a theme property name (e.g. 'primaryColor'), and each value is the JSON schema for that property.").optional()
}).strict().describe("A collection of component and function definitions.");
objectType({
	"supportedCatalogIds": arrayType(stringType()).describe("An array of string identifiers for each of the component and function catalogs supported by the client."),
	"inlineCatalogs": arrayType(InlineCatalogSchema).describe("An array of inline catalog definitions, which can contain both components and functions. This should only be provided if the agent declares 'acceptsInlineCatalogs: true' in its capabilities.").optional()
}).describe("The capabilities structure for version 0.9 of the A2UI protocol.");
const A2uiClientActionSchema = objectType({
	"name": stringType().describe("The name of the action, taken from the component's action.event.name property."),
	"surfaceId": stringType().describe("The id of the surface where the event originated."),
	"sourceComponentId": stringType().describe("The id of the component that triggered the event."),
	"timestamp": stringType().datetime({ offset: true }).describe("An ISO 8601 timestamp of when the event occurred."),
	"context": recordType(stringType(), anyType()).describe("A JSON object containing the key-value pairs from the component's action.event.context, after resolving all data bindings.")
}).describe("Reports a user-initiated action from a component.");
const A2uiClientErrorSchema = unionType([objectType({
	"code": literalType("VALIDATION_FAILED"),
	"surfaceId": stringType().describe("The id of the surface where the error occurred."),
	"path": stringType().describe("The JSON pointer to the field that failed validation (e.g. '/components/0/text')."),
	"message": stringType().describe("A short one or two sentence description of why validation failed.")
}).strict(), objectType({
	"code": anyType().refine((value) => !literalType("VALIDATION_FAILED").safeParse(value).success, "Invalid input: Should NOT be valid against schema"),
	"message": stringType().describe("A short one or two sentence description of why the error occurred."),
	"surfaceId": stringType().describe("The id of the surface where the error occurred.")
}).catchall(anyType())]);
const A2uiClientMessageSchema = objectType({ version: enumType(["v0.9", "v0.9.1"]) }).and(unionType([objectType({ action: A2uiClientActionSchema }), objectType({ error: A2uiClientErrorSchema })]));
objectType({
	"version": enumType(["v0.9", "v0.9.1"]),
	"surfaces": recordType(stringType(), recordType(stringType(), anyType()).describe("The current data model for the surface, as a standard JSON object.")).describe("A map of surface IDs to their current data models.")
}).strict().describe("Schema for attaching the client data model to A2A message metadata. This object should be placed in the `a2uiClientDataModel` field of the metadata.");
objectType({ messages: arrayType(A2uiClientMessageSchema).describe("A list of client messages.") }).strict().describe("An object wrapping a list of client messages.");
objectType({
	"componentId": lazyType(() => ComponentIdSchema),
	"path": stringType().describe("The path to the list of component property objects in the data model.")
}).describe("REF:#/$defs/TemplateChildList");
objectType({
	"component": stringType().describe("The type name of the component."),
	"id": lazyType(() => ComponentIdSchema).optional(),
	"weight": numberType().optional()
}).passthrough().describe("A generic A2UI component definition.");
const ComponentIdSchema = markChildRef(stringType().describe("REF:#/$defs/ComponentId|The unique identifier for a component, used for both definitions and references within the same surface."), "component-id");
const DataBindingSchema = objectType({ "path": stringType().describe("A JSON Pointer path to a value in the data model.") }).strict().describe("REF:#/$defs/DataBinding");
const DynamicValueSchema = unionType([
	stringType(),
	numberType(),
	booleanType(),
	arrayType(anyType()),
	DataBindingSchema,
	lazyType(() => FunctionCallSchema)
]).describe("REF:#/$defs/DynamicValue|A value that can be a literal, a path, or a function call returning any type.");
const FunctionCallSchema = objectType({
	"call": stringType().describe("The name of the function to call."),
	"args": recordType(stringType(), unionType([DynamicValueSchema, recordType(stringType(), anyType()).describe("A literal object argument (e.g. configuration).")])).describe("Arguments passed to the function.").optional(),
	"returnType": enumType([
		"string",
		"number",
		"boolean",
		"array",
		"object",
		"any",
		"void"
	]).describe("The expected return type of the function call.").default("boolean")
}).describe("REF:#/$defs/FunctionCall|Invokes a named function on the client.");
const DynamicStringSchema = unionType([
	stringType(),
	DataBindingSchema,
	FunctionCallSchema
]).describe("REF:#/$defs/DynamicString|Represents a string");
const AccessibilityAttributesSchema = objectType({
	"label": DynamicStringSchema.optional(),
	"description": DynamicStringSchema.optional()
}).describe("REF:#/$defs/AccessibilityAttributes|Attributes to enhance accessibility when using assistive technologies like screen readers.");
objectType({
	"id": ComponentIdSchema,
	"accessibility": AccessibilityAttributesSchema.optional()
}).describe("REF:#/$defs/ComponentCommon");
const ChildListSchema = markChildRef(unionType([arrayType(ComponentIdSchema).describe("A static list of child component IDs."), objectType({
	"componentId": ComponentIdSchema,
	"path": stringType().describe("The path to the list of component property objects in the data model.")
}).strict().describe("A template for generating a dynamic list of children from a data model list. The `componentId` is the component to use as a template.")]).describe("REF:#/$defs/ChildList"), "child-list");
const DynamicNumberSchema = unionType([
	numberType(),
	DataBindingSchema,
	FunctionCallSchema
]).describe("REF:#/$defs/DynamicNumber|Represents a value that can be either a literal number, a path to a number in the data model, or a function call returning a number.");
const DynamicBooleanSchema = unionType([
	booleanType(),
	DataBindingSchema,
	FunctionCallSchema
]).describe("REF:#/$defs/DynamicBoolean|A boolean value that can be a literal, a path, or a function call returning a boolean.");
const DynamicStringListSchema = unionType([
	arrayType(stringType()),
	DataBindingSchema,
	FunctionCallSchema
]).describe("REF:#/$defs/DynamicStringList|Represents a value that can be either a literal array of strings, a path to a string array in the data model, or a function call returning a string array.");
const CheckRuleSchema = objectType({
	"condition": DynamicBooleanSchema,
	"message": stringType().describe("The error message to display if the check fails.")
}).strict().describe("REF:#/$defs/CheckRule|A single validation rule applied to an input component.");
objectType({ "checks": arrayType(CheckRuleSchema).describe("A list of checks to perform. These are function calls that must return a boolean indicating validity.").optional() }).describe("REF:#/$defs/Checkable|Properties for components that support client-side checks.");
const ActionSchema = unionType([objectType({ "event": objectType({
	"name": stringType().describe("The name of the action to be dispatched to the server."),
	"context": recordType(stringType(), DynamicValueSchema).describe("A JSON object containing the key-value pairs for the action context. Values can be literals or paths. Use literal values unless the value must be dynamically bound to the data model. Do NOT use paths for static IDs.").optional()
}).strict().describe("The event to dispatch to the server.") }).strict().describe("Triggers a server-side event."), objectType({ "functionCall": FunctionCallSchema }).strict().describe("Executes a local client-side function.")]).describe("REF:#/$defs/Action|Defines an interaction handler that can either trigger a server-side event or execute a local client-side function.");
const TextApi = {
	name: "Text",
	schema: objectType({
		"accessibility": AccessibilityAttributesSchema.describe("REF:#/$defs/AccessibilityAttributes").optional(),
		"weight": numberType().describe("The relative weight of this component within a Row or Column. This is similar to the CSS 'flex-grow' property. Note: this may ONLY be set when the component is a direct descendant of a Row or Column.").optional(),
		"text": DynamicStringSchema.describe("REF:#/$defs/DynamicString|The text content to display. While simple Markdown formatting is supported (i.e. without HTML, images, or links), utilizing dedicated UI components is generally preferred for a richer and more structured presentation."),
		"variant": enumType([
			"h1",
			"h2",
			"h3",
			"h4",
			"h5",
			"caption",
			"body"
		]).default("body").describe("A hint for the base text style.").optional()
	}).strict()
};
const ImageApi = {
	name: "Image",
	schema: objectType({
		"accessibility": AccessibilityAttributesSchema.describe("REF:#/$defs/AccessibilityAttributes").optional(),
		"weight": numberType().describe("The relative weight of this component within a Row or Column. This is similar to the CSS 'flex-grow' property. Note: this may ONLY be set when the component is a direct descendant of a Row or Column.").optional(),
		"url": DynamicStringSchema.describe("REF:#/$defs/DynamicString|The URL of the image to display."),
		"description": DynamicStringSchema.describe("REF:#/$defs/DynamicString|Accessibility text for the image.").optional(),
		"fit": enumType([
			"contain",
			"cover",
			"fill",
			"none",
			"scaleDown"
		]).default("fill").describe("Specifies how the image should be resized to fit its container. This corresponds to the CSS 'object-fit' property.").optional(),
		"variant": enumType([
			"icon",
			"avatar",
			"smallFeature",
			"mediumFeature",
			"largeFeature",
			"header"
		]).default("mediumFeature").describe("A hint for the image size and style.").optional()
	}).strict()
};
const IconApi = {
	name: "Icon",
	schema: objectType({
		"accessibility": AccessibilityAttributesSchema.describe("REF:#/$defs/AccessibilityAttributes").optional(),
		"weight": numberType().describe("The relative weight of this component within a Row or Column. This is similar to the CSS 'flex-grow' property. Note: this may ONLY be set when the component is a direct descendant of a Row or Column.").optional(),
		"name": unionType([
			enumType([
				"accountCircle",
				"add",
				"arrowBack",
				"arrowForward",
				"attachFile",
				"calendarToday",
				"call",
				"camera",
				"check",
				"close",
				"delete",
				"download",
				"edit",
				"event",
				"error",
				"fastForward",
				"favorite",
				"favoriteOff",
				"folder",
				"help",
				"home",
				"info",
				"locationOn",
				"lock",
				"lockOpen",
				"mail",
				"menu",
				"moreVert",
				"moreHoriz",
				"notificationsOff",
				"notifications",
				"pause",
				"payment",
				"person",
				"phone",
				"photo",
				"play",
				"print",
				"refresh",
				"rewind",
				"search",
				"send",
				"settings",
				"share",
				"shoppingCart",
				"skipNext",
				"skipPrevious",
				"star",
				"starHalf",
				"starOff",
				"stop",
				"upload",
				"visibility",
				"visibilityOff",
				"volumeDown",
				"volumeMute",
				"volumeOff",
				"volumeUp",
				"warning"
			]),
			objectType({ "svgPath": stringType() }),
			DataBindingSchema.describe("REF:#/$defs/DataBinding")
		]).describe("The name of the icon to display.")
	}).strict()
};
const VideoApi = {
	name: "Video",
	schema: objectType({
		"accessibility": AccessibilityAttributesSchema.describe("REF:#/$defs/AccessibilityAttributes").optional(),
		"weight": numberType().describe("The relative weight of this component within a Row or Column. This is similar to the CSS 'flex-grow' property. Note: this may ONLY be set when the component is a direct descendant of a Row or Column.").optional(),
		"url": DynamicStringSchema.describe("REF:#/$defs/DynamicString|The URL of the video to display.")
	}).strict()
};
const AudioPlayerApi = {
	name: "AudioPlayer",
	schema: objectType({
		"accessibility": AccessibilityAttributesSchema.describe("REF:#/$defs/AccessibilityAttributes").optional(),
		"weight": numberType().describe("The relative weight of this component within a Row or Column. This is similar to the CSS 'flex-grow' property. Note: this may ONLY be set when the component is a direct descendant of a Row or Column.").optional(),
		"url": DynamicStringSchema.describe("REF:#/$defs/DynamicString|The URL of the audio to be played."),
		"description": DynamicStringSchema.describe("REF:#/$defs/DynamicString|A description of the audio, such as a title or summary.").optional()
	}).strict()
};
const RowApi = {
	name: "Row",
	schema: objectType({
		"accessibility": AccessibilityAttributesSchema.describe("REF:#/$defs/AccessibilityAttributes").optional(),
		"weight": numberType().describe("The relative weight of this component within a Row or Column. This is similar to the CSS 'flex-grow' property. Note: this may ONLY be set when the component is a direct descendant of a Row or Column.").optional(),
		"children": ChildListSchema.describe("REF:#/$defs/ChildList|Defines the children. Use an array of strings for a fixed set of children, or a template object to generate children from a data list. Children cannot be defined inline, they must be referred to by ID."),
		"justify": enumType([
			"center",
			"end",
			"spaceAround",
			"spaceBetween",
			"spaceEvenly",
			"start",
			"stretch"
		]).default("start").describe("Defines the arrangement of children along the main axis (horizontally). Use 'spaceBetween' to push items to the edges, or 'start'/'end'/'center' to pack them together.").optional(),
		"align": enumType([
			"start",
			"center",
			"end",
			"stretch"
		]).default("stretch").describe("Defines the alignment of children along the cross axis (vertically). This is similar to the CSS 'align-items' property, but uses camelCase values (e.g., 'start').").optional()
	}).strict()
};
const ColumnApi = {
	name: "Column",
	schema: objectType({
		"accessibility": AccessibilityAttributesSchema.describe("REF:#/$defs/AccessibilityAttributes").optional(),
		"weight": numberType().describe("The relative weight of this component within a Row or Column. This is similar to the CSS 'flex-grow' property. Note: this may ONLY be set when the component is a direct descendant of a Row or Column.").optional(),
		"children": ChildListSchema.describe("REF:#/$defs/ChildList|Defines the children. Use an array of strings for a fixed set of children, or a template object to generate children from a data list. Children cannot be defined inline, they must be referred to by ID."),
		"justify": enumType([
			"start",
			"center",
			"end",
			"spaceBetween",
			"spaceAround",
			"spaceEvenly",
			"stretch"
		]).default("start").describe("Defines the arrangement of children along the main axis (vertically). Use 'spaceBetween' to push items to the edges (e.g. header at top, footer at bottom), or 'start'/'end'/'center' to pack them together.").optional(),
		"align": enumType([
			"center",
			"end",
			"start",
			"stretch"
		]).default("stretch").describe("Defines the alignment of children along the cross axis (horizontally). This is similar to the CSS 'align-items' property.").optional()
	}).strict()
};
const ListApi = {
	name: "List",
	schema: objectType({
		"accessibility": AccessibilityAttributesSchema.describe("REF:#/$defs/AccessibilityAttributes").optional(),
		"weight": numberType().describe("The relative weight of this component within a Row or Column. This is similar to the CSS 'flex-grow' property. Note: this may ONLY be set when the component is a direct descendant of a Row or Column.").optional(),
		"children": ChildListSchema.describe("REF:#/$defs/ChildList|Defines the children. Use an array of strings for a fixed set of children, or a template object to generate children from a data list."),
		"direction": enumType(["vertical", "horizontal"]).default("vertical").describe("The direction in which the list items are laid out.").optional(),
		"align": enumType([
			"start",
			"center",
			"end",
			"stretch"
		]).default("stretch").describe("Defines the alignment of children along the cross axis.").optional()
	}).strict()
};
const CardApi = {
	name: "Card",
	schema: objectType({
		"accessibility": AccessibilityAttributesSchema.describe("REF:#/$defs/AccessibilityAttributes").optional(),
		"weight": numberType().describe("The relative weight of this component within a Row or Column. This is similar to the CSS 'flex-grow' property. Note: this may ONLY be set when the component is a direct descendant of a Row or Column.").optional(),
		"child": ComponentIdSchema.describe("REF:#/$defs/ComponentId|The ID of the single child component to be rendered inside the card. To display multiple elements, you MUST wrap them in a layout component (like Column or Row) and pass that container's ID here. Do NOT pass multiple IDs or a non-existent ID.")
	}).strict()
};
const TabsApi = {
	name: "Tabs",
	schema: objectType({
		"accessibility": AccessibilityAttributesSchema.describe("REF:#/$defs/AccessibilityAttributes").optional(),
		"weight": numberType().describe("The relative weight of this component within a Row or Column. This is similar to the CSS 'flex-grow' property. Note: this may ONLY be set when the component is a direct descendant of a Row or Column.").optional(),
		"tabs": arrayType(objectType({
			"title": DynamicStringSchema.describe("REF:#/$defs/DynamicString|The tab title."),
			"child": ComponentIdSchema.describe("REF:#/$defs/ComponentId|The ID of the child component.")
		})).min(1).describe("An array of objects, where each object defines a tab with a title and a child component.")
	}).strict()
};
const ModalApi = {
	name: "Modal",
	schema: objectType({
		"accessibility": AccessibilityAttributesSchema.describe("REF:#/$defs/AccessibilityAttributes").optional(),
		"weight": numberType().describe("The relative weight of this component within a Row or Column. This is similar to the CSS 'flex-grow' property. Note: this may ONLY be set when the component is a direct descendant of a Row or Column.").optional(),
		"trigger": ComponentIdSchema.describe("REF:#/$defs/ComponentId|The ID of the component that opens the modal when interacted with (e.g., a button)."),
		"content": ComponentIdSchema.describe("REF:#/$defs/ComponentId|The ID of the component to be displayed inside the modal.")
	}).strict()
};
const DividerApi = {
	name: "Divider",
	schema: objectType({
		"accessibility": AccessibilityAttributesSchema.describe("REF:#/$defs/AccessibilityAttributes").optional(),
		"weight": numberType().describe("The relative weight of this component within a Row or Column. This is similar to the CSS 'flex-grow' property. Note: this may ONLY be set when the component is a direct descendant of a Row or Column.").optional(),
		"axis": enumType(["horizontal", "vertical"]).default("horizontal").describe("The orientation of the divider.").optional()
	}).strict()
};
const ButtonApi = {
	name: "Button",
	schema: objectType({
		"accessibility": AccessibilityAttributesSchema.describe("REF:#/$defs/AccessibilityAttributes").optional(),
		"weight": numberType().describe("The relative weight of this component within a Row or Column. This is similar to the CSS 'flex-grow' property. Note: this may ONLY be set when the component is a direct descendant of a Row or Column.").optional(),
		"checks": arrayType(CheckRuleSchema).describe("A list of checks to perform. These are function calls that must return a boolean indicating validity.").optional(),
		"child": ComponentIdSchema.describe("REF:#/$defs/ComponentId|The ID of the child component. Use a 'Text' component for a labeled button. Only use an 'Icon' if the requirements explicitly ask for an icon-only button."),
		"variant": enumType([
			"default",
			"primary",
			"borderless"
		]).default("default").describe("A hint for the button style. If omitted, a default button style is used. 'primary' indicates this is the main call-to-action button. 'borderless' means the button has no visual border or background, making its child content appear like a clickable link.").optional(),
		"action": ActionSchema.describe("REF:#/$defs/Action")
	}).strict()
};
const TextFieldApi = {
	name: "TextField",
	schema: objectType({
		"accessibility": AccessibilityAttributesSchema.describe("REF:#/$defs/AccessibilityAttributes").optional(),
		"weight": numberType().describe("The relative weight of this component within a Row or Column. This is similar to the CSS 'flex-grow' property. Note: this may ONLY be set when the component is a direct descendant of a Row or Column.").optional(),
		"checks": arrayType(CheckRuleSchema).describe("A list of checks to perform. These are function calls that must return a boolean indicating validity.").optional(),
		"label": DynamicStringSchema.describe("REF:#/$defs/DynamicString|The text label for the input field."),
		"value": DynamicStringSchema.describe("REF:#/$defs/DynamicString|The value of the text field.").optional(),
		"variant": enumType([
			"longText",
			"number",
			"shortText",
			"obscured"
		]).default("shortText").describe("The type of input field to display.").optional(),
		"validationRegexp": stringType().describe("A regular expression used for client-side validation of the input.").optional()
	}).strict()
};
const CheckBoxApi = {
	name: "CheckBox",
	schema: objectType({
		"accessibility": AccessibilityAttributesSchema.describe("REF:#/$defs/AccessibilityAttributes").optional(),
		"weight": numberType().describe("The relative weight of this component within a Row or Column. This is similar to the CSS 'flex-grow' property. Note: this may ONLY be set when the component is a direct descendant of a Row or Column.").optional(),
		"checks": arrayType(CheckRuleSchema).describe("A list of checks to perform. These are function calls that must return a boolean indicating validity.").optional(),
		"label": DynamicStringSchema.describe("REF:#/$defs/DynamicString|The text to display next to the checkbox."),
		"value": DynamicBooleanSchema.describe("REF:#/$defs/DynamicBoolean|The current state of the checkbox (true for checked, false for unchecked).")
	}).strict()
};
const ChoicePickerApi = {
	name: "ChoicePicker",
	schema: objectType({
		"accessibility": AccessibilityAttributesSchema.describe("REF:#/$defs/AccessibilityAttributes").optional(),
		"weight": numberType().describe("The relative weight of this component within a Row or Column. This is similar to the CSS 'flex-grow' property. Note: this may ONLY be set when the component is a direct descendant of a Row or Column.").optional(),
		"checks": arrayType(CheckRuleSchema).describe("A list of checks to perform. These are function calls that must return a boolean indicating validity.").optional(),
		"label": DynamicStringSchema.describe("REF:#/$defs/DynamicString|The label for the group of options.").optional(),
		"variant": enumType(["multipleSelection", "mutuallyExclusive"]).default("mutuallyExclusive").describe("A hint for how the choice picker should be displayed and behave.").optional(),
		"options": arrayType(objectType({
			"label": DynamicStringSchema.describe("REF:#/$defs/DynamicString|The text to display for this option."),
			"value": stringType().describe("The stable value associated with this option.")
		})).describe("The list of available options to choose from."),
		"value": DynamicStringListSchema.describe("REF:#/$defs/DynamicStringList|The list of currently selected values. This should be bound to a string array in the data model."),
		"displayStyle": enumType(["checkbox", "chips"]).default("checkbox").describe("The display style of the component.").optional(),
		"filterable": booleanType().default(false).describe("If true, displays a search input to filter the options.").optional()
	}).strict()
};
const SliderApi = {
	name: "Slider",
	schema: objectType({
		"accessibility": AccessibilityAttributesSchema.describe("REF:#/$defs/AccessibilityAttributes").optional(),
		"weight": numberType().describe("The relative weight of this component within a Row or Column. This is similar to the CSS 'flex-grow' property. Note: this may ONLY be set when the component is a direct descendant of a Row or Column.").optional(),
		"checks": arrayType(CheckRuleSchema).describe("A list of checks to perform. These are function calls that must return a boolean indicating validity.").optional(),
		"label": DynamicStringSchema.describe("REF:#/$defs/DynamicString|The label for the slider.").optional(),
		"min": numberType().default(0).describe("The minimum value of the slider.").optional(),
		"max": numberType().describe("The maximum value of the slider."),
		"value": DynamicNumberSchema.describe("REF:#/$defs/DynamicNumber|The current value of the slider.")
	}).strict()
};
const DateTimeInputApi = {
	name: "DateTimeInput",
	schema: objectType({
		"accessibility": AccessibilityAttributesSchema.describe("REF:#/$defs/AccessibilityAttributes").optional(),
		"weight": numberType().describe("The relative weight of this component within a Row or Column. This is similar to the CSS 'flex-grow' property. Note: this may ONLY be set when the component is a direct descendant of a Row or Column.").optional(),
		"checks": arrayType(CheckRuleSchema).describe("A list of checks to perform. These are function calls that must return a boolean indicating validity.").optional(),
		"value": DynamicStringSchema.describe("REF:#/$defs/DynamicString|The selected date and/or time value in ISO 8601 format. If not yet set, initialize with an empty string."),
		"enableDate": booleanType().default(false).describe("If true, allows the user to select a date.").optional(),
		"enableTime": booleanType().default(false).describe("If true, allows the user to select a time.").optional(),
		"min": DynamicStringSchema.describe("REF:#/$defs/DynamicString|The minimum allowed date/time in ISO 8601 format.").optional(),
		"max": DynamicStringSchema.describe("REF:#/$defs/DynamicString|The maximum allowed date/time in ISO 8601 format.").optional(),
		"label": DynamicStringSchema.describe("REF:#/$defs/DynamicString|The text label for the input field.").optional()
	}).strict()
};
/**
* @license
* Copyright 2019 Google LLC
* SPDX-License-Identifier: BSD-3-Clause
*/
const t$6 = globalThis;
const e$11 = t$6.ShadowRoot && (void 0 === t$6.ShadyCSS || t$6.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype;
const s$8 = Symbol();
const o$10 = /* @__PURE__ */ new WeakMap();
var n$10 = class {
	constructor(t, e, o) {
		if (this._$cssResult$ = !0, o !== s$8) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
		this.cssText = t, this.t = e;
	}
	get styleSheet() {
		let t = this.o;
		const s = this.t;
		if (e$11 && void 0 === t) {
			const e = void 0 !== s && 1 === s.length;
			e && (t = o$10.get(s)), void 0 === t && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), e && o$10.set(s, t));
		}
		return t;
	}
	toString() {
		return this.cssText;
	}
};
const r$8 = (t) => new n$10("string" == typeof t ? t : t + "", void 0, s$8);
const i$8 = (t, ...e) => {
	return new n$10(1 === t.length ? t[0] : e.reduce((e, s, o) => e + ((t) => {
		if (!0 === t._$cssResult$) return t.cssText;
		if ("number" == typeof t) return t;
		throw Error("Value passed to 'css' function must be a 'css' function result: " + t + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
	})(s) + t[o + 1], t[0]), t, s$8);
};
const S$1 = (s, o) => {
	if (e$11) s.adoptedStyleSheets = o.map((t) => t instanceof CSSStyleSheet ? t : t.styleSheet);
	else for (const e of o) {
		const o = document.createElement("style"), n = t$6.litNonce;
		void 0 !== n && o.setAttribute("nonce", n), o.textContent = e.cssText, s.appendChild(o);
	}
};
const c$7 = e$11 ? (t) => t : (t) => t instanceof CSSStyleSheet ? ((t) => {
	let e = "";
	for (const s of t.cssRules) e += s.cssText;
	return r$8(e);
})(t) : t;
/**
* @license
* Copyright 2017 Google LLC
* SPDX-License-Identifier: BSD-3-Clause
*/ const { is: i$7, defineProperty: e$10, getOwnPropertyDescriptor: h$3, getOwnPropertyNames: r$7, getOwnPropertySymbols: o$9, getPrototypeOf: n$9 } = Object, a$2 = globalThis, c$6 = a$2.trustedTypes, l$3 = c$6 ? c$6.emptyScript : "", p$2 = a$2.reactiveElementPolyfillSupport, d$2 = (t, s) => t, u$4 = {
	toAttribute(t, s) {
		switch (s) {
			case Boolean:
				t = t ? l$3 : null;
				break;
			case Object:
			case Array: t = null == t ? t : JSON.stringify(t);
		}
		return t;
	},
	fromAttribute(t, s) {
		let i = t;
		switch (s) {
			case Boolean:
				i = null !== t;
				break;
			case Number:
				i = null === t ? null : Number(t);
				break;
			case Object:
			case Array: try {
				i = JSON.parse(t);
			} catch (t) {
				i = null;
			}
		}
		return i;
	}
}, f$3 = (t, s) => !i$7(t, s), b$1 = {
	attribute: !0,
	type: String,
	converter: u$4,
	reflect: !1,
	useDefault: !1,
	hasChanged: f$3
};
Symbol.metadata ??= Symbol("metadata"), a$2.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
var y$1 = class extends HTMLElement {
	static addInitializer(t) {
		this._$Ei(), (this.l ??= []).push(t);
	}
	static get observedAttributes() {
		return this.finalize(), this._$Eh && [...this._$Eh.keys()];
	}
	static createProperty(t, s = b$1) {
		if (s.state && (s.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((s = Object.create(s)).wrapped = !0), this.elementProperties.set(t, s), !s.noAccessor) {
			const i = Symbol(), h = this.getPropertyDescriptor(t, i, s);
			void 0 !== h && e$10(this.prototype, t, h);
		}
	}
	static getPropertyDescriptor(t, s, i) {
		const { get: e, set: r } = h$3(this.prototype, t) ?? {
			get() {
				return this[s];
			},
			set(t) {
				this[s] = t;
			}
		};
		return {
			get: e,
			set(s) {
				const h = e?.call(this);
				r?.call(this, s), this.requestUpdate(t, h, i);
			},
			configurable: !0,
			enumerable: !0
		};
	}
	static getPropertyOptions(t) {
		return this.elementProperties.get(t) ?? b$1;
	}
	static _$Ei() {
		if (this.hasOwnProperty(d$2("elementProperties"))) return;
		const t = n$9(this);
		t.finalize(), void 0 !== t.l && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
	}
	static finalize() {
		if (this.hasOwnProperty(d$2("finalized"))) return;
		if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(d$2("properties"))) {
			const t = this.properties, s = [...r$7(t), ...o$9(t)];
			for (const i of s) this.createProperty(i, t[i]);
		}
		const t = this[Symbol.metadata];
		if (null !== t) {
			const s = litPropertyMetadata.get(t);
			if (void 0 !== s) for (const [t, i] of s) this.elementProperties.set(t, i);
		}
		this._$Eh = /* @__PURE__ */ new Map();
		for (const [t, s] of this.elementProperties) {
			const i = this._$Eu(t, s);
			void 0 !== i && this._$Eh.set(i, t);
		}
		this.elementStyles = this.finalizeStyles(this.styles);
	}
	static finalizeStyles(s) {
		const i = [];
		if (Array.isArray(s)) {
			const e = new Set(s.flat(1 / 0).reverse());
			for (const s of e) i.unshift(c$7(s));
		} else void 0 !== s && i.push(c$7(s));
		return i;
	}
	static _$Eu(t, s) {
		const i = s.attribute;
		return !1 === i ? void 0 : "string" == typeof i ? i : "string" == typeof t ? t.toLowerCase() : void 0;
	}
	constructor() {
		super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
	}
	_$Ev() {
		this._$ES = new Promise((t) => this.enableUpdating = t), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), this.constructor.l?.forEach((t) => t(this));
	}
	addController(t) {
		(this._$EO ??= /* @__PURE__ */ new Set()).add(t), void 0 !== this.renderRoot && this.isConnected && t.hostConnected?.();
	}
	removeController(t) {
		this._$EO?.delete(t);
	}
	_$E_() {
		const t = /* @__PURE__ */ new Map(), s = this.constructor.elementProperties;
		for (const i of s.keys()) this.hasOwnProperty(i) && (t.set(i, this[i]), delete this[i]);
		t.size > 0 && (this._$Ep = t);
	}
	createRenderRoot() {
		const t = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
		return S$1(t, this.constructor.elementStyles), t;
	}
	connectedCallback() {
		this.renderRoot ??= this.createRenderRoot(), this.enableUpdating(!0), this._$EO?.forEach((t) => t.hostConnected?.());
	}
	enableUpdating(t) {}
	disconnectedCallback() {
		this._$EO?.forEach((t) => t.hostDisconnected?.());
	}
	attributeChangedCallback(t, s, i) {
		this._$AK(t, i);
	}
	_$ET(t, s) {
		const i = this.constructor.elementProperties.get(t), e = this.constructor._$Eu(t, i);
		if (void 0 !== e && !0 === i.reflect) {
			const h = (void 0 !== i.converter?.toAttribute ? i.converter : u$4).toAttribute(s, i.type);
			this._$Em = t, null == h ? this.removeAttribute(e) : this.setAttribute(e, h), this._$Em = null;
		}
	}
	_$AK(t, s) {
		const i = this.constructor, e = i._$Eh.get(t);
		if (void 0 !== e && this._$Em !== e) {
			const t = i.getPropertyOptions(e), h = "function" == typeof t.converter ? { fromAttribute: t.converter } : void 0 !== t.converter?.fromAttribute ? t.converter : u$4;
			this._$Em = e;
			const r = h.fromAttribute(s, t.type);
			this[e] = r ?? this._$Ej?.get(e) ?? r, this._$Em = null;
		}
	}
	requestUpdate(t, s, i, e = !1, h) {
		if (void 0 !== t) {
			const r = this.constructor;
			if (!1 === e && (h = this[t]), i ??= r.getPropertyOptions(t), !((i.hasChanged ?? f$3)(h, s) || i.useDefault && i.reflect && h === this._$Ej?.get(t) && !this.hasAttribute(r._$Eu(t, i)))) return;
			this.C(t, s, i);
		}
		!1 === this.isUpdatePending && (this._$ES = this._$EP());
	}
	C(t, s, { useDefault: i, reflect: e, wrapped: h }, r) {
		i && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(t) && (this._$Ej.set(t, r ?? s ?? this[t]), !0 !== h || void 0 !== r) || (this._$AL.has(t) || (this.hasUpdated || i || (s = void 0), this._$AL.set(t, s)), !0 === e && this._$Em !== t && (this._$Eq ??= /* @__PURE__ */ new Set()).add(t));
	}
	async _$EP() {
		this.isUpdatePending = !0;
		try {
			await this._$ES;
		} catch (t) {
			Promise.reject(t);
		}
		const t = this.scheduleUpdate();
		return null != t && await t, !this.isUpdatePending;
	}
	scheduleUpdate() {
		return this.performUpdate();
	}
	performUpdate() {
		if (!this.isUpdatePending) return;
		if (!this.hasUpdated) {
			if (this.renderRoot ??= this.createRenderRoot(), this._$Ep) {
				for (const [t, s] of this._$Ep) this[t] = s;
				this._$Ep = void 0;
			}
			const t = this.constructor.elementProperties;
			if (t.size > 0) for (const [s, i] of t) {
				const { wrapped: t } = i, e = this[s];
				!0 !== t || this._$AL.has(s) || void 0 === e || this.C(s, void 0, i, e);
			}
		}
		let t = !1;
		const s = this._$AL;
		try {
			t = this.shouldUpdate(s), t ? (this.willUpdate(s), this._$EO?.forEach((t) => t.hostUpdate?.()), this.update(s)) : this._$EM();
		} catch (s) {
			throw t = !1, this._$EM(), s;
		}
		t && this._$AE(s);
	}
	willUpdate(t) {}
	_$AE(t) {
		this._$EO?.forEach((t) => t.hostUpdated?.()), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(t)), this.updated(t);
	}
	_$EM() {
		this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = !1;
	}
	get updateComplete() {
		return this.getUpdateComplete();
	}
	getUpdateComplete() {
		return this._$ES;
	}
	shouldUpdate(t) {
		return !0;
	}
	update(t) {
		this._$Eq &&= this._$Eq.forEach((t) => this._$ET(t, this[t])), this._$EM();
	}
	updated(t) {}
	firstUpdated(t) {}
};
y$1.elementStyles = [], y$1.shadowRootOptions = { mode: "open" }, y$1[d$2("elementProperties")] = /* @__PURE__ */ new Map(), y$1[d$2("finalized")] = /* @__PURE__ */ new Map(), p$2?.({ ReactiveElement: y$1 }), (a$2.reactiveElementVersions ??= []).push("2.1.2");
/**
* @license
* Copyright 2017 Google LLC
* SPDX-License-Identifier: BSD-3-Clause
*/
const t$5 = globalThis;
const i$6 = (t) => t;
const s$7 = t$5.trustedTypes;
const e$9 = s$7 ? s$7.createPolicy("lit-html", { createHTML: (t) => t }) : void 0;
const h$2 = "$lit$";
const o$8 = `lit$${Math.random().toFixed(9).slice(2)}$`;
const n$8 = "?" + o$8;
const r$6 = `<${n$8}>`;
const l$2 = document;
const c$5 = () => l$2.createComment("");
const a$1 = (t) => null === t || "object" != typeof t && "function" != typeof t;
const u$3 = Array.isArray;
const d$1 = (t) => u$3(t) || "function" == typeof t?.[Symbol.iterator];
const f$2 = "[ 	\n\f\r]";
const v$1 = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g;
const _ = /-->/g;
const m$1 = />/g;
const p$1 = RegExp(`>|${f$2}(?:([^\\s"'>=/]+)(${f$2}*=${f$2}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`, "g");
const g = /'/g;
const $$1 = /"/g;
const y = /^(?:script|style|textarea|title)$/i;
const x = (t) => (i, ...s) => ({
	_$litType$: t,
	strings: i,
	values: s
});
const b = x(1);
const E = Symbol.for("lit-noChange");
const A = Symbol.for("lit-nothing");
const C = /* @__PURE__ */ new WeakMap();
const P = l$2.createTreeWalker(l$2, 129);
function V(t, i) {
	if (!u$3(t) || !t.hasOwnProperty("raw")) throw Error("invalid template strings array");
	return void 0 !== e$9 ? e$9.createHTML(i) : i;
}
const N = (t, i) => {
	const s = t.length - 1, e = [];
	let n, l = 2 === i ? "<svg>" : 3 === i ? "<math>" : "", c = v$1;
	for (let i = 0; i < s; i++) {
		const s = t[i];
		let a, u, d = -1, f = 0;
		for (; f < s.length && (c.lastIndex = f, u = c.exec(s), null !== u);) f = c.lastIndex, c === v$1 ? "!--" === u[1] ? c = _ : void 0 !== u[1] ? c = m$1 : void 0 !== u[2] ? (y.test(u[2]) && (n = RegExp("</" + u[2], "g")), c = p$1) : void 0 !== u[3] && (c = p$1) : c === p$1 ? ">" === u[0] ? (c = n ?? v$1, d = -1) : void 0 === u[1] ? d = -2 : (d = c.lastIndex - u[2].length, a = u[1], c = void 0 === u[3] ? p$1 : "\"" === u[3] ? $$1 : g) : c === $$1 || c === g ? c = p$1 : c === _ || c === m$1 ? c = v$1 : (c = p$1, n = void 0);
		const x = c === p$1 && t[i + 1].startsWith("/>") ? " " : "";
		l += c === v$1 ? s + r$6 : d >= 0 ? (e.push(a), s.slice(0, d) + h$2 + s.slice(d) + o$8 + x) : s + o$8 + (-2 === d ? i : x);
	}
	return [V(t, l + (t[s] || "<?>") + (2 === i ? "</svg>" : 3 === i ? "</math>" : "")), e];
};
var S = class S {
	constructor({ strings: t, _$litType$: i }, e) {
		let r;
		this.parts = [];
		let l = 0, a = 0;
		const u = t.length - 1, d = this.parts, [f, v] = N(t, i);
		if (this.el = S.createElement(f, e), P.currentNode = this.el.content, 2 === i || 3 === i) {
			const t = this.el.content.firstChild;
			t.replaceWith(...t.childNodes);
		}
		for (; null !== (r = P.nextNode()) && d.length < u;) {
			if (1 === r.nodeType) {
				if (r.hasAttributes()) for (const t of r.getAttributeNames()) if (t.endsWith(h$2)) {
					const i = v[a++], s = r.getAttribute(t).split(o$8), e = /([.?@])?(.*)/.exec(i);
					d.push({
						type: 1,
						index: l,
						name: e[2],
						strings: s,
						ctor: "." === e[1] ? I : "?" === e[1] ? L : "@" === e[1] ? z : H
					}), r.removeAttribute(t);
				} else t.startsWith(o$8) && (d.push({
					type: 6,
					index: l
				}), r.removeAttribute(t));
				if (y.test(r.tagName)) {
					const t = r.textContent.split(o$8), i = t.length - 1;
					if (i > 0) {
						r.textContent = s$7 ? s$7.emptyScript : "";
						for (let s = 0; s < i; s++) r.append(t[s], c$5()), P.nextNode(), d.push({
							type: 2,
							index: ++l
						});
						r.append(t[i], c$5());
					}
				}
			} else if (8 === r.nodeType) if (r.data === n$8) d.push({
				type: 2,
				index: l
			});
			else {
				let t = -1;
				for (; -1 !== (t = r.data.indexOf(o$8, t + 1));) d.push({
					type: 7,
					index: l
				}), t += o$8.length - 1;
			}
			l++;
		}
	}
	static createElement(t, i) {
		const s = l$2.createElement("template");
		return s.innerHTML = t, s;
	}
};
function M$1(t, i, s = t, e) {
	if (i === E) return i;
	let h = void 0 !== e ? s._$Co?.[e] : s._$Cl;
	const o = a$1(i) ? void 0 : i._$litDirective$;
	return h?.constructor !== o && (h?._$AO?.(!1), void 0 === o ? h = void 0 : (h = new o(t), h._$AT(t, s, e)), void 0 !== e ? (s._$Co ??= [])[e] = h : s._$Cl = h), void 0 !== h && (i = M$1(t, h._$AS(t, i.values), h, e)), i;
}
var R = class {
	constructor(t, i) {
		this._$AV = [], this._$AN = void 0, this._$AD = t, this._$AM = i;
	}
	get parentNode() {
		return this._$AM.parentNode;
	}
	get _$AU() {
		return this._$AM._$AU;
	}
	u(t) {
		const { el: { content: i }, parts: s } = this._$AD, e = (t?.creationScope ?? l$2).importNode(i, !0);
		P.currentNode = e;
		let h = P.nextNode(), o = 0, n = 0, r = s[0];
		for (; void 0 !== r;) {
			if (o === r.index) {
				let i;
				2 === r.type ? i = new k(h, h.nextSibling, this, t) : 1 === r.type ? i = new r.ctor(h, r.name, r.strings, this, t) : 6 === r.type && (i = new Z(h, this, t)), this._$AV.push(i), r = s[++n];
			}
			o !== r?.index && (h = P.nextNode(), o++);
		}
		return P.currentNode = l$2, e;
	}
	p(t) {
		let i = 0;
		for (const s of this._$AV) void 0 !== s && (void 0 !== s.strings ? (s._$AI(t, s, i), i += s.strings.length - 2) : s._$AI(t[i])), i++;
	}
};
var k = class k {
	get _$AU() {
		return this._$AM?._$AU ?? this._$Cv;
	}
	constructor(t, i, s, e) {
		this.type = 2, this._$AH = A, this._$AN = void 0, this._$AA = t, this._$AB = i, this._$AM = s, this.options = e, this._$Cv = e?.isConnected ?? !0;
	}
	get parentNode() {
		let t = this._$AA.parentNode;
		const i = this._$AM;
		return void 0 !== i && 11 === t?.nodeType && (t = i.parentNode), t;
	}
	get startNode() {
		return this._$AA;
	}
	get endNode() {
		return this._$AB;
	}
	_$AI(t, i = this) {
		t = M$1(this, t, i), a$1(t) ? t === A || null == t || "" === t ? (this._$AH !== A && this._$AR(), this._$AH = A) : t !== this._$AH && t !== E && this._(t) : void 0 !== t._$litType$ ? this.$(t) : void 0 !== t.nodeType ? this.T(t) : d$1(t) ? this.k(t) : this._(t);
	}
	O(t) {
		return this._$AA.parentNode.insertBefore(t, this._$AB);
	}
	T(t) {
		this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
	}
	_(t) {
		this._$AH !== A && a$1(this._$AH) ? this._$AA.nextSibling.data = t : this.T(l$2.createTextNode(t)), this._$AH = t;
	}
	$(t) {
		const { values: i, _$litType$: s } = t, e = "number" == typeof s ? this._$AC(t) : (void 0 === s.el && (s.el = S.createElement(V(s.h, s.h[0]), this.options)), s);
		if (this._$AH?._$AD === e) this._$AH.p(i);
		else {
			const t = new R(e, this), s = t.u(this.options);
			t.p(i), this.T(s), this._$AH = t;
		}
	}
	_$AC(t) {
		let i = C.get(t.strings);
		return void 0 === i && C.set(t.strings, i = new S(t)), i;
	}
	k(t) {
		u$3(this._$AH) || (this._$AH = [], this._$AR());
		const i = this._$AH;
		let s, e = 0;
		for (const h of t) e === i.length ? i.push(s = new k(this.O(c$5()), this.O(c$5()), this, this.options)) : s = i[e], s._$AI(h), e++;
		e < i.length && (this._$AR(s && s._$AB.nextSibling, e), i.length = e);
	}
	_$AR(t = this._$AA.nextSibling, s) {
		for (this._$AP?.(!1, !0, s); t !== this._$AB;) {
			const s = i$6(t).nextSibling;
			i$6(t).remove(), t = s;
		}
	}
	setConnected(t) {
		void 0 === this._$AM && (this._$Cv = t, this._$AP?.(t));
	}
};
var H = class {
	get tagName() {
		return this.element.tagName;
	}
	get _$AU() {
		return this._$AM._$AU;
	}
	constructor(t, i, s, e, h) {
		this.type = 1, this._$AH = A, this._$AN = void 0, this.element = t, this.name = i, this._$AM = e, this.options = h, s.length > 2 || "" !== s[0] || "" !== s[1] ? (this._$AH = Array(s.length - 1).fill(/* @__PURE__ */ new String()), this.strings = s) : this._$AH = A;
	}
	_$AI(t, i = this, s, e) {
		const h = this.strings;
		let o = !1;
		if (void 0 === h) t = M$1(this, t, i, 0), o = !a$1(t) || t !== this._$AH && t !== E, o && (this._$AH = t);
		else {
			const e = t;
			let n, r;
			for (t = h[0], n = 0; n < h.length - 1; n++) r = M$1(this, e[s + n], i, n), r === E && (r = this._$AH[n]), o ||= !a$1(r) || r !== this._$AH[n], r === A ? t = A : t !== A && (t += (r ?? "") + h[n + 1]), this._$AH[n] = r;
		}
		o && !e && this.j(t);
	}
	j(t) {
		t === A ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
	}
};
var I = class extends H {
	constructor() {
		super(...arguments), this.type = 3;
	}
	j(t) {
		this.element[this.name] = t === A ? void 0 : t;
	}
};
var L = class extends H {
	constructor() {
		super(...arguments), this.type = 4;
	}
	j(t) {
		this.element.toggleAttribute(this.name, !!t && t !== A);
	}
};
var z = class extends H {
	constructor(t, i, s, e, h) {
		super(t, i, s, e, h), this.type = 5;
	}
	_$AI(t, i = this) {
		if ((t = M$1(this, t, i, 0) ?? A) === E) return;
		const s = this._$AH, e = t === A && s !== A || t.capture !== s.capture || t.once !== s.once || t.passive !== s.passive, h = t !== A && (s === A || e);
		e && this.element.removeEventListener(this.name, this, s), h && this.element.addEventListener(this.name, this, t), this._$AH = t;
	}
	handleEvent(t) {
		"function" == typeof this._$AH ? this._$AH.call(this.options?.host ?? this.element, t) : this._$AH.handleEvent(t);
	}
};
var Z = class {
	constructor(t, i, s) {
		this.element = t, this.type = 6, this._$AN = void 0, this._$AM = i, this.options = s;
	}
	get _$AU() {
		return this._$AM._$AU;
	}
	_$AI(t) {
		M$1(this, t);
	}
};
const j$1 = {
	M: h$2,
	P: o$8,
	A: n$8,
	C: 1,
	L: N,
	R,
	D: d$1,
	V: M$1,
	I: k,
	H,
	N: L,
	U: z,
	B: I,
	F: Z
};
const B = t$5.litHtmlPolyfillSupport;
B?.(S, k), (t$5.litHtmlVersions ??= []).push("3.3.3");
const D = (t, i, s) => {
	const e = s?.renderBefore ?? i;
	let h = e._$litPart$;
	if (void 0 === h) {
		const t = s?.renderBefore ?? null;
		e._$litPart$ = h = new k(i.insertBefore(c$5(), t), t, void 0, s ?? {});
	}
	return h._$AI(t), h;
};
/**
* @license
* Copyright 2017 Google LLC
* SPDX-License-Identifier: BSD-3-Clause
*/ const s$6 = globalThis;
var i$5 = class extends y$1 {
	constructor() {
		super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
	}
	createRenderRoot() {
		const t = super.createRenderRoot();
		return this.renderOptions.renderBefore ??= t.firstChild, t;
	}
	update(t) {
		const r = this.render();
		this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = D(r, this.renderRoot, this.renderOptions);
	}
	connectedCallback() {
		super.connectedCallback(), this._$Do?.setConnected(!0);
	}
	disconnectedCallback() {
		super.disconnectedCallback(), this._$Do?.setConnected(!1);
	}
	render() {
		return E;
	}
};
i$5._$litElement$ = !0, i$5["finalized"] = !0, s$6.litElementHydrateSupport?.({ LitElement: i$5 });
const o$7 = s$6.litElementPolyfillSupport;
o$7?.({ LitElement: i$5 });
(s$6.litElementVersions ??= []).push("4.2.2");
/**
* @license
* Copyright 2022 Google LLC
* SPDX-License-Identifier: BSD-3-Clause
*/
/**
* @license
* Copyright 2017 Google LLC
* SPDX-License-Identifier: BSD-3-Clause
*/
/**
* @license
* Copyright 2017 Google LLC
* SPDX-License-Identifier: BSD-3-Clause
*/ const o$5 = {
	attribute: !0,
	type: String,
	converter: u$4,
	reflect: !1,
	hasChanged: f$3
};
const r$5 = (t = o$5, e, r) => {
	const { kind: n, metadata: i } = r;
	let s = globalThis.litPropertyMetadata.get(i);
	if (void 0 === s && globalThis.litPropertyMetadata.set(i, s = /* @__PURE__ */ new Map()), "setter" === n && ((t = Object.create(t)).wrapped = !0), s.set(r.name, t), "accessor" === n) {
		const { name: o } = r;
		return {
			set(r) {
				const n = e.get.call(this);
				e.set.call(this, r), this.requestUpdate(o, n, t, !0, r);
			},
			init(e) {
				return void 0 !== e && this.C(o, void 0, t, e), e;
			}
		};
	}
	if ("setter" === n) {
		const { name: o } = r;
		return function(r) {
			const n = this[o];
			e.call(this, r), this.requestUpdate(o, n, t, !0, r);
		};
	}
	throw Error("Unsupported decorator location: " + n);
};
function n$6(t) {
	return (e, o) => "object" == typeof o ? r$5(t, e, o) : ((t, e, o) => {
		const r = e.hasOwnProperty(o);
		return e.constructor.createProperty(o, t), r ? Object.getOwnPropertyDescriptor(e, o) : void 0;
	})(t, e, o);
}
/**
* @license
* Copyright 2017 Google LLC
* SPDX-License-Identifier: BSD-3-Clause
*/ function r$4(r) {
	return n$6({
		...r,
		state: !0,
		attribute: !1
	});
}
/**
* @license
* Copyright 2017 Google LLC
* SPDX-License-Identifier: BSD-3-Clause
*/
/**
* @license
* Copyright 2017 Google LLC
* SPDX-License-Identifier: BSD-3-Clause
*/
/**
* @license
* Copyright 2017 Google LLC
* SPDX-License-Identifier: BSD-3-Clause
*/
/**
* @license
* Copyright 2017 Google LLC
* SPDX-License-Identifier: BSD-3-Clause
*/
/**
* @license
* Copyright 2017 Google LLC
* SPDX-License-Identifier: BSD-3-Clause
*/
/**
* @license
* Copyright 2021 Google LLC
* SPDX-License-Identifier: BSD-3-Clause
*/
/**
* @license
* Copyright 2017 Google LLC
* SPDX-License-Identifier: BSD-3-Clause
*/
/**
* @license
* Copyright 2020 Google LLC
* SPDX-License-Identifier: BSD-3-Clause
*/
const a = Symbol.for("");
const o$3 = (t) => {
	if (t?.r === a) return t?._$litStatic$;
};
const s$5 = (t) => ({
	_$litStatic$: t,
	r: a
});
const l$1 = /* @__PURE__ */ new Map();
const n$4 = (t) => (r, ...e) => {
	const a = e.length;
	let s, i;
	const n = [], u = [];
	let c, $ = 0, f = !1;
	for (; $ < a;) {
		for (c = r[$]; $ < a && void 0 !== (i = e[$], s = o$3(i));) c += s + r[++$], f = !0;
		$ !== a && u.push(i), n.push(c), $++;
	}
	if ($ === a && n.push(r[a]), f) {
		const t = n.join("$$lit$$");
		void 0 === (r = l$1.get(t)) && (n.raw = n, l$1.set(t, r = n)), e = u;
	}
	return t(r, ...e);
};
const u$2 = n$4(b);
/**
* Type guard to check if a component API or implementation is a WebComponentImplementation.
*
* @param api The object to check
* @returns true if the object implements WebComponentImplementation
*/
function isWebComponentImplementation(api) {
	return typeof api === "object" && api !== null && "tagName" in api && typeof api.tagName === "string" && "element" in api && typeof api.element === "function";
}
let missingCustomElementsReported = false;
/**
* Registers a Web Component's custom element in the browser's `customElements` registry.
*
* This operation is idempotent: if the custom element is already registered with the
* identical constructor, this function safely no-ops. If a different constructor is
* already registered for the same tag name, this function throws an error.
*
* In environments without `customElements` (for example SSR) it returns without registering
* and reports the problem once via `console.error`.
*
* @param component The WebComponentImplementation defining the custom element.
*/
function registerUniversalElement(component) {
	if (typeof customElements === "undefined") {
		if (!missingCustomElementsReported) {
			missingCustomElementsReported = true;
			console.error(`Cannot register "${component.tagName}": \`customElements\` is not available in this environment, so universal components will not render.`);
		}
		return;
	}
	const existing = customElements.get(component.tagName);
	if (!existing) {
		customElements.define(component.tagName, component.element);
		return;
	}
	if (existing !== component.element) throw new Error(`Custom element tag name collision for "${component.tagName}": attempted to register ${component.element.name || "anonymous constructor"}, but tag name is already registered with ${existing.name || "another constructor"}.`);
}
/**
* Pure function that acts as a generic container for A2UI components.
*
* It dynamically resolves and renders the specific Lit component implementation
* based on the component type provided in the context, returning a TemplateResult directly
* to avoid duplicate DOM node wrapping.
*
* @param context The component context defining the data model and type to render.
* @param catalog The catalog of component implementations.
* @returns A Lit TemplateResult representing the resolved component, or `nothing` if the component is invalid or unresolvable.
*/
function renderA2uiNode(context, catalog) {
	const type = context.componentModel.type;
	const implementation = catalog.components.get(type);
	if (!implementation || !implementation.tagName) {
		console.warn(`Component implementation not found or missing tagName for type: ${type}`);
		return A;
	}
	if (isWebComponentImplementation(implementation)) registerUniversalElement(implementation);
	const tag = s$5(implementation.tagName);
	return u$2`<${tag} .context=${context}></${tag}>`;
}
/**
* A Lit ReactiveController that binds an A2UI component context to its API schema.
*
* This controller manages the subscription to the GenericBinder, updating the
* component props and requesting a host update whenever the underlying layer data changes.
*
* @template Api The specific A2UI component API interface this controller is bound to.
* @internal
*/
var A2uiController = class {
	/**
	* Initializes the controller, binding it to the given Lit element and API schema.
	*
	* @param host The A2uiLitElement acting as the component host.
	* @param api The A2UI component API defining the schema for this element.
	*/
	constructor(host, api) {
		this.host = host;
		this.binder = new GenericBinder(this.host.context, api.schema);
		this.props = this.binder.snapshot;
		this.host.addController(this);
		if (this.host.isConnected) this.hostConnected();
	}
	/**
	* Subscribes to the GenericBinder updates when the host connects.
	*
	* Triggers a request update on the host element when new props are received.
	*/
	hostConnected() {
		if (!this.subscription) this.subscription = this.binder.subscribe((newProps) => {
			this.props = newProps;
			this.host.requestUpdate();
		});
		if (!this.componentsSubscription) this.componentsSubscription = this.host.context.dataContext.surface.componentsModel?.onCreated.subscribe(() => {
			this.host.requestUpdate();
		});
	}
	/**
	* Unsubscribes from the GenericBinder updates when the host disconnects.
	*/
	hostDisconnected() {
		this.subscription?.unsubscribe();
		this.subscription = void 0;
		this.componentsSubscription?.unsubscribe();
		this.componentsSubscription = void 0;
	}
	/**
	* Disposes the underlying GenericBinder to clean up resources from the context.
	*/
	dispose() {
		this.binder.dispose();
	}
};
var __decorate$4 = function(decorators, target, key, desc) {
	var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/**
* A base class for A2UI Lit elements that manages the A2uiController lifecycle
* and provides Light DOM style adoption and scoping.
*
* By default, elements render into the Light DOM (direct children) to enable
* universal CSS cascade, styling, and cross-framework composition. To opt into
* Shadow DOM encapsulation, subclasses can override `createRenderRoot()` to return
* `super.createRenderRoot()`.
*
* @template Api The specific A2UI component API defining the schema for this element.
* @experimental This class is experimental and subject to change as A2UI transitions
* to the unified Node Layer resolution pipeline.
*/
var A2uiLitElement = class extends i$5 {
	/**
	* The reactive controller instance managing property bindings and state subscriptions.
	*/
	get controller() {
		return this._controller;
	}
	/**
	* Adopts and scopes component CSS rules into the containing document or host shadow root.
	*
	* In Light DOM (the default for A2uiLitElement), the element has no shadow root of its own,
	* so this method locates the nearest enclosing Document or ShadowRoot and adopts the
	* stylesheet once per root, scoping `:host` and descendant selectors to the element's tagName.
	*/
	adoptLightDomStyles() {
		if (typeof document === "undefined") return;
		const root = this.getRootNode();
		const constructor = this.constructor;
		const styles = constructor.styles;
		if (!styles) return;
		const tagName = this.tagName.toLowerCase();
		if (!constructor._processedSheet && constructor._processedCss === void 0) {
			const baseCss = (Array.isArray(styles) ? styles : [styles]).map((s) => s && typeof s === "object" && "cssText" in s ? String(s.cssText) : String(s)).join("\n").replace(/:where\(:host\)/g, `:where(${tagName})`).replace(/:host\(([^)]+)\)/g, `${tagName}$1`).replace(/:host/g, tagName);
			let processedCss = baseCss;
			try {
				const sheet = new CSSStyleSheet();
				sheet.replaceSync(baseCss);
				const scopeRule = (rule) => {
					if (typeof CSSStyleRule !== "undefined" && rule instanceof CSSStyleRule) return `${rule.selectorText.split(",").map((sel) => {
						sel = sel.trim();
						if (sel === tagName || sel.startsWith(tagName + " ") || sel.startsWith(tagName + ".") || sel.startsWith(tagName + ":") || sel.startsWith(tagName + "[") || sel.startsWith(`:where(${tagName}`) || sel.startsWith(`:is(${tagName}`)) return sel;
						return `${tagName} ${sel}`;
					}).join(", ")} { ${rule.style.cssText} }`;
					else if (typeof CSSMediaRule !== "undefined" && rule instanceof CSSMediaRule) {
						const inner = Array.from(rule.cssRules).map(scopeRule).join("\n");
						return `@media ${rule.conditionText} {\n${inner}\n}`;
					}
					return rule.cssText;
				};
				processedCss = Array.from(sheet.cssRules).map(scopeRule).join("\n");
				const scopedSheet = new CSSStyleSheet();
				scopedSheet.replaceSync(processedCss);
				constructor._processedSheet = scopedSheet;
			} catch {}
			constructor._processedCss = processedCss;
			constructor._processedStyle = i$8([processedCss]);
			constructor._adoptedRoots = /* @__PURE__ */ new WeakSet();
		}
		const target = typeof ShadowRoot !== "undefined" && root instanceof ShadowRoot ? root : typeof document !== "undefined" ? document : void 0;
		if (target) {
			if (!constructor._adoptedRoots) constructor._adoptedRoots = /* @__PURE__ */ new WeakSet();
			if (!constructor._adoptedRoots.has(target)) {
				constructor._adoptedRoots.add(target);
				if (constructor._processedSheet && target.adoptedStyleSheets) target.adoptedStyleSheets = [...target.adoptedStyleSheets, constructor._processedSheet];
			}
		}
	}
	/**
	* Lifecycle hook invoked when the element is connected to the DOM.
	* Scopes and adopts component styles into the document or host shadow root.
	*/
	connectedCallback() {
		super.connectedCallback();
		this.adoptLightDomStyles();
	}
	/**
	* Instantiates the controller for this element's specific bound API.
	*
	* By default, this creates an `A2uiController` using the instance `api` property.
	* Subclasses can override this method if custom controller initialization is required.
	*
	* @returns A new instance of `A2uiController` matching the component API.
	*/
	createController() {
		if (!this.api) throw new Error(`[A2uiLitElement] Either define 'protected readonly api = ...' on ${this.constructor.name} or override 'createController()'.`);
		return new A2uiController(this, this.api);
	}
	/**
	* Helper method to render a child A2UI node.
	* Abstracts away the need to manually create a ComponentContext.
	*
	* @param childRef The reference to the child component to render. Either a string ID
	*                 or a reference object containing `{id, basePath}`.
	* @param customPath An explicit data model path to bind the child to. If provided,
	*                   this overrides any path defined in the `childRef` object. If omitted,
	*                   falls back to the `childRef`'s `basePath`, or the current component's path.
	*
	* @returns A Lit template result containing the rendered child component, or `nothing` if the reference is empty.
	*/
	renderNode(childRef, customPath) {
		if (!childRef) return A;
		const { surface, path: parentPath } = this.context.dataContext;
		if (!!!surface.componentsModel?.get(this.context.componentModel.id)) return A;
		let componentId;
		let path = customPath;
		if (typeof childRef === "object") {
			componentId = childRef.id || childRef.componentId;
			path = path ?? childRef.basePath ?? childRef.path;
		} else componentId = childRef;
		if (!componentId || !surface.componentsModel?.get(componentId)) return A;
		path = path ?? parentPath;
		return renderA2uiNode(new ComponentContext(surface, componentId, path), surface.defaultCatalog);
	}
	/**
	* Reacts to changes in the component's properties.
	*
	* Specifically, when the `context` property changes or is initialized, this method
	* cleans up any existing controller and invokes `createController()` to bind to
	* the new context.
	*
	* @param changedProperties Map of changed properties with their previous values.
	*/
	willUpdate(changedProperties) {
		super.willUpdate(changedProperties);
		if (changedProperties.has("context") && this.context) {
			if (this._controller) {
				this.removeController(this._controller);
				this._controller.dispose();
			}
			this._controller = this.createController();
		}
	}
	update(changedProperties) {
		if (!this._controller) return;
		super.update(changedProperties);
	}
};
__decorate$4([n$6({ type: Object })], A2uiLitElement.prototype, "context", void 0);
/**
* The actual CSS markup of the default A2UI theme.
*
* This should be only variable definitions, so they can pierce into the
* shadow DOM of components.
*
* It uses `:where()` to ensure zero specificity, allowing page styles to
* override these defaults as needed without having to deal with specificity.
*
* By default, the theme follows the user's `color-scheme` preference, but
* developers can force either the light/dark variants using the `a2ui-light`
* or `a2ui-dark` classes on the root element of their app.
*/
const DEFAULT_CSS = `
  :where(:root) {
    color-scheme: light dark;
  }

  :where(.a2ui-dark) {
    color-scheme: dark;
  }

  :where(.a2ui-light) {
    color-scheme: light;
  }

  :where(:root), :where(.a2ui-dark), :where(.a2ui-light) {
    --a2ui-color-background: light-dark(#eee, #111);
    --a2ui-color-on-background: light-dark(#333, #eee);

    --a2ui-color-surface: light-dark(
      color-mix(in oklab, var(--a2ui-color-background) 85%, white),
      color-mix(in oklab, var(--a2ui-color-background) 95%, white)
    );
    --a2ui-color-on-surface: light-dark(#333, #eee);

    --a2ui-color-primary: #17e;
    --a2ui-color-primary-light: ${computeColorVariant("light", { colorVar: "--a2ui-color-primary" })};
    --a2ui-color-primary-dark: ${computeColorVariant("dark", { colorVar: "--a2ui-color-primary" })};
    --a2ui-color-primary-hover: ${computeColorVariant("hover", {
	darkVar: "--a2ui-color-primary-dark",
	lightVar: "--a2ui-color-primary-light"
})};
    --a2ui-color-on-primary: #fff;

    --a2ui-color-secondary: light-dark(#ddd, #333);
    --a2ui-color-secondary-light: ${computeColorVariant("light", { colorVar: "--a2ui-color-secondary" })};
    --a2ui-color-secondary-dark: ${computeColorVariant("dark", {
	colorVar: "--a2ui-color-secondary",
	percentage: 95
})};
    --a2ui-color-secondary-hover: ${computeColorVariant("hover", {
	darkVar: "--a2ui-color-secondary-dark",
	lightVar: "--a2ui-color-secondary-light"
})};
    --a2ui-color-on-secondary: light-dark(#333, #eee);

    --a2ui-border-radius: 0.25rem;
    --a2ui-color-border: light-dark(#ccc, #444);
    --a2ui-border-width: 1px;
    --a2ui-border: 1px solid var(--a2ui-color-border, #ccc);

    --a2ui-font-family-title: inherit;
    --a2ui-font-family-monospace: monospace;
    --a2ui-color-input: light-dark(#fff, #2a2a2a);
    --a2ui-color-on-input: light-dark(#333, #eee);

    --a2ui-grid-base: 0.5rem;
    --a2ui-spacing-xs: calc(var(--a2ui-spacing-s) / 2);
    --a2ui-spacing-s: calc(var(--a2ui-spacing-m) / 2);
    --a2ui-spacing-m: var(--a2ui-grid-base);
    --a2ui-spacing-l: calc(var(--a2ui-spacing-m) * 2);
    --a2ui-spacing-xl: calc(var(--a2ui-spacing-l) * 2);

    --a2ui-font-size: 1rem;
    --a2ui-font-scale: 1.2;
    --a2ui-font-size-xs: calc(var(--a2ui-font-size-s) / var(--a2ui-font-scale));
    --a2ui-font-size-s: calc(var(--a2ui-font-size-m) / var(--a2ui-font-scale));
    --a2ui-font-size-m: var(--a2ui-font-size);
    --a2ui-font-size-l: calc(var(--a2ui-font-size-m) * var(--a2ui-font-scale));
    --a2ui-font-size-xl: calc(var(--a2ui-font-size-l) * var(--a2ui-font-scale));
    --a2ui-font-size-2xl: calc(var(--a2ui-font-size-xl) * var(--a2ui-font-scale));

    --a2ui-line-height-headings: 1.2;
    --a2ui-line-height-body: 1.5;
  }
`;
/**
* Caches the default stylesheet so it is only created once.
*/
let defaultStyleSheet;
/**
* Retrieves the default CSSStyleSheet for A2UI components.
*
* If the stylesheet doesn't exist, it creates and initializes one with default
* theme variables from the DEFAULT_CSS string.
*
* @returns The default CSSStyleSheet used by A2UI.
*/
function getDefaultStyleSheet() {
	if (!defaultStyleSheet) {
		defaultStyleSheet = new CSSStyleSheet();
		defaultStyleSheet.replaceSync(DEFAULT_CSS);
	}
	return defaultStyleSheet;
}
/**
* Injects CSS variables for the A2UI basic catalog into the document stylesheet collection.
*
* This method is used by the A2UI-provided basic catalogs of each renderer
* so design token values can be shared across all of them.
*
* It is only meant to be used by the basic catalog implementations provided
* by `@a2ui/lit`, `@a2ui/angular` and `@a2ui/react`, and should not be
* considered as part of the A2UI spec. This package is just a convenient
* location for it.
*
* Users may redefine the values of the CSS variables exposed in the default
* stylesheet above (and the specific ones exposed by each basic catalog
* package) to customize the appearance of the items of the basic catalog.
*/
function injectBasicCatalogStyles(targetRoot) {
	if (typeof document === "undefined") return;
	const sheet = getDefaultStyleSheet();
	const docSheets = typeof document !== "undefined" ? document.adoptedStyleSheets : null;
	if (docSheets && typeof docSheets.includes === "function" && !docSheets.includes(sheet)) try {
		document.adoptedStyleSheets = [...docSheets, sheet];
	} catch {}
	if (targetRoot && targetRoot !== document) {
		const targetSheets = targetRoot.adoptedStyleSheets;
		if (targetSheets && typeof targetSheets.includes === "function" && !targetSheets.includes(sheet)) try {
			targetRoot.adoptedStyleSheets = [...targetSheets, sheet];
		} catch {}
	}
}
/**
* Computes the CSS formula for light, dark, or hover variants of a color.
*
* @param type The variant type ('light', 'dark', 'hover').
* @param options Options containing variable names, percentages, and optional mix color.
* @returns The CSS formula string.
*/
function computeColorVariant(type, options) {
	switch (type) {
		case "light": {
			const opt = options;
			return `color-mix(in oklab, var(${opt.colorVar}) ${opt.percentage ?? 85}%, ${opt.mixColor ?? "white"})`;
		}
		case "dark": {
			const opt = options;
			return `color-mix(in oklab, var(${opt.colorVar}) ${opt.percentage ?? 85}%, ${opt.mixColor ?? "black"})`;
		}
		case "hover": {
			const opt = options;
			return `light-dark(var(${opt.darkVar}), var(${opt.lightVar}))`;
		}
	}
}
var import_lib = /* @__PURE__ */ __toESM((/* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = function(e) {
		var r = {};
		function t(n) {
			if (r[n]) return r[n].exports;
			var a = r[n] = {
				i: n,
				l: !1,
				exports: {}
			};
			return e[n].call(a.exports, a, a.exports, t), a.l = !0, a.exports;
		}
		return t.m = e, t.c = r, t.d = function(e, r, n) {
			t.o(e, r) || Object.defineProperty(e, r, {
				enumerable: !0,
				get: n
			});
		}, t.r = function(e) {
			"undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, { value: "Module" }), Object.defineProperty(e, "__esModule", { value: !0 });
		}, t.t = function(e, r) {
			if (1 & r && (e = t(e)), 8 & r) return e;
			if (4 & r && "object" == typeof e && e && e.__esModule) return e;
			var n = Object.create(null);
			if (t.r(n), Object.defineProperty(n, "default", {
				enumerable: !0,
				value: e
			}), 2 & r && "string" != typeof e) for (var a in e) t.d(n, a, function(r) {
				return e[r];
			}.bind(null, a));
			return n;
		}, t.n = function(e) {
			var r = e && e.__esModule ? function() {
				return e.default;
			} : function() {
				return e;
			};
			return t.d(r, "a", r), r;
		}, t.o = function(e, r) {
			return Object.prototype.hasOwnProperty.call(e, r);
		}, t.p = "", t(t.s = 0);
	}([function(e, r, t) {
		"use strict";
		t.r(r), t.d(r, "validateHTMLColorName", (function() {
			return l;
		})), t.d(r, "validateHTMLColorSpecialName", (function() {
			return i;
		})), t.d(r, "validateHTMLColorHex", (function() {
			return u;
		})), t.d(r, "validateHTMLColorRgb", (function() {
			return g;
		})), t.d(r, "validateHTMLColorHsl", (function() {
			return y;
		})), t.d(r, "validateHTMLColorHwb", (function() {
			return L;
		})), t.d(r, "validateHTMLColorLab", (function() {
			return S;
		})), t.d(r, "validateHTMLColorLch", (function() {
			return m;
		})), t.d(r, "validateHTMLColor", (function() {
			return G;
		}));
		const n = (e) => e && "string" == typeof e, a = [
			"AliceBlue",
			"AntiqueWhite",
			"Aqua",
			"Aquamarine",
			"Azure",
			"Beige",
			"Bisque",
			"Black",
			"BlanchedAlmond",
			"Blue",
			"BlueViolet",
			"Brown",
			"BurlyWood",
			"CadetBlue",
			"Chartreuse",
			"Chocolate",
			"Coral",
			"CornflowerBlue",
			"Cornsilk",
			"Crimson",
			"Cyan",
			"DarkBlue",
			"DarkCyan",
			"DarkGoldenrod",
			"DarkGray",
			"DarkGrey",
			"DarkGreen",
			"DarkKhaki",
			"DarkMagenta",
			"DarkOliveGreen",
			"DarkOrange",
			"DarkOrchid",
			"DarkRed",
			"DarkSalmon",
			"DarkSeaGreen",
			"DarkSlateBlue",
			"DarkSlateGray",
			"DarkSlateGrey",
			"DarkTurquoise",
			"DarkViolet",
			"DeepPink",
			"DeepSkyBlue",
			"DimGray",
			"DimGrey",
			"DodgerBlue",
			"FireBrick",
			"FloralWhite",
			"ForestGreen",
			"Fuchsia",
			"Gainsboro",
			"GhostWhite",
			"Gold",
			"Goldenrod",
			"Gray",
			"Grey",
			"Green",
			"GreenYellow",
			"HoneyDew",
			"HotPink",
			"IndianRed",
			"Indigo",
			"Ivory",
			"Khaki",
			"Lavender",
			"LavenderBlush",
			"LawnGreen",
			"LemonChiffon",
			"LightBlue",
			"LightCoral",
			"LightCyan",
			"LightGoldenrodYellow",
			"LightGray",
			"LightGrey",
			"LightGreen",
			"LightPink",
			"LightSalmon",
			"LightSalmon",
			"LightSeaGreen",
			"LightSkyBlue",
			"LightSlateGray",
			"LightSlateGrey",
			"LightSteelBlue",
			"LightYellow",
			"Lime",
			"LimeGreen",
			"Linen",
			"Magenta",
			"Maroon",
			"MediumAquamarine",
			"MediumBlue",
			"MediumOrchid",
			"MediumPurple",
			"MediumSeaGreen",
			"MediumSlateBlue",
			"MediumSlateBlue",
			"MediumSpringGreen",
			"MediumTurquoise",
			"MediumVioletRed",
			"MidnightBlue",
			"MintCream",
			"MistyRose",
			"Moccasin",
			"NavajoWhite",
			"Navy",
			"OldLace",
			"Olive",
			"OliveDrab",
			"Orange",
			"OrangeRed",
			"Orchid",
			"PaleGoldenrod",
			"PaleGreen",
			"PaleTurquoise",
			"PaleVioletRed",
			"PapayaWhip",
			"PeachPuff",
			"Peru",
			"Pink",
			"Plum",
			"PowderBlue",
			"Purple",
			"RebeccaPurple",
			"Red",
			"RosyBrown",
			"RoyalBlue",
			"SaddleBrown",
			"Salmon",
			"SandyBrown",
			"SeaGreen",
			"SeaShell",
			"Sienna",
			"Silver",
			"SkyBlue",
			"SlateBlue",
			"SlateGray",
			"SlateGrey",
			"Snow",
			"SpringGreen",
			"SteelBlue",
			"Tan",
			"Teal",
			"Thistle",
			"Tomato",
			"Turquoise",
			"Violet",
			"Wheat",
			"White",
			"WhiteSmoke",
			"Yellow",
			"YellowGreen"
		], o = [
			"currentColor",
			"inherit",
			"transparent"
		], l = (e) => {
			let r = !1;
			return n(e) && a.map((t) => (e.toLowerCase() === t.toLowerCase() && (r = !0), null)), r;
		}, i = (e) => {
			let r = !1;
			return n(e) && o.map((t) => (e.toLowerCase() === t.toLowerCase() && (r = !0), null)), r;
		}, u = (e) => {
			if (n(e)) return e && /^#([\da-f]{3}){1,2}$|^#([\da-f]{4}){1,2}$/i.test(e);
			return !1;
		}, d = "(([\\d]{0,5})((\\.([\\d]{1,5}))?))", s = `(${d}%)`, c = "(([0-9]|[1-9][0-9]|100)%)", f = `(${c}|(0?((\\.([\\d]{1,5}))?))|1)`, h = `([\\s]{0,5})\\)?)(([\\s]{0,5})(\\/?)([\\s]{1,5})${`(((${c}))|(0?((\\.([\\d]{1,5}))?))|1))?`}([\\s]{0,5})\\)`, $ = "(-?(([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-9][0-9]|3[0-5][0-9])((\\.([\\d]{1,5}))?)|360)(deg)?)", g = (e) => {
			if (n(e)) {
				const r = "([\\s]{0,5})([\\d]{1,5})%?([\\s]{0,5}),?", t = "((([\\s]{0,5}),?([\\s]{0,5}))|(([\\s]{1,5})))", n = new RegExp(`^(rgb)a?\\(${`${r}${t}`}${`${r}${t}`}${`${r}${t}`}((\\/?([\\s]{0,5})(0?\\.?([\\d]{1,5})%?([\\s]{0,5}))?|1|0))?\\)$`);
				return e && n.test(e);
			}
			return !1;
		}, y = (e) => {
			if (n(e)) {
				const r = new RegExp(`^(hsl)a?\\((([\\s]{0,5})(${$}|(([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-9][0-9]|3[0-9][0-9]|400)grad)|((([0-5])?\\.([\\d]{1,5})|6\\.([0-9]|1[0-9]|2[0-8])|[0-6])rad)|((0?((\\.([\\d]{1,5}))?)|1)turn))((([\\s]{0,5}),([\\s]{0,5}))|(([\\s]{1,5}))))(([\\s]{0,5})(0|${c})((([\\s]{0,5}),([\\s]{0,5}))|(([\\s]{1,5}))))(([\\s]{0,5})(0|${c})([\\s]{0,5})\\)?)(([\\s]{0,5})(\\/?|,?)([\\s]{0,5})(((${c}))|(0?((\\.([\\d]{1,5}))?))|1))?\\)$`);
				return e && r.test(e);
			}
			return !1;
		}, L = (e) => {
			if (n(e)) {
				const r = new RegExp(`^(hwb\\(([\\s]{0,5})${$}([\\s]{1,5}))((0|${c})([\\s]{1,5}))((0|${c})${h}$`);
				return e && r.test(e);
			}
			return !1;
		}, S = (e) => {
			if (n(e)) {
				const r = "(-?(([0-9]|[1-9][0-9]|1[0-5][0-9])((\\.([\\d]{1,5}))?)?|160))", t = new RegExp(`^(lab\\(([\\s]{0,5})${s}([\\s]{1,5})${r}([\\s]{1,5})${r}${h}$`);
				return e && t.test(e);
			}
			return !1;
		}, m = (e) => {
			if (n(e)) {
				const r = "((([0-9]|[1-9][0-9])?((\\.([\\d]{1,5}))?)|100)(%)?)", t = "" + d, n = `((${$})|(0|${f})|(([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-9][0-9]|3[0-5][0-9])((\\.([\\d]{1,5}))?)|360))`, a = `(\\/([\\s]{0,5})${f})`, o = new RegExp(`^lch\\(${`(([\\s]{0,5})${r}([\\s]{1,5})${t}([\\s]{1,5})${n}([\\s]{0,5})(${a})?)`}\\)$`);
				return e && o.test(e);
			}
			return !1;
		}, G = (e) => !!(e && u(e) || g(e) || y(e) || L(e) || S(e) || m(e));
		r.default = (e) => !!(e && u(e) || l(e) || i(e) || g(e) || y(e) || L(e) || S(e) || m(e));
	}]);
})))(), 1);
/**
* Validates whether a given string is a valid CSS color.
*
* Uses the web platform `CSS.supports('color', color)` API when available in
* browser environments, and falls back to standard CSS color syntax validation
* (via validate-color) in server-side / Node.js environments.
*/
function isValidCssColor(color) {
	if (typeof color !== "string" || !color.trim()) return false;
	const trimmed = color.trim();
	if (typeof CSS !== "undefined" && typeof CSS.supports === "function") return CSS.supports("color", trimmed);
	const fn = typeof import_lib.default === "function" ? import_lib.default : import_lib.default?.default;
	return typeof fn === "function" ? fn(trimmed) : false;
}
/**
* Zod schema defining the theme configuration for the basic catalog.
* Conforms to `specification/v0_9/catalogs/basic/catalog.json#/$defs/theme`.
*/
const BasicCatalogThemeSchema = objectType({
	primaryColor: stringType().refine((val) => isValidCssColor(val), "primaryColor must be a valid CSS color (e.g. '#00BFFF', '#17e', 'red', 'rgb(255, 0, 0)')").optional().describe("The primary brand color used for highlights (e.g., primary buttons, active borders). Renderers may generate variants of this color for different contexts. Format: Hexadecimal code, named color, or functional notation (e.g., '#00BFFF', 'red', 'rgb(255, 0, 0)')."),
	iconUrl: stringType().optional().describe("A URL for an image that identifies the agent or tool associated with the surface."),
	agentDisplayName: stringType().optional().describe("Text to be displayed next to the surface to identify the agent or tool that created it.")
}).passthrough();
/**
* Internal base class for the built-in Basic Catalog components.
*
* Extends `A2uiLitElement` to inject global basic catalog CSS, map `props.weight` to flex,
* and calculate `--a2ui-color-primary` CSS variables from the surface theme.
*
* @internal
*/
var BasicCatalogA2uiLitElement = class extends A2uiLitElement {
	/**
	* Renders into the element's direct children (Light DOM) instead of a ShadowRoot.
	*/
	createRenderRoot() {
		return this;
	}
	/**
	* Lifecycle hook invoked when the element is connected to the DOM.
	* Injects global basic catalog CSS.
	*/
	connectedCallback() {
		super.connectedCallback();
		injectBasicCatalogStyles();
	}
	/**
	* Lifecycle hook invoked before rendering.
	* Resolves the component flex weight and calculates theme color CSS variables.
	*
	* @param changedProperties Map of changed properties with their previous values.
	*/
	willUpdate(changedProperties) {
		super.willUpdate(changedProperties);
		const props = this.controller?.props;
		if (props && props.weight !== void 0) this.style.flex = String(props.weight);
		else this.style.removeProperty("flex");
		const primaryColor = this.context?.theme?.primaryColor;
		if (typeof primaryColor === "string" && isValidCssColor(primaryColor)) {
			this.style.setProperty("--a2ui-color-primary", primaryColor);
			this.style.setProperty("--a2ui-color-primary-light", computeColorVariant("light", { colorVar: "--a2ui-color-primary" }));
			this.style.setProperty("--a2ui-color-primary-dark", computeColorVariant("dark", { colorVar: "--a2ui-color-primary" }));
			this.style.setProperty("--a2ui-color-primary-hover", computeColorVariant("hover", {
				darkVar: "--a2ui-color-primary-dark",
				lightVar: "--a2ui-color-primary-light"
			}));
		} else {
			this.style.removeProperty("--a2ui-color-primary");
			this.style.removeProperty("--a2ui-color-primary-light");
			this.style.removeProperty("--a2ui-color-primary-dark");
			this.style.removeProperty("--a2ui-color-primary-hover");
		}
	}
};
var A2uiAudioPlayerElement = class extends BasicCatalogA2uiLitElement {
	constructor() {
		super(...arguments);
		this.api = AudioPlayerApi;
	}
	render() {
		const props = this.controller.props;
		if (!props) return A;
		return b`
      <div class="a2ui-audio-player">
        ${props.description ? b`<div class="a2ui-audio-description">${props.description}</div>` : A}
        <audio src=${props.url || A} controls class="a2ui-audio">
          Your browser does not support the audio tag.
        </audio>
      </div>
    `;
	}
};
A2uiAudioPlayerElement.styles = i$8`
    .a2ui-audio-player {
      display: flex;
      flex-direction: column;
      gap: var(--a2ui-spacing-xs, 0.25rem);
      background: var(--a2ui-audioplayer-background, transparent);
      border-radius: var(--a2ui-audioplayer-border-radius, 0);
      padding: var(--a2ui-audioplayer-padding, 0);
      width: 100%;
    }
    .a2ui-audio-description {
      font-size: var(--a2ui-font-size-s, 0.875rem);
      color: var(
        --a2ui-audioplayer-description-color,
        var(--a2ui-text-caption-color, light-dark(#666, #aaa))
      );
    }
    .a2ui-audio {
      width: 100%;
    }
  `;
const A2uiAudioPlayer = {
	...AudioPlayerApi,
	tagName: "a2ui-audioplayer",
	element: A2uiAudioPlayerElement
};
/**
* @license
* Copyright 2017 Google LLC
* SPDX-License-Identifier: BSD-3-Clause
*/
const t$2 = {
	ATTRIBUTE: 1,
	CHILD: 2,
	PROPERTY: 3,
	BOOLEAN_ATTRIBUTE: 4,
	EVENT: 5,
	ELEMENT: 6
};
const e$5 = (t) => (...e) => ({
	_$litDirective$: t,
	values: e
});
var i$3 = class {
	constructor(t) {}
	get _$AU() {
		return this._$AM._$AU;
	}
	_$AT(t, e, i) {
		this._$Ct = t, this._$AM = e, this._$Ci = i;
	}
	_$AS(t, e) {
		return this.update(t, e);
	}
	update(t, e) {
		return this.render(...e);
	}
};
/**
* @license
* Copyright 2018 Google LLC
* SPDX-License-Identifier: BSD-3-Clause
*/ const e$4 = e$5(class extends i$3 {
	constructor(t) {
		if (super(t), t.type !== t$2.ATTRIBUTE || "class" !== t.name || t.strings?.length > 2) throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.");
	}
	render(t) {
		return " " + Object.keys(t).filter((s) => t[s]).join(" ") + " ";
	}
	update(s, [i]) {
		if (void 0 === this.st) {
			this.st = /* @__PURE__ */ new Set(), void 0 !== s.strings && (this.nt = new Set(s.strings.join(" ").split(/\s/).filter((t) => "" !== t)));
			for (const t in i) i[t] && !this.nt?.has(t) && this.st.add(t);
			return this.render(i);
		}
		const r = s.element.classList;
		for (const t of this.st) t in i || (r.remove(t), this.st.delete(t));
		for (const t in i) {
			const s = !!i[t];
			s === this.st.has(t) || this.nt?.has(t) || (s ? (r.add(t), this.st.add(t)) : (r.remove(t), this.st.delete(t)));
		}
		return E;
	}
});
/**
* A button component that can be used to trigger an action.
*/
var A2uiBasicButtonElement = class extends BasicCatalogA2uiLitElement {
	constructor() {
		super(...arguments);
		this.api = ButtonApi;
	}
	render() {
		const props = this.controller.props;
		if (!props) return A;
		const isDisabled = props.isValid === false;
		const variant = props.variant ?? "default";
		const classes = {
			"a2ui-button": true,
			[variant]: true,
			["a2ui-button-" + variant]: true
		};
		return b`
      <button
        type="button"
        class=${e$4(classes)}
        @click=${() => {
			if (isDisabled) return;
			props.action?.();
		}}
        ?disabled=${isDisabled}
      >
        ${props.child ? b`${this.renderNode(props.child)}` : A}
      </button>
    `;
	}
};
/**
* The styles of the button can be customized by redefining the following
* CSS variables:
*
* - Primary variant:
*   - `--a2ui-color-primary`: The color for the primary variant.
*   - `--a2ui-color-on-primary`: The color of the text on the primary variant.
* - Standard/default variant:
*   - `--a2ui-color-secondary`: The color for the default variant.
*   - `--a2ui-color-on-secondary`: The color of the text on the default variant.
* - `--a2ui-button-border`: The styling for the button border. Defaults to `--a2ui-border-width` width and `--a2ui-color-border` color.
* - `--a2ui-button-border-radius`: The border radius of the button. Defaults to `--a2ui-border-radius`.
* - `--a2ui-button-padding`: The padding of the button. Defaults to `--a2ui-spacing-m`.
* - `--a2ui-button-margin`: The outer margin of the button. Defaults to `--a2ui-spacing-m`.
*/
A2uiBasicButtonElement.styles = i$8`
    .a2ui-button {
      padding: var(
        --a2ui-button-padding,
        var(--a2ui-spacing-m, 0.5rem) var(--a2ui-spacing-l, 1rem)
      );
      border-radius: var(--a2ui-button-border-radius, var(--a2ui-spacing-s, 0.25rem));
      border: var(
        --a2ui-button-border,
        var(--a2ui-border-width, 1px) solid var(--a2ui-color-border, #ccc)
      );
      cursor: pointer;
      margin: var(--a2ui-button-margin, var(--a2ui-spacing-m, 0.5rem));
      background: var(--a2ui-button-background, var(--a2ui-color-surface, #fff));
      box-shadow: var(--a2ui-button-box-shadow, none);
      font-weight: var(--a2ui-button-font-weight, normal);
      --_a2ui-text-margin: 0;
      --_a2ui-text-color: var(--a2ui-color-on-secondary, #333);
      color: var(--_a2ui-text-color);
    }
    .a2ui-button:hover {
      background-color: var(--a2ui-color-secondary-hover, #ddd);
    }
    .a2ui-button.primary {
      background: var(--a2ui-color-primary, #17e);
      --_a2ui-text-color: var(--a2ui-color-on-primary, #fff);
      color: var(--_a2ui-text-color);
      border: none;
    }
    .a2ui-button.primary:hover {
      background-color: var(--a2ui-color-primary-hover, #fbd);
    }
    .a2ui-button.borderless {
      background: none;
      border: none;
      padding: 0;
      color: var(--a2ui-color-primary, #17e);
    }
    .a2ui-button:disabled {
      cursor: not-allowed;
      opacity: 0.5;
    }
  `;
const A2uiButton = {
	...ButtonApi,
	tagName: "a2ui-basic-button",
	element: A2uiBasicButtonElement
};
var A2uiCardElement = class extends BasicCatalogA2uiLitElement {
	constructor() {
		super(...arguments);
		this.api = CardApi;
	}
	render() {
		const props = this.controller.props;
		if (!props) return A;
		return b`
      <div class="a2ui-card">${props.child ? this.renderNode(props.child) : A}</div>
    `;
	}
};
/**
* The styles of the card can be customized by redefining the following
* CSS variables:
*
* - `--a2ui-card-border`: The styling for the card border. Defaults to `--a2ui-border-width` width and `--a2ui-color-border` color.
* - `--a2ui-card-border-radius`: The border radius of the card. Defaults to `--a2ui-border-radius`.
* - `--a2ui-card-padding`: The padding of the card. Defaults to `--a2ui-spacing-m`.
* - `--a2ui-card-box-shadow`: The box shadow of the card. Defaults to `0 2px 4px rgba(0,0,0,0.1)`.
* - `--a2ui-card-margin`: The outer margin of the card. Defaults to `--a2ui-spacing-m`.
*/
A2uiCardElement.styles = i$8`
    .a2ui-card {
      padding: var(--a2ui-card-padding, var(--a2ui-spacing-m, 16px));
      border-radius: var(--a2ui-card-border-radius, var(--a2ui-border-radius, 8px));
      box-shadow: var(--a2ui-card-box-shadow, 0 2px 4px rgba(0, 0, 0, 0.1));
      background: var(--a2ui-card-background, var(--a2ui-color-surface, #fff));
      color: var(--a2ui-color-on-surface, #333);
      border: var(
        --a2ui-card-border,
        var(--a2ui-border-width, 1px) solid var(--a2ui-color-border, #ccc)
      );
      margin: var(--a2ui-card-margin, var(--a2ui-spacing-m, 16px));
    }
  `;
const A2uiCard = {
	...CardApi,
	tagName: "a2ui-card",
	element: A2uiCardElement
};
var A2uiCheckBoxElement = class extends BasicCatalogA2uiLitElement {
	constructor() {
		super(...arguments);
		this.api = CheckBoxApi;
	}
	render() {
		const props = this.controller.props;
		if (!props) return A;
		const isInvalid = props.isValid === false;
		const labelClasses = {
			"a2ui-checkbox": true,
			invalid: isInvalid
		};
		const inputClasses = { invalid: isInvalid };
		return b`
      <div class="container">
        <label class=${e$4(labelClasses)}>
          <input
            type="checkbox"
            class=${e$4(inputClasses)}
            .checked=${props.value || false}
            @change=${(e) => props.setValue?.(e.target.checked)}
          />
          <span class="a2ui-check-box-text">${props.label}</span>
        </label>
        ${isInvalid && props.validationErrors?.length ? props.validationErrors.map((msg) => b`<div class="error a2ui-error-message">${msg}</div>`) : A}
      </div>
    `;
	}
};
/**
* The styles of the checkbox can be customized by redefining the following
* CSS variables:
*
* - `--a2ui-checkbox-size`: Size of the box. Defaults to `1rem`.
* - `--a2ui-checkbox-border-radius`: Default corner rounding of the box.
* - `--a2ui-checkbox-gap`: Spacing between the checkbox and its label. Defaults to `8px`.
* - `--a2ui-checkbox-margin`: Outer margin of the component. Defaults to `--a2ui-spacing-m`.
* - `--a2ui-checkbox-color-error`: Color for invalid state. Defaults to `red`.
* - `--a2ui-checkbox-label-font-size`: Font size of the label. Defaults to `--a2ui-label-font-size` then `--a2ui-font-size-s`.
* - `--a2ui-checkbox-label-font-weight`: Font weight of the label. Defaults to `--a2ui-label-font-weight` then `bold`.
*/
A2uiCheckBoxElement.styles = i$8`
    :host,
    a2ui-checkbox {
      display: block;
    }
    .container {
      display: flex;
      flex-direction: column;
      margin: var(--a2ui-checkbox-margin, var(--a2ui-spacing-m));
    }
    label.a2ui-checkbox {
      display: inline-flex;
      align-items: center;
      gap: var(--a2ui-checkbox-gap, var(--a2ui-spacing-s, 0.5rem));
      font-size: var(
        --a2ui-checkbox-label-font-size,
        var(--a2ui-label-font-size, var(--a2ui-font-size-s))
      );
      font-weight: var(--a2ui-checkbox-label-font-weight, var(--a2ui-label-font-weight, bold));
      cursor: pointer;
    }
    label.invalid {
      color: var(--a2ui-checkbox-color-error, red);
    }
    input {
      width: var(--a2ui-checkbox-size, 1rem);
      height: var(--a2ui-checkbox-size, 1rem);
      background: var(--a2ui-checkbox-background, inherit);
      border: var(--a2ui-checkbox-border, var(--a2ui-border));
      border-radius: var(--a2ui-checkbox-border-radius, 4px);
    }
    input.invalid {
      outline: 1px solid var(--a2ui-checkbox-color-error, red);
    }
    .error,
    .a2ui-error-message {
      color: var(--a2ui-checkbox-color-error, red);
      font-size: var(--a2ui-font-size-xs, 0.75rem);
      margin-top: 4px;
    }
  `;
const A2uiCheckBox = {
	...CheckBoxApi,
	tagName: "a2ui-checkbox",
	element: A2uiCheckBoxElement
};
var __decorate$3 = function(decorators, target, key, desc) {
	var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var A2uiChoicePickerElement = class extends BasicCatalogA2uiLitElement {
	constructor() {
		super(...arguments);
		this.filter = "";
		this.api = ChoicePickerApi;
	}
	render() {
		const props = this.controller?.props;
		if (!props) return A;
		const rawVal = props.value;
		const selected = Array.isArray(rawVal) ? rawVal : typeof rawVal === "string" ? [rawVal] : [];
		const isMulti = props.variant === "multipleSelection";
		const isChips = props.displayStyle === "chips";
		const toggle = (val) => {
			const setter = props.setValue;
			if (typeof setter !== "function") return;
			if (isMulti) {
				if (selected.includes(val)) setter(selected.filter((v) => v !== val));
				else setter([...selected, val]);
			} else setter([val]);
		};
		const options = (props.options || []).filter((opt) => !props.filterable || this.filter === "" || String(opt.label).toLowerCase().includes(this.filter.toLowerCase()));
		const groupName = `a2ui-choice-${this.context?.dataContext?.surface?.id || "default"}-${this.context?.componentModel?.id || "choice-picker"}-${(this.context?.dataContext?.path || "/").replace(/[^a-zA-Z0-9-]/g, "_")}`;
		return b`
      ${props.label ? b`<label>${props.label}</label>` : A}
      ${props.filterable ? b`
            <input
              type="text"
              class="filter-input"
              placeholder="Filter options..."
              aria-label="Filter options"
              .value=${this.filter}
              @input=${(e) => this.filter = e.target.value}
            />
          ` : A}
      <div
        class=${e$4({
			"a2ui-choice-picker": true,
			options: true,
			"a2ui-options-group": !isChips,
			chips: isChips,
			"a2ui-chips-group": isChips
		})}
      >
        ${options.map((opt) => isChips ? b`
                <button
                  type="button"
                  class=${e$4({
			"a2ui-chip": true,
			chip: true,
			active: selected.includes(opt.value),
			selected: selected.includes(opt.value)
		})}
                  aria-pressed=${selected.includes(opt.value)}
                  @click=${() => toggle(opt.value)}
                >
                  ${opt.label}
                </button>
              ` : b`
                <label class="a2ui-option-label">
                  <input
                    type=${isMulti ? "checkbox" : "radio"}
                    name=${isMulti ? A : groupName}
                    value=${opt.value}
                    .checked=${selected.includes(opt.value)}
                    @change=${() => toggle(opt.value)}
                    class="a2ui-option-input"
                  />
                  <span class="a2ui-option-text">${opt.label}</span>
                </label>
              `)}
      </div>
    `;
	}
};
/**
* The styles of the choice picker can be customized by redefining the following
* CSS variables:
*
* - `--a2ui-choicepicker-label-color`: Color of all labels.
* - `--a2ui-choicepicker-label-font-size`: Font size of all labels. Defaults to `--a2ui-label-font-size` then `--a2ui-font-size-s` for the main label.
* - `--a2ui-choicepicker-label-font-weight`: Font weight of the main label. Defaults to `--a2ui-label-font-weight` then `bold`.
* - `--a2ui-choicepicker-gap`: Spacing between options.
* - `--a2ui-choicepicker-filter-padding`: Padding for the filter input. Defaults to `--a2ui-spacing-xs` and `--a2ui-spacing-s` (4px 8px).
* - `--a2ui-choicepicker-chip-padding`: Padding for chips. Defaults to `--a2ui-spacing-s` and `--a2ui-spacing-m` (4px 8px).
* - `--a2ui-choicepicker-chip-border-radius`: Border radius for chips. Defaults to `999px`.
*/
A2uiChoicePickerElement.styles = i$8`
    :host,
    .a2ui-choice-picker {
      display: flex;
      flex-direction: column;
      width: 100%;
      gap: var(--a2ui-choicepicker-gap, var(--a2ui-spacing-xs, 0.25rem));
      padding: var(--a2ui-choicepicker-padding, 0);
    }
    .options,
    .a2ui-options-group {
      display: flex;
      flex-direction: column;
      gap: var(--a2ui-choicepicker-gap, var(--a2ui-spacing-xs, 0.25rem));
    }
    label,
    .a2ui-option-label {
      display: flex;
      align-items: center;
      gap: var(--a2ui-choicepicker-gap, var(--a2ui-spacing-xs, 0.25rem));
      cursor: pointer;
      color: var(--a2ui-text-color-text, var(--a2ui-choicepicker-label-color, inherit));
      font-size: var(--a2ui-choicepicker-label-font-size, inherit);
    }
    :host,
    a2ui-choicepicker > label {
      font-size: var(
        --a2ui-choicepicker-label-font-size,
        var(--a2ui-label-font-size, var(--a2ui-font-size-s))
      );
      font-weight: var(--a2ui-choicepicker-label-font-weight, var(--a2ui-label-font-weight, bold));
    }
    .filter-input {
      background-color: var(--a2ui-color-input, #fff);
      color: var(--a2ui-color-on-input, #333);
      border: var(
        --a2ui-textfield-border,
        var(--a2ui-border, 1px solid var(--a2ui-color-border, #ccc))
      );
      border-radius: var(--a2ui-textfield-border-radius, var(--a2ui-spacing-m, 4px));
      padding: var(
        --a2ui-choicepicker-filter-padding,
        var(--a2ui-spacing-xs, 4px) var(--a2ui-spacing-s, 8px)
      );
      margin-bottom: var(--a2ui-choicepicker-filter-margin-bottom, var(--a2ui-spacing-s, 0.25rem));
      font-family: inherit;
    }
    .filter-input:focus {
      outline: none;
      border-color: var(--a2ui-textfield-color-border-focus, var(--a2ui-color-primary, #17e));
    }
    .a2ui-option-input {
      width: var(--a2ui-choicepicker-checkbox-size, 1rem);
      height: var(--a2ui-choicepicker-checkbox-size, 1rem);
    }
    .chips,
    .a2ui-chips-group {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      gap: var(--a2ui-choicepicker-gap, var(--a2ui-spacing-xs, 0.25rem));
    }
    .chip,
    .a2ui-chip {
      padding: var(
        --a2ui-choicepicker-chip-padding,
        var(--a2ui-spacing-s, 4px) var(--a2ui-spacing-m, 8px)
      );
      border-radius: var(--a2ui-choicepicker-chip-border-radius, 999px);
      border: var(--a2ui-choicepicker-chip-border, 1px solid var(--a2ui-color-border, #ccc));
      background-color: var(--a2ui-choicepicker-chip-background, var(--a2ui-color-surface, #fff));
      color: var(--a2ui-color-on-surface, inherit);
      cursor: pointer;
      font-size: var(--a2ui-choicepicker-chip-font-size, var(--a2ui-font-size-xs, 0.75rem));
      font-family: inherit;
      font-weight: var(--a2ui-choicepicker-chip-font-weight, normal);
      transition: all 0.2s;
    }
    .chip.selected,
    .chip.active,
    .a2ui-chip.selected,
    .a2ui-chip.active {
      background-color: var(
        --a2ui-choicepicker-chip-background-selected,
        var(--a2ui-color-primary, #007bff)
      );
      color: var(--a2ui-color-on-primary, #fff);
      border-color: var(
        --a2ui-choicepicker-chip-background-selected,
        var(--a2ui-color-primary, #007bff)
      );
    }
  `;
__decorate$3([r$4()], A2uiChoicePickerElement.prototype, "filter", void 0);
const A2uiChoicePicker = {
	...ChoicePickerApi,
	tagName: "a2ui-choicepicker",
	element: A2uiChoicePickerElement
}, { I: t$1 } = j$1, i$2 = (o) => o, r$1 = (o) => void 0 === o.strings, s$4 = () => document.createComment(""), v = (o, n, e) => {
	/**
	* @license
	* Copyright 2020 Google LLC
	* SPDX-License-Identifier: BSD-3-Clause
	*/
	const l = o._$AA.parentNode, d = void 0 === n ? o._$AB : n._$AA;
	if (void 0 === e) {
		const i = l.insertBefore(s$4(), d), n = l.insertBefore(s$4(), d);
		e = new t$1(i, n, o, o.options);
	} else {
		const t = e._$AB.nextSibling, n = e._$AM, c = n !== o;
		if (c) {
			let t;
			e._$AQ?.(o), e._$AM = o, void 0 !== e._$AP && (t = o._$AU) !== n._$AU && e._$AP(t);
		}
		if (t !== d || c) {
			let o = e._$AA;
			for (; o !== t;) {
				const t = i$2(o).nextSibling;
				i$2(l).insertBefore(o, d), o = t;
			}
		}
	}
	return e;
}, u$1 = (o, t, i = o) => (o._$AI(t, i), o), m = {}, p = (o, t = m) => o._$AH = t, M = (o) => o._$AH, h$1 = (o) => {
	o._$AR(), o._$AA.remove();
};
/**
* @license
* Copyright 2017 Google LLC
* SPDX-License-Identifier: BSD-3-Clause
*/
const u = (e, s, t) => {
	const r = /* @__PURE__ */ new Map();
	for (let l = s; l <= t; l++) r.set(e[l], l);
	return r;
};
const c$2 = e$5(class extends i$3 {
	constructor(e) {
		if (super(e), e.type !== t$2.CHILD) throw Error("repeat() can only be used in text expressions");
	}
	dt(e, s, t) {
		let r;
		void 0 === t ? t = s : void 0 !== s && (r = s);
		const l = [], o = [];
		let i = 0;
		for (const s of e) l[i] = r ? r(s, i) : i, o[i] = t(s, i), i++;
		return {
			values: o,
			keys: l
		};
	}
	render(e, s, t) {
		return this.dt(e, s, t).values;
	}
	update(s, [t, r, c]) {
		const d = M(s), { values: p$4, keys: a } = this.dt(t, r, c);
		if (!Array.isArray(d)) return this.ut = a, p$4;
		const h = this.ut ??= [], v$3 = [];
		let m, y, x = 0, j = d.length - 1, k = 0, w = p$4.length - 1;
		for (; x <= j && k <= w;) if (null === d[x]) x++;
		else if (null === d[j]) j--;
		else if (h[x] === a[k]) v$3[k] = u$1(d[x], p$4[k]), x++, k++;
		else if (h[j] === a[w]) v$3[w] = u$1(d[j], p$4[w]), j--, w--;
		else if (h[x] === a[w]) v$3[w] = u$1(d[x], p$4[w]), v(s, v$3[w + 1], d[x]), x++, w--;
		else if (h[j] === a[k]) v$3[k] = u$1(d[j], p$4[k]), v(s, d[x], d[j]), j--, k++;
		else if (void 0 === m && (m = u(a, k, w), y = u(h, x, j)), m.has(h[x])) if (m.has(h[j])) {
			const e = y.get(a[k]), t = void 0 !== e ? d[e] : null;
			if (null === t) {
				const e = v(s, d[x]);
				u$1(e, p$4[k]), v$3[k] = e;
			} else v$3[k] = u$1(t, p$4[k]), v(s, d[x], t), d[e] = null;
			k++;
		} else h$1(d[j]), j--;
		else h$1(d[x]), x++;
		for (; k <= w;) {
			const e = v(s, v$3[w + 1]);
			u$1(e, p$4[k]), v$3[k++] = e;
		}
		for (; x <= j;) {
			const e = d[x++];
			null !== e && h$1(e);
		}
		return this.ut = a, p(s, v$3), E;
	}
});
const JUSTIFY_MAP$1 = {
	start: "flex-start",
	center: "center",
	end: "flex-end",
	spaceBetween: "space-between",
	spaceAround: "space-around",
	spaceEvenly: "space-evenly",
	stretch: "stretch"
};
const ALIGN_MAP$1 = {
	start: "flex-start",
	center: "center",
	end: "flex-end",
	stretch: "stretch",
	baseline: "baseline"
};
function getChildKey$2(child) {
	return typeof child === "object" && child !== null ? `${child.basePath ?? ""}/${child.id}` : String(child);
}
var A2uiBasicColumnElement = class extends BasicCatalogA2uiLitElement {
	constructor() {
		super(...arguments);
		this.api = ColumnApi;
	}
	updated(changedProperties) {
		super.updated(changedProperties);
		const props = this.controller.props;
		if (props) {
			if (props.justify) this.style.justifyContent = JUSTIFY_MAP$1[props.justify] ?? "flex-start";
			else this.style.removeProperty("justify-content");
			if (props.align) this.style.alignItems = ALIGN_MAP$1[props.align] ?? "stretch";
			else this.style.removeProperty("align-items");
		}
	}
	render() {
		const props = this.controller.props;
		if (!props) return A;
		const children = Array.isArray(props.children) ? props.children : [];
		return b` ${c$2(children, getChildKey$2, (child) => b`${this.renderNode(child)}`)} `;
	}
};
/**
* The styles of the column can be customized by redefining the following
* CSS variables:
*
* - `--a2ui-column-gap`: The gap between items in the column. Defaults to `--a2ui-spacing-m`.
* - `--a2ui-column-width`: The width of the column. Defaults to `100%`.
*/
A2uiBasicColumnElement.styles = i$8`
    :host,
    a2ui-basic-column {
      display: flex;
      flex-direction: column;
      width: var(--a2ui-column-width, 100%);
      gap: var(--a2ui-column-gap, var(--a2ui-spacing-m));
    }
  `;
const A2uiColumn = {
	...ColumnApi,
	tagName: "a2ui-basic-column",
	element: A2uiBasicColumnElement
};
/**
* Returns the current date formatted as YYYY-MM-DD in the user's local timezone.
*/
function getLocalIsoDate() {
	const now = /* @__PURE__ */ new Date();
	return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}
/**
* Normalizes an incoming ISO or partial date/time value into a format accepted by HTML5 inputs.
*
* HTML5 input elements (like type="date", type="time", and type="datetime-local") strictly reject
* timezone indicators (like "Z" or "+00:00") and trailing seconds/milliseconds in their .value property.
* If these are present, the browser will reset the input to an empty string. This function strips
* those specifiers using string splitting and substring manipulation without shifting timezones.
*/
function normalizeDateTimeValue(value, type) {
	if (!value) return "";
	if (value.includes("T")) {
		const [datePart, timePart] = value.split("T");
		switch (type) {
			case "date": return datePart?.substring(0, 10) ?? "";
			case "time": return timePart?.substring(0, 5) ?? "";
			case "datetime-local": return `${datePart?.substring(0, 10) ?? ""}T${timePart?.substring(0, 5) ?? ""}`;
		}
	}
	if (type === "date") return value.includes("-") ? value.substring(0, 10) : "";
	if (type === "time") return value.includes(":") ? value.substring(0, 5) : "";
	return "";
}
var A2uiDateTimeInputElement = class extends BasicCatalogA2uiLitElement {
	constructor() {
		super(...arguments);
		this.api = DateTimeInputApi;
	}
	render() {
		const props = this.controller.props;
		if (!props) return A;
		const enableDate = props.enableDate ?? true;
		const enableTime = props.enableTime ?? false;
		const rawValue = typeof props.value === "string" ? props.value : props.value ? String(props.value) : "";
		const dateValue = normalizeDateTimeValue(rawValue, "date");
		const timeValue = normalizeDateTimeValue(rawValue, "time");
		const handleDateChange = (event) => {
			const date = event.target.value;
			if (enableTime) {
				const time = rawValue.includes("T") ? rawValue.split("T")[1] : rawValue.includes(":") ? rawValue : "00:00:00";
				props.setValue?.(`${date}T${time}`);
			} else props.setValue?.(date);
		};
		const handleTimeChange = (event) => {
			const time = event.target.value;
			if (enableDate) {
				const date = rawValue.includes("T") ? rawValue.split("T")[0] : rawValue.includes("-") ? rawValue : getLocalIsoDate();
				props.setValue?.(`${date}T${time}:00`);
			} else props.setValue?.(time);
		};
		return b`
      <div class="a2ui-date-time-container">
        ${props.label ? b`<label class="a2ui-date-time-label">${props.label}</label>` : A}
        <div class="a2ui-date-time-inputs">
          ${enableDate ? b`
                <input
                  type="date"
                  .value=${dateValue}
                  @change=${handleDateChange}
                  class="a2ui-date-time-input"
                />
              ` : A}
          ${enableTime ? b`
                <input
                  type="time"
                  .value=${timeValue}
                  @change=${handleTimeChange}
                  class="a2ui-date-time-input"
                />
              ` : A}
        </div>
      </div>
    `;
	}
};
/**
* The styles of the datetime input can be customized by redefining the following
* CSS variables:
*
* - `--a2ui-datetimeinput-width`: Width of the component. Defaults to `100%`.
* - `--a2ui-datetimeinput-background`: Controls the background of inputs.
* - `--a2ui-datetimeinput-color`: Controls the text color of inputs.
* - `--a2ui-datetimeinput-border`: Controls the border of inputs.
* - `--a2ui-datetimeinput-border-radius`: Controls the border radius of inputs.
* - `--a2ui-datetimeinput-padding`: Controls the padding of inputs.
* - `--a2ui-datetimeinput-label-font-size`: Font size of the label. Defaults to `--a2ui-label-font-size` then `--a2ui-font-size-s`.
* - `--a2ui-datetimeinput-label-font-weight`: Font weight of the label. Defaults to `--a2ui-label-font-weight` then `bold`.
*/
A2uiDateTimeInputElement.styles = i$8`
    .a2ui-date-time-container {
      display: flex;
      flex-direction: column;
      gap: var(--a2ui-spacing-xs, 4px);
      width: var(--a2ui-datetimeinput-width, 100%);
    }
    input {
      box-sizing: border-box;
      width: 100%;
    }
    .a2ui-date-time-label {
      font-size: var(
        --a2ui-datetimeinput-label-font-size,
        var(--a2ui-label-font-size, var(--a2ui-font-size-s, 14px))
      );
      font-weight: var(--a2ui-datetimeinput-label-font-weight, bold);
      color: var(--a2ui-text-color-text, var(--a2ui-color-on-background, #333));
    }
    .a2ui-date-time-inputs {
      display: flex;
      gap: var(--a2ui-spacing-s, 8px);
      width: 100%;
    }
    .a2ui-date-time-input {
      padding: var(--a2ui-datetimeinput-padding, 8px);
      border-radius: var(--a2ui-datetimeinput-border-radius, 4px);
      border: var(--a2ui-datetimeinput-border, 1px solid var(--a2ui-color-border, #ccc));
      background-color: var(--a2ui-datetimeinput-background, var(--a2ui-color-input, #fff));
      color: var(--a2ui-datetimeinput-color, var(--a2ui-color-on-input, #333));
      font-family: inherit;
      flex: 1;
    }
    .a2ui-date-time-input::-webkit-datetime-edit,
    .a2ui-date-time-input::-webkit-datetime-edit-fields-wrapper {
      color: var(--a2ui-datetimeinput-color, var(--a2ui-color-on-input, #333));
    }
  `;
const A2uiDateTimeInput = {
	...DateTimeInputApi,
	tagName: "a2ui-datetimeinput",
	element: A2uiDateTimeInputElement
};
var A2uiDividerElement = class extends BasicCatalogA2uiLitElement {
	constructor() {
		super(...arguments);
		this.api = DividerApi;
	}
	render() {
		const props = this.controller.props;
		if (!props) return A;
		const axis = props.axis ?? "horizontal";
		return b`<hr class=${e$4({
			"a2ui-divider": true,
			horizontal: axis === "horizontal",
			vertical: axis === "vertical"
		})} />`;
	}
};
/**
* The styles of the divider can be customized by redefining the following
* CSS variables:
*
* - `--a2ui-divider-border`: The styling for the divider border. Defaults to `--a2ui-border-width` solid `--a2ui-color-border`.
* - `--a2ui-divider-spacing`: The spacing around the divider. Defaults to `--a2ui-spacing-m`.
*/
A2uiDividerElement.styles = i$8`
    .a2ui-divider {
      border: 0;
      border-top: var(
        --a2ui-divider-border,
        var(--a2ui-border-width, 1px) solid var(--a2ui-color-border, #ccc)
      );
      margin: var(--a2ui-divider-spacing, var(--a2ui-spacing-m, 16px)) 0;
      width: 100%;
    }
    .a2ui-divider.vertical {
      width: var(--a2ui-border-width, 1px);
      height: 100%;
      margin: 0 var(--a2ui-divider-spacing, var(--a2ui-spacing-m, 16px));
      border-top: 0;
      border-left: var(
        --a2ui-divider-border,
        var(--a2ui-border-width, 1px) solid var(--a2ui-color-border, #ccc)
      );
    }
  `;
const A2uiDivider = {
	...DividerApi,
	tagName: "a2ui-divider",
	element: A2uiDividerElement
};
const ICON_NAME_OVERRIDES = {
	play: "play_arrow",
	rewind: "fast_rewind",
	favoriteOff: "favorite_border",
	starOff: "star_border"
};
function toMaterialIconName(name) {
	if (ICON_NAME_OVERRIDES[name]) return ICON_NAME_OVERRIDES[name];
	return name.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
}
var A2uiIconElement = class extends BasicCatalogA2uiLitElement {
	constructor() {
		super(...arguments);
		this.api = IconApi;
	}
	render() {
		const props = this.controller.props;
		if (!props) return A;
		const name = props.name;
		if (typeof name === "object" && name !== null && "svgPath" in name) {
			const svgPath = name.svgPath;
			return b`
        <svg class="a2ui-icon svg" viewBox="0 0 24 24">
          <path d=${svgPath}></path>
        </svg>
      `;
		}
		const iconName = typeof name === "string" ? toMaterialIconName(name) : "";
		return b`<i class="material-icons a2ui-icon">${iconName}</i>`;
	}
};
/**
* The icon component can be customized with the following CSS variables:
*
* - `--a2ui-icon-size`: Dimensions of the icon.
* - `--a2ui-icon-color`: Color tint applied to the icon.
* - `--a2ui-icon-font-family`: Override the font family for icons. Defaults to 'Material Icons', 'Material Symbols Outlined'.
* - `--a2ui-icon-font-variation-settings`: Complete override for font-variation-settings.
*/
A2uiIconElement.styles = i$8`
    .a2ui-icon {
      display: inline-block;
      width: var(--a2ui-icon-size, 24px);
      height: var(--a2ui-icon-size, 24px);
      font-size: var(--a2ui-icon-size, 24px);
      font-style: normal;
      font-weight: normal;
      font-family: var(--a2ui-icon-font-family, 'Material Icons', 'Material Symbols Outlined');
      color: var(
        --a2ui-icon-color,
        var(--a2ui-text-color-text, var(--a2ui-color-on-background, #333))
      );
      font-variation-settings: var(--a2ui-icon-font-variation-settings, 'FILL' 1);
      line-height: 1;
      text-transform: none;
      letter-spacing: normal;
      word-wrap: normal;
      white-space: nowrap;
      direction: ltr;
      -webkit-font-smoothing: antialiased;
      text-rendering: optimizeLegibility;
      -moz-osx-font-smoothing: grayscale;
      font-feature-settings: 'liga';
      vertical-align: middle;
    }
    .a2ui-icon.svg {
      fill: currentColor;
    }
  `;
const A2uiIcon = {
	...IconApi,
	tagName: "a2ui-icon",
	element: A2uiIconElement
};
/**
* @license
* Copyright 2018 Google LLC
* SPDX-License-Identifier: BSD-3-Clause
*/ const n$2 = "important";
const i$1 = " !" + n$2;
const o$2 = e$5(class extends i$3 {
	constructor(t) {
		if (super(t), t.type !== t$2.ATTRIBUTE || "style" !== t.name || t.strings?.length > 2) throw Error("The `styleMap` directive must be used in the `style` attribute and must be the only part in the attribute.");
	}
	render(t) {
		return Object.keys(t).reduce((e, r) => {
			const s = t[r];
			return null == s ? e : e + `${r = r.includes("-") ? r : r.replace(/(?:^(webkit|moz|ms|o)|)(?=[A-Z])/g, "-$&").toLowerCase()}:${s};`;
		}, "");
	}
	update(e, [r]) {
		const { style: s } = e.element;
		if (void 0 === this.ft) return this.ft = new Set(Object.keys(r)), this.render(r);
		for (const t of this.ft) null == r[t] && (this.ft.delete(t), t.includes("-") ? s.removeProperty(t) : s[t] = null);
		for (const t in r) {
			const e = r[t];
			if (null != e) {
				this.ft.add(t);
				const r = "string" == typeof e && e.endsWith(i$1);
				t.includes("-") || r ? s.setProperty(t, r ? e.slice(0, -11) : e, r ? n$2 : "") : s[t] = e;
			}
		}
		return E;
	}
});
var A2uiImageElement = class extends BasicCatalogA2uiLitElement {
	constructor() {
		super(...arguments);
		this.api = ImageApi;
	}
	render() {
		const props = this.controller.props;
		if (!props) return A;
		const variant = props.variant || "default";
		const fit = props.fit || "cover";
		return b`<img
      src=${props.url}
      alt=${props.description || ""}
      style=${o$2({ objectFit: fit })}
      class="a2ui-image ${variant}"
    />`;
	}
};
/**
* The styles of the image can be customized by redefining the following
* CSS variables:
*
* - `--a2ui-image-border-radius`: Controls the rounded corners of the image. Defaults to `0`.
* - `--a2ui-image-icon-size`: Controls the size of the `icon` variant. Defaults to `24px`.
* - `--a2ui-image-avatar-size`: Controls the size of the `avatar` variant. Defaults to `40px`.
* - `--a2ui-image-small-feature-size`: Controls the max-width of the `smallFeature` variant. Defaults to `100px`.
* - `--a2ui-image-large-feature-size`: Controls the max-height of the `largeFeature` variant. Defaults to `400px`.
* - `--a2ui-image-header-size`: Controls the height of the `header` variant. Defaults to `200px`.
*/
A2uiImageElement.styles = i$8`
    .a2ui-image {
      display: block;
      max-width: 100%;
      height: auto;
      border-radius: var(--a2ui-image-border-radius, 0);
    }
    .a2ui-image.icon {
      width: var(--a2ui-image-icon-size, 24px);
      height: var(--a2ui-image-icon-size, 24px);
    }
    .a2ui-image.avatar {
      width: var(--a2ui-image-avatar-size, 40px);
      height: var(--a2ui-image-avatar-size, 40px);
      border-radius: 50%;
    }
    .a2ui-image.smallFeature {
      max-width: var(--a2ui-image-small-feature-size, 100px);
    }
    .a2ui-image.largeFeature {
      max-height: var(--a2ui-image-large-feature-size, 400px);
    }
    .a2ui-image.header {
      height: var(--a2ui-image-header-size, 200px);
    }
  `;
const A2uiImage = {
	...ImageApi,
	tagName: "a2ui-image",
	element: A2uiImageElement
};
function getChildKey$1(child) {
	return typeof child === "object" && child !== null ? `${child.basePath ?? ""}/${child.id}` : String(child);
}
var A2uiListElement = class extends BasicCatalogA2uiLitElement {
	constructor() {
		super(...arguments);
		this.api = ListApi;
	}
	render() {
		const props = this.controller.props;
		if (!props) return A;
		const children = Array.isArray(props.children) ? props.children : [];
		const listStyle = props.listStyle;
		const direction = props.direction || "vertical";
		if (listStyle === "ordered") return b`
        <ol class="a2ui-list ${direction}">
          ${c$2(children, getChildKey$1, (child) => b`<li>${this.renderNode(child)}</li>`)}
        </ol>
      `;
		if (listStyle === "unordered") return b`
        <ul class="a2ui-list ${direction}">
          ${c$2(children, getChildKey$1, (child) => b`<li>${this.renderNode(child)}</li>`)}
        </ul>
      `;
		return b`
      <div class="a2ui-list ${direction}">
        ${c$2(children, getChildKey$1, (child) => b`<div class="a2ui-list-item-none">${this.renderNode(child)}</div>`)}
      </div>
    `;
	}
};
A2uiListElement.styles = i$8`
    .a2ui-list {
      display: flex;
      padding-inline-start: var(--a2ui-list-padding, var(--a2ui-spacing-l, 24px));
      margin: 0;
    }
    .a2ui-list.vertical {
      flex-direction: column;
      gap: var(--a2ui-list-gap, var(--a2ui-spacing-s, 8px));
    }
    .a2ui-list.horizontal {
      flex-direction: row;
      gap: var(--a2ui-list-gap, var(--a2ui-spacing-m, 16px));
      list-style-position: inside;
    }
    .a2ui-list-item-none {
      display: block;
    }
    .horizontal .a2ui-list-item-none {
      display: inline-block;
    }
  `;
const A2uiList = {
	...ListApi,
	tagName: "a2ui-list",
	element: A2uiListElement
};
var __decorate$2 = function(decorators, target, key, desc) {
	var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var A2uiLitModal = class extends BasicCatalogA2uiLitElement {
	constructor() {
		super(...arguments);
		this.isOpen = false;
		this.api = ModalApi;
	}
	openModal() {
		this.isOpen = true;
	}
	closeModal() {
		this.isOpen = false;
	}
	render() {
		const props = this.controller.props;
		if (!props) return A;
		return b`
      <div class="a2ui-modal-wrapper">
        <div @click=${() => this.openModal()} class="a2ui-modal-trigger">
          ${props.trigger ? b`${this.renderNode(props.trigger)}` : A}
        </div>
        ${this.isOpen ? b`
              <div class="a2ui-modal-overlay" @click=${() => this.closeModal()}>
                <div
                  class="a2ui-modal-content"
                  role="dialog"
                  aria-modal="true"
                  @click=${(e) => e.stopPropagation()}
                >
                  <button
                    type="button"
                    class="a2ui-modal-close"
                    aria-label="Close"
                    @click=${() => this.closeModal()}
                  >
                    &times;
                  </button>
                  ${props.content ? b`${this.renderNode(props.content)}` : A}
                </div>
              </div>
            ` : A}
      </div>
    `;
	}
};
/**
* The styles of the modal can be customized by redefining the following
* CSS variables:
*
* - `--a2ui-modal-background`: Controls the background of the modal content.
* - `--a2ui-modal-padding`: Controls the padding of the modal content.
* - `--a2ui-modal-border-radius`: Controls the border radius of the modal content.
* - `--a2ui-modal-box-shadow`: Controls the box shadow of the modal content.
* - `--a2ui-modal-backdrop-bg`: Controls the background of the backdrop.
*/
A2uiLitModal.styles = i$8`
    :host,
    a2ui-modal {
      display: inline-block;
    }
    .a2ui-modal-wrapper {
      display: inline-block;
    }
    .a2ui-modal-trigger {
      cursor: pointer;
    }
    .a2ui-modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: var(--a2ui-modal-backdrop-bg, rgba(0, 0, 0, 0.5));
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    }
    .a2ui-modal-content {
      background: var(--a2ui-modal-background, var(--a2ui-color-surface, #fff));
      padding: var(--a2ui-modal-padding, var(--a2ui-spacing-xl, 32px));
      border-radius: var(--a2ui-modal-border-radius, var(--a2ui-border-radius, 8px));
      position: relative;
      min-width: 300px;
      max-width: 80%;
      max-height: 80%;
      overflow-y: auto;
      box-shadow: var(--a2ui-modal-box-shadow, 0 10px 25px rgba(0, 0, 0, 0.2));
    }
    .a2ui-modal-close {
      position: absolute;
      top: 10px;
      right: 15px;
      border: none;
      background: none;
      font-size: 24px;
      cursor: pointer;
      color: var(--a2ui-text-caption-color, #999);
    }
    .a2ui-modal-close:hover {
      color: var(--a2ui-text-color, #333);
    }
  `;
__decorate$2([r$4()], A2uiLitModal.prototype, "isOpen", void 0);
const A2uiModal = {
	...ModalApi,
	tagName: "a2ui-modal",
	element: A2uiLitModal
};
const JUSTIFY_MAP = {
	start: "flex-start",
	center: "center",
	end: "flex-end",
	spaceBetween: "space-between",
	spaceAround: "space-around",
	spaceEvenly: "space-evenly",
	stretch: "stretch"
};
const ALIGN_MAP = {
	start: "flex-start",
	center: "center",
	end: "flex-end",
	stretch: "stretch",
	baseline: "baseline"
};
function getChildKey(child) {
	return typeof child === "object" && child !== null ? `${child.basePath ?? ""}/${child.id}` : String(child);
}
var A2uiBasicRowElement = class extends BasicCatalogA2uiLitElement {
	constructor() {
		super(...arguments);
		this.api = RowApi;
	}
	updated(changedProperties) {
		super.updated(changedProperties);
		const props = this.controller.props;
		if (props) {
			if (props.justify) this.style.justifyContent = JUSTIFY_MAP[props.justify] ?? "flex-start";
			else this.style.removeProperty("justify-content");
			if (props.align) this.style.alignItems = ALIGN_MAP[props.align] ?? "stretch";
			else this.style.removeProperty("align-items");
		}
	}
	render() {
		const props = this.controller.props;
		if (!props) return A;
		const children = Array.isArray(props.children) ? props.children : [];
		return b` ${c$2(children, getChildKey, (child) => b`${this.renderNode(child)}`)} `;
	}
};
/**
* The styles of the row can be customized by redefining the following
* CSS variables:
*
* - `--a2ui-row-gap`: The gap between items in the row. Defaults to `--a2ui-spacing-m`.
*/
A2uiBasicRowElement.styles = i$8`
    :host,
    a2ui-basic-row {
      display: flex;
      flex-direction: row;
      gap: var(--a2ui-row-gap, var(--a2ui-spacing-m));
    }
  `;
const A2uiRow = {
	...RowApi,
	tagName: "a2ui-basic-row",
	element: A2uiBasicRowElement
};
var A2uiSliderElement = class extends BasicCatalogA2uiLitElement {
	constructor() {
		super(...arguments);
		this.api = SliderApi;
	}
	render() {
		const props = this.controller.props;
		if (!props) return A;
		return b`
      <div class="a2ui-slider-container">
        <div class="a2ui-slider-header">
          <span class="a2ui-slider-label">${props.label}</span>
          <span class="a2ui-slider-value">${props.value}</span>
        </div>
        <input
          type="range"
          min=${props.min ?? 0}
          max=${props.max ?? 100}
          .value=${props.value?.toString() || "0"}
          @input=${(e) => props.setValue?.(Number(e.target.value))}
          class="a2ui-slider"
        />
      </div>
    `;
	}
};
/**
* The slider can be customized with the following CSS variables:
*
* - `--a2ui-slider-track-color`: Color of the slider track. Defaults to `--a2ui-color-secondary`.
* - `--a2ui-slider-thumb-color`: Color of the slider thumb. Defaults to `--a2ui-color-primary`.
* - `--a2ui-slider-margin`: Outer margin of the component. Defaults to `--a2ui-spacing-m`.
* - `--a2ui-slider-label-font-size`: Font size of the label. Defaults to `--a2ui-label-font-size` then `--a2ui-font-size-s`.
* - `--a2ui-slider-label-font-weight`: Font weight of the label. Defaults to `--a2ui-label-font-weight` then `bold`.
*/
A2uiSliderElement.styles = i$8`
    .a2ui-slider-container {
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: var(--a2ui-spacing-xs, 4px);
      margin: var(--a2ui-slider-margin, var(--a2ui-spacing-m, 16px));
    }
    .a2ui-slider-header {
      display: flex;
      justify-content: space-between;
      font-size: var(
        --a2ui-slider-label-font-size,
        var(--a2ui-label-font-size, var(--a2ui-font-size-s, 14px))
      );
      font-weight: var(--a2ui-slider-label-font-weight, bold);
      color: var(--a2ui-text-color-text, var(--a2ui-color-on-background, #333));
    }
    .a2ui-slider {
      width: 100%;
      cursor: pointer;
      accent-color: var(--a2ui-slider-thumb-color, var(--a2ui-color-primary, #007bff));
      background: var(--a2ui-slider-track-color, var(--a2ui-color-secondary, #e9ecef));
    }
  `;
const A2uiSlider = {
	...SliderApi,
	tagName: "a2ui-slider",
	element: A2uiSliderElement
};
var __decorate$1 = function(decorators, target, key, desc) {
	var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var A2uiLitTabs = class extends BasicCatalogA2uiLitElement {
	constructor() {
		super(...arguments);
		this.api = TabsApi;
		this.activeIndex = 0;
	}
	willUpdate(changedProperties) {
		super.willUpdate(changedProperties);
		const props = this.controller?.props;
		if (props?.tabs && this.activeIndex >= props.tabs.length) this.activeIndex = 0;
	}
	render() {
		const props = this.controller?.props;
		if (!props || !props.tabs) return A;
		return b`
      <div class="a2ui-tabs">
        <div class="a2ui-tab-bar">
          ${props.tabs.map((tab, i) => b`
              <button
                class=${e$4({
			"a2ui-tab-button": true,
			active: i === this.activeIndex
		})}
                @click=${() => this.activeIndex = i}
              >
                ${tab.title}
              </button>
            `)}
        </div>
        <div class="a2ui-tab-content">
          ${props.tabs[this.activeIndex] ? b`${this.renderNode(props.tabs[this.activeIndex].child)}` : A}
        </div>
      </div>
    `;
	}
};
/**
* The styles of the tabs can be customized by redefining the following
* CSS variables:
*
* - `--a2ui-tabs-border`: Controls the border of the tab bar. Defaults to `2px solid var(--a2ui-color-border, #eee)`.
* - `--a2ui-tabs-header-background`: Controls the background of tab buttons. Defaults to `transparent`.
* - `--a2ui-tabs-header-color`: Controls the text color of tab buttons. Defaults to `var(--a2ui-text-caption-color, #666)`.
* - `--a2ui-tabs-header-background-active`: Controls the background of the active tab button. Defaults to `transparent`.
* - `--a2ui-tabs-header-color-active`: Controls the text color of the active tab button. Defaults to `var(--a2ui-color-primary, #007bff)`.
* - `--a2ui-tabs-content-padding`: Controls the padding of the tab content. Defaults to `var(--a2ui-spacing-m, 16px) 0`.
*/
A2uiLitTabs.styles = i$8`
    .a2ui-tabs {
      display: flex;
      flex-direction: column;
      width: 100%;
    }
    .a2ui-tab-bar {
      display: flex;
      border-bottom: var(--a2ui-tabs-border, 2px solid var(--a2ui-color-border, #eee));
      gap: var(--a2ui-spacing-m, 16px);
    }
    .a2ui-tab-button {
      padding: var(--a2ui-spacing-s, 8px) var(--a2ui-spacing-m, 16px);
      border: none;
      background: var(--a2ui-tabs-header-background, transparent);
      cursor: pointer;
      font-weight: 500;
      color: var(--a2ui-tabs-header-color, var(--a2ui-text-caption-color, #666));
      border-bottom: 2px solid transparent;
      margin-bottom: -2px;
    }
    .a2ui-tab-button.active {
      background: var(--a2ui-tabs-header-background-active, transparent);
      color: var(--a2ui-tabs-header-color-active, var(--a2ui-color-primary, #007bff));
      border-bottom: 2px solid var(--a2ui-color-primary, #007bff);
    }
    .a2ui-tab-content {
      padding: var(--a2ui-tabs-content-padding, var(--a2ui-spacing-m, 16px) 0);
    }
  `;
__decorate$1([r$4()], A2uiLitTabs.prototype, "activeIndex", void 0);
const A2uiTabs = {
	...TabsApi,
	tagName: "a2ui-tabs",
	element: A2uiLitTabs
};
/**
* @license
* Copyright 2021 Google LLC
* SPDX-License-Identifier: BSD-3-Clause
*/
var s$3 = class extends Event {
	constructor(s, t, e, o) {
		super("context-request", {
			bubbles: !0,
			composed: !0
		}), this.context = s, this.contextTarget = t, this.callback = e, this.subscribe = o ?? !1;
	}
};
/**
* @license
* Copyright 2021 Google LLC
* SPDX-License-Identifier: BSD-3-Clause
*/
function n$1(n) {
	return n;
}
/**
* @license
* Copyright 2021 Google LLC
* SPDX-License-Identifier: BSD-3-Clause
*/ var s$2 = class {
	constructor(t, s, i, h) {
		if (this.subscribe = !1, this.provided = !1, this.value = void 0, this.t = (t, s) => {
			this.unsubscribe && (this.unsubscribe !== s && (this.provided = !1, this.unsubscribe()), this.subscribe || this.unsubscribe()), this.value = t, this.host.requestUpdate(), this.provided && !this.subscribe || (this.provided = !0, this.callback && this.callback(t, s)), this.unsubscribe = s;
		}, this.host = t, void 0 !== s.context) {
			const t = s;
			this.context = t.context, this.callback = t.callback, this.subscribe = t.subscribe ?? !1;
		} else this.context = s, this.callback = i, this.subscribe = h ?? !1;
		this.host.addController(this);
	}
	hostConnected() {
		this.dispatchRequest();
	}
	hostDisconnected() {
		this.unsubscribe && (this.unsubscribe(), this.unsubscribe = void 0);
	}
	dispatchRequest() {
		this.host.dispatchEvent(new s$3(this.context, this.host, this.t, this.subscribe));
	}
};
/**
* @license
* Copyright 2021 Google LLC
* SPDX-License-Identifier: BSD-3-Clause
*/
/**
* @license
* Copyright 2021 Google LLC
* SPDX-License-Identifier: BSD-3-Clause
*/
/**
* @license
* Copyright 2021 Google LLC
* SPDX-License-Identifier: BSD-3-Clause
*/
/**
* @license
* Copyright 2017 Google LLC
* SPDX-License-Identifier: BSD-3-Clause
*/
/**
* @license
* Copyright 2022 Google LLC
* SPDX-License-Identifier: BSD-3-Clause
*/ function c$1({ context: c, subscribe: e }) {
	return (o, n) => {
		"object" == typeof n ? n.addInitializer((function() {
			new s$2(this, {
				context: c,
				callback: (t) => {
					o.set.call(this, t);
				},
				subscribe: e
			});
		})) : o.constructor.addInitializer(((o) => {
			new s$2(o, {
				context: c,
				callback: (t) => {
					o[n] = t;
				},
				subscribe: e
			});
		}));
	};
}
/**
* Contexts used to inject dependencies into the Lit renderer.
*/
const Context = { markdown: n$1(Symbol.for("A2UIMarkdown")) };
/**
* @license
* Copyright 2017 Google LLC
* SPDX-License-Identifier: BSD-3-Clause
*/ const s = (i, t) => {
	const e = i._$AN;
	if (void 0 === e) return !1;
	for (const i of e) i._$AO?.(t, !1), s(i, t);
	return !0;
};
const o$1 = (i) => {
	let t, e;
	do {
		if (void 0 === (t = i._$AM)) break;
		e = t._$AN, e.delete(i), i = t;
	} while (0 === e?.size);
};
const r = (i) => {
	for (let t; t = i._$AM; i = t) {
		let e = t._$AN;
		if (void 0 === e) t._$AN = e = /* @__PURE__ */ new Set();
		else if (e.has(i)) break;
		e.add(i), c(t);
	}
};
function h(i) {
	void 0 !== this._$AN ? (o$1(this), this._$AM = i, r(this)) : this._$AM = i;
}
function n(i, t = !1, e = 0) {
	const r = this._$AH, h = this._$AN;
	if (void 0 !== h && 0 !== h.size) if (t) if (Array.isArray(r)) for (let i = e; i < r.length; i++) s(r[i], !1), o$1(r[i]);
	else null != r && (s(r, !1), o$1(r));
	else s(this, i);
}
const c = (i) => {
	i.type == t$2.CHILD && (i._$AP ??= n, i._$AQ ??= h);
};
var f = class extends i$3 {
	constructor() {
		super(...arguments), this._$AN = void 0;
	}
	_$AT(i, t, e) {
		super._$AT(i, t, e), r(this), this.isConnected = i._$AU;
	}
	_$AO(i, t = !0) {
		i !== this.isConnected && (this.isConnected = i, i ? this.reconnected?.() : this.disconnected?.()), t && (s(this, i), o$1(this));
	}
	setValue(t) {
		if (r$1(this._$Ct)) this._$Ct._$AI(t, this);
		else {
			const i = [...this._$Ct._$AH];
			i[this._$Ci] = t, this._$Ct._$AI(i, this, 0);
		}
	}
	disconnected() {}
	reconnected() {}
};
/**
* @license
* Copyright 2017 Google LLC
* SPDX-License-Identifier: BSD-3-Clause
*/ var e = class extends i$3 {
	constructor(i) {
		if (super(i), this.it = A, i.type !== t$2.CHILD) throw Error(this.constructor.directiveName + "() can only be used in child bindings");
	}
	render(r) {
		if (r === A || null == r) return this._t = void 0, this.it = r;
		if (r === E) return r;
		if ("string" != typeof r) throw Error(this.constructor.directiveName + "() called with a non-string value");
		if (r === this.it) return this._t;
		this.it = r;
		const s = [r];
		return s.raw = s, this._t = {
			_$litType$: this.constructor.resultType,
			strings: s,
			values: []
		};
	}
};
e.directiveName = "unsafeHTML", e.resultType = 1;
const o = e$5(e);
let globalMarkdownRenderer;
var MarkdownDirective = class MarkdownDirective extends f {
	constructor() {
		super(...arguments);
		this.lastValue = null;
		this.lastRenderer = void 0;
		this.lastTagClassMap = null;
	}
	/** @internal For testing purposes only */
	static resetWarningForTesting() {
		MarkdownDirective.defaultMarkdownWarningLogged = false;
	}
	update(_part, [value, markdownRenderer, markdownOptions]) {
		const effectiveRenderer = markdownRenderer ?? globalMarkdownRenderer;
		const jsonTagClassMap = JSON.stringify(markdownOptions?.tagClassMap);
		if (this.lastValue === value && this.lastRenderer === effectiveRenderer && jsonTagClassMap === this.lastTagClassMap) return E;
		this.lastValue = value;
		this.lastRenderer = effectiveRenderer;
		this.lastTagClassMap = jsonTagClassMap;
		return this.render(value, effectiveRenderer, markdownOptions);
	}
	render(value, markdownRenderer, markdownOptions) {
		const effectiveRenderer = markdownRenderer ?? globalMarkdownRenderer;
		if (effectiveRenderer) {
			Promise.resolve(effectiveRenderer(value, markdownOptions)).then((renderedStr) => {
				if (this.isConnected) this.setValue(o(renderedStr));
			});
			return b`<span class="no-markdown-renderer">${value}</span>`;
		}
		if (!MarkdownDirective.defaultMarkdownWarningLogged) {
			console.warn("[MarkdownDirective]", "can't render markdown because no markdown renderer is configured.\n", "Use `@a2ui/markdown-it`, or your own markdown renderer.");
			MarkdownDirective.defaultMarkdownWarningLogged = true;
		}
		return b`<span class="no-markdown-renderer">${value}</span>`;
	}
};
MarkdownDirective.defaultMarkdownWarningLogged = false;
const markdown = e$5(MarkdownDirective);
var __decorate = function(decorators, target, key, desc) {
	var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	return c > 3 && r && Object.defineProperty(target, key, r), r;
};
const NON_MARKDOWN_VARIANTS = /* @__PURE__ */ new Set([
	"h1",
	"h2",
	"h3",
	"h4",
	"h5",
	"caption"
]);
var A2uiBasicTextElement = class extends BasicCatalogA2uiLitElement {
	constructor() {
		super(...arguments);
		this.api = TextApi;
	}
	render() {
		const props = this.controller.props;
		if (!props) return A;
		const variant = props.variant || "body";
		const text = typeof props.text === "string" ? props.text : String(props.text ?? "");
		const flexStyle = typeof props.weight === "number" ? `flex: ${props.weight};` : A;
		if (NON_MARKDOWN_VARIANTS.has(variant)) {
			let content = b`${text}`;
			switch (variant) {
				case "h1":
					content = b`<h1>${text}</h1>`;
					break;
				case "h2":
					content = b`<h2>${text}</h2>`;
					break;
				case "h3":
					content = b`<h3>${text}</h3>`;
					break;
				case "h4":
					content = b`<h4>${text}</h4>`;
					break;
				case "h5":
					content = b`<h5>${text}</h5>`;
					break;
				case "caption": content = b`<em>${text}</em>`;
			}
			return b`<span class="a2ui-text ${variant}" style=${flexStyle}>${content}</span>`;
		}
		const renderedMarkdown = markdown(text, this.markdownRenderer);
		return b`<span class="a2ui-text ${variant}" style=${flexStyle}>${renderedMarkdown}</span>`;
	}
};
/**
* The styles of the text component can be customized by redefining the following
* CSS variables:
*
* - `--a2ui-text-color-text`: The color of the text. Defaults to `--a2ui-color-on-background`.
* - `--a2ui-text-caption-color`: The color for caption text. Defaults to `light-dark(#666, #aaa)`.
*/
A2uiBasicTextElement.styles = i$8`
    :host {
      display: contents;
    }
    .a2ui-text p,
    .a2ui-text h1,
    .a2ui-text h2,
    .a2ui-text h3,
    .a2ui-text h4,
    .a2ui-text h5,
    .a2ui-text h6,
    .a2ui-text ol,
    .a2ui-text ul,
    .a2ui-text li,
    .a2ui-text blockquote,
    .a2ui-text pre {
      margin: var(--_a2ui-text-margin, 0);
    }
    .a2ui-text {
      color: var(--_a2ui-text-color, var(--a2ui-text-color-text, var(--a2ui-color-on-background)));
    }
    .a2ui-text h1,
    .a2ui-text h2,
    .a2ui-text h3,
    .a2ui-text h4,
    .a2ui-text h5,
    .a2ui-text h6 {
      font-family: var(--a2ui-font-family-title, inherit);
      line-height: var(--a2ui-line-height-headings, 1.2);
    }
    .a2ui-text h1 {
      font-size: var(--a2ui-font-size-2xl);
    }
    .a2ui-text h2 {
      font-size: var(--a2ui-font-size-xl);
    }
    .a2ui-text h3 {
      font-size: var(--a2ui-font-size-l);
    }
    .a2ui-text p,
    .a2ui-text h4 {
      font-size: var(--a2ui-font-size-m);
    }
    .a2ui-text h5 {
      font-size: var(--a2ui-font-size-s);
    }
    .a2ui-text p {
      line-height: var(--a2ui-line-height-body, 1.5);
    }
    .a2ui-text.caption,
    .a2ui-caption {
      font-size: var(--a2ui-font-size-xs);
      color: var(--a2ui-text-caption-color, light-dark(#666, #aaa));
    }
    .a2ui-text a {
      color: var(--a2ui-text-a-color, inherit);
      font-weight: var(--a2ui-text-a-font-weight, inherit);
    }
  `;
__decorate([c$1({
	context: Context.markdown,
	subscribe: true
})], A2uiBasicTextElement.prototype, "markdownRenderer", void 0);
const A2uiText = {
	...TextApi,
	tagName: "a2ui-basic-text",
	element: A2uiBasicTextElement
};
var A2uiBasicTextFieldElement = class extends BasicCatalogA2uiLitElement {
	constructor() {
		super(...arguments);
		this.api = TextFieldApi;
	}
	render() {
		const props = this.controller.props;
		if (!props) return A;
		const isInvalid = props.isValid === false;
		const onInput = (e) => props.setValue?.(e.target.value);
		let type = "text";
		if (props.variant === "number") type = "number";
		if (props.variant === "obscured") type = "password";
		const classes = {
			"a2ui-textfield": true,
			invalid: isInvalid
		};
		return b`
      ${props.label ? b`<label>${props.label}</label>` : A}
      ${props.variant === "longText" ? b`<textarea
            class=${e$4(classes)}
            .value=${props.value || ""}
            @input=${onInput}
          ></textarea>` : b`<input
            type=${type}
            class=${e$4(classes)}
            .value=${props.value || ""}
            @input=${onInput}
          />`}
      ${isInvalid && props.validationErrors?.length ? props.validationErrors.map((err) => b`<div class="error">${err}</div>`) : A}
    `;
	}
};
/**
* The styles of the text field can be customized by redefining the following
* CSS variables:
*
* - `--a2ui-textfield-width`: Width of the component. Defaults to `100%`.
* - `--a2ui-textfield-border`: The styling for the text field border. Defaults to `--a2ui-border-width` width and `--a2ui-color-border` color.
* - `--a2ui-textfield-border-radius`: The border radius of the text field. Defaults to `--a2ui-spacing-m`.
* - `--a2ui-textfield-padding`: The padding of the text field. Defaults to `--a2ui-spacing-m`.
* - `--a2ui-textfield-color-border-focus`: The border color on focus. Defaults to `--a2ui-color-primary`.
* - `--a2ui-textfield-color-error`: The color for both invalid border and error text. Defaults to red.
* - `--a2ui-textfield-label-font-size`: Font size of the label. Defaults to `--a2ui-label-font-size` then `--a2ui-font-size-s`.
* - `--a2ui-textfield-label-font-weight`: Font weight of the label. Defaults to `--a2ui-label-font-weight` then `bold`.
*
* It also inherits global input variables:
* - `--a2ui-color-input`: Background color.
* - `--a2ui-color-on-input`: Text color.
*/
A2uiBasicTextFieldElement.styles = i$8`
    :host,
    a2ui-basic-textfield {
      display: flex;
      flex-direction: column;
      width: var(--a2ui-textfield-width, 100%);
      gap: var(--a2ui-spacing-xs, 0.25rem);
    }
    .a2ui-textfield {
      box-sizing: border-box;
      width: 100%;
      background-color: var(--a2ui-color-input, #fff);
      color: var(--a2ui-color-on-input, #333);
      border: var(--a2ui-textfield-border, var(--a2ui-border));
      border-radius: var(--a2ui-textfield-border-radius, var(--a2ui-spacing-m));
      padding: var(--a2ui-textfield-padding, var(--a2ui-spacing-m));
      font-family: inherit;
    }
    .a2ui-textfield:focus {
      outline: none;
      border-color: var(--a2ui-textfield-color-border-focus, var(--a2ui-color-primary, #17e));
    }
    .a2ui-textfield.invalid {
      border-color: var(--a2ui-textfield-color-error, red);
    }
    label {
      font-size: var(
        --a2ui-textfield-label-font-size,
        var(--a2ui-label-font-size, var(--a2ui-font-size-s))
      );
      font-weight: var(--a2ui-textfield-label-font-weight, var(--a2ui-label-font-weight, bold));
    }
    .error {
      color: var(--a2ui-textfield-color-error, red);
      font-size: var(--a2ui-font-size-xs, 0.75rem);
    }
  `;
const A2uiTextField = {
	...TextFieldApi,
	tagName: "a2ui-basic-textfield",
	element: A2uiBasicTextFieldElement
};
var A2uiVideoElement = class extends BasicCatalogA2uiLitElement {
	constructor() {
		super(...arguments);
		this.api = VideoApi;
	}
	render() {
		const props = this.controller.props;
		if (!props) return A;
		return b`
      <div class="a2ui-video-container">
        <video src=${props.url || A} controls class="a2ui-video">
          Your browser does not support the video tag.
        </video>
      </div>
    `;
	}
};
/**
* The styles of the video can be customized by redefining the following
* CSS variables:
*
* - `--a2ui-video-border-radius`: Controls the rounded corners of the video. Defaults to `0`.
*/
A2uiVideoElement.styles = i$8`
    .a2ui-video-container {
      width: 100%;
      max-width: 100%;
    }
    .a2ui-video {
      width: 100%;
      height: auto;
      display: block;
      border-radius: var(--a2ui-video-border-radius, 0);
    }
  `;
const A2uiVideo = {
	...VideoApi,
	tagName: "a2ui-video",
	element: A2uiVideoElement
};
/**
* Checks that the value is not null, undefined, or empty.
*/
const RequiredApi = {
	name: "required",
	returnType: "boolean",
	schema: objectType({ "value": anyType().refine((v) => v !== void 0, "Required").describe("The value to check.") })
};
/**
* Checks that the value matches a regular expression string.
*/
const RegexApi = {
	name: "regex",
	returnType: "boolean",
	schema: objectType({
		"value": DynamicStringSchema.describe("REF:#/$defs/DynamicString"),
		"pattern": stringType().describe("The regex pattern to match against.")
	})
};
/**
* Checks string length constraints.
*/
const LengthApi = {
	name: "length",
	returnType: "boolean",
	schema: objectType({
		"value": DynamicStringSchema.describe("REF:#/$defs/DynamicString"),
		"min": numberType().int().describe("The minimum allowed length.").optional(),
		"max": numberType().int().describe("The maximum allowed length.").optional()
	})
};
/**
* Checks numeric range constraints.
*/
const NumericApi = {
	name: "numeric",
	returnType: "boolean",
	schema: objectType({
		"value": DynamicNumberSchema.describe("REF:#/$defs/DynamicNumber"),
		"min": numberType().describe("The minimum allowed value.").optional(),
		"max": numberType().describe("The maximum allowed value.").optional()
	})
};
/**
* Checks that the value is a valid email address.
*/
const EmailApi = {
	name: "email",
	returnType: "boolean",
	schema: objectType({ "value": DynamicStringSchema.describe("REF:#/$defs/DynamicString") })
};
/**
* Performs string interpolation of data model values and other functions in the catalog functions list and returns the resulting string. The value string can contain interpolated expressions in the `${expression}` format. Supported expression types include: JSON Pointer paths to the data model (e.g., `${/absolute/path}` or `${relative/path}`), and client-side function calls (e.g., `${now()}`). Function arguments must be named (e.g., `${formatDate(value:${/currentDate}, format:'MM-dd')}`). To include a literal `${` sequence, escape it as `\${`.
*/
const FormatStringApi = {
	name: "formatString",
	returnType: "string",
	schema: objectType({ "value": DynamicStringSchema.describe("REF:#/$defs/DynamicString") })
};
/**
* Formats a number with the specified grouping and decimal precision.
*/
const FormatNumberApi = {
	name: "formatNumber",
	returnType: "string",
	schema: objectType({
		"value": DynamicNumberSchema.describe("REF:#/$defs/DynamicNumber|The number to format."),
		"decimals": DynamicNumberSchema.describe("REF:#/$defs/DynamicNumber|Optional. The number of decimal places to show. Defaults to 0 or 2 depending on locale.").optional(),
		"grouping": DynamicBooleanSchema.describe("REF:#/$defs/DynamicBoolean|Optional. If true, uses locale-specific grouping separators (e.g. '1,000'). If false, returns raw digits (e.g. '1000'). Defaults to true.").optional()
	})
};
/**
* Formats a number as a currency string.
*/
const FormatCurrencyApi = {
	name: "formatCurrency",
	returnType: "string",
	schema: objectType({
		"value": DynamicNumberSchema.describe("REF:#/$defs/DynamicNumber|The monetary amount."),
		"currency": DynamicStringSchema.describe("REF:#/$defs/DynamicString|The ISO 4217 currency code (e.g., 'USD', 'EUR')."),
		"decimals": DynamicNumberSchema.describe("REF:#/$defs/DynamicNumber|Optional. The number of decimal places to show. Defaults to 0 or 2 depending on locale.").optional(),
		"grouping": DynamicBooleanSchema.describe("REF:#/$defs/DynamicBoolean|Optional. If true, uses locale-specific grouping separators (e.g. '1,000'). If false, returns raw digits (e.g. '1000'). Defaults to true.").optional()
	})
};
/**
* Formats a timestamp into a string using a pattern.
*/
const FormatDateApi = {
	name: "formatDate",
	returnType: "string",
	schema: objectType({
		"value": DynamicValueSchema.describe("REF:#/$defs/DynamicValue|The date to format."),
		"format": DynamicStringSchema.describe("REF:#/$defs/DynamicString|A Unicode TR35 date pattern string.\n\nToken Reference:\n- Year: 'yy' (26), 'yyyy' (2026)\n- Month: 'M' (1), 'MM' (01), 'MMM' (Jan), 'MMMM' (January)\n- Day: 'd' (1), 'dd' (01), 'E' (Tue), 'EEEE' (Tuesday)\n- Hour (12h): 'h' (1-12), 'hh' (01-12) - requires 'a' for AM/PM\n- Hour (24h): 'H' (0-23), 'HH' (00-23) - Military Time\n- Minute: 'mm' (00-59)\n- Second: 'ss' (00-59)\n- Period: 'a' (AM/PM)\n\nExamples:\n- 'MMM dd, yyyy' -> 'Jan 16, 2026'\n- 'HH:mm' -> '14:30' (Military)\n- 'h:mm a' -> '2:30 PM'\n- 'EEEE, d MMMM' -> 'Friday, 16 January'")
	})
};
/**
* Returns a localized string based on the Common Locale Data Repository (CLDR) plural category of the count (zero, one, two, few, many, other). Requires an 'other' fallback. For English, just use 'one' and 'other'.
*/
const PluralizeApi = {
	name: "pluralize",
	returnType: "string",
	schema: objectType({
		"value": DynamicNumberSchema.describe("REF:#/$defs/DynamicNumber|The numeric value used to determine the plural category."),
		"zero": DynamicStringSchema.describe("REF:#/$defs/DynamicString|String for the 'zero' category (e.g., 0 items).").optional(),
		"one": DynamicStringSchema.describe("REF:#/$defs/DynamicString|String for the 'one' category (e.g., 1 item).").optional(),
		"two": DynamicStringSchema.describe("REF:#/$defs/DynamicString|String for the 'two' category (used in Arabic, Welsh, etc.).").optional(),
		"few": DynamicStringSchema.describe("REF:#/$defs/DynamicString|String for the 'few' category (e.g., small groups in Slavic languages).").optional(),
		"many": DynamicStringSchema.describe("REF:#/$defs/DynamicString|String for the 'many' category (e.g., large groups in various languages).").optional(),
		"other": DynamicStringSchema.describe("REF:#/$defs/DynamicString|The default/fallback string (used for general plural cases).")
	})
};
/**
* Opens the specified URL in a browser or handler. This function has no return value.
*/
const OpenUrlApi = {
	name: "openUrl",
	returnType: "void",
	schema: objectType({ "url": stringType().describe("The URL to open.") })
};
/**
* Performs a logical AND operation on a list of boolean values.
*/
const AndApi = {
	name: "and",
	returnType: "boolean",
	schema: objectType({ "values": arrayType(DynamicBooleanSchema).min(2).describe("The list of boolean values to evaluate.") })
};
/**
* Performs a logical OR operation on a list of boolean values.
*/
const OrApi = {
	name: "or",
	returnType: "boolean",
	schema: objectType({ "values": arrayType(DynamicBooleanSchema).min(2).describe("The list of boolean values to evaluate.") })
};
/**
* Performs a logical NOT operation on a boolean value.
*/
const NotApi = {
	name: "not",
	returnType: "boolean",
	schema: objectType({ "value": DynamicBooleanSchema.describe("REF:#/$defs/DynamicBoolean|The boolean value to negate.") })
};
/**
* The maximum allowed length for expression template strings to prevent resource exhaustion (CWE-400),
* measured in UTF-16 code units (i.e. JavaScript `string.length`, not characters and not bytes).
*/
const MAX_EXPRESSION_TEMPLATE_LENGTH = 1e4;
/**
* The maximum allowed number of parts in an expression template to prevent resource exhaustion (CWE-400).
*
* A "part" is an individual segment produced when parsing the template string: each interpolated
* expression (`${...}`), escaped interpolation delimiter (`\${`), or literal text span between
* interpolations that forms an element in the parsed output array.
*/
const MAX_EXPRESSION_PARTS = 1e3;
/**
* Parses A2UI expressions, supporting string interpolation and function calls.
*
* Converts strings with `${...}` placeholders into arrays of `DynamicValue` objects.
* Supports literals (strings, numbers, booleans), path-based data bindings, and
* nested function calls with named arguments.
*/
var ExpressionParser = class ExpressionParser {
	/**
	* Parses an input string into an array of DynamicValues.
	*
	* If the input contains no interpolation placeholders, returns the raw string as a single literal.
	*
	* @param input Raw string to parse.
	* @param depth Current recursion depth.
	* @returns An array of parsed dynamic values and literals.
	*/
	parse(input, depth = 0) {
		if (depth > ExpressionParser.MAX_DEPTH) throw new A2uiExpressionError("Max recursion depth reached in parse");
		if (input && input.length > 1e4) throw new A2uiExpressionError(`Expression template length (${input.length}) exceeds maximum limit (${MAX_EXPRESSION_TEMPLATE_LENGTH})`);
		if (!input) return [];
		if (!input.includes("${")) return [input];
		const parts = [];
		const scanner = new Scanner(input);
		while (!scanner.isAtEnd()) {
			if (parts.length >= 1e3) throw new A2uiExpressionError(`Expression parts count exceeds maximum limit (${MAX_EXPRESSION_PARTS})`);
			if (scanner.matches("${")) {
				scanner.advance(2);
				const content = this.extractInterpolationContent(scanner);
				const parsed = this.parseExpression(content, depth + 1);
				if (parsed !== null) parts.push(parsed);
			} else if (scanner.peek() === "\\" && scanner.peek(1) === "$" && scanner.peek(2) === "{") {
				scanner.advance();
				parts.push("${");
				scanner.advance(2);
			} else {
				const start = scanner.pos;
				while (!scanner.isAtEnd()) {
					if (scanner.matches("${")) break;
					if (scanner.peek() === "\\" && scanner.peek(1) === "$" && scanner.peek(2) === "{") break;
					scanner.advance();
				}
				parts.push(scanner.input.substring(start, scanner.pos));
			}
		}
		return parts.filter((p) => p !== null && p !== "");
	}
	extractInterpolationContent(scanner) {
		const start = scanner.pos;
		let braceBalance = 1;
		while (!scanner.isAtEnd() && braceBalance > 0) {
			const char = scanner.advance();
			if (char === "{") braceBalance++;
			else if (char === "}") braceBalance--;
			else if (char === "'" || char === "\"") {
				const quote = char;
				while (!scanner.isAtEnd()) {
					const c = scanner.advance();
					if (c === "\\") scanner.advance();
					else if (c === quote) break;
				}
			}
		}
		if (braceBalance > 0) throw new A2uiExpressionError("Unclosed interpolation: missing '}'");
		return scanner.input.substring(start, scanner.pos - 1);
	}
	/**
	* Parses a single expression string into a DynamicValue.
	*
	* Unlike `parse()`, which handles mixed literal text and interpolations,
	* this assumes the entire string is a single expression (e.g., as found inside `${...}`).
	*
	* @param expr The expression string to parse.
	* @param depth The current recursion depth.
	* @returns The resolved DynamicValue.
	*/
	parseExpression(expr, depth = 0) {
		expr = expr.trim();
		if (!expr) return "";
		const scanner = new Scanner(expr);
		const result = this.parseExpressionInternal(scanner, depth);
		if (!scanner.isAtEnd()) throw new A2uiExpressionError(`Unexpected characters at end of expression: '${scanner.input.substring(scanner.pos)}'`);
		return result;
	}
	parseExpressionInternal(scanner, depth) {
		if (depth > ExpressionParser.MAX_DEPTH) throw new A2uiExpressionError("Max recursion depth reached in parse");
		scanner.skipWhitespace();
		if (scanner.isAtEnd()) return "";
		if (scanner.matches("${")) {
			scanner.advance(2);
			const content = this.extractInterpolationContent(scanner);
			return this.parseExpression(content, depth + 1);
		}
		if (scanner.matchesString("'") || scanner.matchesString("\"")) return this.parseStringLiteral(scanner);
		if (this.isDigit(scanner.peek()) || (scanner.peek() === "-" || scanner.peek() === "+") && this.isDigit(scanner.peek(1))) return this.parseNumberLiteral(scanner);
		if (scanner.matchesKeyword("true")) return true;
		if (scanner.matchesKeyword("false")) return false;
		if (scanner.matchesKeyword("null")) return "";
		const token = this.scanPathOrIdentifier(scanner);
		scanner.skipWhitespace();
		if (scanner.peek() === "(") return this.parseFunctionCall(token, scanner, depth);
		else {
			if (!token) return "";
			return { path: token };
		}
	}
	scanPathOrIdentifier(scanner) {
		const start = scanner.pos;
		while (!scanner.isAtEnd()) {
			const c = scanner.peek();
			if (this.isAlnum(c) || c === "/" || c === "." || c === "_" || c === "-") scanner.advance();
			else break;
		}
		return scanner.input.substring(start, scanner.pos);
	}
	parseFunctionCall(funcName, scanner, depth) {
		scanner.match("(");
		scanner.skipWhitespace();
		const args = {};
		while (!scanner.isAtEnd() && scanner.peek() !== ")") {
			const argName = this.scanIdentifier(scanner);
			scanner.skipWhitespace();
			if (!scanner.match(":")) throw new A2uiExpressionError(`Expected ':' after argument name '${argName}' in function '${funcName}'`);
			scanner.skipWhitespace();
			args[argName] = this.parseExpressionInternal(scanner, depth + 1);
			scanner.skipWhitespace();
			if (scanner.peek() === ",") {
				scanner.advance();
				scanner.skipWhitespace();
			}
		}
		if (!scanner.match(")")) throw new A2uiExpressionError(`Expected ')' after function arguments for '${funcName}'`);
		return {
			call: funcName,
			args,
			returnType: "any"
		};
	}
	scanIdentifier(scanner) {
		const start = scanner.pos;
		while (!scanner.isAtEnd() && (this.isAlnum(scanner.peek()) || scanner.peek() === "_")) scanner.advance();
		return scanner.input.substring(start, scanner.pos);
	}
	parseStringLiteral(scanner) {
		const quote = scanner.advance();
		let result = "";
		while (!scanner.isAtEnd()) {
			const c = scanner.advance();
			if (c === "\\") {
				const next = scanner.advance();
				if (next === "n") result += "\n";
				else if (next === "t") result += "	";
				else if (next === "r") result += "\r";
				else result += next;
			} else if (c === quote) break;
			else result += c;
		}
		return result;
	}
	parseNumberLiteral(scanner) {
		const start = scanner.pos;
		if (scanner.peek() === "-" || scanner.peek() === "+") scanner.advance();
		while (!scanner.isAtEnd() && (this.isDigit(scanner.peek()) || scanner.peek() === ".")) scanner.advance();
		if (!scanner.isAtEnd() && (scanner.peek() === "e" || scanner.peek() === "E")) {
			scanner.advance();
			if (!scanner.isAtEnd() && (scanner.peek() === "+" || scanner.peek() === "-")) scanner.advance();
			while (!scanner.isAtEnd() && this.isDigit(scanner.peek())) scanner.advance();
		}
		const text = scanner.input.substring(start, scanner.pos);
		if (!/^[+-]?\d+\.?\d*(?:[eE][+-]?\d+)?$/.test(text)) throw new A2uiExpressionError(`Invalid number literal: '${text}'`);
		return Number(text);
	}
	isAlnum(c) {
		return c >= "a" && c <= "z" || c >= "A" && c <= "Z" || c >= "0" && c <= "9";
	}
	isDigit(c) {
		return c >= "0" && c <= "9";
	}
};
/**
* The maximum allowed recursion depth for nested expressions, which bounds
* the work a payload can demand of the parser and keeps it off the stack
* limit.
*
* Every engine uses the same number: `ExpressionParser.MAX_DEPTH` in Python
* and `ExpressionParser.maxDepth` in Swift. They must agree, or an
* expression one engine accepts the other rejects.
*/
ExpressionParser.MAX_DEPTH = 100;
var Scanner = class {
	constructor(input) {
		this.input = input;
		this.pos = 0;
	}
	isAtEnd() {
		return this.pos >= this.input.length;
	}
	peek(offset = 0) {
		if (this.pos + offset >= this.input.length) return "\0";
		return this.input[this.pos + offset];
	}
	advance(count = 1) {
		const char = this.input.substring(this.pos, this.pos + count);
		this.pos += count;
		return char;
	}
	match(expected) {
		if (this.peek() === expected) {
			this.advance();
			return true;
		}
		return false;
	}
	matches(expected) {
		if (this.input.startsWith(expected, this.pos)) return true;
		return false;
	}
	matchesString(expected) {
		return this.peek() === expected;
	}
	matchesKeyword(keyword) {
		if (this.input.startsWith(keyword, this.pos)) {
			const next = this.peek(keyword.length);
			if (!/[a-zA-Z0-9_]/.test(next)) {
				this.advance(keyword.length);
				return true;
			}
		}
		return false;
	}
	skipWhitespace() {
		while (!this.isAtEnd() && /\s/.test(this.peek())) this.advance();
	}
};
/**
* Shared basic catalog function implementations and formatting helpers.
*
* Provides shared execution algorithms, caching layers, and implementation
* factory functions consumed by all version-specific basic catalog definitions.
*/
/**
* Default BCP 47 locale used when a catalog is built without an explicit one.
*
* Pinned to en-US so formatting output is consistent across machines.
*/
const DEFAULT_LOCALE = "en-US";
/**
* Resolves the locale tag a catalog was built with to one the formatters can use.
*
* Falls back to {@link DEFAULT_LOCALE} in three cases, each of which the Python
* engine also falls back for:
*
* - No tag was supplied.
* - The tag is malformed, such as `en_US`, which makes `Intl` throw a
*   `RangeError` from every constructor it is handed to.
* - The tag is well formed but no locale data matches it, such as `xx-YY`. Here
*   `Intl` would silently format with the host's ambient locale, which this
*   module promises never to depend on.
*
* @param locale Optional BCP 47 language tag.
* @returns A tag `Intl` both accepts and has data for.
*/
function resolveLocale(locale) {
	if (!locale) return DEFAULT_LOCALE;
	try {
		return Intl.NumberFormat.supportedLocalesOf(locale).length > 0 ? locale : DEFAULT_LOCALE;
	} catch {
		return DEFAULT_LOCALE;
	}
}
/**
* Coerces a value to a string following protocol type conversion rules.
*
* - Numbers and booleans: standard string representation.
* - `null` and `undefined`: an empty string `""`.
* - Objects and arrays: stringified as compact JSON.
*
* @param value The value to coerce.
* @returns The string representation.
*/
function coerceToString(value) {
	if (value === null || value === void 0) return "";
	if (typeof value === "object") try {
		return JSON.stringify(value) ?? String(value);
	} catch {
		return String(value);
	}
	return String(value);
}
/** Validates that a value is present and non-empty. */
function validateRequired(val) {
	let isValid = true;
	if (val === null || val === void 0) isValid = false;
	else if (typeof val === "string" && val === "") isValid = false;
	else if (Array.isArray(val) && val.length === 0) isValid = false;
	return {
		valid: isValid,
		...isValid ? {} : { message: "This field is required." }
	};
}
/** Validates that a string value matches a regular expression pattern. */
function validateRegex(val, pattern) {
	try {
		const isValid = new RegExp(pattern).test(String(val ?? ""));
		return {
			valid: isValid,
			...isValid ? {} : { message: "Value does not match required pattern." }
		};
	} catch (e) {
		throw new A2uiExpressionError(`Invalid regex pattern: ${pattern}`, "regex", e);
	}
}
/** Validates that string or array length falls within an optional range. */
function validateLength(val, min, max) {
	let len = 0;
	if (typeof val === "string" || Array.isArray(val)) len = val.length;
	let isValid = true;
	let message;
	if (min !== void 0 && !isNaN(min) && len < min) {
		isValid = false;
		message = `Minimum length is ${min}.`;
	} else if (max !== void 0 && !isNaN(max) && len > max) {
		isValid = false;
		message = `Maximum length is ${max}.`;
	}
	return {
		valid: isValid,
		...message ? { message } : {}
	};
}
/** Validates that a numeric value falls within an optional range. */
function validateNumeric(val, min, max) {
	const num = Number(val);
	if (isNaN(num)) return {
		valid: false,
		message: "Value must be a valid number."
	};
	let isValid = true;
	let message;
	if (min !== void 0 && !isNaN(min) && num < min) {
		isValid = false;
		message = `Minimum value is ${min}.`;
	} else if (max !== void 0 && !isNaN(max) && num > max) {
		isValid = false;
		message = `Maximum value is ${max}.`;
	}
	return {
		valid: isValid,
		...message ? { message } : {}
	};
}
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
/** Validates that a string matches basic email address syntax. */
function validateEmail(val) {
	const isValid = typeof val === "string" && EMAIL_REGEX.test(val);
	return {
		valid: isValid,
		...isValid ? {} : { message: "Must be a valid email address." }
	};
}
const numberFormatCache = /* @__PURE__ */ new Map();
function getNumberFormat(locale, decimals, grouping) {
	const key = `${locale}:${decimals ?? "undef"}:${grouping ?? "true"}`;
	let formatter = numberFormatCache.get(key);
	if (!formatter) {
		formatter = new Intl.NumberFormat(locale, {
			minimumFractionDigits: decimals,
			maximumFractionDigits: decimals,
			useGrouping: grouping
		});
		numberFormatCache.set(key, formatter);
	}
	return formatter;
}
const currencyFormatCache = /* @__PURE__ */ new Map();
function getCurrencyFormat(locale, currency, decimals, grouping) {
	const key = `${locale}:${currency}:${decimals ?? "undef"}:${grouping ?? "true"}`;
	let formatter = currencyFormatCache.get(key);
	if (!formatter) {
		formatter = new Intl.NumberFormat(locale, {
			style: "currency",
			currency,
			minimumFractionDigits: decimals,
			maximumFractionDigits: decimals,
			useGrouping: grouping
		});
		currencyFormatCache.set(key, formatter);
	}
	return formatter;
}
/**
* An assigned code, formatted only to discover where the locale places a
* currency. Its own symbol is never shown.
*/
const PLACEHOLDER_CURRENCY = "USD";
const currencyCodeFormatCache = /* @__PURE__ */ new Map();
/**
* Returns a formatter that renders the currency as its ISO code rather than as
* a symbol, which makes the locale's placement and spacing observable through
* `formatToParts`.
*/
function getCurrencyCodeFormat(locale, decimals, grouping) {
	const key = `${locale}:${decimals ?? "undef"}:${grouping ?? "true"}`;
	let formatter = currencyCodeFormatCache.get(key);
	if (!formatter) {
		formatter = new Intl.NumberFormat(locale, {
			style: "currency",
			currency: PLACEHOLDER_CURRENCY,
			currencyDisplay: "code",
			minimumFractionDigits: decimals,
			maximumFractionDigits: decimals,
			useGrouping: grouping
		});
		currencyCodeFormatCache.set(key, formatter);
	}
	return formatter;
}
const dateNamesCache = /* @__PURE__ */ new Map();
/** Builds month and weekday name tables for a locale using `Intl.DateTimeFormat`. */
function getDateNames(locale) {
	let names = dateNamesCache.get(locale);
	if (!names) {
		const render = (options, dates) => {
			const formatter = new Intl.DateTimeFormat(locale, {
				...options,
				timeZone: "UTC"
			});
			return dates.map((d) => formatter.format(d));
		};
		const months = Array.from({ length: 12 }, (_, i) => new Date(Date.UTC(2021, i, 15)));
		const weekdays = Array.from({ length: 7 }, (_, i) => new Date(Date.UTC(2021, 2, 1 + i)));
		names = {
			monthsLong: render({ month: "long" }, months),
			monthsShort: render({ month: "short" }, months),
			weekdaysLong: render({ weekday: "long" }, weekdays),
			weekdaysShort: render({ weekday: "short" }, weekdays)
		};
		dateNamesCache.set(locale, names);
	}
	return names;
}
const DATE_TOKENS = /yyyy|yy|MMMM|MMM|MM|M|EEEE|E|dd|d|HH|H|hh|h|mm|ss|a/g;
const ISO_OFFSET = /(?:Z|[+-]\d{2}:?\d{2})$/;
/**
* Parses an ISO 8601 timestamp and shifts it so that UTC accessors report
* the wall-clock fields the timestamp was written with.
*/
function parseTimestamp(value) {
	const hasOffset = ISO_OFFSET.test(value);
	const instant = new Date(hasOffset ? value : `${value}Z`);
	if (isNaN(instant.getTime())) return null;
	let offsetMinutes = 0;
	const match = /([+-])(\d{2}):?(\d{2})$/.exec(value);
	if (match) offsetMinutes = (match[1] === "-" ? -1 : 1) * (Number(match[2]) * 60 + Number(match[3]));
	return {
		shifted: new Date(instant.getTime() + offsetMinutes * 6e4),
		instant
	};
}
const pluralRulesCache = /* @__PURE__ */ new Map();
function getPluralRules(locale) {
	let rules = pluralRulesCache.get(locale);
	if (!rules) {
		rules = new Intl.PluralRules(locale);
		pluralRulesCache.set(locale, rules);
	}
	return rules;
}
/** Evaluates logical AND across an array of values. */
function executeAnd(values) {
	return Array.isArray(values) ? values.every((v) => !!v) : false;
}
/** Evaluates logical OR across an array of values. */
function executeOr(values) {
	return Array.isArray(values) ? values.some((v) => !!v) : false;
}
/** Evaluates logical NOT on a single value. */
function executeNot(value) {
	return !value;
}
/** Formats a template string by resolving embedded expressions. */
function executeFormatString(template, context) {
	const parts = new ExpressionParser().parse(template);
	if (parts.length === 0) return "";
	const dynamicParts = parts.map((part) => {
		if (typeof part !== "object" || part === null || Array.isArray(part)) return part;
		return context.resolveSignal(part);
	});
	return computed(() => {
		return dynamicParts.map((p) => coerceToString(isSignal(p) ? getValue(p) : p)).join("");
	});
}
/** Formats a number with configured precision and grouping. */
function executeFormatNumber(value, decimals, grouping, locale = DEFAULT_LOCALE) {
	if (isNaN(value)) return "";
	return getNumberFormat(locale, decimals, grouping).format(value);
}
/** Formats a number as currency. */
function executeFormatCurrency(value, currencyInput, decimals = 2, grouping, locale = DEFAULT_LOCALE) {
	if (isNaN(value)) return "";
	const currency = String(currencyInput).toUpperCase();
	try {
		return getCurrencyFormat(locale, currency, decimals, grouping).format(value);
	} catch {
		return getCurrencyCodeFormat(locale, decimals, grouping).formatToParts(value).map((part) => part.type === "currency" ? currency : part.value).join("");
	}
}
/** Formats a timestamp using TR35 pattern tokens, or emits an ISO timestamp. */
function executeFormatDate(value, formatPattern = "yyyy-MM-dd", locale = DEFAULT_LOCALE) {
	if (!value) return "";
	const parsed = parseTimestamp(String(value));
	if (!parsed) return "";
	const { shifted, instant } = parsed;
	const pattern = formatPattern || "yyyy-MM-dd";
	if (pattern === "ISO") return instant.toISOString();
	const names = getDateNames(locale);
	const weekdayIndex = (shifted.getUTCDay() + 6) % 7;
	const hours = shifted.getUTCHours();
	const hours12 = hours % 12 || 12;
	return pattern.replace(DATE_TOKENS, (token) => {
		switch (token) {
			case "yyyy": return String(shifted.getUTCFullYear());
			case "yy": return String(shifted.getUTCFullYear()).slice(-2);
			case "MMMM": return names.monthsLong[shifted.getUTCMonth()];
			case "MMM": return names.monthsShort[shifted.getUTCMonth()];
			case "MM": return String(shifted.getUTCMonth() + 1).padStart(2, "0");
			case "M": return String(shifted.getUTCMonth() + 1);
			case "EEEE": return names.weekdaysLong[weekdayIndex];
			case "E": return names.weekdaysShort[weekdayIndex];
			case "dd": return String(shifted.getUTCDate()).padStart(2, "0");
			case "d": return String(shifted.getUTCDate());
			case "HH": return String(hours).padStart(2, "0");
			case "H": return String(hours);
			case "hh": return String(hours12).padStart(2, "0");
			case "h": return String(hours12);
			case "mm": return String(shifted.getUTCMinutes()).padStart(2, "0");
			case "ss": return String(shifted.getUTCSeconds()).padStart(2, "0");
			case "a": return hours < 12 ? "AM" : "PM";
			default: return token;
		}
	});
}
/** Selects the appropriate plural form for a quantity. */
function executePluralize(value, forms, locale = DEFAULT_LOCALE) {
	let category;
	if (value === 0 && forms["zero"] !== void 0) category = "zero";
	else if (value === 1 && forms["one"] !== void 0) category = "one";
	else if (value === 2 && forms["two"] !== void 0) category = "two";
	else category = getPluralRules(locale).select(value);
	return String(forms[category] ?? forms["other"] ?? "");
}
/** Opens a specified URL in a new browser tab. */
function executeOpenUrl(urlInput) {
	const target = typeof urlInput === "string" ? urlInput : void 0;
	if (!target || typeof window === "undefined" || !window.open) return;
	const baseHref = typeof window.location !== "undefined" && window.location.href ? window.location.href : void 0;
	let url;
	try {
		url = baseHref ? new URL(target, baseHref) : new URL(target);
	} catch (e) {
		throw new A2uiExpressionError(`Invalid URL specified: ${target}`, "openUrl", e);
	}
	if (url.protocol !== "https:" && url.protocol !== "http:") throw new A2uiExpressionError(`Unsupported URL scheme: ${url.protocol}`, "openUrl");
	window.open(url.href, "_blank", "noopener,noreferrer");
}
function createAndImplementation(api) {
	return createFunctionImplementation(api, (args) => executeAnd(args.values));
}
function createOrImplementation(api) {
	return createFunctionImplementation(api, (args) => executeOr(args.values));
}
function createNotImplementation(api) {
	return createFunctionImplementation(api, (args) => executeNot(args.value));
}
function createFormatStringImplementation(api) {
	return createFunctionImplementation(api, (args, context) => executeFormatString(args.value, context));
}
function createFormatNumberImplementation$1(api, locale) {
	const resolvedLocale = resolveLocale(locale);
	return createFunctionImplementation(api, (args) => executeFormatNumber(args.value, args.decimals, args.grouping, resolvedLocale));
}
function createFormatCurrencyImplementation$1(api, locale) {
	const resolvedLocale = resolveLocale(locale);
	return createFunctionImplementation(api, (args) => executeFormatCurrency(args.value, args.currency, args.decimals ?? 2, args.grouping, resolvedLocale));
}
function createFormatDateImplementation$1(api, locale) {
	const resolvedLocale = resolveLocale(locale);
	return createFunctionImplementation(api, (args) => executeFormatDate(args.value, args.format, resolvedLocale));
}
function createPluralizeImplementation$1(api, locale) {
	const resolvedLocale = resolveLocale(locale);
	return createFunctionImplementation(api, (args) => executePluralize(args.value, args, resolvedLocale));
}
function createOpenUrlImplementation(api) {
	return createFunctionImplementation(api, (args) => executeOpenUrl(args.url));
}
/**
* Function implementations for the v0.9 basic catalog.
*/
const AndImplementation = createAndImplementation(AndApi);
const OrImplementation = createOrImplementation(OrApi);
const NotImplementation = createNotImplementation(NotApi);
const RequiredImplementation = createFunctionImplementation(RequiredApi, (args) => validateRequired(args.value).valid);
const RegexImplementation = createFunctionImplementation(RegexApi, (args) => validateRegex(args.value, args.pattern).valid);
const LengthImplementation = createFunctionImplementation(LengthApi, (args) => validateLength(args.value, args.min, args.max).valid);
const NumericImplementation = createFunctionImplementation(NumericApi, (args) => validateNumeric(args.value, args.min, args.max).valid);
const EmailImplementation = createFunctionImplementation(EmailApi, (args) => validateEmail(args.value).valid);
const FormatStringImplementation = createFormatStringImplementation(FormatStringApi);
function createFormatNumberImplementation(locale) {
	return createFormatNumberImplementation$1(FormatNumberApi, locale);
}
createFormatNumberImplementation();
function createFormatCurrencyImplementation(locale) {
	return createFormatCurrencyImplementation$1(FormatCurrencyApi, locale);
}
createFormatCurrencyImplementation();
function createFormatDateImplementation(locale) {
	return createFormatDateImplementation$1(FormatDateApi, locale);
}
createFormatDateImplementation();
function createPluralizeImplementation(locale) {
	return createPluralizeImplementation$1(PluralizeApi, locale);
}
createPluralizeImplementation();
const OpenUrlImplementation = createOpenUrlImplementation(OpenUrlApi);
/**
* Creates standard function implementations for the Basic Catalog.
*
* @param options Configuration options containing optional locale.
* @returns Array of function implementations.
*/
function createBasicCatalogFunctions(options) {
	const locale = options?.locale;
	return [
		AndImplementation,
		OrImplementation,
		NotImplementation,
		RequiredImplementation,
		RegexImplementation,
		LengthImplementation,
		NumericImplementation,
		EmailImplementation,
		FormatStringImplementation,
		createFormatNumberImplementation(locale),
		createFormatCurrencyImplementation(locale),
		createFormatDateImplementation(locale),
		createPluralizeImplementation(locale),
		OpenUrlImplementation
	];
}
/**
* Standard function implementations for the Basic Catalog.
*
* Includes logical, validation, formatting, and action functions.
*/
const BASIC_FUNCTIONS = createBasicCatalogFunctions();
/**
* The single canonical basic catalog of A2UI components implemented via Web Components (Custom Elements).
*/
const basicCatalog = new Catalog("https://a2ui.org/specification/v0_9/catalogs/basic/catalog.json", "0.9", [
	A2uiText,
	A2uiButton,
	A2uiTextField,
	A2uiRow,
	A2uiColumn,
	A2uiList,
	A2uiImage,
	A2uiIcon,
	A2uiVideo,
	A2uiAudioPlayer,
	A2uiCard,
	A2uiDivider,
	A2uiCheckBox,
	A2uiSlider,
	A2uiDateTimeInput,
	A2uiChoicePicker,
	A2uiTabs,
	A2uiModal
], BASIC_FUNCTIONS, BasicCatalogThemeSchema);
function defineHost(Model, App) {
	class A2UIHost extends HTMLElement {
		#model = new Model();
		#dispose;
		#disconnect;
		#api;
		connectedCallback() {
			this.#disconnect = this.#model.connect(this);
			this.#api = {
				applyMessages: (messages) => this.#model.applyMessages(messages),
				reset: () => this.#model.reset(),
				getSurfaces: () => this.#model.getSurfaces()
			};
			globalThis.openclawA2UI = this.#api;
			const messages = globalThis.openclawA2UIBoot?.messages;
			if (Array.isArray(messages)) this.#model.applyMessages(messages);
			this.#dispose = render(() => {
				const _self$ = this;
				return createComponent(App, { get model() {
					return _self$.#model;
				} });
			}, this);
		}
		disconnectedCallback() {
			this.#dispose?.();
			this.#dispose = void 0;
			this.#disconnect?.();
			this.#disconnect = void 0;
			if (globalThis.openclawA2UI === this.#api) delete globalThis.openclawA2UI;
		}
	}
	if (!customElements.get("openclaw-a2ui-host")) customElements.define("openclaw-a2ui-host", A2UIHost);
}
var _tmpl$ = /* @__PURE__ */ template(`<a2ui-surface>`, 1);
var _tmpl$2 = /* @__PURE__ */ template(`<div>Loading surface...`);
var _tmpl$3 = /* @__PURE__ */ template(`<div role=alert>Unknown component type: `);
var _tmpl$4 = /* @__PURE__ */ template(`<style>
      openclaw-a2ui-host { display: block; min-height: 100%; color: var(--text); background: transparent; }
      openclaw-a2ui-host #surfaces { display: grid; gap: 12px; min-height: 100%; }
      openclaw-a2ui-host .error { color: var(--danger); padding: 12px; }
    `);
var _tmpl$5 = /* @__PURE__ */ template(`<section id=surfaces>`);
var _tmpl$6 = /* @__PURE__ */ template(`<div class=error role=alert>`);
const actionText = (action) => {
	const context = action?.context && Object.keys(action.context).length ? action.context : void 0;
	return context ? `A2UI action ${action.name}: ${JSON.stringify(context)}` : `A2UI action ${action?.name ?? "selected"}`;
};
var A2UIModel = class {
	#processor = this.#createProcessor();
	error = "";
	notify = () => {};
	#createProcessor() {
		const processor = new MessageProcessor([basicCatalog], async (action) => {
			try {
				const api = globalThis.openclaw;
				if (!api?.state?.emit) throw new Error("missing board action bridge");
				if (globalThis.openclawA2UIBoot?.actionTier === "prompt" && api.prompt?.send) await api.prompt.send(actionText(action));
				else await api.state.emit({
					eventType: "a2ui.action",
					action
				});
			} catch (error) {
				if (processor !== this.#processor) return;
				this.error = String(error?.message ?? error);
				this.notify();
			}
		});
		return processor;
	}
	connect() {
		return () => {};
	}
	get surfaces() {
		return Array.from(this.#processor.model.surfacesMap.entries());
	}
	getSurfaces() {
		return this.surfaces.map(([id]) => id);
	}
	applyMessages(messages) {
		if (!Array.isArray(messages)) throw new Error("A2UI: expected messages array");
		this.#processor.processMessages(messages);
		this.notify();
		return {
			ok: true,
			surfaces: this.getSurfaces()
		};
	}
	reset() {
		this.#processor.model.dispose();
		this.#processor = this.#createProcessor();
		this.error = "";
		this.notify();
		return { ok: true };
	}
};
function CatalogRoot(props) {
	const node = untrack(() => props.node);
	const surface = untrack(() => props.surface);
	const implementation = node.impl;
	registerUniversalElement(implementation);
	const element = document.createElement(implementation.tagName);
	element.context = new ComponentContext(surface, node.componentId, node.dataPath);
	return element;
}
function Surface(props) {
	const surface = untrack(() => props.surface);
	const resolver = new NodeResolver(surface, surface.defaultCatalog);
	const [root, setRoot] = createSignal();
	const stop = effect(() => setRoot(getValue(resolver.rootNode)));
	onCleanup(() => {
		stop();
		resolver.dispose();
	});
	var _el$ = _tmpl$();
	_el$._$owner = getOwner();
	insert(_el$, createComponent(Show, {
		get when() {
			return root();
		},
		keyed: true,
		get fallback() {
			return _tmpl$2();
		},
		children: (node) => createComponent(Show, {
			get when() {
				return node.impl;
			},
			get fallback() {
				var _el$3 = _tmpl$3();
				_el$3.firstChild;
				insert(_el$3, () => {
					return node.type;
				}, null);
				return _el$3;
			},
			get children() {
				return createComponent(CatalogRoot, {
					node,
					surface
				});
			}
		})
	}));
	return _el$;
}
function A2UIApp(props) {
	const model = untrack(() => props.model);
	const [revision, setRevision] = createSignal(0);
	model.notify = () => setRevision((value) => value + 1);
	onCleanup(() => {
		model.notify = () => {};
	});
	const read = () => {
		revision();
		return model;
	};
	return [
		_tmpl$4(),
		createComponent(Show, {
			get when() {
				return read().error;
			},
			children: (error) => (() => {
				var _el$7 = _tmpl$6();
				insert(_el$7, error);
				return _el$7;
			})()
		}),
		(() => {
			var _el$6 = _tmpl$5();
			insert(_el$6, createComponent(For, {
				get each() {
					return read().surfaces;
				},
				keyed: (entry) => entry[1],
				children: (entry) => createComponent(Surface, { get surface() {
					return entry()[1];
				} })
			}));
			return _el$6;
		})()
	];
}
defineHost(A2UIModel, A2UIApp);
