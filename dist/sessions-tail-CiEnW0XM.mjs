import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { C as parseStrictNonNegativeInteger } from "./number-coercion-CkhMiRw8.mjs";
import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { n as sanitizeTerminalText } from "./safe-text-BjmWJADa.mjs";
import { i as classifyAgentRunTerminalOutcome } from "./agent-run-terminal-outcome-CrMEEYuY.mjs";
import { l as resolveAgentIdFromSessionKey } from "./session-key-CSDERtm3.mjs";
import { t as formatCliCommand } from "./command-format-CYoE8cOC.mjs";
import { t as captureRuntimeConfigAsyncReader } from "./io.runtime-Ds5uC0Bf.mjs";
import "./session-accessor-Czw4l8kI.mjs";
import { t as listSessionEntriesReadOnly } from "./session-accessor.sqlite-entry-list.read-BLfvs7b2.mjs";
import { s as resolveStoredSessionKeyForAgentStore } from "./session-store-key-DKpto8R6.mjs";
import "./config-B3oiWDlr.mjs";
import { i as buildAgentRunTerminalOutcomeFromLifecycleEvent } from "./agent-run-terminal-outcome-D-ijbyA8.mjs";
import { t as sessionActivityTimestamp } from "./session-activity-timestamp-AzhKZXR9.mjs";
import { o as isGatewayRpcUnavailableError } from "./transport-error-VfHcwKpH.mjs";
import { r as callGatewayFromCliWithTransport } from "./gateway-rpc-Wcwajg7Y.mjs";
import { t as formatTextCell } from "./text-format-ZicORTH1.mjs";
import { n as loadSqliteTrajectoryRuntimeEventRowsSync } from "./runtime-store.sqlite-BujDTVHr.mjs";
import { t as resolveCommandSessionStoreTargets } from "./session-store-targets-Cv9wo-6s.mjs";
//#region src/commands/sessions-tail.ts
const DEFAULT_TAIL_COUNT = 80;
const SESSION_KEY_PAD = 30;
const EVENT_TYPE_PAD = 16;
const FOLLOW_INTERVAL_MS = 1e3;
function formatTimestamp(ts) {
	const date = new Date(ts);
	if (Number.isNaN(date.getTime())) return "--:--:--";
	return `${date.toISOString().slice(11, 19)}Z`;
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
		case "tool.call": return `${toolName(data)} ${JSON.stringify(data?.arguments ?? data?.args ?? {})}`;
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
	const preview = sanitizeTerminalText(safePreview(event));
	return [
		formatTimestamp(event.ts).padEnd(9),
		typeLabel,
		sessionLabel,
		preview
	].join(" ").trimEnd();
}
function renderEvents(events, runtime) {
	for (const event of events) runtime.log(formatProgressLine(event));
}
async function selectSessionsToTail(selections, opts, runtime) {
	if (opts.sessionKey || selections.length === 0) return selections.filter((selection) => selection.key === opts.sessionKey);
	const sorted = selections.toSorted((a, b) => sessionActivityTimestamp(b.entry) - sessionActivityTimestamp(a.entry));
	if (opts.store !== void 0) runtime.log("explicit store: ordered by activity");
	else try {
		const cfg = await captureRuntimeConfigAsyncReader()();
		const { sessions } = await callGatewayFromCliWithTransport("sessions.list", { config: cfg }, {
			activeOnly: true,
			agentId: opts.allAgents ? void 0 : selections[0]?.agentId,
			limit: selections.length,
			includeGlobal: true,
			includeUnknown: true
		}, { progress: false });
		const running = new Map(sessions.filter((row) => row.hasActiveRun && row.status !== "queued").map((row) => [row.key, row.sessionId]));
		const active = sorted.filter((selection) => running.get(resolveStoredSessionKeyForAgentStore({
			cfg,
			agentId: selection.agentId,
			sessionKey: selection.key
		})) === selection.sessionId);
		if (active.length > 0) return active;
	} catch (error) {
		if (!isGatewayRpcUnavailableError(error)) throw error;
		runtime.log("Gateway unreachable: showing the most recently active session");
	}
	return sorted.slice(0, 1);
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
function followSelections(states, runtime) {
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
function resolveTailTargetAgent(opts, sessionKey) {
	if (opts.agent !== void 0 || opts.store !== void 0 || opts.allAgents === true) return opts.agent;
	return sessionKey ? resolveAgentIdFromSessionKey(sessionKey) : void 0;
}
/** Tails recent trajectory events for the selected session(s). */
async function sessionsTailCommand(opts, runtime) {
	const tailCount = opts.tail === void 0 ? DEFAULT_TAIL_COUNT : parseStrictNonNegativeInteger(opts.tail);
	if (tailCount == null) {
		runtime.error("--tail must be a non-negative integer, for example --tail 25.");
		runtime.exit(1);
		return;
	}
	const requestedKey = opts.sessionKey?.trim();
	if (opts.sessionKey !== void 0 && !requestedKey) {
		runtime.error("--session-key must not be empty. Omit it to tail active sessions.");
		runtime.exit(1);
		return;
	}
	const cfg = await captureRuntimeConfigAsyncReader()();
	const targets = resolveCommandSessionStoreTargets({
		cfg,
		opts: {
			store: opts.store,
			agent: resolveTailTargetAgent(opts, requestedKey),
			allAgents: opts.allAgents
		}
	});
	const selections = [];
	for (const target of targets) for (const { sessionKey, entry } of listSessionEntriesReadOnly({
		agentId: target.agentId,
		storePath: target.storePath,
		projection: "list"
	})) {
		const sessionId = entry.sessionId?.trim();
		if (sessionId) selections.push({
			...target,
			entry,
			key: sessionKey,
			sessionId
		});
	}
	const selected = await selectSessionsToTail(selections, {
		...opts,
		sessionKey: requestedKey
	}, runtime);
	if (selected.length === 0) {
		if (requestedKey) {
			runtime.error(`Session not found: ${requestedKey}. Run ${formatCliCommand("openclaw sessions list --all-agents --json")} to choose a valid key.`);
			runtime.exit(1);
		} else runtime.log("No sessions found.");
		return;
	}
	const followStates = [];
	for (const selection of selected) {
		const rows = loadSqliteTrajectoryRuntimeEventRowsSync({
			agentId: selection.agentId,
			sessionId: selection.sessionId,
			storePath: selection.storePath,
			tailEvents: Math.max(tailCount, opts.follow ? 1 : 0)
		});
		followStates.push({
			selection,
			lastStorageSeq: rows.at(-1)?.seq ?? -1
		});
		renderEvents(tailCount > 0 ? rows.slice(-tailCount).map((row) => row.event) : [], runtime);
	}
	if (opts.follow) {
		const outcome = await followSelections(followStates, runtime);
		runtime.exit(outcome === "ERROR" ? 1 : outcome === "SIGINT" ? 130 : 143);
	}
}
//#endregion
export { sessionsTailCommand };
