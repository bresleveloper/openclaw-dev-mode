const require_resolve_allowlist = require("./resolve-allowlist-CHzaaWiC.cjs");
require("./secret-input-C65t6kjM.cjs");
const require_config_schema = require("./config-schema-D22Lr1Qk.cjs");
let openclaw_plugin_sdk_string_coerce_runtime = require("openclaw/plugin-sdk/string-coerce-runtime");
let openclaw_plugin_sdk_allow_from = require("openclaw/plugin-sdk/allow-from");
let openclaw_plugin_sdk_account_id = require("openclaw/plugin-sdk/account-id");
let openclaw_plugin_sdk_account_helpers = require("openclaw/plugin-sdk/account-helpers");
let openclaw_plugin_sdk_number_runtime = require("openclaw/plugin-sdk/number-runtime");
let openclaw_plugin_sdk_channel_config_helpers = require("openclaw/plugin-sdk/channel-config-helpers");
let openclaw_plugin_sdk_secret_file_runtime = require("openclaw/plugin-sdk/secret-file-runtime");
let openclaw_plugin_sdk_channel_setup = require("openclaw/plugin-sdk/channel-setup");
let openclaw_plugin_sdk_setup = require("openclaw/plugin-sdk/setup");
let openclaw_plugin_sdk_setup_tools = require("openclaw/plugin-sdk/setup-tools");
let openclaw_plugin_sdk_retry_runtime = require("openclaw/plugin-sdk/retry-runtime");
let openclaw_plugin_sdk_secret_input = require("openclaw/plugin-sdk/secret-input");
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
function resolveMSTeamsAccount(cfg) {
	const config = cfg.channels?.msteams;
	const credentials = require_resolve_allowlist.resolveMSTeamsCredentials(config);
	const certificatePath = credentials?.type === "federated" && !credentials.useManagedIdentity ? credentials.certificatePath : void 0;
	const certificate = certificatePath ? (0, openclaw_plugin_sdk_secret_file_runtime.tryReadSecretFileSync)(certificatePath, "Microsoft Teams certificate", void 0, { configPath: config?.certificatePath?.trim() ? "channels.msteams.certificatePath" : "env.MSTEAMS_CERTIFICATE_PATH" }) : void 0;
	const unavailable = certificate?.status === "configured_unavailable";
	return {
		accountId: openclaw_plugin_sdk_account_id.DEFAULT_ACCOUNT_ID,
		enabled: config?.enabled !== false,
		configured: Boolean(credentials),
		tokenStatus: !credentials ? "missing" : unavailable ? "configured_unavailable" : "available",
		...unavailable ? { credentialDiagnostics: [certificate.diagnostic] } : {}
	};
}
const msteamsConfigAdapter = (0, openclaw_plugin_sdk_channel_config_helpers.createTopLevelChannelConfigAdapter)({
	sectionKey: "msteams",
	resolveAccount: resolveMSTeamsAccount,
	resolveAccessorAccount: ({ cfg }) => ({
		allowFrom: cfg.channels?.msteams?.allowFrom,
		defaultTo: cfg.channels?.msteams?.defaultTo
	}),
	resolveAllowFrom: (account) => account.allowFrom,
	formatAllowFrom: (allowFrom) => (0, openclaw_plugin_sdk_allow_from.formatAllowFromLowercase)({ allowFrom }),
	resolveDefaultTo: (account) => account.defaultTo
});
//#endregion
//#region extensions/msteams/src/setup-core.ts
const t$1 = (0, openclaw_plugin_sdk_setup.createSetupTranslator)();
const channel$1 = "msteams";
const msteamsSetupAdapter = {
	resolveAccountId: () => openclaw_plugin_sdk_setup.DEFAULT_ACCOUNT_ID,
	applyAccountConfig: ({ cfg }) => (0, openclaw_plugin_sdk_setup.setSetupChannelEnabled)(cfg, channel$1, true)
};
const msteamsSetupContract = (0, openclaw_plugin_sdk_channel_setup.defineChannelSetupContract)({
	fields: {},
	legacyAdapter: msteamsSetupAdapter
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
		resolveAccountIdForConfigure: () => openclaw_plugin_sdk_setup.DEFAULT_ACCOUNT_ID,
		resolveShouldPromptAccountIds: () => false,
		status: (0, openclaw_plugin_sdk_setup.createStandardChannelSetupStatus)({
			channelLabel: "MS Teams",
			configuredLabel: t$1("wizard.channels.statusConfigured"),
			unconfiguredLabel: t$1("wizard.channels.statusNeedsAppCredentials"),
			configuredHint: t$1("wizard.channels.statusConfigured"),
			unconfiguredHint: t$1("wizard.channels.statusNeedsAppCreds"),
			configuredScore: 2,
			unconfiguredScore: 0,
			includeStatusLine: true,
			resolveConfigured: ({ cfg }) => Boolean(require_resolve_allowlist.resolveMSTeamsCredentials(cfg.channels?.msteams)) || require_resolve_allowlist.hasConfiguredMSTeamsCredentials(cfg.channels?.msteams)
		}),
		credentials: [],
		finalize: async ({ cfg, prompter }) => {
			const resolved = require_resolve_allowlist.resolveMSTeamsCredentials(cfg.channels?.msteams);
			const hasConfigCreds = require_resolve_allowlist.hasConfiguredMSTeamsCredentials(cfg.channels?.msteams);
			const canUseEnv = Boolean(!hasConfigCreds && (0, openclaw_plugin_sdk_secret_input.normalizeSecretInputString)(process.env.MSTEAMS_APP_ID) && (0, openclaw_plugin_sdk_secret_input.normalizeSecretInputString)(process.env.MSTEAMS_APP_PASSWORD) && (0, openclaw_plugin_sdk_secret_input.normalizeSecretInputString)(process.env.MSTEAMS_TENANT_ID));
			let next = cfg;
			let appId = null;
			let appPassword = null;
			let tenantId = null;
			if (!resolved && !hasConfigCreds) await noteMSTeamsCredentialHelp(prompter);
			if (canUseEnv || hasConfigCreds) {
				if (await prompter.confirm({
					message: t$1(canUseEnv ? "wizard.msteams.envPrompt" : "wizard.msteams.credentialsKeep"),
					initialValue: true
				})) next = msteamsSetupAdapter.applyAccountConfig({
					cfg: next,
					accountId: openclaw_plugin_sdk_setup.DEFAULT_ACCOUNT_ID,
					input: {}
				});
				else ({appId, appPassword, tenantId} = await promptMSTeamsCredentials(prompter));
			} else ({appId, appPassword, tenantId} = await promptMSTeamsCredentials(prompter));
			if (appId && appPassword && tenantId) next = (0, openclaw_plugin_sdk_setup.patchTopLevelChannelConfigSection)({
				cfg: next,
				channel: channel$1,
				enabled: true,
				patch: {
					appId,
					appPassword,
					tenantId
				}
			});
			return {
				cfg: next,
				accountId: openclaw_plugin_sdk_setup.DEFAULT_ACCOUNT_ID
			};
		}
	};
}
//#endregion
//#region extensions/msteams/src/errors.ts
const MAX_SAFE_RETRY_AFTER_SECONDS = Number.MAX_SAFE_INTEGER / 1e3;
function formatUnknownError(err) {
	if (err instanceof Error) return err.message;
	if (typeof err === "string") return err;
	if (err === null) return "null";
	if (err === void 0) return "undefined";
	if (typeof err === "number" || typeof err === "boolean" || typeof err === "bigint") return String(err);
	if (typeof err === "symbol") return err.description ?? err.toString();
	if (typeof err === "function") return err.name ? `[function ${err.name}]` : "[function]";
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
const setMSTeamsAllowFrom = (0, openclaw_plugin_sdk_setup.createTopLevelChannelAllowFromSetter)({ channel });
const setMSTeamsGroupPolicy = (0, openclaw_plugin_sdk_setup.createTopLevelChannelGroupPolicySetter)({
	channel,
	enabled: true
});
function openDelegatedOAuthUrl(url) {
	return Promise.reject(/* @__PURE__ */ new Error(`Automatic browser launch is not available. Open this URL manually: ${url}`));
}
function looksLikeGuid(value) {
	return /^[0-9a-fA-F-]{16,}$/.test(value);
}
async function promptMSTeamsAllowFrom(params) {
	const existing = params.cfg.channels?.msteams?.allowFrom ?? [];
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
			entries: parts
		}).catch(() => null);
		if (!resolved) {
			const ids = parts.filter((part) => looksLikeGuid(part));
			if (ids.length !== parts.length) {
				await params.prompter.note(t("wizard.msteams.graphLookupUnavailable"), t("wizard.msteams.allowlistTitle"));
				continue;
			}
			const unique = (0, openclaw_plugin_sdk_setup.mergeAllowFromEntries)(existing, ids);
			return setMSTeamsAllowFrom(params.cfg, unique);
		}
		const unresolved = resolved.filter((item) => !item.resolved || !item.id);
		if (unresolved.length > 0) {
			await params.prompter.note(t("wizard.msteams.couldNotResolve", { entries: unresolved.map((item) => item.input).join(", ") }), t("wizard.msteams.allowlistTitle"));
			continue;
		}
		const ids = resolved.map((item) => item.id);
		const unique = (0, openclaw_plugin_sdk_setup.mergeAllowFromEntries)(existing, ids);
		return setMSTeamsAllowFrom(params.cfg, unique);
	}
}
function setMSTeamsTeamsAllowlist(cfg, entries) {
	const teams = { ...cfg.channels?.msteams?.teams ?? {} };
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
	return (0, openclaw_plugin_sdk_setup.patchTopLevelChannelConfigSection)({
		cfg,
		channel,
		enabled: true,
		patch: { teams }
	});
}
function listMSTeamsGroupEntries(cfg) {
	return Object.entries(cfg.channels?.msteams?.teams ?? {}).flatMap(([teamKey, value]) => {
		const channels = value?.channels ?? {};
		const channelKeys = Object.keys(channels);
		if (channelKeys.length === 0) return [teamKey];
		return channelKeys.map((channelKey) => `${teamKey}/${channelKey}`);
	});
}
async function resolveMSTeamsGroupAllowlist(params) {
	let resolvedEntries = params.entries.map((entry) => require_resolve_allowlist.parseMSTeamsTeamEntry(entry)).filter(Boolean);
	if (params.entries.length === 0 || !require_resolve_allowlist.resolveMSTeamsCredentials(params.cfg.channels?.msteams)) return resolvedEntries;
	try {
		const lookups = await require_resolve_allowlist.resolveMSTeamsChannelAllowlist({
			cfg: params.cfg,
			entries: params.entries
		});
		const resolvedChannels = lookups.filter((entry) => entry.resolved && entry.teamId && entry.channelId);
		const resolvedTeams = lookups.filter((entry) => entry.resolved && entry.teamId && !entry.channelId);
		const unresolved = lookups.filter((entry) => !entry.resolved).map((entry) => entry.input);
		resolvedEntries = [
			...resolvedChannels.map((entry) => ({
				teamKey: entry.teamId,
				channelKey: entry.channelId
			})),
			...resolvedTeams.map((entry) => ({ teamKey: entry.teamId })),
			...unresolved.map((entry) => require_resolve_allowlist.parseMSTeamsTeamEntry(entry)).filter(Boolean)
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
	label: t("wizard.msteams.channelsLabel"),
	placeholder: "Team Name/Channel Name, teamId/conversationId",
	currentPolicy: ({ cfg }) => cfg.channels?.msteams?.groupPolicy ?? "allowlist",
	currentEntries: ({ cfg }) => listMSTeamsGroupEntries(cfg),
	updatePrompt: ({ cfg }) => Boolean(cfg.channels?.msteams?.teams),
	setPolicy: ({ cfg, policy }) => setMSTeamsGroupPolicy(cfg, policy),
	resolveAllowlist: async ({ cfg, entries, prompter }) => await resolveMSTeamsGroupAllowlist({
		cfg,
		entries,
		prompter
	}),
	applyAllowlist: ({ cfg, resolved }) => setMSTeamsTeamsAllowlist(cfg, resolved)
};
const msteamsDmPolicy = (0, openclaw_plugin_sdk_setup.createTopLevelChannelDmPolicy)({
	label: "MS Teams",
	channel,
	policyKey: "channels.msteams.dmPolicy",
	allowFromKey: "channels.msteams.allowFrom",
	getCurrent: (cfg) => cfg.channels?.msteams?.dmPolicy ?? "pairing",
	promptAllowFrom: promptMSTeamsAllowFrom
});
const msteamsSetupWizardBase = createMSTeamsSetupWizardBase();
const msteamsSetupWizard = {
	...msteamsSetupWizardBase,
	finalize: async (params) => {
		const baseFinalize = msteamsSetupWizardBase.finalize;
		const baseResult = baseFinalize ? await baseFinalize(params) : void 0;
		let next = baseResult?.cfg ?? params.cfg;
		const finalCreds = require_resolve_allowlist.resolveMSTeamsCredentials(next.channels?.msteams);
		if (finalCreds?.type === "secret") {
			if (await params.prompter.confirm({
				message: t("wizard.msteams.delegatedAuthPrompt"),
				initialValue: false
			})) {
				next = (0, openclaw_plugin_sdk_setup.patchTopLevelChannelConfigSection)({
					cfg: next,
					channel,
					patch: { delegatedAuth: { enabled: true } }
				});
				const noteDelegatedAuthFailure = async (err) => {
					await params.prompter.note(`Delegated auth setup failed: ${formatUnknownError(err)}\n` + t("wizard.msteams.delegatedAuthRetry"), t("wizard.msteams.delegatedAuthTitle"));
				};
				let oauthModule;
				try {
					oauthModule = await Promise.resolve().then(() => require("./oauth-C6m7dvHj.cjs"));
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
						isRemote: true,
						openUrl: openDelegatedOAuthUrl,
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
				await require_resolve_allowlist.saveDelegatedTokens(tokens);
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
Object.defineProperty(exports, "resolveMSTeamsAccount", {
	enumerable: true,
	get: function() {
		return resolveMSTeamsAccount;
	}
});
