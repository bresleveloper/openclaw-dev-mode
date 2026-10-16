import { l as readDatabasePathIdentity } from "./sqlite-worker-identity-KSR14F6C.mjs";
import { s as throwSqliteLifecycleErrors } from "./sqlite-lifecycle-errors-DuOygjcn.mjs";
import { c as invalidateOpenClawAgentDatabaseValidation } from "./openclaw-agent-db-validation-cache-_HDeZNQr.mjs";
import { n as createSqliteWorkerOperationAdmission } from "./sqlite-worker-operation-admission-cNGSH5v0.mjs";
import { f as runSqliteWorkerStoreOperation } from "./sqlite-worker-store-CsIRv3py.mjs";
import { i as openOpenClawStateWorkerCleanupStore } from "./openclaw-state-worker-store-DCVYVtaO.mjs";
//#region src/state/openclaw-agent-execution-cleanup.ts
/** Release only this owner's prepared lease after the broker certifies native retirement. */
async function cleanupRetiredAgentDatabaseLease(params) {
	params.assertOwned();
	await params.stopped;
	params.assertOwned();
	const observed = await readDatabasePathIdentity(params.lease.sharedStatePath);
	if (observed.key !== params.lease.sharedStateIdentity) throw new Error("Retired agent cleanup cannot adopt a replacement shared database");
	const context = {
		environment: params.context.environment,
		existingSchemaPath: params.context.existingSchemaPath
	};
	const store = await openOpenClawStateWorkerCleanupStore(params.lease.sharedStatePath, context, () => params.assertOwned(), observed).catch((error) => {
		if (error instanceof Error) {
			error.message += ` (leaseId=${params.lease.leaseId}, path=${params.lease.path})`;
			error.stack = `${error.name}: ${error.message}\n${error.stack ?? ""}`;
		}
		throw error;
	});
	if (!store) throw new Error("Retired agent cleanup lost its original shared database");
	const errors = [];
	try {
		await runSqliteWorkerStoreOperation(store, (scope) => scope.execute({
			type: "agentDatabases.releaseExitedLease",
			input: params.lease
		}), context, () => params.assertOwned(), () => ({
			nativeLocations: [params.lease.sharedStatePath],
			admission: createSqliteWorkerOperationAdmission((request, grant) => {
				params.assertOwned();
				if (request.stage === "prepare" && request.facts === "agent-integrity-invalidated") invalidateOpenClawAgentDatabaseValidation(params.lease.path);
				grant();
			})
		}));
	} catch (error) {
		errors.push(error);
	}
	try {
		await store.close();
	} catch (error) {
		errors.push(error);
	}
	throwSqliteLifecycleErrors(errors, "Retired agent lease cleanup and Worker close failed");
}
//#endregion
export { cleanupRetiredAgentDatabaseLease as t };
