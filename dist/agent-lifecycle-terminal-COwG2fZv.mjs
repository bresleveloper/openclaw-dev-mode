import { g as readStringValue } from "./string-coerce-1VuiLaaR.mjs";
import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { i as emitAgentEvent } from "./agent-events-GvNTkbe3.mjs";
import { s as classifyOAuthRefreshFailureError } from "./oauth-refresh-failure-B2gKOXl5.mjs";
import { i as getFailoverErrorCode } from "./error-B1Zb0HrJ.mjs";
import { n as AGENT_RUN_RESTART_ABORT_STOP_REASON } from "./agent-run-terminal-outcome-Ccvy5spR.mjs";
import { t as renderAgentHarnessPreflightUserMessage, v as renderFailoverCodeUserCopy } from "./user-facing-text-DC1sCo4O.mjs";
import "./run-termination-DGv2EKii.mjs";
//#region src/auto-reply/reply/agent-lifecycle-terminal.ts
const DEFERRED_TERMINAL_METADATA_KEYS = [
	"stopReason",
	"yielded",
	"timeoutPhase",
	"providerStarted",
	"aborted",
	"livenessState",
	"replayInvalid",
	"errorObservation",
	"assistantTranscriptIdempotencyKey"
];
function resolveAgentLifecycleTerminalMetadata(meta) {
	const metadata = {};
	if (!meta || typeof meta !== "object") return metadata;
	const record = meta;
	for (const key of DEFERRED_TERMINAL_METADATA_KEYS) if (Object.hasOwn(record, key)) metadata[key] = record[key];
	return metadata;
}
function createAgentLifecycleTerminalBackstop(params) {
	let state = {
		kind: "pending",
		metadata: {}
	};
	let startedAt = params.startedAt ?? Date.now();
	const beginAttempt = () => {
		if (state.kind !== "emitted") state = {
			kind: "pending",
			metadata: {}
		};
	};
	const note = (evt) => {
		if (state.kind === "emitted" || evt.stream !== "lifecycle") return;
		const phase = readStringValue(evt.data.phase);
		if (phase === "start") {
			beginAttempt();
			if (typeof evt.data.startedAt === "number") startedAt = evt.data.startedAt;
		}
		if (phase === "finishing" && state.kind === "pending") {
			state.deferredError = readStringValue(evt.data.error) ?? state.deferredError;
			Object.assign(state.metadata, resolveAgentLifecycleTerminalMetadata(evt.data));
		}
		if (phase === "end" || phase === "error") state = { kind: "emitted" };
	};
	const prepareTerminal = (pending, phase, resultOrError, extraData) => {
		const terminationFields = params.resolveTerminationFields(phase === "error" ? resultOrError : void 0);
		const restartAbort = terminationFields.stopReason === AGENT_RUN_RESTART_ABORT_STOP_REASON;
		const data = {
			...pending.metadata,
			phase: restartAbort ? "end" : phase,
			endedAt: Date.now(),
			startedAt
		};
		if (restartAbort) {
			data.aborted = true;
			data.stopReason = AGENT_RUN_RESTART_ABORT_STOP_REASON;
		} else if (phase === "error") {
			const oauthFailure = classifyOAuthRefreshFailureError(resultOrError);
			data.error = renderAgentHarnessPreflightUserMessage(resultOrError) ?? renderFailoverCodeUserCopy(getFailoverErrorCode(resultOrError)) ?? (oauthFailure?.summary ? `⚠️ ${oauthFailure.summary}` : void 0) ?? formatErrorMessage(resultOrError);
			if (oauthFailure?.summary) data.errorObservation = {
				...oauthFailure.provider ? { provider: oauthFailure.provider } : {},
				...oauthFailure.reason ? { failoverReason: oauthFailure.reason } : {},
				providerRuntimeFailureKind: "auth_refresh",
				...oauthFailure.errorType ? { providerErrorType: oauthFailure.errorType } : {},
				...oauthFailure.status ? { httpStatus: oauthFailure.status } : {}
			};
			Object.assign(data, terminationFields);
		} else {
			const meta = resultOrError && typeof resultOrError === "object" && "meta" in resultOrError ? resultOrError.meta : void 0;
			Object.assign(data, resolveAgentLifecycleTerminalMetadata(meta));
			if (terminationFields.aborted === true) data.aborted = true;
			if (terminationFields.stopReason && !readStringValue(data.stopReason)) data.stopReason = terminationFields.stopReason;
		}
		if (extraData) Object.assign(data, extraData);
		return {
			runId: params.runId,
			lifecycleGeneration: params.getLifecycleGeneration(),
			...params.sessionKey ? { sessionKey: params.sessionKey } : {},
			stream: "lifecycle",
			data
		};
	};
	const capture = (phase, resultOrError, extraData) => {
		if (state.kind === "pending") state = {
			kind: "captured",
			event: prepareTerminal(state, phase, resultOrError, extraData)
		};
	};
	const emit = (phase, resultOrError, extraData) => {
		const current = state;
		if (current.kind === "emitted") return;
		state = { kind: "emitted" };
		const event = current.kind === "captured" ? current.event : prepareTerminal(current, phase, resultOrError, extraData);
		const settled = {
			...event,
			data: {
				...event.data,
				executionSettled: true
			}
		};
		emitAgentEvent(settled);
		params.onTerminalEvent?.(settled);
	};
	return {
		beginAttempt,
		capture,
		emit,
		getDeferredError: () => state.kind === "pending" ? state.deferredError : void 0,
		note
	};
}
//#endregion
export { resolveAgentLifecycleTerminalMetadata as n, createAgentLifecycleTerminalBackstop as t };
