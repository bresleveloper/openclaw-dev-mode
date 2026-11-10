const require_token_config = require("./token-config-bEpua_Q7.cjs");
const require_resolve_allowlist = require("./resolve-allowlist-gI34MnpE.cjs");
require("../runtime-api.cjs");
const require_delegated_state = require("./delegated-state-Bv5cWuec.cjs");
const require_config_schema = require("./config-schema-CkKdphSp.cjs");
let openclaw_plugin_sdk_channel_policy = require("openclaw/plugin-sdk/channel-policy");
let openclaw_plugin_sdk_string_coerce_runtime = require("openclaw/plugin-sdk/string-coerce-runtime");
let openclaw_plugin_sdk_account_helpers = require("openclaw/plugin-sdk/account-helpers");
let openclaw_plugin_sdk_account_id = require("openclaw/plugin-sdk/account-id");
let openclaw_plugin_sdk_allow_from = require("openclaw/plugin-sdk/allow-from");
let openclaw_plugin_sdk_number_runtime = require("openclaw/plugin-sdk/number-runtime");
let openclaw_plugin_sdk_channel_config_helpers = require("openclaw/plugin-sdk/channel-config-helpers");
let openclaw_plugin_sdk_channel_setup = require("openclaw/plugin-sdk/channel-setup");
let openclaw_plugin_sdk_setup = require("openclaw/plugin-sdk/setup");
let openclaw_plugin_sdk_setup_tools = require("openclaw/plugin-sdk/setup-tools");
let openclaw_plugin_sdk_channel_dm_policy = require("openclaw/plugin-sdk/channel-dm-policy");
let openclaw_plugin_sdk_setup_runtime = require("openclaw/plugin-sdk/setup-runtime");
let openclaw_plugin_sdk_retry_runtime = require("openclaw/plugin-sdk/retry-runtime");
//#region extensions/msteams/src/accounts-mutations.ts
function splitRootIdentity(msteams) {
	const { appId, appPassword, ...root } = msteams;
	return {
		root,
		defaultAccount: {
			...msteams.enabled === false && (appId !== void 0 || appPassword !== void 0 || require_token_config.hasConfiguredMSTeamsCredentials(msteams)) ? { enabled: false } : {},
			...appId !== void 0 ? { appId } : {},
			...appPassword !== void 0 ? { appPassword } : {}
		}
	};
}
function patchMSTeamsAccountConfig(params) {
	const accountId = (0, openclaw_plugin_sdk_account_id.normalizeAccountId)(params.accountId);
	const msteams = params.cfg.channels?.msteams ?? {};
	const ensureEnabled = params.ensureEnabled ?? true;
	const scopeDefaultToAccounts = params.scopeDefaultToAccounts ?? (accountId === openclaw_plugin_sdk_account_id.DEFAULT_ACCOUNT_ID && Object.keys(msteams.accounts ?? {}).length > 0);
	if (accountId === openclaw_plugin_sdk_account_id.DEFAULT_ACCOUNT_ID && !scopeDefaultToAccounts) return {
		...params.cfg,
		channels: {
			...params.cfg.channels,
			msteams: {
				...msteams,
				...ensureEnabled ? { enabled: true } : {},
				...params.patch
			}
		}
	};
	const { root: baseMsteams, defaultAccount } = splitRootIdentity(msteams);
	const baseAccounts = ensureEnabled && msteams.enabled === false ? Object.fromEntries(Object.entries(baseMsteams.accounts ?? {}).map(([key, account]) => [key, {
		...account,
		enabled: false
	}])) : baseMsteams.accounts ?? {};
	const hasPromotedDefaultIdentity = Object.keys(defaultAccount).length > 0;
	const promotedDefaultKey = require_resolve_allowlist.resolveMSTeamsAccountEntryKey(baseAccounts, openclaw_plugin_sdk_account_id.DEFAULT_ACCOUNT_ID) ?? openclaw_plugin_sdk_account_id.DEFAULT_ACCOUNT_ID;
	const accounts = hasPromotedDefaultIdentity && accountId !== openclaw_plugin_sdk_account_id.DEFAULT_ACCOUNT_ID ? {
		...baseAccounts,
		[promotedDefaultKey]: {
			...defaultAccount,
			...baseAccounts[promotedDefaultKey]
		}
	} : baseAccounts;
	const rawAccountKey = require_resolve_allowlist.resolveMSTeamsAccountEntryKey(accounts, accountId) ?? accountId;
	const existing = accountId === openclaw_plugin_sdk_account_id.DEFAULT_ACCOUNT_ID ? {
		...defaultAccount,
		...accounts[rawAccountKey]
	} : accounts[rawAccountKey] ?? {};
	return {
		...params.cfg,
		channels: {
			...params.cfg.channels,
			msteams: {
				...baseMsteams,
				...ensureEnabled ? { enabled: true } : {},
				accounts: {
					...accounts,
					[rawAccountKey]: {
						...existing,
						...ensureEnabled ? { enabled: true } : {},
						...params.patch
					}
				}
			}
		}
	};
}
//#endregion
//#region extensions/msteams/src/channel-config.ts
const msteamsMeta = {
	id: "msteams",
	label: "Microsoft Teams",
	selectionLabel: "Microsoft Teams (Bot Framework)",
	docsPath: "/channels/msteams",
	docsLabel: "msteams",
	blurb: "Teams SDK; enterprise support.",
	aliases: ["teams"],
	order: 60
};
function resolveMSTeamsSecurityWarningAccount(params) {
	const accountId = (0, openclaw_plugin_sdk_account_id.normalizeAccountId)(params.accountId ?? require_resolve_allowlist.resolveDefaultMSTeamsAccountId(params.cfg));
	return {
		accountId,
		config: require_resolve_allowlist.resolveMSTeamsAccountConfig(params.cfg, accountId)
	};
}
const collectMSTeamsSecurityWarnings = (0, openclaw_plugin_sdk_channel_policy.createAllowlistProviderGroupPolicyWarningCollector)({
	providerConfigPresent: (cfg) => cfg.channels?.msteams !== void 0,
	resolveGroupPolicy: (params) => resolveMSTeamsSecurityWarningAccount(params).config.groupPolicy,
	collect: ({ cfg, accountId, groupPolicy }) => {
		if (groupPolicy !== "open") return [];
		const account = resolveMSTeamsSecurityWarningAccount({
			cfg,
			accountId
		});
		const accounts = cfg.channels?.msteams?.accounts;
		const rawAccountKey = accounts ? Object.keys(accounts).find((key) => (0, openclaw_plugin_sdk_account_id.normalizeAccountId)(key) === account.accountId) : void 0;
		const hasAccountPolicyOverride = rawAccountKey !== void 0 && accounts?.[rawAccountKey]?.groupPolicy !== void 0;
		const configPath = account.accountId === openclaw_plugin_sdk_account_id.DEFAULT_ACCOUNT_ID && !hasAccountPolicyOverride ? "channels.msteams" : `channels.msteams.accounts.${rawAccountKey ?? account.accountId}`;
		return [`- ${configPath === "channels.msteams" ? "MS Teams" : `MS Teams[${account.accountId}]`} groups: groupPolicy="open" allows any member to trigger (mention-gated). Set ${configPath}.groupPolicy="allowlist" + ${configPath}.groupAllowFrom to restrict senders.`];
	}
});
function deleteMSTeamsDefaultAccountIdentity(cfg) {
	const { appId: _appId, appPassword: _appPassword, accounts, defaultAccount, ...rest } = cfg.channels?.msteams ?? {};
	const defaultKey = require_resolve_allowlist.resolveMSTeamsAccountEntryKey(accounts, openclaw_plugin_sdk_account_id.DEFAULT_ACCOUNT_ID) ?? openclaw_plugin_sdk_account_id.DEFAULT_ACCOUNT_ID;
	const nextAccounts = {
		...accounts,
		[defaultKey]: { enabled: false }
	};
	return {
		...cfg,
		channels: {
			...cfg.channels,
			msteams: {
				...rest,
				...defaultAccount && (0, openclaw_plugin_sdk_account_id.normalizeAccountId)(defaultAccount) !== openclaw_plugin_sdk_account_id.DEFAULT_ACCOUNT_ID ? { defaultAccount } : {},
				accounts: nextAccounts
			}
		}
	};
}
const msteamsBaseConfigAdapter = (0, openclaw_plugin_sdk_channel_config_helpers.createHybridChannelConfigAdapter)({
	sectionKey: "msteams",
	listAccountIds: require_resolve_allowlist.listMSTeamsAccountIds,
	resolveAccount: (0, openclaw_plugin_sdk_channel_config_helpers.adaptScopedAccountAccessor)(require_resolve_allowlist.resolveMSTeamsAccount),
	resolveAccessorAccount: ({ cfg, accountId }) => require_resolve_allowlist.resolveMSTeamsAccountConfig(cfg, accountId),
	inspectAccount: (0, openclaw_plugin_sdk_channel_config_helpers.adaptScopedAccountAccessor)(require_resolve_allowlist.inspectMSTeamsAccount),
	defaultAccountId: require_resolve_allowlist.resolveDefaultMSTeamsAccountId,
	clearBaseFields: ["appId", "appPassword"],
	preserveSectionOnDefaultDelete: true,
	resolveAllowFrom: (account) => account.allowFrom,
	formatAllowFrom: (allowFrom) => (0, openclaw_plugin_sdk_allow_from.formatAllowFromLowercase)({ allowFrom }),
	resolveDefaultTo: (account) => account.defaultTo
});
function deleteExplicitMSTeamsAccount(params) {
	const channel = params.cfg.channels?.msteams;
	const accounts = channel?.accounts;
	const rawKey = require_resolve_allowlist.resolveMSTeamsAccountEntryKey(accounts, (0, openclaw_plugin_sdk_account_id.normalizeAccountId)(params.accountId));
	if (!channel || !accounts || !rawKey) return;
	const nextAccounts = { ...accounts };
	delete nextAccounts[rawKey];
	const deletedDefault = (0, openclaw_plugin_sdk_account_id.normalizeAccountId)(channel.defaultAccount) === (0, openclaw_plugin_sdk_account_id.normalizeAccountId)(rawKey);
	return {
		...params.cfg,
		channels: {
			...params.cfg.channels,
			msteams: {
				...channel,
				accounts: Object.keys(nextAccounts).length > 0 ? nextAccounts : void 0,
				defaultAccount: deletedDefault ? void 0 : channel.defaultAccount
			}
		}
	};
}
const msteamsConfigAdapter = {
	...msteamsBaseConfigAdapter,
	setAccountEnabled: (params) => patchMSTeamsAccountConfig({
		cfg: params.cfg,
		accountId: params.accountId,
		patch: { enabled: params.enabled },
		ensureEnabled: params.enabled && params.cfg.channels?.msteams?.enabled === false && require_resolve_allowlist.listMSTeamsAccountIds(params.cfg).length === 1,
		scopeDefaultToAccounts: true
	}),
	deleteAccount: (params) => (0, openclaw_plugin_sdk_account_id.normalizeAccountId)(params.accountId) === openclaw_plugin_sdk_account_id.DEFAULT_ACCOUNT_ID ? deleteMSTeamsDefaultAccountIdentity(params.cfg) : deleteExplicitMSTeamsAccount({
		cfg: params.cfg,
		accountId: params.accountId
	}) ?? msteamsBaseConfigAdapter.deleteAccount(params)
};
//#endregion
//#region extensions/msteams/src/setup-core.ts
const t$1 = (0, openclaw_plugin_sdk_setup.createSetupTranslator)();
const channel$1 = "msteams";
function applySecretAuthCredentials(patch, existing) {
	return {
		...patch,
		authType: "secret",
		...existing.certificatePath !== void 0 ? { certificatePath: void 0 } : {},
		...existing.certificateThumbprint !== void 0 ? { certificateThumbprint: void 0 } : {},
		...existing.useManagedIdentity !== void 0 ? { useManagedIdentity: void 0 } : {},
		...existing.managedIdentityClientId !== void 0 ? { managedIdentityClientId: void 0 } : {}
	};
}
function resolveSetupAccountId(cfg, accountId) {
	return (0, openclaw_plugin_sdk_setup.normalizeAccountId)(accountId ?? require_resolve_allowlist.resolveDefaultMSTeamsAccountId(cfg));
}
function resolveRawMSTeamsAccountConfig(cfg, accountId) {
	const normalized = (0, openclaw_plugin_sdk_setup.normalizeAccountId)(accountId);
	const msteams = cfg.channels?.msteams ?? {};
	if (normalized === openclaw_plugin_sdk_setup.DEFAULT_ACCOUNT_ID) {
		const rawAccountKey = require_resolve_allowlist.resolveMSTeamsAccountEntryKey(msteams.accounts, normalized);
		return (rawAccountKey ? msteams.accounts?.[rawAccountKey] : void 0) ?? msteams;
	}
	const rawAccountKey = require_resolve_allowlist.resolveMSTeamsAccountEntryKey(msteams.accounts, normalized);
	return (rawAccountKey ? msteams.accounts?.[rawAccountKey] : void 0) ?? {};
}
function resolveCredentialsForSetup(cfg, accountId) {
	return require_token_config.resolveMSTeamsCredentials(require_resolve_allowlist.resolveMSTeamsAccountConfig(cfg, accountId), {
		allowEnvFallback: accountId === openclaw_plugin_sdk_setup.DEFAULT_ACCOUNT_ID,
		pathPrefix: require_resolve_allowlist.resolveMSTeamsAccountConfigPath(cfg, accountId)
	});
}
function resolveEnvironmentCredentialsForSetup() {
	return require_token_config.resolveMSTeamsCredentials(void 0, { allowEnvFallback: true });
}
const MSTEAMS_SHARED_CREDENTIAL_FIELDS = [
	"tenantId",
	"authType",
	"certificatePath",
	"certificateThumbprint",
	"useManagedIdentity",
	"managedIdentityClientId"
];
const MSTEAMS_CREDENTIAL_FIELDS = [
	"appId",
	"appPassword",
	...MSTEAMS_SHARED_CREDENTIAL_FIELDS
];
function removeMSTeamsCredentialFields(config) {
	const next = { ...config };
	for (const field of MSTEAMS_CREDENTIAL_FIELDS) delete next[field];
	return next;
}
function selectMSTeamsEnvironmentCredentials(cfg) {
	const scoped = patchMSTeamsAccountConfig({
		cfg,
		accountId: openclaw_plugin_sdk_setup.DEFAULT_ACCOUNT_ID,
		patch: {},
		scopeDefaultToAccounts: true
	});
	const msteams = scoped.channels?.msteams ?? {};
	const accounts = Object.fromEntries(Object.entries(msteams.accounts ?? {}).map(([key, account]) => {
		const current = account ?? {};
		if ((0, openclaw_plugin_sdk_setup.normalizeAccountId)(key) === openclaw_plugin_sdk_setup.DEFAULT_ACCOUNT_ID) return [key, removeMSTeamsCredentialFields(current)];
		return [key, {
			...Object.fromEntries(MSTEAMS_SHARED_CREDENTIAL_FIELDS.flatMap((field) => current[field] === void 0 && msteams[field] !== void 0 ? [[field, msteams[field]]] : [])),
			...current
		}];
	}));
	return {
		...scoped,
		channels: {
			...scoped.channels,
			msteams: {
				...removeMSTeamsCredentialFields(msteams),
				accounts
			}
		}
	};
}
function hasConfiguredCredentialsForSetup(cfg, accountId, input) {
	const resolved = require_resolve_allowlist.resolveMSTeamsAccountConfig(cfg, accountId);
	const appId = input?.appId?.trim();
	const appPassword = input?.appPassword?.trim();
	const tenantId = input?.tenantId?.trim();
	const replacesWithSecretAuth = Boolean(appId && appPassword && (tenantId || resolved.tenantId?.trim()));
	return require_token_config.hasConfiguredMSTeamsCredentials({
		...resolved,
		...appId ? { appId } : {},
		...appPassword ? { appPassword } : {},
		...tenantId ? { tenantId } : {},
		...replacesWithSecretAuth ? { authType: "secret" } : {}
	}, { allowEnvFallback: accountId === openclaw_plugin_sdk_setup.DEFAULT_ACCOUNT_ID });
}
const msteamsSetupAdapter = {
	configPromotion: "preserve-root",
	resolveAccountId: ({ cfg, accountId }) => resolveSetupAccountId(cfg, accountId),
	applyAccountName: ({ cfg, accountId, name }) => {
		const trimmed = name?.trim();
		return trimmed ? patchMSTeamsAccountConfig({
			cfg,
			accountId: resolveSetupAccountId(cfg, accountId),
			patch: { name: trimmed },
			scopeDefaultToAccounts: true
		}) : cfg;
	},
	validateInput: ({ cfg, accountId, input }) => {
		const resolvedAccountId = resolveSetupAccountId(cfg, accountId);
		const appId = input.appId;
		const appPassword = input.appPassword;
		const tenantId = input.tenantId;
		const hasAnyExplicitCredential = Boolean(appId || appPassword || tenantId);
		const hasCompleteExplicitCredentials = Boolean(appId?.trim() && appPassword?.trim() && tenantId?.trim());
		if (input.useEnv && resolvedAccountId !== openclaw_plugin_sdk_setup.DEFAULT_ACCOUNT_ID) return "MSTEAMS_* environment variables can only be used for the default account.";
		if (input.useEnv && hasAnyExplicitCredential && !hasCompleteExplicitCredentials) return "MS Teams requires appId, appPassword, and tenantId when replacing environment credentials.";
		if (input.useEnv && !hasCompleteExplicitCredentials && !resolveEnvironmentCredentialsForSetup()) return "MS Teams --use-env requires complete secret, certificate, or managed-identity environment credentials.";
		if (!input.useEnv && !hasCompleteExplicitCredentials && !hasConfiguredCredentialsForSetup(cfg, resolvedAccountId, input)) return "MS Teams requires appId, appPassword, and tenantId (or --use-env for the default account).";
		if (input.webhookPath !== void 0 && !input.webhookPath.trim().startsWith("/")) return "MS Teams webhook path must start with /.";
		return null;
	},
	applyAccountConfig: ({ cfg, accountId, input }) => {
		const resolvedAccountId = resolveSetupAccountId(cfg, accountId);
		const appId = input.appId;
		const appPassword = input.appPassword;
		const tenantId = input.tenantId;
		const existing = resolveRawMSTeamsAccountConfig(cfg, resolvedAccountId);
		const patch = {};
		if (appId?.trim()) patch.appId = appId.trim();
		if (appPassword?.trim()) patch.appPassword = appPassword.trim();
		if (tenantId?.trim()) patch.tenantId = tenantId.trim();
		if (input.webhookPath !== void 0) patch.webhook = {
			...existing.webhook,
			path: input.webhookPath.trim()
		};
		const inheritedTenantId = require_resolve_allowlist.resolveMSTeamsAccountConfig(cfg, resolvedAccountId).tenantId?.trim();
		const replacesWithSecretAuth = Boolean(appId?.trim() && appPassword?.trim() && (tenantId?.trim() || inheritedTenantId));
		const credentialPatch = replacesWithSecretAuth ? applySecretAuthCredentials(patch, existing) : patch;
		return patchMSTeamsAccountConfig({
			cfg: input.useEnv && !replacesWithSecretAuth ? selectMSTeamsEnvironmentCredentials(cfg) : cfg,
			accountId: resolvedAccountId,
			patch: credentialPatch,
			scopeDefaultToAccounts: true
		});
	}
};
const msteamsSetupContract = (0, openclaw_plugin_sdk_channel_setup.defineChannelSetupContract)({
	fields: {
		appId: {
			kind: "string",
			cli: {
				flags: "--app-id <id>",
				description: "Microsoft Teams application id"
			}
		},
		appPassword: {
			kind: "string",
			sensitive: true,
			cli: {
				flags: "--app-password <secret>",
				description: "Microsoft Teams app password"
			}
		},
		tenantId: {
			kind: "string",
			cli: {
				flags: "--tenant-id <id>",
				description: "Microsoft Teams tenant id"
			}
		},
		webhookPath: {
			kind: "string",
			cli: {
				flags: "--webhook-path <path>",
				description: "Microsoft Teams webhook path"
			}
		},
		useEnv: {
			kind: "boolean",
			cli: {
				flags: "--use-env",
				description: "Use Microsoft Teams environment credentials"
			},
			envVars: [
				"MSTEAMS_APP_ID",
				"MSTEAMS_APP_PASSWORD",
				"MSTEAMS_TENANT_ID",
				"MSTEAMS_AUTH_TYPE",
				"MSTEAMS_CERTIFICATE_PATH",
				"MSTEAMS_USE_MANAGED_IDENTITY"
			],
			envVarMode: "any"
		}
	},
	adapter: msteamsSetupAdapter
});
async function promptMSTeamsCredentials(prompter) {
	const promptRequired = async (message) => (await prompter.text({
		message,
		validate: (value) => value?.trim() ? void 0 : t$1("common.required")
	})).trim();
	return {
		appId: await promptRequired(t$1("wizard.msteams.appIdPrompt")),
		appPassword: await promptRequired(t$1("wizard.msteams.appPasswordPrompt")),
		tenantId: await promptRequired(t$1("wizard.msteams.tenantIdPrompt"))
	};
}
async function noteMSTeamsCredentialHelp(prompter) {
	await prompter.note([
		t$1("wizard.msteams.helpAzureBot"),
		t$1("wizard.msteams.helpClientSecret"),
		t$1("wizard.msteams.helpWebhook"),
		t$1("wizard.msteams.helpEnvTip"),
		t$1("wizard.channels.docs", { link: (0, openclaw_plugin_sdk_setup_tools.formatDocsLink)("/channels/msteams", "msteams") })
	].join("\n"), t$1("wizard.msteams.credentialsTitle"));
}
function createMSTeamsSetupWizardBase() {
	return {
		channel: channel$1,
		resolveAccountIdForConfigure: ({ cfg, accountOverride, defaultAccountId }) => resolveSetupAccountId(cfg, accountOverride ?? defaultAccountId),
		resolveShouldPromptAccountIds: ({ shouldPromptAccountIds }) => shouldPromptAccountIds,
		status: (0, openclaw_plugin_sdk_setup.createStandardChannelSetupStatus)({
			channelLabel: "MS Teams",
			configuredLabel: t$1("wizard.channels.statusConfigured"),
			unconfiguredLabel: t$1("wizard.channels.statusNeedsAppCredentials"),
			configuredHint: t$1("wizard.channels.statusConfigured"),
			unconfiguredHint: t$1("wizard.channels.statusNeedsAppCreds"),
			configuredScore: 2,
			unconfiguredScore: 0,
			includeStatusLine: true,
			resolveConfigured: ({ cfg, accountId }) => {
				const resolvedAccountId = resolveSetupAccountId(cfg, accountId);
				return Boolean(resolveCredentialsForSetup(cfg, resolvedAccountId)) || hasConfiguredCredentialsForSetup(cfg, resolvedAccountId);
			}
		}),
		credentials: [],
		finalize: async ({ cfg, accountId, prompter }) => {
			const resolvedAccountId = resolveSetupAccountId(cfg, accountId);
			const resolved = resolveCredentialsForSetup(cfg, resolvedAccountId);
			const hasConfigCreds = require_token_config.hasConfiguredMSTeamsCredentials(require_resolve_allowlist.resolveMSTeamsAccountConfig(cfg, resolvedAccountId), { allowEnvFallback: false });
			const canUseEnv = Boolean(resolvedAccountId === openclaw_plugin_sdk_setup.DEFAULT_ACCOUNT_ID && !hasConfigCreds && resolveEnvironmentCredentialsForSetup());
			let next = cfg;
			if (!resolved && !hasConfigCreds) await noteMSTeamsCredentialHelp(prompter);
			const keep = (canUseEnv || hasConfigCreds) && await prompter.confirm({
				message: t$1(canUseEnv ? "wizard.msteams.envPrompt" : "wizard.msteams.credentialsKeep"),
				initialValue: true
			});
			next = msteamsSetupAdapter.applyAccountConfig({
				cfg: next,
				accountId: resolvedAccountId,
				input: keep ? { useEnv: canUseEnv } : await promptMSTeamsCredentials(prompter)
			});
			return {
				cfg: next,
				accountId: resolvedAccountId
			};
		}
	};
}
//#endregion
//#region extensions/msteams/src/errors.ts
const MAX_SAFE_RETRY_AFTER_SECONDS = Number.MAX_SAFE_INTEGER / 1e3;
function formatUnknownError(err) {
	if (err instanceof Error) return err.message;
	if (typeof err === "symbol") return err.description ?? err.toString();
	if (typeof err === "function") return err.name ? `[function ${err.name}]` : "[function]";
	if (err === null || typeof err !== "object") return String(err);
	try {
		return JSON.stringify(err) ?? "unknown error";
	} catch {
		return "unknown error";
	}
}
function extractStatusCode(err) {
	if (!(0, openclaw_plugin_sdk_string_coerce_runtime.isRecord)(err)) return null;
	const parseStatusCode = (value) => {
		if (typeof value === "number") return Number.isInteger(value) && value >= 100 && value <= 599 ? value : null;
		if (typeof value === "string") {
			const trimmed = value.trim();
			if (!/^\d{3}$/.test(trimmed)) return null;
			const parsed = Number(trimmed);
			return parsed >= 100 && parsed <= 599 ? parsed : null;
		}
		return null;
	};
	const directStatus = parseStatusCode(err.statusCode ?? err.status);
	if (directStatus !== null) return directStatus;
	const response = err.response;
	if ((0, openclaw_plugin_sdk_string_coerce_runtime.isRecord)(response)) {
		const responseStatus = parseStatusCode(response.status);
		if (responseStatus !== null) return responseStatus;
	}
	return null;
}
function extractErrorCode(err) {
	if (!(0, openclaw_plugin_sdk_string_coerce_runtime.isRecord)(err)) return null;
	const direct = err.code;
	if (typeof direct === "string" && direct.trim()) return direct;
	const response = err.response;
	if (!(0, openclaw_plugin_sdk_string_coerce_runtime.isRecord)(response)) return null;
	const body = response.body;
	if ((0, openclaw_plugin_sdk_string_coerce_runtime.isRecord)(body)) {
		const error = body.error;
		if ((0, openclaw_plugin_sdk_string_coerce_runtime.isRecord)(error) && typeof error.code === "string" && error.code.trim()) return error.code;
	}
	return null;
}
function extractRetryAfterMs(err) {
	if (!(0, openclaw_plugin_sdk_string_coerce_runtime.isRecord)(err)) return null;
	const direct = err.retryAfterMs ?? err.retry_after_ms;
	const directMs = (0, openclaw_plugin_sdk_number_runtime.asFiniteNumberInRange)(direct, {
		min: 0,
		max: Number.MAX_SAFE_INTEGER
	});
	if (directMs !== void 0) return directMs;
	const retryAfter = err.retryAfter ?? err.retry_after;
	const retryAfterSeconds = (0, openclaw_plugin_sdk_number_runtime.asFiniteNumberInRange)(retryAfter, {
		min: 0,
		max: MAX_SAFE_RETRY_AFTER_SECONDS
	});
	if (retryAfterSeconds !== void 0) return retryAfterSeconds * 1e3;
	if (typeof retryAfter === "string") {
		const parsed = parseNonNegativeRetryAfterSeconds(retryAfter);
		if (parsed !== void 0) return parsed * 1e3;
	}
	const response = err.response;
	if (!(0, openclaw_plugin_sdk_string_coerce_runtime.isRecord)(response)) return null;
	const headers = response.headers;
	if (!headers) return null;
	if ((0, openclaw_plugin_sdk_string_coerce_runtime.isRecord)(headers)) {
		const raw = headers["retry-after"] ?? headers["Retry-After"];
		if (typeof raw === "string") {
			const parsed = (0, openclaw_plugin_sdk_retry_runtime.parseRetryAfterHeaderSeconds)(raw);
			if (parsed !== void 0) return parsed * 1e3;
		}
	}
	if (typeof headers === "object" && headers !== null && "get" in headers && typeof headers.get === "function") {
		const raw = headers.get("retry-after");
		if (raw) {
			const parsed = (0, openclaw_plugin_sdk_retry_runtime.parseRetryAfterHeaderSeconds)(raw);
			if (parsed !== void 0) return parsed * 1e3;
		}
	}
	return null;
}
function parseNonNegativeRetryAfterSeconds(raw) {
	const trimmed = raw.trim();
	if (!/^\d+(?:\.\d+)?$/.test(trimmed)) return;
	return (0, openclaw_plugin_sdk_number_runtime.asFiniteNumberInRange)((0, openclaw_plugin_sdk_number_runtime.parseStrictFiniteNumber)(trimmed), {
		min: 0,
		max: MAX_SAFE_RETRY_AFTER_SECONDS
	});
}
/**
* Owns retry safety and delivery ambiguity for Teams send failures.
* Only Teams rate-limit rejection proves this unkeyed POST safe to replay.
*/
function classifyMSTeamsSendError(err) {
	const statusCode = extractStatusCode(err);
	const retryAfterMs = extractRetryAfterMs(err);
	const errorCode = extractErrorCode(err) ?? void 0;
	if (statusCode === 401) return {
		kind: "auth",
		statusCode,
		errorCode
	};
	if (statusCode === 403) {
		if (errorCode === "ContentStreamNotAllowed") return {
			kind: "permanent",
			statusCode,
			errorCode
		};
		return {
			kind: "auth",
			statusCode,
			errorCode
		};
	}
	if (statusCode === 429) return {
		kind: "replay-safe",
		statusCode,
		retryAfterMs: retryAfterMs ?? void 0,
		errorCode
	};
	if (statusCode === 408 || statusCode != null && statusCode >= 500) return {
		kind: "ambiguous",
		source: "http",
		statusCode,
		errorCode
	};
	if (statusCode != null && statusCode >= 400) return {
		kind: "permanent",
		statusCode,
		errorCode
	};
	if (statusCode == null && (0, openclaw_plugin_sdk_retry_runtime.isTransientNetworkError)(err)) return {
		kind: "ambiguous",
		source: "transport",
		errorCode
	};
	return {
		kind: "unknown",
		statusCode: statusCode ?? void 0,
		errorCode
	};
}
/**
* Detect whether an error is caused by a revoked Proxy.
*
* The Bot Framework SDK wraps TurnContext in a Proxy that is revoked once the
* turn handler returns.  Any later access (e.g. from a debounced callback)
* throws a TypeError whose message contains the distinctive "proxy that has
* been revoked" string.
*/
function isRevokedProxyError(err) {
	if (!(err instanceof TypeError)) return false;
	return /proxy that has been revoked/i.test(err.message);
}
function formatMSTeamsSendErrorHint(classification) {
	if (classification.kind === "auth") return "check msteams appId/appPassword/tenantId (or env vars MSTEAMS_APP_ID/MSTEAMS_APP_PASSWORD/MSTEAMS_TENANT_ID)";
	if (classification.errorCode === "ContentStreamNotAllowed") return "Teams expired the content stream; stop streaming earlier and fall back to normal message delivery";
	if (classification.kind === "replay-safe") return "Teams throttled the bot; backing off may help";
	if (classification.kind === "ambiguous") {
		if (classification.source === "transport") return "transport-level failure sending to Teams Bot Connector (smba.trafficmanager.net); the outcome is unknown, so check egress and conversation history before taking further action";
		return "Teams/Bot Framework delivery outcome is unknown; inspect the conversation history before taking further action";
	}
}
function formatMSTeamsDeliveryFailureGuidance(classification) {
	if (classification.kind === "replay-safe") return "The request was rate-limited before delivery; retrying later may succeed.";
	if (classification.kind === "ambiguous") return "Delivery may already have succeeded; do not send the same content again without checking the conversation.";
}
//#endregion
//#region extensions/msteams/src/setup-surface.ts
const t = (0, openclaw_plugin_sdk_setup.createSetupTranslator)();
const channel = "msteams";
function openDelegatedOAuthUrl(url) {
	return Promise.reject(/* @__PURE__ */ new Error(`Automatic browser launch is not available. Open this URL manually: ${url}`));
}
function looksLikeGuid(value) {
	return /^[0-9a-fA-F-]{16,}$/.test(value);
}
async function promptMSTeamsAllowFrom(params) {
	const accountId = (0, openclaw_plugin_sdk_account_id.normalizeAccountId)(params.accountId ?? require_resolve_allowlist.resolveDefaultMSTeamsAccountId(params.cfg));
	const existing = require_resolve_allowlist.resolveMSTeamsAccountConfig(params.cfg, accountId).allowFrom ?? [];
	await params.prompter.note([
		t("wizard.msteams.allowlistIntro"),
		t("wizard.msteams.allowlistResolve"),
		t("wizard.msteams.examples"),
		"- alex@example.com",
		"- Alex Johnson",
		"- 00000000-0000-0000-0000-000000000000"
	].join("\n"), t("wizard.msteams.allowlistTitle"));
	while (true) {
		const entry = await params.prompter.text({
			message: t("wizard.msteams.allowFromPrompt"),
			placeholder: "alex@example.com, Alex Johnson",
			initialValue: existing[0] ? existing[0] : void 0,
			validate: (value) => value.trim() ? void 0 : t("common.required")
		});
		const parts = (0, openclaw_plugin_sdk_setup.splitSetupEntries)(entry);
		if (parts.length === 0) {
			await params.prompter.note(t("wizard.msteams.enterAtLeastOneUser"), t("wizard.msteams.allowlistTitle"));
			continue;
		}
		const resolved = await require_resolve_allowlist.resolveMSTeamsUserAllowlist({
			cfg: params.cfg,
			accountId,
			entries: parts
		}).catch(() => null);
		let ids;
		if (!resolved) {
			ids = parts.filter((part) => looksLikeGuid(part));
			if (ids.length !== parts.length) {
				await params.prompter.note(t("wizard.msteams.graphLookupUnavailable"), t("wizard.msteams.allowlistTitle"));
				continue;
			}
		} else {
			const unresolved = resolved.filter((item) => !item.resolved || !item.id);
			if (unresolved.length > 0) {
				await params.prompter.note(t("wizard.msteams.couldNotResolve", { entries: unresolved.map((item) => item.input).join(", ") }), t("wizard.msteams.allowlistTitle"));
				continue;
			}
			ids = resolved.flatMap((item) => item.id ? [item.id] : []);
		}
		const unique = (0, openclaw_plugin_sdk_setup.mergeAllowFromEntries)(existing, ids);
		return patchMSTeamsAccountConfig({
			cfg: params.cfg,
			accountId,
			patch: {
				dmPolicy: "allowlist",
				allowFrom: unique
			},
			scopeDefaultToAccounts: shouldScopeMSTeamsDefaultToAccounts(params.cfg, accountId)
		});
	}
}
function shouldScopeMSTeamsDefaultToAccounts(cfg, accountId) {
	if ((0, openclaw_plugin_sdk_account_id.normalizeAccountId)(accountId) !== openclaw_plugin_sdk_account_id.DEFAULT_ACCOUNT_ID) return false;
	return Object.keys(cfg.channels?.msteams?.accounts ?? {}).length > 0;
}
function setMSTeamsTeamsAllowlist(cfg, accountId, entries) {
	const teams = { ...require_resolve_allowlist.resolveMSTeamsAccountConfig(cfg, accountId).teams ?? {} };
	for (const entry of entries) {
		const teamKey = entry.teamKey;
		if (!teamKey) continue;
		const existing = teams[teamKey] ?? {};
		if (entry.channelKey) {
			const channels = { ...existing.channels };
			channels[entry.channelKey] = channels[entry.channelKey] ?? {};
			teams[teamKey] = {
				...existing,
				channels
			};
		} else teams[teamKey] = existing;
	}
	return patchMSTeamsAccountConfig({
		cfg,
		accountId,
		patch: { teams },
		scopeDefaultToAccounts: shouldScopeMSTeamsDefaultToAccounts(cfg, accountId)
	});
}
function listMSTeamsGroupEntries(cfg, accountId) {
	return Object.entries(require_resolve_allowlist.resolveMSTeamsAccountConfig(cfg, accountId).teams ?? {}).flatMap(([teamKey, value]) => {
		const channels = value?.channels ?? {};
		const channelKeys = Object.keys(channels);
		if (channelKeys.length === 0) return [teamKey];
		return channelKeys.map((channelKey) => `${teamKey}/${channelKey}`);
	});
}
async function resolveMSTeamsGroupAllowlist(params) {
	let resolvedEntries = params.entries.map((entry) => require_resolve_allowlist.parseMSTeamsTeamEntry(entry)).filter((entry) => entry !== null);
	if (params.entries.length === 0 || !require_token_config.resolveMSTeamsCredentials(require_resolve_allowlist.resolveMSTeamsAccountConfig(params.cfg, params.accountId), {
		allowEnvFallback: params.accountId === "default",
		pathPrefix: require_resolve_allowlist.resolveMSTeamsAccountConfigPath(params.cfg, params.accountId)
	})) return resolvedEntries;
	try {
		const lookups = await require_resolve_allowlist.resolveMSTeamsChannelAllowlist({
			cfg: params.cfg,
			accountId: params.accountId,
			entries: params.entries
		});
		const resolvedChannels = lookups.filter((entry) => entry.resolved && entry.teamId && entry.channelId);
		const resolvedTeams = lookups.filter((entry) => entry.resolved && entry.teamId && !entry.channelId);
		const unresolved = lookups.filter((entry) => !entry.resolved).map((entry) => entry.input);
		resolvedEntries = [
			...resolvedChannels.flatMap((entry) => entry.teamId && entry.channelId ? [{
				teamKey: entry.teamId,
				channelKey: entry.channelId
			}] : []),
			...resolvedTeams.flatMap((entry) => entry.teamId ? [{ teamKey: entry.teamId }] : []),
			...unresolved.map((entry) => require_resolve_allowlist.parseMSTeamsTeamEntry(entry)).filter((entry) => entry !== null)
		];
		const summary = [];
		if (resolvedChannels.length > 0) summary.push(t("wizard.msteams.resolvedChannels", { entries: resolvedChannels.map((entry) => entry.channelId).filter(Boolean).join(", ") }));
		if (resolvedTeams.length > 0) summary.push(t("wizard.msteams.resolvedTeams", { entries: resolvedTeams.map((entry) => entry.teamId).filter(Boolean).join(", ") }));
		if (unresolved.length > 0) summary.push(t("wizard.msteams.unresolvedKept", { entries: unresolved.join(", ") }));
		if (summary.length > 0) await params.prompter.note(summary.join("\n"), t("wizard.msteams.channelsLabel"));
		return resolvedEntries;
	} catch (err) {
		await params.prompter.note(t("wizard.msteams.channelLookupFailed", { error: formatUnknownError(err) }), t("wizard.msteams.channelsLabel"));
		return resolvedEntries;
	}
}
const msteamsGroupAccess = {
	...(0, openclaw_plugin_sdk_setup_runtime.createAccountScopedGroupAccessSection)({
		channel,
		label: t("wizard.msteams.channelsLabel"),
		placeholder: "Team Name/Channel Name, teamId/conversationId",
		currentPolicy: ({ cfg, accountId }) => require_resolve_allowlist.resolveMSTeamsAccountConfig(cfg, accountId).groupPolicy ?? "allowlist",
		currentEntries: ({ cfg, accountId }) => listMSTeamsGroupEntries(cfg, accountId),
		updatePrompt: ({ cfg, accountId }) => Boolean(require_resolve_allowlist.resolveMSTeamsAccountConfig(cfg, accountId).teams),
		resolveAllowlist: ({ cfg, accountId, entries, prompter }) => resolveMSTeamsGroupAllowlist({
			cfg,
			accountId,
			entries,
			prompter
		}),
		fallbackResolved: (entries) => entries.map((entry) => require_resolve_allowlist.parseMSTeamsTeamEntry(entry)).filter((entry) => entry !== null),
		applyAllowlist: ({ cfg, accountId, resolved }) => setMSTeamsTeamsAllowlist(cfg, accountId, resolved)
	}),
	setPolicy: ({ cfg, accountId, policy }) => patchMSTeamsAccountConfig({
		cfg,
		accountId,
		patch: { groupPolicy: policy },
		scopeDefaultToAccounts: shouldScopeMSTeamsDefaultToAccounts(cfg, accountId)
	})
};
const msteamsDmPolicy = (0, openclaw_plugin_sdk_channel_dm_policy.createChannelDmPolicy)({
	label: "MS Teams",
	channel,
	policyKey: "channels.msteams.dmPolicy",
	allowFromKey: "channels.msteams.allowFrom",
	resolveAccount: (cfg, accountId) => {
		const resolvedAccountId = (0, openclaw_plugin_sdk_account_id.normalizeAccountId)(accountId ?? require_resolve_allowlist.resolveDefaultMSTeamsAccountId(cfg));
		return {
			accountId: resolvedAccountId,
			config: require_resolve_allowlist.resolveMSTeamsAccountConfig(cfg, resolvedAccountId)
		};
	},
	resolveConfigKeys: ({ cfg, account }) => {
		const rawAccountKey = require_resolve_allowlist.resolveMSTeamsAccountEntryKey(cfg.channels?.msteams?.accounts, account.accountId);
		const base = account.accountId !== "default" || shouldScopeMSTeamsDefaultToAccounts(cfg, account.accountId) ? `channels.msteams.accounts.${rawAccountKey ?? account.accountId}` : "channels.msteams";
		return {
			policyKey: `${base}.dmPolicy`,
			allowFromKey: `${base}.allowFrom`
		};
	},
	applyPatch: ({ cfg, account, patch }) => patchMSTeamsAccountConfig({
		cfg,
		accountId: account.accountId,
		patch,
		scopeDefaultToAccounts: shouldScopeMSTeamsDefaultToAccounts(cfg, account.accountId)
	}),
	promptAllowFrom: promptMSTeamsAllowFrom
});
const msteamsSetupWizardBase = createMSTeamsSetupWizardBase();
const msteamsSetupWizard = {
	...msteamsSetupWizardBase,
	finalize: async (params) => {
		const baseFinalize = msteamsSetupWizardBase.finalize;
		const baseResult = baseFinalize ? await baseFinalize(params) : void 0;
		let next = baseResult?.cfg ?? params.cfg;
		const resolvedAccountId = baseResult && "accountId" in baseResult && typeof baseResult.accountId === "string" ? baseResult.accountId : params.accountId;
		const finalCreds = require_token_config.resolveMSTeamsCredentials(require_resolve_allowlist.resolveMSTeamsAccountConfig(next, resolvedAccountId), {
			allowEnvFallback: resolvedAccountId === "default",
			pathPrefix: require_resolve_allowlist.resolveMSTeamsAccountConfigPath(next, resolvedAccountId)
		});
		if (finalCreds?.type === "secret") {
			if (await params.prompter.confirm({
				message: t("wizard.msteams.delegatedAuthPrompt"),
				initialValue: false
			})) {
				next = patchMSTeamsAccountConfig({
					cfg: next,
					accountId: resolvedAccountId,
					patch: { delegatedAuth: { enabled: true } },
					scopeDefaultToAccounts: shouldScopeMSTeamsDefaultToAccounts(next, resolvedAccountId)
				});
				const noteDelegatedAuthFailure = async (err) => {
					await params.prompter.note(`Delegated auth setup failed: ${formatUnknownError(err)}\n` + t("wizard.msteams.delegatedAuthRetry"), t("wizard.msteams.delegatedAuthTitle"));
				};
				let oauthModule;
				try {
					oauthModule = await Promise.resolve().then(() => require("./oauth-BBUQCwmq.cjs"));
				} catch (err) {
					await noteDelegatedAuthFailure(err);
					return {
						...baseResult,
						cfg: next
					};
				}
				await params.options?.beforePersistentEffect?.();
				const progress = params.prompter.progress(t("wizard.msteams.delegatedOAuthProgress"));
				let tokens;
				try {
					tokens = await oauthModule.loginMSTeamsDelegated({
						log: (msg) => {
							params.prompter.note(msg);
						},
						note: (msg, title) => params.prompter.note(msg, title),
						prompt: (msg) => params.prompter.text({ message: msg }),
						progress
					}, {
						tenantId: finalCreds.tenantId,
						clientId: finalCreds.appId,
						clientSecret: finalCreds.appPassword
					});
				} catch (err) {
					progress.stop();
					await noteDelegatedAuthFailure(err);
					return {
						...baseResult,
						cfg: next
					};
				}
				try {
					await params.options?.beforePersistentEffect?.();
				} catch (err) {
					progress.stop();
					throw err;
				}
				await require_delegated_state.saveMSTeamsDelegatedTokens(tokens, resolvedAccountId);
				progress.stop(t("wizard.msteams.delegatedAuthConfigured"));
			}
		}
		return {
			...baseResult,
			cfg: next
		};
	},
	dmPolicy: msteamsDmPolicy,
	groupAccess: msteamsGroupAccess,
	disable: (cfg) => (0, openclaw_plugin_sdk_setup.setSetupChannelEnabled)(cfg, channel, false)
};
//#endregion
//#region extensions/msteams/src/channel.setup.ts
const msteamsSetupPlugin = {
	id: "msteams",
	meta: {
		...msteamsMeta,
		aliases: [...msteamsMeta.aliases]
	},
	capabilities: {
		chatTypes: [
			"direct",
			"channel",
			"group",
			"thread"
		],
		polls: true,
		threads: true,
		media: true,
		reactions: true
	},
	reload: {
		configPrefixes: ["channels.msteams"],
		noopPrefixes: ["messages.inbound"]
	},
	configSchema: require_config_schema.MSTeamsChannelConfigSchema,
	config: {
		...msteamsConfigAdapter,
		isConfigured: (account) => account.configured,
		describeAccount: (account) => (0, openclaw_plugin_sdk_account_helpers.describeAccountSnapshot)({
			account,
			configured: account.configured,
			extra: { tokenStatus: account.tokenStatus }
		})
	},
	setupWizard: msteamsSetupWizard,
	setupContract: msteamsSetupContract
};
//#endregion
Object.defineProperty(exports, "classifyMSTeamsSendError", {
	enumerable: true,
	get: function() {
		return classifyMSTeamsSendError;
	}
});
Object.defineProperty(exports, "collectMSTeamsSecurityWarnings", {
	enumerable: true,
	get: function() {
		return collectMSTeamsSecurityWarnings;
	}
});
Object.defineProperty(exports, "createMSTeamsSetupWizardBase", {
	enumerable: true,
	get: function() {
		return createMSTeamsSetupWizardBase;
	}
});
Object.defineProperty(exports, "formatMSTeamsDeliveryFailureGuidance", {
	enumerable: true,
	get: function() {
		return formatMSTeamsDeliveryFailureGuidance;
	}
});
Object.defineProperty(exports, "formatMSTeamsSendErrorHint", {
	enumerable: true,
	get: function() {
		return formatMSTeamsSendErrorHint;
	}
});
Object.defineProperty(exports, "formatUnknownError", {
	enumerable: true,
	get: function() {
		return formatUnknownError;
	}
});
Object.defineProperty(exports, "isRevokedProxyError", {
	enumerable: true,
	get: function() {
		return isRevokedProxyError;
	}
});
Object.defineProperty(exports, "msteamsConfigAdapter", {
	enumerable: true,
	get: function() {
		return msteamsConfigAdapter;
	}
});
Object.defineProperty(exports, "msteamsSetupAdapter", {
	enumerable: true,
	get: function() {
		return msteamsSetupAdapter;
	}
});
Object.defineProperty(exports, "msteamsSetupPlugin", {
	enumerable: true,
	get: function() {
		return msteamsSetupPlugin;
	}
});
Object.defineProperty(exports, "msteamsSetupWizard", {
	enumerable: true,
	get: function() {
		return msteamsSetupWizard;
	}
});
Object.defineProperty(exports, "openDelegatedOAuthUrl", {
	enumerable: true,
	get: function() {
		return openDelegatedOAuthUrl;
	}
});
