//#region src/config/sessions/session-reaction-errors.ts
var SessionReactionLimitError = class extends Error {
	constructor() {
		super("reaction limit reached");
		this.name = "SessionReactionLimitError";
	}
};
/** The message was deleted between the caller's asynchronous read and this transaction. */
var SessionReactionMessageMissingError = class extends Error {
	constructor() {
		super("unknown message");
		this.name = "SessionReactionMessageMissingError";
	}
};
//#endregion
export { SessionReactionMessageMissingError as n, SessionReactionLimitError as t };
