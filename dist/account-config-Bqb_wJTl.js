import { t as DEFAULT_ACCOUNT_ID } from "./account-id-C7N4Rwku.js";
import { t as resolveAccountEntry } from "./account-lookup-DgErwy8P.js";
import { C as resolveChannelStreamingChunkMode, S as resolveChannelStreamingBlockEnabled } from "./streaming-CfpqgwBH.js";
import { c as resolveMergedAccountConfig, o as mergeAccountConfig } from "./account-helpers-BAtt8fRD.js";
import "./account-core-CZPaj9zK.js";
import "./channel-outbound-BopAOIGF.js";
//#region extensions/whatsapp/src/account-config.ts
function resolveWhatsAppDefaultAccountSharedConfig(cfg) {
	const defaultAccount = resolveAccountEntry(cfg.channels?.whatsapp?.accounts, DEFAULT_ACCOUNT_ID);
	if (!defaultAccount) return;
	const { enabled: _ignoredEnabled, name: _ignoredName, authDir: _ignoredAuthDir, selfChatMode: _ignoredSelfChatMode, ...sharedDefaults } = defaultAccount;
	return sharedDefaults;
}
function resolveWhatsAppAccountConfigForTest(cfg, accountId) {
	return resolveAccountEntry(cfg.channels?.whatsapp?.accounts, accountId);
}
function resolveMergedNamedWhatsAppAccountConfig(params) {
	const rootCfg = params.cfg.channels?.whatsapp;
	const accountConfig = resolveWhatsAppAccountConfigForTest(params.cfg, params.accountId);
	return {
		...mergeAccountConfig({
			channelConfig: rootCfg,
			accountConfig: void 0,
			omitKeys: ["defaultAccount"]
		}),
		...resolveWhatsAppDefaultAccountSharedConfig(params.cfg),
		...accountConfig
	};
}
function resolveMergedWhatsAppAccountConfig(params) {
	const rootCfg = params.cfg.channels?.whatsapp;
	const accountId = params.accountId?.trim() || rootCfg?.defaultAccount || "default";
	const base = resolveMergedAccountConfig({
		channelConfig: rootCfg,
		accounts: rootCfg?.accounts,
		accountId,
		omitKeys: ["defaultAccount"]
	});
	const merged = accountId === "default" ? base : resolveMergedNamedWhatsAppAccountConfig({
		cfg: params.cfg,
		accountId
	});
	return {
		accountId,
		...merged,
		chunkMode: resolveChannelStreamingChunkMode(merged) ?? merged.chunkMode,
		blockStreaming: resolveChannelStreamingBlockEnabled(merged) ?? merged.blockStreaming
	};
}
//#endregion
export { resolveMergedWhatsAppAccountConfig as t };
