import "./registry-B91r5qN6.mjs";
//#region src/channels/plugins/approvals.ts
function resolveChannelApprovalCapability(plugin) {
	return plugin?.approvalCapability;
}
function resolveChannelApprovalAdapter(plugin) {
	const capability = resolveChannelApprovalCapability(plugin);
	if (!capability) return;
	if (!capability.delivery && !capability.nativeRuntime && !capability.nativeRuntimeAsync && !capability.render && !capability.native && !capability.nativeAsync) return;
	return {
		describeExecApprovalSetup: capability.describeExecApprovalSetup,
		describePluginApprovalSetup: capability.describePluginApprovalSetup,
		delivery: capability.delivery,
		nativeRuntime: capability.nativeRuntime,
		nativeRuntimeAsync: capability.nativeRuntimeAsync,
		render: capability.render,
		native: capability.native,
		nativeAsync: capability.nativeAsync
	};
}
//#endregion
export { resolveChannelApprovalCapability as n, resolveChannelApprovalAdapter as t };
