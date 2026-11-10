//#region src/config/sessions/session-transcript-read-fence-error.ts
var SessionTranscriptReadFenceError = class extends Error {
	constructor(message) {
		super(message);
		this.name = "SessionTranscriptReadFenceError";
	}
};
//#endregion
export { SessionTranscriptReadFenceError as t };
