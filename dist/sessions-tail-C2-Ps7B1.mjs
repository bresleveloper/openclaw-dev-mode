import { C as parseStrictNonNegativeInteger } from "./number-coercion-CLj0HTDM.mjs";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { l as resolveAgentIdFromSessionKey } from "./session-key-CBvmC8zz.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { n as sanitizeTerminalText } from "./safe-text-CBmKtmbt.mjs";
import { r as getRuntimeConfig } from "./io.runtime-CZWcIUDk.mjs";
import "./config-DryArA1l.mjs";
import { n as listSessionEntriesReadOnly } from "./session-accessor.sqlite-entry-list.read-Dn1blVrY.mjs";
import { i as classifyAgentRunTerminalOutcome } from "./agent-run-terminal-outcome-CgoAW2Q7.mjs";
import "./session-accessor-C05KQ5A3.mjs";
import { a as resolveStoredSessionKeyForAgentStore } from "./session-store-key-BoleEY7N.mjs";
import { n as resolveSessionStorePathForAcp } from "./session-meta-store-DCl8iLym.mjs";
import { i as buildAgentRunTerminalOutcomeFromLifecycleEvent } from "./agent-run-terminal-outcome-Dto4EMdr.mjs";
import "./session-meta-DHUOlEoy.mjs";
import { t as readAcpSessionMetaForEntry } from "./session-meta-readonly-CY2eWmkz.mjs";
import { n as loadSqliteTrajectoryRuntimeEventRowsSync } from "./runtime-store.sqlite-3vtRfGdn.mjs";
import { t as formatTextCell } from "./text-format-D_7c--rP.mjs";
import { t as resolveCommandSessionStoreTargets } from "./session-store-targets-DIixS5gT.mjs";
//#region src/commands/sessions-tail.ts
const DEFAULT_TAIL_COUNT = 80;
const SESSION_KEY_PAD = 30;
const EVENT_TYPE_PAD = 16;
const FOLLOW_INTERVAL_MS = 1e3;
function parseTailCount(value) {
	if (value === void 0) return DEFAULT_TAIL_COUNT;
	return parseStrictNonNegativeInteger(value) ?? null;
}
function formatTimestamp(ts) {
	const date = new Date(ts);
	if (Number.isNaN(date.getTime())) return "--:--:--";
	return date.toISOString().slice(11, 19);
}
function toolName(data) {
	return normalizeOptionalString(data?.name) ?? normalizeOptionalString(data?.toolName) ?? "tool";
}
function resultStatus(data) {
	if (data?.success === true) return "ok";
	if (data?.success === false || data?.isError === true) return "error";
	return normalizeOptionalString(data?.status) ?? "done";
}
function modelCompletionStatus(data) {
	const outcome = buildAgentRunTerminalOutcomeFromLifecycleEvent({
		phase: "end",
		data: {
			...data,
			stopReason: data?.timedOut === true ? "timeout" : data?.stopReason
		}
	});
	return {
		success: data?.promptError || data?.promptErrorSource || data?.terminalError ? "error" : "done",
		failure: "error",
		timeout: "timeout",
		cancellation: "aborted"
	}[classifyAgentRunTerminalOutcome(outcome)];
}
function safePreview(event) {
	const data = event.data;
	switch (event.type) {
		case "session.started": return "session started";
		case "context.compiled": {
			const tools = Array.isArray(data?.tools) ? data.tools.length : void 0;
			return tools === void 0 ? "context compiled" : `context compiled (${tools} tools)`;
		}
		case "prompt.submitted": return "prompt submitted";
		case "prompt.skipped": {
			const reason = normalizeOptionalString(data?.reason);
			return `prompt skipped${reason ? `: ${reason}` : ""}`;
		}
		case "tool.call": return `${toolName(data)} {...redacted...}`;
		case "tool.timeout": return `${toolName(data)} timeout`;
		case "tool.result": return `${toolName(data)} ${resultStatus(data)}`;
		case "model.completed": {
			const model = [event.provider?.trim(), event.modelId?.trim()].filter(Boolean).join("/");
			const status = modelCompletionStatus(data);
			return model ? `${model} ${status}` : status;
		}
		case "session.ended": return normalizeOptionalString(data?.status) ?? "ended";
		case "trace.truncated": return "trajectory truncated";
		default: return normalizeOptionalString(data?.status) ?? normalizeOptionalString(data?.name) ?? "";
	}
}
function formatProgressLine(event) {
	const sessionKey = event.sessionKey ?? event.sessionId;
	const sessionLabel = formatTextCell(sanitizeTerminalText(sessionKey), SESSION_KEY_PAD);
	const typeLabel = formatTextCell(sanitizeTerminalText(event.type), EVENT_TYPE_PAD);
	const preview = safePreview(event);
	return [
		formatTimestamp(event.ts),
		typeLabel,
		sessionLabel,
		preview
	].join(" ").trimEnd();
}
function readTailSnapshot(selection, tailEvents) {
	const rows = loadSqliteTrajectoryRuntimeEventRowsSync({
		agentId: selection.agentId,
		sessionId: selection.sessionId,
		storePath: selection.storePath,
		tailEvents
	});
	return {
		events: rows.map((row) => row.event),
		maxStorageSeq: rows.at(-1)?.seq ?? -1
	};
}
function renderEvents(events, runtime) {
	for (const event of events) runtime.log(formatProgressLine(event));
}
function isRunningSession(selection) {
	const cfg = getRuntimeConfig();
	const sessionKey = resolveStoredSessionKeyForAgentStore({
		cfg,
		agentId: selection.agentId,
		sessionKey: selection.key
	});
	const { agentId } = resolveSessionStorePathForAcp({
		cfg,
		sessionKey
	});
	const acpMeta = readAcpSessionMetaForEntry({
		cfg,
		sessionKey,
		agentId,
		entry: selection.entry
	});
	return selection.entry.status === "running" || acpMeta?.state === "running";
}
function compareSelectionsByUpdatedAt(a, b) {
	return (b.entry.updatedAt ?? 0) - (a.entry.updatedAt ?? 0);
}
function buildTailSelection(params) {
	const sessionId = params.entry.sessionId?.trim();
	return sessionId ? {
		...params,
		sessionId
	} : null;
}
function selectSessionsToTail(selections, sessionKey) {
	const requested = sessionKey?.trim();
	if (requested) return selections.filter((selection) => selection.key === requested);
	const running = selections.filter((selection) => isRunningSession(selection));
	if (running.length > 0) return running.toSorted(compareSelectionsByUpdatedAt);
	const latest = selections.toSorted(compareSelectionsByUpdatedAt)[0];
	return latest ? [latest] : [];
}
function readNewSqliteFollowEvents(state) {
	const rows = loadSqliteTrajectoryRuntimeEventRowsSync({
		agentId: state.selection.agentId,
		afterSeq: state.lastStorageSeq,
		sessionId: state.selection.sessionId,
		storePath: state.selection.storePath
	});
	if (rows.length === 0) return [];
	state.lastStorageSeq = rows.at(-1)?.seq ?? state.lastStorageSeq;
	return rows.map((row) => row.event);
}
function followSelections(selections, runtime, initialSnapshots) {
	const states = selections.map((selection) => {
		return {
			lastStorageSeq: initialSnapshots.get(selection)?.maxStorageSeq ?? -1,
			selection
		};
	});
	return new Promise((resolve) => {
		let finished = false;
		const interval = setInterval(() => {
			for (const state of states) try {
				renderEvents(readNewSqliteFollowEvents(state), runtime);
			} catch (error) {
				runtime.error(`Failed to read trajectory progress for ${state.selection.key}: ${formatErrorMessage(error)}`);
				return finish("ERROR");
			}
		}, FOLLOW_INTERVAL_MS);
		const finish = (outcome) => {
			if (!finished) {
				finished = true;
				clearInterval(interval);
				process.off("SIGINT", stopSigint);
				process.off("SIGTERM", stopSigterm);
				resolve(outcome);
			}
		};
		const stopSigint = () => finish("SIGINT");
		const stopSigterm = () => finish("SIGTERM");
		process.once("SIGINT", stopSigint);
		process.once("SIGTERM", stopSigterm);
	});
}
function resolveTailTargetAgent(opts) {
	if (opts.agent !== void 0 || opts.store !== void 0 || opts.allAgents === true) return opts.agent;
	return opts.sessionKey?.trim() ? resolveAgentIdFromSessionKey(opts.sessionKey) : void 0;
}
/** Tails recent trajectory events for the selected session(s). */
async function sessionsTailCommand(opts, runtime) {
	const tailCount = parseTailCount(opts.tail);
	if (tailCount === null) {
		runtime.error("--tail must be a non-negative integer, for example --tail 25.");
		runtime.exit(1);
		return;
	}
	const cfg = getRuntimeConfig();
	const targets = resolveCommandSessionStoreTargets({
		cfg,
		opts: {
			store: opts.store,
			agent: resolveTailTargetAgent(opts),
			allAgents: opts.allAgents
		}
	});
	const selections = [];
	for (const target of targets) for (const { sessionKey, entry } of listSessionEntriesReadOnly({
		agentId: target.agentId,
		storePath: target.storePath,
		projection: "list"
	})) {
		const selection = buildTailSelection({
			agentId: target.agentId,
			entry,
			key: sessionKey,
			storePath: target.storePath
		});
		if (selection) selections.push(selection);
	}
	const selected = selectSessionsToTail(selections, opts.sessionKey);
	if (selected.length === 0) {
		const suffix = opts.sessionKey ? ` for ${opts.sessionKey}` : "";
		runtime.log(`No sessions found${suffix}.`);
		return;
	}
	const followSnapshots = /* @__PURE__ */ new Map();
	for (const selection of selected) {
		const snapshot = readTailSnapshot(selection, Math.max(tailCount, opts.follow ? 1 : 0));
		followSnapshots.set(selection, snapshot);
		renderEvents(tailCount > 0 ? snapshot.events.slice(-tailCount) : [], runtime);
	}
	if (opts.follow) {
		const outcome = await followSelections(selected, runtime, followSnapshots);
		runtime.exit(outcome === "ERROR" ? 1 : outcome === "SIGINT" ? 130 : 143);
	}
}
//#endregion
export { sessionsTailCommand };
