import { Et as _enum, Jn as string, Lt as boolean, Nt as array, Pn as number, Un as record, or as union, qn as strictObject, xn as literal } from "./schemas-BOYIvvln.mjs";
import { M as DmConfigSchema, P as MentionPatternsPolicySchema, a as ContextVisibilityModeSchema, b as TextChunkModeSchema, c as GroupPolicySchema, g as ReplyToModeSchema, i as ChannelStreamingBlockSchema, o as DmPolicySchema, p as MarkdownConfigSchema, r as ChannelDeliveryStreamingConfigSchema, t as BlockStreamingChunkSchema } from "./zod-schema.core-MaNAY9dn.mjs";
//#region src/config/zod-schema.approvals.ts
/** Native exec approval mode accepted by config. */
const NativeExecApprovalEnableModeSchema = union([boolean(), literal("auto")]);
const ExecApprovalForwardTargetSchema = strictObject({
	channel: string().min(1),
	to: string().min(1),
	accountId: string().optional(),
	threadId: union([string(), number()]).optional()
});
const ExecApprovalForwardingSchema = strictObject({
	enabled: boolean().optional(),
	mode: union([
		literal("session"),
		literal("targets"),
		literal("both")
	]).optional(),
	agentFilter: array(string()).optional(),
	sessionFilter: array(string()).optional(),
	targets: array(ExecApprovalForwardTargetSchema).optional()
}).optional();
const SlackPluginApproverSchema = string().regex(/^(?:team:T[A-Z0-9]+:user:)?[UW][A-Z0-9]+$/i);
const PluginSlackApproversSchema = strictObject({
	approvers: array(SlackPluginApproverSchema).optional(),
	plugins: record(string(), strictObject({
		approvers: array(SlackPluginApproverSchema).optional(),
		tools: record(string(), strictObject({ approvers: array(SlackPluginApproverSchema) })).optional()
	})).optional()
});
const PluginApprovalConfigSchema = ExecApprovalForwardingSchema.unwrap().extend({ slack: PluginSlackApproversSchema.optional() }).optional();
const ApprovalsSchema = strictObject({
	exec: ExecApprovalForwardingSchema,
	plugin: PluginApprovalConfigSchema
}).optional();
//#endregion
//#region src/config/zod-schema.channel-bot-loop.ts
const ChannelBotLoopProtectionSchema = strictObject({
	enabled: boolean().optional(),
	maxEventsPerWindow: number().int().positive().optional(),
	windowSeconds: number().int().positive().optional(),
	cooldownSeconds: number().int().positive().optional()
});
//#endregion
//#region src/config/zod-schema.channels.ts
/** Optional heartbeat visibility controls shared by channel schemas. */
const ChannelHeartbeatVisibilitySchema = strictObject({
	showOk: boolean().optional(),
	showAlerts: boolean().optional(),
	useIndicator: boolean().optional()
}).optional();
const ChannelHealthMonitorSchema = strictObject({ enabled: boolean().optional() }).optional();
//#endregion
//#region src/config/zod-schema.implicit-mentions.ts
const ChannelImplicitMentionsSchema = strictObject({
	replyToBot: boolean().optional(),
	quotedBot: boolean().optional(),
	threadParticipation: boolean().optional()
});
//#endregion
//#region src/config/zod-schema.channel-messaging-common.ts
const UnifiedStreamingModeSchema = _enum([
	"off",
	"partial",
	"block",
	"progress"
]);
const ChannelThreadBindingsSchema = strictObject({
	enabled: boolean().optional(),
	idleHours: number().nonnegative().optional(),
	maxAgeHours: number().nonnegative().optional(),
	spawnSessions: boolean().optional(),
	defaultSpawnContext: _enum(["isolated", "fork"]).optional()
});
const ChannelStreamingPreviewSchema = strictObject({
	chunk: BlockStreamingChunkSchema.optional(),
	toolProgress: boolean().optional(),
	commandText: _enum(["raw", "status"]).optional()
});
const ChannelStreamingProgressSchema = strictObject({
	label: union([string(), literal(false)]).optional(),
	labels: array(string()).optional(),
	maxLines: number().int().positive().optional(),
	maxLineChars: number().int().positive().optional(),
	toolProgress: boolean().optional(),
	commandText: _enum(["raw", "status"]).optional(),
	commentary: boolean().optional(),
	narration: boolean().optional()
});
const ChannelPreviewStreamingConfigSchema = strictObject({
	mode: UnifiedStreamingModeSchema.optional(),
	chunkMode: TextChunkModeSchema.optional(),
	preview: ChannelStreamingPreviewSchema.optional(),
	progress: ChannelStreamingProgressSchema.optional(),
	block: ChannelStreamingBlockSchema.optional()
});
const CommonCapabilitiesSchema = array(string()).optional();
const CommonIdListSchema = array(union([string(), number()])).optional();
const CommonDefaultToSchema = string().optional();
const CommonMentionPatternsSchema = MentionPatternsPolicySchema.optional();
const CommonStreamingSchema = ChannelDeliveryStreamingConfigSchema.optional();
const CommonMediaMaxMbSchema = number().positive().optional();
const CommonReplyToModeSchema = ReplyToModeSchema.optional();
const ChannelAccountPolicyDefaults = {
	dmPolicy: DmPolicySchema.optional().default("pairing"),
	groupPolicy: GroupPolicySchema.optional().default("allowlist")
};
/** Canonical optional account contract shared by bundled messaging channels. */
const CommonChannelAccountSchema = strictObject({
	name: string().optional(),
	capabilities: CommonCapabilitiesSchema,
	markdown: MarkdownConfigSchema,
	configWrites: boolean().optional(),
	enabled: boolean().optional(),
	dmPolicy: DmPolicySchema.optional(),
	allowFrom: CommonIdListSchema,
	defaultTo: CommonDefaultToSchema,
	groupAllowFrom: CommonIdListSchema,
	groupPolicy: GroupPolicySchema.optional(),
	mentionPatterns: CommonMentionPatternsSchema,
	contextVisibility: ContextVisibilityModeSchema.optional(),
	historyLimit: number().int().min(0).optional(),
	dmHistoryLimit: number().int().min(0).optional(),
	dms: record(string(), DmConfigSchema.optional()).optional(),
	textChunkLimit: number().int().positive().optional(),
	streaming: CommonStreamingSchema,
	heartbeatVisibility: ChannelHeartbeatVisibilitySchema,
	healthMonitor: ChannelHealthMonitorSchema,
	responsePrefix: string().optional(),
	mediaMaxMb: CommonMediaMaxMbSchema,
	replyToMode: CommonReplyToModeSchema
});
/** Build optional account leaves and separate root-only policy defaults. */
function buildChannelAccountSchemaParts(options = {}) {
	const shape = {
		...CommonChannelAccountSchema.shape,
		capabilities: options.capabilities ?? CommonCapabilitiesSchema,
		allowFrom: options.allowFrom ?? CommonIdListSchema,
		defaultTo: options.defaultTo ?? CommonDefaultToSchema,
		groupAllowFrom: options.groupAllowFrom ?? CommonIdListSchema,
		mentionPatterns: options.mentionPatterns ?? CommonMentionPatternsSchema,
		streaming: options.streaming ?? CommonStreamingSchema,
		mediaMaxMb: options.mediaMaxMb ?? CommonMediaMaxMbSchema,
		replyToMode: options.replyToMode ?? CommonReplyToModeSchema
	};
	const omitted = new Set(options.omit ?? []);
	return {
		accountShape: Object.fromEntries(Object.entries(shape).filter(([key]) => !omitted.has(key))),
		rootPolicyShape: ChannelAccountPolicyDefaults
	};
}
const ChannelDangerouslyAllowNameMatchingSchema = boolean().optional();
const ChannelSendReadReceiptsSchema = boolean().optional();
function buildChannelAllowBotsSchema(options) {
	return options?.allowMentions ? union([boolean(), literal("mentions")]).optional() : boolean().optional();
}
/** Build native exec-approval routing with channel-specific approver ids and extras. */
function buildChannelExecApprovalsSchema(approverSchema, extraShape) {
	return strictObject({
		enabled: NativeExecApprovalEnableModeSchema.optional(),
		approvers: array(approverSchema).optional(),
		agentFilter: array(string()).optional(),
		sessionFilter: array(string()).optional(),
		target: _enum([
			"dm",
			"channel",
			"both"
		]).optional(),
		...extraShape ?? {}
	}).optional();
}
/** Build the repeated reaction leaves while retaining each channel's exact enum. */
function buildChannelReactionShape(options) {
	return {
		...options.notificationModes ? { reactionNotifications: _enum(options.notificationModes).optional() } : {},
		...options.reactionAllowlist ? { reactionAllowlist: array(union([string(), number()])).optional() } : {},
		...options.reactionLevels ? { reactionLevel: _enum(options.reactionLevels).optional() } : {},
		...options.ackReaction ? { ackReaction: options.ackReaction } : {}
	};
}
//#endregion
export { ChannelStreamingProgressSchema as a, buildChannelAccountSchemaParts as c, buildChannelReactionShape as d, ChannelImplicitMentionsSchema as f, ApprovalsSchema as h, ChannelStreamingPreviewSchema as i, buildChannelAllowBotsSchema as l, ChannelBotLoopProtectionSchema as m, ChannelPreviewStreamingConfigSchema as n, ChannelThreadBindingsSchema as o, ChannelHeartbeatVisibilitySchema as p, ChannelSendReadReceiptsSchema as r, UnifiedStreamingModeSchema as s, ChannelDangerouslyAllowNameMatchingSchema as t, buildChannelExecApprovalsSchema as u };
