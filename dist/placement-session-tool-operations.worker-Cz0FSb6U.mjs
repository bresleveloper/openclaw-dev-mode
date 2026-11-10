import { n as createPlacementSessionToolOperationKernel } from "./placement-session-tool-operations.kernel-DQfH5nhF.mjs";
//#region src/gateway/worker-environments/placement-session-tool-operations.worker.ts
function operation(type, execute) {
	return (input, { writeAdmitted }) => writeAdmitted(({ db }) => {
		return execute(createPlacementSessionToolOperationKernel({
			db,
			instanceId: input.instanceId,
			now: () => input.nowMs ?? Date.now()
		}), input.args);
	}, {
		operationLabel: type,
		receipt: "result",
		transactionEnvironment: "process"
	});
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
