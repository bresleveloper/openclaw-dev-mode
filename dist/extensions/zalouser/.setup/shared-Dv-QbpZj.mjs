import { n as normalizeCompatibilityConfig, t as legacyConfigRules } from "./doctor-contract-DcONa6Y4.mjs";
import { n as isZalouserMutableGroupEntry } from "./security-audit-DrvGAayb.mjs";
import { createLazyRuntimeModule } from "openclaw/plugin-sdk/lazy-runtime";
import { createAccountListHelpers, describeAccountSnapshot, resolveChannelMediaMaxBytes } from "openclaw/plugin-sdk/account-helpers";
import { DEFAULT_ACCOUNT_ID, normalizeAccountId } from "openclaw/plugin-sdk/account-resolution";
import { normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
import { adaptScopedAccountAccessor, createScopedChannelConfigAdapter } from "openclaw/plugin-sdk/channel-config-helpers";
import { createDangerousNameMatchingMutableAllowlistWarningCollector } from "openclaw/plugin-sdk/channel-policy";
import fsp from "node:fs/promises";
import path from "node:path";
import { resolvePreferredOpenClawTmpDir } from "openclaw/plugin-sdk/temp-path";
import { defineChannelSetupContract } from "openclaw/plugin-sdk/channel-setup";
import { createDelegatedSetupWizardProxy, createPatchedAccountSetupAdapter, createSetupTranslator } from "openclaw/plugin-sdk/setup-runtime";
import { formatAllowFromLowercase } from "openclaw/plugin-sdk/allow-from";
import { AllowFromListSchema, DmPolicySchema, GroupPolicySchema, MarkdownConfigSchema, buildChannelConfigSchema, buildGroupEntrySchema, buildMultiAccountChannelSchema } from "openclaw/plugin-sdk/channel-config-schema";
import { z } from "zod";
import { asObjectRecord } from "openclaw/plugin-sdk/runtime-doctor-migrations";
//#region extensions/zalouser/src/accounts.ts
const loadZalouserAccountsRuntime = createLazyRuntimeModule(() => import("./accounts.runtime-D0z9nd6A.mjs"));
const { listAccountIds: listZalouserAccountIds, resolveDefaultAccountId: resolveDefaultZalouserAccountId, resolveAccountConfig: resolveMergedZalouserAccountConfig } = createAccountListHelpers("zalouser", {
	omitKeys: ["defaultAccount"],
	implicitDefaultAccount: {
		channelKeys: ["profile"],
		envVars: ["ZALOUSER_PROFILE", "ZCA_PROFILE"]
	}
});
function mergeZalouserAccountConfig(cfg, accountId) {
	const merged = resolveMergedZalouserAccountConfig(cfg, accountId);
	return {
		...merged,
		groupPolicy: merged.groupPolicy ?? "allowlist"
	};
}
function resolveProfile(config, accountId) {
	if (config.profile?.trim()) return config.profile.trim();
	if (process.env.ZALOUSER_PROFILE?.trim()) return process.env.ZALOUSER_PROFILE.trim();
	if (process.env.ZCA_PROFILE?.trim()) return process.env.ZCA_PROFILE.trim();
	if (accountId !== DEFAULT_ACCOUNT_ID) return accountId;
	return "default";
}
function resolveZalouserAccountBase(params) {
	const accountId = normalizeAccountId(params.accountId ?? resolveDefaultZalouserAccountId(params.cfg));
	const baseEnabled = (params.cfg.channels?.zalouser)?.enabled !== false;
	const merged = mergeZalouserAccountConfig(params.cfg, accountId);
	return {
		accountId,
		enabled: baseEnabled && merged.enabled !== false,
		merged,
		profile: resolveProfile(merged, accountId)
	};
}
function resolveZalouserAccountSync(params) {
	const { accountId, enabled, merged, profile } = resolveZalouserAccountBase(params);
	return {
		accountId,
		name: normalizeOptionalString(merged.name),
		enabled,
		profile,
		authenticated: false,
		mediaMaxBytes: resolveChannelMediaMaxBytes({
			cfg: params.cfg,
			accountId,
			resolveChannelLimitMb: () => merged.mediaMaxMb
		}),
		config: merged
	};
}
async function checkZcaAuthenticated(profile, options) {
	return await (await loadZalouserAccountsRuntime()).checkZaloAuthenticated(profile, options);
}
//#endregion
//#region extensions/zalouser/src/qr-temp-file.ts
async function writeQrDataUrlToTempFile(qrDataUrl, profile) {
	const base64 = (qrDataUrl.trim().match(/^data:image\/png;base64,(.+)$/i)?.[1] ?? "").trim();
	if (!base64) return null;
	const safeProfile = profile.replace(/[^a-zA-Z0-9_-]+/g, "-") || "default";
	const filePath = path.join(resolvePreferredOpenClawTmpDir(), `openclaw-zalouser-qr-${safeProfile}.png`);
	await fsp.writeFile(filePath, Buffer.from(base64, "base64"), { mode: 384 });
	await fsp.chmod(filePath, 384);
	return filePath;
}
//#endregion
//#region extensions/zalouser/src/setup-core.ts
const t = createSetupTranslator();
const channel = "zalouser";
const zalouserSetupAdapter = {
	...createPatchedAccountSetupAdapter({
		channelKey: channel,
		validateInput: () => null,
		buildPatch: () => ({})
	}),
	singleAccountKeysToMove: []
};
const zalouserSetupContract = defineChannelSetupContract({
	fields: {},
	legacyAdapter: zalouserSetupAdapter
});
function createZalouserSetupWizardProxy(loadWizard) {
	return createDelegatedSetupWizardProxy({
		channel,
		loadWizard,
		status: {
			configuredLabel: t("wizard.channels.statusLoggedIn"),
			unconfiguredLabel: t("wizard.channels.statusNeedsQrLogin"),
			configuredHint: t("wizard.channels.statusRecommendedLoggedIn"),
			unconfiguredHint: t("wizard.channels.statusRecommendedQrLogin"),
			configuredScore: 1,
			unconfiguredScore: 15
		},
		credentials: [],
		delegatePrepare: true,
		delegateFinalize: true
	});
}
//#endregion
//#region extensions/zalouser/src/config-schema.ts
const ZalouserGroupConfigSchema = buildGroupEntrySchema().omit({
	toolsBySender: true,
	skills: true,
	allowFrom: true,
	systemPrompt: true
}).strip();
const ZalouserAccountSchema = z.object({
	name: z.string().optional(),
	enabled: z.boolean().optional(),
	configWrites: z.boolean().optional(),
	mediaMaxMb: z.number().positive().optional(),
	markdown: MarkdownConfigSchema,
	profile: z.string().optional(),
	dangerouslyAllowNameMatching: z.boolean().optional(),
	dmPolicy: DmPolicySchema.optional(),
	allowFrom: AllowFromListSchema,
	historyLimit: z.number().int().min(0).optional(),
	groupAllowFrom: AllowFromListSchema,
	groupPolicy: GroupPolicySchema.optional().default("allowlist"),
	groups: z.object({}).catchall(ZalouserGroupConfigSchema).optional(),
	messagePrefix: z.string().optional(),
	responsePrefix: z.string().optional()
});
const ZalouserConfigSchema = buildMultiAccountChannelSchema(ZalouserAccountSchema, { accountsMode: "catchall" });
//#endregion
//#region extensions/zalouser/src/doctor.ts
const collectZalouserMutableAllowlistWarnings = createDangerousNameMatchingMutableAllowlistWarningCollector({
	channel: "zalouser",
	detector: isZalouserMutableGroupEntry,
	collectLists: (scope) => {
		const groups = asObjectRecord(scope.account.groups);
		return groups ? [{
			pathLabel: `${scope.prefix}.groups`,
			list: Object.keys(groups)
		}] : [];
	}
});
const zalouserDoctor = {
	dmAllowFromMode: "topOnly",
	groupModel: "hybrid",
	groupAllowFromFallbackToAllowFrom: false,
	warnOnEmptyGroupSenderAllowlist: false,
	legacyConfigRules,
	normalizeCompatibilityConfig,
	collectMutableAllowlistWarnings: collectZalouserMutableAllowlistWarnings
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
		"mediaMaxMb",
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
			isConfigured: (account) => Boolean(account.profile),
			isLinked: async (account) => await checkZcaAuthenticated(account.profile) ? "linked" : "not-linked",
			unconfiguredReason: () => "not configured",
			unlinkedReason: () => "not authenticated",
			describeAccount: (account) => describeAccountSnapshot({
				account,
				configured: Boolean(account.profile)
			})
		},
		setupContract: params.setupContract
	};
}
//#endregion
export { writeQrDataUrlToTempFile as a, resolveDefaultZalouserAccountId as c, zalouserSetupContract as i, resolveZalouserAccountSync as l, createZalouserSetupWizardProxy as n, checkZcaAuthenticated as o, zalouserSetupAdapter as r, listZalouserAccountIds as s, createZalouserPluginBase as t };
