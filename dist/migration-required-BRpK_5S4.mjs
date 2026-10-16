import { n as StartupMaintenanceRequiredError } from "./startup-maintenance-required-rkhEAmAi.mjs";
//#region src/config/sessions/migration-required.ts
/** Legacy history requires an explicit Doctor import, never automatic failure triage. */
var SessionStoreMigrationRequiredError = class extends StartupMaintenanceRequiredError {
	constructor(message) {
		super("legacy-session-store", message);
		this.name = "SessionStoreMigrationRequiredError";
	}
};
//#endregion
export { SessionStoreMigrationRequiredError as t };
