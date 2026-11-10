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
	else merge$2(resolveTx(e), passTx);
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
	else if (e !== null) merge$2(resolveTx(e), n);
	if (!globalQueue.ee) schedule();
}
/** `t` merges into `f`: the work that touched both entangles them (A15).
* A lane never merges: it is a sub-frame, not a peer — its work is routed
* per pass (`passLane`). */ function merge$2(e, n) {
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
function computed(e, t) {
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
function signal(e, t) {
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
			if (e !== null && n !== null) merge$2(e, n);
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
function createSignal$2(e, t) {
	if (typeof e === "function") {
		const r = computed(e, t);
		r.u &= -33;
		return [accessor(r), setMemo.bind(null, r)];
	}
	const r = signal(e, t);
	return [accessor(r), setSignal.bind(null, r)];
}
function createMemo$1(e, t) {
	return accessor(computed(e, t));
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
	const h = computed(updateKeyedMap.bind(o), void 0);
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
			r[i] = signal(t[i], pureOptions);
			return this.Ot(accessor(r[i]), i);
		} : () => {
			r[i] = signal(t[i], pureOptions);
			n && (n[i] = signal(i, pureOptions));
			return this.Ot(accessor(r[i]), n ? accessor(n[i]) : void 0);
		} : this.gt ? () => {
			const s = t[i];
			n[i] = signal(i, pureOptions);
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
const createMemo = (...args) => {
	return createMemo$1(...args);
};
const createSignal$1 = (...args) => {
	return createSignal$2(...args);
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
const syncOptions = { sync: true };
function effect$1(fn, effectFn, options) {
	const nodeOptions = options ? {
		sync: true,
		...options,
		transparent: !options.scope
	} : transparentOptions;
	createRenderEffect(fn, effectFn, nodeOptions);
}
function memo(fn) {
	return createMemo(() => fn(), syncOptions);
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
function create$1(html, bypassGuard, flag) {
	const t = document.createElement("template");
	t.innerHTML = html;
	return flag === 2 ? t.content.firstChild.firstChild : t.content.firstChild;
}
function template(html, flag) {
	let node;
	return flag === 1 ? (bypassGuard) => document.importNode(node || (node = create$1(html, bypassGuard, flag)), true) : (bypassGuard) => (node || (node = create$1(html, bypassGuard, flag))).cloneNode(true);
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
/**
* Event dispatched when an input component's validation state is updated.
*/
var A2UIValidationEvent = class A2UIValidationEvent extends CustomEvent {
	/**
	* Creates a new `A2UIValidationEvent` instance.
	*
	* @param detail Event detail payload without the `eventType` discriminator.
	* @param eventInitDict Optional standard `EventInit` dictionary.
	*/
	constructor(detail, eventInitDict) {
		super(A2UIValidationEvent.EVENT_NAME, {
			bubbles: true,
			composed: true,
			...eventInitDict,
			detail: {
				...detail,
				eventType: A2UIValidationEvent.EVENT_NAME
			}
		});
	}
};
A2UIValidationEvent.EVENT_NAME = "a2ui-validation-input";
/**
* Checks whether a key and value represent a valid JSON path reference.
*
* @param key Property key name.
* @param value Property value.
* @returns Whether the key is 'path' and the value is a string.
*/
function isPath(key, value) {
	return key === "path" && typeof value === "string";
}
/**
* Checks whether a value is a non-null, non-array object record.
*
* @param value Value to test.
* @returns Whether the value is a Record object.
*/
function isObject(value) {
	return typeof value === "object" && value !== null && !Array.isArray(value);
}
/**
* Checks whether a value is a ComponentArrayReference (explicit list or template).
*
* @param value Value to test.
* @returns Whether the value is a ComponentArrayReference.
*/
function isComponentArrayReference(value) {
	if (!isObject(value)) return false;
	return "explicitList" in value || "template" in value;
}
function isStringValue(value) {
	return isObject(value) && ("path" in value || "literal" in value && typeof value.literal === "string" || "literalString" in value);
}
function isNumberValue(value) {
	return isObject(value) && ("path" in value || "literal" in value && typeof value.literal === "number" || "literalNumber" in value);
}
function isBooleanValue(value) {
	return isObject(value) && ("path" in value || "literal" in value && typeof value.literal === "boolean" || "literalBoolean" in value);
}
function isAnyComponentNode(value) {
	if (!isObject(value)) return false;
	if (!("id" in value && "type" in value && "properties" in value)) return false;
	return true;
}
/**
* Checks whether a props object conforms to ResolvedAudioPlayer.
*
* @param props Properties object to test.
* @returns Whether the props match ResolvedAudioPlayer.
*/
function isResolvedAudioPlayer(props) {
	return isObject(props) && "url" in props && isStringValue(props.url);
}
/**
* Checks whether a props object conforms to ResolvedButton.
*
* @param props Properties object to test.
* @returns Whether the props match ResolvedButton.
*/
function isResolvedButton(props) {
	return isObject(props) && "child" in props && isAnyComponentNode(props.child) && "action" in props;
}
/**
* Checks whether a props object conforms to ResolvedCard.
*
* @param props Properties object to test.
* @returns Whether the props match ResolvedCard.
*/
function isResolvedCard(props) {
	if (!isObject(props)) return false;
	if (!("child" in props)) {
		if (!("children" in props)) return false;
		else return Array.isArray(props.children) && props.children.every(isAnyComponentNode);
	}
	return isAnyComponentNode(props.child);
}
/**
* Checks whether a props object conforms to ResolvedCheckbox.
*
* @param props Properties object to test.
* @returns Whether the props match ResolvedCheckbox.
*/
function isResolvedCheckbox(props) {
	return isObject(props) && "label" in props && isStringValue(props.label) && "value" in props && isBooleanValue(props.value);
}
/**
* Checks whether a props object conforms to ResolvedColumn.
*
* @param props Properties object to test.
* @returns Whether the props match ResolvedColumn.
*/
function isResolvedColumn(props) {
	return isObject(props) && "children" in props && Array.isArray(props.children) && props.children.every(isAnyComponentNode);
}
/**
* Checks whether a props object conforms to ResolvedDateTimeInput.
*
* @param props Properties object to test.
* @returns Whether the props match ResolvedDateTimeInput.
*/
function isResolvedDateTimeInput(props) {
	return isObject(props) && "value" in props && isStringValue(props.value);
}
/**
* Checks whether a props object conforms to ResolvedDivider.
*
* @param props Properties object to test.
* @returns Whether the props match ResolvedDivider.
*/
function isResolvedDivider(props) {
	return isObject(props);
}
/**
* Checks whether a props object conforms to ResolvedImage.
*
* @param props Properties object to test.
* @returns Whether the props match ResolvedImage.
*/
function isResolvedImage(props) {
	return isObject(props) && "url" in props && isStringValue(props.url);
}
/**
* Checks whether a props object conforms to ResolvedIcon.
*
* @param props Properties object to test.
* @returns Whether the props match ResolvedIcon.
*/
function isResolvedIcon(props) {
	return isObject(props) && "name" in props && isStringValue(props.name);
}
/**
* Checks whether a props object conforms to ResolvedList.
*
* @param props Properties object to test.
* @returns Whether the props match ResolvedList.
*/
function isResolvedList(props) {
	return isObject(props) && "children" in props && Array.isArray(props.children) && props.children.every(isAnyComponentNode);
}
/**
* Checks whether a props object conforms to ResolvedModal.
*
* @param props Properties object to test.
* @returns Whether the props match ResolvedModal.
*/
function isResolvedModal(props) {
	return isObject(props) && "entryPointChild" in props && isAnyComponentNode(props.entryPointChild) && "contentChild" in props && isAnyComponentNode(props.contentChild);
}
/**
* Checks whether a props object conforms to ResolvedMultipleChoice.
*
* @param props Properties object to test.
* @returns Whether the props match ResolvedMultipleChoice.
*/
function isResolvedMultipleChoice(props) {
	return isObject(props) && "selections" in props;
}
/**
* Checks whether a props object conforms to ResolvedRow.
*
* @param props Properties object to test.
* @returns Whether the props match ResolvedRow.
*/
function isResolvedRow(props) {
	return isObject(props) && "children" in props && Array.isArray(props.children) && props.children.every(isAnyComponentNode);
}
/**
* Checks whether a props object conforms to ResolvedSlider.
*
* @param props Properties object to test.
* @returns Whether the props match ResolvedSlider.
*/
function isResolvedSlider(props) {
	return isObject(props) && "value" in props && isNumberValue(props.value);
}
function isResolvedTabItem(item) {
	return isObject(item) && "title" in item && isStringValue(item.title) && "child" in item && isAnyComponentNode(item.child);
}
/**
* Checks whether a props object conforms to ResolvedTabs.
*
* @param props Properties object to test.
* @returns Whether the props match ResolvedTabs.
*/
function isResolvedTabs(props) {
	return isObject(props) && "tabItems" in props && Array.isArray(props.tabItems) && props.tabItems.every(isResolvedTabItem);
}
/**
* Checks whether a props object conforms to ResolvedText.
*
* @param props Properties object to test.
* @returns Whether the props match ResolvedText.
*/
function isResolvedText(props) {
	return isObject(props) && "text" in props && isStringValue(props.text);
}
/**
* Checks whether a props object conforms to ResolvedTextField.
*
* @param props Properties object to test.
* @returns Whether the props match ResolvedTextField.
*/
function isResolvedTextField(props) {
	return isObject(props) && "label" in props && isStringValue(props.label);
}
/**
* Checks whether a props object conforms to ResolvedVideo.
*
* @param props Properties object to test.
* @returns Whether the props match ResolvedVideo.
*/
function isResolvedVideo(props) {
	return isObject(props) && "url" in props && isStringValue(props.url);
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
let emojiRegex;
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
			if (!emojiRegex) emojiRegex = new RegExp(_emojiRegex, "u");
			if (!emojiRegex.test(input.data)) {
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
ZodUnknown.create;
ZodNever.create;
ZodVoid.create;
const arrayType = ZodArray.create;
const objectType = ZodObject.create;
ZodObject.strictCreate;
ZodUnion.create;
ZodDiscriminatedUnion.create;
ZodIntersection.create;
ZodTuple.create;
const recordType = ZodRecord.create;
ZodMap.create;
ZodSet.create;
ZodFunction.create;
const lazyType = ZodLazy.create;
ZodLiteral.create;
const enumType = ZodEnum.create;
ZodNativeEnum.create;
ZodPromise.create;
ZodEffects.create;
ZodOptional.create;
ZodNullable.create;
ZodEffects.createWithPreprocess;
ZodPipeline.create;
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
const ActionSchema = objectType({
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
	action: ActionSchema.describe("Represents a user-initiated action."),
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
const DeleteSurfaceMessageSchema = objectType({ surfaceId: stringType().describe("The unique identifier for the UI surface to be deleted.") }).strict().describe("Signals the client to delete the surface identified by 'surfaceId'.");
const A2uiMessageSchema = objectType({
	beginRendering: BeginRenderingMessageSchema.optional(),
	surfaceUpdate: SurfaceUpdateMessageSchema.optional(),
	dataModelUpdate: DataModelUpdateMessageSchema.optional(),
	deleteSurface: DeleteSurfaceMessageSchema.optional()
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
/**
* Base class for all A2UI v0.8 specific errors.
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
* Error thrown when JSON validation fails or schemas are mismatched.
*/
var A2uiValidationError = class extends A2uiError {
	/**
	* Initializes a new `A2uiValidationError` instance.
	*
	* @param message Human-readable error description.
	* @param details Additional error details or issues.
	*/
	constructor(message, details) {
		super(message, "VALIDATION_ERROR");
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
	* @param message Human-readable error description.
	*/
	constructor(message) {
		super(message, "STATE_ERROR");
	}
};
/**
* Processes and consolidates A2UI v0.8 protocol messages into a structured model of UI surfaces.
*/
var A2uiMessageProcessor = class A2uiMessageProcessor {
	constructor(opts = {
		mapCtor: Map,
		arrayCtor: Array,
		setCtor: Set,
		objCtor: Object
	}) {
		this.opts = opts;
		this.mapCtor = Map;
		this.arrayCtor = Array;
		this.setCtor = Set;
		this.objCtor = Object;
		this.arrayCtor = opts.arrayCtor;
		this.mapCtor = opts.mapCtor;
		this.setCtor = opts.setCtor;
		this.objCtor = opts.objCtor;
		this.surfaces = new opts.mapCtor();
	}
	/**
	* Retrieves a map of all visible surfaces with root components.
	*
	* @returns Readonly map of active surfaces keyed by surface ID.
	*/
	getSurfaces() {
		const allSurfaces = this.surfaces;
		const visibleSurfaces = /* @__PURE__ */ new Map();
		for (const [surfaceId, surface] of allSurfaces) if (surface.rootComponentId) visibleSurfaces.set(surfaceId, surface);
		return visibleSurfaces;
	}
	/**
	* Clears all surface records from memory.
	*/
	clearSurfaces() {
		this.surfaces.clear();
	}
	/**
	* Processes an array of server-to-client messages and applies state mutations.
	*
	* @param messages Array of v0.8 server-to-client messages.
	*/
	processMessages(messages) {
		for (const rawMessage of messages) {
			const message = A2uiMessageSchema.parse(rawMessage);
			if (message.beginRendering) this.handleBeginRendering(message.beginRendering, message.beginRendering.surfaceId);
			if (message.surfaceUpdate) this.handleSurfaceUpdate(message.surfaceUpdate, message.surfaceUpdate.surfaceId);
			if (message.dataModelUpdate) this.handleDataModelUpdate(message.dataModelUpdate, message.dataModelUpdate.surfaceId);
			if (message.deleteSurface) this.handleDeleteSurface(message.deleteSurface);
		}
	}
	/**
	* Retrieves data for a given component node and relative path string.
	*
	* @param node Component node providing data context.
	* @param relativePath Relative or absolute JSON pointer path.
	* @param surfaceId Surface identifier.
	* @returns Resolved data value, or null if not found.
	*/
	getData(node, relativePath, surfaceId = A2uiMessageProcessor.DEFAULT_SURFACE_ID) {
		const surface = this.getOrCreateSurface(surfaceId);
		if (!surface) return null;
		let finalPath;
		if (relativePath === "." || relativePath === "") finalPath = node.dataContextPath ?? "/";
		else finalPath = this.resolvePath(relativePath, node.dataContextPath);
		return this.getDataByPath(surface.dataModel, finalPath);
	}
	/**
	* Updates data at a path relative to a component node.
	*
	* @param node Component node providing data context.
	* @param relativePath Relative or absolute JSON pointer path.
	* @param value New value to assign.
	* @param surfaceId Surface identifier.
	*/
	setData(node, relativePath, value, surfaceId = A2uiMessageProcessor.DEFAULT_SURFACE_ID) {
		if (!node) {
			console.warn("No component node set");
			return;
		}
		const surface = this.getOrCreateSurface(surfaceId);
		if (!surface) return;
		let finalPath;
		if (relativePath === "." || relativePath === "") finalPath = node.dataContextPath ?? "/";
		else finalPath = this.resolvePath(relativePath, node.dataContextPath);
		this.setDataByPath(surface.dataModel, finalPath, value);
	}
	/**
	* Resolves a path relative to a base data context path.
	*
	* @param path Target path string.
	* @param dataContextPath Base context path.
	* @returns Resolved absolute path string.
	*/
	resolvePath(path, dataContextPath) {
		if (path.startsWith("/")) return path;
		if (dataContextPath && dataContextPath !== "/") return dataContextPath.endsWith("/") ? `${dataContextPath}${path}` : `${dataContextPath}/${path}`;
		return `/${path}`;
	}
	parseIfJsonString(value) {
		if (typeof value !== "string") return value;
		const trimmedValue = value.trim();
		if (trimmedValue.startsWith("{") && trimmedValue.endsWith("}") || trimmedValue.startsWith("[") && trimmedValue.endsWith("]")) try {
			return JSON.parse(value);
		} catch (e) {
			console.warn(`Failed to parse potential JSON string: "${value.substring(0, 50)}..."`, e);
			return value;
		}
		return value;
	}
	/**
	* Converts a specific array format [{key: "...", value_string: "..."}, ...]
	* into a standard Map. It also attempts to parse any string values that
	* appear to be stringified JSON.
	*/
	convertKeyValueArrayToMap(arr) {
		const map = new this.mapCtor();
		for (const item of arr) {
			if (!isObject(item) || !("key" in item)) continue;
			const key = item.key;
			const valueKey = this.findValueKey(item);
			if (!valueKey) continue;
			let value = item[valueKey];
			if (valueKey === "valueMap" && Array.isArray(value)) value = this.convertKeyValueArrayToMap(value);
			else if (typeof value === "string") value = this.parseIfJsonString(value);
			this.setDataByPath(map, key, value);
		}
		return map;
	}
	setDataByPath(root, path, value) {
		if (Array.isArray(value) && (value.length === 0 || isObject(value[0]) && "key" in value[0])) {
			if (value.length === 1 && isObject(value[0]) && value[0].key === ".") {
				const item = value[0];
				const valueKey = this.findValueKey(item);
				if (valueKey) {
					value = item[valueKey];
					if (valueKey === "valueMap" && Array.isArray(value)) value = this.convertKeyValueArrayToMap(value);
					else if (typeof value === "string") value = this.parseIfJsonString(value);
				} else value = this.convertKeyValueArrayToMap(value);
			} else value = this.convertKeyValueArrayToMap(value);
		}
		const segments = this.normalizePath(path).split("/").filter((s) => s);
		if (segments.length === 0) {
			if (value instanceof Map || isObject(value)) {
				if (!(value instanceof Map) && isObject(value)) value = new this.mapCtor(Object.entries(value));
				root.clear();
				for (const [key, v] of value.entries()) root.set(key, v);
			} else console.error("Cannot set root of DataModel to a non-Map value.");
			return;
		}
		let current = root;
		for (let i = 0; i < segments.length - 1; i++) {
			const segment = segments[i];
			let target;
			if (current instanceof Map) target = current.get(segment);
			else if (Array.isArray(current) && /^\d+$/.test(segment)) target = current[parseInt(segment, 10)];
			if (target === void 0 || typeof target !== "object" || target === null) {
				target = new this.mapCtor();
				if (current instanceof this.mapCtor) current.set(segment, target);
				else if (Array.isArray(current)) current[parseInt(segment, 10)] = target;
			}
			current = target;
		}
		const finalSegment = segments[segments.length - 1];
		const storedValue = value;
		if (current instanceof this.mapCtor) current.set(finalSegment, storedValue);
		else if (Array.isArray(current) && /^\d+$/.test(finalSegment)) current[parseInt(finalSegment, 10)] = storedValue;
	}
	/**
	* Normalizes a path string into a consistent, slash-delimited format.
	* Converts bracket notation and dot notation in a two-pass.
	* e.g., "bookRecommendations[0].title" -> "/bookRecommendations/0/title"
	* e.g., "book.0.title" -> "/book/0/title"
	*/
	normalizePath(path) {
		return "/" + path.replace(/\[(\d+)\]/g, ".$1").split(".").filter((s) => s.length > 0).join("/");
	}
	getDataByPath(root, path) {
		const segments = this.normalizePath(path).split("/").filter((s) => s);
		let current = root;
		for (const segment of segments) {
			if (current === void 0 || current === null) return null;
			if (current instanceof Map) current = current.get(segment);
			else if (Array.isArray(current) && /^\d+$/.test(segment)) current = current[parseInt(segment, 10)];
			else if (isObject(current)) {
				if (!Object.prototype.hasOwnProperty.call(current, segment)) return null;
				current = current[segment];
			} else return null;
		}
		return current;
	}
	getOrCreateSurface(surfaceId) {
		let surface = this.surfaces.get(surfaceId);
		if (!surface) {
			surface = new this.objCtor({
				rootComponentId: null,
				componentTree: null,
				dataModel: new this.mapCtor(),
				components: new this.mapCtor(),
				styles: new this.objCtor()
			});
			this.surfaces.set(surfaceId, surface);
		}
		return surface;
	}
	handleBeginRendering(message, surfaceId) {
		const surface = this.getOrCreateSurface(surfaceId);
		surface.rootComponentId = message.root;
		surface.styles = message.styles ?? {};
		this.rebuildComponentTree(surface);
	}
	handleSurfaceUpdate(message, surfaceId) {
		const surface = this.getOrCreateSurface(surfaceId);
		for (const component of message.components) surface.components.set(component.id, component);
		this.rebuildComponentTree(surface);
	}
	handleDataModelUpdate(message, surfaceId) {
		const surface = this.getOrCreateSurface(surfaceId);
		const path = message.path ?? "/";
		this.setDataByPath(surface.dataModel, path, message.contents);
		this.rebuildComponentTree(surface);
	}
	handleDeleteSurface(message) {
		this.surfaces.delete(message.surfaceId);
	}
	/**
	* Starts at the root component of the surface and builds out the tree
	* recursively. This process involves resolving all properties of the child
	* components, and expanding on any explicit children lists or templates
	* found in the structure.
	*
	* @param surface The surface to be built.
	*/
	rebuildComponentTree(surface) {
		if (!surface.rootComponentId) {
			surface.componentTree = null;
			return;
		}
		const visited = new this.setCtor();
		surface.componentTree = this.buildNodeRecursive(surface.rootComponentId, surface, visited, "/", "");
	}
	/** Finds a value key in a map. */
	findValueKey(value) {
		return Object.keys(value).find((k) => k.startsWith("value"));
	}
	/**
	* Builds out the nodes recursively.
	*/
	buildNodeRecursive(baseComponentId, surface, visited, dataContextPath, idSuffix = "") {
		const fullId = `${baseComponentId}${idSuffix}`;
		const { components } = surface;
		if (!components.has(baseComponentId)) return null;
		if (visited.has(fullId)) throw new A2uiStateError(`Circular dependency for component "${fullId}".`);
		visited.add(fullId);
		const componentData = components.get(baseComponentId);
		const componentProps = componentData.component ?? {};
		const componentType = Object.keys(componentProps)[0];
		const unresolvedProperties = componentProps[componentType];
		const resolvedProperties = new this.objCtor();
		if (isObject(unresolvedProperties)) for (const [key, value] of Object.entries(unresolvedProperties)) resolvedProperties[key] = this.resolvePropertyValue(value, surface, visited, dataContextPath, idSuffix, key === "action");
		visited.delete(fullId);
		const baseNode = {
			id: fullId,
			dataContextPath,
			weight: componentData.weight ?? "initial"
		};
		switch (componentType) {
			case "Text":
				if (!isResolvedText(resolvedProperties)) throw new A2uiValidationError(`Invalid data; expected ${componentType}`);
				return new this.objCtor({
					...baseNode,
					type: "Text",
					properties: resolvedProperties
				});
			case "Image":
				if (!isResolvedImage(resolvedProperties)) throw new A2uiValidationError(`Invalid data; expected ${componentType}`);
				return new this.objCtor({
					...baseNode,
					type: "Image",
					properties: resolvedProperties
				});
			case "Icon":
				if (!isResolvedIcon(resolvedProperties)) throw new A2uiValidationError(`Invalid data; expected ${componentType}`);
				return new this.objCtor({
					...baseNode,
					type: "Icon",
					properties: resolvedProperties
				});
			case "Video":
				if (!isResolvedVideo(resolvedProperties)) throw new A2uiValidationError(`Invalid data; expected ${componentType}`);
				return new this.objCtor({
					...baseNode,
					type: "Video",
					properties: resolvedProperties
				});
			case "AudioPlayer":
				if (!isResolvedAudioPlayer(resolvedProperties)) throw new A2uiValidationError(`Invalid data; expected ${componentType}`);
				return new this.objCtor({
					...baseNode,
					type: "AudioPlayer",
					properties: resolvedProperties
				});
			case "Row":
				if (!isResolvedRow(resolvedProperties)) throw new A2uiValidationError(`Invalid data; expected ${componentType}`);
				return new this.objCtor({
					...baseNode,
					type: "Row",
					properties: resolvedProperties
				});
			case "Column":
				if (!isResolvedColumn(resolvedProperties)) throw new A2uiValidationError(`Invalid data; expected ${componentType}`);
				return new this.objCtor({
					...baseNode,
					type: "Column",
					properties: resolvedProperties
				});
			case "List":
				if (!isResolvedList(resolvedProperties)) throw new A2uiValidationError(`Invalid data; expected ${componentType}`);
				return new this.objCtor({
					...baseNode,
					type: "List",
					properties: resolvedProperties
				});
			case "Card":
				if (!isResolvedCard(resolvedProperties)) throw new A2uiValidationError(`Invalid data; expected ${componentType}`);
				return new this.objCtor({
					...baseNode,
					type: "Card",
					properties: resolvedProperties
				});
			case "Tabs":
				if (!isResolvedTabs(resolvedProperties)) throw new A2uiValidationError(`Invalid data; expected ${componentType}`);
				return new this.objCtor({
					...baseNode,
					type: "Tabs",
					properties: resolvedProperties
				});
			case "Divider":
				if (!isResolvedDivider(resolvedProperties)) throw new A2uiValidationError(`Invalid data; expected ${componentType}`);
				return new this.objCtor({
					...baseNode,
					type: "Divider",
					properties: resolvedProperties
				});
			case "Modal":
				if (!isResolvedModal(resolvedProperties)) throw new A2uiValidationError(`Invalid data; expected ${componentType}`);
				return new this.objCtor({
					...baseNode,
					type: "Modal",
					properties: resolvedProperties
				});
			case "Button":
				if (!isResolvedButton(resolvedProperties)) throw new A2uiValidationError(`Invalid data; expected ${componentType}`);
				return new this.objCtor({
					...baseNode,
					type: "Button",
					properties: resolvedProperties
				});
			case "CheckBox":
				if (!isResolvedCheckbox(resolvedProperties)) throw new A2uiValidationError(`Invalid data; expected ${componentType}`);
				return new this.objCtor({
					...baseNode,
					type: "CheckBox",
					properties: resolvedProperties
				});
			case "TextField":
				if (!isResolvedTextField(resolvedProperties)) throw new A2uiValidationError(`Invalid data; expected ${componentType}`);
				return new this.objCtor({
					...baseNode,
					type: "TextField",
					properties: resolvedProperties
				});
			case "DateTimeInput":
				if (!isResolvedDateTimeInput(resolvedProperties)) throw new A2uiValidationError(`Invalid data; expected ${componentType}`);
				return new this.objCtor({
					...baseNode,
					type: "DateTimeInput",
					properties: resolvedProperties
				});
			case "MultipleChoice":
				if (!isResolvedMultipleChoice(resolvedProperties)) throw new A2uiValidationError(`Invalid data; expected ${componentType}`);
				return new this.objCtor({
					...baseNode,
					type: "MultipleChoice",
					properties: resolvedProperties
				});
			case "Slider":
				if (!isResolvedSlider(resolvedProperties)) throw new A2uiValidationError(`Invalid data; expected ${componentType}`);
				return new this.objCtor({
					...baseNode,
					type: "Slider",
					properties: resolvedProperties
				});
			default: return new this.objCtor({
				...baseNode,
				type: componentType,
				properties: resolvedProperties
			});
		}
	}
	/**
	* Recursively resolves an individual property value. If a property indicates
	* a child node (a string that matches a component ID), an explicitList of
	* children, or a template, these will be built out here.
	*/
	resolvePropertyValue(value, surface, visited, dataContextPath, idSuffix = "", isInsideAction = false) {
		if (!isInsideAction && typeof value === "string" && surface.components.has(value)) return this.buildNodeRecursive(value, surface, visited, dataContextPath, idSuffix);
		if (!isInsideAction && isComponentArrayReference(value)) {
			if (value.explicitList) return value.explicitList.map((id) => this.buildNodeRecursive(id, surface, visited, dataContextPath, idSuffix));
			if (value.template) {
				const fullDataPath = this.resolvePath(value.template.dataBinding, dataContextPath);
				const data = this.getDataByPath(surface.dataModel, fullDataPath);
				const template = value.template;
				if (Array.isArray(data)) return data.map((_, index) => {
					const newSuffix = `:${[...dataContextPath.split("/").filter((segment) => /^\d+$/.test(segment)), index].join(":")}`;
					const childDataContextPath = `${fullDataPath}/${index}`;
					return this.buildNodeRecursive(template.componentId, surface, visited, childDataContextPath, newSuffix);
				});
				if (data instanceof this.mapCtor) return Array.from(data.keys(), (key) => {
					const newSuffix = `:${key}`;
					const childDataContextPath = `${fullDataPath}/${key}`;
					return this.buildNodeRecursive(template.componentId, surface, visited, childDataContextPath, newSuffix);
				});
				return new this.arrayCtor();
			}
		}
		if (Array.isArray(value)) return value.map((item) => this.resolvePropertyValue(item, surface, visited, dataContextPath, idSuffix, isInsideAction));
		if (isObject(value)) {
			const newObj = new this.objCtor();
			for (const [key, propValue] of Object.entries(value)) {
				let propertyValue = propValue;
				if (isPath(key, propValue) && dataContextPath !== "/") {
					propertyValue = propValue.replace(/^\.?\/item/, "").replace(/^\.?\/text/, "").replace(/^\.?\/label/, "").replace(/^\.?\//, "");
					newObj[key] = propertyValue;
					continue;
				}
				newObj[key] = this.resolvePropertyValue(propertyValue, surface, visited, dataContextPath, idSuffix, isInsideAction || key === "action");
			}
			return newObj;
		}
		return value;
	}
};
A2uiMessageProcessor.DEFAULT_SURFACE_ID = "@default";
const opacityBehavior = `
  &:not([disabled]) {
    cursor: pointer;
    opacity: var(--opacity, 0);
    transition: opacity var(--speed, 0.2s) cubic-bezier(0, 0, 0.3, 1);

    &:hover,
    &:focus {
      opacity: 1;
    }
  }`;
const behavior = `
  ${new Array(21).fill(0).map((_, idx) => {
	return `.behavior-ho-${idx * 5} {
          --opacity: ${idx / 20};
          ${opacityBehavior}
        }`;
}).join("\n")}

  .behavior-o-s {
    overflow: scroll;
  }

  .behavior-o-a {
    overflow: auto;
  }

  .behavior-o-h {
    overflow: hidden;
  }

  .behavior-sw-n {
    scrollbar-width: none;
  }
`;
const border = `
  ${new Array(25).fill(0).map((_, idx) => {
	return `
        .border-bw-${idx} { border-width: ${idx}px; }
        .border-btw-${idx} { border-top-width: ${idx}px; }
        .border-bbw-${idx} { border-bottom-width: ${idx}px; }
        .border-blw-${idx} { border-left-width: ${idx}px; }
        .border-brw-${idx} { border-right-width: ${idx}px; }

        .border-ow-${idx} { outline-width: ${idx}px; }
        .border-br-${idx} { border-radius: ${idx * 4}px; overflow: hidden;}`;
}).join("\n")}

  .border-br-50pc {
    border-radius: 50%;
  }

  .border-bs-s {
    border-style: solid;
  }
`;
const shades = [
	0,
	5,
	10,
	15,
	20,
	25,
	30,
	35,
	40,
	50,
	60,
	70,
	80,
	90,
	95,
	98,
	99,
	100
];
/**
* Merges multiple style class dictionaries, overriding classes with matching prefixes.
*
* @param classes Style class records to merge.
* @returns Combined style class dictionary.
*/
function merge(...classes) {
	const styles = {};
	for (const clazz of classes) for (const [key, val] of Object.entries(clazz)) {
		const prefix = key.split("-").with(-1, "").join("-");
		const existingKeys = Object.keys(styles).filter((key) => key.startsWith(prefix));
		for (const existingKey of existingKeys) delete styles[existingKey];
		styles[key] = val;
	}
	return styles;
}
/**
* Appends or replaces style classes across multiple target tag mappings.
*
* @param target Target tag to class list dictionary.
* @param exclusions Tag names excluded from mutation.
* @param classes Style class records to apply.
* @returns Updated tag-to-classes dictionary.
*/
function appendToAll(target, exclusions, ...classes) {
	const updatedTarget = structuredClone(target);
	for (const clazz of classes) for (const key of Object.keys(clazz)) {
		const prefix = key.split("-").with(-1, "").join("-");
		for (const [tagName, classesToAdd] of Object.entries(updatedTarget)) {
			if (exclusions.includes(tagName)) continue;
			let found = false;
			for (let t = 0; t < classesToAdd.length; t++) if (classesToAdd[t].startsWith(prefix)) {
				found = true;
				classesToAdd[t] = key;
			}
			if (!found) classesToAdd.push(key);
		}
	}
	return updatedTarget;
}
/**
* Converts a palette token key into a CSS custom property name.
*
* @param key Color token key string.
* @returns Formatted CSS property name.
*/
function toProp(key) {
	if (key.startsWith("nv")) return `--nv-${key.slice(2)}`;
	return `--${key[0]}-${key.slice(1)}`;
}
const color = (src) => `
    ${src.map((key) => {
	const inverseKey = getInverseKey(key);
	return `.color-bc-${key} { border-color: light-dark(var(${toProp(key)}), var(${toProp(inverseKey)})); }`;
}).join("\n")}

    ${src.map((key) => {
	const inverseKey = getInverseKey(key);
	const vals = [`.color-bgc-${key} { background-color: light-dark(var(${toProp(key)}), var(${toProp(inverseKey)})); }`, `.color-bbgc-${key}::backdrop { background-color: light-dark(var(${toProp(key)}), var(${toProp(inverseKey)})); }`];
	for (let o = .1; o < 1; o += .1) vals.push(`.color-bbgc-${key}_${(o * 100).toFixed(0)}::backdrop {
            background-color: light-dark(oklch(from var(${toProp(key)}) l c h / calc(alpha * ${o.toFixed(1)})), oklch(from var(${toProp(inverseKey)}) l c h / calc(alpha * ${o.toFixed(1)})) );
          }
        `);
	return vals.join("\n");
}).join("\n")}

  ${src.map((key) => {
	const inverseKey = getInverseKey(key);
	return `.color-c-${key} { color: light-dark(var(${toProp(key)}), var(${toProp(inverseKey)})); }`;
}).join("\n")}
  `;
const getInverseKey = (key) => {
	const match = key.match(/^([a-z]+)(\d+)$/);
	if (!match) return key;
	const [, prefix, shadeStr] = match;
	const target = 100 - parseInt(shadeStr, 10);
	return `${prefix}${shades.reduce((prev, curr) => Math.abs(curr - target) < Math.abs(prev - target) ? curr : prev)}`;
};
const keyFactory = (prefix) => {
	return shades.map((v) => `${prefix}${v}`);
};
const structuralStyles$1 = [
	behavior,
	border,
	[
		color(keyFactory("p")),
		color(keyFactory("s")),
		color(keyFactory("t")),
		color(keyFactory("n")),
		color(keyFactory("nv")),
		color(keyFactory("e")),
		`
    .color-bgc-transparent {
      background-color: transparent;
    }

    :host {
      color-scheme: var(--color-scheme);
    }
  `
	],
	`
  .g-icon {
    font-family: "Material Symbols Outlined", "Google Symbols";
    font-weight: normal;
    font-style: normal;
    font-display: optional;
    font-size: 24px;
    width: 1em;
    height: 1em;
    user-select: none;
    line-height: 1;
    letter-spacing: normal;
    text-transform: none;
    display: inline-block;
    white-space: nowrap;
    word-wrap: normal;
    direction: ltr;
    font-feature-settings: "liga";
    -webkit-font-feature-settings: "liga";
    -webkit-font-smoothing: antialiased;
    text-rendering: optimizeLegibility;
    -moz-osx-font-smoothing: grayscale;
    overflow: hidden;

    font-variation-settings: "FILL" 0, "wght" 300, "GRAD" 0, "opsz" 48,
      "ROND" 100;

    &.filled {
      font-variation-settings: "FILL" 1, "wght" 300, "GRAD" 0, "opsz" 48,
        "ROND" 100;
    }

    &.filled-heavy {
      font-variation-settings: "FILL" 1, "wght" 700, "GRAD" 0, "opsz" 48,
        "ROND" 100;
    }
  }
`,
	`
  :host {
    ${new Array(16).fill(0).map((_, idx) => {
		return `--g-${idx + 1}: ${(idx + 1) * 4}px;`;
	}).join("\n")}
  }

  ${new Array(49).fill(0).map((_, index) => {
		const idx = index - 24;
		const lbl = idx < 0 ? `n${Math.abs(idx)}` : idx.toString();
		return `
        .layout-p-${lbl} { --padding: ${idx * 4}px; padding: var(--padding); }
        .layout-pt-${lbl} { padding-top: ${idx * 4}px; }
        .layout-pr-${lbl} { padding-right: ${idx * 4}px; }
        .layout-pb-${lbl} { padding-bottom: ${idx * 4}px; }
        .layout-pl-${lbl} { padding-left: ${idx * 4}px; }

        .layout-m-${lbl} { --margin: ${idx * 4}px; margin: var(--margin); }
        .layout-mt-${lbl} { margin-top: ${idx * 4}px; }
        .layout-mr-${lbl} { margin-right: ${idx * 4}px; }
        .layout-mb-${lbl} { margin-bottom: ${idx * 4}px; }
        .layout-ml-${lbl} { margin-left: ${idx * 4}px; }

        .layout-t-${lbl} { top: ${idx * 4}px; }
        .layout-r-${lbl} { right: ${idx * 4}px; }
        .layout-b-${lbl} { bottom: ${idx * 4}px; }
        .layout-l-${lbl} { left: ${idx * 4}px; }`;
	}).join("\n")}

  ${new Array(25).fill(0).map((_, idx) => {
		return `
        .layout-g-${idx} { gap: ${idx * 4}px; }`;
	}).join("\n")}

  ${new Array(8).fill(0).map((_, idx) => {
		return `
        .layout-grd-col${idx + 1} { grid-template-columns: ${"1fr ".repeat(idx + 1).trim()}; }`;
	}).join("\n")}

  .layout-pos-a {
    position: absolute;
  }

  .layout-pos-rel {
    position: relative;
  }

  .layout-dsp-none {
    display: none;
  }

  .layout-dsp-block {
    display: block;
  }

  .layout-dsp-grid {
    display: grid;
  }

  .layout-dsp-iflex {
    display: inline-flex;
  }

  .layout-dsp-flexvert {
    display: flex;
    flex-direction: column;
  }

  .layout-dsp-flexhor {
    display: flex;
    flex-direction: row;
  }

  .layout-fw-w {
    flex-wrap: wrap;
  }

  .layout-al-fs {
    align-items: start;
  }

  .layout-al-fe {
    align-items: end;
  }

  .layout-al-c {
    align-items: center;
  }

  .layout-as-n {
    align-self: normal;
  }

  .layout-js-c {
    justify-self: center;
  }

  .layout-sp-c {
    justify-content: center;
  }

  .layout-sp-ev {
    justify-content: space-evenly;
  }

  .layout-sp-bt {
    justify-content: space-between;
  }

  .layout-sp-s {
    justify-content: start;
  }

  .layout-sp-e {
    justify-content: end;
  }

  .layout-ji-e {
    justify-items: end;
  }

  .layout-r-none {
    resize: none;
  }

  .layout-fs-c {
    field-sizing: content;
  }

  .layout-fs-n {
    field-sizing: none;
  }

  .layout-flx-0 {
    flex: 0 0 auto;
  }

  .layout-flx-1 {
    flex: 1 0 auto;
  }

  .layout-c-s {
    contain: strict;
  }

  /** Widths **/

  ${new Array(10).fill(0).map((_, idx) => {
		const weight = (idx + 1) * 10;
		return `.layout-w-${weight} { width: ${weight}%; max-width: ${weight}%; }`;
	}).join("\n")}

  ${new Array(16).fill(0).map((_, idx) => {
		return `.layout-wp-${idx} { width: ${idx * 4}px; }`;
	}).join("\n")}

  /** Heights **/

  ${new Array(10).fill(0).map((_, idx) => {
		const height = (idx + 1) * 10;
		return `.layout-h-${height} { height: ${height}%; }`;
	}).join("\n")}

  ${new Array(16).fill(0).map((_, idx) => {
		return `.layout-hp-${idx} { height: ${idx * 4}px; }`;
	}).join("\n")}

  .layout-el-cv {
    & img,
    & video {
      width: 100%;
      height: 100%;
      object-fit: cover;
      margin: 0;
    }
  }

  .layout-ar-sq {
    aspect-ratio: 1 / 1;
  }

  .layout-ex-fb {
    margin: calc(var(--padding) * -1) 0 0 calc(var(--padding) * -1);
    width: calc(100% + var(--padding) * 2);
    height: calc(100% + var(--padding) * 2);
  }
`,
	`
  ${new Array(21).fill(0).map((_, idx) => {
		return `.opacity-el-${idx * 5} { opacity: ${idx / 20}; }`;
	}).join("\n")}
`,
	`
  :host {
    --default-font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
    --default-font-family-mono: "Courier New", Courier, monospace;
  }

  .typography-f-s {
    font-family: var(--font-family, var(--default-font-family));
    font-optical-sizing: auto;
    font-variation-settings: "slnt" 0, "wdth" 100, "GRAD" 0;
  }

  .typography-f-sf {
    font-family: var(--font-family-flex, var(--default-font-family));
    font-optical-sizing: auto;
  }

  .typography-f-c {
    font-family: var(--font-family-mono, var(--default-font-family));
    font-optical-sizing: auto;
    font-variation-settings: "slnt" 0, "wdth" 100, "GRAD" 0;
  }

  .typography-v-r {
    font-variation-settings: "slnt" 0, "wdth" 100, "GRAD" 0, "ROND" 100;
  }

  .typography-ta-s {
    text-align: start;
  }

  .typography-ta-c {
    text-align: center;
  }

  .typography-fs-n {
    font-style: normal;
  }

  .typography-fs-i {
    font-style: italic;
  }

  .typography-sz-ls {
    font-size: 11px;
    line-height: 16px;
  }

  .typography-sz-lm {
    font-size: 12px;
    line-height: 16px;
  }

  .typography-sz-ll {
    font-size: 14px;
    line-height: 20px;
  }

  .typography-sz-bs {
    font-size: 12px;
    line-height: 16px;
  }

  .typography-sz-bm {
    font-size: 14px;
    line-height: 20px;
  }

  .typography-sz-bl {
    font-size: 16px;
    line-height: 24px;
  }

  .typography-sz-ts {
    font-size: 14px;
    line-height: 20px;
  }

  .typography-sz-tm {
    font-size: 16px;
    line-height: 24px;
  }

  .typography-sz-tl {
    font-size: 22px;
    line-height: 28px;
  }

  .typography-sz-hs {
    font-size: 24px;
    line-height: 32px;
  }

  .typography-sz-hm {
    font-size: 28px;
    line-height: 36px;
  }

  .typography-sz-hl {
    font-size: 32px;
    line-height: 40px;
  }

  .typography-sz-ds {
    font-size: 36px;
    line-height: 44px;
  }

  .typography-sz-dm {
    font-size: 45px;
    line-height: 52px;
  }

  .typography-sz-dl {
    font-size: 57px;
    line-height: 64px;
  }

  .typography-ws-p {
    white-space: pre-line;
  }

  .typography-ws-nw {
    white-space: nowrap;
  }

  .typography-td-none {
    text-decoration: none;
  }

  /** Weights **/

  ${new Array(9).fill(0).map((_, idx) => {
		const weight = (idx + 1) * 100;
		return `.typography-w-${weight} { font-weight: ${weight}; }`;
	}).join("\n")}
`
].flat(Infinity).join("\n");
var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, {
	enumerable: true,
	configurable: true,
	writable: true,
	value
}) : obj[key] = value;
var __publicField = (obj, key, value) => {
	__defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
	return value;
};
var __accessCheck = (obj, member, msg) => {
	if (!member.has(obj)) throw TypeError("Cannot " + msg);
};
var __privateIn = (member, obj) => {
	if (Object(obj) !== obj) throw TypeError("Cannot use the \"in\" operator on this value");
	return member.has(obj);
};
var __privateAdd = (obj, member, value) => {
	if (member.has(obj)) throw TypeError("Cannot add the same private member more than once");
	member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
};
var __privateMethod = (obj, member, method) => {
	__accessCheck(obj, member, "access private method");
	return method;
};
/**
* @license
* Copyright Google LLC All Rights Reserved.
*
* Use of this source code is governed by an MIT-style license that can be
* found in the LICENSE file at https://angular.io/license
*/
function defaultEquals(a, b) {
	return Object.is(a, b);
}
/**
* @license
* Copyright Google LLC All Rights Reserved.
*
* Use of this source code is governed by an MIT-style license that can be
* found in the LICENSE file at https://angular.io/license
*/
let activeConsumer = null;
let inNotificationPhase = false;
let epoch = 1;
const SIGNAL = /* @__PURE__ */ Symbol("SIGNAL");
function setActiveConsumer(consumer) {
	const prev = activeConsumer;
	activeConsumer = consumer;
	return prev;
}
function getActiveConsumer() {
	return activeConsumer;
}
function isInNotificationPhase() {
	return inNotificationPhase;
}
const REACTIVE_NODE = {
	version: 0,
	lastCleanEpoch: 0,
	dirty: false,
	producerNode: void 0,
	producerLastReadVersion: void 0,
	producerIndexOfThis: void 0,
	nextProducerIndex: 0,
	liveConsumerNode: void 0,
	liveConsumerIndexOfThis: void 0,
	consumerAllowSignalWrites: false,
	consumerIsAlwaysLive: false,
	producerMustRecompute: () => false,
	producerRecomputeValue: () => {},
	consumerMarkedDirty: () => {},
	consumerOnSignalRead: () => {}
};
function producerAccessed(node) {
	if (inNotificationPhase) throw new Error(typeof ngDevMode !== "undefined" && ngDevMode ? `Assertion error: signal read during notification phase` : "");
	if (activeConsumer === null) return;
	activeConsumer.consumerOnSignalRead(node);
	const idx = activeConsumer.nextProducerIndex++;
	assertConsumerNode(activeConsumer);
	if (idx < activeConsumer.producerNode.length && activeConsumer.producerNode[idx] !== node) {
		if (consumerIsLive(activeConsumer)) {
			const staleProducer = activeConsumer.producerNode[idx];
			producerRemoveLiveConsumerAtIndex(staleProducer, activeConsumer.producerIndexOfThis[idx]);
		}
	}
	if (activeConsumer.producerNode[idx] !== node) {
		activeConsumer.producerNode[idx] = node;
		activeConsumer.producerIndexOfThis[idx] = consumerIsLive(activeConsumer) ? producerAddLiveConsumer(node, activeConsumer, idx) : 0;
	}
	activeConsumer.producerLastReadVersion[idx] = node.version;
}
function producerIncrementEpoch() {
	epoch++;
}
function producerUpdateValueVersion(node) {
	if (!node.dirty && node.lastCleanEpoch === epoch) return;
	if (!node.producerMustRecompute(node) && !consumerPollProducersForChange(node)) {
		node.dirty = false;
		node.lastCleanEpoch = epoch;
		return;
	}
	node.producerRecomputeValue(node);
	node.dirty = false;
	node.lastCleanEpoch = epoch;
}
function producerNotifyConsumers(node) {
	if (node.liveConsumerNode === void 0) return;
	const prev = inNotificationPhase;
	inNotificationPhase = true;
	try {
		for (const consumer of node.liveConsumerNode) if (!consumer.dirty) consumerMarkDirty(consumer);
	} finally {
		inNotificationPhase = prev;
	}
}
function producerUpdatesAllowed() {
	return (activeConsumer == null ? void 0 : activeConsumer.consumerAllowSignalWrites) !== false;
}
function consumerMarkDirty(node) {
	var _a;
	node.dirty = true;
	producerNotifyConsumers(node);
	(_a = node.consumerMarkedDirty) == null || _a.call(node.wrapper ?? node);
}
function consumerBeforeComputation(node) {
	node && (node.nextProducerIndex = 0);
	return setActiveConsumer(node);
}
function consumerAfterComputation(node, prevConsumer) {
	setActiveConsumer(prevConsumer);
	if (!node || node.producerNode === void 0 || node.producerIndexOfThis === void 0 || node.producerLastReadVersion === void 0) return;
	if (consumerIsLive(node)) for (let i = node.nextProducerIndex; i < node.producerNode.length; i++) producerRemoveLiveConsumerAtIndex(node.producerNode[i], node.producerIndexOfThis[i]);
	while (node.producerNode.length > node.nextProducerIndex) {
		node.producerNode.pop();
		node.producerLastReadVersion.pop();
		node.producerIndexOfThis.pop();
	}
}
function consumerPollProducersForChange(node) {
	assertConsumerNode(node);
	for (let i = 0; i < node.producerNode.length; i++) {
		const producer = node.producerNode[i];
		const seenVersion = node.producerLastReadVersion[i];
		if (seenVersion !== producer.version) return true;
		producerUpdateValueVersion(producer);
		if (seenVersion !== producer.version) return true;
	}
	return false;
}
function producerAddLiveConsumer(node, consumer, indexOfThis) {
	var _a;
	assertProducerNode(node);
	assertConsumerNode(node);
	if (node.liveConsumerNode.length === 0) {
		(_a = node.watched) == null || _a.call(node.wrapper);
		for (let i = 0; i < node.producerNode.length; i++) node.producerIndexOfThis[i] = producerAddLiveConsumer(node.producerNode[i], node, i);
	}
	node.liveConsumerIndexOfThis.push(indexOfThis);
	return node.liveConsumerNode.push(consumer) - 1;
}
function producerRemoveLiveConsumerAtIndex(node, idx) {
	var _a;
	assertProducerNode(node);
	assertConsumerNode(node);
	if (typeof ngDevMode !== "undefined" && ngDevMode && idx >= node.liveConsumerNode.length) throw new Error(`Assertion error: active consumer index ${idx} is out of bounds of ${node.liveConsumerNode.length} consumers)`);
	if (node.liveConsumerNode.length === 1) {
		(_a = node.unwatched) == null || _a.call(node.wrapper);
		for (let i = 0; i < node.producerNode.length; i++) producerRemoveLiveConsumerAtIndex(node.producerNode[i], node.producerIndexOfThis[i]);
	}
	const lastIdx = node.liveConsumerNode.length - 1;
	node.liveConsumerNode[idx] = node.liveConsumerNode[lastIdx];
	node.liveConsumerIndexOfThis[idx] = node.liveConsumerIndexOfThis[lastIdx];
	node.liveConsumerNode.length--;
	node.liveConsumerIndexOfThis.length--;
	if (idx < node.liveConsumerNode.length) {
		const idxProducer = node.liveConsumerIndexOfThis[idx];
		const consumer = node.liveConsumerNode[idx];
		assertConsumerNode(consumer);
		consumer.producerIndexOfThis[idxProducer] = idx;
	}
}
function consumerIsLive(node) {
	var _a;
	return node.consumerIsAlwaysLive || (((_a = node == null ? void 0 : node.liveConsumerNode) == null ? void 0 : _a.length) ?? 0) > 0;
}
function assertConsumerNode(node) {
	node.producerNode ?? (node.producerNode = []);
	node.producerIndexOfThis ?? (node.producerIndexOfThis = []);
	node.producerLastReadVersion ?? (node.producerLastReadVersion = []);
}
function assertProducerNode(node) {
	node.liveConsumerNode ?? (node.liveConsumerNode = []);
	node.liveConsumerIndexOfThis ?? (node.liveConsumerIndexOfThis = []);
}
/**
* @license
* Copyright Google LLC All Rights Reserved.
*
* Use of this source code is governed by an MIT-style license that can be
* found in the LICENSE file at https://angular.io/license
*/
function computedGet(node) {
	producerUpdateValueVersion(node);
	producerAccessed(node);
	if (node.value === ERRORED) throw node.error;
	return node.value;
}
function createComputed(computation) {
	const node = Object.create(COMPUTED_NODE);
	node.computation = computation;
	const computed = () => computedGet(node);
	computed[SIGNAL] = node;
	return computed;
}
const UNSET = /* @__PURE__ */ Symbol("UNSET");
const COMPUTING = /* @__PURE__ */ Symbol("COMPUTING");
const ERRORED = /* @__PURE__ */ Symbol("ERRORED");
const COMPUTED_NODE = /* @__PURE__ */ (() => {
	return {
		...REACTIVE_NODE,
		value: UNSET,
		dirty: true,
		error: null,
		equal: defaultEquals,
		producerMustRecompute(node) {
			return node.value === UNSET || node.value === COMPUTING;
		},
		producerRecomputeValue(node) {
			if (node.value === COMPUTING) throw new Error("Detected cycle in computations.");
			const oldValue = node.value;
			node.value = COMPUTING;
			const prevConsumer = consumerBeforeComputation(node);
			let newValue;
			let wasEqual = false;
			try {
				newValue = node.computation.call(node.wrapper);
				wasEqual = oldValue !== UNSET && oldValue !== ERRORED && node.equal.call(node.wrapper, oldValue, newValue);
			} catch (err) {
				newValue = ERRORED;
				node.error = err;
			} finally {
				consumerAfterComputation(node, prevConsumer);
			}
			if (wasEqual) {
				node.value = oldValue;
				return;
			}
			node.value = newValue;
			node.version++;
		}
	};
})();
/**
* @license
* Copyright Google LLC All Rights Reserved.
*
* Use of this source code is governed by an MIT-style license that can be
* found in the LICENSE file at https://angular.io/license
*/
function defaultThrowError() {
	throw new Error();
}
let throwInvalidWriteToSignalErrorFn = defaultThrowError;
function throwInvalidWriteToSignalError() {
	throwInvalidWriteToSignalErrorFn();
}
/**
* @license
* Copyright Google LLC All Rights Reserved.
*
* Use of this source code is governed by an MIT-style license that can be
* found in the LICENSE file at https://angular.io/license
*/
function createSignal(initialValue) {
	const node = Object.create(SIGNAL_NODE);
	node.value = initialValue;
	const getter = () => {
		producerAccessed(node);
		return node.value;
	};
	getter[SIGNAL] = node;
	return getter;
}
function signalGetFn() {
	producerAccessed(this);
	return this.value;
}
function signalSetFn(node, newValue) {
	if (!producerUpdatesAllowed()) throwInvalidWriteToSignalError();
	if (!node.equal.call(node.wrapper, node.value, newValue)) {
		node.value = newValue;
		signalValueChanged(node);
	}
}
const SIGNAL_NODE = /* @__PURE__ */ (() => {
	return {
		...REACTIVE_NODE,
		equal: defaultEquals,
		value: void 0
	};
})();
function signalValueChanged(node) {
	node.version++;
	producerIncrementEpoch();
	producerNotifyConsumers(node);
}
/**
* @license
* Copyright 2024 Bloomberg Finance L.P.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*     http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
const NODE = Symbol("node");
var Signal;
((Signal2) => {
	var _a, _brand, _b, _brand2;
	class State {
		constructor(initialValue, options = {}) {
			__privateAdd(this, _brand);
			__publicField(this, _a);
			const node = createSignal(initialValue)[SIGNAL];
			this[NODE] = node;
			node.wrapper = this;
			if (options) {
				const equals = options.equals;
				if (equals) node.equal = equals;
				node.watched = options[Signal2.subtle.watched];
				node.unwatched = options[Signal2.subtle.unwatched];
			}
		}
		get() {
			if (!(0, Signal2.isState)(this)) throw new TypeError("Wrong receiver type for Signal.State.prototype.get");
			return signalGetFn.call(this[NODE]);
		}
		set(newValue) {
			if (!(0, Signal2.isState)(this)) throw new TypeError("Wrong receiver type for Signal.State.prototype.set");
			if (isInNotificationPhase()) throw new Error("Writes to signals not permitted during Watcher callback");
			const ref = this[NODE];
			signalSetFn(ref, newValue);
		}
	}
	_a = NODE;
	_brand = /* @__PURE__ */ new WeakSet();
	Signal2.isState = (s) => typeof s === "object" && __privateIn(_brand, s);
	Signal2.State = State;
	class Computed {
		constructor(computation, options) {
			__privateAdd(this, _brand2);
			__publicField(this, _b);
			const node = createComputed(computation)[SIGNAL];
			node.consumerAllowSignalWrites = true;
			this[NODE] = node;
			node.wrapper = this;
			if (options) {
				const equals = options.equals;
				if (equals) node.equal = equals;
				node.watched = options[Signal2.subtle.watched];
				node.unwatched = options[Signal2.subtle.unwatched];
			}
		}
		get() {
			if (!(0, Signal2.isComputed)(this)) throw new TypeError("Wrong receiver type for Signal.Computed.prototype.get");
			return computedGet(this[NODE]);
		}
	}
	_b = NODE;
	_brand2 = /* @__PURE__ */ new WeakSet();
	Signal2.isComputed = (c) => typeof c === "object" && __privateIn(_brand2, c);
	Signal2.Computed = Computed;
	((subtle2) => {
		var _a2, _brand3, _assertSignals, assertSignals_fn;
		function untrack(cb) {
			let output;
			let prevActiveConsumer = null;
			try {
				prevActiveConsumer = setActiveConsumer(null);
				output = cb();
			} finally {
				setActiveConsumer(prevActiveConsumer);
			}
			return output;
		}
		subtle2.untrack = untrack;
		function introspectSources(sink) {
			var _a3;
			if (!(0, Signal2.isComputed)(sink) && !(0, Signal2.isWatcher)(sink)) throw new TypeError("Called introspectSources without a Computed or Watcher argument");
			return ((_a3 = sink[NODE].producerNode) == null ? void 0 : _a3.map((n) => n.wrapper)) ?? [];
		}
		subtle2.introspectSources = introspectSources;
		function introspectSinks(signal) {
			var _a3;
			if (!(0, Signal2.isComputed)(signal) && !(0, Signal2.isState)(signal)) throw new TypeError("Called introspectSinks without a Signal argument");
			return ((_a3 = signal[NODE].liveConsumerNode) == null ? void 0 : _a3.map((n) => n.wrapper)) ?? [];
		}
		subtle2.introspectSinks = introspectSinks;
		function hasSinks(signal) {
			if (!(0, Signal2.isComputed)(signal) && !(0, Signal2.isState)(signal)) throw new TypeError("Called hasSinks without a Signal argument");
			const liveConsumerNode = signal[NODE].liveConsumerNode;
			if (!liveConsumerNode) return false;
			return liveConsumerNode.length > 0;
		}
		subtle2.hasSinks = hasSinks;
		function hasSources(signal) {
			if (!(0, Signal2.isComputed)(signal) && !(0, Signal2.isWatcher)(signal)) throw new TypeError("Called hasSources without a Computed or Watcher argument");
			const producerNode = signal[NODE].producerNode;
			if (!producerNode) return false;
			return producerNode.length > 0;
		}
		subtle2.hasSources = hasSources;
		class Watcher {
			constructor(notify) {
				__privateAdd(this, _brand3);
				__privateAdd(this, _assertSignals);
				__publicField(this, _a2);
				let node = Object.create(REACTIVE_NODE);
				node.wrapper = this;
				node.consumerMarkedDirty = notify;
				node.consumerIsAlwaysLive = true;
				node.consumerAllowSignalWrites = false;
				node.producerNode = [];
				this[NODE] = node;
			}
			watch(...signals) {
				if (!(0, Signal2.isWatcher)(this)) throw new TypeError("Called unwatch without Watcher receiver");
				__privateMethod(this, _assertSignals, assertSignals_fn).call(this, signals);
				const node = this[NODE];
				node.dirty = false;
				const prev = setActiveConsumer(node);
				for (const signal of signals) producerAccessed(signal[NODE]);
				setActiveConsumer(prev);
			}
			unwatch(...signals) {
				if (!(0, Signal2.isWatcher)(this)) throw new TypeError("Called unwatch without Watcher receiver");
				__privateMethod(this, _assertSignals, assertSignals_fn).call(this, signals);
				const node = this[NODE];
				assertConsumerNode(node);
				for (let i = node.producerNode.length - 1; i >= 0; i--) if (signals.includes(node.producerNode[i].wrapper)) {
					producerRemoveLiveConsumerAtIndex(node.producerNode[i], node.producerIndexOfThis[i]);
					const lastIdx = node.producerNode.length - 1;
					node.producerNode[i] = node.producerNode[lastIdx];
					node.producerIndexOfThis[i] = node.producerIndexOfThis[lastIdx];
					node.producerNode.length--;
					node.producerIndexOfThis.length--;
					node.nextProducerIndex--;
					if (i < node.producerNode.length) {
						const idxConsumer = node.producerIndexOfThis[i];
						const producer = node.producerNode[i];
						assertProducerNode(producer);
						producer.liveConsumerIndexOfThis[idxConsumer] = i;
					}
				}
			}
			getPending() {
				if (!(0, Signal2.isWatcher)(this)) throw new TypeError("Called getPending without Watcher receiver");
				return this[NODE].producerNode.filter((n) => n.dirty).map((n) => n.wrapper);
			}
		}
		_a2 = NODE;
		_brand3 = /* @__PURE__ */ new WeakSet();
		_assertSignals = /* @__PURE__ */ new WeakSet();
		assertSignals_fn = function(signals) {
			for (const signal of signals) if (!(0, Signal2.isComputed)(signal) && !(0, Signal2.isState)(signal)) throw new TypeError("Called watch/unwatch without a Computed or State argument");
		};
		Signal2.isWatcher = (w) => __privateIn(_brand3, w);
		subtle2.Watcher = Watcher;
		function currentComputed() {
			var _a3;
			return (_a3 = getActiveConsumer()) == null ? void 0 : _a3.wrapper;
		}
		subtle2.currentComputed = currentComputed;
		subtle2.watched = Symbol("watched");
		subtle2.unwatched = Symbol("unwatched");
	})(Signal2.subtle || (Signal2.subtle = {}));
})(Signal || (Signal = {}));
/**
* equality check here is always false so that we can dirty the storage
* via setting to _anything_
*
*
* This is for a pattern where we don't *directly* use signals to back the values used in collections
* so that instanceof checks and getters and other native features "just work" without having
* to do nested proxying.
*
* (though, see deep.ts for nested / deep behavior)
*/
const createStorage = (initial = null) => new Signal.State(initial, { equals: () => false });
const ARRAY_GETTER_METHODS = /* @__PURE__ */ new Set([
	Symbol.iterator,
	"concat",
	"entries",
	"every",
	"filter",
	"find",
	"findIndex",
	"flat",
	"flatMap",
	"forEach",
	"includes",
	"indexOf",
	"join",
	"keys",
	"lastIndexOf",
	"map",
	"reduce",
	"reduceRight",
	"slice",
	"some",
	"values"
]);
const ARRAY_WRITE_THEN_READ_METHODS = /* @__PURE__ */ new Set([
	"fill",
	"push",
	"unshift"
]);
function convertToInt(prop) {
	if (typeof prop === "symbol") return null;
	const num = Number(prop);
	if (isNaN(num)) return null;
	return num % 1 === 0 ? num : null;
}
var SignalArray = class SignalArray {
	/**
	* Creates an array from an iterable object.
	* @param iterable An iterable object to convert to an array.
	*/
	/**
	* Creates an array from an iterable object.
	* @param iterable An iterable object to convert to an array.
	* @param mapfn A mapping function to call on every element of the array.
	* @param thisArg Value of 'this' used to invoke the mapfn.
	*/
	static from(iterable, mapfn, thisArg) {
		return mapfn ? new SignalArray(Array.from(iterable, mapfn, thisArg)) : new SignalArray(Array.from(iterable));
	}
	static of(...arr) {
		return new SignalArray(arr);
	}
	constructor(arr = []) {
		let clone = arr.slice();
		let self = this;
		let boundFns = /* @__PURE__ */ new Map();
		/**
		Flag to track whether we have *just* intercepted a call to `.push()` or
		`.unshift()`, since in those cases (and only those cases!) the `Array`
		itself checks `.length` to return from the function call.
		*/
		let nativelyAccessingLengthFromPushOrUnshift = false;
		return new Proxy(clone, {
			get(target, prop) {
				let index = convertToInt(prop);
				if (index !== null) {
					self.#readStorageFor(index);
					self.#collection.get();
					return target[index];
				}
				if (prop === "length") {
					if (nativelyAccessingLengthFromPushOrUnshift) nativelyAccessingLengthFromPushOrUnshift = false;
					else self.#collection.get();
					return target[prop];
				}
				if (ARRAY_WRITE_THEN_READ_METHODS.has(prop)) nativelyAccessingLengthFromPushOrUnshift = true;
				if (ARRAY_GETTER_METHODS.has(prop)) {
					let fn = boundFns.get(prop);
					if (fn === void 0) {
						fn = (...args) => {
							self.#collection.get();
							return target[prop](...args);
						};
						boundFns.set(prop, fn);
					}
					return fn;
				}
				return target[prop];
			},
			set(target, prop, value) {
				target[prop] = value;
				let index = convertToInt(prop);
				if (index !== null) {
					self.#dirtyStorageFor(index);
					self.#collection.set(null);
				} else if (prop === "length") self.#collection.set(null);
				return true;
			},
			getPrototypeOf() {
				return SignalArray.prototype;
			}
		});
	}
	#collection = createStorage();
	#storages = /* @__PURE__ */ new Map();
	#readStorageFor(index) {
		let storage = this.#storages.get(index);
		if (storage === void 0) {
			storage = createStorage();
			this.#storages.set(index, storage);
		}
		storage.get();
	}
	#dirtyStorageFor(index) {
		const storage = this.#storages.get(index);
		if (storage) storage.set(null);
	}
};
Object.setPrototypeOf(SignalArray.prototype, Array.prototype);
var SignalMap = class {
	collection = createStorage();
	storages = /* @__PURE__ */ new Map();
	vals;
	readStorageFor(key) {
		const { storages } = this;
		let storage = storages.get(key);
		if (storage === void 0) {
			storage = createStorage();
			storages.set(key, storage);
		}
		storage.get();
	}
	dirtyStorageFor(key) {
		const storage = this.storages.get(key);
		if (storage) storage.set(null);
	}
	constructor(existing) {
		this.vals = existing ? new Map(existing) : /* @__PURE__ */ new Map();
	}
	get(key) {
		this.readStorageFor(key);
		return this.vals.get(key);
	}
	has(key) {
		this.readStorageFor(key);
		return this.vals.has(key);
	}
	entries() {
		this.collection.get();
		return this.vals.entries();
	}
	keys() {
		this.collection.get();
		return this.vals.keys();
	}
	values() {
		this.collection.get();
		return this.vals.values();
	}
	forEach(fn) {
		this.collection.get();
		this.vals.forEach(fn);
	}
	get size() {
		this.collection.get();
		return this.vals.size;
	}
	[Symbol.iterator]() {
		this.collection.get();
		return this.vals[Symbol.iterator]();
	}
	get [Symbol.toStringTag]() {
		return this.vals[Symbol.toStringTag];
	}
	set(key, value) {
		this.dirtyStorageFor(key);
		this.collection.set(null);
		this.vals.set(key, value);
		return this;
	}
	delete(key) {
		this.dirtyStorageFor(key);
		this.collection.set(null);
		return this.vals.delete(key);
	}
	clear() {
		this.storages.forEach((s) => s.set(null));
		this.collection.set(null);
		this.vals.clear();
	}
};
Object.setPrototypeOf(SignalMap.prototype, Map.prototype);
/**
* Create a reactive Object, backed by Signals, using a Proxy.
* This allows dynamic creation and deletion of signals using the object primitive
* APIs that most folks are familiar with -- the only difference is instantiation.
* ```js
* const obj = new SignalObject({ foo: 123 });
*
* obj.foo // 123
* obj.foo = 456
* obj.foo // 456
* obj.bar = 2
* obj.bar // 2
* ```
*/
const SignalObject = class SignalObjectImpl {
	static fromEntries(entries) {
		return new SignalObjectImpl(Object.fromEntries(entries));
	}
	#storages = /* @__PURE__ */ new Map();
	#collection = createStorage();
	constructor(obj = {}) {
		let proto = Object.getPrototypeOf(obj);
		let descs = Object.getOwnPropertyDescriptors(obj);
		let clone = Object.create(proto);
		for (let prop in descs) Object.defineProperty(clone, prop, descs[prop]);
		let self = this;
		return new Proxy(clone, {
			get(target, prop, receiver) {
				self.#readStorageFor(prop);
				return Reflect.get(target, prop, receiver);
			},
			has(target, prop) {
				self.#readStorageFor(prop);
				return prop in target;
			},
			ownKeys(target) {
				self.#collection.get();
				return Reflect.ownKeys(target);
			},
			set(target, prop, value, receiver) {
				let result = Reflect.set(target, prop, value, receiver);
				self.#dirtyStorageFor(prop);
				self.#dirtyCollection();
				return result;
			},
			deleteProperty(target, prop) {
				if (prop in target) {
					delete target[prop];
					self.#dirtyStorageFor(prop);
					self.#dirtyCollection();
				}
				return true;
			},
			getPrototypeOf() {
				return SignalObjectImpl.prototype;
			}
		});
	}
	#readStorageFor(key) {
		let storage = this.#storages.get(key);
		if (storage === void 0) {
			storage = createStorage();
			this.#storages.set(key, storage);
		}
		storage.get();
	}
	#dirtyStorageFor(key) {
		const storage = this.#storages.get(key);
		if (storage) storage.set(null);
	}
	#dirtyCollection() {
		this.#collection.set(null);
	}
};
var SignalSet = class {
	collection = createStorage();
	storages = /* @__PURE__ */ new Map();
	vals;
	storageFor(key) {
		const storages = this.storages;
		let storage = storages.get(key);
		if (storage === void 0) {
			storage = createStorage();
			storages.set(key, storage);
		}
		return storage;
	}
	dirtyStorageFor(key) {
		const storage = this.storages.get(key);
		if (storage) storage.set(null);
	}
	constructor(existing) {
		this.vals = new Set(existing);
	}
	has(value) {
		this.storageFor(value).get();
		return this.vals.has(value);
	}
	entries() {
		this.collection.get();
		return this.vals.entries();
	}
	keys() {
		this.collection.get();
		return this.vals.keys();
	}
	values() {
		this.collection.get();
		return this.vals.values();
	}
	forEach(fn) {
		this.collection.get();
		this.vals.forEach(fn);
	}
	get size() {
		this.collection.get();
		return this.vals.size;
	}
	[Symbol.iterator]() {
		this.collection.get();
		return this.vals[Symbol.iterator]();
	}
	get [Symbol.toStringTag]() {
		return this.vals[Symbol.toStringTag];
	}
	add(value) {
		this.dirtyStorageFor(value);
		this.collection.set(null);
		this.vals.add(value);
		return this;
	}
	delete(value) {
		this.dirtyStorageFor(value);
		this.collection.set(null);
		return this.vals.delete(value);
	}
	clear() {
		this.storages.forEach((s) => s.set(null));
		this.collection.set(null);
		this.vals.clear();
	}
};
Object.setPrototypeOf(SignalSet.prototype, Set.prototype);
const isAndroid$1 = /Android/i.test(globalThis.navigator?.userAgent ?? "");
const statusBlur = isAndroid$1 ? "10px" : "14px";
const statusShadow = isAndroid$1 ? "0 2px 10px rgba(0, 0, 0, 0.18)" : "0 10px 24px rgba(0, 0, 0, 0.25)";
const hostStyles = `
    openclaw-a2ui-host {
      display: block;
      height: 100%;
      position: relative;
      box-sizing: border-box;
      padding: var(--openclaw-a2ui-inset-top, 0px) var(--openclaw-a2ui-inset-right, 0px)
        var(--openclaw-a2ui-inset-bottom, 0px) var(--openclaw-a2ui-inset-left, 0px);
    }

    openclaw-a2ui-host #surfaces {
      display: grid;
      grid-template-columns: 1fr;
      gap: 12px;
      height: 100%;
      overflow: auto;
      padding-bottom: var(--openclaw-a2ui-scroll-pad-bottom, 0px);
    }

    openclaw-a2ui-host .status {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      top: var(--openclaw-a2ui-status-top, 12px);
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 8px 10px;
      border-radius: 12px;
      background: rgba(0, 0, 0, 0.45);
      border: 1px solid rgba(255, 255, 255, 0.18);
      color: rgba(255, 255, 255, 0.92);
      font:
        13px/1.2 system-ui,
        -apple-system,
        BlinkMacSystemFont,
        "Roboto",
        sans-serif;
      pointer-events: none;
      backdrop-filter: blur(${statusBlur});
      -webkit-backdrop-filter: blur(${statusBlur});
      box-shadow: ${statusShadow};
      z-index: 5;
    }

    openclaw-a2ui-host .toast {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      bottom: var(--openclaw-a2ui-toast-bottom, 12px);
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 8px 10px;
      border-radius: 12px;
      background: rgba(0, 0, 0, 0.45);
      border: 1px solid rgba(255, 255, 255, 0.18);
      color: rgba(255, 255, 255, 0.92);
      font:
        13px/1.2 system-ui,
        -apple-system,
        BlinkMacSystemFont,
        "Roboto",
        sans-serif;
      pointer-events: none;
      backdrop-filter: blur(${statusBlur});
      -webkit-backdrop-filter: blur(${statusBlur});
      box-shadow: ${statusShadow};
      z-index: 5;
    }

    openclaw-a2ui-host .toast.error {
      border-color: rgba(255, 109, 109, 0.35);
      color: rgba(255, 223, 223, 0.98);
    }

    openclaw-a2ui-host .empty {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      top: var(--openclaw-a2ui-empty-top, var(--openclaw-a2ui-status-top, 12px));
      text-align: center;
      opacity: 0.8;
      padding: 10px 12px;
      pointer-events: none;
    }

    openclaw-a2ui-host .empty-title {
      font-weight: 700;
      margin-bottom: 6px;
    }

    openclaw-a2ui-host .spinner {
      width: 12px;
      height: 12px;
      border-radius: 999px;
      border: 2px solid rgba(255, 255, 255, 0.25);
      border-top-color: rgba(255, 255, 255, 0.92);
      animation: spin 0.75s linear infinite;
    }

    @keyframes spin {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
      }
    }
  `;
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
/**
* @license
* Copyright 2019 Google LLC
* SPDX-License-Identifier: BSD-3-Clause
*/
const t$7 = globalThis;
const e$13 = t$7.ShadowRoot && (void 0 === t$7.ShadyCSS || t$7.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype;
const s$9 = Symbol();
const o$14 = /* @__PURE__ */ new WeakMap();
var n$13 = class {
	constructor(t, e, o) {
		if (this._$cssResult$ = !0, o !== s$9) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
		this.cssText = t, this.t = e;
	}
	get styleSheet() {
		let t = this.o;
		const s = this.t;
		if (e$13 && void 0 === t) {
			const e = void 0 !== s && 1 === s.length;
			e && (t = o$14.get(s)), void 0 === t && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), e && o$14.set(s, t));
		}
		return t;
	}
	toString() {
		return this.cssText;
	}
};
const r$11 = (t) => new n$13("string" == typeof t ? t : t + "", void 0, s$9);
const i$10 = (t, ...e) => {
	return new n$13(1 === t.length ? t[0] : e.reduce((e, s, o) => e + ((t) => {
		if (!0 === t._$cssResult$) return t.cssText;
		if ("number" == typeof t) return t;
		throw Error("Value passed to 'css' function must be a 'css' function result: " + t + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
	})(s) + t[o + 1], t[0]), t, s$9);
};
const S$1 = (s, o) => {
	if (e$13) s.adoptedStyleSheets = o.map((t) => t instanceof CSSStyleSheet ? t : t.styleSheet);
	else for (const e of o) {
		const o = document.createElement("style"), n = t$7.litNonce;
		void 0 !== n && o.setAttribute("nonce", n), o.textContent = e.cssText, s.appendChild(o);
	}
};
const c$7 = e$13 ? (t) => t : (t) => t instanceof CSSStyleSheet ? ((t) => {
	let e = "";
	for (const s of t.cssRules) e += s.cssText;
	return r$11(e);
})(t) : t;
/**
* @license
* Copyright 2017 Google LLC
* SPDX-License-Identifier: BSD-3-Clause
*/ const { is: i$9, defineProperty: e$12, getOwnPropertyDescriptor: h$7, getOwnPropertyNames: r$10, getOwnPropertySymbols: o$13, getPrototypeOf: n$12 } = Object, a$1 = globalThis, c$6 = a$1.trustedTypes, l$4 = c$6 ? c$6.emptyScript : "", p$2 = a$1.reactiveElementPolyfillSupport, d$2 = (t, s) => t, u$3 = {
	toAttribute(t, s) {
		switch (s) {
			case Boolean:
				t = t ? l$4 : null;
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
}, f$3 = (t, s) => !i$9(t, s), b$1 = {
	attribute: !0,
	type: String,
	converter: u$3,
	reflect: !1,
	useDefault: !1,
	hasChanged: f$3
};
Symbol.metadata ??= Symbol("metadata"), a$1.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
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
			void 0 !== h && e$12(this.prototype, t, h);
		}
	}
	static getPropertyDescriptor(t, s, i) {
		const { get: e, set: r } = h$7(this.prototype, t) ?? {
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
		const t = n$12(this);
		t.finalize(), void 0 !== t.l && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
	}
	static finalize() {
		if (this.hasOwnProperty(d$2("finalized"))) return;
		if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(d$2("properties"))) {
			const t = this.properties, s = [...r$10(t), ...o$13(t)];
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
			const h = (void 0 !== i.converter?.toAttribute ? i.converter : u$3).toAttribute(s, i.type);
			this._$Em = t, null == h ? this.removeAttribute(e) : this.setAttribute(e, h), this._$Em = null;
		}
	}
	_$AK(t, s) {
		const i = this.constructor, e = i._$Eh.get(t);
		if (void 0 !== e && this._$Em !== e) {
			const t = i.getPropertyOptions(e), h = "function" == typeof t.converter ? { fromAttribute: t.converter } : void 0 !== t.converter?.fromAttribute ? t.converter : u$3;
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
y$1.elementStyles = [], y$1.shadowRootOptions = { mode: "open" }, y$1[d$2("elementProperties")] = /* @__PURE__ */ new Map(), y$1[d$2("finalized")] = /* @__PURE__ */ new Map(), p$2?.({ ReactiveElement: y$1 }), (a$1.reactiveElementVersions ??= []).push("2.1.2");
/**
* @license
* Copyright 2017 Google LLC
* SPDX-License-Identifier: BSD-3-Clause
*/
const t$6 = globalThis;
const i$8 = (t) => t;
const s$8 = t$6.trustedTypes;
const e$11 = s$8 ? s$8.createPolicy("lit-html", { createHTML: (t) => t }) : void 0;
const h$6 = "$lit$";
const o$12 = `lit$${Math.random().toFixed(9).slice(2)}$`;
const n$11 = "?" + o$12;
const r$9 = `<${n$11}>`;
const l$3 = document;
const c$5 = () => l$3.createComment("");
const a = (t) => null === t || "object" != typeof t && "function" != typeof t;
const u$2 = Array.isArray;
const d$1 = (t) => u$2(t) || "function" == typeof t?.[Symbol.iterator];
const f$2 = "[ 	\n\f\r]";
const v$1 = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g;
const _ = /-->/g;
const m$3 = />/g;
const p$1 = RegExp(`>|${f$2}(?:([^\\s"'>=/]+)(${f$2}*=${f$2}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`, "g");
const g = /'/g;
const $ = /"/g;
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
const P = l$3.createTreeWalker(l$3, 129);
function V(t, i) {
	if (!u$2(t) || !t.hasOwnProperty("raw")) throw Error("invalid template strings array");
	return void 0 !== e$11 ? e$11.createHTML(i) : i;
}
const N = (t, i) => {
	const s = t.length - 1, e = [];
	let n, l = 2 === i ? "<svg>" : 3 === i ? "<math>" : "", c = v$1;
	for (let i = 0; i < s; i++) {
		const s = t[i];
		let a, u, d = -1, f = 0;
		for (; f < s.length && (c.lastIndex = f, u = c.exec(s), null !== u);) f = c.lastIndex, c === v$1 ? "!--" === u[1] ? c = _ : void 0 !== u[1] ? c = m$3 : void 0 !== u[2] ? (y.test(u[2]) && (n = RegExp("</" + u[2], "g")), c = p$1) : void 0 !== u[3] && (c = p$1) : c === p$1 ? ">" === u[0] ? (c = n ?? v$1, d = -1) : void 0 === u[1] ? d = -2 : (d = c.lastIndex - u[2].length, a = u[1], c = void 0 === u[3] ? p$1 : "\"" === u[3] ? $ : g) : c === $ || c === g ? c = p$1 : c === _ || c === m$3 ? c = v$1 : (c = p$1, n = void 0);
		const x = c === p$1 && t[i + 1].startsWith("/>") ? " " : "";
		l += c === v$1 ? s + r$9 : d >= 0 ? (e.push(a), s.slice(0, d) + h$6 + s.slice(d) + o$12 + x) : s + o$12 + (-2 === d ? i : x);
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
				if (r.hasAttributes()) for (const t of r.getAttributeNames()) if (t.endsWith(h$6)) {
					const i = v[a++], s = r.getAttribute(t).split(o$12), e = /([.?@])?(.*)/.exec(i);
					d.push({
						type: 1,
						index: l,
						name: e[2],
						strings: s,
						ctor: "." === e[1] ? I : "?" === e[1] ? L : "@" === e[1] ? z : H
					}), r.removeAttribute(t);
				} else t.startsWith(o$12) && (d.push({
					type: 6,
					index: l
				}), r.removeAttribute(t));
				if (y.test(r.tagName)) {
					const t = r.textContent.split(o$12), i = t.length - 1;
					if (i > 0) {
						r.textContent = s$8 ? s$8.emptyScript : "";
						for (let s = 0; s < i; s++) r.append(t[s], c$5()), P.nextNode(), d.push({
							type: 2,
							index: ++l
						});
						r.append(t[i], c$5());
					}
				}
			} else if (8 === r.nodeType) if (r.data === n$11) d.push({
				type: 2,
				index: l
			});
			else {
				let t = -1;
				for (; -1 !== (t = r.data.indexOf(o$12, t + 1));) d.push({
					type: 7,
					index: l
				}), t += o$12.length - 1;
			}
			l++;
		}
	}
	static createElement(t, i) {
		const s = l$3.createElement("template");
		return s.innerHTML = t, s;
	}
};
function M$1(t, i, s = t, e) {
	if (i === E) return i;
	let h = void 0 !== e ? s._$Co?.[e] : s._$Cl;
	const o = a(i) ? void 0 : i._$litDirective$;
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
		const { el: { content: i }, parts: s } = this._$AD, e = (t?.creationScope ?? l$3).importNode(i, !0);
		P.currentNode = e;
		let h = P.nextNode(), o = 0, n = 0, r = s[0];
		for (; void 0 !== r;) {
			if (o === r.index) {
				let i;
				2 === r.type ? i = new k(h, h.nextSibling, this, t) : 1 === r.type ? i = new r.ctor(h, r.name, r.strings, this, t) : 6 === r.type && (i = new Z(h, this, t)), this._$AV.push(i), r = s[++n];
			}
			o !== r?.index && (h = P.nextNode(), o++);
		}
		return P.currentNode = l$3, e;
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
		t = M$1(this, t, i), a(t) ? t === A || null == t || "" === t ? (this._$AH !== A && this._$AR(), this._$AH = A) : t !== this._$AH && t !== E && this._(t) : void 0 !== t._$litType$ ? this.$(t) : void 0 !== t.nodeType ? this.T(t) : d$1(t) ? this.k(t) : this._(t);
	}
	O(t) {
		return this._$AA.parentNode.insertBefore(t, this._$AB);
	}
	T(t) {
		this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
	}
	_(t) {
		this._$AH !== A && a(this._$AH) ? this._$AA.nextSibling.data = t : this.T(l$3.createTextNode(t)), this._$AH = t;
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
		u$2(this._$AH) || (this._$AH = [], this._$AR());
		const i = this._$AH;
		let s, e = 0;
		for (const h of t) e === i.length ? i.push(s = new k(this.O(c$5()), this.O(c$5()), this, this.options)) : s = i[e], s._$AI(h), e++;
		e < i.length && (this._$AR(s && s._$AB.nextSibling, e), i.length = e);
	}
	_$AR(t = this._$AA.nextSibling, s) {
		for (this._$AP?.(!1, !0, s); t !== this._$AB;) {
			const s = i$8(t).nextSibling;
			i$8(t).remove(), t = s;
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
		if (void 0 === h) t = M$1(this, t, i, 0), o = !a(t) || t !== this._$AH && t !== E, o && (this._$AH = t);
		else {
			const e = t;
			let n, r;
			for (t = h[0], n = 0; n < h.length - 1; n++) r = M$1(this, e[s + n], i, n), r === E && (r = this._$AH[n]), o ||= !a(r) || r !== this._$AH[n], r === A ? t = A : t !== A && (t += (r ?? "") + h[n + 1]), this._$AH[n] = r;
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
	M: h$6,
	P: o$12,
	A: n$11,
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
const B = t$6.litHtmlPolyfillSupport;
B?.(S, k), (t$6.litHtmlVersions ??= []).push("3.3.3");
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
*/ const s$7 = globalThis;
var i$7 = class extends y$1 {
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
i$7._$litElement$ = !0, i$7["finalized"] = !0, s$7.litElementHydrateSupport?.({ LitElement: i$7 });
const o$11 = s$7.litElementPolyfillSupport;
o$11?.({ LitElement: i$7 });
(s$7.litElementVersions ??= []).push("4.2.2");
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
const t$5 = (t) => (e, o) => {
	void 0 !== o ? o.addInitializer(() => {
		customElements.define(t, e);
	}) : customElements.define(t, e);
};
/**
* @license
* Copyright 2017 Google LLC
* SPDX-License-Identifier: BSD-3-Clause
*/ const o$9 = {
	attribute: !0,
	type: String,
	converter: u$3,
	reflect: !1,
	hasChanged: f$3
};
const r$8 = (t = o$9, e, r) => {
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
function n$9(t) {
	return (e, o) => "object" == typeof o ? r$8(t, e, o) : ((t, e, o) => {
		const r = e.hasOwnProperty(o);
		return e.constructor.createProperty(o, t), r ? Object.getOwnPropertyDescriptor(e, o) : void 0;
	})(t, e, o);
}
/**
* @license
* Copyright 2017 Google LLC
* SPDX-License-Identifier: BSD-3-Clause
*/ function r$7(r) {
	return n$9({
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
const e$10 = (e, t, c) => (c.configurable = !0, c.enumerable = !0, Reflect.decorate && "object" != typeof t && Object.defineProperty(e, t, c), c);
/**
* @license
* Copyright 2017 Google LLC
* SPDX-License-Identifier: BSD-3-Clause
*/ function e$9(e, r) {
	return (n, s, i) => {
		const o = (t) => t.renderRoot?.querySelector(e) ?? null;
		if (r) {
			const { get: e, set: r } = "object" == typeof s ? n : i ?? (() => {
				const t = Symbol();
				return {
					get() {
						return this[t];
					},
					set(e) {
						this[t] = e;
					}
				};
			})();
			return e$10(n, s, { get() {
				let t = e.call(this);
				return void 0 === t && (t = o(this), (null !== t || this.hasUpdated) && r.call(this, t)), t;
			} });
		}
		return e$10(n, s, { get() {
			return o(this);
		} });
	};
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
* Copyright 2023 Google LLC
* SPDX-License-Identifier: BSD-3-Clause
*/ let i$6 = !1;
const s$6 = new Signal.subtle.Watcher(() => {
	i$6 || (i$6 = !0, queueMicrotask(() => {
		i$6 = !1;
		for (const t of s$6.getPending()) t.get();
		s$6.watch();
	}));
});
const h$5 = Symbol("SignalWatcherBrand");
const e$7 = new FinalizationRegistry((i) => {
	i.unwatch(...Signal.subtle.introspectSources(i));
});
const n$7 = /* @__PURE__ */ new WeakMap();
function o$7(i) {
	return !0 === i[h$5] ? (console.warn("SignalWatcher should not be applied to the same class more than once."), i) : class extends i {
		constructor() {
			super(...arguments), this._$St = /* @__PURE__ */ new Map(), this._$So = new Signal.State(0), this._$Si = !1;
		}
		_$Sl() {
			var t, i;
			const s = [], h = [];
			this._$St.forEach((t, i) => {
				((null == t ? void 0 : t.beforeUpdate) ? s : h).push(i);
			});
			const e = null === (t = this.h) || void 0 === t ? void 0 : t.getPending().filter((t) => t !== this._$Su && !this._$St.has(t));
			s.forEach((t) => t.get()), null === (i = this._$Su) || void 0 === i || i.get(), e.forEach((t) => t.get()), h.forEach((t) => t.get());
		}
		_$Sv() {
			this.isUpdatePending || queueMicrotask(() => {
				this.isUpdatePending || this._$Sl();
			});
		}
		_$S_() {
			if (void 0 !== this.h) return;
			this._$Su = new Signal.Computed(() => {
				this._$So.get(), super.performUpdate();
			});
			const i = this.h = new Signal.subtle.Watcher(function() {
				const t = n$7.get(this);
				void 0 !== t && (!1 === t._$Si && (new Set(this.getPending()).has(t._$Su) ? t.requestUpdate() : t._$Sv()), this.watch());
			});
			n$7.set(i, this), e$7.register(this, i), i.watch(this._$Su), i.watch(...Array.from(this._$St).map(([t]) => t));
		}
		_$Sp() {
			if (void 0 === this.h) return;
			let i = !1;
			this.h.unwatch(...Signal.subtle.introspectSources(this.h).filter((t) => {
				var s;
				const h = !0 !== (null === (s = this._$St.get(t)) || void 0 === s ? void 0 : s.manualDispose);
				return h && this._$St.delete(t), i || (i = !h), h;
			})), i || (this._$Su = void 0, this.h = void 0, this._$St.clear());
		}
		updateEffect(i, s) {
			var h;
			this._$S_();
			const e = new Signal.Computed(() => {
				i();
			});
			return this.h.watch(e), this._$St.set(e, s), null !== (h = null == s ? void 0 : s.beforeUpdate) && void 0 !== h && h ? Signal.subtle.untrack(() => e.get()) : this.updateComplete.then(() => Signal.subtle.untrack(() => e.get())), () => {
				this._$St.delete(e), this.h.unwatch(e), !1 === this.isConnected && this._$Sp();
			};
		}
		performUpdate() {
			this.isUpdatePending && (this._$S_(), this._$Si = !0, this._$So.set(this._$So.get() + 1), this._$Si = !1, this._$Sl());
		}
		connectedCallback() {
			super.connectedCallback(), this.requestUpdate();
		}
		disconnectedCallback() {
			super.disconnectedCallback(), queueMicrotask(() => {
				!1 === this.isConnected && this._$Sp();
			});
		}
	};
}
/**
* @license
* Copyright 2017 Google LLC
* SPDX-License-Identifier: BSD-3-Clause
*/
const t$3 = {
	ATTRIBUTE: 1,
	CHILD: 2,
	PROPERTY: 3,
	BOOLEAN_ATTRIBUTE: 4,
	EVENT: 5,
	ELEMENT: 6
};
const e$6 = (t) => (...e) => ({
	_$litDirective$: t,
	values: e
});
var i$5 = class {
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
* Copyright 2020 Google LLC
* SPDX-License-Identifier: BSD-3-Clause
*/ const { I: t$2 } = j$1, i$4 = (o) => o, n$6 = (o) => null === o || "object" != typeof o && "function" != typeof o, r$4 = (o) => void 0 === o.strings, s$5 = () => document.createComment(""), v = (o, n, e) => {
	const l = o._$AA.parentNode, d = void 0 === n ? o._$AB : n._$AA;
	if (void 0 === e) {
		const i = l.insertBefore(s$5(), d), n = l.insertBefore(s$5(), d);
		e = new t$2(i, n, o, o.options);
	} else {
		const t = e._$AB.nextSibling, n = e._$AM, c = n !== o;
		if (c) {
			let t;
			e._$AQ?.(o), e._$AM = o, void 0 !== e._$AP && (t = o._$AU) !== n._$AU && e._$AP(t);
		}
		if (t !== d || c) {
			let o = e._$AA;
			for (; o !== t;) {
				const t = i$4(o).nextSibling;
				i$4(l).insertBefore(o, d), o = t;
			}
		}
	}
	return e;
}, u$1 = (o, t, i = o) => (o._$AI(t, i), o), m$2 = {}, p = (o, t = m$2) => o._$AH = t, M = (o) => o._$AH, h$4 = (o) => {
	o._$AR(), o._$AA.remove();
};
/**
* @license
* Copyright 2017 Google LLC
* SPDX-License-Identifier: BSD-3-Clause
*/ const s$4 = (i, t) => {
	const e = i._$AN;
	if (void 0 === e) return !1;
	for (const i of e) i._$AO?.(t, !1), s$4(i, t);
	return !0;
};
const o$6 = (i) => {
	let t, e;
	do {
		if (void 0 === (t = i._$AM)) break;
		e = t._$AN, e.delete(i), i = t;
	} while (0 === e?.size);
};
const r$3 = (i) => {
	for (let t; t = i._$AM; i = t) {
		let e = t._$AN;
		if (void 0 === e) t._$AN = e = /* @__PURE__ */ new Set();
		else if (e.has(i)) break;
		e.add(i), c$3(t);
	}
};
function h$3(i) {
	void 0 !== this._$AN ? (o$6(this), this._$AM = i, r$3(this)) : this._$AM = i;
}
function n$5(i, t = !1, e = 0) {
	const r = this._$AH, h = this._$AN;
	if (void 0 !== h && 0 !== h.size) if (t) if (Array.isArray(r)) for (let i = e; i < r.length; i++) s$4(r[i], !1), o$6(r[i]);
	else null != r && (s$4(r, !1), o$6(r));
	else s$4(this, i);
}
const c$3 = (i) => {
	i.type == t$3.CHILD && (i._$AP ??= n$5, i._$AQ ??= h$3);
};
var f = class extends i$5 {
	constructor() {
		super(...arguments), this._$AN = void 0;
	}
	_$AT(i, t, e) {
		super._$AT(i, t, e), r$3(this), this.isConnected = i._$AU;
	}
	_$AO(i, t = !0) {
		i !== this.isConnected && (this.isConnected = i, i ? this.reconnected?.() : this.disconnected?.()), t && (s$4(this, i), o$6(this));
	}
	setValue(t) {
		if (r$4(this._$Ct)) this._$Ct._$AI(t, this);
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
* Copyright 2023 Google LLC
* SPDX-License-Identifier: BSD-3-Clause
*/
let o$5 = !1;
const n$4 = new Signal.subtle.Watcher(async () => {
	o$5 || (o$5 = !0, queueMicrotask(() => {
		o$5 = !1;
		for (const i of n$4.getPending()) i.get();
		n$4.watch();
	}));
});
/**
* @license
* Copyright 2023 Google LLC
* SPDX-License-Identifier: BSD-3-Clause
*/
/**
* @license
* Copyright 2023 Google LLC
* SPDX-License-Identifier: BSD-3-Clause
*/
Signal.State;
Signal.Computed;
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
function n$3(n) {
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
*/ function c$2({ context: c, subscribe: e }) {
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
* @license
* Copyright 2021 Google LLC
* SPDX-License-Identifier: BSD-3-Clause
*/
function* o$3(o, f) {
	if (void 0 !== o) {
		let i = 0;
		for (const t of o) yield f(t, i++);
	}
}
let pending = false;
let watcher = new Signal.subtle.Watcher(() => {
	if (!pending) {
		pending = true;
		queueMicrotask(() => {
			pending = false;
			flushPending();
		});
	}
});
function flushPending() {
	for (const signal of watcher.getPending()) signal.get();
	watcher.watch();
}
/**
* ⚠️ WARNING: Nothing unwatches ⚠️
* This will produce a memory leak.
*/
function effect(cb) {
	let c = new Signal.Computed(() => cb());
	watcher.watch(c);
	c.get();
	return () => {
		watcher.unwatch(c);
	};
}
/**
* An alias for the theme context, for backwards-compatibility.
*
* @deprecated Use `theme` instead.
*/
const themeContext = n$3(Symbol("A2UITheme"));
const buildStructuralStyles = () => {
	if (typeof window === "undefined") return [];
	try {
		const styleSheet = new CSSStyleSheet();
		styleSheet.replaceSync(structuralStyles$1);
		return styleSheet;
	} catch (e) {
		throw new Error("Failed to construct structural styles.", { cause: e });
	}
};
const structuralStyles = buildStructuralStyles();
var ComponentRegistry = class {
	constructor() {
		this.schemas = /* @__PURE__ */ new Map();
		this.registry = /* @__PURE__ */ new Map();
	}
	register(typeName, constructor, tagName, schema) {
		if (!/^[a-zA-Z0-9]+$/.test(typeName)) throw new Error(`[Registry] Invalid typeName '${typeName}'. Must be alphanumeric.`);
		this.registry.set(typeName, constructor);
		if (schema) this.schemas.set(typeName, schema);
		const actualTagName = tagName || `a2ui-custom-${typeName.toLowerCase()}`;
		const existingName = customElements.getName(constructor);
		if (existingName) {
			if (existingName !== actualTagName) throw new Error(`Component ${typeName} is already registered as ${existingName}, but requested as ${actualTagName}.`);
			return;
		}
		if (!customElements.get(actualTagName)) customElements.define(actualTagName, constructor);
	}
	get(typeName) {
		return this.registry.get(typeName);
	}
	getInlineCatalog() {
		const components = {};
		for (const [key, value] of this.schemas) components[key] = value;
		return { components };
	}
};
const componentRegistry = new ComponentRegistry();
var __runInitializers$19 = function(thisArg, initializers, value) {
	var useValue = arguments.length > 2;
	for (var i = 0; i < initializers.length; i++) value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
	return useValue ? value : void 0;
};
var __esDecorate$19 = function(ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
	function accept(f) {
		if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected");
		return f;
	}
	var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
	var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
	var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
	var _, done = false;
	for (var i = decorators.length - 1; i >= 0; i--) {
		var context = {};
		for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
		for (var p in contextIn.access) context.access[p] = contextIn.access[p];
		context.addInitializer = function(f) {
			if (done) throw new TypeError("Cannot add initializers after decoration has completed");
			extraInitializers.push(accept(f || null));
		};
		var result = (0, decorators[i])(kind === "accessor" ? {
			get: descriptor.get,
			set: descriptor.set
		} : descriptor[key], context);
		if (kind === "accessor") {
			if (result === void 0) continue;
			if (result === null || typeof result !== "object") throw new TypeError("Object expected");
			if (_ = accept(result.get)) descriptor.get = _;
			if (_ = accept(result.set)) descriptor.set = _;
			if (_ = accept(result.init)) initializers.unshift(_);
		} else if (_ = accept(result)) {
			if (kind === "field") initializers.unshift(_);
			else descriptor[key] = _;
		}
	}
	if (target) Object.defineProperty(target, contextIn.name, descriptor);
	done = true;
};
let Root = (() => {
	let _classDecorators = [t$5("a2ui-root")];
	let _classDescriptor;
	let _classExtraInitializers = [];
	let _classThis;
	let _classSuper = o$7(i$7);
	let _instanceExtraInitializers = [];
	let _surfaceId_decorators;
	let _surfaceId_initializers = [];
	let _surfaceId_extraInitializers = [];
	let _component_decorators;
	let _component_initializers = [];
	let _component_extraInitializers = [];
	let _theme_decorators;
	let _theme_initializers = [];
	let _theme_extraInitializers = [];
	let _childComponents_decorators;
	let _childComponents_initializers = [];
	let _childComponents_extraInitializers = [];
	let _processor_decorators;
	let _processor_initializers = [];
	let _processor_extraInitializers = [];
	let _dataContextPath_decorators;
	let _dataContextPath_initializers = [];
	let _dataContextPath_extraInitializers = [];
	let _enableCustomElements_decorators;
	let _enableCustomElements_initializers = [];
	let _enableCustomElements_extraInitializers = [];
	let _set_weight_decorators;
	var Root = class extends _classSuper {
		static {
			_classThis = this;
		}
		static {
			const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
			_surfaceId_decorators = [n$9()];
			_component_decorators = [n$9()];
			_theme_decorators = [c$2({ context: themeContext })];
			_childComponents_decorators = [n$9({ attribute: false })];
			_processor_decorators = [n$9({ attribute: false })];
			_dataContextPath_decorators = [n$9()];
			_enableCustomElements_decorators = [n$9()];
			_set_weight_decorators = [n$9()];
			__esDecorate$19(this, null, _surfaceId_decorators, {
				kind: "accessor",
				name: "surfaceId",
				static: false,
				private: false,
				access: {
					has: (obj) => "surfaceId" in obj,
					get: (obj) => obj.surfaceId,
					set: (obj, value) => {
						obj.surfaceId = value;
					}
				},
				metadata: _metadata
			}, _surfaceId_initializers, _surfaceId_extraInitializers);
			__esDecorate$19(this, null, _component_decorators, {
				kind: "accessor",
				name: "component",
				static: false,
				private: false,
				access: {
					has: (obj) => "component" in obj,
					get: (obj) => obj.component,
					set: (obj, value) => {
						obj.component = value;
					}
				},
				metadata: _metadata
			}, _component_initializers, _component_extraInitializers);
			__esDecorate$19(this, null, _theme_decorators, {
				kind: "accessor",
				name: "theme",
				static: false,
				private: false,
				access: {
					has: (obj) => "theme" in obj,
					get: (obj) => obj.theme,
					set: (obj, value) => {
						obj.theme = value;
					}
				},
				metadata: _metadata
			}, _theme_initializers, _theme_extraInitializers);
			__esDecorate$19(this, null, _childComponents_decorators, {
				kind: "accessor",
				name: "childComponents",
				static: false,
				private: false,
				access: {
					has: (obj) => "childComponents" in obj,
					get: (obj) => obj.childComponents,
					set: (obj, value) => {
						obj.childComponents = value;
					}
				},
				metadata: _metadata
			}, _childComponents_initializers, _childComponents_extraInitializers);
			__esDecorate$19(this, null, _processor_decorators, {
				kind: "accessor",
				name: "processor",
				static: false,
				private: false,
				access: {
					has: (obj) => "processor" in obj,
					get: (obj) => obj.processor,
					set: (obj, value) => {
						obj.processor = value;
					}
				},
				metadata: _metadata
			}, _processor_initializers, _processor_extraInitializers);
			__esDecorate$19(this, null, _dataContextPath_decorators, {
				kind: "accessor",
				name: "dataContextPath",
				static: false,
				private: false,
				access: {
					has: (obj) => "dataContextPath" in obj,
					get: (obj) => obj.dataContextPath,
					set: (obj, value) => {
						obj.dataContextPath = value;
					}
				},
				metadata: _metadata
			}, _dataContextPath_initializers, _dataContextPath_extraInitializers);
			__esDecorate$19(this, null, _enableCustomElements_decorators, {
				kind: "accessor",
				name: "enableCustomElements",
				static: false,
				private: false,
				access: {
					has: (obj) => "enableCustomElements" in obj,
					get: (obj) => obj.enableCustomElements,
					set: (obj, value) => {
						obj.enableCustomElements = value;
					}
				},
				metadata: _metadata
			}, _enableCustomElements_initializers, _enableCustomElements_extraInitializers);
			__esDecorate$19(this, null, _set_weight_decorators, {
				kind: "setter",
				name: "weight",
				static: false,
				private: false,
				access: {
					has: (obj) => "weight" in obj,
					set: (obj, value) => {
						obj.weight = value;
					}
				},
				metadata: _metadata
			}, null, _instanceExtraInitializers);
			__esDecorate$19(null, _classDescriptor = { value: _classThis }, _classDecorators, {
				kind: "class",
				name: _classThis.name,
				metadata: _metadata
			}, null, _classExtraInitializers);
			Root = _classThis = _classDescriptor.value;
			if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, {
				enumerable: true,
				configurable: true,
				writable: true,
				value: _metadata
			});
		}
		#surfaceId_accessor_storage = (__runInitializers$19(this, _instanceExtraInitializers), __runInitializers$19(this, _surfaceId_initializers, null));
		get surfaceId() {
			return this.#surfaceId_accessor_storage;
		}
		set surfaceId(value) {
			this.#surfaceId_accessor_storage = value;
		}
		#component_accessor_storage = (__runInitializers$19(this, _surfaceId_extraInitializers), __runInitializers$19(this, _component_initializers, null));
		get component() {
			return this.#component_accessor_storage;
		}
		set component(value) {
			this.#component_accessor_storage = value;
		}
		#theme_accessor_storage = (__runInitializers$19(this, _component_extraInitializers), __runInitializers$19(this, _theme_initializers, void 0));
		get theme() {
			return this.#theme_accessor_storage;
		}
		set theme(value) {
			this.#theme_accessor_storage = value;
		}
		#childComponents_accessor_storage = (__runInitializers$19(this, _theme_extraInitializers), __runInitializers$19(this, _childComponents_initializers, null));
		get childComponents() {
			return this.#childComponents_accessor_storage;
		}
		set childComponents(value) {
			this.#childComponents_accessor_storage = value;
		}
		#processor_accessor_storage = (__runInitializers$19(this, _childComponents_extraInitializers), __runInitializers$19(this, _processor_initializers, null));
		get processor() {
			return this.#processor_accessor_storage;
		}
		set processor(value) {
			this.#processor_accessor_storage = value;
		}
		#dataContextPath_accessor_storage = (__runInitializers$19(this, _processor_extraInitializers), __runInitializers$19(this, _dataContextPath_initializers, ""));
		get dataContextPath() {
			return this.#dataContextPath_accessor_storage;
		}
		set dataContextPath(value) {
			this.#dataContextPath_accessor_storage = value;
		}
		#enableCustomElements_accessor_storage = (__runInitializers$19(this, _dataContextPath_extraInitializers), __runInitializers$19(this, _enableCustomElements_initializers, false));
		get enableCustomElements() {
			return this.#enableCustomElements_accessor_storage;
		}
		set enableCustomElements(value) {
			this.#enableCustomElements_accessor_storage = value;
		}
		set weight(weight) {
			this.#weight = weight;
			this.style.setProperty("--weight", `${weight}`);
		}
		get weight() {
			return this.#weight;
		}
		#weight = (__runInitializers$19(this, _enableCustomElements_extraInitializers), 1);
		static {
			this.styles = [structuralStyles, i$10`
      :host {
        display: flex;
        flex-direction: column;
        gap: 8px;
        max-height: 80%;
      }
    `];
		}
		/**
		* Holds the cleanup function for our effect.
		* We need this to stop the effect when the component is disconnected.
		*/
		#lightDomEffectDisposer = null;
		willUpdate(changedProperties) {
			if (changedProperties.has("childComponents")) {
				if (this.#lightDomEffectDisposer) this.#lightDomEffectDisposer();
				this.#lightDomEffectDisposer = effect(() => {
					const allChildren = this.childComponents ?? null;
					const lightDomTemplate = this.renderComponentTree(allChildren);
					D(lightDomTemplate, this, { host: this });
				});
			}
		}
		/**
		* Clean up the effect when the component is removed from the DOM.
		*/
		disconnectedCallback() {
			super.disconnectedCallback();
			if (this.#lightDomEffectDisposer) this.#lightDomEffectDisposer();
		}
		/**
		* Turns the SignalMap into a renderable TemplateResult for Lit.
		*/
		renderComponentTree(components) {
			if (!components) return A;
			if (!Array.isArray(components)) return A;
			return b` ${o$3(components, (component) => {
				if (this.enableCustomElements) {
					const elCtor = componentRegistry.get(component.type) || customElements.get(component.type);
					if (elCtor) {
						const node = component;
						const el = new elCtor();
						el.id = node.id;
						if (node.slotName) el.slot = node.slotName;
						el.component = node;
						el.weight = node.weight ?? "initial";
						el.processor = this.processor;
						el.surfaceId = this.surfaceId;
						el.dataContextPath = node.dataContextPath ?? "/";
						for (const [prop, val] of Object.entries(component.properties)) el[prop] = val;
						return b`${el}`;
					}
				}
				switch (component.type) {
					case "List": {
						const node = component;
						const childComponents = node.properties.children;
						return b`<a2ui-list
            id=${node.id}
            slot=${node.slotName ? node.slotName : A}
            .component=${node}
            .weight=${node.weight ?? "initial"}
            .direction=${node.properties.direction ?? "vertical"}
            .processor=${this.processor}
            .surfaceId=${this.surfaceId}
            .childComponents=${childComponents}
            .enableCustomElements=${this.enableCustomElements}
          ></a2ui-list>`;
					}
					case "Card": {
						const node = component;
						let childComponents = node.properties.children;
						if (!childComponents && node.properties.child) childComponents = [node.properties.child];
						return b`<a2ui-card
            id=${node.id}
            slot=${node.slotName ? node.slotName : A}
            .component=${node}
            .weight=${node.weight ?? "initial"}
            .processor=${this.processor}
            .surfaceId=${this.surfaceId}
            .childComponents=${childComponents}
            .dataContextPath=${node.dataContextPath ?? ""}
            .enableCustomElements=${this.enableCustomElements}
          ></a2ui-card>`;
					}
					case "Column": {
						const node = component;
						return b`<a2ui-column
            id=${node.id}
            slot=${node.slotName ? node.slotName : A}
            .component=${node}
            .weight=${node.weight ?? "initial"}
            .processor=${this.processor}
            .surfaceId=${this.surfaceId}
            .childComponents=${node.properties.children ?? null}
            .dataContextPath=${node.dataContextPath ?? ""}
            .alignment=${node.properties.alignment ?? "stretch"}
            .distribution=${node.properties.distribution ?? "start"}
            .enableCustomElements=${this.enableCustomElements}
          ></a2ui-column>`;
					}
					case "Row": {
						const node = component;
						return b`<a2ui-row
            id=${node.id}
            slot=${node.slotName ? node.slotName : A}
            .component=${node}
            .weight=${node.weight ?? "initial"}
            .processor=${this.processor}
            .surfaceId=${this.surfaceId}
            .childComponents=${node.properties.children ?? null}
            .dataContextPath=${node.dataContextPath ?? ""}
            .alignment=${node.properties.alignment ?? "stretch"}
            .distribution=${node.properties.distribution ?? "start"}
            .enableCustomElements=${this.enableCustomElements}
          ></a2ui-row>`;
					}
					case "Image": {
						const node = component;
						return b`<a2ui-image
            id=${node.id}
            slot=${node.slotName ? node.slotName : A}
            .component=${node}
            .weight=${node.weight ?? "initial"}
            .processor=${this.processor}
            .surfaceId=${this.surfaceId}
            .url=${node.properties.url ?? null}
            .dataContextPath=${node.dataContextPath ?? ""}
            .usageHint=${node.properties.usageHint}
            .fit=${node.properties.fit}
            .enableCustomElements=${this.enableCustomElements}
          ></a2ui-image>`;
					}
					case "Icon": {
						const node = component;
						return b`<a2ui-icon
            id=${node.id}
            slot=${node.slotName ? node.slotName : A}
            .component=${node}
            .weight=${node.weight ?? "initial"}
            .processor=${this.processor}
            .surfaceId=${this.surfaceId}
            .name=${node.properties.name ?? null}
            .dataContextPath=${node.dataContextPath ?? ""}
            .enableCustomElements=${this.enableCustomElements}
          ></a2ui-icon>`;
					}
					case "AudioPlayer": {
						const node = component;
						return b`<a2ui-audioplayer
            id=${node.id}
            slot=${node.slotName ? node.slotName : A}
            .component=${node}
            .weight=${node.weight ?? "initial"}
            .processor=${this.processor}
            .surfaceId=${this.surfaceId}
            .url=${node.properties.url ?? null}
            .dataContextPath=${node.dataContextPath ?? ""}
            .enableCustomElements=${this.enableCustomElements}
          ></a2ui-audioplayer>`;
					}
					case "Button": {
						const node = component;
						return b`<a2ui-button
            id=${node.id}
            slot=${node.slotName ? node.slotName : A}
            .component=${node}
            .weight=${node.weight ?? "initial"}
            .processor=${this.processor}
            .surfaceId=${this.surfaceId}
            .dataContextPath=${node.dataContextPath ?? ""}
            .action=${node.properties.action}
            .childComponents=${[node.properties.child]}
            .primary=${node.properties.primary}
            .enableCustomElements=${this.enableCustomElements}
          ></a2ui-button>`;
					}
					case "Text": {
						const node = component;
						return b`<a2ui-text
            id=${node.id}
            slot=${node.slotName ? node.slotName : A}
            .component=${node}
            .weight=${node.weight ?? "initial"}
            .model=${this.processor}
            .surfaceId=${this.surfaceId}
            .processor=${this.processor}
            .dataContextPath=${node.dataContextPath}
            .text=${node.properties.text}
            .usageHint=${node.properties.usageHint}
            .enableCustomElements=${this.enableCustomElements}
          ></a2ui-text>`;
					}
					case "CheckBox": {
						const node = component;
						return b`<a2ui-checkbox
            id=${node.id}
            slot=${node.slotName ? node.slotName : A}
            .component=${node}
            .weight=${node.weight ?? "initial"}
            .processor=${this.processor}
            .surfaceId=${this.surfaceId}
            .dataContextPath=${node.dataContextPath ?? ""}
            .label=${node.properties.label}
            .value=${node.properties.value}
            .enableCustomElements=${this.enableCustomElements}
          ></a2ui-checkbox>`;
					}
					case "DateTimeInput": {
						const node = component;
						return b`<a2ui-datetimeinput
            id=${node.id}
            slot=${node.slotName ? node.slotName : A}
            .component=${node}
            .weight=${node.weight ?? "initial"}
            .processor=${this.processor}
            .surfaceId=${this.surfaceId}
            .dataContextPath=${node.dataContextPath ?? ""}
            .enableDate=${node.properties.enableDate ?? true}
            .enableTime=${node.properties.enableTime ?? true}
            .value=${node.properties.value}
            .enableCustomElements=${this.enableCustomElements}
          ></a2ui-datetimeinput>`;
					}
					case "Divider": {
						const node = component;
						return b`<a2ui-divider
            id=${node.id}
            slot=${node.slotName ? node.slotName : A}
            .component=${node}
            .weight=${node.weight ?? "initial"}
            .processor=${this.processor}
            .surfaceId=${this.surfaceId}
            .dataContextPath=${node.dataContextPath}
            .thickness=${node.properties.thickness}
            .axis=${node.properties.axis}
            .color=${node.properties.color}
            .enableCustomElements=${this.enableCustomElements}
          ></a2ui-divider>`;
					}
					case "MultipleChoice": {
						const node = component;
						return b`<a2ui-multiplechoice
            id=${node.id}
            slot=${node.slotName ? node.slotName : A}
            .component=${node}
            .weight=${node.weight ?? "initial"}
            .processor=${this.processor}
            .surfaceId=${this.surfaceId}
            .dataContextPath=${node.dataContextPath}
            .options=${node.properties.options}
            .maxAllowedSelections=${node.properties.maxAllowedSelections}
            .selections=${node.properties.selections}
            .variant=${node.properties.variant}
            .filterable=${node.properties.filterable}
            .enableCustomElements=${this.enableCustomElements}
          ></a2ui-multiplechoice>`;
					}
					case "Slider": {
						const node = component;
						return b`<a2ui-slider
            id=${node.id}
            slot=${node.slotName ? node.slotName : A}
            .component=${node}
            .weight=${node.weight ?? "initial"}
            .processor=${this.processor}
            .surfaceId=${this.surfaceId}
            .dataContextPath=${node.dataContextPath}
            .value=${node.properties.value}
            .minValue=${node.properties.minValue}
            .maxValue=${node.properties.maxValue}
            .enableCustomElements=${this.enableCustomElements}
          ></a2ui-slider>`;
					}
					case "TextField": {
						const node = component;
						return b`<a2ui-textfield
            id=${node.id}
            slot=${node.slotName ? node.slotName : A}
            .component=${node}
            .weight=${node.weight ?? "initial"}
            .processor=${this.processor}
            .surfaceId=${this.surfaceId}
            .dataContextPath=${node.dataContextPath}
            .label=${node.properties.label}
            .text=${node.properties.text}
            .textFieldType=${node.properties.textFieldType}
            .validationRegexp=${node.properties.validationRegexp}
            .enableCustomElements=${this.enableCustomElements}
          ></a2ui-textfield>`;
					}
					case "Video": {
						const node = component;
						return b`<a2ui-video
            id=${node.id}
            slot=${node.slotName ? node.slotName : A}
            .component=${node}
            .weight=${node.weight ?? "initial"}
            .processor=${this.processor}
            .surfaceId=${this.surfaceId}
            .dataContextPath=${node.dataContextPath}
            .url=${node.properties.url}
            .enableCustomElements=${this.enableCustomElements}
          ></a2ui-video>`;
					}
					case "Tabs": {
						const node = component;
						const titles = [];
						const childComponents = [];
						if (node.properties.tabItems) for (const item of node.properties.tabItems) {
							titles.push(item.title);
							childComponents.push(item.child);
						}
						return b`<a2ui-tabs
            id=${node.id}
            slot=${node.slotName ? node.slotName : A}
            .component=${node}
            .weight=${node.weight ?? "initial"}
            .processor=${this.processor}
            .surfaceId=${this.surfaceId}
            .dataContextPath=${node.dataContextPath}
            .titles=${titles}
            .childComponents=${childComponents}
            .enableCustomElements=${this.enableCustomElements}
          ></a2ui-tabs>`;
					}
					case "Modal": {
						const node = component;
						const childComponents = [node.properties.entryPointChild, node.properties.contentChild];
						node.properties.entryPointChild.slotName = "entry";
						return b`<a2ui-modal
            id=${node.id}
            slot=${node.slotName ? node.slotName : A}
            .component=${node}
            .weight=${node.weight ?? "initial"}
            .processor=${this.processor}
            .surfaceId=${this.surfaceId}
            .dataContextPath=${node.dataContextPath}
            .childComponents=${childComponents}
            .enableCustomElements=${this.enableCustomElements}
          ></a2ui-modal>`;
					}
					default: return this.renderCustomComponent(component);
				}
			})}`;
		}
		renderCustomComponent(component) {
			if (!this.enableCustomElements) return;
			const node = component;
			const elCtor = componentRegistry.get(component.type) || customElements.get(component.type);
			if (!elCtor) return b`Unknown element ${component.type}`;
			const el = new elCtor();
			el.id = node.id;
			if (node.slotName) el.slot = node.slotName;
			el.component = node;
			el.weight = node.weight ?? "initial";
			el.processor = this.processor;
			el.surfaceId = this.surfaceId;
			el.dataContextPath = node.dataContextPath ?? "/";
			for (const [prop, val] of Object.entries(component.properties)) el[prop] = val;
			return b`${el}`;
		}
		render() {
			return b`<slot></slot>`;
		}
		static {
			__runInitializers$19(_classThis, _classExtraInitializers);
		}
	};
	return _classThis;
})();
/**
* @license
* Copyright 2018 Google LLC
* SPDX-License-Identifier: BSD-3-Clause
*/ const e$2 = e$6(class extends i$5 {
	constructor(t) {
		if (super(t), t.type !== t$3.ATTRIBUTE || "class" !== t.name || t.strings?.length > 2) throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.");
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
* @license
* Copyright 2018 Google LLC
* SPDX-License-Identifier: BSD-3-Clause
*/ const n$2 = "important";
const i$1 = " !" + n$2;
const o$2 = e$6(class extends i$5 {
	constructor(t) {
		if (super(t), t.type !== t$3.ATTRIBUTE || "style" !== t.name || t.strings?.length > 2) throw Error("The `styleMap` directive must be used in the `style` attribute and must be the only part in the attribute.");
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
var __esDecorate$18 = function(ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
	function accept(f) {
		if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected");
		return f;
	}
	var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
	var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
	var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
	var _, done = false;
	for (var i = decorators.length - 1; i >= 0; i--) {
		var context = {};
		for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
		for (var p in contextIn.access) context.access[p] = contextIn.access[p];
		context.addInitializer = function(f) {
			if (done) throw new TypeError("Cannot add initializers after decoration has completed");
			extraInitializers.push(accept(f || null));
		};
		var result = (0, decorators[i])(kind === "accessor" ? {
			get: descriptor.get,
			set: descriptor.set
		} : descriptor[key], context);
		if (kind === "accessor") {
			if (result === void 0) continue;
			if (result === null || typeof result !== "object") throw new TypeError("Object expected");
			if (_ = accept(result.get)) descriptor.get = _;
			if (_ = accept(result.set)) descriptor.set = _;
			if (_ = accept(result.init)) initializers.unshift(_);
		} else if (_ = accept(result)) {
			if (kind === "field") initializers.unshift(_);
			else descriptor[key] = _;
		}
	}
	if (target) Object.defineProperty(target, contextIn.name, descriptor);
	done = true;
};
var __runInitializers$18 = function(thisArg, initializers, value) {
	var useValue = arguments.length > 2;
	for (var i = 0; i < initializers.length; i++) value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
	return useValue ? value : void 0;
};
(() => {
	let _classDecorators = [t$5("a2ui-audioplayer")];
	let _classDescriptor;
	let _classExtraInitializers = [];
	let _classThis;
	let _classSuper = Root;
	let _url_decorators;
	let _url_initializers = [];
	let _url_extraInitializers = [];
	var Audio = class extends _classSuper {
		static {
			_classThis = this;
		}
		static {
			const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
			_url_decorators = [n$9()];
			__esDecorate$18(this, null, _url_decorators, {
				kind: "accessor",
				name: "url",
				static: false,
				private: false,
				access: {
					has: (obj) => "url" in obj,
					get: (obj) => obj.url,
					set: (obj, value) => {
						obj.url = value;
					}
				},
				metadata: _metadata
			}, _url_initializers, _url_extraInitializers);
			__esDecorate$18(null, _classDescriptor = { value: _classThis }, _classDecorators, {
				kind: "class",
				name: _classThis.name,
				metadata: _metadata
			}, null, _classExtraInitializers);
			Audio = _classThis = _classDescriptor.value;
			if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, {
				enumerable: true,
				configurable: true,
				writable: true,
				value: _metadata
			});
		}
		#url_accessor_storage = __runInitializers$18(this, _url_initializers, null);
		get url() {
			return this.#url_accessor_storage;
		}
		set url(value) {
			this.#url_accessor_storage = value;
		}
		static {
			this.styles = [structuralStyles, i$10`
      * {
        box-sizing: border-box;
      }

      :host {
        display: block;
        flex: var(--weight);
        min-height: 0;
        overflow: auto;
      }

      audio {
        display: block;
        width: 100%;
      }
    `];
		}
		#renderAudio() {
			if (!this.url) return A;
			if (this.url && typeof this.url === "object") {
				if ("literalString" in this.url) return b`<audio controls src=${this.url.literalString} />`;
				else if ("literal" in this.url) return b`<audio controls src=${this.url.literal} />`;
				else if (this.url && "path" in this.url && this.url.path) {
					if (!this.processor || !this.component) return b`(no processor)`;
					const audioUrl = this.processor.getData(this.component, this.url.path, this.surfaceId ?? A2uiMessageProcessor.DEFAULT_SURFACE_ID);
					if (!audioUrl) return b`Invalid audio URL`;
					if (typeof audioUrl !== "string") return b`Invalid audio URL`;
					return b`<audio controls src=${audioUrl} />`;
				}
			}
			return b`(empty)`;
		}
		render() {
			return b`<section
      class=${e$2(this.theme.components.AudioPlayer)}
      style=${this.theme.additionalStyles?.AudioPlayer ? o$2(this.theme.additionalStyles?.AudioPlayer) : A}
    >
      ${this.#renderAudio()}
    </section>`;
		}
		constructor() {
			super(...arguments);
			__runInitializers$18(this, _url_extraInitializers);
		}
		static {
			__runInitializers$18(_classThis, _classExtraInitializers);
		}
	};
	return _classThis;
})();
const eventInit = {
	bubbles: true,
	cancelable: true,
	composed: true
};
var StateEvent = class StateEvent extends CustomEvent {
	static {
		this.eventName = "a2uiaction";
	}
	constructor(payload) {
		super(StateEvent.eventName, {
			detail: payload,
			...eventInit
		});
		this.payload = payload;
	}
};
var __esDecorate$17 = function(ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
	function accept(f) {
		if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected");
		return f;
	}
	var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
	var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
	var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
	var _, done = false;
	for (var i = decorators.length - 1; i >= 0; i--) {
		var context = {};
		for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
		for (var p in contextIn.access) context.access[p] = contextIn.access[p];
		context.addInitializer = function(f) {
			if (done) throw new TypeError("Cannot add initializers after decoration has completed");
			extraInitializers.push(accept(f || null));
		};
		var result = (0, decorators[i])(kind === "accessor" ? {
			get: descriptor.get,
			set: descriptor.set
		} : descriptor[key], context);
		if (kind === "accessor") {
			if (result === void 0) continue;
			if (result === null || typeof result !== "object") throw new TypeError("Object expected");
			if (_ = accept(result.get)) descriptor.get = _;
			if (_ = accept(result.set)) descriptor.set = _;
			if (_ = accept(result.init)) initializers.unshift(_);
		} else if (_ = accept(result)) {
			if (kind === "field") initializers.unshift(_);
			else descriptor[key] = _;
		}
	}
	if (target) Object.defineProperty(target, contextIn.name, descriptor);
	done = true;
};
var __runInitializers$17 = function(thisArg, initializers, value) {
	var useValue = arguments.length > 2;
	for (var i = 0; i < initializers.length; i++) value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
	return useValue ? value : void 0;
};
(() => {
	let _classDecorators = [t$5("a2ui-button")];
	let _classDescriptor;
	let _classExtraInitializers = [];
	let _classThis;
	let _classSuper = Root;
	let _action_decorators;
	let _action_initializers = [];
	let _action_extraInitializers = [];
	let _primary_decorators;
	let _primary_initializers = [];
	let _primary_extraInitializers = [];
	var Button = class extends _classSuper {
		static {
			_classThis = this;
		}
		static {
			const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
			_action_decorators = [n$9()];
			_primary_decorators = [n$9()];
			__esDecorate$17(this, null, _action_decorators, {
				kind: "accessor",
				name: "action",
				static: false,
				private: false,
				access: {
					has: (obj) => "action" in obj,
					get: (obj) => obj.action,
					set: (obj, value) => {
						obj.action = value;
					}
				},
				metadata: _metadata
			}, _action_initializers, _action_extraInitializers);
			__esDecorate$17(this, null, _primary_decorators, {
				kind: "accessor",
				name: "primary",
				static: false,
				private: false,
				access: {
					has: (obj) => "primary" in obj,
					get: (obj) => obj.primary,
					set: (obj, value) => {
						obj.primary = value;
					}
				},
				metadata: _metadata
			}, _primary_initializers, _primary_extraInitializers);
			__esDecorate$17(null, _classDescriptor = { value: _classThis }, _classDecorators, {
				kind: "class",
				name: _classThis.name,
				metadata: _metadata
			}, null, _classExtraInitializers);
			Button = _classThis = _classDescriptor.value;
			if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, {
				enumerable: true,
				configurable: true,
				writable: true,
				value: _metadata
			});
		}
		#action_accessor_storage = __runInitializers$17(this, _action_initializers, null);
		get action() {
			return this.#action_accessor_storage;
		}
		set action(value) {
			this.#action_accessor_storage = value;
		}
		#primary_accessor_storage = (__runInitializers$17(this, _action_extraInitializers), __runInitializers$17(this, _primary_initializers, false));
		get primary() {
			return this.#primary_accessor_storage;
		}
		set primary(value) {
			this.#primary_accessor_storage = value;
		}
		static {
			this.styles = [structuralStyles, i$10`
      :host {
        display: block;
        flex: var(--weight);
        min-height: 0;
      }
    `];
		}
		render() {
			return b`<button
      class=${e$2(this.theme.components.Button)}
      style=${this.theme.additionalStyles?.Button ? o$2(this.theme.additionalStyles?.Button) : A}
      @click=${() => {
				if (!this.action) return;
				const evt = new StateEvent({
					eventType: "a2ui.action",
					action: this.action,
					dataContextPath: this.dataContextPath,
					sourceComponentId: this.id,
					sourceComponent: this.component
				});
				this.dispatchEvent(evt);
			}}
    >
      <slot></slot>
    </button>`;
		}
		constructor() {
			super(...arguments);
			__runInitializers$17(this, _primary_extraInitializers);
		}
		static {
			__runInitializers$17(_classThis, _classExtraInitializers);
		}
	};
	return _classThis;
})();
var __esDecorate$16 = function(ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
	function accept(f) {
		if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected");
		return f;
	}
	var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
	var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
	var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
	var _, done = false;
	for (var i = decorators.length - 1; i >= 0; i--) {
		var context = {};
		for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
		for (var p in contextIn.access) context.access[p] = contextIn.access[p];
		context.addInitializer = function(f) {
			if (done) throw new TypeError("Cannot add initializers after decoration has completed");
			extraInitializers.push(accept(f || null));
		};
		var result = (0, decorators[i])(kind === "accessor" ? {
			get: descriptor.get,
			set: descriptor.set
		} : descriptor[key], context);
		if (kind === "accessor") {
			if (result === void 0) continue;
			if (result === null || typeof result !== "object") throw new TypeError("Object expected");
			if (_ = accept(result.get)) descriptor.get = _;
			if (_ = accept(result.set)) descriptor.set = _;
			if (_ = accept(result.init)) initializers.unshift(_);
		} else if (_ = accept(result)) {
			if (kind === "field") initializers.unshift(_);
			else descriptor[key] = _;
		}
	}
	if (target) Object.defineProperty(target, contextIn.name, descriptor);
	done = true;
};
var __runInitializers$16 = function(thisArg, initializers, value) {
	var useValue = arguments.length > 2;
	for (var i = 0; i < initializers.length; i++) value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
	return useValue ? value : void 0;
};
(() => {
	let _classDecorators = [t$5("a2ui-card")];
	let _classDescriptor;
	let _classExtraInitializers = [];
	let _classThis;
	let _classSuper = Root;
	var Card = class extends _classSuper {
		static {
			_classThis = this;
		}
		static {
			const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
			__esDecorate$16(null, _classDescriptor = { value: _classThis }, _classDecorators, {
				kind: "class",
				name: _classThis.name,
				metadata: _metadata
			}, null, _classExtraInitializers);
			Card = _classThis = _classDescriptor.value;
			if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, {
				enumerable: true,
				configurable: true,
				writable: true,
				value: _metadata
			});
		}
		static {
			this.styles = [structuralStyles, i$10`
      * {
        box-sizing: border-box;
      }

      :host {
        display: block;
        flex: var(--weight);
        min-height: 0;
        overflow: auto;
      }

      section {
        height: 100%;
        width: 100%;
        min-height: 0;
        overflow: auto;

        ::slotted(*) {
          height: 100%;
          width: 100%;
        }
      }
    `];
		}
		render() {
			return b` <section
      class=${e$2(this.theme.components.Card)}
      style=${this.theme.additionalStyles?.Card ? o$2(this.theme.additionalStyles?.Card) : A}
    >
      <slot></slot>
    </section>`;
		}
		static {
			__runInitializers$16(_classThis, _classExtraInitializers);
		}
	};
	return _classThis;
})();
function extractStringValue(val, component, processor, surfaceId) {
	if (val !== null && typeof val === "object") {
		if ("literalString" in val) return val.literalString ?? "";
		else if ("literal" in val && val.literal !== void 0) return val.literal ?? "";
		else if (val && "path" in val && val.path) {
			if (!processor || !component) return "(no model)";
			const textValue = processor.getData(component, val.path, surfaceId ?? A2uiMessageProcessor.DEFAULT_SURFACE_ID);
			if (textValue === null || typeof textValue !== "string") return "";
			return textValue;
		}
	}
	return "";
}
function extractNumberValue(val, component, processor, surfaceId) {
	if (val !== null && typeof val === "object") {
		if ("literalNumber" in val) return val.literalNumber ?? 0;
		else if ("literal" in val && val.literal !== void 0) return val.literal ?? 0;
		else if (val && "path" in val && val.path) {
			if (!processor || !component) return -1;
			let numberValue = processor.getData(component, val.path, surfaceId ?? A2uiMessageProcessor.DEFAULT_SURFACE_ID);
			if (typeof numberValue === "string") {
				numberValue = Number.parseInt(numberValue, 10);
				if (Number.isNaN(numberValue)) numberValue = null;
			}
			if (numberValue === null || typeof numberValue !== "number") return -1;
			return numberValue;
		}
	}
	return 0;
}
var __esDecorate$15 = function(ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
	function accept(f) {
		if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected");
		return f;
	}
	var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
	var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
	var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
	var _, done = false;
	for (var i = decorators.length - 1; i >= 0; i--) {
		var context = {};
		for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
		for (var p in contextIn.access) context.access[p] = contextIn.access[p];
		context.addInitializer = function(f) {
			if (done) throw new TypeError("Cannot add initializers after decoration has completed");
			extraInitializers.push(accept(f || null));
		};
		var result = (0, decorators[i])(kind === "accessor" ? {
			get: descriptor.get,
			set: descriptor.set
		} : descriptor[key], context);
		if (kind === "accessor") {
			if (result === void 0) continue;
			if (result === null || typeof result !== "object") throw new TypeError("Object expected");
			if (_ = accept(result.get)) descriptor.get = _;
			if (_ = accept(result.set)) descriptor.set = _;
			if (_ = accept(result.init)) initializers.unshift(_);
		} else if (_ = accept(result)) {
			if (kind === "field") initializers.unshift(_);
			else descriptor[key] = _;
		}
	}
	if (target) Object.defineProperty(target, contextIn.name, descriptor);
	done = true;
};
var __runInitializers$15 = function(thisArg, initializers, value) {
	var useValue = arguments.length > 2;
	for (var i = 0; i < initializers.length; i++) value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
	return useValue ? value : void 0;
};
(() => {
	let _classDecorators = [t$5("a2ui-checkbox")];
	let _classDescriptor;
	let _classExtraInitializers = [];
	let _classThis;
	let _classSuper = Root;
	let _value_decorators;
	let _value_initializers = [];
	let _value_extraInitializers = [];
	let _label_decorators;
	let _label_initializers = [];
	let _label_extraInitializers = [];
	var Checkbox = class extends _classSuper {
		static {
			_classThis = this;
		}
		static {
			const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
			_value_decorators = [n$9()];
			_label_decorators = [n$9()];
			__esDecorate$15(this, null, _value_decorators, {
				kind: "accessor",
				name: "value",
				static: false,
				private: false,
				access: {
					has: (obj) => "value" in obj,
					get: (obj) => obj.value,
					set: (obj, value) => {
						obj.value = value;
					}
				},
				metadata: _metadata
			}, _value_initializers, _value_extraInitializers);
			__esDecorate$15(this, null, _label_decorators, {
				kind: "accessor",
				name: "label",
				static: false,
				private: false,
				access: {
					has: (obj) => "label" in obj,
					get: (obj) => obj.label,
					set: (obj, value) => {
						obj.label = value;
					}
				},
				metadata: _metadata
			}, _label_initializers, _label_extraInitializers);
			__esDecorate$15(null, _classDescriptor = { value: _classThis }, _classDecorators, {
				kind: "class",
				name: _classThis.name,
				metadata: _metadata
			}, null, _classExtraInitializers);
			Checkbox = _classThis = _classDescriptor.value;
			if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, {
				enumerable: true,
				configurable: true,
				writable: true,
				value: _metadata
			});
		}
		#value_accessor_storage = __runInitializers$15(this, _value_initializers, null);
		get value() {
			return this.#value_accessor_storage;
		}
		set value(value) {
			this.#value_accessor_storage = value;
		}
		#label_accessor_storage = (__runInitializers$15(this, _value_extraInitializers), __runInitializers$15(this, _label_initializers, null));
		get label() {
			return this.#label_accessor_storage;
		}
		set label(value) {
			this.#label_accessor_storage = value;
		}
		static {
			this.styles = [structuralStyles, i$10`
      * {
        box-sizing: border-box;
      }

      :host {
        display: block;
        flex: var(--weight);
        min-height: 0;
        overflow: auto;
      }

      input {
        display: block;
        width: 100%;
      }

      .description {
        font-size: 14px;
        margin-bottom: 4px;
      }
    `];
		}
		#setBoundValue(value) {
			if (!this.value || !this.processor) return;
			if (!("path" in this.value)) return;
			if (!this.value.path) return;
			this.processor.setData(this.component, this.value.path, value, this.surfaceId ?? A2uiMessageProcessor.DEFAULT_SURFACE_ID);
		}
		#renderField(value) {
			return b` <section
      class=${e$2(this.theme.components.CheckBox.container)}
      style=${this.theme.additionalStyles?.CheckBox ? o$2(this.theme.additionalStyles?.CheckBox) : A}
    >
      <input
        class=${e$2(this.theme.components.CheckBox.element)}
        autocomplete="off"
        @input=${(evt) => {
				if (!(evt.target instanceof HTMLInputElement)) return;
				this.#setBoundValue(evt.target.checked);
			}}
        id="data"
        type="checkbox"
        .checked=${value}
      />
      <label class=${e$2(this.theme.components.CheckBox.label)} for="data"
        >${extractStringValue(this.label, this.component, this.processor, this.surfaceId)}</label
      >
    </section>`;
		}
		render() {
			if (this.value && typeof this.value === "object") {
				if ("literalBoolean" in this.value && this.value.literalBoolean) return this.#renderField(this.value.literalBoolean);
				else if ("literal" in this.value && this.value.literal !== void 0) return this.#renderField(this.value.literal);
				else if (this.value && "path" in this.value && this.value.path) {
					if (!this.processor || !this.component) return b`(no model)`;
					const textValue = this.processor.getData(this.component, this.value.path, this.surfaceId ?? A2uiMessageProcessor.DEFAULT_SURFACE_ID);
					if (textValue === null) return b`Invalid label`;
					if (typeof textValue !== "boolean") return b`Invalid label`;
					return this.#renderField(textValue);
				}
			}
			return A;
		}
		constructor() {
			super(...arguments);
			__runInitializers$15(this, _label_extraInitializers);
		}
		static {
			__runInitializers$15(_classThis, _classExtraInitializers);
		}
	};
	return _classThis;
})();
var __esDecorate$14 = function(ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
	function accept(f) {
		if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected");
		return f;
	}
	var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
	var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
	var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
	var _, done = false;
	for (var i = decorators.length - 1; i >= 0; i--) {
		var context = {};
		for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
		for (var p in contextIn.access) context.access[p] = contextIn.access[p];
		context.addInitializer = function(f) {
			if (done) throw new TypeError("Cannot add initializers after decoration has completed");
			extraInitializers.push(accept(f || null));
		};
		var result = (0, decorators[i])(kind === "accessor" ? {
			get: descriptor.get,
			set: descriptor.set
		} : descriptor[key], context);
		if (kind === "accessor") {
			if (result === void 0) continue;
			if (result === null || typeof result !== "object") throw new TypeError("Object expected");
			if (_ = accept(result.get)) descriptor.get = _;
			if (_ = accept(result.set)) descriptor.set = _;
			if (_ = accept(result.init)) initializers.unshift(_);
		} else if (_ = accept(result)) {
			if (kind === "field") initializers.unshift(_);
			else descriptor[key] = _;
		}
	}
	if (target) Object.defineProperty(target, contextIn.name, descriptor);
	done = true;
};
var __runInitializers$14 = function(thisArg, initializers, value) {
	var useValue = arguments.length > 2;
	for (var i = 0; i < initializers.length; i++) value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
	return useValue ? value : void 0;
};
(() => {
	let _classDecorators = [t$5("a2ui-column")];
	let _classDescriptor;
	let _classExtraInitializers = [];
	let _classThis;
	let _classSuper = Root;
	let _alignment_decorators;
	let _alignment_initializers = [];
	let _alignment_extraInitializers = [];
	let _distribution_decorators;
	let _distribution_initializers = [];
	let _distribution_extraInitializers = [];
	var Column = class extends _classSuper {
		static {
			_classThis = this;
		}
		static {
			const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
			_alignment_decorators = [n$9({
				reflect: true,
				type: String
			})];
			_distribution_decorators = [n$9({
				reflect: true,
				type: String
			})];
			__esDecorate$14(this, null, _alignment_decorators, {
				kind: "accessor",
				name: "alignment",
				static: false,
				private: false,
				access: {
					has: (obj) => "alignment" in obj,
					get: (obj) => obj.alignment,
					set: (obj, value) => {
						obj.alignment = value;
					}
				},
				metadata: _metadata
			}, _alignment_initializers, _alignment_extraInitializers);
			__esDecorate$14(this, null, _distribution_decorators, {
				kind: "accessor",
				name: "distribution",
				static: false,
				private: false,
				access: {
					has: (obj) => "distribution" in obj,
					get: (obj) => obj.distribution,
					set: (obj, value) => {
						obj.distribution = value;
					}
				},
				metadata: _metadata
			}, _distribution_initializers, _distribution_extraInitializers);
			__esDecorate$14(null, _classDescriptor = { value: _classThis }, _classDecorators, {
				kind: "class",
				name: _classThis.name,
				metadata: _metadata
			}, null, _classExtraInitializers);
			Column = _classThis = _classDescriptor.value;
			if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, {
				enumerable: true,
				configurable: true,
				writable: true,
				value: _metadata
			});
		}
		#alignment_accessor_storage = __runInitializers$14(this, _alignment_initializers, "stretch");
		get alignment() {
			return this.#alignment_accessor_storage;
		}
		set alignment(value) {
			this.#alignment_accessor_storage = value;
		}
		#distribution_accessor_storage = (__runInitializers$14(this, _alignment_extraInitializers), __runInitializers$14(this, _distribution_initializers, "start"));
		get distribution() {
			return this.#distribution_accessor_storage;
		}
		set distribution(value) {
			this.#distribution_accessor_storage = value;
		}
		static {
			this.styles = [structuralStyles, i$10`
      * {
        box-sizing: border-box;
      }

      :host {
        display: flex;
        flex: var(--weight);
      }

      section {
        display: flex;
        flex-direction: column;
        min-width: 100%;
        height: 100%;
      }

      :host([alignment='start']) section {
        align-items: start;
      }

      :host([alignment='center']) section {
        align-items: center;
      }

      :host([alignment='end']) section {
        align-items: end;
      }

      :host([alignment='stretch']) section {
        align-items: stretch;
      }

      :host([distribution='start']) section {
        justify-content: start;
      }

      :host([distribution='center']) section {
        justify-content: center;
      }

      :host([distribution='end']) section {
        justify-content: end;
      }

      :host([distribution='spaceBetween']) section {
        justify-content: space-between;
      }

      :host([distribution='spaceAround']) section {
        justify-content: space-around;
      }

      :host([distribution='spaceEvenly']) section {
        justify-content: space-evenly;
      }
    `];
		}
		render() {
			return b`<section
      class=${e$2(this.theme.components.Column)}
      style=${this.theme.additionalStyles?.Column ? o$2(this.theme.additionalStyles?.Column) : A}
    >
      <slot></slot>
    </section>`;
		}
		constructor() {
			super(...arguments);
			__runInitializers$14(this, _distribution_extraInitializers);
		}
		static {
			__runInitializers$14(_classThis, _classExtraInitializers);
		}
	};
	return _classThis;
})();
var __esDecorate$13 = function(ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
	function accept(f) {
		if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected");
		return f;
	}
	var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
	var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
	var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
	var _, done = false;
	for (var i = decorators.length - 1; i >= 0; i--) {
		var context = {};
		for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
		for (var p in contextIn.access) context.access[p] = contextIn.access[p];
		context.addInitializer = function(f) {
			if (done) throw new TypeError("Cannot add initializers after decoration has completed");
			extraInitializers.push(accept(f || null));
		};
		var result = (0, decorators[i])(kind === "accessor" ? {
			get: descriptor.get,
			set: descriptor.set
		} : descriptor[key], context);
		if (kind === "accessor") {
			if (result === void 0) continue;
			if (result === null || typeof result !== "object") throw new TypeError("Object expected");
			if (_ = accept(result.get)) descriptor.get = _;
			if (_ = accept(result.set)) descriptor.set = _;
			if (_ = accept(result.init)) initializers.unshift(_);
		} else if (_ = accept(result)) {
			if (kind === "field") initializers.unshift(_);
			else descriptor[key] = _;
		}
	}
	if (target) Object.defineProperty(target, contextIn.name, descriptor);
	done = true;
};
var __runInitializers$13 = function(thisArg, initializers, value) {
	var useValue = arguments.length > 2;
	for (var i = 0; i < initializers.length; i++) value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
	return useValue ? value : void 0;
};
(() => {
	let _classDecorators = [t$5("a2ui-datetimeinput")];
	let _classDescriptor;
	let _classExtraInitializers = [];
	let _classThis;
	let _classSuper = Root;
	let _value_decorators;
	let _value_initializers = [];
	let _value_extraInitializers = [];
	let _label_decorators;
	let _label_initializers = [];
	let _label_extraInitializers = [];
	let _enableDate_decorators;
	let _enableDate_initializers = [];
	let _enableDate_extraInitializers = [];
	let _enableTime_decorators;
	let _enableTime_initializers = [];
	let _enableTime_extraInitializers = [];
	var DateTimeInput = class extends _classSuper {
		static {
			_classThis = this;
		}
		static {
			const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
			_value_decorators = [n$9()];
			_label_decorators = [n$9()];
			_enableDate_decorators = [n$9({
				reflect: false,
				type: Boolean
			})];
			_enableTime_decorators = [n$9({
				reflect: false,
				type: Boolean
			})];
			__esDecorate$13(this, null, _value_decorators, {
				kind: "accessor",
				name: "value",
				static: false,
				private: false,
				access: {
					has: (obj) => "value" in obj,
					get: (obj) => obj.value,
					set: (obj, value) => {
						obj.value = value;
					}
				},
				metadata: _metadata
			}, _value_initializers, _value_extraInitializers);
			__esDecorate$13(this, null, _label_decorators, {
				kind: "accessor",
				name: "label",
				static: false,
				private: false,
				access: {
					has: (obj) => "label" in obj,
					get: (obj) => obj.label,
					set: (obj, value) => {
						obj.label = value;
					}
				},
				metadata: _metadata
			}, _label_initializers, _label_extraInitializers);
			__esDecorate$13(this, null, _enableDate_decorators, {
				kind: "accessor",
				name: "enableDate",
				static: false,
				private: false,
				access: {
					has: (obj) => "enableDate" in obj,
					get: (obj) => obj.enableDate,
					set: (obj, value) => {
						obj.enableDate = value;
					}
				},
				metadata: _metadata
			}, _enableDate_initializers, _enableDate_extraInitializers);
			__esDecorate$13(this, null, _enableTime_decorators, {
				kind: "accessor",
				name: "enableTime",
				static: false,
				private: false,
				access: {
					has: (obj) => "enableTime" in obj,
					get: (obj) => obj.enableTime,
					set: (obj, value) => {
						obj.enableTime = value;
					}
				},
				metadata: _metadata
			}, _enableTime_initializers, _enableTime_extraInitializers);
			__esDecorate$13(null, _classDescriptor = { value: _classThis }, _classDecorators, {
				kind: "class",
				name: _classThis.name,
				metadata: _metadata
			}, null, _classExtraInitializers);
			DateTimeInput = _classThis = _classDescriptor.value;
			if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, {
				enumerable: true,
				configurable: true,
				writable: true,
				value: _metadata
			});
		}
		#value_accessor_storage = __runInitializers$13(this, _value_initializers, null);
		get value() {
			return this.#value_accessor_storage;
		}
		set value(value) {
			this.#value_accessor_storage = value;
		}
		#label_accessor_storage = (__runInitializers$13(this, _value_extraInitializers), __runInitializers$13(this, _label_initializers, null));
		get label() {
			return this.#label_accessor_storage;
		}
		set label(value) {
			this.#label_accessor_storage = value;
		}
		#enableDate_accessor_storage = (__runInitializers$13(this, _label_extraInitializers), __runInitializers$13(this, _enableDate_initializers, true));
		get enableDate() {
			return this.#enableDate_accessor_storage;
		}
		set enableDate(value) {
			this.#enableDate_accessor_storage = value;
		}
		#enableTime_accessor_storage = (__runInitializers$13(this, _enableDate_extraInitializers), __runInitializers$13(this, _enableTime_initializers, true));
		get enableTime() {
			return this.#enableTime_accessor_storage;
		}
		set enableTime(value) {
			this.#enableTime_accessor_storage = value;
		}
		static {
			this.styles = [structuralStyles, i$10`
      * {
        box-sizing: border-box;
      }

      :host {
        display: block;
        flex: var(--weight);
        min-height: 0;
        overflow: auto;
      }

      input {
        display: block;
        border-radius: 8px;
        padding: 8px;
        border: 1px solid #ccc;
        width: 100%;
        color: #333;
      }

      input::-webkit-datetime-edit,
      input::-webkit-datetime-edit-fields-wrapper {
        color: #333;
      }
    `];
		}
		#setBoundValue(value) {
			if (!this.value || !this.processor) return;
			if (!("path" in this.value)) return;
			if (!this.value.path) return;
			this.processor.setData(this.component, this.value.path, value, this.surfaceId ?? A2uiMessageProcessor.DEFAULT_SURFACE_ID);
		}
		#renderField(value) {
			return b`<section class=${e$2(this.theme.components.DateTimeInput.container)}>
      <label for="data" class=${e$2(this.theme.components.DateTimeInput.label)}
        >${this.#getPlaceholderText()}</label
      >
      <input
        autocomplete="off"
        class=${e$2(this.theme.components.DateTimeInput.element)}
        style=${this.theme.additionalStyles?.DateTimeInput ? o$2(this.theme.additionalStyles?.DateTimeInput) : A}
        @input=${(evt) => {
				if (!(evt.target instanceof HTMLInputElement)) return;
				this.#setBoundValue(evt.target.value);
			}}
        id="data"
        name="data"
        .value=${this.#formatInputValue(value)}
        .placeholder=${this.#getPlaceholderText()}
        .type=${this.#getInputType()}
      />
    </section>`;
		}
		#getInputType() {
			if (this.enableDate && this.enableTime) return "datetime-local";
			else if (this.enableDate) return "date";
			else if (this.enableTime) return "time";
			return "datetime-local";
		}
		#formatInputValue(value) {
			const inputType = this.#getInputType();
			const date = value ? new Date(value) : null;
			if (!date || isNaN(date.getTime())) return "";
			const year = this.#padNumber(date.getFullYear());
			const month = this.#padNumber(date.getMonth() + 1);
			const day = this.#padNumber(date.getDate());
			const hours = this.#padNumber(date.getHours());
			const minutes = this.#padNumber(date.getMinutes());
			if (inputType === "date") return `${year}-${month}-${day}`;
			else if (inputType === "time") return `${hours}:${minutes}`;
			return `${year}-${month}-${day}T${hours}:${minutes}`;
		}
		#padNumber(value) {
			return value.toString().padStart(2, "0");
		}
		#getPlaceholderText() {
			const inputType = this.#getInputType();
			if (inputType === "date") return "Date";
			else if (inputType === "time") return "Time";
			return "Date & Time";
		}
		render() {
			if (this.value && typeof this.value === "object") {
				if ("literalString" in this.value && this.value.literalString) return this.#renderField(this.value.literalString);
				else if ("literal" in this.value && this.value.literal !== void 0) return this.#renderField(this.value.literal);
				else if (this.value && "path" in this.value && this.value.path) {
					if (!this.processor || !this.component) return b`(no model)`;
					const textValue = this.processor.getData(this.component, this.value.path, this.surfaceId ?? A2uiMessageProcessor.DEFAULT_SURFACE_ID);
					if (typeof textValue !== "string") return b`(invalid)`;
					return this.#renderField(textValue);
				}
			}
			return A;
		}
		constructor() {
			super(...arguments);
			__runInitializers$13(this, _enableTime_extraInitializers);
		}
		static {
			__runInitializers$13(_classThis, _classExtraInitializers);
		}
	};
	return _classThis;
})();
var __esDecorate$12 = function(ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
	function accept(f) {
		if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected");
		return f;
	}
	var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
	var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
	var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
	var _, done = false;
	for (var i = decorators.length - 1; i >= 0; i--) {
		var context = {};
		for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
		for (var p in contextIn.access) context.access[p] = contextIn.access[p];
		context.addInitializer = function(f) {
			if (done) throw new TypeError("Cannot add initializers after decoration has completed");
			extraInitializers.push(accept(f || null));
		};
		var result = (0, decorators[i])(kind === "accessor" ? {
			get: descriptor.get,
			set: descriptor.set
		} : descriptor[key], context);
		if (kind === "accessor") {
			if (result === void 0) continue;
			if (result === null || typeof result !== "object") throw new TypeError("Object expected");
			if (_ = accept(result.get)) descriptor.get = _;
			if (_ = accept(result.set)) descriptor.set = _;
			if (_ = accept(result.init)) initializers.unshift(_);
		} else if (_ = accept(result)) {
			if (kind === "field") initializers.unshift(_);
			else descriptor[key] = _;
		}
	}
	if (target) Object.defineProperty(target, contextIn.name, descriptor);
	done = true;
};
var __runInitializers$12 = function(thisArg, initializers, value) {
	var useValue = arguments.length > 2;
	for (var i = 0; i < initializers.length; i++) value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
	return useValue ? value : void 0;
};
(() => {
	let _classDecorators = [t$5("a2ui-divider")];
	let _classDescriptor;
	let _classExtraInitializers = [];
	let _classThis;
	let _classSuper = Root;
	let _axis_decorators;
	let _axis_initializers = [];
	let _axis_extraInitializers = [];
	let _color_decorators;
	let _color_initializers = [];
	let _color_extraInitializers = [];
	let _thickness_decorators;
	let _thickness_initializers = [];
	let _thickness_extraInitializers = [];
	var Divider = class extends _classSuper {
		static {
			_classThis = this;
		}
		static {
			const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
			_axis_decorators = [n$9()];
			_color_decorators = [n$9()];
			_thickness_decorators = [n$9({ type: Number })];
			__esDecorate$12(this, null, _axis_decorators, {
				kind: "accessor",
				name: "axis",
				static: false,
				private: false,
				access: {
					has: (obj) => "axis" in obj,
					get: (obj) => obj.axis,
					set: (obj, value) => {
						obj.axis = value;
					}
				},
				metadata: _metadata
			}, _axis_initializers, _axis_extraInitializers);
			__esDecorate$12(this, null, _color_decorators, {
				kind: "accessor",
				name: "color",
				static: false,
				private: false,
				access: {
					has: (obj) => "color" in obj,
					get: (obj) => obj.color,
					set: (obj, value) => {
						obj.color = value;
					}
				},
				metadata: _metadata
			}, _color_initializers, _color_extraInitializers);
			__esDecorate$12(this, null, _thickness_decorators, {
				kind: "accessor",
				name: "thickness",
				static: false,
				private: false,
				access: {
					has: (obj) => "thickness" in obj,
					get: (obj) => obj.thickness,
					set: (obj, value) => {
						obj.thickness = value;
					}
				},
				metadata: _metadata
			}, _thickness_initializers, _thickness_extraInitializers);
			__esDecorate$12(null, _classDescriptor = { value: _classThis }, _classDecorators, {
				kind: "class",
				name: _classThis.name,
				metadata: _metadata
			}, null, _classExtraInitializers);
			Divider = _classThis = _classDescriptor.value;
			if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, {
				enumerable: true,
				configurable: true,
				writable: true,
				value: _metadata
			});
		}
		#axis_accessor_storage = __runInitializers$12(this, _axis_initializers, "horizontal");
		get axis() {
			return this.#axis_accessor_storage;
		}
		set axis(value) {
			this.#axis_accessor_storage = value;
		}
		#color_accessor_storage = (__runInitializers$12(this, _axis_extraInitializers), __runInitializers$12(this, _color_initializers, null));
		get color() {
			return this.#color_accessor_storage;
		}
		set color(value) {
			this.#color_accessor_storage = value;
		}
		#thickness_accessor_storage = (__runInitializers$12(this, _color_extraInitializers), __runInitializers$12(this, _thickness_initializers, null));
		get thickness() {
			return this.#thickness_accessor_storage;
		}
		set thickness(value) {
			this.#thickness_accessor_storage = value;
		}
		static {
			this.styles = [structuralStyles, i$10`
      :host {
        display: block;
        min-height: 0;
        overflow: auto;
        align-self: stretch;
      }

      hr,
      .vertical-divider {
        background: #ccc;
        border: none;
      }

      hr {
        height: 1px;
      }

      .vertical-divider {
        width: 1px;
        height: 100%;
      }
    `];
		}
		render() {
			const classes = {
				...typeof this.theme?.components?.Divider === "string" ? { [this.theme.components.Divider]: true } : this.theme?.components?.Divider,
				vertical: this.axis === "vertical",
				horizontal: this.axis !== "vertical"
			};
			const dynamicStyle = {};
			if (this.color) dynamicStyle["background-color"] = this.color;
			if (this.thickness !== null && this.thickness !== void 0) {
				if (this.axis === "vertical") dynamicStyle["width"] = `${this.thickness}px`;
				else dynamicStyle["height"] = `${this.thickness}px`;
			}
			const style = {
				...this.theme?.additionalStyles?.Divider,
				...dynamicStyle
			};
			return this.axis === "vertical" ? b`<div
          class=${e$2({
				...classes,
				"vertical-divider": true
			})}
          style=${o$2(style)}
        ></div>` : b`<hr class=${e$2(classes)} style=${o$2(style)} />`;
		}
		constructor() {
			super(...arguments);
			__runInitializers$12(this, _thickness_extraInitializers);
		}
		static {
			__runInitializers$12(_classThis, _classExtraInitializers);
		}
	};
	return _classThis;
})();
var __esDecorate$11 = function(ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
	function accept(f) {
		if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected");
		return f;
	}
	var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
	var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
	var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
	var _, done = false;
	for (var i = decorators.length - 1; i >= 0; i--) {
		var context = {};
		for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
		for (var p in contextIn.access) context.access[p] = contextIn.access[p];
		context.addInitializer = function(f) {
			if (done) throw new TypeError("Cannot add initializers after decoration has completed");
			extraInitializers.push(accept(f || null));
		};
		var result = (0, decorators[i])(kind === "accessor" ? {
			get: descriptor.get,
			set: descriptor.set
		} : descriptor[key], context);
		if (kind === "accessor") {
			if (result === void 0) continue;
			if (result === null || typeof result !== "object") throw new TypeError("Object expected");
			if (_ = accept(result.get)) descriptor.get = _;
			if (_ = accept(result.set)) descriptor.set = _;
			if (_ = accept(result.init)) initializers.unshift(_);
		} else if (_ = accept(result)) {
			if (kind === "field") initializers.unshift(_);
			else descriptor[key] = _;
		}
	}
	if (target) Object.defineProperty(target, contextIn.name, descriptor);
	done = true;
};
var __runInitializers$11 = function(thisArg, initializers, value) {
	var useValue = arguments.length > 2;
	for (var i = 0; i < initializers.length; i++) value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
	return useValue ? value : void 0;
};
(() => {
	let _classDecorators = [t$5("a2ui-icon")];
	let _classDescriptor;
	let _classExtraInitializers = [];
	let _classThis;
	let _classSuper = Root;
	let _name_decorators;
	let _name_initializers = [];
	let _name_extraInitializers = [];
	var Icon = class extends _classSuper {
		static {
			_classThis = this;
		}
		static {
			const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
			_name_decorators = [n$9()];
			__esDecorate$11(this, null, _name_decorators, {
				kind: "accessor",
				name: "name",
				static: false,
				private: false,
				access: {
					has: (obj) => "name" in obj,
					get: (obj) => obj.name,
					set: (obj, value) => {
						obj.name = value;
					}
				},
				metadata: _metadata
			}, _name_initializers, _name_extraInitializers);
			__esDecorate$11(null, _classDescriptor = { value: _classThis }, _classDecorators, {
				kind: "class",
				name: _classThis.name,
				metadata: _metadata
			}, null, _classExtraInitializers);
			Icon = _classThis = _classDescriptor.value;
			if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, {
				enumerable: true,
				configurable: true,
				writable: true,
				value: _metadata
			});
		}
		#name_accessor_storage = __runInitializers$11(this, _name_initializers, null);
		get name() {
			return this.#name_accessor_storage;
		}
		set name(value) {
			this.#name_accessor_storage = value;
		}
		static {
			this.styles = [structuralStyles, i$10`
      * {
        box-sizing: border-box;
      }

      :host {
        display: block;
        flex: var(--weight);
        min-height: 0;
      }

      .g-icon {
        font-family: 'Material Symbols Outlined';
        font-weight: normal;
        font-style: normal;
        font-size: 24px;
        display: inline-block;
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
      }
    `];
		}
		#renderIcon() {
			if (!this.name) return A;
			const render = (url) => {
				url = url.replace(/([A-Z])/gm, "_$1").toLocaleLowerCase();
				return b`<span class="g-icon">${url}</span>`;
			};
			if (this.name && typeof this.name === "object") {
				if ("literalString" in this.name) return render(this.name.literalString ?? "");
				else if ("literal" in this.name) return render(this.name.literal ?? "");
				else if (this.name && "path" in this.name && this.name.path) {
					if (!this.processor || !this.component) return b`(no model)`;
					const iconName = this.processor.getData(this.component, this.name.path, this.surfaceId ?? A2uiMessageProcessor.DEFAULT_SURFACE_ID);
					if (!iconName) return b`Invalid icon name`;
					if (typeof iconName !== "string") return b`Invalid icon name`;
					return render(iconName);
				}
			}
			return b`(empty)`;
		}
		render() {
			return b`<section
      class=${e$2(this.theme.components.Icon)}
      style=${this.theme.additionalStyles?.Icon ? o$2(this.theme.additionalStyles?.Icon) : A}
    >
      ${this.#renderIcon()}
    </section>`;
		}
		constructor() {
			super(...arguments);
			__runInitializers$11(this, _name_extraInitializers);
		}
		static {
			__runInitializers$11(_classThis, _classExtraInitializers);
		}
	};
	return _classThis;
})();
var __esDecorate$10 = function(ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
	function accept(f) {
		if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected");
		return f;
	}
	var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
	var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
	var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
	var _, done = false;
	for (var i = decorators.length - 1; i >= 0; i--) {
		var context = {};
		for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
		for (var p in contextIn.access) context.access[p] = contextIn.access[p];
		context.addInitializer = function(f) {
			if (done) throw new TypeError("Cannot add initializers after decoration has completed");
			extraInitializers.push(accept(f || null));
		};
		var result = (0, decorators[i])(kind === "accessor" ? {
			get: descriptor.get,
			set: descriptor.set
		} : descriptor[key], context);
		if (kind === "accessor") {
			if (result === void 0) continue;
			if (result === null || typeof result !== "object") throw new TypeError("Object expected");
			if (_ = accept(result.get)) descriptor.get = _;
			if (_ = accept(result.set)) descriptor.set = _;
			if (_ = accept(result.init)) initializers.unshift(_);
		} else if (_ = accept(result)) {
			if (kind === "field") initializers.unshift(_);
			else descriptor[key] = _;
		}
	}
	if (target) Object.defineProperty(target, contextIn.name, descriptor);
	done = true;
};
var __runInitializers$10 = function(thisArg, initializers, value) {
	var useValue = arguments.length > 2;
	for (var i = 0; i < initializers.length; i++) value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
	return useValue ? value : void 0;
};
(() => {
	let _classDecorators = [t$5("a2ui-image")];
	let _classDescriptor;
	let _classExtraInitializers = [];
	let _classThis;
	let _classSuper = Root;
	let _url_decorators;
	let _url_initializers = [];
	let _url_extraInitializers = [];
	let _altText_decorators;
	let _altText_initializers = [];
	let _altText_extraInitializers = [];
	let _usageHint_decorators;
	let _usageHint_initializers = [];
	let _usageHint_extraInitializers = [];
	let _fit_decorators;
	let _fit_initializers = [];
	let _fit_extraInitializers = [];
	var Image = class extends _classSuper {
		static {
			_classThis = this;
		}
		static {
			const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
			_url_decorators = [n$9()];
			_altText_decorators = [n$9()];
			_usageHint_decorators = [n$9()];
			_fit_decorators = [n$9()];
			__esDecorate$10(this, null, _url_decorators, {
				kind: "accessor",
				name: "url",
				static: false,
				private: false,
				access: {
					has: (obj) => "url" in obj,
					get: (obj) => obj.url,
					set: (obj, value) => {
						obj.url = value;
					}
				},
				metadata: _metadata
			}, _url_initializers, _url_extraInitializers);
			__esDecorate$10(this, null, _altText_decorators, {
				kind: "accessor",
				name: "altText",
				static: false,
				private: false,
				access: {
					has: (obj) => "altText" in obj,
					get: (obj) => obj.altText,
					set: (obj, value) => {
						obj.altText = value;
					}
				},
				metadata: _metadata
			}, _altText_initializers, _altText_extraInitializers);
			__esDecorate$10(this, null, _usageHint_decorators, {
				kind: "accessor",
				name: "usageHint",
				static: false,
				private: false,
				access: {
					has: (obj) => "usageHint" in obj,
					get: (obj) => obj.usageHint,
					set: (obj, value) => {
						obj.usageHint = value;
					}
				},
				metadata: _metadata
			}, _usageHint_initializers, _usageHint_extraInitializers);
			__esDecorate$10(this, null, _fit_decorators, {
				kind: "accessor",
				name: "fit",
				static: false,
				private: false,
				access: {
					has: (obj) => "fit" in obj,
					get: (obj) => obj.fit,
					set: (obj, value) => {
						obj.fit = value;
					}
				},
				metadata: _metadata
			}, _fit_initializers, _fit_extraInitializers);
			__esDecorate$10(null, _classDescriptor = { value: _classThis }, _classDecorators, {
				kind: "class",
				name: _classThis.name,
				metadata: _metadata
			}, null, _classExtraInitializers);
			Image = _classThis = _classDescriptor.value;
			if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, {
				enumerable: true,
				configurable: true,
				writable: true,
				value: _metadata
			});
		}
		#url_accessor_storage = __runInitializers$10(this, _url_initializers, null);
		get url() {
			return this.#url_accessor_storage;
		}
		set url(value) {
			this.#url_accessor_storage = value;
		}
		#altText_accessor_storage = (__runInitializers$10(this, _url_extraInitializers), __runInitializers$10(this, _altText_initializers, null));
		get altText() {
			return this.#altText_accessor_storage;
		}
		set altText(value) {
			this.#altText_accessor_storage = value;
		}
		#usageHint_accessor_storage = (__runInitializers$10(this, _altText_extraInitializers), __runInitializers$10(this, _usageHint_initializers, null));
		get usageHint() {
			return this.#usageHint_accessor_storage;
		}
		set usageHint(value) {
			this.#usageHint_accessor_storage = value;
		}
		#fit_accessor_storage = (__runInitializers$10(this, _usageHint_extraInitializers), __runInitializers$10(this, _fit_initializers, null));
		get fit() {
			return this.#fit_accessor_storage;
		}
		set fit(value) {
			this.#fit_accessor_storage = value;
		}
		static {
			this.styles = [structuralStyles, i$10`
      * {
        box-sizing: border-box;
      }

      :host {
        display: block;
        flex: var(--weight);
        min-height: 0;
        overflow: auto;
      }

      img {
        display: block;
        width: 100%;
        height: 100%;
        object-fit: var(--object-fit, fill);
      }
    `];
		}
		#renderImage() {
			if (!this.url) return A;
			const render = (url) => {
				let resolvedAlt = "";
				if (this.altText) {
					if (typeof this.altText === "object") {
						if ("literalString" in this.altText) resolvedAlt = this.altText.literalString ?? "";
						else if ("literal" in this.altText) resolvedAlt = this.altText.literal ?? "";
						else if ("path" in this.altText && this.altText.path) {
							if (this.processor && this.component) {
								const data = this.processor.getData(this.component, this.altText.path, this.surfaceId ?? A2uiMessageProcessor.DEFAULT_SURFACE_ID);
								if (typeof data === "string") resolvedAlt = data;
							}
						}
					}
				}
				return b`<img src=${url} alt=${resolvedAlt} />`;
			};
			if (this.url && typeof this.url === "object") {
				if ("literalString" in this.url) return render(this.url.literalString ?? "");
				else if ("literal" in this.url) return render(this.url.literal ?? "");
				else if (this.url && "path" in this.url && this.url.path) {
					if (!this.processor || !this.component) return b`(no model)`;
					const imageUrl = this.processor.getData(this.component, this.url.path, this.surfaceId ?? A2uiMessageProcessor.DEFAULT_SURFACE_ID);
					if (!imageUrl) return b`Invalid image URL`;
					if (typeof imageUrl !== "string") return b`Invalid image URL`;
					return render(imageUrl);
				}
			}
			return b`(empty)`;
		}
		render() {
			const classes = merge(this.theme.components.Image.all, this.usageHint ? this.theme.components.Image[this.usageHint] : {});
			return b`<section
      class=${e$2(classes)}
      style=${o$2({
				...this.theme.additionalStyles?.Image ?? {},
				"--object-fit": this.fit ?? "fill"
			})}
    >
      ${this.#renderImage()}
    </section>`;
		}
		constructor() {
			super(...arguments);
			__runInitializers$10(this, _fit_extraInitializers);
		}
		static {
			__runInitializers$10(_classThis, _classExtraInitializers);
		}
	};
	return _classThis;
})();
var __esDecorate$9 = function(ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
	function accept(f) {
		if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected");
		return f;
	}
	var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
	var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
	var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
	var _, done = false;
	for (var i = decorators.length - 1; i >= 0; i--) {
		var context = {};
		for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
		for (var p in contextIn.access) context.access[p] = contextIn.access[p];
		context.addInitializer = function(f) {
			if (done) throw new TypeError("Cannot add initializers after decoration has completed");
			extraInitializers.push(accept(f || null));
		};
		var result = (0, decorators[i])(kind === "accessor" ? {
			get: descriptor.get,
			set: descriptor.set
		} : descriptor[key], context);
		if (kind === "accessor") {
			if (result === void 0) continue;
			if (result === null || typeof result !== "object") throw new TypeError("Object expected");
			if (_ = accept(result.get)) descriptor.get = _;
			if (_ = accept(result.set)) descriptor.set = _;
			if (_ = accept(result.init)) initializers.unshift(_);
		} else if (_ = accept(result)) {
			if (kind === "field") initializers.unshift(_);
			else descriptor[key] = _;
		}
	}
	if (target) Object.defineProperty(target, contextIn.name, descriptor);
	done = true;
};
var __runInitializers$9 = function(thisArg, initializers, value) {
	var useValue = arguments.length > 2;
	for (var i = 0; i < initializers.length; i++) value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
	return useValue ? value : void 0;
};
(() => {
	let _classDecorators = [t$5("a2ui-list")];
	let _classDescriptor;
	let _classExtraInitializers = [];
	let _classThis;
	let _classSuper = Root;
	let _direction_decorators;
	let _direction_initializers = [];
	let _direction_extraInitializers = [];
	var List = class extends _classSuper {
		static {
			_classThis = this;
		}
		static {
			const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
			_direction_decorators = [n$9({
				reflect: true,
				type: String
			})];
			__esDecorate$9(this, null, _direction_decorators, {
				kind: "accessor",
				name: "direction",
				static: false,
				private: false,
				access: {
					has: (obj) => "direction" in obj,
					get: (obj) => obj.direction,
					set: (obj, value) => {
						obj.direction = value;
					}
				},
				metadata: _metadata
			}, _direction_initializers, _direction_extraInitializers);
			__esDecorate$9(null, _classDescriptor = { value: _classThis }, _classDecorators, {
				kind: "class",
				name: _classThis.name,
				metadata: _metadata
			}, null, _classExtraInitializers);
			List = _classThis = _classDescriptor.value;
			if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, {
				enumerable: true,
				configurable: true,
				writable: true,
				value: _metadata
			});
		}
		#direction_accessor_storage = __runInitializers$9(this, _direction_initializers, "vertical");
		get direction() {
			return this.#direction_accessor_storage;
		}
		set direction(value) {
			this.#direction_accessor_storage = value;
		}
		static {
			this.styles = [structuralStyles, i$10`
      * {
        box-sizing: border-box;
      }

      :host {
        display: block;
        flex: var(--weight);
        min-height: 0;
        overflow: auto;
      }

      :host([direction='vertical']) section {
        display: grid;
      }

      :host([direction='horizontal']) section {
        display: flex;
        max-width: 100%;
        overflow-x: scroll;
        overflow-y: hidden;
        scrollbar-width: none;

        > ::slotted(*) {
          flex: 1 0 fit-content;
          max-width: min(80%, 400px);
        }
      }
    `];
		}
		render() {
			return b`<section
      class=${e$2(this.theme.components.List)}
      style=${this.theme.additionalStyles?.List ? o$2(this.theme.additionalStyles?.List) : A}
    >
      <slot></slot>
    </section>`;
		}
		constructor() {
			super(...arguments);
			__runInitializers$9(this, _direction_extraInitializers);
		}
		static {
			__runInitializers$9(_classThis, _classExtraInitializers);
		}
	};
	return _classThis;
})();
var __esDecorate$8 = function(ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
	function accept(f) {
		if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected");
		return f;
	}
	var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
	var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
	var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
	var _, done = false;
	for (var i = decorators.length - 1; i >= 0; i--) {
		var context = {};
		for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
		for (var p in contextIn.access) context.access[p] = contextIn.access[p];
		context.addInitializer = function(f) {
			if (done) throw new TypeError("Cannot add initializers after decoration has completed");
			extraInitializers.push(accept(f || null));
		};
		var result = (0, decorators[i])(kind === "accessor" ? {
			get: descriptor.get,
			set: descriptor.set
		} : descriptor[key], context);
		if (kind === "accessor") {
			if (result === void 0) continue;
			if (result === null || typeof result !== "object") throw new TypeError("Object expected");
			if (_ = accept(result.get)) descriptor.get = _;
			if (_ = accept(result.set)) descriptor.set = _;
			if (_ = accept(result.init)) initializers.unshift(_);
		} else if (_ = accept(result)) {
			if (kind === "field") initializers.unshift(_);
			else descriptor[key] = _;
		}
	}
	if (target) Object.defineProperty(target, contextIn.name, descriptor);
	done = true;
};
var __runInitializers$8 = function(thisArg, initializers, value) {
	var useValue = arguments.length > 2;
	for (var i = 0; i < initializers.length; i++) value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
	return useValue ? value : void 0;
};
(() => {
	let _classDecorators = [t$5("a2ui-multiplechoice")];
	let _classDescriptor;
	let _classExtraInitializers = [];
	let _classThis;
	let _classSuper = Root;
	let _description_decorators;
	let _description_initializers = [];
	let _description_extraInitializers = [];
	let _options_decorators;
	let _options_initializers = [];
	let _options_extraInitializers = [];
	let _selections_decorators;
	let _selections_initializers = [];
	let _selections_extraInitializers = [];
	let _variant_decorators;
	let _variant_initializers = [];
	let _variant_extraInitializers = [];
	let _filterable_decorators;
	let _filterable_initializers = [];
	let _filterable_extraInitializers = [];
	let _isOpen_decorators;
	let _isOpen_initializers = [];
	let _isOpen_extraInitializers = [];
	let _filterText_decorators;
	let _filterText_initializers = [];
	let _filterText_extraInitializers = [];
	var MultipleChoice = class extends _classSuper {
		static {
			_classThis = this;
		}
		static {
			const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
			_description_decorators = [n$9()];
			_options_decorators = [n$9()];
			_selections_decorators = [n$9()];
			_variant_decorators = [n$9()];
			_filterable_decorators = [n$9({ type: Boolean })];
			_isOpen_decorators = [r$7()];
			_filterText_decorators = [r$7()];
			__esDecorate$8(this, null, _description_decorators, {
				kind: "accessor",
				name: "description",
				static: false,
				private: false,
				access: {
					has: (obj) => "description" in obj,
					get: (obj) => obj.description,
					set: (obj, value) => {
						obj.description = value;
					}
				},
				metadata: _metadata
			}, _description_initializers, _description_extraInitializers);
			__esDecorate$8(this, null, _options_decorators, {
				kind: "accessor",
				name: "options",
				static: false,
				private: false,
				access: {
					has: (obj) => "options" in obj,
					get: (obj) => obj.options,
					set: (obj, value) => {
						obj.options = value;
					}
				},
				metadata: _metadata
			}, _options_initializers, _options_extraInitializers);
			__esDecorate$8(this, null, _selections_decorators, {
				kind: "accessor",
				name: "selections",
				static: false,
				private: false,
				access: {
					has: (obj) => "selections" in obj,
					get: (obj) => obj.selections,
					set: (obj, value) => {
						obj.selections = value;
					}
				},
				metadata: _metadata
			}, _selections_initializers, _selections_extraInitializers);
			__esDecorate$8(this, null, _variant_decorators, {
				kind: "accessor",
				name: "variant",
				static: false,
				private: false,
				access: {
					has: (obj) => "variant" in obj,
					get: (obj) => obj.variant,
					set: (obj, value) => {
						obj.variant = value;
					}
				},
				metadata: _metadata
			}, _variant_initializers, _variant_extraInitializers);
			__esDecorate$8(this, null, _filterable_decorators, {
				kind: "accessor",
				name: "filterable",
				static: false,
				private: false,
				access: {
					has: (obj) => "filterable" in obj,
					get: (obj) => obj.filterable,
					set: (obj, value) => {
						obj.filterable = value;
					}
				},
				metadata: _metadata
			}, _filterable_initializers, _filterable_extraInitializers);
			__esDecorate$8(this, null, _isOpen_decorators, {
				kind: "accessor",
				name: "isOpen",
				static: false,
				private: false,
				access: {
					has: (obj) => "isOpen" in obj,
					get: (obj) => obj.isOpen,
					set: (obj, value) => {
						obj.isOpen = value;
					}
				},
				metadata: _metadata
			}, _isOpen_initializers, _isOpen_extraInitializers);
			__esDecorate$8(this, null, _filterText_decorators, {
				kind: "accessor",
				name: "filterText",
				static: false,
				private: false,
				access: {
					has: (obj) => "filterText" in obj,
					get: (obj) => obj.filterText,
					set: (obj, value) => {
						obj.filterText = value;
					}
				},
				metadata: _metadata
			}, _filterText_initializers, _filterText_extraInitializers);
			__esDecorate$8(null, _classDescriptor = { value: _classThis }, _classDecorators, {
				kind: "class",
				name: _classThis.name,
				metadata: _metadata
			}, null, _classExtraInitializers);
			MultipleChoice = _classThis = _classDescriptor.value;
			if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, {
				enumerable: true,
				configurable: true,
				writable: true,
				value: _metadata
			});
		}
		#description_accessor_storage = __runInitializers$8(this, _description_initializers, null);
		get description() {
			return this.#description_accessor_storage;
		}
		set description(value) {
			this.#description_accessor_storage = value;
		}
		#options_accessor_storage = (__runInitializers$8(this, _description_extraInitializers), __runInitializers$8(this, _options_initializers, []));
		get options() {
			return this.#options_accessor_storage;
		}
		set options(value) {
			this.#options_accessor_storage = value;
		}
		#selections_accessor_storage = (__runInitializers$8(this, _options_extraInitializers), __runInitializers$8(this, _selections_initializers, []));
		get selections() {
			return this.#selections_accessor_storage;
		}
		set selections(value) {
			this.#selections_accessor_storage = value;
		}
		#variant_accessor_storage = (__runInitializers$8(this, _selections_extraInitializers), __runInitializers$8(this, _variant_initializers, "checkbox"));
		get variant() {
			return this.#variant_accessor_storage;
		}
		set variant(value) {
			this.#variant_accessor_storage = value;
		}
		#filterable_accessor_storage = (__runInitializers$8(this, _variant_extraInitializers), __runInitializers$8(this, _filterable_initializers, false));
		get filterable() {
			return this.#filterable_accessor_storage;
		}
		set filterable(value) {
			this.#filterable_accessor_storage = value;
		}
		#isOpen_accessor_storage = (__runInitializers$8(this, _filterable_extraInitializers), __runInitializers$8(this, _isOpen_initializers, false));
		get isOpen() {
			return this.#isOpen_accessor_storage;
		}
		set isOpen(value) {
			this.#isOpen_accessor_storage = value;
		}
		#filterText_accessor_storage = (__runInitializers$8(this, _isOpen_extraInitializers), __runInitializers$8(this, _filterText_initializers, ""));
		get filterText() {
			return this.#filterText_accessor_storage;
		}
		set filterText(value) {
			this.#filterText_accessor_storage = value;
		}
		static {
			this.styles = [structuralStyles, i$10`
      * {
        box-sizing: border-box;
      }

      :host {
        display: block;
        flex: var(--weight);
        min-height: 0;
        position: relative;
        font-family: 'Google Sans', 'Roboto', sans-serif;
      }

      .container {
        display: flex;
        flex-direction: column;
        gap: 4px;
        position: relative;
      }

      /* Header / Trigger */
      .dropdown-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 12px 16px;
        background: var(--md-sys-color-surface);
        border: 1px solid var(--md-sys-color-outline-variant);
        border-radius: 8px;
        cursor: pointer;
        user-select: none;
        transition: background-color 0.2s;
        box-shadow: var(--md-sys-elevation-level1);
      }

      .dropdown-header:hover {
        background: var(--md-sys-color-surface-container-low);
      }

      .header-text {
        font-size: 1rem;
        color: var(--md-sys-color-on-surface);
        font-weight: 400;
      }

      .chevron {
        color: var(--md-sys-color-primary);
        font-size: 1.2rem;
        transition: transform 0.2s ease;
      }

      .chevron.open {
        transform: rotate(180deg);
      }

      /* Dropdown Wrapper */
      .dropdown-wrapper {
        background: var(--md-sys-color-surface);
        border: 1px solid var(--md-sys-color-outline-variant);
        border-radius: 8px;
        box-shadow: var(--md-sys-elevation-level2);
        padding: 0;
        display: none;
        flex-direction: column;
        margin-top: 4px;
        max-height: 300px;
        transition: opacity 0.2s ease-out;
        overflow: hidden; /* contain children */
      }

      .dropdown-wrapper.open {
        display: flex;
        border: 1px solid var(--md-sys-color-outline-variant);
      }

      /* Scrollable Area for Options */
      .options-scroll-container {
        overflow-y: auto;
        flex: 1; /* take remaining height */
        display: flex;
        flex-direction: column;
      }

      /* Filter Input */
      .filter-container {
        padding: 8px;
        border-bottom: 1px solid var(--md-sys-color-outline-variant);
        background: var(--md-sys-color-surface);
        z-index: 1; /* ensure top of stack */
        flex-shrink: 0; /* don't shrink */
      }

      .filter-input {
        width: 100%;
        padding: 8px 12px;
        border: 1px solid var(--md-sys-color-outline);
        border-radius: 4px;
        font-family: inherit;
        font-size: 0.9rem;
        background: var(--md-sys-color-surface-container-low);
        color: var(--md-sys-color-on-surface);
      }

      .filter-input:focus {
        outline: none;
        border-color: var(--md-sys-color-primary);
      }

      /* Option Item (Checkbox style) */
      .option-item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px 16px;
        cursor: pointer;
        color: var(--md-sys-color-on-surface);
        font-size: 0.95rem;
        transition: background-color 0.1s;
      }

      .option-item:hover {
        background: var(--md-sys-color-surface-container-highest);
      }

      /* Custom Checkbox */
      .checkbox {
        width: 18px;
        height: 18px;
        border: 2px solid var(--md-sys-color-outline);
        border-radius: 2px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s;
        flex-shrink: 0;
      }

      .option-item.selected .checkbox {
        background: var(--md-sys-color-primary);
        border-color: var(--md-sys-color-primary);
      }

      .checkbox-icon {
        color: var(--md-sys-color-on-primary);
        font-size: 14px;
        font-weight: bold;
        opacity: 0;
        transform: scale(0.5);
        transition: all 0.2s;
      }

      .option-item.selected .checkbox-icon {
        opacity: 1;
        transform: scale(1);
      }

      /* Chips Layout */
      .chips-container {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        padding: 4px 0;
      }

      .chip {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 6px 16px;
        border: 1px solid var(--md-sys-color-outline);
        border-radius: 16px;
        cursor: pointer;
        user-select: none;
        background: var(--md-sys-color-surface);
        color: var(--md-sys-color-on-surface);
        transition: all 0.2s ease;
        font-size: 0.9rem;
      }

      .chip:hover {
        background: var(--md-sys-color-surface-container-high);
      }

      .chip.selected {
        background: var(--md-sys-color-secondary-container);
        color: var(--md-sys-color-on-secondary-container);
        border-color: var(--md-sys-color-secondary-container);
      }

      .chip.selected:hover {
        background: var(--md-sys-color-secondary-container-high);
      }

      .chip-icon {
        display: none;
        width: 18px;
        height: 18px;
      }

      .chip.selected .chip-icon {
        display: block;
        fill: currentColor;
      }

      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: translateY(-8px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
    `];
		}
		#setBoundValue(value) {
			if (!this.selections || !this.processor) return;
			if (!("path" in this.selections)) return;
			if (!this.selections.path) return;
			this.processor.setData(this.component, this.selections.path, value, this.surfaceId ?? A2uiMessageProcessor.DEFAULT_SURFACE_ID);
		}
		getCurrentSelections() {
			if (Array.isArray(this.selections)) return this.selections;
			if (!this.processor || !this.component) return [];
			const selectionValue = this.processor.getData(this.component, this.selections.path, this.surfaceId ?? A2uiMessageProcessor.DEFAULT_SURFACE_ID);
			return Array.isArray(selectionValue) ? selectionValue : [];
		}
		toggleSelection(value) {
			const current = this.getCurrentSelections();
			if (current.includes(value)) this.#setBoundValue(current.filter((v) => v !== value));
			else this.#setBoundValue([...current, value]);
			this.requestUpdate();
		}
		#renderCheckIcon() {
			return b`
      <svg class="chip-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
        <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z" />
      </svg>
    `;
		}
		#renderFilter() {
			return b`
      <div class="filter-container">
        <input
          type="text"
          class="filter-input"
          placeholder="Filter options..."
          .value=${this.filterText}
          @input=${(e) => {
				const target = e.target;
				this.filterText = target.value;
			}}
          @click=${(e) => e.stopPropagation()}
        />
      </div>
    `;
		}
		render() {
			const currentSelections = this.getCurrentSelections();
			const filteredOptions = this.options.filter((option) => {
				if (!this.filterText) return true;
				return extractStringValue(option.label, this.component, this.processor, this.surfaceId).toLowerCase().includes(this.filterText.toLowerCase());
			});
			if (this.variant === "chips") return b`
        <div class="container">
          ${this.description ? b`<div class="header-text" style="margin-bottom: 8px;">${this.description}</div>` : A}
          ${this.filterable ? this.#renderFilter() : A}
          <div class="chips-container">
            ${filteredOptions.map((option) => {
				const label = extractStringValue(option.label, this.component, this.processor, this.surfaceId);
				const isSelected = currentSelections.includes(option.value);
				return b`
                <div
                  class="chip ${isSelected ? "selected" : ""}"
                  @click=${(e) => {
					e.stopPropagation();
					this.toggleSelection(option.value);
				}}
                >
                  ${isSelected ? this.#renderCheckIcon() : A}
                  <span>${label}</span>
                </div>
              `;
			})}
          </div>
          ${filteredOptions.length === 0 ? b`<div
                style="padding: 8px; font-style: italic; color: var(--md-sys-color-outline);"
              >
                No options found
              </div>` : A}
        </div>
      `;
			const count = currentSelections.length;
			const headerText = count > 0 ? `${count} Selected` : this.description ?? "Select items";
			return b`
      <div class="container">
        <div class="dropdown-header" @click=${() => this.isOpen = !this.isOpen}>
          <span class="header-text">${headerText}</span>
          <span class="chevron ${this.isOpen ? "open" : ""}">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24"
              viewBox="0 -960 960 960"
              width="24"
              fill="currentColor"
            >
              <path d="M480-345 240-585l56-56 184 184 184-184 56 56-240 240Z" />
            </svg>
          </span>
        </div>

        <div class="dropdown-wrapper ${this.isOpen ? "open" : ""}">
          ${this.filterable ? this.#renderFilter() : A}
          <div class="options-scroll-container">
            ${filteredOptions.map((option) => {
				const label = extractStringValue(option.label, this.component, this.processor, this.surfaceId);
				const isSelected = currentSelections.includes(option.value);
				return b`
                <div
                  class="option-item ${isSelected ? "selected" : ""}"
                  @click=${(e) => {
					e.stopPropagation();
					this.toggleSelection(option.value);
				}}
                >
                  <div class="checkbox">
                    <span class="checkbox-icon">✓</span>
                  </div>
                  <span>${label}</span>
                </div>
              `;
			})}
            ${filteredOptions.length === 0 ? b`<div
                  style="padding: 16px; text-align: center; color: var(--md-sys-color-outline);"
                >
                  No options found
                </div>` : A}
          </div>
        </div>
      </div>
    `;
		}
		constructor() {
			super(...arguments);
			__runInitializers$8(this, _filterText_extraInitializers);
		}
		static {
			__runInitializers$8(_classThis, _classExtraInitializers);
		}
	};
	return _classThis;
})();
/**
* @license
* Copyright 2020 Google LLC
* SPDX-License-Identifier: BSD-3-Clause
*/
const o$1 = /* @__PURE__ */ new WeakMap();
const n$1 = e$6(class extends f {
	render(i) {
		return A;
	}
	update(i, [s]) {
		const e = s !== this.G;
		return e && this.rt(void 0), (e || this.lt !== this.ct) && (this.G = s, this.ht = i.options?.host, this.rt(this.ct = i.element)), A;
	}
	rt(t) {
		if (void 0 !== this.G) if (this.isConnected || (t = void 0), "function" == typeof this.G) {
			const i = this.ht ?? globalThis;
			let s = o$1.get(i);
			void 0 === s && (s = /* @__PURE__ */ new WeakMap(), o$1.set(i, s)), void 0 !== s.get(this.G) && this.G.call(this.ht, void 0), s.set(this.G, t), void 0 !== t && this.G.call(this.ht, t);
		} else this.G.value = t;
	}
	get lt() {
		return "function" == typeof this.G ? o$1.get(this.ht ?? globalThis)?.get(this.G) : this.G?.value;
	}
	disconnected() {
		this.lt === this.ct && this.rt(void 0);
	}
	reconnected() {
		this.rt(this.ct);
	}
});
var __esDecorate$7 = function(ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
	function accept(f) {
		if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected");
		return f;
	}
	var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
	var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
	var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
	var _, done = false;
	for (var i = decorators.length - 1; i >= 0; i--) {
		var context = {};
		for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
		for (var p in contextIn.access) context.access[p] = contextIn.access[p];
		context.addInitializer = function(f) {
			if (done) throw new TypeError("Cannot add initializers after decoration has completed");
			extraInitializers.push(accept(f || null));
		};
		var result = (0, decorators[i])(kind === "accessor" ? {
			get: descriptor.get,
			set: descriptor.set
		} : descriptor[key], context);
		if (kind === "accessor") {
			if (result === void 0) continue;
			if (result === null || typeof result !== "object") throw new TypeError("Object expected");
			if (_ = accept(result.get)) descriptor.get = _;
			if (_ = accept(result.set)) descriptor.set = _;
			if (_ = accept(result.init)) initializers.unshift(_);
		} else if (_ = accept(result)) {
			if (kind === "field") initializers.unshift(_);
			else descriptor[key] = _;
		}
	}
	if (target) Object.defineProperty(target, contextIn.name, descriptor);
	done = true;
};
var __runInitializers$7 = function(thisArg, initializers, value) {
	var useValue = arguments.length > 2;
	for (var i = 0; i < initializers.length; i++) value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
	return useValue ? value : void 0;
};
var __setFunctionName = function(f, name, prefix) {
	if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
	return Object.defineProperty(f, "name", {
		configurable: true,
		value: prefix ? "".concat(prefix, " ", name) : name
	});
};
(() => {
	let _classDecorators = [t$5("a2ui-modal")];
	let _classDescriptor;
	let _classExtraInitializers = [];
	let _classThis;
	let _classSuper = Root;
	let _private_showModal_decorators;
	let _private_showModal_initializers = [];
	let _private_showModal_extraInitializers = [];
	let _private_showModal_descriptor;
	let _private_modalRef_decorators;
	let _private_modalRef_initializers = [];
	let _private_modalRef_extraInitializers = [];
	let _private_modalRef_descriptor;
	var Modal = class extends _classSuper {
		static {
			_classThis = this;
		}
		static {
			const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
			_private_showModal_decorators = [r$7()];
			_private_modalRef_decorators = [e$9("dialog")];
			__esDecorate$7(this, _private_showModal_descriptor = {
				get: __setFunctionName(function() {
					return this.#showModal_accessor_storage;
				}, "#showModal", "get"),
				set: __setFunctionName(function(value) {
					this.#showModal_accessor_storage = value;
				}, "#showModal", "set")
			}, _private_showModal_decorators, {
				kind: "accessor",
				name: "#showModal",
				static: false,
				private: true,
				access: {
					has: (obj) => #showModal in obj,
					get: (obj) => obj.#showModal,
					set: (obj, value) => {
						obj.#showModal = value;
					}
				},
				metadata: _metadata
			}, _private_showModal_initializers, _private_showModal_extraInitializers);
			__esDecorate$7(this, _private_modalRef_descriptor = {
				get: __setFunctionName(function() {
					return this.#modalRef_accessor_storage;
				}, "#modalRef", "get"),
				set: __setFunctionName(function(value) {
					this.#modalRef_accessor_storage = value;
				}, "#modalRef", "set")
			}, _private_modalRef_decorators, {
				kind: "accessor",
				name: "#modalRef",
				static: false,
				private: true,
				access: {
					has: (obj) => #modalRef in obj,
					get: (obj) => obj.#modalRef,
					set: (obj, value) => {
						obj.#modalRef = value;
					}
				},
				metadata: _metadata
			}, _private_modalRef_initializers, _private_modalRef_extraInitializers);
			__esDecorate$7(null, _classDescriptor = { value: _classThis }, _classDecorators, {
				kind: "class",
				name: _classThis.name,
				metadata: _metadata
			}, null, _classExtraInitializers);
			Modal = _classThis = _classDescriptor.value;
			if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, {
				enumerable: true,
				configurable: true,
				writable: true,
				value: _metadata
			});
		}
		static {
			this.styles = [structuralStyles, i$10`
      * {
        box-sizing: border-box;
      }

      dialog {
        padding: 0 0 0 0;
        border: none;
        background: none;

        & section {
          & #controls {
            display: flex;
            justify-content: end;
            margin-bottom: 4px;

            & button {
              padding: 0;
              background: none;
              width: 20px;
              height: 20px;
              pointer: cursor;
              border: none;
              cursor: pointer;
            }
          }
        }
      }
    `];
		}
		#showModal_accessor_storage = __runInitializers$7(this, _private_showModal_initializers, false);
		get #showModal() {
			return _private_showModal_descriptor.get.call(this);
		}
		set #showModal(value) {
			return _private_showModal_descriptor.set.call(this, value);
		}
		#modalRef_accessor_storage = (__runInitializers$7(this, _private_showModal_extraInitializers), __runInitializers$7(this, _private_modalRef_initializers, null));
		get #modalRef() {
			return _private_modalRef_descriptor.get.call(this);
		}
		set #modalRef(value) {
			return _private_modalRef_descriptor.set.call(this, value);
		}
		#closeModal() {
			if (!this.#modalRef) return;
			if (this.#modalRef.open) this.#modalRef.close();
			this.#showModal = false;
		}
		render() {
			if (!this.#showModal) return b`<section
        @click=${() => {
				this.#showModal = true;
			}}
      >
        <slot name="entry"></slot>
      </section>`;
			return b`<dialog
      class=${e$2(this.theme.components.Modal.backdrop)}
      @click=${(evt) => {
				const [top] = evt.composedPath();
				if (!(top instanceof HTMLDialogElement)) return;
				this.#closeModal();
			}}
      ${n$1((el) => {
				const showModalIfNeeded = () => {
					if (!(el && el instanceof HTMLDialogElement) || el.open) return;
					el.showModal();
				};
				requestAnimationFrame(showModalIfNeeded);
			})}
    >
      <section
        class=${e$2(this.theme.components.Modal.element)}
        style=${this.theme.additionalStyles?.Modal ? o$2(this.theme.additionalStyles?.Modal) : A}
      >
        <div id="controls">
          <button
            @click=${() => {
				this.#closeModal();
			}}
          >
            <span class="g-icon">close</span>
          </button>
        </div>
        <slot></slot>
      </section>
    </dialog>`;
		}
		constructor() {
			super(...arguments);
			__runInitializers$7(this, _private_modalRef_extraInitializers);
		}
		static {
			__runInitializers$7(_classThis, _classExtraInitializers);
		}
	};
	return _classThis;
})();
var __esDecorate$6 = function(ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
	function accept(f) {
		if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected");
		return f;
	}
	var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
	var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
	var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
	var _, done = false;
	for (var i = decorators.length - 1; i >= 0; i--) {
		var context = {};
		for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
		for (var p in contextIn.access) context.access[p] = contextIn.access[p];
		context.addInitializer = function(f) {
			if (done) throw new TypeError("Cannot add initializers after decoration has completed");
			extraInitializers.push(accept(f || null));
		};
		var result = (0, decorators[i])(kind === "accessor" ? {
			get: descriptor.get,
			set: descriptor.set
		} : descriptor[key], context);
		if (kind === "accessor") {
			if (result === void 0) continue;
			if (result === null || typeof result !== "object") throw new TypeError("Object expected");
			if (_ = accept(result.get)) descriptor.get = _;
			if (_ = accept(result.set)) descriptor.set = _;
			if (_ = accept(result.init)) initializers.unshift(_);
		} else if (_ = accept(result)) {
			if (kind === "field") initializers.unshift(_);
			else descriptor[key] = _;
		}
	}
	if (target) Object.defineProperty(target, contextIn.name, descriptor);
	done = true;
};
var __runInitializers$6 = function(thisArg, initializers, value) {
	var useValue = arguments.length > 2;
	for (var i = 0; i < initializers.length; i++) value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
	return useValue ? value : void 0;
};
(() => {
	let _classDecorators = [t$5("a2ui-row")];
	let _classDescriptor;
	let _classExtraInitializers = [];
	let _classThis;
	let _classSuper = Root;
	let _alignment_decorators;
	let _alignment_initializers = [];
	let _alignment_extraInitializers = [];
	let _distribution_decorators;
	let _distribution_initializers = [];
	let _distribution_extraInitializers = [];
	var Row = class extends _classSuper {
		static {
			_classThis = this;
		}
		static {
			const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
			_alignment_decorators = [n$9({
				reflect: true,
				type: String
			})];
			_distribution_decorators = [n$9({
				reflect: true,
				type: String
			})];
			__esDecorate$6(this, null, _alignment_decorators, {
				kind: "accessor",
				name: "alignment",
				static: false,
				private: false,
				access: {
					has: (obj) => "alignment" in obj,
					get: (obj) => obj.alignment,
					set: (obj, value) => {
						obj.alignment = value;
					}
				},
				metadata: _metadata
			}, _alignment_initializers, _alignment_extraInitializers);
			__esDecorate$6(this, null, _distribution_decorators, {
				kind: "accessor",
				name: "distribution",
				static: false,
				private: false,
				access: {
					has: (obj) => "distribution" in obj,
					get: (obj) => obj.distribution,
					set: (obj, value) => {
						obj.distribution = value;
					}
				},
				metadata: _metadata
			}, _distribution_initializers, _distribution_extraInitializers);
			__esDecorate$6(null, _classDescriptor = { value: _classThis }, _classDecorators, {
				kind: "class",
				name: _classThis.name,
				metadata: _metadata
			}, null, _classExtraInitializers);
			Row = _classThis = _classDescriptor.value;
			if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, {
				enumerable: true,
				configurable: true,
				writable: true,
				value: _metadata
			});
		}
		#alignment_accessor_storage = __runInitializers$6(this, _alignment_initializers, "stretch");
		get alignment() {
			return this.#alignment_accessor_storage;
		}
		set alignment(value) {
			this.#alignment_accessor_storage = value;
		}
		#distribution_accessor_storage = (__runInitializers$6(this, _alignment_extraInitializers), __runInitializers$6(this, _distribution_initializers, "start"));
		get distribution() {
			return this.#distribution_accessor_storage;
		}
		set distribution(value) {
			this.#distribution_accessor_storage = value;
		}
		static {
			this.styles = [structuralStyles, i$10`
      * {
        box-sizing: border-box;
      }

      :host {
        display: flex;
        flex: var(--weight);
      }

      section {
        display: flex;
        flex-direction: row;
        width: 100%;
        min-height: 100%;
      }

      :host([alignment='start']) section {
        align-items: start;
      }

      :host([alignment='center']) section {
        align-items: center;
      }

      :host([alignment='end']) section {
        align-items: end;
      }

      :host([alignment='stretch']) section {
        align-items: stretch;
      }

      :host([distribution='start']) section {
        justify-content: start;
      }

      :host([distribution='center']) section {
        justify-content: center;
      }

      :host([distribution='end']) section {
        justify-content: end;
      }

      :host([distribution='spaceBetween']) section {
        justify-content: space-between;
      }

      :host([distribution='spaceAround']) section {
        justify-content: space-around;
      }

      :host([distribution='spaceEvenly']) section {
        justify-content: space-evenly;
      }
    `];
		}
		render() {
			return b`<section
      class=${e$2(this.theme.components.Row)}
      style=${this.theme.additionalStyles?.Row ? o$2(this.theme.additionalStyles?.Row) : A}
    >
      <slot></slot>
    </section>`;
		}
		constructor() {
			super(...arguments);
			__runInitializers$6(this, _distribution_extraInitializers);
		}
		static {
			__runInitializers$6(_classThis, _classExtraInitializers);
		}
	};
	return _classThis;
})();
var __esDecorate$5 = function(ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
	function accept(f) {
		if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected");
		return f;
	}
	var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
	var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
	var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
	var _, done = false;
	for (var i = decorators.length - 1; i >= 0; i--) {
		var context = {};
		for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
		for (var p in contextIn.access) context.access[p] = contextIn.access[p];
		context.addInitializer = function(f) {
			if (done) throw new TypeError("Cannot add initializers after decoration has completed");
			extraInitializers.push(accept(f || null));
		};
		var result = (0, decorators[i])(kind === "accessor" ? {
			get: descriptor.get,
			set: descriptor.set
		} : descriptor[key], context);
		if (kind === "accessor") {
			if (result === void 0) continue;
			if (result === null || typeof result !== "object") throw new TypeError("Object expected");
			if (_ = accept(result.get)) descriptor.get = _;
			if (_ = accept(result.set)) descriptor.set = _;
			if (_ = accept(result.init)) initializers.unshift(_);
		} else if (_ = accept(result)) {
			if (kind === "field") initializers.unshift(_);
			else descriptor[key] = _;
		}
	}
	if (target) Object.defineProperty(target, contextIn.name, descriptor);
	done = true;
};
var __runInitializers$5 = function(thisArg, initializers, value) {
	var useValue = arguments.length > 2;
	for (var i = 0; i < initializers.length; i++) value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
	return useValue ? value : void 0;
};
(() => {
	let _classDecorators = [t$5("a2ui-slider")];
	let _classDescriptor;
	let _classExtraInitializers = [];
	let _classThis;
	let _classSuper = Root;
	let _value_decorators;
	let _value_initializers = [];
	let _value_extraInitializers = [];
	let _minValue_decorators;
	let _minValue_initializers = [];
	let _minValue_extraInitializers = [];
	let _maxValue_decorators;
	let _maxValue_initializers = [];
	let _maxValue_extraInitializers = [];
	let _label_decorators;
	let _label_initializers = [];
	let _label_extraInitializers = [];
	var Slider = class extends _classSuper {
		static {
			_classThis = this;
		}
		static {
			const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
			_value_decorators = [n$9()];
			_minValue_decorators = [n$9()];
			_maxValue_decorators = [n$9()];
			_label_decorators = [n$9()];
			__esDecorate$5(this, null, _value_decorators, {
				kind: "accessor",
				name: "value",
				static: false,
				private: false,
				access: {
					has: (obj) => "value" in obj,
					get: (obj) => obj.value,
					set: (obj, value) => {
						obj.value = value;
					}
				},
				metadata: _metadata
			}, _value_initializers, _value_extraInitializers);
			__esDecorate$5(this, null, _minValue_decorators, {
				kind: "accessor",
				name: "minValue",
				static: false,
				private: false,
				access: {
					has: (obj) => "minValue" in obj,
					get: (obj) => obj.minValue,
					set: (obj, value) => {
						obj.minValue = value;
					}
				},
				metadata: _metadata
			}, _minValue_initializers, _minValue_extraInitializers);
			__esDecorate$5(this, null, _maxValue_decorators, {
				kind: "accessor",
				name: "maxValue",
				static: false,
				private: false,
				access: {
					has: (obj) => "maxValue" in obj,
					get: (obj) => obj.maxValue,
					set: (obj, value) => {
						obj.maxValue = value;
					}
				},
				metadata: _metadata
			}, _maxValue_initializers, _maxValue_extraInitializers);
			__esDecorate$5(this, null, _label_decorators, {
				kind: "accessor",
				name: "label",
				static: false,
				private: false,
				access: {
					has: (obj) => "label" in obj,
					get: (obj) => obj.label,
					set: (obj, value) => {
						obj.label = value;
					}
				},
				metadata: _metadata
			}, _label_initializers, _label_extraInitializers);
			__esDecorate$5(null, _classDescriptor = { value: _classThis }, _classDecorators, {
				kind: "class",
				name: _classThis.name,
				metadata: _metadata
			}, null, _classExtraInitializers);
			Slider = _classThis = _classDescriptor.value;
			if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, {
				enumerable: true,
				configurable: true,
				writable: true,
				value: _metadata
			});
		}
		#value_accessor_storage = __runInitializers$5(this, _value_initializers, null);
		get value() {
			return this.#value_accessor_storage;
		}
		set value(value) {
			this.#value_accessor_storage = value;
		}
		#minValue_accessor_storage = (__runInitializers$5(this, _value_extraInitializers), __runInitializers$5(this, _minValue_initializers, 0));
		get minValue() {
			return this.#minValue_accessor_storage;
		}
		set minValue(value) {
			this.#minValue_accessor_storage = value;
		}
		#maxValue_accessor_storage = (__runInitializers$5(this, _minValue_extraInitializers), __runInitializers$5(this, _maxValue_initializers, 0));
		get maxValue() {
			return this.#maxValue_accessor_storage;
		}
		set maxValue(value) {
			this.#maxValue_accessor_storage = value;
		}
		#label_accessor_storage = (__runInitializers$5(this, _maxValue_extraInitializers), __runInitializers$5(this, _label_initializers, null));
		get label() {
			return this.#label_accessor_storage;
		}
		set label(value) {
			this.#label_accessor_storage = value;
		}
		static {
			this.styles = [structuralStyles, i$10`
      * {
        box-sizing: border-box;
      }

      :host {
        display: block;
        flex: var(--weight);
      }

      input {
        display: block;
        width: 100%;
      }

      .description {
      }
    `];
		}
		#setBoundValue(value) {
			if (!this.value || !this.processor) return;
			if (!("path" in this.value)) return;
			if (!this.value.path) return;
			this.processor.setData(this.component, this.value.path, value, this.surfaceId ?? A2uiMessageProcessor.DEFAULT_SURFACE_ID);
		}
		#renderField(value) {
			return b`<section class=${e$2(this.theme.components.Slider.container)}>
      ${this.label ? b`<label class=${e$2(this.theme.components.Slider.label)} for="data">
            ${extractStringValue(this.label, this.component, this.processor, this.surfaceId)}
          </label>` : A}
      <input
        autocomplete="off"
        class=${e$2(this.theme.components.Slider.element)}
        style=${this.theme.additionalStyles?.Slider ? o$2(this.theme.additionalStyles?.Slider) : A}
        @input=${(evt) => {
				if (!(evt.target instanceof HTMLInputElement)) return;
				this.#setBoundValue(evt.target.value);
			}}
        id="data"
        name="data"
        .value=${value}
        type="range"
        min=${this.minValue ?? "0"}
        max=${this.maxValue ?? "0"}
      />
      <span class=${e$2(this.theme.components.Slider.label)}
        >${this.value ? extractNumberValue(this.value, this.component, this.processor, this.surfaceId) : "0"}</span
      >
    </section>`;
		}
		render() {
			if (this.value && typeof this.value === "object") {
				if ("literalNumber" in this.value && this.value.literalNumber) return this.#renderField(this.value.literalNumber);
				else if ("literal" in this.value && this.value.literal !== void 0) return this.#renderField(this.value.literal);
				else if (this.value && "path" in this.value && this.value.path) {
					if (!this.processor || !this.component) return b`(no processor)`;
					const textValue = this.processor.getData(this.component, this.value.path, this.surfaceId ?? A2uiMessageProcessor.DEFAULT_SURFACE_ID);
					if (textValue === null) return b`Invalid value`;
					if (typeof textValue !== "string" && typeof textValue !== "number") return b`Invalid value`;
					return this.#renderField(textValue);
				}
			}
			return A;
		}
		constructor() {
			super(...arguments);
			__runInitializers$5(this, _label_extraInitializers);
		}
		static {
			__runInitializers$5(_classThis, _classExtraInitializers);
		}
	};
	return _classThis;
})();
var __esDecorate$4 = function(ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
	function accept(f) {
		if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected");
		return f;
	}
	var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
	var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
	var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
	var _, done = false;
	for (var i = decorators.length - 1; i >= 0; i--) {
		var context = {};
		for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
		for (var p in contextIn.access) context.access[p] = contextIn.access[p];
		context.addInitializer = function(f) {
			if (done) throw new TypeError("Cannot add initializers after decoration has completed");
			extraInitializers.push(accept(f || null));
		};
		var result = (0, decorators[i])(kind === "accessor" ? {
			get: descriptor.get,
			set: descriptor.set
		} : descriptor[key], context);
		if (kind === "accessor") {
			if (result === void 0) continue;
			if (result === null || typeof result !== "object") throw new TypeError("Object expected");
			if (_ = accept(result.get)) descriptor.get = _;
			if (_ = accept(result.set)) descriptor.set = _;
			if (_ = accept(result.init)) initializers.unshift(_);
		} else if (_ = accept(result)) {
			if (kind === "field") initializers.unshift(_);
			else descriptor[key] = _;
		}
	}
	if (target) Object.defineProperty(target, contextIn.name, descriptor);
	done = true;
};
var __runInitializers$4 = function(thisArg, initializers, value) {
	var useValue = arguments.length > 2;
	for (var i = 0; i < initializers.length; i++) value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
	return useValue ? value : void 0;
};
(() => {
	let _classDecorators = [t$5("a2ui-surface")];
	let _classDescriptor;
	let _classExtraInitializers = [];
	let _classThis;
	let _classSuper = Root;
	let _surfaceId_decorators;
	let _surfaceId_initializers = [];
	let _surfaceId_extraInitializers = [];
	let _surface_decorators;
	let _surface_initializers = [];
	let _surface_extraInitializers = [];
	let _processor_decorators;
	let _processor_initializers = [];
	let _processor_extraInitializers = [];
	let _enableCustomElements_decorators;
	let _enableCustomElements_initializers = [];
	let _enableCustomElements_extraInitializers = [];
	var Surface = class extends _classSuper {
		static {
			_classThis = this;
		}
		static {
			const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
			_surfaceId_decorators = [n$9()];
			_surface_decorators = [n$9()];
			_processor_decorators = [n$9()];
			_enableCustomElements_decorators = [n$9()];
			__esDecorate$4(this, null, _surfaceId_decorators, {
				kind: "accessor",
				name: "surfaceId",
				static: false,
				private: false,
				access: {
					has: (obj) => "surfaceId" in obj,
					get: (obj) => obj.surfaceId,
					set: (obj, value) => {
						obj.surfaceId = value;
					}
				},
				metadata: _metadata
			}, _surfaceId_initializers, _surfaceId_extraInitializers);
			__esDecorate$4(this, null, _surface_decorators, {
				kind: "accessor",
				name: "surface",
				static: false,
				private: false,
				access: {
					has: (obj) => "surface" in obj,
					get: (obj) => obj.surface,
					set: (obj, value) => {
						obj.surface = value;
					}
				},
				metadata: _metadata
			}, _surface_initializers, _surface_extraInitializers);
			__esDecorate$4(this, null, _processor_decorators, {
				kind: "accessor",
				name: "processor",
				static: false,
				private: false,
				access: {
					has: (obj) => "processor" in obj,
					get: (obj) => obj.processor,
					set: (obj, value) => {
						obj.processor = value;
					}
				},
				metadata: _metadata
			}, _processor_initializers, _processor_extraInitializers);
			__esDecorate$4(this, null, _enableCustomElements_decorators, {
				kind: "accessor",
				name: "enableCustomElements",
				static: false,
				private: false,
				access: {
					has: (obj) => "enableCustomElements" in obj,
					get: (obj) => obj.enableCustomElements,
					set: (obj, value) => {
						obj.enableCustomElements = value;
					}
				},
				metadata: _metadata
			}, _enableCustomElements_initializers, _enableCustomElements_extraInitializers);
			__esDecorate$4(null, _classDescriptor = { value: _classThis }, _classDecorators, {
				kind: "class",
				name: _classThis.name,
				metadata: _metadata
			}, null, _classExtraInitializers);
			Surface = _classThis = _classDescriptor.value;
			if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, {
				enumerable: true,
				configurable: true,
				writable: true,
				value: _metadata
			});
		}
		#surfaceId_accessor_storage = __runInitializers$4(this, _surfaceId_initializers, null);
		get surfaceId() {
			return this.#surfaceId_accessor_storage;
		}
		set surfaceId(value) {
			this.#surfaceId_accessor_storage = value;
		}
		#surface_accessor_storage = (__runInitializers$4(this, _surfaceId_extraInitializers), __runInitializers$4(this, _surface_initializers, null));
		get surface() {
			return this.#surface_accessor_storage;
		}
		set surface(value) {
			this.#surface_accessor_storage = value;
		}
		#processor_accessor_storage = (__runInitializers$4(this, _surface_extraInitializers), __runInitializers$4(this, _processor_initializers, null));
		get processor() {
			return this.#processor_accessor_storage;
		}
		set processor(value) {
			this.#processor_accessor_storage = value;
		}
		static {
			this.styles = [i$10`
      :host {
        display: flex;
        min-height: 0;
        max-height: 100%;
        flex-direction: column;
        gap: 16px;
      }

      #surface-logo {
        display: flex;
        justify-content: center;

        & img {
          width: 50%;
          max-width: 220px;
        }
      }

      a2ui-root {
        flex: 1;
      }
    `];
		}
		#renderLogo() {
			if (!this.surface?.styles.logoUrl) return A;
			return b`<div id="surface-logo">
      <img src=${this.surface.styles.logoUrl} />
    </div>`;
		}
		#enableCustomElements_accessor_storage = (__runInitializers$4(this, _processor_extraInitializers), __runInitializers$4(this, _enableCustomElements_initializers, false));
		get enableCustomElements() {
			return this.#enableCustomElements_accessor_storage;
		}
		set enableCustomElements(value) {
			this.#enableCustomElements_accessor_storage = value;
		}
		#renderSurface() {
			const styles = {};
			if (this.surface?.styles) for (const [key, value] of Object.entries(this.surface.styles)) switch (key) {
				case "primaryColor":
					styles["--p-100"] = "#ffffff";
					styles["--p-99"] = `color-mix(in srgb, ${value} 2%, white 98%)`;
					styles["--p-98"] = `color-mix(in srgb, ${value} 4%, white 96%)`;
					styles["--p-95"] = `color-mix(in srgb, ${value} 10%, white 90%)`;
					styles["--p-90"] = `color-mix(in srgb, ${value} 20%, white 80%)`;
					styles["--p-80"] = `color-mix(in srgb, ${value} 40%, white 60%)`;
					styles["--p-70"] = `color-mix(in srgb, ${value} 60%, white 40%)`;
					styles["--p-60"] = `color-mix(in srgb, ${value} 80%, white 20%)`;
					styles["--p-50"] = value;
					styles["--p-40"] = `color-mix(in srgb, ${value} 80%, black 20%)`;
					styles["--p-35"] = `color-mix(in srgb, ${value} 70%, black 30%)`;
					styles["--p-30"] = `color-mix(in srgb, ${value} 60%, black 40%)`;
					styles["--p-25"] = `color-mix(in srgb, ${value} 50%, black 50%)`;
					styles["--p-20"] = `color-mix(in srgb, ${value} 40%, black 60%)`;
					styles["--p-15"] = `color-mix(in srgb, ${value} 30%, black 70%)`;
					styles["--p-10"] = `color-mix(in srgb, ${value} 20%, black 80%)`;
					styles["--p-5"] = `color-mix(in srgb, ${value} 10%, black 90%)`;
					styles["--0"] = "#00000";
					break;
				case "font":
					styles["--font-family"] = value;
					styles["--font-family-flex"] = value;
			}
			return b`<a2ui-root
      style=${o$2(styles)}
      .surfaceId=${this.surfaceId}
      .processor=${this.processor}
      .childComponents=${this.surface?.componentTree ? [this.surface.componentTree] : null}
      .enableCustomElements=${this.enableCustomElements}
    ></a2ui-root>`;
		}
		render() {
			if (!this.surface) return A;
			return b`${[this.#renderLogo(), this.#renderSurface()]}`;
		}
		constructor() {
			super(...arguments);
			__runInitializers$4(this, _enableCustomElements_extraInitializers);
		}
		static {
			__runInitializers$4(_classThis, _classExtraInitializers);
		}
	};
	return _classThis;
})();
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
const c$1 = e$6(class extends i$5 {
	constructor(e) {
		if (super(e), e.type !== t$3.CHILD) throw Error("repeat() can only be used in text expressions");
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
		const d = M(s), { values: p$3, keys: a } = this.dt(t, r, c);
		if (!Array.isArray(d)) return this.ut = a, p$3;
		const h = this.ut ??= [], v$2 = [];
		let m, y, x = 0, j = d.length - 1, k = 0, w = p$3.length - 1;
		for (; x <= j && k <= w;) if (null === d[x]) x++;
		else if (null === d[j]) j--;
		else if (h[x] === a[k]) v$2[k] = u$1(d[x], p$3[k]), x++, k++;
		else if (h[j] === a[w]) v$2[w] = u$1(d[j], p$3[w]), j--, w--;
		else if (h[x] === a[w]) v$2[w] = u$1(d[x], p$3[w]), v(s, v$2[w + 1], d[x]), x++, w--;
		else if (h[j] === a[k]) v$2[k] = u$1(d[j], p$3[k]), v(s, d[x], d[j]), j--, k++;
		else if (void 0 === m && (m = u(a, k, w), y = u(h, x, j)), m.has(h[x])) if (m.has(h[j])) {
			const e = y.get(a[k]), t = void 0 !== e ? d[e] : null;
			if (null === t) {
				const e = v(s, d[x]);
				u$1(e, p$3[k]), v$2[k] = e;
			} else v$2[k] = u$1(t, p$3[k]), v(s, d[x], t), d[e] = null;
			k++;
		} else h$4(d[j]), j--;
		else h$4(d[x]), x++;
		for (; k <= w;) {
			const e = v(s, v$2[w + 1]);
			u$1(e, p$3[k]), v$2[k++] = e;
		}
		for (; x <= j;) {
			const e = d[x++];
			null !== e && h$4(e);
		}
		return this.ut = a, p(s, v$2), E;
	}
});
var __esDecorate$3 = function(ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
	function accept(f) {
		if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected");
		return f;
	}
	var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
	var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
	var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
	var _, done = false;
	for (var i = decorators.length - 1; i >= 0; i--) {
		var context = {};
		for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
		for (var p in contextIn.access) context.access[p] = contextIn.access[p];
		context.addInitializer = function(f) {
			if (done) throw new TypeError("Cannot add initializers after decoration has completed");
			extraInitializers.push(accept(f || null));
		};
		var result = (0, decorators[i])(kind === "accessor" ? {
			get: descriptor.get,
			set: descriptor.set
		} : descriptor[key], context);
		if (kind === "accessor") {
			if (result === void 0) continue;
			if (result === null || typeof result !== "object") throw new TypeError("Object expected");
			if (_ = accept(result.get)) descriptor.get = _;
			if (_ = accept(result.set)) descriptor.set = _;
			if (_ = accept(result.init)) initializers.unshift(_);
		} else if (_ = accept(result)) {
			if (kind === "field") initializers.unshift(_);
			else descriptor[key] = _;
		}
	}
	if (target) Object.defineProperty(target, contextIn.name, descriptor);
	done = true;
};
var __runInitializers$3 = function(thisArg, initializers, value) {
	var useValue = arguments.length > 2;
	for (var i = 0; i < initializers.length; i++) value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
	return useValue ? value : void 0;
};
(() => {
	let _classDecorators = [t$5("a2ui-tabs")];
	let _classDescriptor;
	let _classExtraInitializers = [];
	let _classThis;
	let _classSuper = Root;
	let _titles_decorators;
	let _titles_initializers = [];
	let _titles_extraInitializers = [];
	let _selected_decorators;
	let _selected_initializers = [];
	let _selected_extraInitializers = [];
	var Tabs = class extends _classSuper {
		static {
			_classThis = this;
		}
		static {
			const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
			_titles_decorators = [n$9()];
			_selected_decorators = [n$9()];
			__esDecorate$3(this, null, _titles_decorators, {
				kind: "accessor",
				name: "titles",
				static: false,
				private: false,
				access: {
					has: (obj) => "titles" in obj,
					get: (obj) => obj.titles,
					set: (obj, value) => {
						obj.titles = value;
					}
				},
				metadata: _metadata
			}, _titles_initializers, _titles_extraInitializers);
			__esDecorate$3(this, null, _selected_decorators, {
				kind: "accessor",
				name: "selected",
				static: false,
				private: false,
				access: {
					has: (obj) => "selected" in obj,
					get: (obj) => obj.selected,
					set: (obj, value) => {
						obj.selected = value;
					}
				},
				metadata: _metadata
			}, _selected_initializers, _selected_extraInitializers);
			__esDecorate$3(null, _classDescriptor = { value: _classThis }, _classDecorators, {
				kind: "class",
				name: _classThis.name,
				metadata: _metadata
			}, null, _classExtraInitializers);
			Tabs = _classThis = _classDescriptor.value;
			if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, {
				enumerable: true,
				configurable: true,
				writable: true,
				value: _metadata
			});
		}
		#titles_accessor_storage = __runInitializers$3(this, _titles_initializers, null);
		get titles() {
			return this.#titles_accessor_storage;
		}
		set titles(value) {
			this.#titles_accessor_storage = value;
		}
		#selected_accessor_storage = (__runInitializers$3(this, _titles_extraInitializers), __runInitializers$3(this, _selected_initializers, 0));
		get selected() {
			return this.#selected_accessor_storage;
		}
		set selected(value) {
			this.#selected_accessor_storage = value;
		}
		static {
			this.styles = [structuralStyles, i$10`
      :host {
        display: block;
        flex: var(--weight);
      }
    `];
		}
		willUpdate(changedProperties) {
			super.willUpdate(changedProperties);
			if (changedProperties.has("selected")) {
				for (const child of this.children) child.removeAttribute("slot");
				const selectedChild = this.children[this.selected];
				if (!selectedChild) return;
				selectedChild.slot = "current";
			}
		}
		#renderTabs() {
			if (!this.titles) return A;
			return b`<div id="buttons" class=${e$2(this.theme.components.Tabs.element)}>
      ${c$1(this.titles, (title, idx) => {
				let titleString = "";
				if ("literalString" in title && title.literalString) titleString = title.literalString;
				else if ("literal" in title && title.literal !== void 0) titleString = title.literal;
				else if (title && "path" in title && title.path) {
					if (!this.processor || !this.component) return b`(no model)`;
					const textValue = this.processor.getData(this.component, title.path, this.surfaceId ?? A2uiMessageProcessor.DEFAULT_SURFACE_ID);
					if (typeof textValue !== "string") return b`(invalid)`;
					titleString = textValue;
				}
				let classes;
				if (this.selected === idx) classes = merge(this.theme.components.Tabs.controls.all, this.theme.components.Tabs.controls.selected);
				else classes = { ...this.theme.components.Tabs.controls.all };
				return b`<button
          ?disabled=${this.selected === idx}
          class=${e$2(classes)}
          @click=${() => {
					this.selected = idx;
				}}
        >
          ${titleString}
        </button>`;
			})}
    </div>`;
		}
		#renderSlot() {
			return b`<slot name="current"></slot>`;
		}
		render() {
			return b`<section
      class=${e$2(this.theme.components.Tabs.container)}
      style=${this.theme.additionalStyles?.Tabs ? o$2(this.theme.additionalStyles?.Tabs) : A}
    >
      ${[this.#renderTabs(), this.#renderSlot()]}
    </section>`;
		}
		constructor() {
			super(...arguments);
			__runInitializers$3(this, _selected_extraInitializers);
		}
		static {
			__runInitializers$3(_classThis, _classExtraInitializers);
		}
	};
	return _classThis;
})();
var __esDecorate$2 = function(ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
	function accept(f) {
		if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected");
		return f;
	}
	var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
	var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
	var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
	var _, done = false;
	for (var i = decorators.length - 1; i >= 0; i--) {
		var context = {};
		for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
		for (var p in contextIn.access) context.access[p] = contextIn.access[p];
		context.addInitializer = function(f) {
			if (done) throw new TypeError("Cannot add initializers after decoration has completed");
			extraInitializers.push(accept(f || null));
		};
		var result = (0, decorators[i])(kind === "accessor" ? {
			get: descriptor.get,
			set: descriptor.set
		} : descriptor[key], context);
		if (kind === "accessor") {
			if (result === void 0) continue;
			if (result === null || typeof result !== "object") throw new TypeError("Object expected");
			if (_ = accept(result.get)) descriptor.get = _;
			if (_ = accept(result.set)) descriptor.set = _;
			if (_ = accept(result.init)) initializers.unshift(_);
		} else if (_ = accept(result)) {
			if (kind === "field") initializers.unshift(_);
			else descriptor[key] = _;
		}
	}
	if (target) Object.defineProperty(target, contextIn.name, descriptor);
	done = true;
};
var __runInitializers$2 = function(thisArg, initializers, value) {
	var useValue = arguments.length > 2;
	for (var i = 0; i < initializers.length; i++) value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
	return useValue ? value : void 0;
};
(() => {
	let _classDecorators = [t$5("a2ui-textfield")];
	let _classDescriptor;
	let _classExtraInitializers = [];
	let _classThis;
	let _classSuper = Root;
	let _text_decorators;
	let _text_initializers = [];
	let _text_extraInitializers = [];
	let _label_decorators;
	let _label_initializers = [];
	let _label_extraInitializers = [];
	let _textFieldType_decorators;
	let _textFieldType_initializers = [];
	let _textFieldType_extraInitializers = [];
	let _validationRegexp_decorators;
	let _validationRegexp_initializers = [];
	let _validationRegexp_extraInitializers = [];
	var TextField = class extends _classSuper {
		static {
			_classThis = this;
		}
		static {
			const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
			_text_decorators = [n$9()];
			_label_decorators = [n$9()];
			_textFieldType_decorators = [n$9()];
			_validationRegexp_decorators = [n$9()];
			__esDecorate$2(this, null, _text_decorators, {
				kind: "accessor",
				name: "text",
				static: false,
				private: false,
				access: {
					has: (obj) => "text" in obj,
					get: (obj) => obj.text,
					set: (obj, value) => {
						obj.text = value;
					}
				},
				metadata: _metadata
			}, _text_initializers, _text_extraInitializers);
			__esDecorate$2(this, null, _label_decorators, {
				kind: "accessor",
				name: "label",
				static: false,
				private: false,
				access: {
					has: (obj) => "label" in obj,
					get: (obj) => obj.label,
					set: (obj, value) => {
						obj.label = value;
					}
				},
				metadata: _metadata
			}, _label_initializers, _label_extraInitializers);
			__esDecorate$2(this, null, _textFieldType_decorators, {
				kind: "accessor",
				name: "textFieldType",
				static: false,
				private: false,
				access: {
					has: (obj) => "textFieldType" in obj,
					get: (obj) => obj.textFieldType,
					set: (obj, value) => {
						obj.textFieldType = value;
					}
				},
				metadata: _metadata
			}, _textFieldType_initializers, _textFieldType_extraInitializers);
			__esDecorate$2(this, null, _validationRegexp_decorators, {
				kind: "accessor",
				name: "validationRegexp",
				static: false,
				private: false,
				access: {
					has: (obj) => "validationRegexp" in obj,
					get: (obj) => obj.validationRegexp,
					set: (obj, value) => {
						obj.validationRegexp = value;
					}
				},
				metadata: _metadata
			}, _validationRegexp_initializers, _validationRegexp_extraInitializers);
			__esDecorate$2(null, _classDescriptor = { value: _classThis }, _classDecorators, {
				kind: "class",
				name: _classThis.name,
				metadata: _metadata
			}, null, _classExtraInitializers);
			TextField = _classThis = _classDescriptor.value;
			if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, {
				enumerable: true,
				configurable: true,
				writable: true,
				value: _metadata
			});
		}
		#text_accessor_storage = __runInitializers$2(this, _text_initializers, null);
		get text() {
			return this.#text_accessor_storage;
		}
		set text(value) {
			this.#text_accessor_storage = value;
		}
		#label_accessor_storage = (__runInitializers$2(this, _text_extraInitializers), __runInitializers$2(this, _label_initializers, null));
		get label() {
			return this.#label_accessor_storage;
		}
		set label(value) {
			this.#label_accessor_storage = value;
		}
		#textFieldType_accessor_storage = (__runInitializers$2(this, _label_extraInitializers), __runInitializers$2(this, _textFieldType_initializers, null));
		get textFieldType() {
			return this.#textFieldType_accessor_storage;
		}
		set textFieldType(value) {
			this.#textFieldType_accessor_storage = value;
		}
		#validationRegexp_accessor_storage = (__runInitializers$2(this, _textFieldType_extraInitializers), __runInitializers$2(this, _validationRegexp_initializers, null));
		get validationRegexp() {
			return this.#validationRegexp_accessor_storage;
		}
		set validationRegexp(value) {
			this.#validationRegexp_accessor_storage = value;
		}
		static {
			this.styles = [structuralStyles, i$10`
      * {
        box-sizing: border-box;
      }

      :host {
        display: flex;
        flex: var(--weight);
      }

      input {
        display: block;
        width: 100%;
      }

      input:invalid {
        border-color: var(--color-error);
        color: var(--color-error);
        outline-color: var(--color-error);
      }

      input:invalid:focus {
        border-color: var(--color-error);
        outline-color: var(--color-error);
      }

      label {
        display: block;
        margin-bottom: 4px;
      }
    `];
		}
		#setBoundValue(value) {
			if (!this.text || !this.processor) return;
			if (!("path" in this.text)) return;
			if (!this.text.path) return;
			this.processor.setData(this.component, this.text.path, value, this.surfaceId ?? A2uiMessageProcessor.DEFAULT_SURFACE_ID);
		}
		#renderField(value, label) {
			return b` <section class=${e$2(this.theme.components.TextField.container)}>
      ${label && label !== "" ? b`<label class=${e$2(this.theme.components.TextField.label)} for="data"
            >${label}</label
          >` : A}
      <input
        autocomplete="off"
        class=${e$2(this.theme.components.TextField.element)}
        style=${this.theme.additionalStyles?.TextField ? o$2(this.theme.additionalStyles?.TextField) : A}
        @input=${(evt) => {
				if (!(evt.target instanceof HTMLInputElement)) return;
				this.dispatchEvent(new A2UIValidationEvent({
					componentId: this.id,
					value: evt.target.value,
					valid: evt.target.checkValidity()
				}));
				this.#setBoundValue(evt.target.value);
			}}
        name="data"
        id="data"
        .value=${value}
        .placeholder=${"Please enter a value"}
        pattern=${this.validationRegexp || A}
        type=${this.textFieldType === "number" ? "number" : "text"}
      />
    </section>`;
		}
		render() {
			const label = extractStringValue(this.label, this.component, this.processor, this.surfaceId);
			const value = extractStringValue(this.text, this.component, this.processor, this.surfaceId);
			return this.#renderField(value, label);
		}
		constructor() {
			super(...arguments);
			__runInitializers$2(this, _validationRegexp_extraInitializers);
		}
		static {
			__runInitializers$2(_classThis, _classExtraInitializers);
		}
	};
	return _classThis;
})();
/**
* @license
* Copyright 2017 Google LLC
* SPDX-License-Identifier: BSD-3-Clause
*/ var e = class extends i$5 {
	constructor(i) {
		if (super(i), this.it = A, i.type !== t$3.CHILD) throw Error(this.constructor.directiveName + "() can only be used in child bindings");
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
const o = e$6(e);
/**
* @license
* Copyright 2021 Google LLC
* SPDX-License-Identifier: BSD-3-Clause
*/
var s = class {
	constructor(t) {
		this.G = t;
	}
	disconnect() {
		this.G = void 0;
	}
	reconnect(t) {
		this.G = t;
	}
	deref() {
		return this.G;
	}
};
var i = class {
	constructor() {
		this.Y = void 0, this.Z = void 0;
	}
	get() {
		return this.Y;
	}
	pause() {
		this.Y ??= new Promise((t) => this.Z = t);
	}
	resume() {
		this.Z?.(), this.Y = this.Z = void 0;
	}
};
/**
* @license
* Copyright 2017 Google LLC
* SPDX-License-Identifier: BSD-3-Clause
*/ const n = (t) => !n$6(t) && "function" == typeof t.then;
const h = 1073741823;
var c = class extends f {
	constructor() {
		super(...arguments), this._$Cwt = h, this._$Cbt = [], this._$CK = new s(this), this._$CX = new i();
	}
	render(...s) {
		return s.find((t) => !n(t)) ?? E;
	}
	update(s, i) {
		const e = this._$Cbt;
		let r = e.length;
		this._$Cbt = i;
		const o = this._$CK, c = this._$CX;
		this.isConnected || this.disconnected();
		for (let t = 0; t < i.length && !(t > this._$Cwt); t++) {
			const s = i[t];
			if (!n(s)) return this._$Cwt = t, s;
			t < r && s === e[t] || (this._$Cwt = h, r = 0, Promise.resolve(s).then(async (t) => {
				for (; c.get();) await c.get();
				const i = o.deref();
				if (void 0 !== i) {
					const e = i._$Cbt.indexOf(s);
					e > -1 && e < i._$Cwt && (i._$Cwt = e, i.setValue(t));
				}
			}));
		}
		return E;
	}
	disconnected() {
		this._$CK.disconnect(), this._$CX.pause();
	}
	reconnected() {
		this._$CK.reconnect(this), this._$CX.resume();
	}
};
const m = e$6(c);
const markdown$1 = e$6(class MarkdownDirective extends i$5 {
	#lastValue = null;
	#lastTagClassMap = null;
	update(_part, [value, markdownRenderer, markdownOptions]) {
		const jsonTagClassMap = JSON.stringify(markdownOptions?.tagClassMap);
		if (this.#lastValue === value && jsonTagClassMap === this.#lastTagClassMap) return E;
		this.#lastValue = value;
		this.#lastTagClassMap = jsonTagClassMap;
		return this.render(value, markdownRenderer, markdownOptions);
	}
	static {
		this.defaultMarkdownWarningLogged = false;
	}
	/**
	* Renders the markdown string to HTML using the injected markdown renderer,
	* if present. Otherwise, it returns the value wrapped in a span.
	*/
	render(value, markdownRenderer, markdownOptions) {
		if (markdownRenderer) {
			const rendered = markdownRenderer(value, markdownOptions).then((value) => {
				return o(value);
			});
			return m(rendered, b`<span class="no-markdown-renderer">${value}</span>`);
		}
		const dynamicRendererPromise = (async () => {
			try {
				const { renderMarkdown } = await import("@a2ui/markdown-it");
				const rendered = await renderMarkdown(value, markdownOptions);
				return o(rendered);
			} catch {
				if (!MarkdownDirective.defaultMarkdownWarningLogged) {
					console.warn("[MarkdownDirective] Failed to load optional `@a2ui/markdown-it` renderer. Using fallback regex.");
					MarkdownDirective.defaultMarkdownWarningLogged = true;
				}
				return b`<span class="no-markdown-renderer">${value}</span>`;
			}
		})();
		return m(dynamicRendererPromise, b`<span class="no-markdown-renderer">${value}</span>`);
	}
});
/**
* The markdown renderer context.
*/
const markdown = n$3(Symbol("A2UIMarkdown"));
var __esDecorate$1 = function(ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
	function accept(f) {
		if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected");
		return f;
	}
	var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
	var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
	var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
	var _, done = false;
	for (var i = decorators.length - 1; i >= 0; i--) {
		var context = {};
		for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
		for (var p in contextIn.access) context.access[p] = contextIn.access[p];
		context.addInitializer = function(f) {
			if (done) throw new TypeError("Cannot add initializers after decoration has completed");
			extraInitializers.push(accept(f || null));
		};
		var result = (0, decorators[i])(kind === "accessor" ? {
			get: descriptor.get,
			set: descriptor.set
		} : descriptor[key], context);
		if (kind === "accessor") {
			if (result === void 0) continue;
			if (result === null || typeof result !== "object") throw new TypeError("Object expected");
			if (_ = accept(result.get)) descriptor.get = _;
			if (_ = accept(result.set)) descriptor.set = _;
			if (_ = accept(result.init)) initializers.unshift(_);
		} else if (_ = accept(result)) {
			if (kind === "field") initializers.unshift(_);
			else descriptor[key] = _;
		}
	}
	if (target) Object.defineProperty(target, contextIn.name, descriptor);
	done = true;
};
var __runInitializers$1 = function(thisArg, initializers, value) {
	var useValue = arguments.length > 2;
	for (var i = 0; i < initializers.length; i++) value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
	return useValue ? value : void 0;
};
(() => {
	let _classDecorators = [t$5("a2ui-text")];
	let _classDescriptor;
	let _classExtraInitializers = [];
	let _classThis;
	let _classSuper = Root;
	let _text_decorators;
	let _text_initializers = [];
	let _text_extraInitializers = [];
	let _usageHint_decorators;
	let _usageHint_initializers = [];
	let _usageHint_extraInitializers = [];
	let _markdownRenderer_decorators;
	let _markdownRenderer_initializers = [];
	let _markdownRenderer_extraInitializers = [];
	var Text = class extends _classSuper {
		static {
			_classThis = this;
		}
		static {
			const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
			_text_decorators = [n$9()];
			_usageHint_decorators = [n$9({
				reflect: true,
				attribute: "usage-hint"
			})];
			_markdownRenderer_decorators = [c$2({ context: markdown })];
			__esDecorate$1(this, null, _text_decorators, {
				kind: "accessor",
				name: "text",
				static: false,
				private: false,
				access: {
					has: (obj) => "text" in obj,
					get: (obj) => obj.text,
					set: (obj, value) => {
						obj.text = value;
					}
				},
				metadata: _metadata
			}, _text_initializers, _text_extraInitializers);
			__esDecorate$1(this, null, _usageHint_decorators, {
				kind: "accessor",
				name: "usageHint",
				static: false,
				private: false,
				access: {
					has: (obj) => "usageHint" in obj,
					get: (obj) => obj.usageHint,
					set: (obj, value) => {
						obj.usageHint = value;
					}
				},
				metadata: _metadata
			}, _usageHint_initializers, _usageHint_extraInitializers);
			__esDecorate$1(this, null, _markdownRenderer_decorators, {
				kind: "accessor",
				name: "markdownRenderer",
				static: false,
				private: false,
				access: {
					has: (obj) => "markdownRenderer" in obj,
					get: (obj) => obj.markdownRenderer,
					set: (obj, value) => {
						obj.markdownRenderer = value;
					}
				},
				metadata: _metadata
			}, _markdownRenderer_initializers, _markdownRenderer_extraInitializers);
			__esDecorate$1(null, _classDescriptor = { value: _classThis }, _classDecorators, {
				kind: "class",
				name: _classThis.name,
				metadata: _metadata
			}, null, _classExtraInitializers);
			Text = _classThis = _classDescriptor.value;
			if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, {
				enumerable: true,
				configurable: true,
				writable: true,
				value: _metadata
			});
		}
		#text_accessor_storage = __runInitializers$1(this, _text_initializers, null);
		get text() {
			return this.#text_accessor_storage;
		}
		set text(value) {
			this.#text_accessor_storage = value;
		}
		#usageHint_accessor_storage = (__runInitializers$1(this, _text_extraInitializers), __runInitializers$1(this, _usageHint_initializers, null));
		get usageHint() {
			return this.#usageHint_accessor_storage;
		}
		set usageHint(value) {
			this.#usageHint_accessor_storage = value;
		}
		#markdownRenderer_accessor_storage = (__runInitializers$1(this, _usageHint_extraInitializers), __runInitializers$1(this, _markdownRenderer_initializers, void 0));
		get markdownRenderer() {
			return this.#markdownRenderer_accessor_storage;
		}
		set markdownRenderer(value) {
			this.#markdownRenderer_accessor_storage = value;
		}
		static {
			this.styles = [structuralStyles, i$10`
      :host {
        display: block;
        flex: var(--weight);
      }

      h1,
      h2,
      h3,
      h4,
      h5 {
        line-height: inherit;
        font: inherit;
      }
    `];
		}
		#renderText() {
			let textValue = null;
			if (this.text && typeof this.text === "object") {
				if ("literalString" in this.text && this.text.literalString) textValue = this.text.literalString;
				else if ("literal" in this.text && this.text.literal !== void 0) textValue = this.text.literal;
				else if (this.text && "path" in this.text && this.text.path) {
					if (!this.processor || !this.component) return b`(no model)`;
					const value = this.processor.getData(this.component, this.text.path, this.surfaceId ?? A2uiMessageProcessor.DEFAULT_SURFACE_ID);
					if (value !== null && value !== void 0) textValue = value.toString();
				}
			}
			if (textValue === null || textValue === void 0) return b`(empty)`;
			let markdownText = textValue;
			switch (this.usageHint) {
				case "h1":
					markdownText = `# ${markdownText}`;
					break;
				case "h2":
					markdownText = `## ${markdownText}`;
					break;
				case "h3":
					markdownText = `### ${markdownText}`;
					break;
				case "h4":
					markdownText = `#### ${markdownText}`;
					break;
				case "h5":
					markdownText = `##### ${markdownText}`;
					break;
				case "caption": markdownText = `*${markdownText}*`;
			}
			return b`${markdown$1(markdownText, this.markdownRenderer, { tagClassMap: appendToAll(this.theme.markdown, [
				"ol",
				"ul",
				"li"
			], {}) })}`;
		}
		#areHintedStyles(styles) {
			if (typeof styles !== "object") return false;
			if (Array.isArray(styles)) return false;
			if (!styles) return false;
			return [
				"h1",
				"h2",
				"h3",
				"h4",
				"h5",
				"h6",
				"caption",
				"body"
			].every((v) => v in styles);
		}
		#getAdditionalStyles() {
			let additionalStyles = {};
			const styles = this.theme.additionalStyles?.Text;
			if (!styles) return additionalStyles;
			if (this.#areHintedStyles(styles)) additionalStyles = styles[this.usageHint ?? "body"];
			else additionalStyles = styles;
			return additionalStyles;
		}
		render() {
			const classes = merge(this.theme.components.Text.all, this.usageHint ? this.theme.components.Text[this.usageHint] : {});
			return b`<section
      class=${e$2(classes)}
      style=${this.theme.additionalStyles?.Text ? o$2(this.#getAdditionalStyles()) : A}
    >
      ${this.#renderText()}
    </section>`;
		}
		constructor() {
			super(...arguments);
			__runInitializers$1(this, _markdownRenderer_extraInitializers);
		}
		static {
			__runInitializers$1(_classThis, _classExtraInitializers);
		}
	};
	return _classThis;
})();
var __esDecorate = function(ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
	function accept(f) {
		if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected");
		return f;
	}
	var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
	var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
	var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
	var _, done = false;
	for (var i = decorators.length - 1; i >= 0; i--) {
		var context = {};
		for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
		for (var p in contextIn.access) context.access[p] = contextIn.access[p];
		context.addInitializer = function(f) {
			if (done) throw new TypeError("Cannot add initializers after decoration has completed");
			extraInitializers.push(accept(f || null));
		};
		var result = (0, decorators[i])(kind === "accessor" ? {
			get: descriptor.get,
			set: descriptor.set
		} : descriptor[key], context);
		if (kind === "accessor") {
			if (result === void 0) continue;
			if (result === null || typeof result !== "object") throw new TypeError("Object expected");
			if (_ = accept(result.get)) descriptor.get = _;
			if (_ = accept(result.set)) descriptor.set = _;
			if (_ = accept(result.init)) initializers.unshift(_);
		} else if (_ = accept(result)) {
			if (kind === "field") initializers.unshift(_);
			else descriptor[key] = _;
		}
	}
	if (target) Object.defineProperty(target, contextIn.name, descriptor);
	done = true;
};
var __runInitializers = function(thisArg, initializers, value) {
	var useValue = arguments.length > 2;
	for (var i = 0; i < initializers.length; i++) value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
	return useValue ? value : void 0;
};
(() => {
	let _classDecorators = [t$5("a2ui-video")];
	let _classDescriptor;
	let _classExtraInitializers = [];
	let _classThis;
	let _classSuper = Root;
	let _url_decorators;
	let _url_initializers = [];
	let _url_extraInitializers = [];
	var Video = class extends _classSuper {
		static {
			_classThis = this;
		}
		static {
			const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
			_url_decorators = [n$9()];
			__esDecorate(this, null, _url_decorators, {
				kind: "accessor",
				name: "url",
				static: false,
				private: false,
				access: {
					has: (obj) => "url" in obj,
					get: (obj) => obj.url,
					set: (obj, value) => {
						obj.url = value;
					}
				},
				metadata: _metadata
			}, _url_initializers, _url_extraInitializers);
			__esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, {
				kind: "class",
				name: _classThis.name,
				metadata: _metadata
			}, null, _classExtraInitializers);
			Video = _classThis = _classDescriptor.value;
			if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, {
				enumerable: true,
				configurable: true,
				writable: true,
				value: _metadata
			});
		}
		#url_accessor_storage = __runInitializers(this, _url_initializers, null);
		get url() {
			return this.#url_accessor_storage;
		}
		set url(value) {
			this.#url_accessor_storage = value;
		}
		static {
			this.styles = [structuralStyles, i$10`
      * {
        box-sizing: border-box;
      }

      :host {
        display: block;
        flex: var(--weight);
        min-height: 0;
        overflow: auto;
      }

      video {
        display: block;
        width: 100%;
      }
    `];
		}
		#renderVideo() {
			if (!this.url) return A;
			if (this.url && typeof this.url === "object") {
				if ("literalString" in this.url) return b`<video controls src=${this.url.literalString} />`;
				else if ("literal" in this.url) return b`<video controls src=${this.url.literal} />`;
				else if (this.url && "path" in this.url && this.url.path) {
					if (!this.processor || !this.component) return b`(no processor)`;
					const videoUrl = this.processor.getData(this.component, this.url.path, this.surfaceId ?? A2uiMessageProcessor.DEFAULT_SURFACE_ID);
					if (!videoUrl) return b`Invalid video URL`;
					if (typeof videoUrl !== "string") return b`Invalid video URL`;
					return b`<video controls src=${videoUrl} />`;
				}
			}
			return b`(empty)`;
		}
		render() {
			return b`<section
      class=${e$2(this.theme.components.Video)}
      style=${this.theme.additionalStyles?.Video ? o$2(this.theme.additionalStyles?.Video) : A}
    >
      ${this.#renderVideo()}
    </section>`;
		}
		constructor() {
			super(...arguments);
			__runInitializers(this, _url_extraInitializers);
		}
		static {
			__runInitializers(_classThis, _classExtraInitializers);
		}
	};
	return _classThis;
})();
function styleSheet(text) {
	const sheet = new CSSStyleSheet();
	sheet.replaceSync(text.join(""));
	return sheet;
}
const modalStyles = styleSheet`
  dialog {
    position: fixed;
    inset: 0;
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 24px;
    border: none;
    background: rgba(5, 8, 16, 0.65);
    backdrop-filter: blur(6px);
    display: grid;
    place-items: center;
  }

  dialog::backdrop {
    background: rgba(5, 8, 16, 0.65);
    backdrop-filter: blur(6px);
  }
`;
const modalElement = customElements.get("a2ui-modal");
if (modalElement && Array.isArray(modalElement.styles)) modalElement.styles = [...modalElement.styles, modalStyles];
const appendComponentStyles = (tagName, extraStyles) => {
	const component = customElements.get(tagName);
	if (!component) return;
	const current = component.styles;
	if (!current) {
		component.styles = [extraStyles];
		return;
	}
	component.styles = Array.isArray(current) ? [...current, extraStyles] : [current, extraStyles];
};
appendComponentStyles("a2ui-row", styleSheet`
    @media (max-width: 860px) {
      section {
        flex-wrap: wrap;
        align-content: flex-start;
      }

      ::slotted(*) {
        flex: 1 1 100%;
        min-width: 100%;
        width: 100%;
        max-width: 100%;
      }
    }
  `);
appendComponentStyles("a2ui-column", styleSheet`
    :host {
      min-width: 0;
    }

    section {
      min-width: 0;
    }
  `);
appendComponentStyles("a2ui-card", styleSheet`
    :host {
      min-width: 0;
    }

    section {
      min-width: 0;
    }
  `);
const emptyClasses = () => ({});
const textHintStyles = () => ({
	h1: {},
	h2: {},
	h3: {},
	h4: {},
	h5: {},
	body: {},
	caption: {}
});
const isAndroid = /Android/i.test(globalThis.navigator?.userAgent ?? "");
const cardShadow = isAndroid ? "0 2px 10px rgba(0,0,0,.18)" : "0 10px 30px rgba(0,0,0,.35)";
const buttonShadow = isAndroid ? "0 2px 10px rgba(6, 182, 212, 0.14)" : "0 10px 25px rgba(6, 182, 212, 0.18)";
const openclawTheme = {
	components: {
		AudioPlayer: emptyClasses(),
		Button: emptyClasses(),
		Card: emptyClasses(),
		Column: emptyClasses(),
		CheckBox: {
			container: emptyClasses(),
			element: emptyClasses(),
			label: emptyClasses()
		},
		DateTimeInput: {
			container: emptyClasses(),
			element: emptyClasses(),
			label: emptyClasses()
		},
		Divider: emptyClasses(),
		Image: {
			all: emptyClasses(),
			icon: emptyClasses(),
			avatar: emptyClasses(),
			smallFeature: emptyClasses(),
			mediumFeature: emptyClasses(),
			largeFeature: emptyClasses(),
			header: emptyClasses()
		},
		Icon: emptyClasses(),
		List: emptyClasses(),
		Modal: {
			backdrop: emptyClasses(),
			element: emptyClasses()
		},
		MultipleChoice: {
			container: emptyClasses(),
			element: emptyClasses(),
			label: emptyClasses()
		},
		Row: emptyClasses(),
		Slider: {
			container: emptyClasses(),
			element: emptyClasses(),
			label: emptyClasses()
		},
		Tabs: {
			container: emptyClasses(),
			element: emptyClasses(),
			controls: {
				all: emptyClasses(),
				selected: emptyClasses()
			}
		},
		Text: {
			all: emptyClasses(),
			h1: emptyClasses(),
			h2: emptyClasses(),
			h3: emptyClasses(),
			h4: emptyClasses(),
			h5: emptyClasses(),
			caption: emptyClasses(),
			body: emptyClasses()
		},
		TextField: {
			container: emptyClasses(),
			element: emptyClasses(),
			label: emptyClasses()
		},
		Video: emptyClasses()
	},
	elements: {
		a: emptyClasses(),
		audio: emptyClasses(),
		body: emptyClasses(),
		button: emptyClasses(),
		h1: emptyClasses(),
		h2: emptyClasses(),
		h3: emptyClasses(),
		h4: emptyClasses(),
		h5: emptyClasses(),
		iframe: emptyClasses(),
		input: emptyClasses(),
		p: emptyClasses(),
		pre: emptyClasses(),
		textarea: emptyClasses(),
		video: emptyClasses()
	},
	markdown: {
		p: [],
		h1: [],
		h2: [],
		h3: [],
		h4: [],
		h5: [],
		ul: [],
		ol: [],
		li: [],
		a: [],
		strong: [],
		em: []
	},
	additionalStyles: {
		Card: {
			background: "linear-gradient(180deg, rgba(255,255,255,.06), rgba(255,255,255,.03))",
			border: "1px solid rgba(255,255,255,.09)",
			borderRadius: "14px",
			padding: "14px",
			boxShadow: cardShadow
		},
		Modal: {
			background: "rgba(12, 16, 24, 0.92)",
			border: "1px solid rgba(255,255,255,.12)",
			borderRadius: "16px",
			padding: "16px",
			boxShadow: "0 30px 80px rgba(0,0,0,.6)",
			width: "min(520px, calc(100vw - 48px))"
		},
		Column: { gap: "10px" },
		Row: {
			gap: "10px",
			alignItems: "center"
		},
		Divider: { opacity: "0.25" },
		Button: {
			background: "linear-gradient(135deg, #22c55e 0%, #06b6d4 100%)",
			border: "0",
			borderRadius: "12px",
			padding: "10px 14px",
			color: "#071016",
			fontWeight: "650",
			cursor: "pointer",
			boxShadow: buttonShadow
		},
		Text: {
			...textHintStyles(),
			h1: {
				fontSize: "20px",
				fontWeight: "750",
				margin: "0 0 6px 0"
			},
			h2: {
				fontSize: "16px",
				fontWeight: "700",
				margin: "0 0 6px 0"
			},
			body: {
				fontSize: "13px",
				lineHeight: "1.4"
			},
			caption: { opacity: "0.8" }
		},
		TextField: {
			display: "grid",
			gap: "6px"
		},
		Image: { borderRadius: "12px" }
	}
};
function provideTheme(host) {
	const listener = (event) => {
		if (event.context !== themeContext) return;
		event.stopPropagation();
		event.callback(openclawTheme);
	};
	host.addEventListener("context-request", listener);
	return () => host.removeEventListener("context-request", listener);
}
var _tmpl$ = /* @__PURE__ */ template(`<style>`);
var _tmpl$2 = /* @__PURE__ */ template(`<div class=status><div class=spinner></div><div>`);
var _tmpl$3 = /* @__PURE__ */ template(`<section id=surfaces>`);
var _tmpl$4 = /* @__PURE__ */ template(`<div class=empty><div class=empty-title>Canvas (A2UI)`);
var _tmpl$5 = /* @__PURE__ */ template(`<div class=toast>`);
var _tmpl$6 = /* @__PURE__ */ template(`<a2ui-surface>`, 1);
const createSecureActionId = () => {
	const crypto = globalThis.crypto;
	if (typeof crypto?.randomUUID === "function") return crypto.randomUUID();
	if (typeof crypto?.getRandomValues === "function") {
		const bytes = crypto.getRandomValues(/* @__PURE__ */ new Uint8Array(16));
		return `a2ui_${Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("")}`;
	}
	return null;
};
var A2UIModel = class {
	#processor = new A2uiMessageProcessor({
		arrayCtor: SignalArray,
		mapCtor: SignalMap,
		objCtor: SignalObject,
		setCtor: SignalSet
	});
	surfaces = [];
	pendingAction = null;
	toast = null;
	notify = () => {};
	#toastTimer;
	#actionListener = (event) => this.#handleA2UIAction(event);
	#statusListener = (event) => this.#handleActionStatus(event);
	connect(host) {
		host.addEventListener("a2uiaction", this.#actionListener);
		globalThis.addEventListener("openclaw:a2ui-action-status", this.#statusListener);
		const stopTheme = provideTheme(host);
		return () => {
			host.removeEventListener("a2uiaction", this.#actionListener);
			globalThis.removeEventListener("openclaw:a2ui-action-status", this.#statusListener);
			clearTimeout(this.#toastTimer);
			this.toast = null;
			stopTheme();
		};
	}
	get processor() {
		return this.#processor;
	}
	getSurfaces() {
		return Array.from(this.#processor.getSurfaces().keys());
	}
	#setToast(text, kind = "ok", timeoutMs = 1400) {
		const toast = {
			text,
			kind,
			expiresAt: Date.now() + timeoutMs
		};
		this.toast = toast;
		this.notify();
		clearTimeout(this.#toastTimer);
		this.#toastTimer = setTimeout(() => {
			if (this.toast === toast) {
				this.toast = null;
				this.notify();
			}
		}, timeoutMs + 30);
	}
	#handleActionStatus(evt) {
		const detail = evt?.detail ?? null;
		if (!detail || typeof detail.id !== "string") return;
		if (!this.pendingAction || this.pendingAction.id !== detail.id) return;
		if (detail.ok) this.pendingAction = {
			...this.pendingAction,
			phase: "sent",
			sentAt: Date.now()
		};
		else {
			const msg = typeof detail.error === "string" && detail.error ? detail.error : "send failed";
			this.pendingAction = {
				...this.pendingAction,
				phase: "error",
				error: msg
			};
			this.#setToast(`Failed: ${msg}`, "error", 4500);
		}
		this.notify();
	}
	#handleA2UIAction(evt) {
		const payload = evt?.detail ?? evt?.payload ?? null;
		if (!payload || payload.eventType !== "a2ui.action") return;
		const action = payload.action;
		const name = action?.name;
		if (!name) return;
		const sourceComponentId = payload.sourceComponentId ?? "";
		const surfaces = this.#processor.getSurfaces();
		let surfaceId = null;
		let sourceNode = null;
		for (const [sid, surface] of surfaces.entries()) {
			const node = surface?.components?.get?.(sourceComponentId) ?? null;
			if (node) {
				surfaceId = sid;
				sourceNode = node;
				break;
			}
		}
		const context = {};
		const ctxItems = Array.isArray(action?.context) ? action.context : [];
		for (const item of ctxItems) {
			const key = item?.key;
			const value = item?.value ?? null;
			if (!key || !value) continue;
			if (typeof value.path === "string") {
				context[key] = sourceNode ? this.#processor.getData(sourceNode, value.path, surfaceId ?? void 0) : null;
				continue;
			}
			if (Object.hasOwn(value, "literalString")) {
				context[key] = value.literalString ?? "";
				continue;
			}
			if (Object.hasOwn(value, "literalNumber")) {
				context[key] = value.literalNumber ?? 0;
				continue;
			}
			if (Object.hasOwn(value, "literalBoolean")) {
				context[key] = value.literalBoolean ?? false;
				continue;
			}
		}
		const actionId = createSecureActionId();
		if (!actionId) {
			this.#setToast("Secure action identifiers unavailable", "error", 4500);
			return;
		}
		this.pendingAction = {
			id: actionId,
			name,
			phase: "sending",
			startedAt: Date.now()
		};
		this.notify();
		const userAction = {
			id: actionId,
			name,
			surfaceId: surfaceId ?? "main",
			sourceComponentId,
			timestamp: (/* @__PURE__ */ new Date()).toISOString(),
			...Object.keys(context).length ? { context } : {}
		};
		globalThis["__openclawLastA2UIAction"] = userAction;
		const boardApi = globalThis.openclaw;
		if (boardApi?.state?.emit) {
			const request = globalThis.openclawA2UIBoot?.actionTier === "prompt" && boardApi.prompt?.send ? boardApi.prompt.send(Object.keys(context).length ? `A2UI action ${name}: ${JSON.stringify(context)}` : `A2UI action ${name}`) : boardApi.state.emit({
				eventType: "a2ui.action",
				action: userAction
			});
			Promise.resolve(request).then(() => this.#handleActionStatus({ detail: {
				id: actionId,
				ok: true
			} }), (error) => this.#handleActionStatus({ detail: {
				id: actionId,
				ok: false,
				error: String(error?.message ?? error)
			} }));
			return;
		}
		this.pendingAction = {
			id: actionId,
			name,
			phase: "error",
			startedAt: Date.now(),
			error: "missing board action bridge"
		};
		this.#setToast("Failed: missing board action bridge", "error", 4500);
	}
	applyMessages(messages) {
		if (!Array.isArray(messages)) throw new Error("A2UI: expected messages array");
		this.#processor.processMessages(messages);
		this.#syncSurfaces();
		if (this.pendingAction?.phase === "sent") {
			this.#setToast(`Updated: ${this.pendingAction.name}`, "ok", 1100);
			this.pendingAction = null;
		}
		this.notify();
		return {
			ok: true,
			surfaces: this.surfaces.map(([id]) => id)
		};
	}
	reset() {
		this.#processor.clearSurfaces();
		this.#syncSurfaces();
		this.pendingAction = null;
		this.notify();
		return { ok: true };
	}
	#syncSurfaces() {
		this.surfaces = Array.from(this.#processor.getSurfaces().entries());
	}
};
function A2UIApp(props) {
	const model = untrack(() => props.model);
	const [revision, setRevision] = createSignal$1(0);
	model.notify = () => setRevision((value) => value + 1);
	onCleanup(() => {
		model.notify = () => {};
	});
	const read = () => {
		revision();
		return model;
	};
	const statusText = () => {
		const action = read().pendingAction;
		return action ? `${action.phase === "sent" ? "Working" : "Sending"}: ${action.name}` : "";
	};
	return [(() => {
		var _el$ = _tmpl$();
		insert(_el$, hostStyles);
		return _el$;
	})(), createComponent(Show, {
		get when() {
			return read().surfaces.length > 0;
		},
		get fallback() {
			return _tmpl$4();
		},
		get children() {
			return [
				createComponent(Show, {
					get when() {
						return memo(() => {
							return !!read().pendingAction;
						})() ? read().pendingAction.phase !== "error" : read().pendingAction;
					},
					get children() {
						var _el$2 = _tmpl$2();
						var _el$4 = _el$2.firstChild.nextSibling;
						insert(_el$4, statusText);
						return _el$2;
					}
				}),
				createComponent(Show, {
					get when() {
						return read().toast;
					},
					children: (toast) => (() => {
						var _el$7 = _tmpl$5();
						insert(_el$7, () => {
							return toast().text;
						});
						effect$1(() => !!(toast().kind === "error"), (_v$) => {
							_el$7.classList.toggle("error", _v$);
						});
						return _el$7;
					})()
				}),
				(() => {
					var _el$5 = _tmpl$3();
					insert(_el$5, createComponent(For, {
						get each() {
							return read().surfaces;
						},
						keyed: (entry) => entry[0],
						children: (entry) => (() => {
							var _el$8 = _tmpl$6();
							_el$8._$owner = getOwner();
							effect$1(() => {
								return {
									e: entry()[0],
									t: entry()[1],
									a: model.processor
								};
							}, ({ e, t, a }, _p$) => {
								e !== _p$?.e && (_el$8.surfaceId = e);
								t !== _p$?.t && (_el$8.surface = t);
								a !== _p$?.a && (_el$8.processor = a);
							});
							return _el$8;
						})()
					}));
					return _el$5;
				})()
			];
		}
	})];
}
defineHost(A2UIModel, A2UIApp);
