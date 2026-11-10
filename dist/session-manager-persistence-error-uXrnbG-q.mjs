import { n as hydrateOpenClawStateWorkerError, r as retainOpenClawStateWorkerErrorPayload } from "./openclaw-state-worker-error-B93Lf_P2.mjs";
import { n as recordModelFallbackStop } from "./model-fallback-stop-BtVvqU7l.mjs";
//#region src/agents/sessions/session-manager-persistence-error.ts
var SessionManagerActorCommittedError = class extends Error {
	#committedReply;
	constructor(committedCommand, committedReply, cause) {
		super("Acknowledged transcript operation could not finish; do not replay", { cause });
		this.committedCommand = committedCommand;
		this.#committedReply = committedReply;
		this.name = "SessionManagerActorCommittedError";
		recordModelFallbackStop(this);
	}
	get committedReply() {
		return this.#committedReply;
	}
};
/** Acknowledgment survives publication failure; callers must finish their existing receipt owner. */
async function receiveSessionManagerCommit(command, operation) {
	try {
		return { value: await operation() };
	} catch (error) {
		if (!(error instanceof SessionManagerActorCommittedError) || error.committedCommand !== command) throw error;
		return {
			value: error.committedReply.value,
			failure: error
		};
	}
}
function committedTranscriptViewError(payload) {
	const error = /* @__PURE__ */ new Error("Committed session transcript view could not be reconstructed");
	if (payload) retainOpenClawStateWorkerErrorPayload(error, payload);
	return hydrateOpenClawStateWorkerError(error, { includeOrdinary: true });
}
var SessionEntryCommittedError = class extends Error {
	constructor(committedEntryId, committedTarget, committedVersion, cause) {
		super("Session entry committed, but publication did not complete; do not replay the append", { cause });
		this.committedEntryId = committedEntryId;
		this.committedTarget = committedTarget;
		this.committedVersion = committedVersion;
		this.name = "SessionEntryCommittedError";
		recordModelFallbackStop(this);
	}
};
//#endregion
export { receiveSessionManagerCommit as i, SessionManagerActorCommittedError as n, committedTranscriptViewError as r, SessionEntryCommittedError as t };
