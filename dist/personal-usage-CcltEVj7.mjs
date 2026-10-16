import { a as isSqliteLockError } from "./sqlite-error-diagnostics-DCvjvszg.mjs";
import { r as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-DRG_I6tz.mjs";
import { n as createSqliteWorkerWriteAdmission } from "./sqlite-worker-store-CsIRv3py.mjs";
import { a as runOpenClawStateWorkerOperation } from "./openclaw-state-worker-store-DCVYVtaO.mjs";
import { _ as assertPersonalAuthProfileRuntime } from "./store-SwwRUDrm.mjs";
import { i as readUserModelAuthProfileAsync } from "./sqlite-read-Ct0XVCT8.mjs";
import { isDeepStrictEqual } from "node:util";
//#region src/agents/auth-profiles/personal-usage.ts
/** Bind the physical owner before probing or yielding to its writer queue. */
function preparePersonalAuthProfileUsage(store, profileId) {
	assertPersonalAuthProfileRuntime();
	const context = captureOpenClawStateWorkerContext();
	const assertCurrent = () => {
		context.admission.assertCurrent();
		context.maintenanceScope?.assertAdmission();
		assertPersonalAuthProfileRuntime();
	};
	return {
		read: () => readUserModelAuthProfileAsync(profileId, context),
		record(reduction) {
			const captured = structuredClone(reduction);
			return runOpenClawStateWorkerOperation(context, async (scope) => {
				const result = await scope.execute({
					type: "authProfiles.personalUsage",
					input: {
						profileId,
						reduction: captured
					}
				});
				if (result && isDeepStrictEqual(store.profiles[profileId], captured.expectedProfile)) store.usageStats = {
					...store.usageStats,
					[profileId]: result.next
				};
				return result;
			}, {
				assertCurrent,
				createAdmission: createSqliteWorkerWriteAdmission(assertCurrent, [context.admission.databasePath])
			}).catch((error) => {
				if (isSqliteLockError(error)) return null;
				throw error;
			});
		}
	};
}
//#endregion
export { preparePersonalAuthProfileUsage as t };
