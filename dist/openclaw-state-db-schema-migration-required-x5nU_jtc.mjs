import { n as StartupMaintenanceRequiredError } from "./startup-maintenance-required-OfhrhQoQ.mjs";
//#region src/state/openclaw-state-db-schema-migration-required.ts
const LEGACY_SKILL_WORKSHOP_COLLECTION_REVIEWS_INDEX = "idx_skill_workshop_collection_reviews_workspace_time";
var OpenClawStateDatabaseSchemaMigrationRequiredError = class extends StartupMaintenanceRequiredError {
	constructor(kind, pathname) {
		super(kind, `OpenClaw state database schema migration required (${kind}) at ${pathname}; run openclaw doctor --fix to migrate it.`);
		this.kind = kind;
		this.pathname = pathname;
		this.name = "OpenClawStateDatabaseSchemaMigrationRequiredError";
	}
};
/** Runtime readers report malformed legacy state without entering repair mode. */
function normalizeOpenClawStateSchemaReadError(error, pathname) {
	if (error instanceof Error && error.message.startsWith(`malformed database schema (idx_skill_workshop_collection_reviews_workspace_time)`)) {
		const required = new OpenClawStateDatabaseSchemaMigrationRequiredError("legacy-workshop-review-index", pathname);
		required.cause = error;
		return required;
	}
	return error;
}
//#endregion
export { OpenClawStateDatabaseSchemaMigrationRequiredError as n, normalizeOpenClawStateSchemaReadError as r, LEGACY_SKILL_WORKSHOP_COLLECTION_REVIEWS_INDEX as t };
