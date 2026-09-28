import { r as collectNestedErrorCandidates } from "./error-coercion-C787aVxk.mjs";
//#region src/infra/startup-maintenance-required.ts
const GATEWAY_STARTUP_MAINTENANCE_REQUIRED_REASON = "gateway.maintenance_required";
const maintenanceReasons = {
	"state-migrations": "state migration",
	"newer-schema": "a newer OpenClaw build",
	"agent-media": "offline media migration",
	"agent-databases-composite-primary-key": "state database schema migration",
	"audit-events-v2": "state database schema migration",
	"legacy-workshop-review-index": "state database schema migration",
	"legacy-cron-run-logs": "cron run history migration",
	"legacy-workspace": "workspace setup state migration",
	"legacy-session-store": "session store migration"
};
var StartupMaintenanceRequiredError = class extends Error {
	constructor(kind, message, options) {
		super(message, options);
		this.kind = kind;
		this.code = GATEWAY_STARTUP_MAINTENANCE_REQUIRED_REASON;
		this.name = "StartupMaintenanceRequiredError";
	}
	get reason() {
		return maintenanceReasons[this.kind];
	}
};
function findStartupMaintenanceRequiredError(error) {
	const failures = collectNestedErrorCandidates(error).filter((candidate) => candidate instanceof StartupMaintenanceRequiredError);
	return failures.find((failure) => failure.kind === "newer-schema") ?? failures[0];
}
//#endregion
export { StartupMaintenanceRequiredError as n, findStartupMaintenanceRequiredError as r, GATEWAY_STARTUP_MAINTENANCE_REQUIRED_REASON as t };
