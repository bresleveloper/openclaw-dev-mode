//#region src/gateway/session-companion-errors.ts
var SessionCompanionAskError = class extends Error {
	constructor(reason, message, retryAfterMs) {
		super(message);
		this.reason = reason;
		this.retryAfterMs = retryAfterMs;
		this.name = "SessionCompanionAskError";
	}
};
//#endregion
export { SessionCompanionAskError as t };
