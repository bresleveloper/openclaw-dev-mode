import { createChannelConfigUiHints } from "openclaw/plugin-sdk/channel-core";
import { ChannelDeliveryStreamingConfigSchema, ChannelSendReadReceiptsSchema, ExecutableTokenSchema, buildChannelAccountSchemaParts, buildChannelConfigSchema, buildChannelReactionShape, buildGroupEntrySchema, isSafeScpRemoteHost, isValidInboundPathRootPattern, refineChannelDmPolicy } from "openclaw/plugin-sdk/channel-config-schema";
import { z } from "zod";
//#region extensions/imessage/src/config-ui-hints.ts
const iMessageChannelConfigUiHints = {
	"": {
		label: "iMessage",
		help: "iMessage channel provider configuration for CLI integration and DM access policy handling. Use explicit CLI paths when runtime environments have non-standard binary locations."
	},
	...createChannelConfigUiHints({
		channelLabel: "iMessage",
		dmPolicy: { channelKey: "imessage" },
		configWrites: true
	}),
	allowFrom: { presentation: "phone-number" },
	defaultTo: { presentation: "phone-number" },
	groupAllowFrom: { presentation: "phone-number" },
	"accounts.*.allowFrom.*": { presentation: "phone-number" },
	"accounts.*.defaultTo": { presentation: "phone-number" },
	"accounts.*.groupAllowFrom.*": { presentation: "phone-number" },
	cliPath: {
		label: "iMessage CLI Path",
		help: "Filesystem path to the iMessage bridge CLI binary used for send/receive operations. Set explicitly when the binary is not on PATH in service runtime environments."
	},
	sendTransport: {
		label: "iMessage Send Transport",
		help: "Preferred imsg RPC send transport for normal outbound replies. \"auto\" uses the IMCore bridge when available, \"bridge\" requires it, and \"applescript\" forces Messages automation."
	}
};
//#endregion
//#region extensions/imessage/src/config-schema.ts
const IMessageActionSchema = z.object({
	reactions: z.boolean().optional(),
	edit: z.boolean().optional(),
	unsend: z.boolean().optional(),
	reply: z.boolean().optional(),
	sendWithEffect: z.boolean().optional(),
	renameGroup: z.boolean().optional(),
	setGroupIcon: z.boolean().optional(),
	addParticipant: z.boolean().optional(),
	removeParticipant: z.boolean().optional(),
	leaveGroup: z.boolean().optional(),
	sendAttachment: z.boolean().optional(),
	polls: z.boolean().optional()
}).strict().optional();
const { accountShape, rootPolicyShape } = buildChannelAccountSchemaParts({
	omit: ["mentionPatterns", "replyToMode"],
	streaming: ChannelDeliveryStreamingConfigSchema.optional(),
	mediaMaxMb: z.number().int().positive().optional()
});
const IMessageAccountSchemaBase = z.object({
	...accountShape,
	cliPath: ExecutableTokenSchema.optional(),
	dbPath: z.string().optional(),
	remoteHost: z.string().refine(isSafeScpRemoteHost, "expected SSH host or user@host (no spaces/options)").optional(),
	actions: IMessageActionSchema,
	service: z.union([
		z.literal("imessage"),
		z.literal("sms"),
		z.literal("auto")
	]).optional(),
	sendTransport: z.enum([
		"auto",
		"bridge",
		"applescript"
	]).optional(),
	region: z.string().optional(),
	includeAttachments: z.boolean().optional(),
	attachmentRoots: z.array(z.string().refine(isValidInboundPathRootPattern, "expected absolute path root")).optional(),
	remoteAttachmentRoots: z.array(z.string().refine(isValidInboundPathRootPattern, "expected absolute path root")).optional(),
	probeTimeoutMs: z.number().int().positive().optional(),
	sendReadReceipts: ChannelSendReadReceiptsSchema,
	...buildChannelReactionShape({ notificationModes: [
		"off",
		"own",
		"all"
	] }),
	catchup: z.object({
		enabled: z.boolean().optional(),
		maxAgeMinutes: z.number().int().min(1).max(720).optional(),
		perRunLimit: z.number().int().min(1).max(500).optional(),
		firstRunLookbackMinutes: z.number().int().min(1).max(720).optional(),
		maxFailureRetries: z.number().int().min(1).max(1e3).optional()
	}).strict().optional(),
	groups: z.record(z.string(), buildGroupEntrySchema(void 0, { omit: [
		"skills",
		"enabled",
		"allowFrom"
	] }).optional()).optional()
}).strict();
const IMessageConfigSchema = IMessageAccountSchemaBase.extend({
	...rootPolicyShape,
	accounts: z.record(z.string(), IMessageAccountSchemaBase.optional()).optional(),
	defaultAccount: z.string().optional()
}).superRefine((value, ctx) => {
	refineChannelDmPolicy({
		channelId: "imessage",
		value,
		ctx
	});
	if (!value.accounts) return;
	for (const [accountId, account] of Object.entries(value.accounts)) {
		if (!account) continue;
		refineChannelDmPolicy({
			channelId: "imessage",
			value,
			accountId,
			ctx
		});
	}
});
const IMessageChannelConfigSchema = buildChannelConfigSchema(IMessageConfigSchema, { uiHints: iMessageChannelConfigUiHints });
//#endregion
export { IMessageConfigSchema as n, IMessageChannelConfigSchema as t };
