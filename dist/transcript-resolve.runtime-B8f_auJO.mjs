//#region src/config/sessions/transcript-file-resolve.ts
/**
* Legacy command shim: runtime storage uses the returned session key only as a
* process-local routing token; SQLite identity travels separately.
*/
async function resolveSessionTranscriptFile(params) {
	return {
		sessionFile: params.sessionKey,
		sessionEntry: params.sessionEntry ?? params.sessionStore?.[params.sessionKey]
	};
}
//#endregion
export { resolveSessionTranscriptFile };
