import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { t as createSubsystemLogger } from "./subsystem-mStysHHC.mjs";
import { t as truncateUtf8Prefix } from "./utf8-truncate-_hf7tp13.mjs";
import { n as DEFAULT_TERMINAL_DETACH_SECONDS } from "./session-limits-BqiIRDwa.mjs";
import { r as spawnTerminalPty } from "./terminal-pty-AuGVyE64.mjs";
import { n as stageTerminalUpload, t as ensureTerminalUploadCleanup } from "./terminal-file-upload-BoijgX90.mjs";
import { t as TerminalOutputRing } from "./output-ring-JEXRz5AY.mjs";
import { n as TERMINAL_EVENT_EXIT, t as TERMINAL_EVENT_DATA } from "./gateway-transport-BMjBhNL-.mjs";
import { randomUUID } from "node:crypto";
//#region src/gateway/terminal/agent-session-drain.ts
function agentTerminalOwnerMatches(owner, expected) {
	return owner?.kind === "agent" && owner.agentSessionKey === expected.agentSessionKey && owner.agentSessionId === expected.agentSessionId && owner.agentId === expected.agentId;
}
function drainKey(owner) {
	return JSON.stringify(typeof owner === "string" ? [owner] : [
		owner.agentSessionKey,
		owner.agentSessionId,
		owner.agentId
	]);
}
var AgentTerminalSessionDrainTracker = class {
	constructor() {
		this.active = /* @__PURE__ */ new Map();
		this.exiting = /* @__PURE__ */ new Set();
	}
	begin(owner, params) {
		params.assertCurrent?.();
		const matches = (terminalOwner, agentId) => typeof owner === "string" ? agentId === owner : agentTerminalOwnerMatches(terminalOwner, owner);
		const pending = [...params.pendingOpens].filter(([entry, pendingOwner]) => matches(pendingOwner, entry.agentId)).map(([entry]) => entry);
		const sessions = [...params.sessions.values()].filter((session) => !session.closed && matches(session.owner, session.agentId));
		let pendingWork = pending;
		let sessionWork = [...sessions, ...[...this.exiting].filter((session) => matches(session.owner, session.agentId))];
		const hasWork = () => pendingWork.some((entry) => params.pendingOpens.has(entry)) || sessionWork.some((session) => !session.closed || this.exiting.has(session));
		const key = drainKey(owner);
		const drained = createDeferredCore();
		let failure;
		let cancelling = true;
		const settle = () => {
			if (!cancelling && !hasWork()) {
				if (failure) drained.reject(failure.error);
				else drained.resolve();
			}
		};
		const receipts = this.active.get(key) ?? /* @__PURE__ */ new Set();
		receipts.add(settle);
		this.active.set(key, receipts);
		const receipt = {
			drained: drained.promise,
			hasWork,
			release: () => {
				if (receipts.delete(settle) && receipts.size === 0) this.active.delete(key);
			}
		};
		let cancelledPending = 0;
		try {
			for (const entry of pending) {
				params.assertCurrent?.();
				entry.abort("terminal closed because its owner is draining");
				cancelledPending += 1;
			}
			for (const session of sessions) if (!session.closed) {
				params.assertCurrent?.();
				params.closeSession(session);
			}
		} catch (error) {
			pendingWork = pending.slice(0, cancelledPending);
			sessionWork = sessions.filter((session) => session.closed);
			if (pendingWork.length === 0 && sessionWork.length === 0) {
				receipt.release();
				throw error;
			}
			failure = { error };
		}
		cancelling = false;
		settle();
		return receipt;
	}
	isActive(owner, agentId) {
		return this.active.has(drainKey(agentId)) || owner.kind === "agent" && this.active.has(drainKey(owner));
	}
	trackExit(session) {
		this.exiting.add(session);
	}
	observeExit(session) {
		this.exiting.delete(session);
	}
	settleIfIdle(owner, agentId) {
		for (const key of [drainKey(agentId), ...owner?.kind === "agent" ? [drainKey(owner)] : []]) for (const settle of this.active.get(key) ?? []) settle();
	}
};
//#endregion
//#region src/gateway/terminal/intro-banner.ts
const RESET = "\x1B[0m";
const TERMINAL_INTRO_ART = [
	"          ..              ..",
	"        .●●:.:          • •●●",
	"       .●●●•●●          ●•●●●●",
	"       :●●●●●•  ..  ..  ●●●●●●.",
	"       .●●●●●::.:●••●:..•●●●●●",
	"        :●●●●.  :●●●●.  :●●●●.",
	"         •●●●•  ●●●●●● .●●●●:",
	"        ..:••●●•●●●●●●•●●••...",
	"       ..:●•●••●●●●●●●●••●●•:..",
	"       :.:•:•••●●●●●●●••••••:.:",
	"       .•. ●:..:●●●●●●...:• :•",
	"          .:.   ●●●●●●   .:.",
	"            .   ●●●●●•   .",
	"           .   :●●●●●●.   .",
	"              ●●●●●●●●●•",
	"              .::•::•::"
];
function composeTerminalIntroBanner() {
	return `\r\n${`\x1b[33mWelcome to the Claw.${RESET}`}\r\n\r\n${`\x1b[91m${TERMINAL_INTRO_ART.join("\r\n")}\r\n\r\n`}${RESET}`;
}
//#endregion
//#region src/gateway/terminal/output-flow-control.ts
const TERMINAL_OUTPUT_HIGH_WATER_BYTES = 4194304;
const TERMINAL_OUTPUT_LOW_WATER_BYTES = 524288;
const TERMINAL_OUTPUT_REASSERT_MS = 5e3;
const INTERACTIVE_OUTPUT_BYTES = 1024;
const INTERACTIVE_OUTPUT_WINDOW_MS = 100;
const TERMINAL_OUTPUT_COALESCE_WINDOW_MS = 4;
const TERMINAL_OUTPUT_FRAME_BYTES = 65536;
/** Couples PTY output batching to the live recipient WebSockets' send pressure. */
var TerminalOutputController = class {
	constructor(options) {
		this.options = options;
		this.chunks = [];
		this.bufferedBytes = 0;
		this.coalesceTimer = null;
		this.endOffsetValue = 0;
		this.emittedOffset = 0;
		this.lastInputAtMs = Number.NEGATIVE_INFINITY;
		this.desiredPaused = false;
		this.reassertTimer = null;
		this.options = { ...options };
	}
	/** Cumulative UTF-16 end offset across streamed and detached output. */
	get endOffset() {
		return this.endOffsetValue;
	}
	push(chunk) {
		this.options.record(chunk);
		this.endOffsetValue += chunk.length;
		const connIds = this.options.getConnIds();
		if (connIds.length === 0) return;
		if (this.chunks.length === 0) this.reconcile(connIds);
		const interactive = Buffer.byteLength(chunk, "utf8") <= INTERACTIVE_OUTPUT_BYTES && Date.now() - this.lastInputAtMs <= INTERACTIVE_OUTPUT_WINDOW_MS;
		let remaining = chunk;
		while (remaining) {
			const part = truncateUtf8Prefix(remaining, TERMINAL_OUTPUT_FRAME_BYTES - this.bufferedBytes);
			if (!part) {
				this.flush();
				continue;
			}
			this.chunks.push(part);
			this.bufferedBytes += Buffer.byteLength(part, "utf8");
			remaining = remaining.slice(part.length);
			if (this.bufferedBytes >= TERMINAL_OUTPUT_FRAME_BYTES) this.flush();
		}
		if (interactive) this.flush();
		else if (!this.coalesceTimer && this.chunks.length > 0) {
			this.coalesceTimer = setTimeout(() => this.flush(), TERMINAL_OUTPUT_COALESCE_WINDOW_MS);
			this.coalesceTimer.unref?.();
		}
	}
	noteInput() {
		this.lastInputAtMs = Date.now();
	}
	/** Reassesses flow control immediately when the live recipient set changes. */
	reconcileRecipients() {
		this.reconcile(this.options.getConnIds());
	}
	/** Flushes existing viewers, then aligns live frames after the attach snapshot. */
	prepareViewerAttach() {
		this.flush();
		this.emittedOffset = this.endOffsetValue;
	}
	resetOwnership() {
		this.clear();
		this.emittedOffset = this.endOffsetValue;
		this.lastInputAtMs = Number.NEGATIVE_INFINITY;
		if (this.reassertTimer) {
			this.desiredPaused = false;
			this.applyFlowControl();
		}
	}
	dispose(opts) {
		if (opts?.flush) this.flush();
		else this.clear();
		if (this.reassertTimer) {
			clearInterval(this.reassertTimer);
			this.reassertTimer = null;
			this.desiredPaused = false;
			this.applyFlowControl();
		}
	}
	clear() {
		clearTimeout(this.coalesceTimer ?? void 0);
		this.coalesceTimer = null;
		this.chunks = [];
		this.bufferedBytes = 0;
	}
	flush() {
		const chunks = this.chunks;
		this.clear();
		if (chunks.length === 0) return;
		const connIds = this.options.getConnIds();
		if (connIds.length === 0) return;
		const data = chunks.join("");
		this.emittedOffset += data.length;
		this.options.emit(connIds, data, this.emittedOffset);
		this.reconcile(connIds);
	}
	reconcile(connIds, reassert = false) {
		const bufferedAmount = this.maxBufferedAmount(connIds);
		const previous = this.desiredPaused;
		if (bufferedAmount === void 0) {
			if (!reassert) return;
			this.desiredPaused = false;
		} else if (bufferedAmount >= TERMINAL_OUTPUT_HIGH_WATER_BYTES) {
			if (!reassert) this.ensureReassertTimer();
			this.desiredPaused = true;
		} else if (bufferedAmount <= TERMINAL_OUTPUT_LOW_WATER_BYTES) this.desiredPaused = false;
		if (reassert || previous !== this.desiredPaused) this.applyFlowControl();
	}
	ensureReassertTimer() {
		if (this.reassertTimer) return;
		this.reassertTimer = setInterval(() => this.reconcile(this.options.getConnIds(), true), TERMINAL_OUTPUT_REASSERT_MS);
		this.reassertTimer.unref?.();
	}
	maxBufferedAmount(connIds) {
		let maximum;
		for (const connId of connIds) {
			const amount = this.options.getBufferedAmount(connId);
			if (amount !== void 0 && (maximum === void 0 || amount > maximum)) maximum = amount;
		}
		return maximum;
	}
	applyFlowControl() {
		try {
			this.options.backend[this.desiredPaused ? "pause" : "resume"]();
		} catch {}
	}
};
//#endregion
//#region src/gateway/terminal/session-connection-index.ts
/** Reverse indexes live sessions and in-flight opens by their browser connection. */
var TerminalConnectionIndex = class {
	constructor() {
		this.entries = /* @__PURE__ */ new Map();
	}
	add(connId, value) {
		const values = this.entries.get(connId) ?? /* @__PURE__ */ new Set();
		values.add(value);
		this.entries.set(connId, values);
	}
	remove(connId, value) {
		const values = this.entries.get(connId);
		values?.delete(value);
		if (values?.size === 0) this.entries.delete(connId);
	}
	get(connId) {
		const values = this.entries.get(connId);
		return values ? [...values] : void 0;
	}
	clear(connId) {
		this.entries.delete(connId);
	}
};
//#endregion
//#region src/gateway/terminal/session-projection.ts
function terminalAttachSummary(session) {
	const { attached: _attached, createdAtMs: _createdAtMs, ...summary } = terminalSessionSummary(session);
	return {
		...summary,
		buffer: session.buffer.snapshot(),
		seq: session.output.endOffset
	};
}
function terminalSessionSummary(session) {
	const owner = session.owner?.kind === "agent" ? `agent:${session.owner.agentSessionKey}` : "conn";
	return {
		sessionId: session.id,
		agentId: session.agentId,
		shell: session.shell,
		...session.title ? { title: session.title } : {},
		cwd: session.cwd,
		attached: session.owner?.kind === "conn" || session.owner?.kind === "agent" && session.viewers.size > 0,
		owner,
		createdAtMs: session.createdAtMs
	};
}
function terminalSessionRecipientIds(session) {
	const connIds = [...session.viewers];
	if (session.owner?.kind === "conn" && !session.viewers.has(session.owner.connId)) connIds.push(session.owner.connId);
	return connIds;
}
//#endregion
//#region src/gateway/terminal/session-manager.ts
const log = createSubsystemLogger("gateway/terminal");
function killTerminalBackend(backend) {
	try {
		backend.kill();
	} catch {}
}
/** Owns PTYs and indexes their connections for bounded disconnect cleanup. */
var TerminalSessionManager = class {
	constructor(options) {
		this.sessions = /* @__PURE__ */ new Map();
		this.pendingOpens = /* @__PURE__ */ new Map();
		this.agentSessionDrain = new AgentTerminalSessionDrainTracker();
		this.sessionConnections = new TerminalConnectionIndex();
		this.pendingConnections = new TerminalConnectionIndex();
		this.opening = 0;
		this.spawning = 0;
		ensureTerminalUploadCleanup();
		this.emit = options.emit;
		this.getBufferedAmount = options.getBufferedAmount ?? (() => void 0);
		this.spawn = options.spawn ?? spawnTerminalPty;
		this.withOpenAdmission = options.withOpenAdmission;
		this.maxSessions = options.maxSessions ?? 24;
		this.detachGraceMs = options.detachGraceMs ?? 0;
		this.maxDetachedSessions = options.maxDetachedSessions ?? 8;
		this.scrollbackChars = options.scrollbackChars ?? 262144;
	}
	get size() {
		return this.sessions.size;
	}
	async open(request) {
		return this.withOpenAdmission ? await this.withOpenAdmission(request, (admitted) => this.openAdmitted(admitted)) : await this.openAdmitted(request);
	}
	async openAdmitted(request) {
		if (request.signal?.aborted) return {
			ok: false,
			code: "closed",
			message: this.openAbortMessage(request.signal)
		};
		if (this.agentSessionDrain.isActive(request.owner, request.agentId)) return {
			ok: false,
			code: "closed",
			message: "terminal session is closing"
		};
		if (this.spawning >= this.maxSessions * 2) return {
			ok: false,
			code: "limit",
			message: `terminal spawn limit reached (${this.maxSessions * 2})`
		};
		const sessionLimitReached = () => ({
			ok: false,
			code: "limit",
			message: `terminal session limit reached (${this.maxSessions})`
		});
		let evictionCandidate;
		if (this.sessions.size + this.opening >= this.maxSessions) {
			evictionCandidate = this.claimLongestIdleAgentSession();
			if (!evictionCandidate) return sessionLimitReached();
		}
		const releaseEvictionClaim = () => {
			if (evictionCandidate) {
				evictionCandidate.evictionClaimed = false;
				evictionCandidate = void 0;
			}
		};
		this.opening += 1;
		this.spawning += 1;
		let reservationActive = true;
		const releaseReservation = () => {
			if (!reservationActive) return;
			reservationActive = false;
			this.opening -= 1;
		};
		const pending = {
			agentId: request.agentId,
			abort: (message) => {
				pending.abortMessage ??= message;
				releaseReservation();
				releaseEvictionClaim();
			}
		};
		const abortPending = () => {
			pending.abort(this.openAbortMessage(request.signal));
		};
		request.signal?.addEventListener("abort", abortPending, { once: true });
		this.trackPendingOpen(request.owner, pending, request.viewerConnId);
		let backend;
		const spawn = this.spawn;
		try {
			backend = request.createBackend ? await request.createBackend() : await spawn({
				file: request.shell,
				args: request.args,
				cwd: request.cwd,
				env: request.env,
				cols: request.cols,
				rows: request.rows
			});
		} catch (err) {
			this.spawning -= 1;
			releaseReservation();
			this.untrackPendingOpen(request.owner, pending, request.viewerConnId);
			releaseEvictionClaim();
			request.signal?.removeEventListener("abort", abortPending);
			return {
				ok: false,
				code: "spawn_failed",
				message: err instanceof Error ? err.message : String(err)
			};
		}
		this.spawning -= 1;
		releaseReservation();
		request.signal?.removeEventListener("abort", abortPending);
		if (pending.abortMessage) {
			releaseEvictionClaim();
			backend.onExit(() => this.untrackPendingOpen(request.owner, pending, request.viewerConnId));
			killTerminalBackend(backend);
			return {
				ok: false,
				code: "closed",
				message: pending.abortMessage
			};
		}
		this.untrackPendingOpen(request.owner, pending, request.viewerConnId);
		if (evictionCandidate) {
			releaseEvictionClaim();
			if (this.sessions.size + this.opening >= this.maxSessions) {
				const victim = this.claimLongestIdleAgentSession();
				if (!victim) {
					killTerminalBackend(backend);
					return sessionLimitReached();
				}
				victim.evictionClaimed = false;
				log.info(`evicted idle agent terminal session under pool pressure: id=${victim.id} agent=${victim.agentId} idleMs=${Date.now() - victim.lastActivityAtMs}`);
				this.finalize(victim, "closed", {});
			}
		}
		const sessionId = randomUUID();
		const buffer = new TerminalOutputRing(this.scrollbackChars);
		const output = new TerminalOutputController({
			backend,
			getConnIds: () => terminalSessionRecipientIds(session),
			getBufferedAmount: this.getBufferedAmount,
			record: (chunk) => buffer.push(chunk),
			emit: (connIds, data, seq) => {
				for (const connId of connIds) this.emit(connId, TERMINAL_EVENT_DATA, {
					sessionId,
					seq,
					data
				});
			}
		});
		const session = {
			id: sessionId,
			owner: request.owner,
			viewers: request.viewerConnId ? /* @__PURE__ */ new Set([request.viewerConnId]) : /* @__PURE__ */ new Set(),
			...request.owner.kind === "agent" && request.viewerConnId ? { unadoptedViewerConnId: request.viewerConnId } : {},
			agentId: request.agentId,
			cwd: request.cwd,
			shell: request.shell,
			...request.title ? { title: request.title } : {},
			backend,
			stageUpload: request.stageUpload ?? stageTerminalUpload,
			closed: false,
			createdAtMs: Date.now(),
			buffer,
			output,
			reaper: null,
			detachedAtMs: null,
			lastActivityAtMs: Date.now()
		};
		this.sessions.set(session.id, session);
		if (request.owner.kind === "conn") this.sessionConnections.add(request.owner.connId, session.id);
		if (request.viewerConnId) this.sessionConnections.add(request.viewerConnId, session.id);
		if (request.owner.kind === "conn" || request.viewerConnId) session.output.push(composeTerminalIntroBanner());
		backend.onData((chunk) => {
			if (!session.closed) {
				session.lastActivityAtMs = Date.now();
				session.output.push(chunk);
			}
		});
		backend.onExit((event) => {
			this.agentSessionDrain.observeExit(session);
			const signal = event.signal && event.signal !== 0 ? event.signal : null;
			this.finalize(session, event.error ? "error" : "process_exit", {
				exitCode: event.exitCode ?? null,
				signal,
				...event.error ? { error: event.error } : {}
			}, { backendExited: true });
			this.agentSessionDrain.settleIfIdle(session.owner, session.agentId);
		});
		return {
			ok: true,
			sessionId: session.id,
			agentId: session.agentId,
			cwd: session.cwd,
			shell: session.shell
		};
	}
	write(connId, sessionId, data) {
		return this.updateSession(connId, sessionId, ["write", data]).ok;
	}
	/** Writes agent input after proving exact agent-session ownership. */
	writeAgent(owner, sessionId, data) {
		return this.updateSession(owner, sessionId, ["write", data]);
	}
	resize(connId, sessionId, cols, rows) {
		return this.updateSession(connId, sessionId, [
			"resize",
			cols,
			rows
		]).ok;
	}
	/** Resizes an agent-owned PTY after proving exact agent-session ownership. */
	resizeAgent(owner, sessionId, cols, rows) {
		return this.updateSession(owner, sessionId, [
			"resize",
			cols,
			rows
		]);
	}
	updateSession(owner, sessionId, action) {
		const session = this.ownedSession(owner, sessionId);
		if (!session) return {
			ok: false,
			code: "session_unavailable"
		};
		try {
			if (action[0] === "write") {
				session.lastActivityAtMs = Date.now();
				session.output.noteInput();
				session.backend.write(action[1]);
			} else session.backend.resize(action[1], action[2]);
			return { ok: true };
		} catch {
			this.finalize(session, "error", { error: `${action[0]} failed` });
			return {
				ok: false,
				code: "backend_failed"
			};
		}
	}
	/** Stages a file on the same host as an owned terminal session. */
	async upload(connId, sessionId, file) {
		const session = this.ownedSession(connId, sessionId);
		if (!session) return;
		const result = await session.stageUpload(file);
		return this.ownedSession(connId, sessionId) === session ? result : void 0;
	}
	close(connId, sessionId) {
		const session = this.sessions.get(sessionId);
		if (!session) return false;
		if (session.owner?.kind === "agent") {
			if (!session.viewers.has(connId)) return false;
			if (session.unadoptedViewerConnId === connId) {
				this.finalize(session, "closed", {});
				return true;
			}
			return this.removeViewer(session, connId);
		}
		if (session.owner?.kind !== "conn" || session.owner.connId !== connId || session.closed) return false;
		this.finalize(session, "closed", {});
		return true;
	}
	/** Closes an agent-owned PTY after proving session-key ownership. */
	closeAgent(owner, sessionId) {
		const session = this.ownedSession(owner, sessionId);
		if (!session) return {
			ok: false,
			code: "session_unavailable"
		};
		this.finalize(session, "closed", {});
		return { ok: true };
	}
	/** Exact session for Stop/archive; an agent ID includes every terminal during deletion. */
	beginAgentSessionDrain(owner, assertCurrent) {
		return this.agentSessionDrain.begin(owner, {
			pendingOpens: this.pendingOpens,
			sessions: this.sessions,
			closeSession: (session) => this.finalize(session, "closed", {}, { assertCurrent }),
			assertCurrent
		});
	}
	/**
	* Rebinds a connection-owned session, or co-attaches a viewer to an
	* agent-owned session. Operator-to-operator attach remains take-over; only
	* agent-owned sessions gain shared viewers.
	*/
	attach(connId, sessionId) {
		const session = this.sessions.get(sessionId);
		if (!session || session.closed) return;
		if (session.owner?.kind === "agent") {
			delete session.unadoptedViewerConnId;
			session.output.prepareViewerAttach();
			session.viewers.add(connId);
			this.sessionConnections.add(connId, session.id);
			return terminalAttachSummary(session);
		}
		if (session.reaper) {
			clearTimeout(session.reaper);
			session.reaper = null;
		}
		session.output.resetOwnership();
		session.detachedAtMs = null;
		const previousConnId = session.owner?.kind === "conn" ? session.owner.connId : null;
		if (previousConnId !== null && previousConnId !== connId) {
			this.sessionConnections.remove(previousConnId, session.id);
			this.emit(previousConnId, TERMINAL_EVENT_EXIT, {
				sessionId: session.id,
				exitCode: null,
				signal: null,
				reason: "detached"
			});
		}
		session.owner = {
			kind: "conn",
			connId
		};
		this.sessionConnections.add(connId, session.id);
		return terminalAttachSummary(session);
	}
	/** Every live session, oldest first; all admin connections see the same list. */
	list() {
		return [...this.sessions.values()].filter((session) => !session.closed).map(terminalSessionSummary).toSorted((a, b) => a.createdAtMs - b.createdAtMs);
	}
	snapshot(sessionId) {
		const session = this.sessions.get(sessionId);
		return session && !session.closed ? session.buffer.snapshot() : void 0;
	}
	/** Raw buffer for an agent-owned session, guarded by the caller session key. */
	snapshotAgent(owner, sessionId) {
		return this.ownedSession(owner, sessionId)?.buffer.snapshot();
	}
	listAgent(owner) {
		return [...this.sessions.values()].filter((session) => !session.closed && agentTerminalOwnerMatches(session.owner, owner)).map(terminalSessionSummary).toSorted((a, b) => a.createdAtMs - b.createdAtMs);
	}
	trackPendingOpen(owner, pending, viewerConnId) {
		this.pendingOpens.set(pending, owner);
		const connId = owner.kind === "conn" ? owner.connId : viewerConnId;
		if (connId) this.pendingConnections.add(connId, pending);
	}
	openAbortMessage(signal) {
		return signal?.reason instanceof Error ? signal.reason.message : "terminal open cancelled";
	}
	untrackPendingOpen(owner, pending, viewerConnId) {
		this.pendingOpens.delete(pending);
		this.agentSessionDrain.settleIfIdle(owner, pending.agentId);
		const connId = owner.kind === "conn" ? owner.connId : viewerConnId;
		if (connId) this.pendingConnections.remove(connId, pending);
	}
	/**
	* Handles a dropped connection: detaches its sessions for later reattach
	* when a grace period is configured, otherwise kills them (legacy behavior,
	* still selected by detachedSessionTimeoutSeconds: 0).
	*/
	handleDisconnect(connId) {
		for (const pending of this.pendingConnections.get(connId) ?? []) pending.abort("connection closed during open");
		const ids = this.sessionConnections.get(connId);
		if (!ids) return;
		for (const id of ids) {
			const session = this.sessions.get(id);
			if (!session) continue;
			if (session.owner?.kind === "agent") {
				if (session.unadoptedViewerConnId === connId) {
					this.finalize(session, "disconnected", {}, { silent: true });
					continue;
				}
				this.removeViewer(session, connId);
				continue;
			}
			if (session.owner?.kind !== "conn" || session.owner.connId !== connId) continue;
			if (this.detachGraceMs > 0) this.detach(session);
			else this.finalize(session, "disconnected", {}, { silent: true });
		}
		this.sessionConnections.clear(connId);
	}
	/** Closes live and pending sessions whose agent no longer permits a host shell. */
	closeDisallowedAgents(isAllowed) {
		for (const pending of this.pendingOpens.keys()) if (!isAllowed(pending.agentId)) pending.abort("terminal closed because the agent policy changed");
		for (const session of Array.from(this.sessions.values())) if (!isAllowed(session.agentId)) this.finalize(session, "closed", { error: "terminal closed because the agent policy changed" });
	}
	/** Parks a session ownerless with a reaper; PTY output keeps buffering. */
	detach(session) {
		session.output.resetOwnership();
		session.owner = null;
		session.detachedAtMs = Date.now();
		this.scheduleDetachedExpiry(session, session.detachedAtMs);
		this.enforceDetachedCap();
	}
	updateDetachGraceMs(graceMs) {
		if (this.detachGraceMs === graceMs) return;
		this.detachGraceMs = graceMs;
		for (const session of this.sessions.values()) if (session.detachedAtMs !== null) this.scheduleDetachedExpiry(session, session.detachedAtMs);
	}
	scheduleDetachedExpiry(session, detachedAtMs) {
		if (session.reaper) clearTimeout(session.reaper);
		const remainingMs = detachedAtMs + this.detachGraceMs - Date.now();
		if (remainingMs <= 0) {
			this.finalize(session, "disconnected", {}, { silent: true });
			return;
		}
		session.reaper = setTimeout(() => {
			this.finalize(session, "disconnected", {}, { silent: true });
		}, remainingMs);
		session.reaper.unref?.();
	}
	enforceDetachedCap() {
		const detached = [...this.sessions.values()].filter((session) => !session.closed && session.owner === null).toSorted((a, b) => (a.detachedAtMs ?? 0) - (b.detachedAtMs ?? 0));
		for (const session of detached.slice(0, Math.max(0, detached.length - this.maxDetachedSessions))) this.finalize(session, "disconnected", {}, { silent: true });
	}
	/** Tears down all sessions silently on Gateway shutdown; their sockets are closing too. */
	disposeAll() {
		for (const pending of this.pendingOpens.keys()) pending.abort("gateway closed during terminal open");
		for (const session of Array.from(this.sessions.values())) this.finalize(session, "disconnected", {}, { silent: true });
	}
	/** Viewer-free agent PTYs may be evicted; concurrent opens claim distinct victims. */
	claimLongestIdleAgentSession() {
		let candidate;
		for (const session of this.sessions.values()) {
			if (session.closed || session.evictionClaimed || session.owner?.kind !== "agent" || session.viewers.size > 0) continue;
			if (!candidate || session.lastActivityAtMs < candidate.lastActivityAtMs) candidate = session;
		}
		if (candidate) candidate.evictionClaimed = true;
		return candidate;
	}
	removeViewer(session, connId) {
		if (!session.viewers.delete(connId)) return false;
		this.sessionConnections.remove(connId, session.id);
		if (session.viewers.size === 0) session.output.resetOwnership();
		else session.output.reconcileRecipients();
		return true;
	}
	/** Browser viewers and exact agent owners share the same adoption boundary. */
	ownedSession(owner, sessionId) {
		const session = this.sessions.get(sessionId);
		if (!session || session.closed) return;
		if (typeof owner === "string" && session.owner?.kind === "conn") return session.owner.connId === owner ? session : void 0;
		if (!(typeof owner === "string" ? session.owner?.kind === "agent" && session.viewers.has(owner) : agentTerminalOwnerMatches(session.owner, owner))) return;
		delete session.unadoptedViewerConnId;
		return session;
	}
	finalize(session, reason, detail, opts) {
		if (session.closed) return;
		const recipients = terminalSessionRecipientIds(session);
		if (!opts?.silent && recipients.length > 0) session.output.flush();
		opts?.assertCurrent?.();
		session.output.dispose();
		session.closed = true;
		if (session.reaper) {
			clearTimeout(session.reaper);
			session.reaper = null;
		}
		if (!opts?.backendExited) this.agentSessionDrain.trackExit(session);
		killTerminalBackend(session.backend);
		this.sessions.delete(session.id);
		if (session.owner?.kind === "conn") this.sessionConnections.remove(session.owner.connId, session.id);
		for (const viewerConnId of session.viewers) this.sessionConnections.remove(viewerConnId, session.id);
		session.viewers.clear();
		if (!opts?.silent) for (const connId of recipients) this.emit(connId, TERMINAL_EVENT_EXIT, {
			sessionId: session.id,
			exitCode: detail.exitCode ?? null,
			signal: detail.signal ?? null,
			reason,
			...detail.error ? { error: detail.error } : {}
		});
	}
};
//#endregion
export { DEFAULT_TERMINAL_DETACH_SECONDS, TerminalSessionManager };
