import { i as isWhatsAppBaileysAuthFileName } from "./.setup/creds-files-Drg3usj1.mjs";
import { t as normalizeCompatibilityConfig$1 } from "./.setup/doctor-BPb-SjdE.mjs";
import fs from "node:fs";
import path from "node:path";
import { fileExists } from "openclaw/plugin-sdk/file-access-runtime";
import { DEFAULT_ACCOUNT_ID } from "openclaw/plugin-sdk/account-id";
import { asObjectRecord, defineChannelAliasMigration, definePluginDoctorMigrationFromPlans, hasLegacyAccountStreamingAliases, stripRetiredChannelKeys } from "openclaw/plugin-sdk/runtime-doctor-migrations";
//#region extensions/whatsapp/src/state-migrations.ts
function detectWhatsAppLegacyStateMigrations(params) {
	const targetDir = path.join(params.oauthDir, "whatsapp", DEFAULT_ACCOUNT_ID);
	return (() => {
		try {
			return fs.readdirSync(params.oauthDir, { withFileTypes: true });
		} catch {
			return [];
		}
	})().flatMap((entry) => {
		if (!entry.isFile() || !isWhatsAppBaileysAuthFileName(entry.name)) return [];
		const sourcePath = path.join(params.oauthDir, entry.name);
		const targetPath = path.join(targetDir, entry.name);
		if (fileExists(targetPath)) return [];
		return [{
			kind: "move",
			label: `WhatsApp auth ${entry.name}`,
			sourcePath,
			targetPath
		}];
	});
}
//#endregion
//#region extensions/whatsapp/src/doctor-contract.ts
const streamingAliasMigration = defineChannelAliasMigration({
	channelId: "whatsapp",
	streaming: {
		defaultMode: "partial",
		deliveryOnly: true
	},
	accountStreamingInheritsDefaultAccount: true
});
const hasExposeErrorText = (value) => Object.hasOwn(asObjectRecord(value) ?? {}, "exposeErrorText");
const hasAckReaction = (value) => Boolean(asObjectRecord(asObjectRecord(value)?.ackReaction));
const legacyConfigRules = [
	...streamingAliasMigration.legacyConfigRules,
	{
		path: [
			"channels",
			"whatsapp",
			"ackReaction"
		],
		message: "channels.whatsapp.ackReaction moved to global message acknowledgement settings. Run \"openclaw doctor --fix\"."
	},
	{
		path: [
			"channels",
			"whatsapp",
			"accounts"
		],
		message: "channels.whatsapp.accounts.<id>.ackReaction moved to global message acknowledgement settings. Run \"openclaw doctor --fix\".",
		match: (value) => hasLegacyAccountStreamingAliases(value, hasAckReaction)
	},
	{
		path: [
			"channels",
			"whatsapp",
			"exposeErrorText"
		],
		message: "channels.whatsapp.exposeErrorText is retired and ignored. Run \"openclaw doctor --fix\"."
	},
	{
		path: [
			"channels",
			"whatsapp",
			"accounts"
		],
		message: "channels.whatsapp.accounts.<id>.exposeErrorText is retired and ignored. Run \"openclaw doctor --fix\".",
		match: (value) => hasLegacyAccountStreamingAliases(value, hasExposeErrorText)
	}
];
function removeExposeErrorText(cfg, changes) {
	return stripRetiredChannelKeys({
		cfg,
		channelId: "whatsapp",
		keys: /* @__PURE__ */ new Set(["exposeErrorText"]),
		scope: "root-and-accounts",
		onRemove: ({ key, pathPrefix }) => changes.push(`Removed retired ${pathPrefix}.${key}.`)
	}).config;
}
function normalizeCompatibilityConfig({ cfg }) {
	const ackReaction = normalizeCompatibilityConfig$1({ cfg });
	const retiredConfig = removeExposeErrorText(ackReaction.config, ackReaction.changes);
	return streamingAliasMigration.normalizeChannelConfig({
		cfg: retiredConfig,
		changes: ackReaction.changes
	});
}
//#endregion
//#region extensions/whatsapp/doctor-contract-api.ts
const stateMigrations = [definePluginDoctorMigrationFromPlans({
	id: "whatsapp-legacy-state",
	label: "WhatsApp legacy state",
	resolvePlans: detectWhatsAppLegacyStateMigrations
})];
//#endregion
export { legacyConfigRules, normalizeCompatibilityConfig, stateMigrations };
