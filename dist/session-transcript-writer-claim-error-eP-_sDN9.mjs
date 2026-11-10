import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
//#region src/config/sessions/session-transcript-writer-claim-error.ts
function isRedactedIdentifier(value) {
	return typeof value === "string" && /^(?:-|sha256:[0-9a-f]{12})$/.test(value);
}
/** Transport only the refusal owner's redacted identifiers, never incidental cause fields. */
function parseTranscriptAppendRefusal(value) {
	if (!isRecord(value) || !isRedactedIdentifier(value.agentIdHash) || !isRedactedIdentifier(value.expectedSessionIdHash) || !isRedactedIdentifier(value.sessionKeyHash)) return;
	const identity = {
		agentIdHash: value.agentIdHash,
		expectedSessionIdHash: value.expectedSessionIdHash,
		sessionKeyHash: value.sessionKeyHash
	};
	if (value.code === "session-entry-missing") return {
		...identity,
		code: value.code
	};
	if (value.code === "session-rebound" && isRedactedIdentifier(value.actualSessionIdHash)) return {
		...identity,
		code: value.code,
		actualSessionIdHash: value.actualSessionIdHash
	};
}
var SessionTranscriptWriterClaimReboundError = class extends Error {
	constructor(cause) {
		super("session writer claim changed before transcript persistence", { cause });
		this.name = "SessionTranscriptWriterClaimReboundError";
	}
};
//#endregion
export { parseTranscriptAppendRefusal as n, SessionTranscriptWriterClaimReboundError as t };
