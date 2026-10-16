import { i as requestSqliteWorkerOperationAdmission, r as deferSqliteWorkerCommitReceipt } from "./sqlite-worker-operation-admission-cNGSH5v0.mjs";
import { l as runOpenClawStateWriteTransaction } from "./openclaw-state-db-D1jWDzK3.mjs";
import { r as createPlacementSessionToolOperationKernel } from "./placement-session-tool-operations.kernel-DIiqMMa9.mjs";
//#region src/gateway/worker-environments/placement-session-tool-operations.worker.ts
function operation(type, execute) {
	return (input, { open }) => runOpenClawStateWriteTransaction(({ db }) => {
		requestSqliteWorkerOperationAdmission({
			stage: "transaction",
			facts: void 0
		});
		const receipt = execute(createPlacementSessionToolOperationKernel({
			db,
			instanceId: input.instanceId,
			now: () => input.nowMs ?? Date.now()
		}), input.args);
		requestSqliteWorkerOperationAdmission({
			stage: "commit",
			facts: receipt
		});
		deferSqliteWorkerCommitReceipt(db, receipt);
		return receipt;
	}, { database: open() }, { operationLabel: type });
}
const placementSessionToolOperations = {
	"placementTools.authorize": operation("placementTools.authorize", (tools, args) => ({ toolNames: tools.authorize(...args) })),
	"placementTools.seal": operation("placementTools.seal", (tools, args) => {
		tools.seal(...args);
		return { toolNames: null };
	}),
	"placementTools.clear": operation("placementTools.clear", (tools, args) => ({
		changed: tools.clear(...args),
		toolNames: null
	})),
	"placementTools.begin": operation("placementTools.begin", (tools, args) => ({ result: tools.begin(...args) })),
	"placementTools.bindChild": operation("placementTools.bindChild", (tools, args) => ({ changed: tools.bindChild(...args) })),
	"placementTools.complete": operation("placementTools.complete", (tools, args) => ({ changed: tools.complete(...args) })),
	"placementTools.abandon": operation("placementTools.abandon", (tools, args) => ({ changed: tools.abandon(...args) })),
	"placementTools.recover": operation("placementTools.recover", (tools, _args) => ({ recovered: tools.recover() }))
};
//#endregion
export { placementSessionToolOperations };
