//#region src/infra/approval-channel-policy-support.ts
/** Older channel plugins cannot enforce reviewer policy added by a newer host. */
function canChannelEnforcePluginReviewerPolicy(cfg, channel, capability) {
	return !Object.hasOwn(cfg.approvals?.plugin ?? {}, channel) || capability?.supportsScopedPluginApprovalApprovers === true;
}
//#endregion
export { canChannelEnforcePluginReviewerPolicy as t };
