import { a as throwSqliteLifecycleErrors } from "./sqlite-coordinator-z2lO0ops.mjs";
import { r as readDatabasePathIdentity } from "./sqlite-worker-identity-CR_ZuhW6.mjs";
import { d as runSqliteWorkerStoreOperation } from "./sqlite-worker-store-H5HXDD9v.mjs";
import { r as openOpenClawStateWorkerCleanupStore } from "./openclaw-state-worker-store-YAl4mP45.mjs";
//#region src/state/openclaw-agent-execution-cleanup.ts
/** Release only this owner's prepared lease after the broker certifies native retirement. */
async function cleanupRetiredAgentDatabaseLease(params) {
	params.assertOwned();
	await params.stopped;
	params.assertOwned();
	if ((await readDatabasePathIdentity(params.lease.sharedStatePath)).key !== params.lease.sharedStateIdentity) throw new Error("Retired agent cleanup cannot adopt a replacement shared database");
	const context = {
		environment: params.context.environment,
		coordinatorRuntime: {
			...params.context.coordinatorRuntime,
			keepAlive: false
		},
		existingSchemaPath: params.context.existingSchemaPath
	};
	const store = await openOpenClawStateWorkerCleanupStore(params.lease.sharedStatePath, context, () => params.assertOwned()).catch((error) => {
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
		}), context, () => params.assertOwned());
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
