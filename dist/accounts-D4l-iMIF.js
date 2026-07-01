import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
import { _ as resolveOAuthDir } from "./paths-DyelItkH.js";
import { m as resolveUserPath } from "./utils-BApvfmPs.js";
import { n as normalizeAccountId, t as DEFAULT_ACCOUNT_ID } from "./account-id-5IgE9UKY.js";
import "./string-coerce-runtime-BiZzULo_.js";
import "./account-core-Dpb-yXIR.js";
import "./state-paths-DshOQl4X.js";
import { t as resolveMergedWhatsAppAccountConfig } from "./account-config-DKHSVT_Q.js";
import { n as listConfiguredAccountIds, r as resolveDefaultWhatsAppAccountId, t as listAccountIds } from "./account-ids-Bgg1wvIw.js";
import { n as hasWebCredsRegularFileSync, r as hasWebCredsSync } from "./creds-files-B4KulFy1.js";
import fs from "node:fs";
import path from "node:path";
//#region extensions/whatsapp/src/accounts.ts
const DEFAULT_WHATSAPP_MEDIA_MAX_MB = 50;
function listWhatsAppAuthDirs(cfg) {
	const oauthDir = resolveOAuthDir();
	const whatsappDir = path.join(oauthDir, "whatsapp");
	const authDirs = new Set([oauthDir, path.join(whatsappDir, DEFAULT_ACCOUNT_ID)]);
	const accountIds = listConfiguredAccountIds(cfg);
	for (const accountId of accountIds) authDirs.add(resolveWhatsAppAuthDir({
		cfg,
		accountId
	}).authDir);
	try {
		const entries = fs.readdirSync(whatsappDir, { withFileTypes: true });
		for (const entry of entries) {
			if (!entry.isDirectory()) continue;
			authDirs.add(path.join(whatsappDir, entry.name));
		}
	} catch {}
	return Array.from(authDirs);
}
function hasAnyWhatsAppAuth(cfg) {
	return listWhatsAppAuthDirs(cfg).some((authDir) => hasWebCredsSync(authDir));
}
function resolveDefaultAuthDir(accountId) {
	return path.join(resolveOAuthDir(), "whatsapp", normalizeAccountId(accountId));
}
function resolveLegacyAuthDir() {
	return resolveOAuthDir();
}
function legacyAuthExists(authDir) {
	return hasWebCredsRegularFileSync(authDir);
}
function resolveWhatsAppAuthDir(params) {
	const accountId = params.accountId.trim() || "default";
	const configured = resolveMergedWhatsAppAccountConfig({
		cfg: params.cfg,
		accountId
	})?.authDir?.trim();
	if (configured) return {
		authDir: resolveUserPath(configured),
		isLegacy: false
	};
	const defaultDir = resolveDefaultAuthDir(accountId);
	if (accountId === "default") {
		const legacyDir = resolveLegacyAuthDir();
		if (legacyAuthExists(legacyDir) && !legacyAuthExists(defaultDir)) return {
			authDir: legacyDir,
			isLegacy: true
		};
	}
	return {
		authDir: defaultDir,
		isLegacy: false
	};
}
function resolveWhatsAppAccount(params) {
	const merged = resolveMergedWhatsAppAccountConfig({
		cfg: params.cfg,
		accountId: params.accountId?.trim() || resolveDefaultWhatsAppAccountId(params.cfg)
	});
	const accountId = merged.accountId;
	const enabled = merged.enabled !== false;
	const { authDir, isLegacy } = resolveWhatsAppAuthDir({
		cfg: params.cfg,
		accountId
	});
	return {
		accountId,
		name: normalizeOptionalString(merged.name),
		enabled,
		sendReadReceipts: merged.sendReadReceipts ?? true,
		messagePrefix: merged.messagePrefix ?? params.cfg.messages?.messagePrefix,
		defaultTo: merged.defaultTo,
		authDir,
		isLegacyAuthDir: isLegacy,
		selfChatMode: merged.selfChatMode,
		dmPolicy: merged.dmPolicy,
		allowFrom: merged.allowFrom,
		groupAllowFrom: merged.groupAllowFrom,
		groupPolicy: merged.groupPolicy,
		mentionPatterns: merged.mentionPatterns,
		historyLimit: merged.historyLimit,
		textChunkLimit: merged.textChunkLimit,
		chunkMode: merged.chunkMode,
		mediaMaxMb: merged.mediaMaxMb,
		blockStreaming: merged.blockStreaming,
		ackReaction: merged.ackReaction,
		reactionLevel: merged.reactionLevel,
		groups: merged.groups,
		direct: merged.direct,
		debounceMs: merged.debounceMs,
		replyToMode: merged.replyToMode
	};
}
function resolveWhatsAppMediaMaxBytes(account) {
	const mediaMaxMb = typeof account.mediaMaxMb === "number" && account.mediaMaxMb > 0 ? account.mediaMaxMb : 50;
	return Math.floor(mediaMaxMb * 1024 * 1024);
}
function listEnabledWhatsAppAccounts(cfg) {
	return listAccountIds(cfg).map((accountId) => resolveWhatsAppAccount({
		cfg,
		accountId
	})).filter((account) => account.enabled);
}
//#endregion
export { resolveWhatsAppAccount as a, listWhatsAppAuthDirs as i, hasAnyWhatsAppAuth as n, resolveWhatsAppAuthDir as o, listEnabledWhatsAppAccounts as r, resolveWhatsAppMediaMaxBytes as s, DEFAULT_WHATSAPP_MEDIA_MAX_MB as t };
