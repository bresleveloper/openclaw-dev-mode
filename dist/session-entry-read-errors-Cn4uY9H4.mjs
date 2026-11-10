//#region src/config/sessions/session-entry-read-errors.ts
var SessionEntryChangedDuringReadError = class extends Error {
	constructor() {
		super("Session entry changed during read");
		this.name = "SessionEntryChangedDuringReadError";
	}
};
//#endregion
export { SessionEntryChangedDuringReadError as t };
