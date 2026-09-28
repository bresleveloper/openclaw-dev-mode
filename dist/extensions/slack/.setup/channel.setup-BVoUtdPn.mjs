import { r as isSlackSetupAccountConfigured } from "./account-configured-sUohAxZr.mjs";
import { a as resolveDefaultSlackAccountId, l as resolveSlackConfigAccessorAccount, o as resolveSlackAccount, r as listSlackAccountIds } from "./accounts-BBHvg0pY.mjs";
import { t as inspectSlackAccount } from "./account-inspect-DP1Bcwj4.mjs";
import { t as SlackChannelConfigSchema } from "./config-schema-CyL279e7.mjs";
import { normalizeSecretInputString } from "openclaw/plugin-sdk/secret-input";
import { normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
import { adaptScopedAccountAccessor, createScopedChannelConfigAdapter } from "openclaw/plugin-sdk/channel-config-helpers";
import { formatAllowFromLowercase } from "openclaw/plugin-sdk/allow-from";
import { createChannelDmPolicy } from "openclaw/plugin-sdk/channel-dm-policy";
import { defineChannelSetupContract } from "openclaw/plugin-sdk/channel-setup";
import { patchTopLevelChannelConfigSection } from "openclaw/plugin-sdk/setup";
import { DEFAULT_ACCOUNT_ID, createAccountScopedAllowFromSection, createAccountScopedGroupAccessSection, createAllowlistSetupWizardProxy, createPatchedAccountSetupAdapter, createSetupTranslator, createStandardChannelSetupStatus, defineTokenCredential, parseMentionOrPrefixedId, patchChannelConfigForAccount, setSetupChannelEnabled } from "openclaw/plugin-sdk/setup-runtime";
import { formatDocsLink } from "openclaw/plugin-sdk/setup-tools";
import { describeAccountSnapshot } from "openclaw/plugin-sdk/account-helpers";
//#region extensions/slack/src/setup-shared.ts
const SLACK_CHANNEL = "slack";
function buildSlackManifest(botName = "OpenClaw") {
	const safeName = botName.trim() || "OpenClaw";
	const manifest = {
		display_information: {
			name: safeName,
			description: `${safeName} connector for OpenClaw`
		},
		features: {
			bot_user: {
				display_name: safeName,
				always_online: true
			},
			app_home: {
				home_tab_enabled: true,
				messages_tab_enabled: true,
				messages_tab_read_only_enabled: false
			},
			agent_view: {
				agent_description: `${safeName} connects Slack Agent View conversations to OpenClaw agents.`,
				suggested_prompts: [
					{
						title: "What can you do?",
						message: "What can you help me with?"
					},
					{
						title: "Summarize this channel",
						message: "Summarize the recent activity in this channel."
					},
					{
						title: "Draft a reply",
						message: "Help me draft a reply."
					}
				]
			},
			slash_commands: [{
				command: "/openclaw",
				description: "Send a message to OpenClaw",
				should_escape: false
			}]
		},
		oauth_config: { scopes: { bot: [
			"app_mentions:read",
			"assistant:write",
			"channels:history",
			"channels:read",
			"chat:write",
			"commands",
			"emoji:read",
			"files:read",
			"files:write",
			"groups:history",
			"groups:read",
			"im:history",
			"im:read",
			"im:write",
			"mpim:history",
			"mpim:read",
			"mpim:write",
			"pins:read",
			"pins:write",
			"reactions:read",
			"reactions:write",
			"usergroups:read",
			"users:read"
		] } },
		settings: {
			socket_mode_enabled: true,
			event_subscriptions: { bot_events: [
				"app_home_opened",
				"app_mention",
				"app_context_changed",
				"agent_session_stopped",
				"agent_session_title_changed",
				"channel_rename",
				"member_joined_channel",
				"member_left_channel",
				"message.channels",
				"message.groups",
				"message.im",
				"message.mpim",
				"pin_added",
				"pin_removed",
				"reaction_added",
				"reaction_removed"
			] }
		}
	};
	return JSON.stringify(manifest, null, 2);
}
function buildSlackSetupLines() {
	return [
		"1) Slack API -> Create App -> From scratch or a transport-specific manifest",
		"2) Install App to workspace to get the xoxb- bot token",
		"3) Socket Mode: enable it and create an app-level token (xapp-...)",
		"4) HTTP: configure a public HTTPS Request URL and copy the app Signing Secret",
		"5) Enable Event Subscriptions for message, App Home, and Agent View events",
		"6) App Home -> enable the Home tab, Messages tab for DMs, and Agent View",
		"Tip: Socket Mode can use SLACK_BOT_TOKEN + SLACK_APP_TOKEN in your env.",
		`Docs: ${formatDocsLink("/slack", "slack")}`
	];
}
function setSlackChannelAllowlist(cfg, accountId, channelKeys) {
	const channels = Object.fromEntries(channelKeys.map((key) => [key, { enabled: true }]));
	return patchChannelConfigForAccount({
		cfg,
		channel: SLACK_CHANNEL,
		accountId,
		patch: { channels }
	});
}
function describeSlackSetupAccount(account) {
	return describeAccountSnapshot({
		account,
		configured: isSlackSetupAccountConfigured(account),
		extra: {
			botTokenSource: account.botTokenSource,
			appTokenSource: account.appTokenSource,
			...account.identity === "user" ? {
				identity: account.identity,
				userTokenSource: account.userTokenSource
			} : {}
		}
	});
}
//#endregion
//#region extensions/slack/src/setup-core.ts
const t = createSetupTranslator();
function enableSlackAccount(cfg, accountId) {
	return patchChannelConfigForAccount({
		cfg,
		channel: SLACK_CHANNEL,
		accountId,
		patch: { enabled: true }
	});
}
function setSlackSetupIdentity(params) {
	const next = patchChannelConfigForAccount({
		cfg: params.cfg,
		channel: SLACK_CHANNEL,
		accountId: params.accountId,
		patch: params.identity === "user" ? { postAs: "user" } : {}
	});
	if (params.identity === "user") return next;
	const slack = next.channels?.slack;
	if (!slack) return next;
	if (params.accountId === DEFAULT_ACCOUNT_ID) return patchTopLevelChannelConfigSection({
		cfg: next,
		channel: SLACK_CHANNEL,
		clearFields: ["postAs"],
		patch: {}
	});
	const account = slack.accounts?.[params.accountId];
	if (!account) return next;
	const nextAccount = { ...account };
	if (slack.postAs === "user") nextAccount.postAs = "bot";
	else delete nextAccount.postAs;
	return patchTopLevelChannelConfigSection({
		cfg: next,
		channel: SLACK_CHANNEL,
		patch: { accounts: {
			...slack.accounts,
			[params.accountId]: nextAccount
		} }
	});
}
function createSlackTokenCredential(params) {
	return defineTokenCredential({
		inputKey: params.inputKey,
		configKey: params.inputKey,
		providerHint: params.providerHint,
		credentialLabel: params.credentialLabel,
		preferredEnvVar: params.preferredEnvVar,
		envPrompt: params.preferredEnvVar ? `${params.preferredEnvVar} detected. Use env var?` : "Use the configured Slack credential?",
		keepPrompt: params.keepPrompt,
		inputPrompt: params.inputPrompt,
		allowEnv: ({ accountId }) => Boolean(params.preferredEnvVar) && accountId === DEFAULT_ACCOUNT_ID,
		resolveAccount: ({ cfg, accountId }) => inspectSlackAccount({
			cfg,
			accountId
		}),
		resolvedValue: (account) => params.inputKey === "signingSecret" ? normalizeSecretInputString(account.config.signingSecret) : normalizeOptionalString(account[params.inputKey]),
		envValue: ({ accountId }) => params.preferredEnvVar && accountId === DEFAULT_ACCOUNT_ID ? normalizeOptionalString(process.env[params.preferredEnvVar]) : void 0,
		patchAccount: ({ cfg, accountId, mode, patch }) => mode === "env" ? enableSlackAccount(cfg, accountId) : patchChannelConfigForAccount({
			cfg,
			channel: SLACK_CHANNEL,
			accountId,
			patch: {
				enabled: true,
				...patch
			}
		}),
		useEnv: { clearFields: [] },
		set: {},
		shouldPrompt: params.shouldPrompt
	});
}
function hasSlackSetupCredentials(params) {
	const identityToken = params.identity === "user" ? params.input.userToken : params.input.botToken;
	const transportCredential = params.mode === "http" ? params.input.signingSecret : params.input.appToken;
	return Boolean(identityToken && transportCredential);
}
const slackSetupAdapterBase = createPatchedAccountSetupAdapter({
	channelKey: SLACK_CHANNEL,
	validateInput: ({ cfg, accountId, input }) => {
		const setupInput = input;
		if (setupInput.useEnv && accountId !== DEFAULT_ACCOUNT_ID) return "Slack env tokens can only be used for the default account.";
		const account = inspectSlackAccount({
			cfg,
			accountId
		});
		const identity = setupInput.identity ?? account.config.postAs ?? "bot";
		const mode = setupInput.mode ?? account.config.mode ?? "socket";
		if (identity === "user" && mode === "relay") return "Slack user identity setup supports mode \"socket\" or \"http\", not \"relay\".";
		if (setupInput.useEnv) {
			if (identity === "user") return "Slack user identity setup does not support --use-env; configure userToken and the transport credential explicitly.";
			if (mode === "socket" && !normalizeOptionalString(setupInput.appToken) && account.appTokenStatus === "missing") return "Slack Socket Mode requires SLACK_APP_TOKEN when using --use-env.";
			if (mode === "http" && !normalizeOptionalString(setupInput.signingSecret) && account.signingSecretStatus === "missing") return "Slack HTTP mode requires a configured signing secret when using --use-env.";
			return null;
		}
		if (hasSlackSetupCredentials({
			input: setupInput,
			identity,
			mode
		})) return null;
		if (identity === "user") return mode === "http" ? "Slack user identity requires --user-token and --signing-secret." : "Slack user identity requires --user-token and --app-token.";
		return mode === "http" ? "Slack HTTP mode requires --bot-token and --signing-secret (or --use-env)." : "Slack requires --bot-token and --app-token (or --use-env).";
	},
	buildPatch: (input) => {
		const setupInput = input;
		return {
			...setupInput.identity ? { postAs: setupInput.identity } : {},
			...setupInput.mode ? { mode: setupInput.mode } : {},
			...setupInput.botToken ? { botToken: setupInput.botToken } : {},
			...setupInput.appToken ? { appToken: setupInput.appToken } : {},
			...setupInput.userToken ? { userToken: setupInput.userToken } : {},
			...setupInput.signingSecret ? { signingSecret: setupInput.signingSecret } : {}
		};
	}
});
const slackSetupAdapter = {
	...slackSetupAdapterBase,
	singleAccountKeysToMove: ["appToken"],
	applyAccountConfig: ({ cfg, accountId, input }) => {
		const setupInput = input;
		const identity = setupInput.identity ?? inspectSlackAccount({
			cfg,
			accountId
		}).config.postAs;
		return slackSetupAdapterBase.applyAccountConfig({
			cfg,
			accountId,
			input: identity === "user" ? {
				...setupInput,
				identity
			} : setupInput
		});
	}
};
const slackSetupContract = defineChannelSetupContract({
	fields: {
		botToken: {
			kind: "string",
			sensitive: true,
			cli: {
				flags: "--bot-token <token>",
				description: "Slack bot token"
			}
		},
		appToken: {
			kind: "string",
			sensitive: true,
			cli: {
				flags: "--app-token <token>",
				description: "Slack app token"
			}
		},
		userToken: {
			kind: "string",
			sensitive: true,
			cli: {
				flags: "--user-token <token>",
				description: "Slack user token"
			}
		},
		signingSecret: {
			kind: "string",
			sensitive: true,
			cli: {
				flags: "--signing-secret <secret>",
				description: "Slack signing secret"
			}
		},
		identity: {
			kind: "choice",
			choices: ["bot", "user"],
			cli: {
				flags: "--identity <kind>",
				description: "Slack identity"
			}
		},
		mode: {
			kind: "choice",
			choices: ["socket", "http"],
			cli: {
				flags: "--mode <mode>",
				description: "Slack connection mode"
			}
		},
		useEnv: {
			kind: "boolean",
			cli: {
				flags: "--use-env",
				description: "Use Slack environment credentials"
			},
			envVars: ["SLACK_BOT_TOKEN"]
		}
	},
	legacyAdapter: slackSetupAdapter
});
function createSlackSetupWizardBase(handlers) {
	const slackDmPolicy = createChannelDmPolicy({
		label: "Slack",
		channel: SLACK_CHANNEL,
		resolveAccount: (cfg, accountId) => inspectSlackAccount({
			cfg,
			accountId
		}),
		buildPatch: ({ account, policy, allowFrom }) => ({
			dmPolicy: policy,
			...allowFrom === void 0 ? {} : { allowFrom },
			dm: {
				...account.config.dm,
				enabled: typeof account.config.dm?.enabled === "boolean" ? account.config.dm.enabled : true
			}
		}),
		promptAllowFrom: handlers.promptAllowFrom
	});
	return {
		channel: SLACK_CHANNEL,
		status: createStandardChannelSetupStatus({
			channelLabel: "Slack",
			configuredLabel: t("wizard.channels.statusConfigured"),
			unconfiguredLabel: t("wizard.channels.statusNeedsTokens"),
			configuredHint: t("wizard.channels.statusConfigured"),
			unconfiguredHint: t("wizard.channels.statusNeedsTokens"),
			configuredScore: 2,
			unconfiguredScore: 1,
			resolveConfigured: ({ cfg, accountId }) => inspectSlackAccount({
				cfg,
				accountId
			}).configured
		}),
		prepare: async ({ cfg, accountId, prompter }) => {
			const currentAccount = inspectSlackAccount({
				cfg,
				accountId
			});
			if (currentAccount.configured && currentAccount.config.postAs !== "user") return { cfg };
			const identity = await prompter.select({
				message: "How should OpenClaw appear in Slack?",
				options: [{
					value: "bot",
					label: "Slack bot",
					hint: "Post as the Slack app (default)"
				}, {
					value: "user",
					label: "Slack user",
					hint: "Post as the authorizing human"
				}],
				initialValue: currentAccount.config.postAs ?? "bot"
			});
			const next = setSlackSetupIdentity({
				cfg,
				accountId,
				identity
			});
			if (currentAccount.configured && identity === currentAccount.config.postAs) return { cfg: next };
			if (identity === "user") {
				if (currentAccount.config.mode === "relay") throw new Error("Slack user identity setup supports mode \"socket\" or \"http\", not \"relay\".");
				await prompter.note([
					"Use a Slack user OAuth token with the User Token Scopes listed in the Slack docs.",
					"Subscribe the companion app under 'Subscribe to events on behalf of users' using the documented user events.",
					"Socket Mode needs an app-level token; HTTP mode needs the app signing secret.",
					"No bot token or bot user is required.",
					`Docs: ${formatDocsLink("/channels/slack#user-identity-post-as-a-real-person", "channels/slack")}`
				].join("\n"), "Slack user identity");
			} else {
				await prompter.note(buildSlackSetupLines().join("\n"), t("wizard.channels.setupTitle"));
				if (currentAccount.config.mode !== "http") {
					const manifest = buildSlackManifest();
					await (prompter.plain ? prompter.plain(manifest) : prompter.note(manifest, "Slack manifest JSON"));
				}
			}
			return { cfg: next };
		},
		envShortcut: {
			prompt: t("wizard.slack.envPrompt"),
			preferredEnvVar: "SLACK_BOT_TOKEN",
			isAvailable: ({ cfg, accountId }) => {
				const account = inspectSlackAccount({
					cfg,
					accountId
				});
				return accountId === DEFAULT_ACCOUNT_ID && (account.config.postAs ?? "bot") === "bot" && (account.config.mode ?? "socket") === "socket" && Boolean(process.env.SLACK_BOT_TOKEN?.trim()) && Boolean(process.env.SLACK_APP_TOKEN?.trim()) && !account.configured;
			},
			apply: ({ cfg, accountId }) => enableSlackAccount(cfg, accountId)
		},
		credentials: [
			createSlackTokenCredential({
				inputKey: "botToken",
				providerHint: "slack-bot",
				credentialLabel: t("wizard.slack.botToken"),
				preferredEnvVar: "SLACK_BOT_TOKEN",
				keepPrompt: t("wizard.slack.botTokenKeep"),
				inputPrompt: t("wizard.slack.botTokenInput"),
				shouldPrompt: ({ cfg, accountId }) => (inspectSlackAccount({
					cfg,
					accountId
				}).config.postAs ?? "bot") === "bot"
			}),
			createSlackTokenCredential({
				inputKey: "userToken",
				providerHint: "slack-user",
				credentialLabel: "Slack user OAuth token",
				preferredEnvVar: "SLACK_USER_TOKEN",
				keepPrompt: "Slack user OAuth token already configured. Keep it?",
				inputPrompt: "Enter Slack user OAuth token",
				shouldPrompt: ({ cfg, accountId }) => inspectSlackAccount({
					cfg,
					accountId
				}).config.postAs === "user"
			}),
			createSlackTokenCredential({
				inputKey: "appToken",
				providerHint: "slack-app",
				credentialLabel: t("wizard.slack.appToken"),
				preferredEnvVar: "SLACK_APP_TOKEN",
				keepPrompt: t("wizard.slack.appTokenKeep"),
				inputPrompt: t("wizard.slack.appTokenInput"),
				shouldPrompt: ({ cfg, accountId }) => {
					return (inspectSlackAccount({
						cfg,
						accountId
					}).config.mode ?? "socket") === "socket";
				}
			}),
			createSlackTokenCredential({
				inputKey: "signingSecret",
				providerHint: "slack-signing-secret",
				credentialLabel: "Slack signing secret",
				keepPrompt: "Slack signing secret already configured. Keep it?",
				inputPrompt: "Enter Slack signing secret",
				shouldPrompt: ({ cfg, accountId }) => {
					return inspectSlackAccount({
						cfg,
						accountId
					}).config.mode === "http";
				}
			})
		],
		dmPolicy: slackDmPolicy,
		allowFrom: createAccountScopedAllowFromSection({
			channel: SLACK_CHANNEL,
			helpTitle: t("wizard.slack.allowlistTitle"),
			helpLines: [
				t("wizard.slack.allowlistIntro"),
				t("wizard.slack.examples"),
				"- U12345678",
				"- @alice",
				t("wizard.slack.multipleEntries"),
				t("wizard.channels.docs", { link: formatDocsLink("/slack", "slack") })
			],
			message: t("wizard.slack.allowFromPrompt"),
			placeholder: "@alice, U12345678",
			invalidWithoutCredentialNote: t("wizard.slack.allowFromInvalidWithoutToken"),
			parseId: (value) => parseMentionOrPrefixedId({
				value,
				mentionPattern: /^<@([A-Z0-9]+)>$/i,
				prefixPattern: /^(slack:|user:)/i,
				idPattern: /^[A-Z][A-Z0-9]+$/i,
				normalizeId: (id) => id.toUpperCase()
			}),
			resolveEntries: handlers.resolveAllowFromEntries
		}),
		groupAccess: createAccountScopedGroupAccessSection({
			channel: SLACK_CHANNEL,
			label: t("wizard.slack.channelsLabel"),
			placeholder: "#general, #private, C123",
			currentPolicy: ({ cfg, accountId }) => inspectSlackAccount({
				cfg,
				accountId
			}).config.groupPolicy ?? "allowlist",
			currentEntries: ({ cfg, accountId }) => Object.entries(inspectSlackAccount({
				cfg,
				accountId
			}).config.channels ?? {}).filter(([, value]) => value?.enabled !== false).map(([key]) => key),
			updatePrompt: ({ cfg, accountId }) => Boolean(inspectSlackAccount({
				cfg,
				accountId
			}).config.channels),
			resolveAllowlist: handlers.resolveGroupAllowlist,
			fallbackResolved: (entries) => entries,
			applyAllowlist: ({ cfg, accountId, resolved }) => setSlackChannelAllowlist(cfg, accountId, resolved)
		}),
		disable: (cfg) => setSetupChannelEnabled(cfg, SLACK_CHANNEL, false)
	};
}
function createSlackSetupWizardProxy(loadWizard) {
	return createAllowlistSetupWizardProxy({
		loadWizard: async () => (await loadWizard()).slackSetupWizard,
		createBase: createSlackSetupWizardBase,
		fallbackResolvedGroupAllowlist: (entries) => entries
	});
}
//#endregion
//#region extensions/slack/src/config-adapter.ts
const slackBaseConfigAdapter = createScopedChannelConfigAdapter({
	sectionKey: SLACK_CHANNEL,
	listAccountIds: listSlackAccountIds,
	resolveAccount: adaptScopedAccountAccessor(resolveSlackAccount),
	resolveAccessorAccount: resolveSlackConfigAccessorAccount,
	defaultAccountId: resolveDefaultSlackAccountId,
	clearBaseFields: [
		"botToken",
		"appToken",
		"userToken",
		"signingSecret",
		"name"
	],
	resolveAllowFrom: (account) => account.allowFrom,
	formatAllowFrom: (allowFrom) => formatAllowFromLowercase({ allowFrom }),
	resolveDefaultTo: (account) => account.defaultTo
});
//#endregion
//#region extensions/slack/src/channel.setup.ts
const slackSetupWizard = createSlackSetupWizardProxy(async () => ({ slackSetupWizard: (await import("./setup-surface-D3DLcCxu.mjs")).slackSetupWizard }));
const slackSetupPlugin = {
	id: SLACK_CHANNEL,
	meta: {
		id: SLACK_CHANNEL,
		label: "Slack",
		selectionLabel: "Slack (Socket Mode)",
		detailLabel: "Slack Bot",
		docsPath: "/channels/slack",
		docsLabel: "slack",
		blurb: "supported (Socket Mode).",
		systemImage: "number",
		markdownCapable: true,
		preferSessionLookupForAnnounceTarget: true
	},
	setupWizard: slackSetupWizard,
	capabilities: {
		chatTypes: [
			"direct",
			"channel",
			"thread"
		],
		reactions: true,
		threads: true,
		media: true,
		nativeCommands: true
	},
	commands: {
		nativeCommandsAutoEnabled: false,
		nativeSkillsAutoEnabled: false,
		resolveNativeCommandName: ({ commandKey, defaultName }) => commandKey === "status" ? "agentstatus" : defaultName
	},
	streaming: { blockStreamingCoalesceDefaults: {
		minChars: 1500,
		idleMs: 1e3
	} },
	reload: {
		configPrefixes: ["channels.slack"],
		noopPrefixes: [
			"messages.inbound",
			"messages.ackReactionScope",
			...["channels.slack", "channels.slack.accounts.*"].flatMap((prefix) => [
				"dm.enabled",
				"dm.groupEnabled",
				"dm.groupChannels",
				"dmPolicy",
				"allowFrom",
				"groupPolicy",
				"requireMention",
				"implicitMentions",
				"allowBots",
				"botLoopProtection",
				"replyToMode",
				"replyToModeByChatType",
				"thread",
				"historyLimit",
				"dmHistoryLimit",
				"dms",
				"textChunkLimit",
				"streaming",
				"typingReaction",
				"ackReaction",
				"unfurlLinks",
				"unfurlMedia",
				"reactionNotifications",
				"reactionAllowlist",
				"channels.*.enabled",
				"channels.*.requireMention",
				"channels.*.ignoreOtherMentions",
				"channels.*.replyToMode",
				"channels.*.users",
				"channels.*.allowBots",
				"channels.*.botLoopProtection",
				"channels.*.skills",
				"channels.*.systemPrompt",
				"channels.*.tools",
				"channels.*.toolsBySender"
			].map((key) => `${prefix}.${key}`))
		]
	},
	configSchema: SlackChannelConfigSchema,
	config: {
		...slackBaseConfigAdapter,
		hasConfiguredState: ({ env }) => [
			"SLACK_APP_TOKEN",
			"SLACK_BOT_TOKEN",
			"SLACK_USER_TOKEN"
		].some((key) => typeof env?.[key] === "string" && env[key]?.trim().length > 0),
		isConfigured: (account) => isSlackSetupAccountConfigured(account),
		describeAccount: (account) => describeSlackSetupAccount(account)
	},
	setupContract: slackSetupContract
};
//#endregion
export { slackSetupContract as a, createSlackSetupWizardProxy as i, slackBaseConfigAdapter as n, SLACK_CHANNEL as o, createSlackSetupWizardBase as r, slackSetupPlugin as t };
