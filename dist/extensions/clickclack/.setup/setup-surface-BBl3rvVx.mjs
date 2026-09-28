import { createRequire } from "node:module";
import { createAccountListHelpers, hasConfiguredAccountValue } from "openclaw/plugin-sdk/account-helpers";
import { DEFAULT_ACCOUNT_ID, DEFAULT_ACCOUNT_ID as DEFAULT_ACCOUNT_ID$2, normalizeAccountId } from "openclaw/plugin-sdk/account-id";
import { resolveNormalizedAccountEntry } from "openclaw/plugin-sdk/account-resolution-runtime";
import { resolveIntegerOption } from "openclaw/plugin-sdk/number-runtime";
import { mergePairLoopGuardConfig } from "openclaw/plugin-sdk/pair-loop-guard-runtime";
import { tryReadSecretFileSync } from "openclaw/plugin-sdk/secret-file-runtime";
import { buildSecretInputSchema, normalizeSecretInputString, resolveSecretInputString } from "openclaw/plugin-sdk/secret-input";
import { canResolveEnvSecretRefInReadOnlyPath } from "openclaw/plugin-sdk/secret-ref-readonly";
import { normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
import { getChatChannelMeta } from "openclaw/plugin-sdk/channel-plugin-common";
import { ChannelBotLoopProtectionSchema, buildChannelAllowBotsSchema, buildChannelConfigSchema, buildMultiAccountChannelSchema } from "openclaw/plugin-sdk/channel-config-schema";
import { z } from "zod";
import { formatErrorMessage } from "openclaw/plugin-sdk/error-runtime";
import { bufferToBlobPart } from "openclaw/plugin-sdk/blob-runtime";
import { redactToolPayloadText } from "openclaw/plugin-sdk/logging-core";
import { readProviderJsonResponse, readResponseTextLimited } from "openclaw/plugin-sdk/provider-http";
import path from "node:path";
import { defineChannelSetupContract } from "openclaw/plugin-sdk/channel-setup";
import { DEFAULT_ACCOUNT_ID as DEFAULT_ACCOUNT_ID$1, applyAccountNameToChannelSection, baseUrlTextInput, createSetupTranslator, createStandardChannelSetupStatus, defineTokenCredential, formatDocsLink, hasConfiguredSecretInput, moveSingleAccountChannelSectionToDefaultAccount, patchScopedAccountConfig, prepareScopedSetupConfig, setSetupChannelEnabled } from "openclaw/plugin-sdk/setup";
import { createSetupInputPresenceValidator } from "openclaw/plugin-sdk/setup-runtime";
import net from "node:net";
//#region \0rolldown/runtime.js
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
//#endregion
//#region extensions/clickclack/src/accounts.ts
/**
* Resolves ClickClack account configuration from root channel config, named
* account overrides, and secret-provider references.
*/
const DEFAULT_RECONNECT_MS = 1500;
const MIN_RECONNECT_MS = 100;
const MAX_RECONNECT_MS = 6e4;
const DEFAULT_DISCUSSIONS_SECTION = "Sessions";
const { listAccountIds: listClickClackAccountIds, resolveDefaultAccountId: resolveDefaultClickClackAccountId, resolveAccountConfig: resolveMergedClickClackAccountConfig } = createAccountListHelpers("clickclack", {
	normalizeAccountId,
	omitKeys: ["defaultAccount"],
	nestedObjectKeys: ["botLoopProtection", "discussions"],
	hasImplicitDefaultAccount: (cfg) => {
		const channel = cfg.channels?.clickclack;
		return Boolean(channel?.baseUrl?.trim() && (hasConfiguredAccountValue(channel.token) || Boolean(channel.tokenFile?.trim()) || Boolean(process.env.CLICKCLACK_BOT_TOKEN?.trim())) && channel.workspace?.trim());
	}
});
function mergeClickClackGroups(...sources) {
	const merged = /* @__PURE__ */ new Map();
	for (const source of sources) for (const [rawKey, value] of Object.entries(source ?? {})) {
		const key = rawKey.trim();
		if (!key) continue;
		const mergedBotLoopProtection = mergePairLoopGuardConfig(merged.get(key)?.botLoopProtection, value.botLoopProtection);
		merged.set(key, {
			...merged.get(key),
			...value.requireMention !== void 0 ? { requireMention: value.requireMention } : {},
			...value.mentionPatterns !== void 0 ? { mentionPatterns: value.mentionPatterns } : {},
			...value.allowBots !== void 0 ? { allowBots: value.allowBots } : {},
			...mergedBotLoopProtection ? { botLoopProtection: mergedBotLoopProtection } : {}
		});
	}
	return Object.fromEntries(merged);
}
function resolveClickClackAccountConfig(cfg, accountId) {
	const channel = cfg.channels?.clickclack;
	const merged = resolveMergedClickClackAccountConfig(cfg, accountId);
	const account = resolveNormalizedAccountEntry(channel?.accounts, accountId, normalizeAccountId);
	const mergedWithGroups = channel?.groups || account?.groups ? {
		...merged,
		groups: mergeClickClackGroups(channel?.groups, account?.groups)
	} : merged;
	const accountTokenFile = account?.tokenFile?.trim();
	if (accountTokenFile) return {
		...mergedWithGroups,
		token: account?.token,
		tokenFile: accountTokenFile
	};
	if (hasConfiguredAccountValue(account?.token)) return {
		...mergedWithGroups,
		token: account?.token,
		tokenFile: void 0
	};
	return mergedWithGroups;
}
function resolveClickClackToken(params) {
	const tokenFile = params.tokenFile?.trim();
	if (tokenFile) {
		const accountTokenFile = resolveNormalizedAccountEntry(params.cfg.channels?.clickclack?.accounts, params.accountId, normalizeAccountId)?.tokenFile?.trim();
		const result = tryReadSecretFileSync(tokenFile, "ClickClack bot token", { rejectSymlink: true }, { configPath: accountTokenFile ? `channels.clickclack.accounts.${params.accountId}.tokenFile` : "channels.clickclack.tokenFile" });
		return result.status === "available" ? {
			token: result.value,
			tokenSource: "tokenFile",
			tokenStatus: "available"
		} : {
			token: "",
			tokenSource: "tokenFile",
			tokenStatus: "configured_unavailable",
			credentialDiagnostics: [result.diagnostic]
		};
	}
	const resolved = resolveSecretInputString({
		value: params.value,
		path: params.accountId === DEFAULT_ACCOUNT_ID$2 ? "channels.clickclack.token" : `channels.clickclack.accounts.${params.accountId}.token`,
		defaults: params.cfg.secrets?.defaults,
		mode: "inspect"
	});
	if (resolved.status !== "available") {
		if (resolved.status === "missing" && params.accountId === DEFAULT_ACCOUNT_ID$2) {
			const token = normalizeSecretInputString((params.env ?? process.env).CLICKCLACK_BOT_TOKEN);
			return token ? {
				token,
				tokenSource: "env",
				tokenStatus: "available"
			} : {
				token: "",
				tokenSource: "none",
				tokenStatus: "missing"
			};
		}
		if (resolved.status === "configured_unavailable" && resolved.ref.source === "env") {
			if (!canResolveEnvSecretRefInReadOnlyPath({
				cfg: params.cfg,
				...resolved.ref
			})) {
				const providerConfig = params.cfg.secrets?.providers?.[resolved.ref.provider];
				if (!providerConfig) throw new Error(`Secret provider "${resolved.ref.provider}" is not configured (ref: env:${resolved.ref.provider}:${resolved.ref.id}).`);
				if (providerConfig.source !== "env") throw new Error(`Secret provider "${resolved.ref.provider}" has source "${providerConfig.source}" but ref requests "env".`);
				throw new Error(`Environment variable "${resolved.ref.id}" is not allowlisted in secrets.providers.${resolved.ref.provider}.allowlist.`);
			}
			const token = normalizeSecretInputString((params.env ?? process.env)[resolved.ref.id]);
			return {
				token: token ?? "",
				tokenSource: "config",
				tokenStatus: token ? "available" : "configured_unavailable"
			};
		}
		return {
			token: "",
			tokenSource: resolved.status === "missing" ? "none" : "config",
			tokenStatus: resolved.status
		};
	}
	return {
		token: resolved.value,
		tokenSource: "config",
		tokenStatus: "available"
	};
}
/**
* Builds the normalized account snapshot used by gateway, outbound delivery,
* status reporting, and channel routing.
*/
function resolveClickClackAccount(params) {
	const accountId = normalizeAccountId(params.accountId);
	const merged = resolveClickClackAccountConfig(params.cfg, accountId);
	const enabled = params.cfg.channels?.clickclack?.enabled !== false && merged.enabled !== false;
	const baseUrl = merged.baseUrl?.trim().replace(/\/$/, "") ?? "";
	const token = resolveClickClackToken({
		cfg: params.cfg,
		value: merged.token,
		tokenFile: merged.tokenFile,
		accountId,
		env: params.env
	});
	const workspace = merged.workspace?.trim() ?? "";
	const discussionsWorkspace = merged.discussions?.workspace?.trim() || workspace;
	const controlUrlBase = merged.discussions?.controlUrlBase?.trim();
	const apiEndpoint = merged.apiBaseUrl?.trim().replace(/\/$/, "") || baseUrl;
	return {
		accountId,
		enabled,
		configured: Boolean(baseUrl && token.tokenStatus !== "missing" && workspace),
		name: normalizeOptionalString(merged.name),
		baseUrl,
		...token,
		workspace,
		botUserId: normalizeOptionalString(merged.botUserId),
		agentId: normalizeOptionalString(merged.agentId),
		replyMode: merged.replyMode === "model" ? "model" : "agent",
		model: normalizeOptionalString(merged.model),
		systemPrompt: normalizeOptionalString(merged.systemPrompt),
		toolsAllow: merged.toolsAllow,
		defaultTo: merged.defaultTo?.trim() || "channel:general",
		allowFrom: merged.allowFrom ?? ["*"],
		reconnectMs: resolveIntegerOption(merged.reconnectMs, DEFAULT_RECONNECT_MS, {
			min: MIN_RECONNECT_MS,
			max: MAX_RECONNECT_MS
		}),
		agentActivity: merged.agentActivity === true,
		nativeProgress: merged.nativeProgress === true,
		commandMenu: merged.commandMenu !== false,
		discussions: {
			enabled: merged.discussions?.enabled === true,
			workspace: discussionsWorkspace,
			...controlUrlBase ? { controlUrlBase } : {},
			section: merged.discussions?.section?.trim() || DEFAULT_DISCUSSIONS_SECTION
		},
		requireMention: merged.requireMention === true,
		mentionPatterns: merged.mentionPatterns ?? [],
		allowBots: merged.allowBots ?? false,
		botLoopProtection: merged.botLoopProtection,
		groups: mergeClickClackGroups(merged.groups),
		config: {
			...merged,
			allowFrom: merged.allowFrom ?? ["*"]
		},
		apiEndpoint
	};
}
/**
* Returns all enabled accounts, including the implicit default account when
* legacy top-level ClickClack config is present.
*/
function listEnabledClickClackAccounts(cfg) {
	return listClickClackAccountIds(cfg).map((accountId) => resolveClickClackAccount({
		cfg,
		accountId
	})).filter((account) => account.enabled);
}
//#endregion
//#region extensions/clickclack/src/channel-config.ts
const CLICKCLACK_CHANNEL_ID = "clickclack";
const clickClackMeta = { ...getChatChannelMeta(CLICKCLACK_CHANNEL_ID) };
const clickClackConfigAdapter = {
	listAccountIds: (cfg) => listClickClackAccountIds(cfg),
	resolveAccount: (cfg, accountId) => resolveClickClackAccount({
		cfg,
		accountId
	}),
	defaultAccountId: (cfg) => resolveDefaultClickClackAccountId(cfg),
	isConfigured: (account) => account.configured,
	resolveAllowFrom: ({ cfg, accountId }) => resolveClickClackAccount({
		cfg,
		accountId
	}).allowFrom,
	resolveDefaultTo: ({ cfg, accountId }) => resolveClickClackAccount({
		cfg,
		accountId
	}).defaultTo
};
//#endregion
//#region extensions/clickclack/src/config-schema.ts
/**
* Zod-backed config schema for ClickClack channel accounts.
*/
const ClickClackAccountConfigSchema = z.object({
	name: z.string().optional(),
	enabled: z.boolean().optional(),
	configWrites: z.boolean().optional(),
	mediaMaxMb: z.number().positive().optional(),
	responsePrefix: z.string().optional(),
	baseUrl: z.string().url().optional(),
	apiBaseUrl: z.string().url().optional(),
	token: buildSecretInputSchema().optional(),
	tokenFile: z.string().optional(),
	workspace: z.string().optional(),
	botUserId: z.string().optional(),
	agentId: z.string().optional(),
	replyMode: z.enum(["agent", "model"]).optional(),
	model: z.string().optional(),
	systemPrompt: z.string().optional(),
	toolsAllow: z.array(z.string()).optional(),
	defaultTo: z.string().optional(),
	allowFrom: z.array(z.string()).optional(),
	allowBots: buildChannelAllowBotsSchema({ allowMentions: true }),
	botLoopProtection: ChannelBotLoopProtectionSchema.optional(),
	reconnectMs: z.number().int().min(100).max(6e4).optional(),
	agentActivity: z.boolean().optional(),
	nativeProgress: z.boolean().optional(),
	commandMenu: z.boolean().optional(),
	requireMention: z.boolean().optional(),
	mentionPatterns: z.array(z.string()).optional(),
	groups: z.record(z.string(), z.object({
		requireMention: z.boolean().optional(),
		mentionPatterns: z.array(z.string()).optional(),
		allowBots: buildChannelAllowBotsSchema({ allowMentions: true }),
		botLoopProtection: ChannelBotLoopProtectionSchema.optional()
	}).strict()).optional(),
	discussions: z.object({
		enabled: z.boolean().optional(),
		workspace: z.string().optional(),
		controlUrlBase: z.string().url().optional(),
		section: z.string().optional()
	}).strict().optional()
}).strict();
const ClickClackConfigSchema = buildMultiAccountChannelSchema(ClickClackAccountConfigSchema.extend({ historyLimit: z.number().int().min(0).optional() }), { accountSchema: ClickClackAccountConfigSchema.partial() });
/**
* Config schema exported to core so `openclaw doctor` and config validation
* understand both default and named ClickClack accounts.
*/
const clickClackConfigSchema = buildChannelConfigSchema(ClickClackConfigSchema);
//#endregion
//#region extensions/clickclack/src/ws-runtime.ts
const require = createRequire(import.meta.url);
const WebSocket = require(path.join(path.dirname(require.resolve("ws/package.json")), "index.js"));
//#endregion
//#region extensions/clickclack/src/http-client.ts
/**
* Thin ClickClack REST/websocket client used by gateway, resolver, and outbound
* delivery code.
*/
/**
* Serializes optional provenance into the wire fields. Unknown JSON fields
* are ignored by servers without the provenance columns, so these are safe
* to send unconditionally when present.
*/
function provenanceFields(provenance) {
	const fields = {};
	if (provenance?.model?.trim()) fields.author_model = provenance.model.trim();
	if (provenance?.thinking?.trim()) fields.author_thinking = provenance.thinking.trim();
	if (provenance?.runtime?.trim()) fields.author_runtime = provenance.runtime.trim();
	return fields;
}
const CLICKCLACK_ERROR_BODY_LIMIT_BYTES = 8192;
const CLICKCLACK_CORRELATION_ID_MAX_LENGTH = 128;
const CLICKCLACK_CORRELATION_ID_PATTERN = /^[A-Za-z0-9._:-]+$/u;
const CLICKCLACK_CORRELATION_ID_HEADER = "X-Correlation-ID";
const CLICKCLACK_INBOUND_JSON_LIMIT_BYTES = 16777216;
const CLICKCLACK_WEBSOCKET_HANDSHAKE_TIMEOUT_MS = 3e4;
const CLICKCLACK_EPHEMERAL_REQUEST_TIMEOUT_MS = 15e3;
const CLICKCLACK_MESSAGE_PAGE_LIMIT = 200;
const CLICKCLACK_DISCUSSION_ROOT_PAGE_LIMIT = 8;
const CLICKCLACK_DISCUSSION_THREAD_REQUEST_LIMIT = 24;
function compareMessages(left, right) {
	return left.created_at.localeCompare(right.created_at) || left.id.localeCompare(right.id);
}
function keepLatestMessages(messages, limit) {
	return messages.toSorted(compareMessages).slice(-limit);
}
var ClickClackHttpError = class extends Error {
	constructor(status, detail, headers) {
		super(`ClickClack ${status}: ${detail}`);
		this.status = status;
		this.headers = headers;
	}
};
/** Matches the workspace/name uniqueness error returned by current ClickClack servers. */
function isClickClackChannelNameConflict(error) {
	if (!(error instanceof ClickClackHttpError) || error.status !== 400 && error.status !== 409) return false;
	const message = error.message.toLowerCase();
	return (message.includes("unique") || message.includes("duplicate")) && message.includes("channel") && /workspace.*name|name.*workspace/u.test(message);
}
/** Accepts the same bounded request-correlation shape as the ClickClack API. */
function normalizeClickClackCorrelationId(value) {
	if (typeof value !== "string") return;
	const normalized = value.trim();
	if (!normalized || normalized.length > CLICKCLACK_CORRELATION_ID_MAX_LENGTH || !CLICKCLACK_CORRELATION_ID_PATTERN.test(normalized)) return;
	return normalized;
}
/**
* Creates a typed client for the ClickClack API using bearer-token auth.
*/
function createClickClackClient(options) {
	const baseUrl = options.baseUrl.replace(/\/$/, "");
	const fetcher = options.fetch ?? fetch;
	const correlationId = normalizeClickClackCorrelationId(options.correlationId);
	const headers = {
		Authorization: `Bearer ${options.token}`,
		Accept: "application/json"
	};
	async function request(path, init = {}, requestOptions = {}) {
		const requestHeaders = new Headers(init.headers);
		for (const [key, value] of Object.entries(headers)) requestHeaders.set(key, value);
		if (correlationId) requestHeaders.set(CLICKCLACK_CORRELATION_ID_HEADER, correlationId);
		if (init.body && !(init.body instanceof FormData)) requestHeaders.set("Content-Type", "application/json");
		const controller = requestOptions.timeoutMs !== void 0 && !init.signal ? new AbortController() : void 0;
		const timeout = controller ? setTimeout(() => controller.abort(), requestOptions.timeoutMs) : void 0;
		try {
			const response = await fetcher(`${baseUrl}${path}`, {
				...init,
				...controller ? { signal: controller.signal } : {},
				headers: requestHeaders
			});
			if (!response.ok) {
				const detail = await readResponseTextLimited(response, CLICKCLACK_ERROR_BODY_LIMIT_BYTES);
				throw new ClickClackHttpError(response.status, redactToolPayloadText(detail), new Headers(response.headers));
			}
			if (requestOptions.responseMode === "none") {
				try {
					await response.body?.cancel();
				} catch {}
				return;
			}
			return await readProviderJsonResponse(response, "ClickClack response", { maxBytes: CLICKCLACK_INBOUND_JSON_LIMIT_BYTES });
		} finally {
			if (timeout) clearTimeout(timeout);
		}
	}
	async function fetchEventPage(workspaceId, pageOptions = {}) {
		const query = new URLSearchParams({ workspace_id: workspaceId });
		if (pageOptions.afterCursor) query.set("after_cursor", pageOptions.afterCursor);
		if (pageOptions.limit !== void 0) query.set("limit", String(pageOptions.limit));
		if (pageOptions.includeTail) query.set("include_tail", "true");
		const data = await request(`/api/realtime/events?${query.toString()}`);
		return {
			events: data.events,
			...typeof data.tail_cursor === "string" ? { tailCursor: data.tail_cursor } : {}
		};
	}
	return {
		me: async () => {
			return (await request("/api/me")).user;
		},
		setBotCommands: async (commands) => {
			return (await request("/api/bots/self/commands", {
				method: "PUT",
				body: JSON.stringify({ commands })
			})).bot_commands;
		},
		workspaces: async () => {
			return (await request("/api/workspaces")).workspaces;
		},
		channels: async (workspaceId) => {
			return (await request(`/api/workspaces/${encodeURIComponent(workspaceId)}/channels`)).channels;
		},
		createChannel: async (workspaceId, channel) => {
			return (await request(`/api/workspaces/${encodeURIComponent(workspaceId)}/channels`, {
				method: "POST",
				body: JSON.stringify(channel)
			})).channel;
		},
		updateChannel: async (channelId, patch) => {
			return (await request(`/api/channels/${encodeURIComponent(channelId)}`, {
				method: "PATCH",
				body: JSON.stringify(patch)
			})).channel;
		},
		channelMessages: async (channelId, afterSeq, limit = 20) => {
			return (await request(`/api/channels/${encodeURIComponent(channelId)}/messages?after_seq=${afterSeq}&limit=${limit}`)).messages;
		},
		latestChannelMessages: async (channelId, limit = 30) => {
			const boundedLimit = Math.max(1, Math.min(CLICKCLACK_MESSAGE_PAGE_LIMIT, limit));
			let beforeSeq;
			let latest = [];
			let rootPageCount = 0;
			let threadRequestCount = 0;
			let truncated = false;
			while (true) {
				rootPageCount += 1;
				const query = new URLSearchParams({ limit: String(CLICKCLACK_MESSAGE_PAGE_LIMIT) });
				if (beforeSeq !== void 0) query.set("before_seq", String(beforeSeq));
				const page = await request(`/api/channels/${encodeURIComponent(channelId)}/messages?${query.toString()}`);
				for (const root of page.messages) {
					latest = keepLatestMessages([...latest, root], boundedLimit);
					const lastReplyAt = root.thread_state?.last_reply_at;
					const cutoff = latest.length === boundedLimit ? latest[0]?.created_at : void 0;
					if (!root.thread_state?.reply_count || lastReplyAt !== void 0 && cutoff !== void 0 && lastReplyAt < cutoff) continue;
					if (threadRequestCount >= CLICKCLACK_DISCUSSION_THREAD_REQUEST_LIMIT) {
						truncated = true;
						continue;
					}
					threadRequestCount += 1;
					const threadQuery = new URLSearchParams({ limit: String(CLICKCLACK_MESSAGE_PAGE_LIMIT) });
					const thread = await request(`/api/messages/${encodeURIComponent(root.id)}/thread?${threadQuery.toString()}`);
					if (thread.replies.length < root.thread_state.reply_count) {
						truncated = true;
						continue;
					}
					latest = keepLatestMessages([...latest, ...thread.replies], boundedLimit);
				}
				if (!page.has_older) return {
					messages: latest,
					truncated
				};
				if (rootPageCount >= CLICKCLACK_DISCUSSION_ROOT_PAGE_LIMIT) return {
					messages: latest,
					truncated: true
				};
				if (page.messages.length === 0 || !Number.isSafeInteger(page.oldest_seq) || page.oldest_seq < 0 || page.oldest_seq === beforeSeq) throw new Error("ClickClack message pagination did not advance");
				beforeSeq = page.oldest_seq;
			}
		},
		directMessages: async (conversationId, afterSeq, limit = 20) => {
			return (await request(`/api/dms/${encodeURIComponent(conversationId)}/messages?after_seq=${afterSeq}&limit=${limit}`)).messages;
		},
		thread: async (messageId) => await request(`/api/messages/${encodeURIComponent(messageId)}/thread`),
		message: async (messageId) => {
			return (await request(`/api/messages/${encodeURIComponent(messageId)}`)).message;
		},
		findMessageByNonce: async (params) => {
			const query = new URLSearchParams({
				workspace_id: params.workspaceId,
				nonce: params.nonce
			});
			try {
				return (await request(`/api/messages/by-nonce?${query.toString()}`)).message;
			} catch (error) {
				if (error instanceof ClickClackHttpError && error.status === 404) {
					if (error.headers.get("X-ClickClack-Message-Nonce") === "supported") return;
					throw new Error("ClickClack server does not support durable message nonce lookup", { cause: error });
				}
				throw error;
			}
		},
		createChannelMessage: async (channelId, body, opts) => {
			return (await request(`/api/channels/${encodeURIComponent(channelId)}/messages`, {
				method: "POST",
				body: JSON.stringify({
					body,
					...opts?.quotedMessageId ? { quoted_message_id: opts.quotedMessageId } : {},
					...opts?.nonce ? { nonce: opts.nonce } : {},
					...provenanceFields(opts?.provenance)
				})
			})).message;
		},
		createThreadReply: async (messageId, body, opts) => {
			return (await request(`/api/messages/${encodeURIComponent(messageId)}/thread/replies`, {
				method: "POST",
				body: JSON.stringify({
					body,
					...opts?.nonce ? { nonce: opts.nonce } : {},
					...provenanceFields(opts?.provenance)
				})
			})).message;
		},
		createDirectConversation: async (workspaceId, memberIds) => {
			return (await request("/api/dms", {
				method: "POST",
				body: JSON.stringify({
					workspace_id: workspaceId,
					member_ids: memberIds
				})
			})).conversation;
		},
		createUpload: async (params) => {
			const form = new FormData();
			const bytes = bufferToBlobPart(params.buffer);
			form.append("file", new Blob([bytes], { type: params.contentType }), params.filename);
			const query = new URLSearchParams({ workspace_id: params.workspaceId });
			if (params.nonce) query.set("nonce", params.nonce);
			return (await request(`/api/uploads?${query.toString()}`, {
				method: "POST",
				body: form
			})).upload;
		},
		findUploadByNonce: async (params) => {
			const query = new URLSearchParams({
				workspace_id: params.workspaceId,
				nonce: params.nonce
			});
			try {
				return (await request(`/api/uploads/by-nonce?${query.toString()}`)).upload;
			} catch (error) {
				if (error instanceof ClickClackHttpError && error.status === 404) {
					if (error.headers.get("X-ClickClack-Upload-Nonce") === "supported") return;
					throw new Error("ClickClack server does not support durable upload nonce lookup", { cause: error });
				}
				throw error;
			}
		},
		attachUpload: async (messageId, uploadId) => {
			await request(`/api/messages/${encodeURIComponent(messageId)}/attachments`, {
				method: "POST",
				body: JSON.stringify({ upload_id: uploadId })
			});
		},
		/**
		* POSTs a durable agent activity row (agent_commentary / agent_tool)
		* through the normal message create path. Requires a bot token carrying
		* the agent_activity:write scope on the ClickClack side.
		*/
		createActivityMessage: async (params) => {
			if (!params.channelId && !params.conversationId) throw new Error("createActivityMessage requires a channelId or conversationId");
			return (await request(params.channelId ? `/api/channels/${encodeURIComponent(params.channelId)}/messages` : `/api/dms/${encodeURIComponent(params.conversationId ?? "")}/messages`, {
				method: "POST",
				body: JSON.stringify({
					body: params.body,
					kind: params.kind,
					turn_id: params.turnId,
					...provenanceFields(params.provenance)
				})
			})).message;
		},
		/** PATCHes the body of an existing message (activity row coalescing). */
		updateMessageBody: async (messageId, body) => {
			return (await request(`/api/messages/${encodeURIComponent(messageId)}`, {
				method: "PATCH",
				body: JSON.stringify({ body })
			})).message;
		},
		/**
		* Publishes an ephemeral realtime signal such as native agent progress.
		* These frames are intentionally not persisted as messages.
		*/
		publishEphemeral: async (params) => {
			await request("/api/realtime/ephemeral", {
				method: "POST",
				body: JSON.stringify({
					workspace_id: params.workspaceId,
					...params.channelId ? { channel_id: params.channelId } : {},
					...params.conversationId ? { direct_conversation_id: params.conversationId } : {},
					type: params.type,
					payload: params.payload ?? {}
				})
			}, {
				timeoutMs: CLICKCLACK_EPHEMERAL_REQUEST_TIMEOUT_MS,
				responseMode: "none"
			});
		},
		createDirectMessage: async (conversationId, body, opts) => {
			return (await request(`/api/dms/${encodeURIComponent(conversationId)}/messages`, {
				method: "POST",
				body: JSON.stringify({
					body,
					...opts?.quotedMessageId ? { quoted_message_id: opts.quotedMessageId } : {},
					...opts?.nonce ? { nonce: opts.nonce } : {}
				})
			})).message;
		},
		events: async (workspaceId, afterCursor) => (await fetchEventPage(workspaceId, { afterCursor })).events,
		eventPage: fetchEventPage,
		websocket: (workspaceId, afterCursor) => {
			const url = new URL(`${baseUrl}/api/realtime/ws`);
			url.protocol = url.protocol === "https:" ? "wss:" : "ws:";
			url.searchParams.set("workspace_id", workspaceId);
			if (afterCursor) url.searchParams.set("after_cursor", afterCursor);
			return new WebSocket(url, {
				headers: { Authorization: `Bearer ${options.token}` },
				handshakeTimeout: CLICKCLACK_WEBSOCKET_HANDSHAKE_TIMEOUT_MS,
				maxPayload: CLICKCLACK_INBOUND_JSON_LIMIT_BYTES
			});
		}
	};
}
//#endregion
//#region extensions/clickclack/src/resolve.ts
/**
* Resolves a workspace slug/name/id from config to a ClickClack workspace id.
*/
async function resolveWorkspaceId(client, workspace) {
	if (workspace.startsWith("wsp_")) return workspace;
	const found = (await client.workspaces()).find((candidate) => candidate.id === workspace || candidate.slug === workspace || candidate.name === workspace);
	if (!found) throw new Error(`ClickClack workspace not found: ${workspace}`);
	return found.id;
}
/**
* Resolves a channel name/id from config or target input to a ClickClack
* channel id.
*/
async function resolveChannelId(client, workspaceId, channel) {
	if (channel.startsWith("chn_")) return channel;
	const found = (await client.channels(workspaceId)).find((candidate) => candidate.id === channel || candidate.name === channel);
	if (!found) throw new Error(`ClickClack channel not found: ${channel}`);
	return found.id;
}
//#endregion
//#region extensions/clickclack/src/setup-contract.ts
const CLICKCLACK_SETUP_CODE_CLAIM_PATH = "/api/bot-setup-codes/claim";
const LOOPBACK_ADDRESSES = new net.BlockList();
LOOPBACK_ADDRESSES.addSubnet("127.0.0.0", 8, "ipv4");
LOOPBACK_ADDRESSES.addAddress("::1", "ipv6");
const BASE_PATH_SEGMENT = /^[A-Za-z0-9._~-]+$/u;
function isClickClackSetupLoopbackHost(hostname) {
	const normalized = hostname.toLowerCase().replace(/^\[|\]$/gu, "");
	if (normalized === "localhost") return true;
	const family = net.isIP(normalized);
	return family !== 0 && LOOPBACK_ADDRESSES.check(normalized, family === 4 ? "ipv4" : "ipv6");
}
function requireClickClackSetupApiBaseUrl(value, label) {
	if (!value || value !== value.trim()) throw new Error(`ClickClack ${label} is invalid`);
	let parsed;
	try {
		parsed = new URL(value);
	} catch {
		throw new Error(`ClickClack ${label} is invalid`);
	}
	if (parsed.protocol !== "http:" && parsed.protocol !== "https:" || !parsed.hostname || parsed.hostname.endsWith(".") || parsed.username || parsed.password || parsed.search || parsed.hash) throw new Error(`ClickClack ${label} is invalid`);
	if (parsed.protocol === "http:" && !isClickClackSetupLoopbackHost(parsed.hostname)) throw new Error(`ClickClack ${label} must use HTTPS unless it is on loopback`);
	const pathname = parsed.pathname;
	let basePath = "";
	if (pathname !== "/") {
		if (pathname.endsWith("/") || pathname.includes("//") || pathname.includes("\\") || pathname.slice(1).split("/").some((segment) => !BASE_PATH_SEGMENT.test(segment))) throw new Error(`ClickClack ${label} is invalid`);
		basePath = pathname;
	}
	const canonical = parsed.origin + basePath;
	if (value !== canonical) throw new Error(`ClickClack ${label} is not canonical`);
	return canonical;
}
function requireClickClackSetupClaimUrl(value) {
	let parsed;
	try {
		parsed = new URL(value);
	} catch {
		throw new Error("ClickClack setup URL has an invalid claim endpoint.");
	}
	if (parsed.username || parsed.password || parsed.search || parsed.hash || !parsed.pathname.endsWith("/api/bot-setup-codes/claim")) throw new Error("ClickClack setup URL has an invalid claim endpoint.");
	const basePath = parsed.pathname.slice(0, -26);
	const apiBaseUrl = requireClickClackSetupApiBaseUrl(parsed.origin + basePath, "setup URL API base");
	const claimUrl = apiBaseUrl + CLICKCLACK_SETUP_CODE_CLAIM_PATH;
	if (value !== claimUrl) throw new Error("ClickClack setup URL has a non-canonical claim endpoint.");
	return {
		claimUrl,
		apiBaseUrl
	};
}
function buildClickClackSetupClaimUrl(baseUrl) {
	return baseUrl.replace(/\/+$/u, "") + CLICKCLACK_SETUP_CODE_CLAIM_PATH;
}
//#endregion
//#region extensions/clickclack/src/setup-core.ts
const channel$1 = "clickclack";
const SETUP_CODE_ALPHABET = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";
const SETUP_CODE_LENGTH = 12;
const REQUIRED_INPUT_ERROR = "ClickClack requires --token, --base-url, and --workspace (or --use-env).";
const INVALID_BASE_URL_ERROR = "ClickClack base URL must be a valid http(s) URL.";
const SETUP_CODE_CONFLICT_ERROR = "ClickClack --code cannot be combined with --token, --token-file, or --use-env.";
function normalizeClickClackBaseUrl(value) {
	const trimmed = value?.trim();
	if (!trimmed) return;
	try {
		const parsed = new URL(trimmed);
		if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return;
		return parsed.toString().replace(/\/+$/, "");
	} catch {
		return;
	}
}
function normalizeClickClackSetupCode(value) {
	const normalized = value.trim().toUpperCase().replaceAll("-", "").replaceAll(" ", "");
	if (normalized.length !== SETUP_CODE_LENGTH || Array.from(normalized).some((character) => !SETUP_CODE_ALPHABET.includes(character))) return;
	return normalized;
}
function requireClickClackSetupCodeBaseUrl(value) {
	const baseUrl = normalizeClickClackBaseUrl(value);
	if (!baseUrl) throw new Error("ClickClack setup codes require a valid HTTP(S) base URL.");
	return baseUrl;
}
function parseClickClackSetupCodeInput(params) {
	const rawCode = params.code.trim();
	if (!rawCode) throw new Error("ClickClack --code must not be empty.");
	let code = rawCode;
	let baseUrl;
	if (/^[a-z][a-z\d+.-]*:\/\//iu.test(rawCode)) {
		let setupUrl;
		try {
			setupUrl = new URL(rawCode);
		} catch {
			throw new Error("ClickClack --code must be a valid HTTP(S) setup URL or a bare setup code.");
		}
		if (setupUrl.protocol !== "http:" && setupUrl.protocol !== "https:") throw new Error("ClickClack setup codes require an HTTP(S) URL.");
		if (setupUrl.username || setupUrl.password) throw new Error("ClickClack setup URLs must not include credentials.");
		if (setupUrl.search) throw new Error("ClickClack setup URLs must not include a query.");
		code = setupUrl.hash.slice(1);
		if (!code) throw new Error("ClickClack setup URL is missing its #CODE fragment.");
		setupUrl.hash = "";
		let exactClaimUrl;
		if (setupUrl.pathname.endsWith("/api/bot-setup-codes/claim")) {
			const exactEndpoint = requireClickClackSetupClaimUrl(setupUrl.toString());
			baseUrl = exactEndpoint.apiBaseUrl;
			exactClaimUrl = exactEndpoint.claimUrl;
		} else baseUrl = requireClickClackSetupCodeBaseUrl(setupUrl.toString());
		if (params.baseUrl) {
			if (requireClickClackSetupCodeBaseUrl(params.baseUrl) !== baseUrl) throw new Error("ClickClack --base-url does not match the server in the setup-code URL.");
		}
		const normalizedCode = normalizeClickClackSetupCode(code);
		if (!normalizedCode) throw new Error("ClickClack setup code must contain 12 valid base32 characters.");
		return {
			code: normalizedCode,
			baseUrl,
			...exactClaimUrl ? { exactClaimUrl } : {}
		};
	}
	code = code.startsWith("#") ? code.slice(1) : code;
	if (!params.baseUrl) throw new Error("A bare ClickClack setup code requires --base-url.");
	baseUrl = requireClickClackSetupCodeBaseUrl(params.baseUrl);
	const normalizedCode = normalizeClickClackSetupCode(code);
	if (!normalizedCode) throw new Error("ClickClack setup code must contain 12 valid base32 characters.");
	return {
		code: normalizedCode,
		baseUrl
	};
}
function formatClickClackSetupCodeClaimError(error) {
	if (typeof error === "object" && error !== null && "status" in error) {
		const status = error.status;
		if (status === 404) return /* @__PURE__ */ new Error("ClickClack setup code is invalid, expired, or already used. Generate a new code and try again.");
		if (status === 429) return /* @__PURE__ */ new Error("Too many ClickClack setup code attempts. Wait and try again.");
	}
	return /* @__PURE__ */ new Error(`Could not claim ClickClack setup code: ${formatErrorMessage(error)}`);
}
function applyClickClackSetupConfigPatch(params) {
	const accountId = normalizeAccountId(params.accountId);
	const scopedConfig = accountId === DEFAULT_ACCOUNT_ID ? params.cfg : moveSingleAccountChannelSectionToDefaultAccount({
		cfg: params.cfg,
		channelKey: channel$1,
		setupSurface: clickClackSetupAdapter
	});
	return patchScopedAccountConfig({
		cfg: prepareScopedSetupConfig({
			cfg: scopedConfig,
			channelKey: channel$1,
			accountId,
			name: params.name,
			migrateBaseName: accountId !== DEFAULT_ACCOUNT_ID
		}),
		channelKey: channel$1,
		accountId,
		patch: params.patch,
		...params.clearFields ? { clearFields: params.clearFields } : {}
	});
}
function applyClickClackCredentialConfig(params) {
	const fieldsToClear = params.useEnv ? ["token", "tokenFile"] : params.tokenFile ? ["token"] : params.token !== void 0 ? ["tokenFile"] : [];
	return applyClickClackSetupConfigPatch({
		cfg: params.cfg,
		accountId: params.accountId,
		clearFields: fieldsToClear,
		patch: params.useEnv ? {} : params.tokenFile ? { tokenFile: params.tokenFile } : params.token !== void 0 ? { token: params.token } : {}
	});
}
const clickClackSetupAdapter = {
	resolveAccountId: ({ accountId }) => normalizeAccountId(accountId),
	prepareAccountConfigInput: async ({ cfg, accountId, input }) => {
		const setupInput = input;
		if (!setupInput.code?.trim()) return setupInput;
		if (setupInput.token?.trim() || setupInput.tokenFile?.trim() || setupInput.useEnv) throw new Error(SETUP_CODE_CONFLICT_ERROR);
		let setup = parseClickClackSetupCodeInput({
			code: setupInput.code,
			baseUrl: setupInput.baseUrl
		});
		const privateApiBaseUrl = normalizeClickClackBaseUrl(resolveClickClackAccountConfig(cfg, accountId).apiBaseUrl);
		const claimUrl = setup.exactClaimUrl && !privateApiBaseUrl ? setup.exactClaimUrl : buildClickClackSetupClaimUrl(privateApiBaseUrl ?? setup.baseUrl);
		let claim;
		try {
			const { claimClickClackSetupCode } = await import("./setup-claim-t5SbtvZy.mjs");
			claim = await claimClickClackSetupCode({
				claimUrl,
				code: setup.code,
				...setup.exactClaimUrl ? { expectedClaimUrl: setup.exactClaimUrl } : {}
			});
		} catch (error) {
			throw formatClickClackSetupCodeClaimError(error);
		}
		setup = {
			...setup,
			baseUrl: claim.api_base_url ?? setup.baseUrl
		};
		const { code: _code, tokenFile: _tokenFile, useEnv: _useEnv, ...remainingInput } = setupInput;
		return {
			...remainingInput,
			baseUrl: setup.baseUrl,
			token: claim.token,
			workspace: claim.workspace.id,
			...claim.defaults.defaultTo !== void 0 ? { defaultTo: claim.defaults.defaultTo } : {},
			...claim.defaults.allowFrom !== void 0 ? { allowFrom: [...claim.defaults.allowFrom] } : {},
			...claim.defaults.agentActivity !== void 0 ? { agentActivity: claim.defaults.agentActivity } : {}
		};
	},
	applyAccountName: ({ cfg, accountId, name }) => applyAccountNameToChannelSection({
		cfg,
		channelKey: channel$1,
		accountId,
		name
	}),
	validateInput: createSetupInputPresenceValidator({
		defaultAccountOnlyEnvError: "CLICKCLACK_BOT_TOKEN can only be used for the default account.",
		whenNotUseEnv: [
			{
				someOf: ["token", "tokenFile"],
				message: REQUIRED_INPUT_ERROR
			},
			{
				someOf: ["baseUrl"],
				message: REQUIRED_INPUT_ERROR
			},
			{
				someOf: ["workspace"],
				message: REQUIRED_INPUT_ERROR
			}
		],
		validate: ({ cfg, accountId, input }) => {
			const setupInput = input;
			const baseUrl = normalizeClickClackBaseUrl(setupInput.baseUrl);
			if (setupInput.baseUrl && !baseUrl) return INVALID_BASE_URL_ERROR;
			if (!setupInput.useEnv) return null;
			const existing = resolveClickClackAccountConfig(cfg, accountId);
			const existingBaseUrl = normalizeClickClackBaseUrl(existing.baseUrl);
			if (!baseUrl && existing.baseUrl?.trim() && !existingBaseUrl) return INVALID_BASE_URL_ERROR;
			if (!baseUrl && !existingBaseUrl) return REQUIRED_INPUT_ERROR;
			if (!setupInput.workspace?.trim() && !existing.workspace?.trim()) return REQUIRED_INPUT_ERROR;
			return null;
		}
	}),
	applyAccountConfig: ({ cfg, accountId, input }) => {
		const setupInput = input;
		const existing = setupInput.useEnv ? resolveClickClackAccountConfig(cfg, accountId) : void 0;
		const baseUrl = normalizeClickClackBaseUrl(setupInput.baseUrl ?? existing?.baseUrl);
		const workspace = setupInput.workspace?.trim() || existing?.workspace?.trim();
		const tokenFile = setupInput.tokenFile?.trim();
		const token = setupInput.token?.trim();
		return applyClickClackCredentialConfig({
			cfg: applyClickClackSetupConfigPatch({
				cfg,
				accountId,
				name: setupInput.name,
				patch: {
					...baseUrl ? { baseUrl } : {},
					...workspace ? { workspace } : {},
					...setupInput.defaultTo?.trim() ? { defaultTo: setupInput.defaultTo.trim() } : {},
					...setupInput.allowFrom ? { allowFrom: [...setupInput.allowFrom] } : {},
					...setupInput.agentActivity !== void 0 ? { agentActivity: setupInput.agentActivity } : {}
				}
			}),
			accountId,
			token,
			tokenFile,
			useEnv: setupInput.useEnv
		});
	},
	afterAccountConfigWritten: async ({ cfg, accountId, runtime }) => {
		const { verifyClickClackAccountAfterSetup } = await Promise.resolve().then(() => setup_verify_exports);
		await verifyClickClackAccountAfterSetup({
			cfg,
			accountId,
			runtime
		});
	}
};
const clickClackSetupContract = defineChannelSetupContract({
	fields: {
		code: {
			kind: "string",
			sensitive: true,
			cli: {
				flags: "--code <code>",
				description: "ClickClack one-time setup code or setup URL"
			}
		},
		token: {
			kind: "string",
			sensitive: true,
			cli: {
				flags: "--token <token>",
				description: "ClickClack bot token"
			}
		},
		tokenFile: {
			kind: "string",
			sensitive: true,
			cli: {
				flags: "--token-file <path>",
				description: "ClickClack bot token file"
			}
		},
		baseUrl: {
			kind: "string",
			cli: {
				flags: "--base-url <url>",
				description: "ClickClack API base URL"
			}
		},
		workspace: {
			kind: "string",
			cli: {
				flags: "--workspace <workspace>",
				description: "ClickClack workspace id, slug, or name"
			}
		},
		defaultTo: {
			kind: "string",
			cli: {
				flags: "--default-to <target>",
				description: "Default ClickClack target"
			}
		},
		allowFrom: {
			kind: "string-list",
			cli: {
				flags: "--allow-from <ids>",
				description: "Allowed ClickClack senders"
			}
		},
		agentActivity: {
			kind: "boolean",
			cli: {
				flags: "--agent-activity",
				description: "Enable ClickClack agent activity"
			}
		},
		useEnv: {
			kind: "boolean",
			cli: {
				flags: "--use-env",
				description: "Use CLICKCLACK_BOT_TOKEN"
			},
			envVars: ["CLICKCLACK_BOT_TOKEN"]
		}
	},
	legacyAdapter: clickClackSetupAdapter
});
//#endregion
//#region extensions/clickclack/src/setup-verify.ts
var setup_verify_exports = /* @__PURE__ */ __exportAll({
	checkClickClackSetupConnection: () => checkClickClackSetupConnection,
	verifyClickClackAccountAfterSetup: () => verifyClickClackAccountAfterSetup
});
const GATEWAY_RUNNING_MESSAGE = "OpenClaw is running — ClickClack will connect automatically.";
const GATEWAY_NOT_RUNNING_MESSAGE = "Start OpenClaw to connect: openclaw gateway";
const GATEWAY_UNKNOWN_MESSAGE = "If OpenClaw is running it connects automatically; otherwise start it with: openclaw gateway";
function isHttpStatus(error, status) {
	return typeof error === "object" && error !== null && "status" in error && error.status === status;
}
function isWorkspaceNotFound(error) {
	return error instanceof Error && error.message.startsWith("ClickClack workspace not found:");
}
function usesUnavailableImplicitEnvToken(account, tokenOverride) {
	return account.accountId === DEFAULT_ACCOUNT_ID && Boolean(account.baseUrl && account.workspace) && !tokenOverride && !account.token && !hasConfiguredSecretInput(account.config.token) && !account.config.tokenFile?.trim();
}
async function checkClickClackSetupConnection(params) {
	let workspaceInput = "";
	try {
		const account = resolveClickClackAccount({
			cfg: params.cfg,
			accountId: params.accountId
		});
		workspaceInput = account.workspace;
		const token = params.token?.trim() || account.token;
		if (usesUnavailableImplicitEnvToken(account, token)) return { status: "skipped-env-token" };
		if (!account.baseUrl || !account.workspace || !token) return { status: "skipped-unconfigured" };
		const client = createClickClackClient({
			baseUrl: account.apiEndpoint,
			token
		});
		const me = await client.me();
		const workspaceId = await resolveWorkspaceId(client, account.workspace);
		const workspace = (await client.workspaces()).find((candidate) => candidate.id === workspaceId);
		if (!workspace) throw new Error(`ClickClack workspace not found: ${account.workspace}`);
		return {
			status: "connected",
			handle: me.handle,
			workspaceName: workspace.name
		};
	} catch (error) {
		if (isHttpStatus(error, 401)) return { status: "invalid-token" };
		if (isWorkspaceNotFound(error)) return {
			status: "workspace-not-found",
			workspace: workspaceInput
		};
		return {
			status: "failed",
			error: formatErrorMessage(error)
		};
	}
}
function isGatewayNotRunningError(error) {
	if (typeof error === "object" && error !== null && "name" in error && "kind" in error && "code" in error && error.name === "GatewayTransportError" && error.kind === "closed" && error.code === 1006) return true;
	const message = formatErrorMessage(error).toLowerCase();
	return message.includes("econnrefused") || message.includes("connection refused");
}
async function probeClickClackGatewayStatus() {
	try {
		const { callGatewayFromCli } = await import("openclaw/plugin-sdk/gateway-runtime");
		await callGatewayFromCli("health", {
			timeout: "1000",
			json: true
		}, void 0, {
			expectFinal: false,
			progress: false
		});
		return "running";
	} catch (error) {
		return isGatewayNotRunningError(error) ? "not-running" : "unavailable";
	}
}
function formatClickClackConnectionLog(result) {
	switch (result.status) {
		case "connected": return `Connected as @${result.handle} — workspace ${result.workspaceName} resolved.`;
		case "invalid-token": return "ClickClack rejected the bot token (401). Copy a current token and rerun setup.";
		case "workspace-not-found": return `Workspace "${result.workspace}" was not found. Check the id, slug, or name, list available workspaces, and rerun setup.`;
		case "failed": return `Connection check failed: ${result.error}. Setup was saved; fix the connection and rerun setup.`;
		case "skipped-env-token": return "Token comes from CLICKCLACK_BOT_TOKEN; verification skipped.";
		case "skipped-unconfigured": return;
	}
}
function formatClickClackGatewayLog(status) {
	switch (status) {
		case "running": return GATEWAY_RUNNING_MESSAGE;
		case "not-running": return GATEWAY_NOT_RUNNING_MESSAGE;
		case "unavailable": return GATEWAY_UNKNOWN_MESSAGE;
	}
	return GATEWAY_UNKNOWN_MESSAGE;
}
async function verifyClickClackAccountAfterSetup(params) {
	try {
		const message = formatClickClackConnectionLog(await checkClickClackSetupConnection({
			cfg: params.cfg,
			accountId: params.accountId
		}));
		if (message) params.runtime.log(message);
	} catch (error) {
		params.runtime.log(`Connection check failed: ${formatErrorMessage(error)}. Setup was saved; fix the connection and rerun setup.`);
	}
	try {
		const status = await probeClickClackGatewayStatus();
		params.runtime.log(formatClickClackGatewayLog(status));
	} catch {
		params.runtime.log(GATEWAY_UNKNOWN_MESSAGE);
	}
}
//#endregion
//#region extensions/clickclack/src/setup-surface.ts
const t = createSetupTranslator();
const channel = "clickclack";
function hasConfiguredClickClackCredential(account) {
	return hasConfiguredSecretInput(account.config.token) || Boolean(account.config.tokenFile?.trim());
}
function isClickClackSetupConfigured(account) {
	return Boolean(account.baseUrl && account.workspace && (account.token || hasConfiguredClickClackCredential(account)));
}
const clickClackSetupWizard = {
	channel,
	status: createStandardChannelSetupStatus({
		channelLabel: "ClickClack",
		configuredLabel: t("wizard.channels.statusConfigured"),
		unconfiguredLabel: t("wizard.channels.statusNeedsSetup"),
		configuredHint: t("wizard.channels.statusSelfHostedChat"),
		unconfiguredHint: t("wizard.channels.statusNeedsSetup"),
		configuredScore: 2,
		unconfiguredScore: 1,
		resolveConfigured: ({ cfg, accountId }) => (accountId ? [accountId] : listClickClackAccountIds(cfg)).some((resolvedAccountId) => isClickClackSetupConfigured(resolveClickClackAccount({
			cfg,
			accountId: resolvedAccountId
		})))
	}),
	introNote: {
		title: t("wizard.clickclack.botTokenTitle"),
		lines: [t("wizard.clickclack.helpCreateToken"), t("wizard.channels.docs", { link: formatDocsLink("/channels/clickclack", "clickclack") })],
		shouldShow: ({ cfg, accountId }) => !isClickClackSetupConfigured(resolveClickClackAccount({
			cfg,
			accountId
		}))
	},
	credentials: [defineTokenCredential({
		inputKey: "token",
		configKey: "token",
		configuredFields: ["token", "tokenFile"],
		providerHint: channel,
		credentialLabel: t("wizard.clickclack.botToken"),
		preferredEnvVar: "CLICKCLACK_BOT_TOKEN",
		envPrompt: t("wizard.clickclack.envPrompt"),
		keepPrompt: t("wizard.clickclack.botTokenKeep"),
		inputPrompt: t("wizard.clickclack.botTokenInput"),
		allowEnv: ({ accountId }) => accountId === DEFAULT_ACCOUNT_ID$1,
		resolveAccount: ({ cfg, accountId }) => resolveClickClackAccount({
			cfg,
			accountId
		}),
		hasConfiguredValue: hasConfiguredClickClackCredential,
		resolvedValue: (account) => account.token || void 0,
		envValue: ({ accountId }) => accountId === DEFAULT_ACCOUNT_ID$1 ? process.env.CLICKCLACK_BOT_TOKEN?.trim() || void 0 : void 0,
		patchAccount: ({ cfg, accountId, mode, patch }) => mode === "env" ? applyClickClackCredentialConfig({
			cfg,
			accountId,
			useEnv: true
		}) : applyClickClackCredentialConfig({
			cfg,
			accountId,
			...patch
		}),
		useEnv: { clearFields: ["token", "tokenFile"] },
		set: { clearFields: ["tokenFile"] }
	})],
	textInputs: [baseUrlTextInput({
		inputKey: "baseUrl",
		configKey: "baseUrl",
		message: t("wizard.clickclack.baseUrlPrompt"),
		resolveAccount: ({ cfg, accountId }) => resolveClickClackAccount({
			cfg,
			accountId
		}),
		currentValue: (account) => account.baseUrl || void 0,
		includeInitialValue: true,
		validate: (value) => normalizeClickClackBaseUrl(value) ? void 0 : "ClickClack server URL must be a valid http(s) URL.",
		normalize: (value) => normalizeClickClackBaseUrl(value) ?? value.trim(),
		patchAccount: ({ cfg, accountId, patch }) => applyClickClackSetupConfigPatch({
			cfg,
			accountId,
			patch
		})
	}), {
		inputKey: "workspace",
		message: t("wizard.clickclack.workspacePrompt"),
		helpTitle: t("wizard.clickclack.workspacePrompt"),
		helpLines: [t("wizard.clickclack.workspaceHelp")],
		currentValue: ({ cfg, accountId }) => resolveClickClackAccount({
			cfg,
			accountId
		}).workspace || void 0,
		initialValue: ({ cfg, accountId }) => resolveClickClackAccount({
			cfg,
			accountId
		}).workspace || void 0,
		validate: ({ value }) => value.trim() ? void 0 : "Required",
		normalizeValue: ({ value }) => value.trim(),
		applySet: async ({ cfg, accountId, value }) => applyClickClackSetupConfigPatch({
			cfg,
			accountId,
			patch: { workspace: value }
		})
	}],
	finalize: async ({ cfg, accountId, credentialValues, prompter }) => {
		const result = await checkClickClackSetupConnection({
			cfg,
			accountId,
			token: credentialValues.token
		});
		if (result.status === "connected") {
			await prompter.note(t("wizard.clickclack.connected", {
				handle: result.handle,
				workspace: result.workspaceName
			}), t("wizard.clickclack.connectionTitle"));
			return;
		}
		if (result.status === "skipped-env-token" || result.status === "skipped-unconfigured") return;
		const message = result.status === "invalid-token" ? t("wizard.clickclack.invalidToken") : result.status === "workspace-not-found" ? t("wizard.clickclack.workspaceNotFound", { workspace: result.workspace }) : t("wizard.clickclack.connectionFailed", { error: result.error });
		await prompter.note(message, t("wizard.clickclack.validationWarningTitle"));
	},
	disable: (cfg) => setSetupChannelEnabled(cfg, channel, false)
};
//#endregion
export { DEFAULT_ACCOUNT_ID$2 as _, isClickClackSetupLoopbackHost as a, resolveClickClackAccount as b, resolveWorkspaceId as c, isClickClackChannelNameConflict as d, normalizeClickClackCorrelationId as f, clickClackMeta as g, clickClackConfigAdapter as h, buildClickClackSetupClaimUrl as i, ClickClackHttpError as l, CLICKCLACK_CHANNEL_ID as m, clickClackSetupContract as n, requireClickClackSetupApiBaseUrl as o, clickClackConfigSchema as p, CLICKCLACK_SETUP_CODE_CLAIM_PATH as r, resolveChannelId as s, clickClackSetupWizard as t, createClickClackClient as u, listClickClackAccountIds as v, resolveDefaultClickClackAccountId as x, listEnabledClickClackAccounts as y };
