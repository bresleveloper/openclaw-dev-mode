import { a as runWithSqliteWorkerStateContext } from "./sqlite-worker-state-context-BeVaUlhr.mjs";
import { r as openOpenClawStateDatabase } from "./openclaw-state-db-D1jWDzK3.mjs";
import { t as operatorApprovalOperations } from "./operator-approval-store.operations-Dd3y3DNo.mjs";
//#region src/gateway/operator-approval-store.native.ts
const operations = operatorApprovalOperations;
function executeNativeOperatorApproval(type, input, context, assertCurrent, onCommitted) {
	context.admission.assertCurrent();
	return runWithSqliteWorkerStateContext(context, () => {
		const options = {
			env: context.environment,
			path: context.admission.databasePath
		};
		return operations[type](input, {
			open: () => openOpenClawStateDatabase(options),
			stateOptions: () => options,
			native: {
				assertCurrent,
				onCommitted
			}
		});
	});
}
//#endregion
export { executeNativeOperatorApproval };
