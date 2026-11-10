import { i as createSqliteWorkerOperationAdmission } from "./sqlite-worker-operation-admission-puNZKEvP.mjs";
//#region src/config/sessions/session-worker-execution-source.ts
function createSessionWorkerExecutionSource(assertCurrent, expiredMessage) {
	return {
		assertCurrent,
		createAdmission(binding) {
			return () => ({
				nativeLocations: binding.nativeLocations,
				admission: createSqliteWorkerOperationAdmission((request, grant) => {
					binding.authorize(request);
					assertCurrent();
					if (!grant()) throw new Error(expiredMessage);
				}, binding.attachment)
			});
		}
	};
}
//#endregion
export { createSessionWorkerExecutionSource as t };
