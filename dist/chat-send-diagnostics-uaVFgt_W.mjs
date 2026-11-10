import { n as createQueuedDiagnosticPhaseEmitter } from "./diagnostic-events-C91J-XX8.mjs";
import { t as createPhaseTimings } from "./phase-timings-CyAGitir.mjs";
import { performance } from "node:perf_hooks";
//#region src/gateway/server-methods/chat-send-diagnostics.ts
const PHASES = [
	"authority",
	"admission",
	"preparation",
	"attachments",
	"replyContext",
	"authoring",
	"persist",
	"runAdmission",
	"replyInitialization",
	"snapshot",
	"worktree",
	"effects",
	"response",
	"dispatch"
];
const requestDiagnostics = /* @__PURE__ */ new WeakMap();
/** Internal request attachment; handler spans do not expand the public plugin options. */
function bindChatSendDiagnostics(request, diagnostics) {
	if (diagnostics) requestDiagnostics.set(request, diagnostics);
}
function readChatSendDiagnostics(request) {
	return requestDiagnostics.get(request);
}
/** Request-owned totals; nested and parallel phases can overlap. */
function startChatSendDiagnostics(log) {
	const emit = createQueuedDiagnosticPhaseEmitter();
	const timing = createPhaseTimings();
	const { totals } = timing;
	let stage = "request";
	let startedAt = performance.now();
	let acknowledgedMs;
	let finished = false;
	const report = () => {
		const now = performance.now();
		timing.flush(now);
		const elapsedMs = now - startedAt;
		const endedAt = Date.now();
		try {
			let message = `slow chat send ${Math.round(elapsedMs)}ms stage=${stage}`;
			if (acknowledgedMs !== void 0) message += ` ack=${Math.round(acknowledgedMs)}ms`;
			for (const phase of [...PHASES, ...[...totals.keys()].filter((name) => name.startsWith("detail.")).toSorted()]) {
				const durationMs = totals.get(phase);
				if (durationMs === void 0) continue;
				emit?.({
					name: `chat.send.${phase}`,
					startedAt: endedAt - elapsedMs,
					endedAt,
					durationMs,
					details: { stage }
				});
				message += ` ${phase}=${Math.round(durationMs)}ms`;
			}
			if (elapsedMs >= 1e3) log.info(message);
		} catch {}
		totals.clear();
		startedAt = now;
		return elapsedMs;
	};
	const finish = (disposition) => {
		if (!finished) {
			if (disposition?.isSteered()) stage = "steer";
			else if (disposition?.isEnqueued() || disposition?.isTerminal()) stage = "queued";
			report();
			finished = true;
			timing.close();
		}
	};
	const scope = (phase) => finished ? void 0 : timing.scope(phase);
	return {
		scope,
		observeSpan: (name, attributes) => {
			const spanName = name === "agent.prepare" ? attributes?.stage : name;
			return typeof spanName === "string" ? scope(`detail.${spanName}`)?.finish : void 0;
		},
		acknowledge(disposition = "startup") {
			if (!finished && stage === "request") {
				acknowledgedMs = report();
				stage = disposition;
			}
		},
		finish,
		[Symbol.dispose]() {
			if (stage === "request") finish();
		}
	};
}
//#endregion
export { readChatSendDiagnostics as n, startChatSendDiagnostics as r, bindChatSendDiagnostics as t };
