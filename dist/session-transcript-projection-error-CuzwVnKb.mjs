//#region src/config/sessions/session-transcript-projection-error.ts
var SessionTranscriptStorageUnavailableError = class extends Error {
	constructor(reason) {
		super("Session transcript storage is unavailable; open the source gateway and retry.");
		this.reason = reason;
		this.name = "SessionTranscriptStorageUnavailableError";
	}
};
var SessionTranscriptProjectionUnavailableError = class extends Error {
	constructor(sessionId) {
		super(`Session transcript projection is rebuilding: ${sessionId}`);
		this.sessionId = sessionId;
		this.name = "SessionTranscriptProjectionUnavailableError";
	}
};
function isSessionTranscriptProjectionUnavailableError(error) {
	return error instanceof SessionTranscriptProjectionUnavailableError;
}
//#endregion
export { SessionTranscriptStorageUnavailableError as n, isSessionTranscriptProjectionUnavailableError as r, SessionTranscriptProjectionUnavailableError as t };
