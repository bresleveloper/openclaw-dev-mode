import { a as resolveTwitchAccountContext, c as normalizeToken, i as resolveDefaultTwitchAccountId, l as normalizeTwitchChannel, n as DEFAULT_ACCOUNT_ID$1, o as twitchConfigAdapter, r as getAccountConfig, s as isAccountConfigured, t as twitchSetupPlugin, u as resolveTwitchToken } from "./setup-surface-mdCyd7g7.mjs";
import { StaticAuthProvider, accessTokenIsExpired, getTokenInfo } from "@twurple/auth";
import { ChatClient, LogLevel } from "@twurple/chat";
import { describeAccountSnapshot } from "openclaw/plugin-sdk/account-helpers";
import { MarkdownConfigSchema, buildChannelConfigSchema } from "openclaw/plugin-sdk/channel-config-schema";
import { buildChannelOutboundSessionRoute, createChatChannelPlugin, stripChannelTargetPrefix } from "openclaw/plugin-sdk/channel-core";
import { createAccountStatusSink, createChannelMessageAdapterFromOutbound, createMessageReceiptFromOutboundResults, runPassiveAccountLifecycle } from "openclaw/plugin-sdk/channel-outbound";
import { createLoggedPairingApprovalNotifier, createPairingPrefixStripper } from "openclaw/plugin-sdk/channel-pairing";
import { formatErrorMessage } from "openclaw/plugin-sdk/error-runtime";
import { buildPassiveProbedChannelStatusSummary } from "openclaw/plugin-sdk/extension-shared";
import { createComputedAccountStatusAdapter, createDefaultChannelRuntimeState } from "openclaw/plugin-sdk/status-helpers";
import { runChannelProbe, withTimeout } from "openclaw/plugin-sdk/text-utility-runtime";
import { raceWithTimeout } from "openclaw/plugin-sdk/time-runtime";
import { DEFAULT_ACCOUNT_ID, normalizeAccountId } from "openclaw/plugin-sdk/account-resolution";
import { createChannelPartialDeliveryError, isChannelPartialDeliveryError } from "openclaw/plugin-sdk/channel-inbound";
import { captureEffectAuthority } from "openclaw/plugin-sdk/fetch-runtime";
import { channelReadyPatch } from "openclaw/plugin-sdk/gateway-runtime";
import { chunkTextForOutbound, sanitizeAssistantVisibleText, stripMarkdown } from "openclaw/plugin-sdk/text-chunking";
import { createHash, randomUUID } from "node:crypto";
import { isDeepStrictEqual } from "node:util";
import { readProviderJsonObjectResponse } from "openclaw/plugin-sdk/provider-http";
import { createOAuthRefreshError, createOAuthRefreshResponseError, isRecoverableOAuthRefreshFailure, readOAuthRefreshErrorReason } from "openclaw/plugin-sdk/provider-oauth-runtime";
import { fetchWithSsrFGuard } from "openclaw/plugin-sdk/ssrf-runtime";
import { normalizeLowercaseStringOrEmpty, normalizeStringEntries } from "openclaw/plugin-sdk/string-coerce-runtime";
import { createPluginRuntimeStore } from "openclaw/plugin-sdk/runtime-store";
import { z } from "zod";
import { HttpStatusCodeError, callTwitchApi } from "@twurple/api-call";
// extensions/twitch/src/runtime.ts
const { setRuntime: setTwitchRuntime, getRuntime: getTwitchRuntime } = createPluginRuntimeStore({
	pluginId: "twitch",
	errorMessage: "Twitch runtime not initialized"
});
// extensions/twitch/src/oauth-owner.ts
const tasks = /* @__PURE__ */ new WeakMap();
function lineageOf(account, token) {
	return createHash("sha256").update(JSON.stringify([
		account.username.toLowerCase(),
		account.clientId,
		account.clientSecret,
		token,
		account.refreshToken,
		account.expiresIn,
		account.obtainmentTimestamp
	])).digest("hex");
}
async function exchange(account, refreshToken, assertCurrent) {
	let dispatched = false;
	const { response, release } = await fetchWithSsrFGuard({
		url: "https://id.twitch.tv/oauth2/token",
		policy: { allowedHostnames: ["id.twitch.tv"] },
		requireHttps: true,
		timeoutMs: 3e4,
		auditContext: "twitch.oauth.refresh",
		beforeRequest: () => {
			assertCurrent();
			dispatched = true;
		},
		init: {
			method: "POST",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
				Accept: "application/json"
			},
			body: new URLSearchParams({
				client_id: account.clientId,
				client_secret: account.clientSecret,
				grant_type: "refresh_token",
				refresh_token: refreshToken
			})
		}
	}).catch((cause) => {
		throw createOAuthRefreshError("Twitch OAuth refresh transport failed", dispatched ? {
			version: 1,
			phase: "token-response",
			outcome: "unknown"
		} : {
			version: 1,
			phase: "before-dispatch",
			outcome: "not-attempted",
			recovery: {
				kind: "later",
				evidence: "dispatch-not-started"
			}
		}, { cause });
	});
	try {
		let payload;
		try {
			payload = await readProviderJsonObjectResponse(response, "Twitch OAuth refresh", { maxBytes: 262144 });
		} catch {
			throw createOAuthRefreshError("Twitch OAuth refresh returned an unreadable response", {
				version: 1,
				phase: "after-token-response",
				outcome: "unknown",
				status: response.status
			});
		}
		if (!response.ok || readOAuthRefreshErrorReason(payload)) throw createOAuthRefreshResponseError("Twitch OAuth refresh", response.status, payload);
		if (typeof payload.access_token !== "string" || !payload.access_token.trim() || typeof payload.refresh_token !== "string" || !payload.refresh_token.trim() || typeof payload.expires_in !== "number" || !Number.isFinite(payload.expires_in) || payload.expires_in < 0 || !Array.isArray(payload.scope) || !payload.scope.every((scope) => typeof scope === "string") || typeof payload.token_type !== "string" || payload.token_type.toLowerCase() !== "bearer") throw createOAuthRefreshError("Twitch OAuth refresh returned invalid tokens", {
			version: 1,
			phase: "after-token-response",
			outcome: "unknown",
			status: response.status
		});
		return {
			accessToken: payload.access_token,
			refreshToken: payload.refresh_token,
			expiresIn: payload.expires_in,
			scope: payload.scope,
			obtainmentTimestamp: Date.now()
		};
	} finally {
		await release();
	}
}
/** One durable channel-account owner, including the initial and IRC-requested refresh. */
async function createManagedTwitchAuthProvider(account, token, accountId) {
	const clientId = account.clientId;
	if (!clientId) throw new Error("Twitch OAuth requires a client ID");
	const runtime = getTwitchRuntime();
	const id = normalizeAccountId(accountId);
	const lineage = lineageOf(account, token);
	const assertCurrent = () => {
		if (getTwitchRuntime() !== runtime) throw new Error("Twitch OAuth runtime changed");
		const cfg = runtime.config.current({ clone: true });
		const current = getAccountConfig(cfg, id);
		if (cfg.channels?.twitch?.enabled === false || current?.enabled === false) throw new Error("Twitch account is disabled; enable it before using its OAuth grant");
		const currentToken = normalizeToken(resolveTwitchToken(cfg, id).token);
		if (!current || lineageOf(current, currentToken) !== lineage) throw new Error("Twitch OAuth account changed; retry with its current configuration");
	};
	assertCurrent();
	const namespace = "oauth-" + id;
	const key = runtime.state.resolveStateDir() + ":" + id + ":" + lineage;
	const resolve = async (force = false) => {
		assertCurrent();
		let active = tasks.get(runtime);
		if (!active) {
			active = /* @__PURE__ */ new Map();
			tasks.set(runtime, active);
		}
		const pending = active.get(key);
		if (pending) return await pending;
		const task = (async () => {
			const store = runtime.state.openKeyedStoreV2({
				namespace,
				maxEntries: 1,
				overflowPolicy: "reject-new"
			}, { assertCurrent });
			let observed = await store.observe("current");
			if (observed.value?.lineage !== lineage) {
				const initialized = await store.compareAndApply("current", observed.comparison, {
					operation: "update",
					action: "set",
					value: {
						lineage,
						token: {
							accessToken: token,
							refreshToken: account.refreshToken ?? null,
							expiresIn: account.expiresIn ?? null,
							obtainmentTimestamp: account.obtainmentTimestamp ?? Date.now(),
							scope: []
						}
					}
				});
				observed = initialized.status === "conflict" ? initialized.current : await store.observe("current");
			}
			const validateCompleted = async (claim) => {
				assertCurrent();
				const info = await getTokenInfo(claim.completed.accessToken, clientId);
				assertCurrent();
				const current = await store.observe("current");
				if (!isDeepStrictEqual(current.value, claim)) throw new Error("Twitch OAuth refresh owner changed before validation");
				if (!info.userId || info.userName?.toLowerCase() !== account.username.toLowerCase() || claim.expectedUserId && info.userId !== claim.expectedUserId) {
					await store.compareAndApply("current", current.comparison, {
						operation: "update",
						action: "set",
						value: {
							lineage,
							claim: claim.claim
						}
					});
					throw new Error("Twitch OAuth refresh returned a different account; reauthorize the configured grant");
				}
				const replacement = {
					...claim.completed,
					userId: info.userId
				};
				if ((await store.compareAndApply("current", current.comparison, {
					operation: "update",
					action: "set",
					value: {
						lineage,
						token: replacement
					}
				})).status !== "applied") throw new Error("Twitch OAuth refresh owner changed before settlement");
				assertCurrent();
				return replacement;
			};
			if (observed.value?.lineage === lineage && "claim" in observed.value && observed.value.completed) return await validateCompleted({
				...observed.value,
				completed: observed.value.completed
			});
			assertCurrent();
			if (!observed.value || observed.value.lineage !== lineage || !("token" in observed.value)) throw new Error("Twitch OAuth refresh is pending or its outcome is uncertain; reauthorize the configured grant");
			const original = observed.value.token;
			if (!force && !accessTokenIsExpired(original)) return original;
			if (!original.refreshToken) throw new Error("Twitch OAuth refresh requires a refresh token");
			const claim = {
				lineage,
				claim: randomUUID()
			};
			if ((await store.compareAndApply("current", observed.comparison, {
				operation: "update",
				action: "set",
				value: claim
			})).status !== "applied") throw new Error("Twitch OAuth grant changed before refresh; retry with its current owner");
			const settle = async (replacement) => {
				const current = await store.observe("current");
				if (!isDeepStrictEqual(current.value, claim)) throw new Error("Twitch OAuth refresh owner changed before settlement");
				if ((await store.compareAndApply("current", current.comparison, {
					operation: "update",
					action: "set",
					value: {
						lineage,
						token: replacement
					}
				})).status !== "applied") throw new Error("Twitch OAuth refresh owner changed before settlement");
				assertCurrent();
			};
			assertCurrent();
			let refreshed;
			try {
				refreshed = await exchange(account, original.refreshToken, assertCurrent);
			} catch (error) {
				if (isRecoverableOAuthRefreshFailure(error)) await settle(original);
				throw error;
			}
			const completed = {
				...claim,
				completed: refreshed,
				...original.userId ? { expectedUserId: original.userId } : {}
			};
			const current = await store.observe("current");
			if (!isDeepStrictEqual(current.value, claim)) throw new Error("Twitch OAuth refresh owner changed before completion");
			if ((await store.compareAndApply("current", current.comparison, {
				operation: "update",
				action: "set",
				value: completed
			})).status !== "applied") throw new Error("Twitch OAuth refresh owner changed before completion");
			return await validateCompleted(completed);
		})();
		active.set(key, task);
		try {
			return await task;
		} finally {
			if (active.get(key) === task) active.delete(key);
		}
	};
	let grant = await resolve();
	let staticProvider = new StaticAuthProvider(clientId, grant);
	const prepare = async (force = false) => {
		const current = await resolve(force);
		if (current.accessToken !== grant.accessToken) staticProvider = new StaticAuthProvider(clientId, current);
		grant = current;
		assertCurrent();
		return staticProvider;
	};
	return {
		clientId,
		hasClientSecret: true,
		getCurrentScopesForUser: () => staticProvider.getCurrentScopesForUser(),
		async getAccessTokenForUser(user, ...scopeSets) {
			const result = await (await prepare()).getAccessTokenForUser(user, ...scopeSets);
			assertCurrent();
			return result;
		},
		async getAccessTokenForIntent(intent, ...scopeSets) {
			if (intent !== "chat") return null;
			const result = await (await prepare()).getAccessTokenForIntent(intent, ...scopeSets);
			assertCurrent();
			return result;
		},
		async getAnyAccessToken() {
			const result = await (await prepare()).getAnyAccessToken();
			assertCurrent();
			return result;
		},
		async refreshAccessTokenForIntent(intent) {
			if (intent !== "chat") throw new Error("Unknown Twitch OAuth intent");
			const result = await (await prepare(true)).getAccessTokenForIntent(intent);
			assertCurrent();
			return result;
		},
		async refreshAccessTokenForUser(user) {
			const result = await (await prepare(true)).getAccessTokenForUser(user);
			assertCurrent();
			return result;
		}
	};
}
// extensions/twitch/src/twitch-client.ts
var TwitchClientManager = class {
	constructor(logger, statusSink) {
		this.logger = logger;
		this.statusSink = statusSink;
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
	async getClient(account, cfg, accountId) {
		if (this.client) return this.client;
		if (this.connectionPromise) return this.connectionPromise;
		const connection = this.createConnectedClient(account, () => this.connectionPromise === connection, cfg, accountId);
		this.connectionPromise = connection;
		try {
			return await connection;
		} finally {
			if (this.connectionPromise === connection) this.connectionPromise = void 0;
		}
	}
	async createConnectedClient(account, ownsConnection, cfg, accountId) {
		const tokenResolution = resolveTwitchToken(cfg, accountId);
		if (!tokenResolution.token) {
			const resolvedAccountId = accountId ?? DEFAULT_ACCOUNT_ID;
			const tokenConfigPath = cfg?.channels?.twitch?.accounts ? `channels.twitch.accounts.${resolvedAccountId}.accessToken` : "channels.twitch.accessToken";
			throw new Error(`Missing Twitch token for account ${resolvedAccountId} (set ${tokenConfigPath} or OPENCLAW_TWITCH_ACCESS_TOKEN for default)`);
		}
		if (!account.clientId) throw new Error(`Missing Twitch client ID for account ${account.username}`);
		const normalizedToken = normalizeToken(tokenResolution.token);
		const clientId = account.clientId;
		const authProvider = await (account.clientSecret && account.refreshToken ? createManagedTwitchAuthProvider(account, normalizedToken, accountId) : new StaticAuthProvider(clientId, normalizedToken));
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
							this.logger.error(message.startsWith("Error parsing message: ") ? "Twitch IRC message parsing failed" : message);
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
		this.pendingClient = client;
		try {
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
					if (authRetryPending && !manual) return;
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
			if (this.pendingClient !== client) {
				client.quit();
				throw new Error(`Twitch connection cancelled for ${account.username}`);
			}
		} finally {
			if (this.pendingClient === client) this.pendingClient = void 0;
		}
		client.onMessage((channelName, _user, messageText, msg) => {
			const handler = this.messageHandler?.handler;
			if (handler) handler({
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
		});
		client.onAuthenticationSuccess(() => this.publishReady());
		client.onAuthenticationFailure((text) => {
			this.publishRecovering(text);
		});
		client.onDisconnect((manual, reason) => {
			if (!manual) this.publishRecovering(reason ? formatErrorMessage(reason) : "Twitch connection lost");
		});
		this.client = client;
		this.logger.info(`Connected to Twitch as ${account.username}`);
		return client;
	}
	onMessage(handler) {
		const registration = { handler };
		this.messageHandler = registration;
		return () => {
			if (this.messageHandler === registration) this.messageHandler = void 0;
		};
	}
	async disconnectAll() {
		this.pendingClient?.quit();
		this.client?.quit();
		this.pendingClient = void 0;
		this.connectionPromise = void 0;
		this.client = void 0;
		this.messageHandler = void 0;
	}
	async sendMessage(account, channel, message, cfg, accountId) {
		const effect = captureEffectAuthority();
		let preparingUse = false;
		try {
			const client = await this.getClient(account, cfg, accountId);
			const messageId = crypto.randomUUID();
			const chunks = chunkTextForOutbound(message, 500);
			preparingUse = true;
			const results = await effect.initiate(() => {
				preparingUse = false;
				return Promise.allSettled(chunks.map(async (chunk) => client.say(channel, chunk)));
			});
			const failure = results.find((result) => result.status === "rejected");
			if (failure) {
				if (results.some((result) => result.status === "fulfilled")) throw createChannelPartialDeliveryError(failure.reason, {
					messageIds: [messageId],
					visibleReplySent: true
				});
				throw failure.reason;
			}
			return {
				ok: true,
				messageId
			};
		} catch (error) {
			if (preparingUse || isChannelPartialDeliveryError(error)) throw error;
			return {
				ok: false,
				error: formatErrorMessage(error)
			};
		}
	}
};
// extensions/twitch/src/client-manager-registry.ts
const registry = /* @__PURE__ */ new Map();
function getOrCreateClientManager(accountId, logger, statusSink) {
	const existing = registry.get(accountId);
	if (existing) {
		existing.setStatusSink(statusSink);
		return existing;
	}
	const manager = new TwitchClientManager(logger, statusSink);
	registry.set(accountId, manager);
	return manager;
}
function getClientManager(accountId) {
	return registry.get(accountId);
}
async function removeClientManager(accountId) {
	const manager = registry.get(accountId);
	if (!manager) return;
	registry.delete(accountId);
	await manager.disconnectAll();
}
// extensions/twitch/src/config-schema.ts
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
// extensions/twitch/src/send.ts
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
	const cleanedText = stripMarkdown(params.text, { linkStyle: "label-and-url" }).replace(/\r/g, "").replace(/[ \t]+\n/g, "\n").replace(/\n/g, " ").replace(/[ \t]{2,}/g, " ").trim();
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
// extensions/twitch/src/target.ts
function parseTwitchMessagingTarget(target) {
	const providerTarget = stripChannelTargetPrefix(target, "twitch", "twitch-chat");
	const kindMatch = /^(user|dm|channel|group|conversation|room):/i.exec(providerTarget);
	const kind = kindMatch?.[1]?.toLowerCase();
	return {
		channelTarget: kindMatch ? providerTarget.slice(kindMatch[0].length) : providerTarget,
		isDirectMessage: kind === "user" || kind === "dm"
	};
}
/**
* Normalizes a Twitch messaging target to the bare channel name used by routing
* and the chat transport. Accepts internal addresses such as
* `twitch:channel:<channel>` and their `twitch-chat:` alias. Direct-message
* targets are unsupported and normalize to an empty string.
*/
function normalizeTwitchMessagingTarget(target) {
	const parsed = parseTwitchMessagingTarget(target);
	return parsed.isDirectMessage ? "" : normalizeTwitchChannel(parsed.channelTarget);
}
/** Direct-message/user addresses are unsupported and must not fall back to a channel. */
function isTwitchDirectMessageTarget(target) {
	return parseTwitchMessagingTarget(target).isDirectMessage;
}
// extensions/twitch/src/outbound.ts
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
		const allowList = allowListRaw.filter((entry) => entry !== "*").map((entry) => normalizeTwitchMessagingTarget(entry)).filter((entry) => entry.length > 0);
		const normalizedTo = normalizeTwitchMessagingTarget(trimmed);
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
		const target = to.trim();
		if (isTwitchDirectMessageTarget(target)) throw new Error("Delivering to Twitch requires target <channel-name>");
		const deliveryChannel = normalizeTwitchMessagingTarget(target) || normalizeTwitchChannel(account.channel);
		if (!deliveryChannel) throw new Error("No channel specified and no default channel in account config");
		if (!configured) throw new Error(`Account ${normalizedAccountId} is not properly configured. Required: username, clientId, and accessToken (config or env for default account).`);
		const result = await sendMessageTwitchInternal({
			channel: deliveryChannel,
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
// extensions/twitch/src/resolver.ts
const TWITCH_HELIX_USER_LOOKUP_TIMEOUT_MS = 1e4;
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
	const clientId = account.clientId;
	let tokenValidated = false;
	async function resolveHelixUser(query) {
		const controller = new AbortController();
		const fetchOptions = { signal: controller.signal };
		const request = (async () => {
			if (!tokenValidated) {
				let tokenInfo;
				try {
					tokenInfo = await callTwitchApi({
						type: "auth",
						url: "validate"
					}, clientId, normalizedToken, void 0, fetchOptions);
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
			}, clientId, normalizedToken, void 0, fetchOptions)).data[0] ?? null;
		})();
		try {
			return await withTimeout(request, TWITCH_HELIX_USER_LOOKUP_TIMEOUT_MS, "Twitch Helix user lookup");
		} finally {
			controller.abort();
		}
	}
	const results = [];
	for (const input of inputs) {
		const trimmed = input.trim();
		const normalized = normalizeLowercaseStringOrEmpty(trimmed.startsWith("@") ? trimmed.slice(1) : trimmed);
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
// extensions/twitch/src/plugin.ts
function readSendValue(value) {
	return typeof value === "string" || typeof value === "number" || typeof value === "boolean" ? String(value).trim() : void 0;
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
		actions: {
			describeMessageTool: () => ({ actions: ["send"] }),
			supportsAction: ({ action }) => action === "send",
			extractToolSend: ({ args }) => {
				const to = readSendValue(args.to);
				const message = readSendValue(args.message);
				return to && message ? {
					to,
					message
				} : null;
			}
		},
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
			probeAccount: async ({ account, timeoutMs }) => {
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
								authSuccessListener.unbind();
								disconnectListener.unbind();
								authFailListener.unbind();
							};
							const authSuccessListener = probeClient.onAuthenticationSuccess(() => {
								cleanup();
								resolve();
							});
							const disconnectListener = probeClient.onDisconnect((_manually, reason) => {
								cleanup();
								reject(reason || /* @__PURE__ */ new Error("Disconnected"));
							});
							const authFailListener = probeClient.onAuthenticationFailure(() => {
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
			},
			collectStatusIssues: (accounts) => {
				const issues = [];
				for (const entry of accounts) {
					const accountId = entry.accountId;
					if (!accountId) continue;
					const addIssue = (kind, message, fix) => issues.push({
						channel: "twitch",
						accountId,
						kind,
						message,
						fix
					});
					if (!entry.configured) {
						addIssue("config", "Twitch account is not properly configured", "Add required fields: username, accessToken, and clientId to your account configuration");
						continue;
					}
					if (entry.enabled === false) {
						addIssue("config", "Twitch account is disabled", "Set enabled: true in your account configuration to enable this account");
						continue;
					}
					if (entry.lastError) addIssue("runtime", `Last error: ${entry.lastError}`, "Check your token validity and network connection. Check that the bot has the required OAuth scopes.");
					if (!entry.running && !entry.lastStartAt && !entry.lastInboundAt && !entry.lastOutboundAt) addIssue("runtime", "Account has never connected successfully", "Start the Twitch gateway to begin receiving messages. Check logs for connection errors.");
					if (entry.running && entry.lastStartAt) {
						const daysSinceStart = (Date.now() - entry.lastStartAt) / 864e5;
						if (daysSinceStart > 7) addIssue("runtime", `Connection has been running for ${Math.floor(daysSinceStart)} days`, "Consider restarting the connection periodically to refresh the connection. Twitch tokens may expire after long periods.");
					}
				}
				return issues;
			},
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
							const { monitorTwitchProvider } = await import("./monitor-DfA87gBg.mjs");
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
export { setTwitchRuntime as a, getTwitchRuntime as i, sendMessageTwitchInternal as n, getOrCreateClientManager as r, twitchPlugin as t };
