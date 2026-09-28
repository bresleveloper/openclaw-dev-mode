import { Fn as object, Jn as string, Lt as boolean, Nt as array, Pn as number, or as union, xn as literal } from "./schemas-BOYIvvln.mjs";
//#region src/config/zod-schema.approvals.ts
/** Native exec approval mode accepted by config. */
const NativeExecApprovalEnableModeSchema = union([boolean(), literal("auto")]);
const ExecApprovalForwardTargetSchema = object({
	channel: string().min(1),
	to: string().min(1),
	accountId: string().optional(),
	threadId: union([string(), number()]).optional()
}).strict();
const ExecApprovalForwardingSchema = object({
	enabled: boolean().optional(),
	mode: union([
		literal("session"),
		literal("targets"),
		literal("both")
	]).optional(),
	agentFilter: array(string()).optional(),
	sessionFilter: array(string()).optional(),
	targets: array(ExecApprovalForwardTargetSchema).optional()
}).strict().optional();
const ApprovalsSchema = object({
	exec: ExecApprovalForwardingSchema,
	plugin: ExecApprovalForwardingSchema
}).strict().optional();
//#endregion
//#region src/config/zod-schema.channel-bot-loop.ts
const ChannelBotLoopProtectionSchema = object({
	enabled: boolean().optional(),
	maxEventsPerWindow: number().int().positive().optional(),
	windowSeconds: number().int().positive().optional(),
	cooldownSeconds: number().int().positive().optional()
}).strict();
//#endregion
//#region src/config/zod-schema.channels.ts
/** Optional heartbeat visibility controls shared by channel schemas. */
const ChannelHeartbeatVisibilitySchema = object({
	showOk: boolean().optional(),
	showAlerts: boolean().optional(),
	useIndicator: boolean().optional()
}).strict().optional();
const ChannelHealthMonitorSchema = object({ enabled: boolean().optional() }).strict().optional();
//#endregion
//#region src/config/zod-schema.implicit-mentions.ts
const ChannelImplicitMentionsSchema = object({
	replyToBot: boolean().optional(),
	quotedBot: boolean().optional(),
	threadParticipation: boolean().optional()
}).strict();
//#endregion
export { ApprovalsSchema as a, ChannelBotLoopProtectionSchema as i, ChannelHealthMonitorSchema as n, NativeExecApprovalEnableModeSchema as o, ChannelHeartbeatVisibilitySchema as r, ChannelImplicitMentionsSchema as t };
