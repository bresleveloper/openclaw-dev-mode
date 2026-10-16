import { a as resolveTwitchAccountContext, c as normalizeToken, i as resolveDefaultTwitchAccountId, l as normalizeTwitchChannel, n as DEFAULT_ACCOUNT_ID$1, o as twitchConfigAdapter, r as getAccountConfig, s as isAccountConfigured, t as twitchSetupPlugin, u as resolveTwitchToken } from "./setup-surface-CUV7j7dX.mjs";
import { describeAccountSnapshot } from "openclaw/plugin-sdk/account-helpers";
import { MarkdownConfigSchema, buildChannelConfigSchema } from "openclaw/plugin-sdk/channel-config-schema";
import { buildChannelOutboundSessionRoute, createChatChannelPlugin, stripChannelTargetPrefix } from "openclaw/plugin-sdk/channel-core";
import { createAccountStatusSink, createChannelMessageAdapterFromOutbound, createMessageReceiptFromOutboundResults, runPassiveAccountLifecycle } from "openclaw/plugin-sdk/channel-outbound";
import { createLoggedPairingApprovalNotifier, createPairingPrefixStripper } from "openclaw/plugin-sdk/channel-pairing";
import { buildPassiveProbedChannelStatusSummary } from "openclaw/plugin-sdk/extension-shared";
import { createComputedAccountStatusAdapter, createDefaultChannelRuntimeState } from "openclaw/plugin-sdk/status-helpers";
import { RefreshingAuthProvider, StaticAuthProvider } from "@twurple/auth";
import { ChatClient, LogLevel } from "@twurple/chat";
import { DEFAULT_ACCOUNT_ID } from "openclaw/plugin-sdk/account-resolution";
import { formatErrorMessage } from "openclaw/plugin-sdk/error-runtime";
import { channelReadyPatch } from "openclaw/plugin-sdk/gateway-runtime";
import { chunkTextForOutbound, sanitizeAssistantVisibleText, stripMarkdown } from "openclaw/plugin-sdk/text-chunking";
import { runChannelProbe, sliceUtf16Safe, withTimeout } from "openclaw/plugin-sdk/text-utility-runtime";
import { normalizeLowercaseStringOrEmpty, normalizeStringEntries } from "openclaw/plugin-sdk/string-coerce-runtime";
import { z } from "zod";
import { raceWithTimeout } from "openclaw/plugin-sdk/time-runtime";
import { HttpStatusCodeError, callTwitchApi } from "@twurple/api-call";
//#region extensions/twitch/src/actions.ts
function readSendValue(value) {
	return typeof value === "string" || typeof value === "number" || typeof value === "boolean" ? String(value).trim() : void 0;
}
const twitchMessageActions = {
	describeMessageTool: () => ({ actions: ["send"] }),
	supportsAction: ({ action }) => action === "send",
	extractToolSend: ({ args }) => {
		try {
			const to = readSendValue(args.to);
			const message = readSendValue(args.message);
			return to && message ? {
				to,
				message
			} : null;
		} catch {
			return null;
		}
	}
};
//#endregion
//#region extensions/twitch/src/twitch-client.ts
const TWITCH_CHAT_AUTH_INTENTS = ["chat"];
var TwitchClientManager = class {
	constructor(logger, statusSink) {
		this.logger = logger;
		this.statusSink = statusSink;
		this.clients = /* @__PURE__ */ new Map();
		this.pendingClients = /* @__PURE__ */ new Map();
		this.connectionPromises = /* @__PURE__ */ new Map();
		this.messageHandlers = /* @__PURE__ */ new Map();
	}
	setStatusSink(statusSink) {
		if (statusSink) this.statusSink = statusSink;
	}
	publishReady() {
		this.statusSink?.(channelReadyPatch());
	}
	publishRecovering(lastError) {
		this.statusSink?.({
			connected: false,
			lifecycle: "recovering",
			lastError
		});
	}
	async createAuthProvider(account, normalizedToken, clientId) {
		if (account.clientSecret) {
			const authProvider = new RefreshingAuthProvider({
				clientId,
				clientSecret: account.clientSecret
			});
			try {
				const userId = await authProvider.addUserForToken({
					accessToken: normalizedToken,
					refreshToken: account.refreshToken ?? null,
					expiresIn: account.expiresIn ?? null,
					obtainmentTimestamp: account.obtainmentTimestamp ?? Date.now()
				}, TWITCH_CHAT_AUTH_INTENTS);
				this.logger.info(`Added user ${userId} to RefreshingAuthProvider for ${account.username}`);
			} catch (err) {
				throw new Error(`Failed to add user to RefreshingAuthProvider: ${formatErrorMessage(err)}`, { cause: err });
			}
			authProvider.onRefresh((userId, token) => {
				this.logger.info(`Access token refreshed for user ${userId} (expires in ${token.expiresIn ? `${token.expiresIn}s` : "unknown"})`);
			});
			authProvider.onRefreshFailure((userId, error) => {
				this.logger.error(`Failed to refresh access token for user ${userId}: ${error.message}`);
			});
			const refreshStatus = account.refreshToken ? "automatic token refresh enabled" : "token refresh disabled (no refresh token)";
			this.logger.info(`Using RefreshingAuthProvider for ${account.username} (${refreshStatus})`);
			return authProvider;
		}
		this.logger.info(`Using StaticAuthProvider for ${account.username} (no clientSecret provided)`);
		return new StaticAuthProvider(clientId, normalizedToken);
	}
	async getClient(account, cfg, accountId) {
		const key = this.getAccountKey(account);
		const existing = this.clients.get(key);
		if (existing) return existing;
		const pending = this.connectionPromises.get(key);
		if (pending) return pending;
		const connection = this.createConnectedClient(key, account, () => this.connectionPromises.get(key) === connection, cfg, accountId);
		this.connectionPromises.set(key, connection);
		try {
			return await connection;
		} finally {
			if (this.connectionPromises.get(key) === connection) this.connectionPromises.delete(key);
		}
	}
	async createConnectedClient(key, account, ownsConnection, cfg, accountId) {
		const tokenResolution = resolveTwitchToken(cfg, { accountId });
		if (!tokenResolution.token) {
			const resolvedAccountId = accountId ?? DEFAULT_ACCOUNT_ID;
			const tokenConfigPath = cfg?.channels?.twitch?.accounts ? `channels.twitch.accounts.${resolvedAccountId}.accessToken` : "channels.twitch.accessToken";
			throw new Error(`Missing Twitch token for account ${resolvedAccountId} (set ${tokenConfigPath} or OPENCLAW_TWITCH_ACCESS_TOKEN for default)`);
		}
		this.logger.debug?.(`Using ${tokenResolution.source} token source for ${account.username}`);
		if (!account.clientId) {
			this.logger.error(`Missing Twitch client ID for account ${account.username}`);
			throw new Error("Missing Twitch client ID");
		}
		const normalizedToken = normalizeToken(tokenResolution.token);
		const authProvider = await this.createAuthProvider(account, normalizedToken, account.clientId);
		if (!ownsConnection()) throw new Error(`Twitch connection cancelled for ${account.username}`);
		const client = new ChatClient({
			authProvider,
			channels: [account.channel],
			rejoinChannelsOnReconnect: true,
			requestMembershipEvents: true,
			logger: {
				minLevel: LogLevel.WARNING,
				custom: { log: (level, message) => {
					switch (level) {
						case LogLevel.CRITICAL:
						case LogLevel.ERROR:
							this.logger.error(message);
							break;
						case LogLevel.WARNING:
							this.logger.warn(message);
							break;
						case LogLevel.INFO:
							this.logger.info(message);
							break;
						case LogLevel.DEBUG:
						case LogLevel.TRACE: this.logger.debug?.(message);
					}
				} }
			}
		});
		this.pendingClients.set(key, client);
		try {
			await this.connectClient(client, account);
			if (this.pendingClients.get(key) !== client) {
				client.quit();
				throw new Error(`Twitch connection cancelled for ${account.username}`);
			}
		} finally {
			if (this.pendingClients.get(key) === client) this.pendingClients.delete(key);
		}
		this.setupClientHandlers(client, account);
		this.clients.set(key, client);
		this.logger.info(`Connected to Twitch as ${account.username}`);
		return client;
	}
	async connectClient(client, account) {
		const connectTimeoutMs = 15e3;
		await new Promise((resolve, reject) => {
			let settled = false;
			let authRetryPending = false;
			const listeners = [];
			const finish = (error) => {
				if (settled) return;
				settled = true;
				clearTimeout(timeout);
				for (const listener of listeners) listener.unbind();
				if (error) {
					try {
						client.quit();
					} catch {}
					reject(error);
					return;
				}
				resolve();
			};
			listeners.push(client.onAuthenticationSuccess(() => {
				this.publishReady();
				finish();
			}), client.onAuthenticationFailure((text) => {
				authRetryPending = true;
				this.publishRecovering(text);
				this.logger.warn(`Twitch authentication failed for ${account.username}; waiting for retry, disconnect, or timeout: ${text}`);
			}), client.onDisconnect((manual, reason) => {
				if (!manual) this.publishRecovering(reason ? formatErrorMessage(reason) : "Twitch connection lost");
				if (authRetryPending && !manual) {
					this.logger.debug?.(`Twitch disconnected during auth retry for ${account.username}: ${formatErrorMessage(reason)}`);
					return;
				}
				finish(reason ?? /* @__PURE__ */ new Error(manual ? `Twitch connection cancelled for ${account.username}` : `Twitch disconnected before ready for ${account.username}`));
			}));
			const timeout = setTimeout(() => finish(/* @__PURE__ */ new Error(`Timed out connecting to Twitch as ${account.username}`)), connectTimeoutMs);
			timeout.unref?.();
			try {
				client.connect();
			} catch (error) {
				finish(error instanceof Error ? error : new Error(String(error)));
			}
		});
	}
	setupClientHandlers(client, account) {
		const key = this.getAccountKey(account);
		client.onMessage((channelName, _user, messageText, msg) => {
			const handler = this.messageHandlers.get(key)?.handler;
			if (handler) {
				const from = `twitch:${msg.userInfo.userName}`;
				const preview = sliceUtf16Safe(messageText, 0, 100).replace(/\n/g, "\\n");
				this.logger.debug?.(`twitch inbound: channel=${channelName} from=${from} len=${messageText.length} preview="${preview}"`);
				handler({
					username: msg.userInfo.userName,
					displayName: msg.userInfo.displayName,
					userId: msg.userInfo.userId,
					message: messageText,
					channel: channelName,
					id: msg.id,
					timestamp: Date.now(),
					isMod: msg.userInfo.isMod,
					isOwner: msg.userInfo.isBroadcaster,
					isVip: msg.userInfo.isVip,
					isSub: msg.userInfo.isSubscriber,
					chatType: "group"
				});
			}
		});
		client.onAuthenticationSuccess(() => this.publishReady());
		client.onAuthenticationFailure((text) => {
			this.publishRecovering(text);
		});
		client.onDisconnect((manual, reason) => {
			if (!manual) this.publishRecovering(reason ? formatErrorMessage(reason) : "Twitch connection lost");
		});
		this.logger.info(`Set up handlers for ${key}`);
	}
	onMessage(account, handler) {
		const key = this.getAccountKey(account);
		const registration = { handler };
		this.messageHandlers.set(key, registration);
		return () => {
			if (this.messageHandlers.get(key) === registration) this.messageHandlers.delete(key);
		};
	}
	async disconnect(account) {
		const key = this.getAccountKey(account);
		const client = this.clients.get(key);
		const pendingClient = this.pendingClients.get(key);
		const pendingConnection = this.connectionPromises.delete(key);
		if (pendingClient) {
			pendingClient.quit();
			this.pendingClients.delete(key);
		}
		if (client) {
			client.quit();
			this.clients.delete(key);
			this.logger.info(`Disconnected ${key}`);
		}
		if (pendingConnection || pendingClient || client) this.messageHandlers.delete(key);
	}
	async disconnectAll() {
		this.pendingClients.forEach((client) => client.quit());
		this.clients.forEach((client) => client.quit());
		this.pendingClients.clear();
		this.connectionPromises.clear();
		this.clients.clear();
		this.messageHandlers.clear();
		this.logger.info(" Disconnected all clients");
	}
	async sendMessage(account, channel, message, cfg, accountId) {
		try {
			const client = await this.getClient(account, cfg, accountId);
			const messageId = crypto.randomUUID();
			for (const chunk of chunkTextForOutbound(message, 500)) await client.say(channel, chunk);
			return {
				ok: true,
				messageId
			};
		} catch (error) {
			const errorMessage = formatErrorMessage(error);
			this.logger.error(`Failed to send message: ${errorMessage}`);
			return {
				ok: false,
				error: errorMessage
			};
		}
	}
	getAccountKey(account) {
		return `${account.username}:${account.channel}`;
	}
};
//#endregion
//#region extensions/twitch/src/client-manager-registry.ts
const registry = /* @__PURE__ */ new Map();
function getOrCreateClientManager(accountId, logger, statusSink) {
	const existing = registry.get(accountId);
	if (existing) {
		existing.manager.setStatusSink(statusSink);
		return existing.manager;
	}
	const manager = new TwitchClientManager(logger, statusSink);
	registry.set(accountId, {
		manager,
		logger
	});
	logger.info(`Registered client manager for account: ${accountId}`);
	return manager;
}
function getClientManager(accountId) {
	return registry.get(accountId)?.manager;
}
async function removeClientManager(accountId) {
	const entry = registry.get(accountId);
	if (!entry) return;
	registry.delete(accountId);
	try {
		await entry.manager.disconnectAll();
	} finally {
		entry.logger.info(`Unregistered client manager for account: ${accountId}`);
	}
}
//#endregion
//#region extensions/twitch/src/config-schema.ts
const TwitchRoleSchema = z.enum([
	"moderator",
	"owner",
	"vip",
	"subscriber",
	"all"
]);
const TwitchAccountShape = {
	username: z.string(),
	/** Twitch OAuth access token (requires chat:read and chat:write scopes) */
	accessToken: z.string(),
	/** Twitch client ID (from Twitch Developer Portal or twitchtokengenerator.com) */
	clientId: z.string().optional(),
	channel: z.string().min(1),
	enabled: z.boolean().optional(),
	/** Allow channel-initiated configuration writes */
	configWrites: z.boolean().optional(),
	/** Allowlist of Twitch user IDs who can interact with the bot (use IDs for safety, not usernames) */
	allowFrom: z.array(z.string()).optional(),
	allowedRoles: z.array(TwitchRoleSchema).optional(),
	/** Require @mention to trigger bot responses */
	requireMention: z.boolean().optional(),
	responsePrefix: z.string().optional(),
	/** Twitch client secret (required for token refresh via RefreshingAuthProvider) */
	clientSecret: z.string().optional(),
	/** Refresh token (required for automatic token refresh) */
	refreshToken: z.string().optional(),
	/** Token expiry time in seconds (optional, for token refresh tracking) */
	expiresIn: z.number().nullable().optional(),
	/** Timestamp when token was obtained (optional, for token refresh tracking) */
	obtainmentTimestamp: z.number().optional()
};
const TwitchAccountSchema = z.object(TwitchAccountShape);
const TwitchConfigBaseShape = {
	name: z.string().optional(),
	enabled: z.boolean().optional(),
	configWrites: z.boolean().optional(),
	markdown: MarkdownConfigSchema.optional(),
	defaultAccount: z.string().optional(),
	historyLimit: z.number().int().min(0).optional(),
	responsePrefix: z.string().optional()
};
const SimplifiedSchema = z.object({
	...TwitchConfigBaseShape,
	...TwitchAccountShape
});
const MultiAccountSchema = z.object({
	...TwitchConfigBaseShape,
	accounts: z.record(z.string(), TwitchAccountSchema)
}).refine((val) => Object.keys(val.accounts).length > 0, { message: "accounts must contain at least one entry" });
const TwitchConfigSchema = z.union([SimplifiedSchema, MultiAccountSchema]);
//#endregion
//#region extensions/twitch/src/utils/markdown.ts
/**
* Markdown utilities for Twitch chat
*
* Twitch chat doesn't support markdown formatting, so we strip it before sending.
*/
/** Strip markdown, then flatten newlines for Twitch's single-line chat. */
function stripMarkdownForTwitch(markdown) {
	return stripMarkdown(markdown, { linkStyle: "label-and-url" }).replace(/\r/g, "").replace(/[ \t]+\n/g, "\n").replace(/\n/g, " ").replace(/[ \t]{2,}/g, " ").trim();
}
//#endregion
//#region extensions/twitch/src/send.ts
function createTwitchSendReceipt(messageId, channel) {
	return createMessageReceiptFromOutboundResults({
		results: messageId ? [{
			channel: "twitch",
			messageId,
			conversationId: channel
		}] : [],
		kind: "text"
	});
}
async function sendMessageTwitchInternal(params) {
	const cleanedText = stripMarkdownForTwitch(params.text);
	if (!cleanedText) return {
		outcome: "not_sent",
		messageId: "",
		receipt: createTwitchSendReceipt()
	};
	if (!params.clientManager) throw new Error(`Client manager not found for account: ${params.accountId}. Please start the Twitch gateway first.`);
	const result = await params.clientManager.sendMessage(params.account, params.channel, cleanedText, params.cfg, params.accountId);
	if (!result.ok) throw new Error(result.error);
	const { messageId } = result;
	return {
		messageId,
		receipt: createTwitchSendReceipt(messageId, params.channel)
	};
}
//#endregion
//#region extensions/twitch/src/outbound.ts
const twitchOutbound = {
	deliveryMode: "direct",
	deliveryCapabilities: { durableFinal: {
		text: true,
		media: true,
		messageSendingHooks: true
	} },
	textChunkLimit: 500,
	sanitizeText: ({ text }) => sanitizeAssistantVisibleText(text),
	resolveTarget: ({ to, allowFrom, mode }) => {
		const trimmed = to?.trim() ?? "";
		const allowListRaw = normalizeStringEntries(allowFrom ?? []);
		const hasWildcard = allowListRaw.includes("*");
		const allowList = allowListRaw.filter((entry) => entry !== "*").map((entry) => normalizeTwitchChannel(entry)).filter((entry) => entry.length > 0);
		const normalizedTo = normalizeTwitchChannel(trimmed);
		if (normalizedTo && (!(mode === "implicit" || mode === "heartbeat") || hasWildcard || allowList.length === 0 || allowList.includes(normalizedTo))) return {
			ok: true,
			to: normalizedTo
		};
		return {
			ok: false,
			error: /* @__PURE__ */ new Error("Delivering to Twitch requires target <channel-name>")
		};
	},
	sendText: async (params) => {
		const { cfg, to, text, accountId } = params;
		if (params.signal?.aborted) throw new Error("Outbound delivery aborted");
		const { account, accountId: normalizedAccountId, availableAccountIds, configured } = resolveTwitchAccountContext(cfg, accountId);
		if (!account) throw new Error(`Twitch account not found: ${accountId ?? normalizedAccountId}. Available accounts: ${availableAccountIds.join(", ") || "none"}`);
		const channel = to || account.channel;
		if (!channel) throw new Error("No channel specified and no default channel in account config");
		if (!configured) throw new Error(`Account ${normalizedAccountId} is not properly configured. Required: username, clientId, and accessToken (config or env for default account).`);
		const deliveryChannel = normalizeTwitchChannel(channel) || account.channel;
		if (!deliveryChannel) throw new Error("No channel specified and no default channel in account config");
		const result = await sendMessageTwitchInternal({
			channel: normalizeTwitchChannel(deliveryChannel),
			text,
			cfg,
			account,
			accountId: normalizedAccountId,
			clientManager: getClientManager(normalizedAccountId)
		});
		return {
			channel: "twitch",
			...result.outcome ? { outcome: result.outcome } : {},
			messageId: result.messageId,
			receipt: result.receipt,
			timestamp: Date.now()
		};
	},
	sendMedia: async (params) => {
		const { text, mediaUrl } = params;
		if (params.signal?.aborted) throw new Error("Outbound delivery aborted");
		const message = mediaUrl ? `${text || ""} ${mediaUrl}`.trim() : text;
		return twitchOutbound.sendText({
			...params,
			text: message
		});
	}
};
const twitchMessageAdapter = createChannelMessageAdapterFromOutbound({
	id: "twitch",
	outbound: twitchOutbound
});
//#endregion
//#region extensions/twitch/src/probe.ts
async function probeTwitch(account, timeoutMs) {
	let client;
	try {
		return await runChannelProbe(void 0, async () => {
			if (!account.accessToken || !account.username) return {
				ok: false,
				error: "missing credentials (accessToken, username)",
				username: account.username
			};
			const rawToken = normalizeToken(account.accessToken.trim());
			const authProvider = new StaticAuthProvider(account.clientId ?? "", rawToken);
			const probeClient = new ChatClient({ authProvider });
			client = probeClient;
			const connectionPromise = new Promise((resolve, reject) => {
				let settled = false;
				const cleanup = () => {
					if (settled) return;
					settled = true;
					connectListener?.unbind();
					disconnectListener?.unbind();
					authFailListener?.unbind();
				};
				const connectListener = client?.onConnect(() => {
					cleanup();
					resolve();
				});
				const disconnectListener = client?.onDisconnect((_manually, reason) => {
					cleanup();
					reject(reason || /* @__PURE__ */ new Error("Disconnected"));
				});
				const authFailListener = client?.onAuthenticationFailure(() => {
					cleanup();
					reject(/* @__PURE__ */ new Error("Authentication failed"));
				});
			});
			await raceWithTimeout(() => {
				probeClient.connect();
				return connectionPromise;
			}, timeoutMs, () => {
				throw new Error(`timeout after ${timeoutMs}ms`);
			});
			client.quit();
			client = void 0;
			return {
				ok: true,
				connected: true,
				username: account.username,
				channel: account.channel
			};
		}, (error) => ({
			ok: false,
			error: formatErrorMessage(error),
			username: account.username,
			channel: account.channel
		}));
	} finally {
		if (client) try {
			client.quit();
		} catch {}
	}
}
//#endregion
//#region extensions/twitch/src/resolver.ts
const TWITCH_HELIX_USER_LOOKUP_TIMEOUT_MS = 1e4;
function normalizeUsername(input) {
	const trimmed = input.trim();
	if (trimmed.startsWith("@")) return normalizeLowercaseStringOrEmpty(trimmed.slice(1));
	return normalizeLowercaseStringOrEmpty(trimmed);
}
function createHelixUserResolver(clientId, accessToken) {
	let tokenValidated = false;
	return async (query) => {
		const controller = new AbortController();
		const fetchOptions = { signal: controller.signal };
		const request = (async () => {
			if (!tokenValidated) {
				let tokenInfo;
				try {
					tokenInfo = await callTwitchApi({
						type: "auth",
						url: "validate"
					}, clientId, accessToken, void 0, fetchOptions);
				} catch (error) {
					if (error instanceof HttpStatusCodeError && error.statusCode === 401) throw new Error("Invalid token supplied", { cause: error });
					throw error;
				}
				if (!tokenInfo.user_id) throw new Error("Trying to use an app access token as a user access token");
				tokenValidated = true;
			}
			return (await callTwitchApi({
				type: "helix",
				url: "users",
				query
			}, clientId, accessToken, void 0, fetchOptions)).data[0] ?? null;
		})();
		try {
			return await withTimeout(request, TWITCH_HELIX_USER_LOOKUP_TIMEOUT_MS, "Twitch Helix user lookup");
		} finally {
			controller.abort();
		}
	};
}
async function resolveTwitchTargets(inputs, account, _kind, log) {
	if (!account.clientId || !account.accessToken) {
		log?.error("Missing Twitch client ID or accessToken");
		return inputs.map((input) => ({
			input,
			resolved: false,
			note: "missing Twitch credentials"
		}));
	}
	const normalizedToken = normalizeToken(account.accessToken);
	const resolveHelixUser = createHelixUserResolver(account.clientId, normalizedToken);
	const results = [];
	for (const input of inputs) {
		const normalized = normalizeUsername(input);
		if (!normalized) {
			results.push({
				input,
				resolved: false,
				note: "empty input"
			});
			continue;
		}
		const looksLikeUserId = /^\d+$/.test(normalized);
		try {
			const user = await resolveHelixUser(looksLikeUserId ? { id: normalized } : { login: normalized });
			if (user) {
				results.push({
					input,
					resolved: true,
					id: user.id,
					name: user.login,
					...!looksLikeUserId ? { note: user.display_name !== user.login ? `display: ${user.display_name}` : void 0 } : {}
				});
				log?.debug?.(looksLikeUserId ? `Resolved user ID ${normalized} -> ${user.login}` : `Resolved username ${normalized} -> ${user.id} (${user.login})`);
			} else {
				results.push({
					input,
					resolved: false,
					note: looksLikeUserId ? "user ID not found" : "username not found"
				});
				log?.warn(`${looksLikeUserId ? "User ID" : "Username"} ${normalized} not found`);
			}
		} catch (error) {
			const errorMessage = formatErrorMessage(error);
			results.push({
				input,
				resolved: false,
				note: `API error: ${errorMessage}`
			});
			log?.error(`Failed to resolve ${input}: ${errorMessage}`);
		}
	}
	return results;
}
//#endregion
//#region extensions/twitch/src/status.ts
function collectTwitchStatusIssues(accounts) {
	const issues = [];
	for (const entry of accounts) {
		const accountId = entry.accountId;
		if (!accountId) continue;
		if (!entry.configured) {
			issues.push({
				channel: "twitch",
				accountId,
				kind: "config",
				message: "Twitch account is not properly configured",
				fix: "Add required fields: username, accessToken, and clientId to your account configuration"
			});
			continue;
		}
		if (entry.enabled === false) {
			issues.push({
				channel: "twitch",
				accountId,
				kind: "config",
				message: "Twitch account is disabled",
				fix: "Set enabled: true in your account configuration to enable this account"
			});
			continue;
		}
		if (entry.lastError) issues.push({
			channel: "twitch",
			accountId,
			kind: "runtime",
			message: `Last error: ${entry.lastError}`,
			fix: "Check your token validity and network connection. Ensure the bot has the required OAuth scopes."
		});
		if (entry.configured && !entry.running && !entry.lastStartAt && !entry.lastInboundAt && !entry.lastOutboundAt) issues.push({
			channel: "twitch",
			accountId,
			kind: "runtime",
			message: "Account has never connected successfully",
			fix: "Start the Twitch gateway to begin receiving messages. Check logs for connection errors."
		});
		if (entry.running && entry.lastStartAt) {
			const daysSinceStart = (Date.now() - entry.lastStartAt) / 864e5;
			if (daysSinceStart > 7) issues.push({
				channel: "twitch",
				accountId,
				kind: "runtime",
				message: `Connection has been running for ${Math.floor(daysSinceStart)} days`,
				fix: "Consider restarting the connection periodically to refresh the connection. Twitch tokens may expire after long periods."
			});
		}
	}
	return issues;
}
//#endregion
//#region extensions/twitch/src/plugin.ts
function normalizeTwitchMessagingTarget(target) {
	const providerTarget = stripChannelTargetPrefix(target, "twitch", "twitch-chat");
	const kindMatch = /^(user|dm|channel|group|conversation|room):/i.exec(providerTarget);
	const kind = kindMatch?.[1]?.toLowerCase();
	if (kind === "user" || kind === "dm") return "";
	const channelTarget = kindMatch ? providerTarget.slice(kindMatch[0].length) : providerTarget;
	return normalizeTwitchChannel(channelTarget);
}
const twitchPlugin = createChatChannelPlugin({
	pairing: {
		idLabel: "twitchUserId",
		normalizeAllowEntry: createPairingPrefixStripper(/^(twitch:)?user:?/i),
		notifyApproval: createLoggedPairingApprovalNotifier(({ id }) => `Pairing approved for user ${id} (notification sent via chat if possible)`, console.warn)
	},
	threading: { matchesToolContextTarget: ({ target, toolContext }) => {
		const channel = normalizeTwitchMessagingTarget(target);
		return Boolean(channel) && [toolContext.currentChannelId, toolContext.currentMessagingTarget].some((current) => current != null && normalizeTwitchMessagingTarget(current) === channel);
	} },
	outbound: twitchOutbound,
	base: {
		id: "twitch",
		meta: {
			id: "twitch",
			label: "Twitch",
			selectionLabel: "Twitch (Chat)",
			docsPath: "/channels/twitch",
			blurb: "Twitch chat integration",
			aliases: ["twitch-chat"]
		},
		setupContract: twitchSetupPlugin.setupContract,
		setupWizard: twitchSetupPlugin.setupWizard,
		reload: twitchSetupPlugin.reload,
		capabilities: { chatTypes: ["group"] },
		messaging: {
			normalizeTarget: normalizeTwitchMessagingTarget,
			targetResolver: {
				looksLikeId: (input) => Boolean(normalizeTwitchMessagingTarget(input)),
				hint: "<channel-name>"
			},
			inferTargetChatType: ({ to }) => normalizeTwitchMessagingTarget(to) ? "group" : void 0,
			resolveOutboundSessionRoute: ({ cfg, agentId, accountId, target }) => {
				const channel = normalizeTwitchMessagingTarget(target);
				if (!channel) return null;
				return buildChannelOutboundSessionRoute({
					cfg,
					agentId,
					channel: "twitch",
					accountId,
					recipientSessionExact: true,
					peer: {
						kind: "group",
						id: channel
					},
					chatType: "group",
					from: `twitch:channel:${channel}`,
					to: channel
				});
			}
		},
		message: twitchMessageAdapter,
		configSchema: buildChannelConfigSchema(TwitchConfigSchema),
		config: {
			...twitchConfigAdapter,
			describeAccount: (account) => account ? describeAccountSnapshot({
				account,
				configured: isAccountConfigured(account, account.accessToken)
			}) : {
				accountId: DEFAULT_ACCOUNT_ID$1,
				enabled: false,
				configured: false
			}
		},
		actions: twitchMessageActions,
		resolver: { resolveTargets: async ({ cfg, accountId, inputs, kind, runtime }) => {
			const account = getAccountConfig(cfg, accountId ?? resolveDefaultTwitchAccountId(cfg));
			if (!account) return inputs.map((input) => ({
				input,
				resolved: false,
				note: "account not configured"
			}));
			return await resolveTwitchTargets(inputs, account, kind, {
				info: (msg) => runtime.log(msg),
				warn: (msg) => runtime.log(msg),
				error: (msg) => runtime.error(msg),
				debug: (msg) => runtime.log(msg)
			});
		} },
		status: createComputedAccountStatusAdapter({
			defaultRuntime: createDefaultChannelRuntimeState(DEFAULT_ACCOUNT_ID$1),
			buildChannelSummary: ({ snapshot }) => buildPassiveProbedChannelStatusSummary(snapshot),
			probeAccount: async ({ account, timeoutMs }) => await probeTwitch(account, timeoutMs),
			collectStatusIssues: collectTwitchStatusIssues,
			resolveAccountSnapshot: ({ account, cfg }) => {
				const { configured } = resolveTwitchAccountContext(cfg, account.accountId);
				return {
					accountId: account.accountId,
					enabled: account.enabled !== false,
					configured
				};
			}
		}),
		gateway: {
			startAccount: async (ctx) => {
				const account = ctx.account;
				const accountId = ctx.accountId;
				const channelRuntime = ctx.channelRuntime;
				if (!channelRuntime?.inbound?.buildContext) throw new Error("Twitch requires its registered channel runtime context builder");
				const statusSink = createAccountStatusSink({
					accountId,
					setStatus: ctx.setStatus
				});
				statusSink({
					running: true,
					lastStartAt: Date.now(),
					lastError: null,
					lifecycle: "starting"
				});
				ctx.log?.info(`Starting Twitch connection for ${account.username}`);
				try {
					await runPassiveAccountLifecycle({
						abortSignal: ctx.abortSignal,
						start: async () => {
							const { monitorTwitchProvider } = await import("./monitor-DXLeJigj.mjs");
							return monitorTwitchProvider({
								account,
								accountId,
								channelRuntime,
								config: ctx.cfg,
								runtime: ctx.runtime,
								abortSignal: ctx.abortSignal,
								statusSink
							});
						},
						stop: async (monitor) => {
							await monitor.stop();
						}
					});
				} catch (error) {
					ctx.setStatus?.({
						accountId,
						running: false,
						lastStopAt: Date.now()
					});
					throw error;
				}
			},
			stopAccount: async (ctx) => {
				const account = ctx.account;
				const accountId = ctx.accountId;
				await removeClientManager(accountId);
				ctx.setStatus?.({
					accountId,
					running: false,
					lastStopAt: Date.now()
				});
				ctx.log?.info(`Stopped Twitch connection for ${account.username}`);
			}
		}
	}
});
//#endregion
export { sendMessageTwitchInternal as n, getOrCreateClientManager as r, twitchPlugin as t };
