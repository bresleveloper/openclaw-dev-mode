import { i as __exportAll } from "./doctor-contract-w11JEjcg.mjs";
import { a as writeQrDataUrlToTempFile, c as resolveDefaultZalouserAccountId, l as resolveZalouserAccountSync, o as checkZcaAuthenticated, s as listZalouserAccountIds } from "./shared-CRZ1TLNs.mjs";
import { S as waitForZaloQrLogin, c as logoutZaloProfile, f as resolveZaloGroupsByEntries, u as resolveZaloAllowFromEntries, x as startZaloQrLogin } from "./zalo-js-Cmhsqtom.mjs";
import { normalizeStringEntries } from "openclaw/plugin-sdk/string-coerce-runtime";
import { createChannelDmPolicy } from "openclaw/plugin-sdk/channel-dm-policy";
import { DEFAULT_ACCOUNT_ID, addWildcardAllowFrom, createSetupTranslator, formatCliCommand, formatDocsLink, formatResolvedUnresolvedNote, mergeAllowFromEntries, normalizeAccountId, patchScopedAccountConfig, splitSetupEntries } from "openclaw/plugin-sdk/setup";
//#region extensions/zalouser/src/setup-surface.ts
var setup_surface_exports = /* @__PURE__ */ __exportAll({ zalouserSetupWizard: () => zalouserSetupWizard });
const t = createSetupTranslator();
const channel = "zalouser";
const ZALOUSER_ALLOW_FROM_PLACEHOLDER = t("wizard.zalouser.allowFromPlaceholder");
const ZALOUSER_GROUPS_PLACEHOLDER = t("wizard.zalouser.groupsPlaceholder");
const ZALOUSER_DM_ACCESS_TITLE = t("wizard.zalouser.dmAccessTitle");
const ZALOUSER_ALLOWLIST_TITLE = t("wizard.zalouser.allowlistTitle");
const ZALOUSER_GROUPS_TITLE = t("wizard.zalouser.groupsTitle");
function setZalouserAccountScopedConfig(cfg, accountId, defaultPatch, accountPatch = defaultPatch) {
	return patchScopedAccountConfig({
		cfg,
		channelKey: channel,
		accountId,
		patch: defaultPatch,
		accountPatch
	});
}
function setZalouserDmPolicy(cfg, accountId, policy) {
	const resolvedAccountId = normalizeAccountId(accountId) ?? DEFAULT_ACCOUNT_ID;
	const resolved = resolveZalouserAccountSync({
		cfg,
		accountId: resolvedAccountId
	});
	return setZalouserAccountScopedConfig(cfg, resolvedAccountId, {
		dmPolicy: policy,
		...policy === "open" ? { allowFrom: addWildcardAllowFrom(resolved.config.allowFrom) } : {}
	});
}
function ensureZalouserPluginEnabled(cfg) {
	const allow = cfg.plugins?.allow;
	return {
		...cfg,
		plugins: {
			...cfg.plugins,
			entries: {
				...cfg.plugins?.entries,
				zalouser: {
					...cfg.plugins?.entries?.zalouser,
					enabled: true
				}
			},
			...Array.isArray(allow) && !allow.includes(channel) ? { allow: [...allow, channel] } : {}
		}
	};
}
async function promptZalouserAllowFrom(params) {
	const { cfg, prompter, accountId } = params;
	const resolved = resolveZalouserAccountSync({
		cfg,
		accountId
	});
	const existingAllowFrom = resolved.config.allowFrom ?? [];
	while (true) {
		const entry = await prompter.text({
			message: t("wizard.zalouser.allowFromPrompt"),
			placeholder: ZALOUSER_ALLOW_FROM_PLACEHOLDER,
			initialValue: existingAllowFrom.length > 0 ? existingAllowFrom.join(", ") : void 0
		});
		const parts = splitSetupEntries(entry);
		if (parts.length === 0) {
			await prompter.note([
				t("wizard.zalouser.noDmAllowlist"),
				t("wizard.zalouser.directChatsBlocked"),
				t("wizard.zalouser.peersLookupTip", { command: formatCliCommand("openclaw directory peers list --channel zalouser") })
			].join("\n"), ZALOUSER_ALLOWLIST_TITLE);
			return setZalouserAccountScopedConfig(cfg, accountId, {
				dmPolicy: "allowlist",
				allowFrom: []
			});
		}
		const resolvedEntries = await resolveZaloAllowFromEntries({
			profile: resolved.profile,
			entries: parts,
			credentialPersistence: "read-only"
		});
		const unresolved = resolvedEntries.filter((item) => !item.resolved).map((item) => item.input);
		if (unresolved.length > 0) {
			await prompter.note(t("wizard.zalouser.couldNotResolve", { entries: unresolved.join(", ") }), ZALOUSER_ALLOWLIST_TITLE);
			continue;
		}
		const resolvedIds = resolvedEntries.filter((item) => item.resolved && item.id).map((item) => item.id);
		const unique = mergeAllowFromEntries(existingAllowFrom, resolvedIds);
		const notes = resolvedEntries.filter((item) => item.note).map((item) => `${item.input} -> ${item.id} (${item.note})`);
		if (notes.length > 0) await prompter.note(notes.join("\n"), ZALOUSER_ALLOWLIST_TITLE);
		return setZalouserAccountScopedConfig(cfg, accountId, {
			dmPolicy: "allowlist",
			allowFrom: unique
		});
	}
}
const zalouserDmPolicy = createChannelDmPolicy({
	label: "Zalo Personal",
	channel,
	resolveAccount: (cfg, accountId) => resolveZalouserAccountSync({
		cfg,
		accountId: accountId ?? resolveDefaultZalouserAccountId(cfg)
	}),
	applyPatch: ({ cfg, account, patch }) => setZalouserAccountScopedConfig(cfg, account.accountId, patch, patch),
	promptAllowFrom: async ({ cfg, prompter, accountId }) => {
		return await promptZalouserAllowFrom({
			cfg,
			prompter,
			accountId: accountId && normalizeAccountId(accountId) ? normalizeAccountId(accountId) ?? DEFAULT_ACCOUNT_ID : resolveDefaultZalouserAccountId(cfg)
		});
	}
});
async function promptZalouserQuickstartDmPolicy(params) {
	const { cfg, prompter, accountId } = params;
	const resolved = resolveZalouserAccountSync({
		cfg,
		accountId
	});
	const existingPolicy = resolved.config.dmPolicy ?? "pairing";
	const existingAllowFrom = resolved.config.allowFrom ?? [];
	const existingLabel = existingAllowFrom.length > 0 ? existingAllowFrom.join(", ") : "unset";
	await prompter.note([
		t("wizard.zalouser.dmHelpSeparate"),
		t("wizard.zalouser.dmHelpPairing"),
		t("wizard.zalouser.dmHelpAllowlist"),
		t("wizard.zalouser.dmHelpOpen"),
		t("wizard.zalouser.dmHelpDisabled"),
		"",
		`Current: dmPolicy=${existingPolicy}, allowFrom=${existingLabel}`,
		t("wizard.zalouser.dmHelpAllowlistEmpty")
	].join("\n"), ZALOUSER_DM_ACCESS_TITLE);
	const policy = await prompter.select({
		message: t("wizard.zalouser.dmPolicyPrompt"),
		options: [
			{
				value: "pairing",
				label: t("wizard.channels.dmPolicyPairing")
			},
			{
				value: "allowlist",
				label: t("wizard.channels.dmPolicyAllowlistOption")
			},
			{
				value: "open",
				label: t("wizard.channels.dmPolicyOpenOption")
			},
			{
				value: "disabled",
				label: t("wizard.channels.dmPolicyDisabledOption")
			}
		],
		initialValue: existingPolicy
	});
	if (policy === "allowlist") return await promptZalouserAllowFrom({
		cfg,
		prompter,
		accountId
	});
	return setZalouserDmPolicy(cfg, accountId, policy);
}
const zalouserSetupWizard = {
	channel,
	status: {
		configuredLabel: t("wizard.channels.statusLoggedIn"),
		unconfiguredLabel: t("wizard.channels.statusNeedsQrLogin"),
		configuredHint: t("wizard.channels.statusRecommendedLoggedIn"),
		unconfiguredHint: t("wizard.channels.statusRecommendedQrLogin"),
		configuredScore: 1,
		unconfiguredScore: 15,
		resolveConfigured: async ({ cfg, accountId }) => {
			const ids = accountId ? [accountId] : listZalouserAccountIds(cfg);
			for (const resolvedAccountId of ids) {
				const account = resolveZalouserAccountSync({
					cfg,
					accountId: resolvedAccountId
				});
				if (await checkZcaAuthenticated(account.profile, { credentialPersistence: "read-only" })) return true;
			}
			return false;
		},
		resolveStatusLines: async ({ accountId, configured }) => {
			return [`${accountId && accountId !== DEFAULT_ACCOUNT_ID ? `Zalo Personal (${accountId})` : "Zalo Personal"}: ${configured ? "logged in" : "needs QR login"}`];
		}
	},
	prepare: async ({ cfg, accountId, prompter, options }) => {
		let next = cfg;
		const account = resolveZalouserAccountSync({
			cfg: next,
			accountId
		});
		const alreadyAuthenticated = await checkZcaAuthenticated(account.profile, { credentialPersistence: "read-only" });
		let wantsLogin;
		if (!alreadyAuthenticated) {
			await prompter.note([
				t("wizard.zalouser.helpQrLogin"),
				"",
				t("wizard.zalouser.helpZcaJs"),
				"",
				`Docs: ${formatDocsLink("/channels/zalouser", "zalouser")}`
			].join("\n"), t("wizard.zalouser.setupTitle"));
			wantsLogin = await prompter.confirm({
				message: t("wizard.zalouser.loginQrPrompt"),
				initialValue: true
			});
		} else wantsLogin = !await prompter.confirm({
			message: t("wizard.zalouser.keepSessionPrompt"),
			initialValue: true
		});
		if (wantsLogin) {
			if (alreadyAuthenticated) {
				await options?.beforePersistentEffect?.();
				await logoutZaloProfile(account.profile, { assertCurrent: options?.assertPersistentEffectCurrent });
			}
			await options?.beforePersistentEffect?.();
			const start = await startZaloQrLogin({
				profile: account.profile,
				...alreadyAuthenticated ? { force: true } : {},
				timeoutMs: 35e3,
				...options?.beforePersistentEffect ? { beforeCredentialPersistence: options.beforePersistentEffect } : {},
				...options?.assertPersistentEffectCurrent ? { assertCredentialPersistenceCurrent: options.assertPersistentEffectCurrent } : {}
			});
			if (start.qrDataUrl) {
				const qrPath = await writeQrDataUrlToTempFile(start.qrDataUrl, account.profile);
				const savedQrNote = qrPath ? t("wizard.zalouser.qrImageSaved", { path: qrPath }) : void 0;
				const qrNotes = alreadyAuthenticated ? [start.message, savedQrNote].filter(Boolean) : [
					start.message,
					savedQrNote ?? t("wizard.zalouser.qrImageWriteFailed"),
					t("wizard.zalouser.scanApproveContinue")
				];
				await prompter.note(qrNotes.join("\n"), t("wizard.zalouser.qrLoginTitle"));
				if (alreadyAuthenticated || await prompter.confirm({
					message: t("wizard.zalouser.qrScannedPrompt"),
					initialValue: true
				})) {
					const waited = await waitForZaloQrLogin({
						profile: account.profile,
						timeoutMs: 12e4
					});
					await prompter.note(waited.message, waited.connected ? t("common.done") : t("wizard.zalouser.loginPendingTitle"));
				}
			} else if (!alreadyAuthenticated) await prompter.note(start.message, t("wizard.zalouser.loginPendingTitle"));
		}
		next = setZalouserAccountScopedConfig(next, accountId, { profile: account.profile !== "default" ? account.profile : void 0 }, {
			profile: account.profile,
			enabled: true
		});
		if (options?.quickstartDefaults) next = await promptZalouserQuickstartDmPolicy({
			cfg: next,
			prompter,
			accountId
		});
		return { cfg: next };
	},
	credentials: [],
	groupAccess: {
		label: "Zalo groups",
		placeholder: ZALOUSER_GROUPS_PLACEHOLDER,
		currentPolicy: ({ cfg, accountId }) => resolveZalouserAccountSync({
			cfg,
			accountId
		}).config.groupPolicy ?? "allowlist",
		currentEntries: ({ cfg, accountId }) => Object.keys(resolveZalouserAccountSync({
			cfg,
			accountId
		}).config.groups ?? {}),
		updatePrompt: ({ cfg, accountId }) => Boolean(resolveZalouserAccountSync({
			cfg,
			accountId
		}).config.groups),
		setPolicy: ({ cfg, accountId, policy }) => setZalouserAccountScopedConfig(cfg, accountId, { groupPolicy: policy }),
		resolveAllowlist: async ({ cfg, accountId, entries, prompter }) => {
			if (entries.length === 0) {
				await prompter.note([
					t("wizard.zalouser.noGroupAllowlist"),
					t("wizard.zalouser.groupChatsBlocked"),
					t("wizard.zalouser.groupsLookupTip", { command: formatCliCommand("openclaw directory groups list --channel zalouser") }),
					t("wizard.zalouser.groupMentionRequirement")
				].join("\n"), ZALOUSER_GROUPS_TITLE);
				return [];
			}
			const updatedAccount = resolveZalouserAccountSync({
				cfg,
				accountId
			});
			try {
				const resolved = await resolveZaloGroupsByEntries({
					profile: updatedAccount.profile,
					entries,
					credentialPersistence: "read-only"
				});
				const resolvedIds = resolved.filter((entry) => entry.resolved && entry.id).map((entry) => entry.id);
				const unresolved = resolved.filter((entry) => !entry.resolved).map((entry) => entry.input);
				const keys = [...resolvedIds, ...normalizeStringEntries(unresolved)];
				const resolution = formatResolvedUnresolvedNote({
					resolved: resolvedIds,
					unresolved
				});
				if (resolution) await prompter.note(resolution, ZALOUSER_GROUPS_TITLE);
				return keys;
			} catch (err) {
				await prompter.note(t("wizard.zalouser.groupLookupFailed", { error: String(err) }), ZALOUSER_GROUPS_TITLE);
				return normalizeStringEntries(entries);
			}
		},
		applyAllowlist: ({ cfg, accountId, resolved }) => setZalouserAccountScopedConfig(cfg, accountId, { groups: Object.fromEntries(resolved.map((key) => [key, {
			enabled: true,
			requireMention: true
		}])) })
	},
	finalize: async ({ cfg, accountId, forceAllowFrom, options, prompter }) => {
		let next = cfg;
		if (forceAllowFrom && !options?.quickstartDefaults) next = await promptZalouserAllowFrom({
			cfg: next,
			prompter,
			accountId
		});
		return { cfg: ensureZalouserPluginEnabled(next) };
	},
	dmPolicy: zalouserDmPolicy
};
//#endregion
export { zalouserSetupWizard as n, setup_surface_exports as t };
