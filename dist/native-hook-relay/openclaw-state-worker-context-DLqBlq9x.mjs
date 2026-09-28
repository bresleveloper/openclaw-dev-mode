import { o as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-D1f0LUdT.mjs";
import { y as resolveStateDir } from "./redact-0yyk4gHy.mjs";
import { Xt as isGatewayExternallySupervised, g as isExistingOpenClawStateSchema, h as getExistingOpenClawStateSchemaPath, mt as captureStateDatabaseCoordinatorRuntime, st as getOpenClawDatabaseMaintenanceScope, t as captureOpenClawStateDatabaseReadAdmission } from "./openclaw-state-db-cache-BGWj8evC.mjs";
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
