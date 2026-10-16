import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { r as createLazyRuntimeModule } from "./lazy-runtime-CJrzFzqU.mjs";
import { d as normalizeStringEntries, y as uniqueStrings } from "./string-normalization-CECOqf64.mjs";
import "./session-key-C09ow4h0.mjs";
import { n as normalizeAccountId } from "./account-id-DbRsdayc.mjs";
import { o as setTopLevelChannelEnabledInConfigSection, s as writeChannelSection } from "./config-helpers-Ch_BBBFF.mjs";
import { c as patchScopedAccountConfig, s as moveSingleAccountChannelSectionToDefaultAccount } from "./setup-helpers-CDK4xLs4.mjs";
import { t as resolveSecretInputModeForEnvSelection } from "./provider-auth-mode-7FOSjRoY.mjs";
//#region src/channels/plugins/setup-wizard-helpers.ts
const loadProviderAuthInput = createLazyRuntimeModule(() => import("./provider-auth-ref-D9FDQpbM.mjs"));
const promptAccountId = async (params) => {
	const existingIds = params.listAccountIds(params.cfg);
	const initial = params.currentId?.trim() || params.defaultAccountId || "default";
	const choice = await params.prompter.select({
		message: `${params.label} account`,
		options: [...existingIds.map((id) => ({
			value: id,
			label: id === "default" ? "default (primary)" : id
		})), {
			value: "__new__",
			label: "Add a new account"
		}],
		initialValue: initial
	});
	if (choice !== "__new__") return normalizeAccountId(choice);
	const entered = await params.prompter.text({
		message: `New ${params.label} account id`,
		validate: (value) => normalizeOptionalString(value) ? void 0 : "Required"
	});
	const normalized = normalizeAccountId(entered);
	if ((normalizeOptionalString(entered) ?? "") !== normalized) await params.prompter.note(`Normalized account id to "${normalized}".`, `${params.label} account`);
	return normalized;
};
function addWildcardAllowFrom(allowFrom) {
	const next = normalizeStringEntries(allowFrom ?? []);
	if (!next.includes("*")) next.push("*");
	return next;
}
function mergeAllowFromEntries(current, additions) {
	const merged = normalizeStringEntries([...current ?? [], ...additions]);
	return uniqueStrings(merged);
}
function splitSetupEntries(raw) {
	return normalizeStringEntries(raw.split(/[\n,;]+/g));
}
function parseSetupEntriesWithParser(raw, parseEntry) {
	const parts = splitSetupEntries(raw);
	const entries = [];
	for (const part of parts) {
		const parsed = parseEntry(part);
		if ("error" in parsed) return {
			entries: [],
			error: parsed.error
		};
		entries.push(parsed.value);
	}
	return { entries: normalizeAllowFromEntries(entries) };
}
function parseSetupEntriesAllowingWildcard(raw, parseEntry) {
	return parseSetupEntriesWithParser(raw, (entry) => {
		if (entry === "*") return { value: "*" };
		return parseEntry(entry);
	});
}
function parseMentionOrPrefixedId(params) {
	const trimmed = params.value.trim();
	if (!trimmed) return null;
	const mentionMatch = trimmed.match(params.mentionPattern);
	if (mentionMatch?.[1]) return params.normalizeId ? params.normalizeId(mentionMatch[1]) : mentionMatch[1];
	const stripped = params.prefixPattern ? trimmed.replace(params.prefixPattern, "") : trimmed;
	if (!params.idPattern.test(stripped)) return null;
	return params.normalizeId ? params.normalizeId(stripped) : stripped;
}
function normalizeAllowFromEntries(entries, normalizeEntry) {
	const normalized = normalizeStringEntries(entries).map((entry) => {
		if (entry === "*" || !normalizeEntry) return entry;
		return normalizeOptionalString(normalizeEntry(entry)) ?? "";
	}).filter(Boolean);
	return uniqueStrings(normalized);
}
function createStandardChannelSetupStatus(params) {
	const status = {
		configuredLabel: params.configuredLabel,
		unconfiguredLabel: params.unconfiguredLabel,
		resolveConfigured: params.resolveConfigured,
		...params.configuredHint ? { configuredHint: params.configuredHint } : {},
		...params.unconfiguredHint ? { unconfiguredHint: params.unconfiguredHint } : {},
		...typeof params.configuredScore === "number" ? { configuredScore: params.configuredScore } : {},
		...typeof params.unconfiguredScore === "number" ? { unconfiguredScore: params.unconfiguredScore } : {}
	};
	if (params.includeStatusLine || params.resolveExtraStatusLines) status.resolveStatusLines = async ({ cfg, accountId, configured }) => {
		const lines = params.includeStatusLine ? [`${params.channelLabel}: ${configured ? params.configuredLabel : params.unconfiguredLabel}`] : [];
		const extraLines = await params.resolveExtraStatusLines?.({
			cfg,
			accountId,
			configured
		}) ?? [];
		return [...lines, ...extraLines];
	};
	return status;
}
function resolveSetupAccountId(params) {
	return params.accountId?.trim() ? normalizeAccountId(params.accountId) : params.defaultAccountId;
}
async function resolveAccountIdForConfigure(params) {
	const override = params.accountOverride?.trim();
	let accountId = override ? normalizeAccountId(override) : params.defaultAccountId;
	if (params.shouldPromptAccountIds && !override) accountId = await promptAccountId({
		cfg: params.cfg,
		prompter: params.prompter,
		label: params.label,
		currentId: accountId,
		listAccountIds: params.listAccountIds,
		defaultAccountId: params.defaultAccountId
	});
	return accountId;
}
function setAccountAllowFromForChannel(params) {
	const { cfg, channel, accountId, allowFrom } = params;
	return patchConfigForScopedAccount({
		cfg,
		channel,
		accountId,
		patch: { allowFrom },
		setupSurface: params.setupSurface,
		ensureEnabled: false
	});
}
function patchTopLevelChannelConfigSection(params) {
	const channelConfig = { ...params.cfg.channels?.[params.channel] };
	for (const field of params.clearFields ?? []) delete channelConfig[field];
	return writeChannelSection(params.cfg, params.channel, {
		...channelConfig,
		...params.enabled ? { enabled: true } : {},
		...params.patch
	});
}
function setTopLevelChannelDmPolicyWithAllowFrom(params) {
	const channelConfig = params.cfg.channels?.[params.channel] ?? {};
	const existingAllowFrom = params.getAllowFrom?.(params.cfg) ?? channelConfig.allowFrom ?? void 0;
	const allowFrom = params.dmPolicy === "open" ? addWildcardAllowFrom(existingAllowFrom) : void 0;
	return patchTopLevelChannelConfigSection({
		cfg: params.cfg,
		channel: params.channel,
		patch: {
			dmPolicy: params.dmPolicy,
			...allowFrom ? { allowFrom } : {}
		}
	});
}
function createTopLevelChannelDmPolicy(params) {
	const setPolicy = createTopLevelChannelDmPolicySetter({
		channel: params.channel,
		getAllowFrom: params.getAllowFrom
	});
	return {
		label: params.label,
		channel: params.channel,
		policyKey: params.policyKey,
		allowFromKey: params.allowFromKey,
		getCurrent: params.getCurrent,
		setPolicy,
		...params.promptAllowFrom ? { promptAllowFrom: params.promptAllowFrom } : {}
	};
}
function createTopLevelChannelDmPolicySetter(params) {
	return (cfg, dmPolicy) => setTopLevelChannelDmPolicyWithAllowFrom({
		cfg,
		channel: params.channel,
		dmPolicy,
		getAllowFrom: params.getAllowFrom
	});
}
function createTopLevelChannelAllowFromSetter(params) {
	return (cfg, allowFrom) => patchTopLevelChannelConfigSection({
		cfg,
		channel: params.channel,
		enabled: params.enabled,
		patch: { allowFrom }
	});
}
function createTopLevelChannelGroupPolicySetter(params) {
	return (cfg, groupPolicy) => patchTopLevelChannelConfigSection({
		cfg,
		channel: params.channel,
		enabled: params.enabled,
		patch: { groupPolicy }
	});
}
async function resolveGroupAllowlistWithLookupNotes(params) {
	try {
		return await params.resolve();
	} catch (error) {
		await noteChannelLookupFailure({
			prompter: params.prompter,
			label: params.label,
			error
		});
		await noteChannelLookupSummary({
			prompter: params.prompter,
			label: params.label,
			resolvedSections: [],
			unresolved: params.entries
		});
		return params.fallback;
	}
}
function createAccountScopedAllowFromSection(params) {
	return createAllowFromSection({
		...params,
		apply: ({ cfg, accountId, allowFrom }) => patchChannelConfigForAccount({
			cfg,
			channel: params.channel,
			accountId,
			patch: {
				dmPolicy: "allowlist",
				allowFrom
			}
		})
	});
}
function createAccountScopedGroupAccessSection(params) {
	return {
		label: params.label,
		placeholder: params.placeholder,
		...params.helpTitle ? { helpTitle: params.helpTitle } : {},
		...params.helpLines ? { helpLines: params.helpLines } : {},
		...params.skipAllowlistEntries ? { skipAllowlistEntries: true } : {},
		currentPolicy: params.currentPolicy,
		currentEntries: params.currentEntries,
		updatePrompt: params.updatePrompt,
		setPolicy: ({ cfg, accountId, policy }) => patchChannelConfigForAccount({
			cfg,
			channel: params.channel,
			accountId,
			patch: { groupPolicy: policy }
		}),
		...params.resolveAllowlist ? { resolveAllowlist: ({ cfg, accountId, credentialValues, entries, prompter }) => resolveGroupAllowlistWithLookupNotes({
			label: params.label,
			prompter,
			entries,
			fallback: params.fallbackResolved(entries),
			resolve: async () => await params.resolveAllowlist({
				cfg,
				accountId,
				credentialValues,
				entries,
				prompter
			})
		}) } : {},
		applyAllowlist: ({ cfg, accountId, resolved }) => params.applyAllowlist({
			cfg,
			accountId,
			resolved
		})
	};
}
function setSetupChannelEnabled(cfg, channel, enabled) {
	return setTopLevelChannelEnabledInConfigSection({
		cfg,
		sectionKey: channel,
		enabled
	});
}
function patchConfigForScopedAccount(params) {
	const { cfg, channel, accountId, patch, ensureEnabled, setupSurface } = params;
	const channelConfig = cfg.channels?.[channel];
	const hasExistingAccounts = Boolean(channelConfig?.accounts && Object.keys(channelConfig.accounts).length > 0);
	const seededCfg = accountId === "default" || hasExistingAccounts ? cfg : moveSingleAccountChannelSectionToDefaultAccount({
		cfg,
		channelKey: channel,
		setupSurface
	});
	return patchScopedAccountConfig({
		cfg: seededCfg,
		channelKey: channel,
		accountKeyPolicy: setupSurface?.accountKeyPolicy,
		accountId,
		patch,
		ensureChannelEnabled: ensureEnabled,
		ensureAccountEnabled: ensureEnabled
	});
}
function patchChannelConfigForAccount(params) {
	return patchConfigForScopedAccount({
		...params,
		ensureEnabled: true
	});
}
function buildSingleChannelSecretPromptState(params) {
	return {
		accountConfigured: params.accountConfigured,
		hasConfigToken: params.hasConfigToken,
		canUseEnv: params.allowEnv && Boolean(params.envValue?.trim()) && !params.hasConfigToken
	};
}
async function runSingleChannelSecretStep(params) {
	const promptState = buildSingleChannelSecretPromptState(params);
	if (!promptState.accountConfigured && params.onMissingConfigured) await params.onMissingConfigured();
	const result = await promptSingleChannelSecretInput({
		...params,
		...promptState
	});
	if (result.action === "use-env") return {
		cfg: params.applyUseEnv ? await params.applyUseEnv(params.cfg) : params.cfg,
		action: result.action,
		resolvedValue: normalizeOptionalString(params.envValue)
	};
	if (result.action === "set") return {
		cfg: params.applySet ? await params.applySet(params.cfg, result.value, result.resolvedValue) : params.cfg,
		action: result.action,
		resolvedValue: result.resolvedValue
	};
	return {
		cfg: params.cfg,
		action: result.action
	};
}
async function promptSingleChannelSecretInput(params) {
	const selectedMode = await resolveSecretInputModeForEnvSelection({
		prompter: params.prompter,
		explicitMode: params.secretInputMode,
		copy: {
			modeMessage: `How do you want to provide this ${params.credentialLabel}?`,
			plaintextLabel: `Enter ${params.credentialLabel}`,
			plaintextHint: "Stores the credential directly in OpenClaw config",
			refLabel: "Use external secret provider",
			refHint: "Stores a reference to env or configured external secret providers"
		}
	});
	if (selectedMode === "plaintext" && params.canUseEnv) {
		if (await params.prompter.confirm({
			message: params.envPrompt,
			initialValue: true
		})) return { action: "use-env" };
	} else if (params.hasConfigToken && params.accountConfigured) {
		if (await params.prompter.confirm({
			message: params.keepPrompt,
			initialValue: true
		})) return { action: "keep" };
	}
	if (selectedMode === "plaintext") {
		const token = (await params.prompter.text({
			message: params.inputPrompt,
			sensitive: true,
			validate: (value) => value?.trim() ? void 0 : "Required"
		})).trim();
		return token ? {
			action: "set",
			value: token,
			resolvedValue: token
		} : { action: "keep" };
	}
	const { promptSecretRefForSetup } = await loadProviderAuthInput();
	const resolved = await promptSecretRefForSetup({
		provider: params.providerHint,
		config: params.cfg,
		prompter: params.prompter,
		preferredEnvVar: params.preferredEnvVar,
		copy: {
			sourceMessage: `Where is this ${params.credentialLabel} stored?`,
			envVarPlaceholder: params.preferredEnvVar ?? "OPENCLAW_SECRET",
			envVarFormatError: "Use an env var name like \"OPENCLAW_SECRET\" (uppercase letters, numbers, underscores).",
			noProvidersMessage: "No file/exec secret providers are configured yet. Add one under secrets.providers, or select Environment variable."
		}
	});
	return {
		action: "set",
		value: resolved.ref,
		resolvedValue: resolved.resolvedValue
	};
}
async function promptParsedAllowFromForAccount(params) {
	const accountId = resolveSetupAccountId({
		accountId: params.accountId,
		defaultAccountId: params.defaultAccountId
	});
	const existing = params.getExistingAllowFrom({
		cfg: params.cfg,
		accountId
	});
	if (params.noteTitle && params.noteLines && params.noteLines.length > 0) await params.prompter.note(params.noteLines.join("\n"), params.noteTitle);
	const entry = await params.prompter.text({
		message: params.message,
		placeholder: params.placeholder,
		initialValue: existing[0] ? String(existing[0]) : void 0,
		validate: (value) => {
			const raw = normalizeOptionalString(value) ?? "";
			if (!raw) return "Required";
			return params.parseEntries(raw).error;
		}
	});
	const parsed = params.parseEntries(entry);
	const unique = params.mergeEntries?.({
		existing,
		parsed: parsed.entries
	}) ?? mergeAllowFromEntries(void 0, parsed.entries);
	return await params.applyAllowFrom({
		cfg: params.cfg,
		accountId,
		allowFrom: unique
	});
}
function createPromptParsedAllowFromForAccount(params) {
	return async ({ cfg, prompter, accountId }) => await promptParsedAllowFromForAccount({
		...params,
		cfg,
		accountId,
		defaultAccountId: typeof params.defaultAccountId === "function" ? params.defaultAccountId(cfg) : params.defaultAccountId,
		prompter
	});
}
function createTopLevelChannelParsedAllowFromPrompt(params) {
	const setAllowFrom = createTopLevelChannelAllowFromSetter({
		channel: params.channel,
		...params.enabled ? { enabled: true } : {}
	});
	return createPromptParsedAllowFromForAccount({
		...params,
		getExistingAllowFrom: ({ cfg }) => params.getExistingAllowFrom?.(cfg) ?? (cfg.channels?.[params.channel])?.allowFrom ?? [],
		applyAllowFrom: ({ cfg, allowFrom }) => setAllowFrom(cfg, allowFrom)
	});
}
function createAllowFromSection(params) {
	return {
		...params.helpTitle ? { helpTitle: params.helpTitle } : {},
		...params.helpLines ? { helpLines: params.helpLines } : {},
		...params.credentialInputKey ? { credentialInputKey: params.credentialInputKey } : {},
		message: params.message,
		placeholder: params.placeholder,
		invalidWithoutCredentialNote: params.invalidWithoutCredentialNote,
		...params.parseInputs ? { parseInputs: params.parseInputs } : {},
		parseId: params.parseId,
		resolveEntries: params.resolveEntries ?? (async ({ entries }) => entries.map((input) => {
			const id = params.parseId(input);
			return {
				input,
				resolved: Boolean(id),
				id
			};
		})),
		apply: params.apply
	};
}
async function noteChannelLookupSummary(params) {
	const lines = [];
	for (const section of params.resolvedSections) {
		if (section.values.length === 0) continue;
		lines.push(`${section.title}: ${section.values.join(", ")}`);
	}
	if (params.unresolved && params.unresolved.length > 0) lines.push(`Unresolved (kept as typed): ${params.unresolved.join(", ")}`);
	if (lines.length > 0) await params.prompter.note(lines.join("\n"), params.label);
}
async function noteChannelLookupFailure(params) {
	await params.prompter.note(`Channel lookup failed; keeping entries as typed. ${String(params.error)}`, params.label);
}
async function resolveEntriesWithOptionalToken(params) {
	const token = params.token?.trim();
	if (!token) return params.entries.map(params.buildWithoutToken);
	return await params.resolveEntries({
		token,
		entries: params.entries
	});
}
async function promptResolvedAllowFrom(params) {
	while (true) {
		const entry = await params.prompter.text({
			message: params.message,
			placeholder: params.placeholder,
			initialValue: params.existing[0] ? String(params.existing[0]) : void 0,
			validate: (value) => normalizeOptionalString(value) ? void 0 : "Required"
		});
		const parts = params.parseInputs(entry);
		if (!params.token) {
			const ids = parts.map(params.parseId).filter(Boolean);
			if (ids.length !== parts.length) {
				await params.prompter.note(params.invalidWithoutTokenNote, params.label);
				continue;
			}
			return mergeAllowFromEntries(params.existing, ids);
		}
		const results = await params.resolveEntries({
			token: params.token,
			entries: parts
		}).catch(() => null);
		if (!results) {
			await params.prompter.note("Failed to resolve usernames. Try again.", params.label);
			continue;
		}
		const unresolved = results.filter((res) => !res.resolved || !res.id);
		if (unresolved.length > 0) {
			await params.prompter.note(`Could not resolve: ${unresolved.map((res) => res.input).join(", ")}`, params.label);
			continue;
		}
		const ids = results.map((res) => res.id);
		return mergeAllowFromEntries(params.existing, ids);
	}
}
//#endregion
export { setAccountAllowFromForChannel as A, promptParsedAllowFromForAccount as C, resolveEntriesWithOptionalToken as D, resolveAccountIdForConfigure as E, setTopLevelChannelDmPolicyWithAllowFrom as M, splitSetupEntries as N, resolveSetupAccountId as O, promptAccountId as S, promptSingleChannelSecretInput as T, parseMentionOrPrefixedId as _, createAllowFromSection as a, patchChannelConfigForAccount as b, createTopLevelChannelAllowFromSetter as c, createTopLevelChannelGroupPolicySetter as d, createTopLevelChannelParsedAllowFromPrompt as f, noteChannelLookupSummary as g, noteChannelLookupFailure as h, createAccountScopedGroupAccessSection as i, setSetupChannelEnabled as j, runSingleChannelSecretStep as k, createTopLevelChannelDmPolicy as l, normalizeAllowFromEntries as m, buildSingleChannelSecretPromptState as n, createPromptParsedAllowFromForAccount as o, mergeAllowFromEntries as p, createAccountScopedAllowFromSection as r, createStandardChannelSetupStatus as s, addWildcardAllowFrom as t, createTopLevelChannelDmPolicySetter as u, parseSetupEntriesAllowingWildcard as v, promptResolvedAllowFrom as w, patchTopLevelChannelConfigSection as x, parseSetupEntriesWithParser as y };
