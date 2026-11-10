//#region src/auto-reply/reply/acp-stream-settings.ts
const ACP_TAG_VISIBILITY_DEFAULTS = {
	agent_message_chunk: true,
	tool_call: false,
	tool_call_update: false,
	usage_update: false,
	available_commands_update: false,
	current_mode_update: false,
	config_option_update: false,
	session_info_update: false,
	plan: false,
	agent_thought_chunk: false
};
function isAcpSessionUpdateTag(tag) {
	return Object.hasOwn(ACP_TAG_VISIBILITY_DEFAULTS, tag);
}
function resolveAcpProjectionSettings(cfg) {
	const stream = cfg.acp?.stream;
	return {
		deliveryMode: stream?.deliveryMode === "live" ? "live" : "final_only",
		repeatSuppression: stream?.repeatSuppression !== false,
		tagVisibility: stream?.tagVisibility ?? {}
	};
}
function isAcpTagVisible(settings, tag) {
	if (!tag || !isAcpSessionUpdateTag(tag)) return true;
	const override = settings.tagVisibility[tag];
	if (typeof override === "boolean") return override;
	return ACP_TAG_VISIBILITY_DEFAULTS[tag];
}
//#endregion
export { resolveAcpProjectionSettings as n, isAcpTagVisible as t };
