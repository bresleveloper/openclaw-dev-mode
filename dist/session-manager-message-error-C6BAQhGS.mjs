import { n as recordModelFallbackStop } from "./model-fallback-stop-BXDxJQSp.mjs";
//#region src/agents/sessions/session-manager-message-error.ts
/** Retain the durable outcome when its caller can no longer publish it. */
var SessionTranscriptMessageCommittedError = class extends Error {
	constructor(committedMessageId, cause, target, committedVersion, committedLifecycleRevision) {
		super("Session transcript message committed, but publication did not complete; do not replay the append", { cause });
		this.committedMessageId = committedMessageId;
		this.committedVersion = committedVersion;
		this.committedLifecycleRevision = committedLifecycleRevision;
		this.name = "SessionTranscriptMessageCommittedError";
		this.committedTarget = {
			...target,
			...target.env ? { env: { ...target.env } } : {}
		};
		recordModelFallbackStop(this);
	}
};
//#endregion
export { SessionTranscriptMessageCommittedError as t };
