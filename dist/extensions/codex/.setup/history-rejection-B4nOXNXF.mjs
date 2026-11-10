//#region extensions/codex/src/app-server/history-rejection.ts
/** Only an owning rejection site can supply a diagnostic; exception text is never evidence. */
var CodexHistoryRejection = class extends Error {
	constructor(reason) {
		super(`Codex history rejected: ${reason}`);
		this.reason = reason;
	}
};
function codexHistoryRejectionReason(error) {
	return error instanceof CodexHistoryRejection ? error.reason : "history_read_failed";
}
//#endregion
export { codexHistoryRejectionReason as n, CodexHistoryRejection as t };
