import { r as resolveStateDir } from "./state-dir-BHJORNly.mjs";
import { n as assertExistingDatabaseIdentity } from "./sqlite-worker-identity-KSR14F6C.mjs";
import { i as isStateDatabaseReadAdmissionInvalidatedError } from "./openclaw-state-db-async-lifecycle-DLKxSPCk.mjs";
import { c as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-DfifnSGp.mjs";
import { D as captureOpenClawStateReadWorkerContextWithAdmission, E as captureOpenClawStateReadContextWithAdmission, O as captureOpenClawStateWorkerContextWithAdmission, n as captureOpenClawStateDatabaseReadAdmission } from "./openclaw-state-db-cache-BKCnj4of.mjs";
import { r as cloneEnvWithPlatformSemantics } from "./config-env-vars-DjPHKieF.mjs";
import path from "node:path";
import { AsyncLocalStorage } from "node:async_hooks";
//#region src/state/openclaw-state-worker-context.ts
/** Capture read authority without constructing a worker environment. */
function captureOpenClawStateReadContext(pathname = resolveOpenClawStateSqlitePath()) {
	return captureOpenClawStateReadContextWithAdmission(pathname, captureOpenClawStateDatabaseReadAdmission);
}
/** Read-only workers need resolved runtime facts, not the initialization environment. */
function captureOpenClawStateReadWorkerContext(options = {}) {
	return captureOpenClawStateReadWorkerContextWithAdmission(options, captureOpenClawStateDatabaseReadAdmission);
}
/** Resident readers retain their source and schema policy without re-admitting each publication. */
function prepareOpenClawStateReadSource(input) {
	const env = cloneEnvWithPlatformSemantics(input.env ?? process.env);
	env.OPENCLAW_STATE_DIR = resolveStateDir(env);
	const options = {
		path: path.resolve(input.path),
		env
	};
	const inSourceContext = AsyncLocalStorage.snapshot();
	const original = captureOpenClawStateReadContext(options.path);
	let context = original;
	let worker;
	const refresh = () => {
		original.maintenanceScope?.assertAdmission();
		const identity = original.admission.identity;
		if (identity.key.startsWith("file:")) assertExistingDatabaseIdentity(options.path, identity.key, identity.birthtime);
		else original.admission.assertCurrent();
		const next = captureOpenClawStateReadContext(options.path);
		const source = original.admission.identity;
		if (next.admission.identity.key !== source.key || next.admission.identity.birthtime !== source.birthtime || next.maintenanceScope !== original.maintenanceScope || next.existingSchemaPath !== original.existingSchemaPath) throw new Error("Prepared state read source changed before read admission");
		return context = next;
	};
	const current = () => {
		context.maintenanceScope?.assertAdmission();
		try {
			context.admission.assertCurrent();
			if (context.admission.identity.key.startsWith("file:")) return context;
		} catch (error) {
			if (!isStateDatabaseReadAdmissionInvalidatedError(error)) throw error;
		}
		return inSourceContext(refresh);
	};
	const prepareWorker = () => {
		const next = refresh();
		worker ??= captureOpenClawStateWorkerContext(options);
		if (worker.admission !== next.admission) worker = {
			...worker,
			...next
		};
		return worker;
	};
	return {
		current,
		workerContext: () => inSourceContext(prepareWorker),
		withCurrent(consume) {
			return inSourceContext(() => consume(prepareWorker()));
		}
	};
}
function captureOpenClawStateWorkerContext(options = {}) {
	return captureOpenClawStateWorkerContextWithAdmission(options, captureOpenClawStateDatabaseReadAdmission);
}
//#endregion
export { prepareOpenClawStateReadSource as i, captureOpenClawStateReadWorkerContext as n, captureOpenClawStateWorkerContext as r, captureOpenClawStateReadContext as t };
