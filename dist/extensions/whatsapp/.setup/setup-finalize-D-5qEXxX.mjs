import { a as resolveWhatsAppAccount, o as resolveWhatsAppAuthDir } from "./accounts-Czb9k6cU.mjs";
import { r as resolveDefaultWhatsAppAccountId } from "./account-ids-ENToBTTq.mjs";
import { r as hasWebCredsSync } from "./creds-files-CQDqePya.mjs";
import { a as normalizeWhatsAppAllowFromEntries, o as normalizeWhatsAppAllowFromEntry } from "./normalize-target-DouOWumF.mjs";
import { n as whatsappSetupAdapter } from "./shared-CGGIAsum.mjs";
import { formatCliCommand, formatDocsLink } from "openclaw/plugin-sdk/setup-tools";
import { DEFAULT_ACCOUNT_ID, createSetupTranslator, splitSetupEntries } from "openclaw/plugin-sdk/setup";
// extensions/whatsapp/src/setup-finalize.ts
const t = createSetupTranslator();
function trimPromptText(value) {
	return value?.trim() ?? "";
}
function isDefaultWhatsAppAccountKey(accountId) {
	return accountId.trim().toLowerCase() === DEFAULT_ACCOUNT_ID;
}
function resolveWhatsAppAccountWriteKey(cfg, accountId) {
	if (accountId !== DEFAULT_ACCOUNT_ID) return accountId;
	const accounts = cfg.channels?.whatsapp?.accounts;
	const keys = Object.keys(accounts ?? {});
	if (!accounts?.default && !keys.some((key) => !isDefaultWhatsAppAccountKey(key))) return;
	return keys.find(isDefaultWhatsAppAccountKey) ?? DEFAULT_ACCOUNT_ID;
}
function resolveWhatsAppConfigPathPrefix(cfg, accountId) {
	const key = resolveWhatsAppAccountWriteKey(cfg, accountId);
	return key === void 0 ? "channels.whatsapp" : `channels.whatsapp.accounts.${key}`;
}
function mergeWhatsAppConfig(cfg, accountId, patch, options) {
	const channelConfig = { ...cfg.channels?.whatsapp };
	const targetAccountId = resolveWhatsAppAccountWriteKey(cfg, accountId);
	const atRoot = targetAccountId === void 0;
	const accounts = { ...channelConfig.accounts };
	const lowerDefaultAccount = accountId === DEFAULT_ACCOUNT_ID && targetAccountId !== DEFAULT_ACCOUNT_ID ? accounts[DEFAULT_ACCOUNT_ID] : void 0;
	const target = atRoot ? channelConfig : {
		...accounts[targetAccountId],
		...lowerDefaultAccount
	};
	const mutableTarget = target;
	for (const [key, value] of Object.entries(patch)) {
		if (value === void 0) {
			if (options?.unsetOnUndefined?.includes(key)) delete mutableTarget[key];
			continue;
		}
		mutableTarget[key] = value;
	}
	if (!atRoot) {
		accounts[targetAccountId] = target;
		if (lowerDefaultAccount) delete accounts[DEFAULT_ACCOUNT_ID];
		channelConfig.accounts = accounts;
	}
	return {
		...cfg,
		channels: {
			...cfg.channels,
			whatsapp: channelConfig
		}
	};
}
function setWhatsAppAllowFrom(cfg, accountId, allowFrom) {
	return mergeWhatsAppConfig(cfg, accountId, { allowFrom }, { unsetOnUndefined: ["allowFrom"] });
}
function parseWhatsAppAllowFromEntries(raw) {
	const entries = [];
	for (const part of splitSetupEntries(raw)) {
		const normalized = normalizeWhatsAppAllowFromEntry(part);
		if (!normalized) return {
			entries: [],
			invalidEntry: part
		};
		entries.push(normalized);
	}
	return { entries: normalizeWhatsAppAllowFromEntries(entries) };
}
async function finalizeWhatsAppSetup(params) {
	const selectedAccountId = params.accountId.trim() || resolveDefaultWhatsAppAccountId(params.cfg);
	let next = selectedAccountId === DEFAULT_ACCOUNT_ID ? params.cfg : whatsappSetupAdapter.applyAccountConfig({
		cfg: params.cfg,
		accountId: selectedAccountId,
		input: {}
	});
	const { authDir } = resolveWhatsAppAuthDir({
		cfg: next,
		accountId: selectedAccountId
	});
	const linked = hasWebCredsSync(authDir);
	if (!params.options?.deferDeviceLinkToClient) {
		if (!linked) await params.prompter.note([
			t("wizard.whatsapp.scanQr"),
			t("wizard.whatsapp.credentialsStored", { authDir }),
			t("wizard.channels.docs", { link: formatDocsLink("/whatsapp", "whatsapp") })
		].join("\n"), t("wizard.whatsapp.linkingTitle"));
		if (await params.prompter.confirm({
			message: linked ? t("wizard.whatsapp.relinkPrompt") : t("wizard.whatsapp.linkNowPrompt"),
			initialValue: !linked
		})) {
			let persistenceGuardFailure;
			try {
				const { loginWeb } = await import("./login-CdDRn9wx.mjs").then((n) => n.n);
				const beforeCredentialPersistence = params.options?.beforePersistentEffect ? async () => {
					try {
						await params.options?.beforePersistentEffect?.();
					} catch (error) {
						persistenceGuardFailure = { error };
						throw error;
					}
				} : void 0;
				await loginWeb(false, void 0, params.runtime, selectedAccountId, { beforeCredentialPersistence });
			} catch (error) {
				if (persistenceGuardFailure) throw persistenceGuardFailure.error;
				params.runtime.error(`WhatsApp login failed: ${String(error)}`);
				await params.prompter.note(t("wizard.channels.docs", { link: formatDocsLink("/whatsapp", "whatsapp") }), t("wizard.whatsapp.helpTitle"));
			}
		} else if (!linked) await params.prompter.note(t("wizard.whatsapp.linkLater", { command: formatCliCommand("openclaw channels login") }), "WhatsApp");
	}
	const cfg = next;
	const { forceAllowFrom, prompter } = params;
	async function promptWhatsAppDmAccess() {
		const accountId = selectedAccountId.trim() || DEFAULT_ACCOUNT_ID;
		const account = resolveWhatsAppAccount({
			cfg,
			accountId
		});
		const existingPolicy = account.dmPolicy ?? "pairing";
		const existingAllowFrom = account.allowFrom ?? [];
		const existingLabel = existingAllowFrom.length > 0 ? existingAllowFrom.join(", ") : "unset";
		const configPathPrefix = resolveWhatsAppConfigPathPrefix(cfg, accountId);
		const policyKey = `${configPathPrefix}.dmPolicy`;
		const allowFromKey = `${configPathPrefix}.allowFrom`;
		async function applyWhatsAppOwnerAllowlist(title, messageLines) {
			await prompter.note(t("wizard.whatsapp.ownerNumberNote"), t("wizard.whatsapp.numberTitle"));
			const entry = await prompter.text({
				message: t("wizard.whatsapp.personalNumberPrompt"),
				placeholder: "+15555550123",
				initialValue: existingAllowFrom[0],
				validate: (value) => {
					const raw = trimPromptText(value);
					if (!raw) return t("common.required");
					if (!normalizeWhatsAppAllowFromEntry(raw)) return `Invalid number: ${raw}`;
				}
			});
			const normalized = normalizeWhatsAppAllowFromEntry(trimPromptText(entry));
			if (!normalized) throw new Error("Invalid WhatsApp owner number (expected E.164 after validation).");
			const allowFrom = normalizeWhatsAppAllowFromEntries([...existingAllowFrom.filter((item) => item !== "*"), normalized]);
			const ownerConfig = mergeWhatsAppConfig(cfg, accountId, {
				selfChatMode: true,
				dmPolicy: "allowlist",
				allowFrom
			});
			await prompter.note([...messageLines, `- allowFrom includes ${normalized}`].join("\n"), title);
			return ownerConfig;
		}
		if (forceAllowFrom) return await applyWhatsAppOwnerAllowlist(t("wizard.whatsapp.allowlistTitle"), [t("wizard.whatsapp.allowlistModeEnabled")]);
		await prompter.note([
			`WhatsApp direct chats are gated by \`${policyKey}\` + \`${allowFromKey}\`.`,
			"- pairing (default): unknown senders get a pairing code; owner approves",
			"- allowlist: unknown senders are blocked",
			"- open: public inbound DMs (requires allowFrom to include \"*\")",
			"- disabled: ignore WhatsApp DMs",
			"",
			`Current: dmPolicy=${existingPolicy}, allowFrom=${existingLabel}`,
			t("wizard.channels.docs", { link: formatDocsLink("/whatsapp", "whatsapp") })
		].join("\n"), t("wizard.whatsapp.dmAccessTitle"));
		if (await prompter.select({
			message: t("wizard.whatsapp.phoneSetupPrompt"),
			options: [{
				value: "personal",
				label: t("wizard.whatsapp.personalPhoneLabel")
			}, {
				value: "separate",
				label: t("wizard.whatsapp.separatePhoneLabel")
			}]
		}) === "personal") return await applyWhatsAppOwnerAllowlist(t("wizard.whatsapp.personalPhoneTitle"), [t("wizard.whatsapp.personalPhoneModeEnabled"), t("wizard.whatsapp.dmPolicySetAllowlist")]);
		const policy = await prompter.select({
			message: t("wizard.whatsapp.dmPolicyPrompt"),
			options: [
				{
					value: "pairing",
					label: t("wizard.channels.dmPolicyPairing")
				},
				{
					value: "allowlist",
					label: t("wizard.whatsapp.dmPolicyAllowlistOnly")
				},
				{
					value: "open",
					label: t("wizard.channels.dmPolicyOpenOption")
				},
				{
					value: "disabled",
					label: t("wizard.whatsapp.dmPolicyDisabled")
				}
			]
		});
		const accessConfig = mergeWhatsAppConfig(cfg, accountId, {
			selfChatMode: false,
			dmPolicy: policy
		});
		if (policy === "open") return setWhatsAppAllowFrom(accessConfig, accountId, normalizeWhatsAppAllowFromEntries(["*", ...existingAllowFrom]));
		if (policy === "disabled") return accessConfig;
		const mode = await prompter.select({
			message: t("wizard.whatsapp.allowFromPrompt"),
			options: [
				...existingAllowFrom.length > 0 ? [{
					value: "keep",
					label: t("wizard.whatsapp.keepCurrentAllowFrom")
				}] : [],
				{
					value: "unset",
					label: t(existingAllowFrom.length > 0 ? "wizard.whatsapp.unsetAllowFromPairing" : "wizard.whatsapp.unsetAllowFromDefault")
				},
				{
					value: "list",
					label: t("wizard.whatsapp.setAllowFromNumbers")
				}
			]
		});
		if (mode === "keep") return accessConfig;
		if (mode === "unset") return setWhatsAppAllowFrom(accessConfig, accountId, void 0);
		const parsed = parseWhatsAppAllowFromEntries(trimPromptText(await prompter.text({
			message: t("wizard.whatsapp.allowedSenderNumbers"),
			placeholder: "+15555550123, +447700900123",
			validate: (value) => {
				const raw = trimPromptText(value);
				if (!raw) return t("common.required");
				const parsed = parseWhatsAppAllowFromEntries(raw);
				if (parsed.entries.length === 0 && !parsed.invalidEntry) return t("common.required");
				if (parsed.invalidEntry) return `Invalid number: ${parsed.invalidEntry}`;
			}
		})));
		if (parsed.invalidEntry) throw new Error(`Invalid number: ${parsed.invalidEntry}`);
		if (parsed.entries.length === 0) throw new Error("Invalid WhatsApp allowFrom list (expected at least one E.164 number).");
		return setWhatsAppAllowFrom(accessConfig, accountId, parsed.entries);
	}
	next = await promptWhatsAppDmAccess();
	return { cfg: next };
}
export { finalizeWhatsAppSetup };
