import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { n as createSqliteWorkerOperationAdmission } from "./sqlite-worker-operation-admission-CG5jL3tH.mjs";
import { i as runOpenClawStateWorkerOperation } from "./openclaw-state-worker-store-YAl4mP45.mjs";
//#region src/tasks/task-registry-worker-operation.ts
/** Keep the original mutation owner until every admitted native transaction settles. */
async function runTaskRegistryWorkerOperation(context, command, assertCurrent, onGranted) {
	let settlement;
	try {
		return await runOpenClawStateWorkerOperation(context, (scope) => scope.execute(command), {
			requireStateLifecycle: true,
			assertCurrent,
			createAdmission(retained) {
				settlement = retained.settled;
				assertCurrent();
				const admission = createSqliteWorkerOperationAdmission((request, grant) => {
					assertCurrent();
					const facts = request.facts;
					if (request.stage !== "transaction" || !isRecord(facts) || facts.kind !== "task-registry-mutation" || facts.operation !== command.type || facts.taskId !== command.input.taskId) throw new Error("Task mutation differs from its admitted owner");
					if (!grant()) throw new Error("Task mutation admission expired");
					onGranted?.(admission);
				});
				return {
					nativeLocations: [context.admission.databasePath],
					admission
				};
			}
		});
	} finally {
		await settlement;
	}
}
//#endregion
export { runTaskRegistryWorkerOperation };
