import { d as resolveStateDir } from "./redact-V5IywZh1.js";
import { L as getOpenClawDatabaseMaintenanceScope, P as resolveOpenClawStateSqlitePath, dt as captureStateDatabaseCoordinatorRuntime, l as getExistingOpenClawStateSchemaPath, st as isGatewayExternallySupervised, t as captureOpenClawStateDatabaseReadAdmission, u as isExistingOpenClawStateSchema } from "./openclaw-state-db-cache-DbUvW0cs.js";
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
