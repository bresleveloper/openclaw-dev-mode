import { g as readStringValue } from "./string-coerce-1VuiLaaR.mjs";
import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { n as AGENT_RUN_RESTART_ABORT_STOP_REASON } from "./agent-run-terminal-outcome-CrMEEYuY.mjs";
import { a as emitAgentEvent } from "./agent-events-Bf3Js0D3.mjs";
import { i as getFailoverErrorCode } from "./error-Bcp4ZyOv.mjs";
import "./run-termination-Dwf1ksjA.mjs";
import { t as renderAgentHarnessPreflightUserMessage } from "./user-facing-text-BNFEPbYx.mjs";
import { _ as renderFailoverCodeUserCopy } from "./user-copy-BAz4s3EV.mjs";
import { s as classifyOAuthRefreshFailureError } from "./oauth-refresh-failure-H1_-S915.mjs";
import { t as captureAgentWorkspaceReadiness } from "./workspace-readiness-B5JSqS7C.mjs";
//#region src/auto-reply/reply/agent-lifecycle-terminal.ts
const DEFERRED_TERMINAL_METADATA_KEYS = [
	"stopReason",
	"yielded",
	"timeoutPhase",
	"executionStarted",
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
	const workspaceReadiness = captureAgentWorkspaceReadiness(params.sessionKey);
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
		const workspaceFailure = workspaceReadiness?.getFailure?.();
		const terminalPhase = workspaceFailure ? "error" : phase;
		const terminalValue = workspaceFailure ?? resultOrError;
		const terminationFields = workspaceFailure ? {} : params.resolveTerminationFields(terminalPhase === "error" ? terminalValue : void 0);
		const restartAbort = terminationFields.stopReason === AGENT_RUN_RESTART_ABORT_STOP_REASON;
		const data = {
			...pending.metadata,
			phase: restartAbort ? "end" : terminalPhase,
			endedAt: Date.now(),
			startedAt
		};
		if (restartAbort) {
			data.aborted = true;
			data.stopReason = AGENT_RUN_RESTART_ABORT_STOP_REASON;
		} else if (terminalPhase === "error") {
			const oauthFailure = classifyOAuthRefreshFailureError(terminalValue);
			data.error = renderAgentHarnessPreflightUserMessage(terminalValue) ?? renderFailoverCodeUserCopy(getFailoverErrorCode(terminalValue)) ?? (oauthFailure?.summary ? `⚠️ ${oauthFailure.summary}` : void 0) ?? formatErrorMessage(terminalValue);
			if (oauthFailure?.summary) data.errorObservation = {
				...oauthFailure.provider ? { provider: oauthFailure.provider } : {},
				...oauthFailure.reason ? { failoverReason: oauthFailure.reason } : {},
				providerRuntimeFailureKind: "auth_refresh",
				...oauthFailure.errorType ? { providerErrorType: oauthFailure.errorType } : {},
				...oauthFailure.status ? { httpStatus: oauthFailure.status } : {}
			};
			Object.assign(data, terminationFields);
		} else {
			const meta = terminalValue && typeof terminalValue === "object" && "meta" in terminalValue ? terminalValue.meta : void 0;
			Object.assign(data, resolveAgentLifecycleTerminalMetadata(meta));
			if (terminationFields.aborted === true) data.aborted = true;
			if (terminationFields.stopReason && !readStringValue(data.stopReason)) data.stopReason = terminationFields.stopReason;
		}
		Object.assign(data, extraData);
		if (workspaceFailure) {
			data.phase = "error";
			data.error = workspaceFailure.message;
			delete data.aborted;
			delete data.stopReason;
			delete data.timeoutPhase;
			delete data.providerStarted;
			delete data.yielded;
		}
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
