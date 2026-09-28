import { E as resolveStateDir } from "./paths-DehQwyE0.mjs";
import { p as captureStateDatabaseCoordinatorRuntime } from "./sqlite-source-handle-C0wvRR5v.mjs";
import { i as getOpenClawDatabaseMaintenanceScope } from "./openclaw-state-db-async-lifecycle-C6femVez.mjs";
import { r as captureOpenClawStateDatabaseReadAdmission } from "./openclaw-state-db-cache-Ci98mtX8.mjs";
import { s as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-DYMh54HD.mjs";
import { i as isExistingOpenClawStateSchema, r as getExistingOpenClawStateSchemaPath } from "./openclaw-state-db-schema-policy-BpQ7rCsk.mjs";
import { o as isGatewayExternallySupervised } from "./gateway-supervision-dG8swyHC.mjs";
import path from "node:path";
import { AsyncLocalStorage } from "node:async_hooks";
//#region src/state/openclaw-state-worker-context.ts
/** Capture host facts before asynchronous work, without opening SQLite. */
function captureOpenClawStateWorkerContext(options = {}) {
	const env = options.env ?? process.env;
	const environment = {
		OPENCLAW_STATE_DIR: resolveStateDir(env),
		...isGatewayExternallySupervised(env) ? { OPENCLAW_SUPERVISOR_MODE: "external" } : {}
	};
	const databasePath = path.resolve(options.path ?? resolveOpenClawStateSqlitePath(environment));
	isExistingOpenClawStateSchema(databasePath);
	const existingSchemaPath = getExistingOpenClawStateSchemaPath();
	const admission = captureOpenClawStateDatabaseReadAdmission(databasePath);
	let runInCapturedSchemaScope;
	if (existingSchemaPath !== void 0) {
		const inCapturedScope = AsyncLocalStorage.snapshot();
		const assertCurrent = admission.assertCurrent;
		admission.assertCurrent = () => {
			assertCurrent();
			inCapturedScope(getExistingOpenClawStateSchemaPath);
		};
		runInCapturedSchemaScope = (operation) => inCapturedScope(() => {
			admission.assertCurrent();
			return operation();
		});
	}
	return {
		maintenanceScope: getOpenClawDatabaseMaintenanceScope(),
		admission,
		environment,
		coordinatorRuntime: captureStateDatabaseCoordinatorRuntime(),
		existingSchemaPath,
		runInCapturedSchemaScope
	};
}
//#endregion
export { captureOpenClawStateWorkerContext as t };
