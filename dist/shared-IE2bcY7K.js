import { At as boolean, Rn as string, Tn as object, wn as number } from "./schemas-6cH6bZ7o.js";
import { h as MarkdownConfigSchema, l as GroupPolicySchema, o as DmPolicySchema } from "./zod-schema.core-DGUr-AGH.js";
import { n as buildCatchallMultiAccountChannelSchema, r as buildChannelConfigSchema, t as AllowFromListSchema } from "./config-schema-BlCHjLEp.js";
import { l as ToolPolicySchema } from "./zod-schema.agent-runtime-DrILvmxJ.js";
import { s as createScopedChannelConfigAdapter, t as adaptScopedAccountAccessor } from "./channel-config-helpers-CMg35hQR.js";
import "./text-chunking-nijjGL3g.js";
import { n as describeAccountSnapshot } from "./account-helpers-DihevCTm.js";
import "./core-DINDVkoE.js";
import { t as formatAllowFromLowercase } from "./allow-from-Do0efkdl.js";
import "./channel-config-schema-D8GRr35Q.js";
import { n as createDangerousNameMatchingMutableAllowlistWarningCollector } from "./channel-policy-VIimbh8Q.js";
import "./dangerous-name-runtime-cJriWyuh.js";
import { a as listZalouserAccountIds, i as checkZcaAuthenticated, o as resolveDefaultZalouserAccountId, s as resolveZalouserAccountSync } from "./setup-core-DNg9zUmt.js";
import { n as normalizeCompatibilityConfig, t as legacyConfigRules } from "./doctor-contract-mDJdHVKH.js";
import { n as isZalouserMutableGroupEntry } from "./security-audit-DC5CKVvi.js";
//#region extensions/zalouser/src/config-schema.ts
const groupConfigSchema = object({
	enabled: boolean().optional(),
	requireMention: boolean().optional(),
	tools: ToolPolicySchema
});
const ZalouserConfigSchema = buildCatchallMultiAccountChannelSchema(object({
	name: string().optional(),
	enabled: boolean().optional(),
	markdown: MarkdownConfigSchema,
	profile: string().optional(),
	dangerouslyAllowNameMatching: boolean().optional(),
	dmPolicy: DmPolicySchema.optional(),
	allowFrom: AllowFromListSchema,
	historyLimit: number().int().min(0).optional(),
	groupAllowFrom: AllowFromListSchema,
	groupPolicy: GroupPolicySchema.optional().default("allowlist"),
	groups: object({}).catchall(groupConfigSchema).optional(),
	messagePrefix: string().optional(),
	responsePrefix: string().optional()
}));
//#endregion
//#region extensions/zalouser/src/doctor.ts
function asObjectRecord(value) {
	return value && typeof value === "object" && !Array.isArray(value) ? value : null;
}
const zalouserDoctor = {
	dmAllowFromMode: "topOnly",
	groupModel: "hybrid",
	groupAllowFromFallbackToAllowFrom: false,
	warnOnEmptyGroupSenderAllowlist: false,
	legacyConfigRules,
	normalizeCompatibilityConfig,
	collectMutableAllowlistWarnings: createDangerousNameMatchingMutableAllowlistWarningCollector({
		channel: "zalouser",
		detector: isZalouserMutableGroupEntry,
		collectLists: (scope) => {
			const groups = asObjectRecord(scope.account.groups);
			return groups ? [{
				pathLabel: `${scope.prefix}.groups`,
				list: Object.keys(groups)
			}] : [];
		}
	})
};
//#endregion
//#region extensions/zalouser/src/shared.ts
const zalouserMeta = {
	id: "zalouser",
	label: "Zalo Personal",
	selectionLabel: "Zalo (Personal Account)",
	docsPath: "/channels/zalouser",
	docsLabel: "zalouser",
	blurb: "Zalo personal account via QR code login.",
	aliases: ["zlu"],
	order: 85,
	quickstartAllowFrom: false
};
const zalouserConfigAdapter = createScopedChannelConfigAdapter({
	sectionKey: "zalouser",
	listAccountIds: listZalouserAccountIds,
	resolveAccount: adaptScopedAccountAccessor(resolveZalouserAccountSync),
	defaultAccountId: resolveDefaultZalouserAccountId,
	clearBaseFields: [
		"profile",
		"name",
		"dmPolicy",
		"allowFrom",
		"historyLimit",
		"groupAllowFrom",
		"groupPolicy",
		"groups",
		"messagePrefix"
	],
	resolveAllowFrom: (account) => account.config.allowFrom,
	formatAllowFrom: (allowFrom) => formatAllowFromLowercase({
		allowFrom,
		stripPrefixRe: /^(zalouser|zlu):/i
	})
});
function createZalouserPluginBase(params) {
	return {
		id: "zalouser",
		meta: zalouserMeta,
		setupWizard: params.setupWizard,
		capabilities: {
			chatTypes: ["direct", "group"],
			media: true,
			reactions: true,
			threads: false,
			polls: false,
			nativeCommands: false,
			blockStreaming: true
		},
		doctor: zalouserDoctor,
		reload: { configPrefixes: ["channels.zalouser"] },
		configSchema: buildChannelConfigSchema(ZalouserConfigSchema),
		config: {
			...zalouserConfigAdapter,
			isConfigured: async (account) => await checkZcaAuthenticated(account.profile),
			describeAccount: (account) => describeAccountSnapshot({ account })
		},
		setup: params.setup
	};
}
//#endregion
export { createZalouserPluginBase as t };
