import { safeParseJsonWithSchema, safeParseWithSchema } from "openclaw/plugin-sdk/extension-shared";
import { normalizeLowercaseStringOrEmpty, normalizeOptionalString, normalizeStringifiedOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
import { createAccountListHelpers, describeAccountSnapshot } from "openclaw/plugin-sdk/account-helpers";
import { DEFAULT_ACCOUNT_ID, normalizeAccountId, resolveAccountEntry } from "openclaw/plugin-sdk/account-resolution";
import { mergePairLoopGuardConfig } from "openclaw/plugin-sdk/pair-loop-guard-runtime";
import { tryReadSecretFileSync } from "openclaw/plugin-sdk/secret-file-runtime";
import { coerceSecretRef, isSecretRef, resolveSecretInputString } from "openclaw/plugin-sdk/secret-input";
import { resolveUserPath } from "openclaw/plugin-sdk/text-utility-runtime";
import { z } from "zod";
import { formatNormalizedAllowFromEntries } from "openclaw/plugin-sdk/allow-from";
import { adaptScopedAccountAccessor, createScopedChannelConfigAdapter } from "openclaw/plugin-sdk/channel-config-helpers";
import { defineChannelSetupContract } from "openclaw/plugin-sdk/channel-setup";
import { createPatchedAccountSetupAdapter, createSetupInputPresenceValidator } from "openclaw/plugin-sdk/setup-runtime";
import { createChannelDmPolicy } from "openclaw/plugin-sdk/channel-dm-policy";
import { DEFAULT_ACCOUNT_ID as DEFAULT_ACCOUNT_ID$1, applySetupAccountConfigPatch, createPromptParsedAllowFromForAccount, createSetupTranslator, createStandardChannelSetupStatus, formatDocsLink, mergeAllowFromEntries, migrateBaseNameToDefaultAccount, splitSetupEntries } from "openclaw/plugin-sdk/setup";
//#region extensions/googlechat/src/google-auth-limits.ts
const MAX_GOOGLE_CHAT_SERVICE_ACCOUNT_FILE_BYTES = 65536;
//#endregion
//#region extensions/googlechat/src/accounts.ts
const ENV_SERVICE_ACCOUNT$1 = "GOOGLE_CHAT_SERVICE_ACCOUNT";
const ENV_SERVICE_ACCOUNT_FILE$1 = "GOOGLE_CHAT_SERVICE_ACCOUNT_FILE";
const JsonRecordSchema = z.record(z.string(), z.unknown());
const { listAccountIds: listGoogleChatAccountIds, resolveDefaultAccountId: resolveDefaultGoogleChatAccountId, resolveAccountConfig: resolveMergedGoogleChatAccountConfig } = createAccountListHelpers("googlechat", {
	implicitDefaultAccount: {
		channelKeys: ["serviceAccount", "serviceAccountFile"],
		envVars: [ENV_SERVICE_ACCOUNT$1, ENV_SERVICE_ACCOUNT_FILE$1]
	},
	omitKeys: ["defaultAccount"],
	nestedObjectKeys: ["botLoopProtection"]
});
function mergeGoogleChatAccountConfig(cfg, accountId) {
	const raw = cfg.channels?.["googlechat"] ?? {};
	const base = resolveMergedGoogleChatAccountConfig(cfg, accountId);
	const defaultAccountConfig = resolveAccountEntry(raw.accounts, DEFAULT_ACCOUNT_ID) ?? {};
	if (accountId === DEFAULT_ACCOUNT_ID) return base;
	const { enabled: _ignoredEnabled, dangerouslyAllowNameMatching: _ignoredDangerouslyAllowNameMatching, serviceAccount: _ignoredServiceAccount, serviceAccountFile: _ignoredServiceAccountFile, ...defaultAccountShared } = defaultAccountConfig;
	const botLoopProtection = mergePairLoopGuardConfig(defaultAccountShared.botLoopProtection, base.botLoopProtection);
	return {
		...defaultAccountShared,
		...base,
		...botLoopProtection ? { botLoopProtection } : {}
	};
}
function resolveGoogleChatConfigAccessorAccount(params) {
	const accountId = normalizeAccountId(params.accountId ?? params.cfg.channels?.googlechat?.defaultAccount);
	return { config: mergeGoogleChatAccountConfig(params.cfg, accountId) };
}
function parseServiceAccount(value) {
	if (isSecretRef(value)) return null;
	if (typeof value === "string") {
		const trimmed = value.trim();
		if (!trimmed) return null;
		return safeParseJsonWithSchema(JsonRecordSchema, trimmed);
	}
	return safeParseWithSchema(JsonRecordSchema, value);
}
function resolveCredentialsFromConfig(params) {
	const { account, accountId } = params;
	const inline = parseServiceAccount(account.serviceAccount);
	if (inline) return {
		credentials: inline,
		source: "inline",
		status: "available"
	};
	if (coerceSecretRef(account.serviceAccount, params.cfg.secrets?.defaults)) return resolveSecretInputString({
		value: account.serviceAccount,
		defaults: params.cfg.secrets?.defaults,
		path: `channels.googlechat.accounts.${accountId}.serviceAccount`,
		mode: params.mode
	}).status === "configured_unavailable" ? {
		source: "none",
		status: "configured_unavailable"
	} : {
		source: "none",
		status: "missing"
	};
	const file = normalizeOptionalString(account.serviceAccountFile);
	if (file) {
		const resolvedFile = resolveUserPath(file);
		const result = tryReadSecretFileSync(resolvedFile, "Google Chat service account file", {
			maxBytes: MAX_GOOGLE_CHAT_SERVICE_ACCOUNT_FILE_BYTES,
			rejectHardlinks: false,
			rejectSymlink: false
		}, { configPath: `channels.googlechat.accounts.${accountId}.serviceAccountFile` });
		return result.status === "available" ? {
			credentialsFile: file,
			source: "file",
			status: "available"
		} : {
			credentialsFile: file,
			source: "file",
			status: "configured_unavailable",
			diagnostic: result.diagnostic
		};
	}
	if (accountId === DEFAULT_ACCOUNT_ID) {
		const envJson = process.env[ENV_SERVICE_ACCOUNT$1];
		const envInline = parseServiceAccount(envJson);
		if (envInline) return {
			credentials: envInline,
			source: "env",
			status: "available"
		};
		const envFile = normalizeOptionalString(process.env[ENV_SERVICE_ACCOUNT_FILE$1]);
		if (envFile) {
			const resolvedEnvFile = resolveUserPath(envFile);
			const result = tryReadSecretFileSync(resolvedEnvFile, "Google Chat service account file", {
				maxBytes: MAX_GOOGLE_CHAT_SERVICE_ACCOUNT_FILE_BYTES,
				rejectHardlinks: false,
				rejectSymlink: false
			}, { configPath: `env.${ENV_SERVICE_ACCOUNT_FILE$1}` });
			return result.status === "available" ? {
				credentialsFile: envFile,
				source: "env",
				status: "available"
			} : {
				credentialsFile: envFile,
				source: "env",
				status: "configured_unavailable",
				diagnostic: result.diagnostic
			};
		}
	}
	return {
		source: "none",
		status: "missing"
	};
}
function resolveGoogleChatAccountWithMode(params) {
	const accountId = normalizeAccountId(params.accountId ?? params.cfg.channels?.["googlechat"]?.defaultAccount);
	const baseEnabled = params.cfg.channels?.["googlechat"]?.enabled !== false;
	const merged = mergeGoogleChatAccountConfig(params.cfg, accountId);
	const accountEnabled = merged.enabled !== false;
	const enabled = baseEnabled && accountEnabled;
	const credentials = resolveCredentialsFromConfig({
		cfg: params.cfg,
		accountId,
		account: merged,
		mode: params.mode
	});
	return {
		accountId,
		name: normalizeOptionalString(merged.name),
		enabled,
		config: merged,
		credentialSource: credentials.source,
		credentials: credentials.credentials,
		credentialsFile: credentials.credentialsFile,
		tokenStatus: credentials.status,
		...credentials.diagnostic ? { credentialDiagnostics: [credentials.diagnostic] } : {}
	};
}
function resolveGoogleChatAccount(params) {
	return resolveGoogleChatAccountWithMode({
		...params,
		mode: "strict"
	});
}
function inspectGoogleChatAccount(params) {
	const account = resolveGoogleChatAccountWithMode({
		...params,
		mode: "inspect"
	});
	return {
		...account,
		configured: isGoogleChatAccountConfigured(account),
		audienceType: account.config.audienceType,
		audience: account.config.audience,
		webhookPath: account.config.webhookPath,
		webhookUrl: account.config.webhookUrl,
		dmPolicy: account.config.dmPolicy ?? "pairing"
	};
}
function isGoogleChatAccountConfigured(account) {
	return account.tokenStatus ? account.tokenStatus !== "missing" : account.credentialSource !== "none";
}
const googlechatSetupAdapter = createPatchedAccountSetupAdapter({
	channelKey: "googlechat",
	validateInput: createSetupInputPresenceValidator({
		defaultAccountOnlyEnvError: "GOOGLE_CHAT_SERVICE_ACCOUNT env vars can only be used for the default account.",
		whenNotUseEnv: [{
			someOf: ["token", "tokenFile"],
			message: "Google Chat requires --token (service account JSON) or --token-file."
		}]
	}),
	buildPatch: (input) => {
		const setupInput = input;
		const patch = setupInput.useEnv ? {} : setupInput.tokenFile ? { serviceAccountFile: setupInput.tokenFile } : setupInput.token ? { serviceAccount: setupInput.token } : {};
		const audienceType = setupInput.audienceType?.trim();
		const audience = setupInput.audience?.trim();
		const webhookPath = setupInput.webhookPath?.trim();
		const webhookUrl = setupInput.webhookUrl?.trim();
		return {
			...patch,
			...audienceType ? { audienceType } : {},
			...audience ? { audience } : {},
			...webhookPath ? { webhookPath } : {},
			...webhookUrl ? { webhookUrl } : {}
		};
	}
});
const googlechatSetupContract = defineChannelSetupContract({
	fields: {
		token: {
			kind: "string",
			sensitive: true,
			cli: {
				flags: "--token <json>",
				description: "Google Chat service account JSON"
			}
		},
		tokenFile: {
			kind: "string",
			sensitive: true,
			cli: {
				flags: "--token-file <path>",
				description: "Google Chat service account file"
			}
		},
		audienceType: {
			kind: "choice",
			choices: ["app-url", "project-number"],
			cli: {
				flags: "--audience-type <type>",
				description: "Google Chat audience type"
			}
		},
		audience: {
			kind: "string",
			cli: {
				flags: "--audience <value>",
				description: "Google Chat audience value"
			}
		},
		webhookPath: {
			kind: "string",
			cli: {
				flags: "--webhook-path <path>",
				description: "Google Chat webhook path"
			}
		},
		webhookUrl: {
			kind: "string",
			cli: {
				flags: "--webhook-url <url>",
				description: "Google Chat webhook URL"
			}
		},
		useEnv: {
			kind: "boolean",
			cli: {
				flags: "--use-env",
				description: "Use Google Chat environment credentials"
			},
			envVars: ["GOOGLE_CHAT_SERVICE_ACCOUNT", "GOOGLE_CHAT_SERVICE_ACCOUNT_FILE"],
			envVarMode: "any"
		}
	},
	legacyAdapter: googlechatSetupAdapter
});
//#endregion
//#region extensions/googlechat/src/setup-surface.ts
const t = createSetupTranslator();
const channel = "googlechat";
const ENV_SERVICE_ACCOUNT = "GOOGLE_CHAT_SERVICE_ACCOUNT";
const ENV_SERVICE_ACCOUNT_FILE = "GOOGLE_CHAT_SERVICE_ACCOUNT_FILE";
const USE_ENV_FLAG = "__googlechatUseEnv";
const AUTH_METHOD_FLAG = "__googlechatAuthMethod";
const promptAllowFrom = createPromptParsedAllowFromForAccount({
	defaultAccountId: resolveDefaultGoogleChatAccountId,
	message: t("wizard.googlechat.allowFromPrompt"),
	placeholder: "users/123456789, name@example.com",
	parseEntries: (raw) => ({ entries: mergeAllowFromEntries(void 0, splitSetupEntries(raw)) }),
	getExistingAllowFrom: ({ cfg, accountId }) => resolveGoogleChatAccount({
		cfg,
		accountId
	}).config.allowFrom ?? [],
	applyAllowFrom: ({ cfg, accountId, allowFrom }) => applySetupAccountConfigPatch({
		cfg,
		channelKey: channel,
		accountId,
		patch: { allowFrom }
	})
});
const googlechatDmPolicy = createChannelDmPolicy({
	label: "Google Chat",
	channel,
	resolveAccount: (cfg, accountId) => resolveGoogleChatAccount({
		cfg,
		accountId: accountId ?? resolveDefaultGoogleChatAccountId(cfg)
	}),
	applyPatch: ({ cfg, account, patch }) => applySetupAccountConfigPatch({
		cfg,
		channelKey: channel,
		accountId: account.accountId,
		patch
	}),
	promptAllowFrom
});
function createServiceAccountTextInput(params) {
	return {
		inputKey: params.inputKey,
		message: params.message,
		placeholder: params.placeholder,
		shouldPrompt: ({ credentialValues }) => credentialValues[USE_ENV_FLAG] !== "1" && credentialValues[AUTH_METHOD_FLAG] === params.authMethod,
		validate: ({ value }) => normalizeStringifiedOptionalString(value) ? void 0 : "Required",
		normalizeValue: ({ value }) => normalizeStringifiedOptionalString(value) ?? "",
		applySet: async ({ cfg, accountId, value }) => applySetupAccountConfigPatch({
			cfg,
			channelKey: channel,
			accountId,
			patch: { [params.patchKey]: value }
		})
	};
}
const googlechatSetupWizard = {
	channel,
	status: createStandardChannelSetupStatus({
		channelLabel: "Google Chat",
		configuredLabel: t("wizard.channels.statusConfigured"),
		unconfiguredLabel: t("wizard.channels.statusNeedsServiceAccount"),
		configuredHint: t("wizard.channels.statusConfigured"),
		unconfiguredHint: t("wizard.channels.statusNeedsAuth"),
		includeStatusLine: true,
		resolveConfigured: ({ cfg, accountId }) => resolveGoogleChatAccount({
			cfg,
			accountId
		}).credentialSource !== "none"
	}),
	introNote: {
		title: t("wizard.googlechat.setupTitle"),
		lines: [
			t("wizard.googlechat.setupServiceAccount"),
			t("wizard.googlechat.setupScopes"),
			t("wizard.googlechat.setupAudience"),
			t("wizard.channels.docs", { link: formatDocsLink("/channels/googlechat", "googlechat") })
		]
	},
	prepare: async ({ cfg, accountId, credentialValues, prompter }) => {
		if (accountId === DEFAULT_ACCOUNT_ID$1 && Boolean(normalizeOptionalString(process.env[ENV_SERVICE_ACCOUNT]) || normalizeOptionalString(process.env[ENV_SERVICE_ACCOUNT_FILE]))) {
			if (await prompter.confirm({
				message: t("wizard.googlechat.useEnvPrompt"),
				initialValue: true
			})) return {
				cfg: applySetupAccountConfigPatch({
					cfg,
					channelKey: channel,
					accountId,
					patch: {}
				}),
				credentialValues: {
					...credentialValues,
					[USE_ENV_FLAG]: "1"
				}
			};
		}
		const method = await prompter.select({
			message: t("wizard.googlechat.authMethod"),
			options: [{
				value: "file",
				label: t("wizard.googlechat.serviceAccountFile")
			}, {
				value: "inline",
				label: t("wizard.googlechat.serviceAccountInline")
			}],
			initialValue: "file"
		});
		return { credentialValues: {
			...credentialValues,
			[USE_ENV_FLAG]: "0",
			[AUTH_METHOD_FLAG]: method
		} };
	},
	credentials: [],
	textInputs: [createServiceAccountTextInput({
		inputKey: "tokenFile",
		message: t("wizard.googlechat.serviceAccountPath"),
		placeholder: "/path/to/service-account.json",
		authMethod: "file",
		patchKey: "serviceAccountFile"
	}), createServiceAccountTextInput({
		inputKey: "token",
		message: t("wizard.googlechat.serviceAccountJson"),
		placeholder: "{\"type\":\"service_account\", ... }",
		authMethod: "inline",
		patchKey: "serviceAccount"
	})],
	finalize: async ({ cfg, accountId, prompter }) => {
		const account = resolveGoogleChatAccount({
			cfg,
			accountId
		});
		const audienceType = await prompter.select({
			message: t("wizard.googlechat.webhookAudienceType"),
			options: [{
				value: "app-url",
				label: t("wizard.googlechat.appUrlRecommended")
			}, {
				value: "project-number",
				label: t("wizard.googlechat.projectNumber")
			}],
			initialValue: account.config.audienceType === "project-number" ? "project-number" : "app-url"
		});
		const audience = await prompter.text({
			message: audienceType === "project-number" ? t("wizard.googlechat.projectNumber") : t("wizard.googlechat.appUrl"),
			placeholder: audienceType === "project-number" ? "1234567890" : "https://your.host/googlechat",
			initialValue: account.config.audience || void 0,
			validate: (value) => normalizeStringifiedOptionalString(value) ? void 0 : t("common.required")
		});
		return { cfg: migrateBaseNameToDefaultAccount({
			cfg: applySetupAccountConfigPatch({
				cfg,
				channelKey: channel,
				accountId,
				patch: {
					audienceType,
					audience: normalizeOptionalString(audience) ?? ""
				}
			}),
			channelKey: channel
		}) };
	},
	dmPolicy: googlechatDmPolicy
};
//#endregion
//#region extensions/googlechat/src/channel-base.ts
const GOOGLECHAT_CHANNEL_ID = "googlechat";
const googlechatMeta = {
	id: GOOGLECHAT_CHANNEL_ID,
	label: "Google Chat",
	selectionLabel: "Google Chat (Chat API)",
	docsPath: "/channels/googlechat",
	docsLabel: "googlechat",
	blurb: "Google Workspace Chat app with HTTP webhook.",
	aliases: ["gchat", "google-chat"],
	order: 55,
	detailLabel: "Google Chat",
	systemImage: "message.badge",
	markdownCapable: true
};
const formatGoogleChatAllowFromEntry = (entry) => normalizeLowercaseStringOrEmpty(entry.trim().replace(/^(googlechat|google-chat|gchat):/i, "").replace(/^user:/i, "").replace(/^users\//i, ""));
const googleChatConfigAdapter = createScopedChannelConfigAdapter({
	sectionKey: GOOGLECHAT_CHANNEL_ID,
	listAccountIds: listGoogleChatAccountIds,
	resolveAccount: adaptScopedAccountAccessor(resolveGoogleChatAccount),
	resolveAccessorAccount: resolveGoogleChatConfigAccessorAccount,
	defaultAccountId: resolveDefaultGoogleChatAccountId,
	clearBaseFields: [
		"serviceAccount",
		"serviceAccountFile",
		"audienceType",
		"audience",
		"webhookPath",
		"webhookUrl",
		"botUser",
		"name"
	],
	resolveAllowFrom: (account) => account.config.allowFrom,
	formatAllowFrom: (allowFrom) => formatNormalizedAllowFromEntries({
		allowFrom,
		normalizeEntry: formatGoogleChatAllowFromEntry
	}),
	resolveDefaultTo: (account) => account.config.defaultTo
});
function createGoogleChatPluginBase(params = {}) {
	return {
		id: GOOGLECHAT_CHANNEL_ID,
		meta: { ...googlechatMeta },
		setupContract: googlechatSetupContract,
		setupWizard: googlechatSetupWizard,
		capabilities: {
			chatTypes: [
				"direct",
				"group",
				"thread"
			],
			threads: true,
			media: true,
			nativeCommands: false,
			blockStreaming: true
		},
		streaming: { blockStreamingCoalesceDefaults: {
			minChars: 1500,
			idleMs: 1e3
		} },
		reload: { configPrefixes: ["channels.googlechat"] },
		...params.configSchema ? { configSchema: params.configSchema } : {},
		config: {
			...googleChatConfigAdapter,
			inspectAccount: adaptScopedAccountAccessor(inspectGoogleChatAccount),
			isConfigured: isGoogleChatAccountConfigured,
			describeAccount: (account) => describeAccountSnapshot({
				account,
				configured: isGoogleChatAccountConfigured(account),
				extra: {
					credentialSource: account.credentialSource,
					tokenStatus: account.tokenStatus
				}
			})
		}
	};
}
//#endregion
export { googlechatSetupAdapter as a, resolveDefaultGoogleChatAccountId as c, googlechatSetupWizard as i, resolveGoogleChatAccount as l, createGoogleChatPluginBase as n, inspectGoogleChatAccount as o, formatGoogleChatAllowFromEntry as r, listGoogleChatAccountIds as s, GOOGLECHAT_CHANNEL_ID as t, MAX_GOOGLE_CHAT_SERVICE_ACCOUNT_FILE_BYTES as u };
