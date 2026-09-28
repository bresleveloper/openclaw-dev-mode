import { n as resolveEffectiveBlockStreamingConfig } from "./block-streaming-DHMLmDDb.mjs";
//#region src/auto-reply/reply/acp-stream-settings.ts
const DEFAULT_ACP_STREAM_COALESCE_IDLE_MS = 350;
const DEFAULT_ACP_STREAM_MAX_CHUNK_CHARS = 1800;
const DEFAULT_ACP_REPEAT_SUPPRESSION = true;
const DEFAULT_ACP_DELIVERY_MODE = "final_only";
const DEFAULT_ACP_HIDDEN_BOUNDARY_SEPARATOR = "paragraph";
const DEFAULT_ACP_HIDDEN_BOUNDARY_SEPARATOR_LIVE = "space";
const DEFAULT_ACP_MAX_OUTPUT_CHARS = 24e3;
const DEFAULT_ACP_MAX_SESSION_UPDATE_CHARS = 320;
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
function clampBoolean(value, fallback) {
	return typeof value === "boolean" ? value : fallback;
}
function resolveAcpDeliveryMode(value) {
	if (value === "live" || value === "final_only") return value;
	return DEFAULT_ACP_DELIVERY_MODE;
}
function resolveAcpStreamCoalesceIdleMs() {
	return DEFAULT_ACP_STREAM_COALESCE_IDLE_MS;
}
function resolveAcpStreamMaxChunkChars() {
	return DEFAULT_ACP_STREAM_MAX_CHUNK_CHARS;
}
/** Resolves ACP projection settings with bounded defaults. */
function resolveAcpProjectionSettings(cfg) {
	const stream = cfg.acp?.stream;
	const deliveryMode = resolveAcpDeliveryMode(stream?.deliveryMode);
	return {
		deliveryMode,
		hiddenBoundarySeparator: deliveryMode === "live" ? DEFAULT_ACP_HIDDEN_BOUNDARY_SEPARATOR_LIVE : DEFAULT_ACP_HIDDEN_BOUNDARY_SEPARATOR,
		repeatSuppression: clampBoolean(stream?.repeatSuppression, DEFAULT_ACP_REPEAT_SUPPRESSION),
		maxOutputChars: DEFAULT_ACP_MAX_OUTPUT_CHARS,
		maxSessionUpdateChars: DEFAULT_ACP_MAX_SESSION_UPDATE_CHARS,
		tagVisibility: stream?.tagVisibility ?? {}
	};
}
/** Resolves ACP streaming chunk/coalescing settings. */
function resolveAcpStreamingConfig(params) {
	const resolved = resolveEffectiveBlockStreamingConfig({
		cfg: params.cfg,
		provider: params.provider,
		accountId: params.accountId,
		maxChunkChars: resolveAcpStreamMaxChunkChars(),
		coalesceIdleMs: resolveAcpStreamCoalesceIdleMs()
	});
	if (params.deliveryMode === "live") return {
		chunking: {
			...resolved.chunking,
			minChars: 1
		},
		coalescing: {
			...resolved.coalescing,
			minChars: 1,
			joiner: ""
		}
	};
	return resolved;
}
function isAcpTagVisible(settings, tag) {
	if (!tag) return true;
	if (!isAcpSessionUpdateTag(tag)) return true;
	const override = settings.tagVisibility[tag];
	if (typeof override === "boolean") return override;
	const defaultVisibility = ACP_TAG_VISIBILITY_DEFAULTS[tag];
	if (defaultVisibility === void 0) throw new Error(`Missing ACP visibility default for ${tag}`);
	return defaultVisibility;
}
//#endregion
export { resolveAcpProjectionSettings as n, resolveAcpStreamingConfig as r, isAcpTagVisible as t };
