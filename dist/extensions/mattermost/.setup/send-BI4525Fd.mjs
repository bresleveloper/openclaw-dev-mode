import { c as setInteractionSecret, n as buildButtonProps, o as resolveInteractionCallbackUrl } from "./interactions-CfOLvzca.mjs";
import { n as getOptionalMattermostRuntime, t as getMattermostRuntime } from "./runtime-CNB4YGqJ.mjs";
import { a as createMattermostPost, b as uploadMattermostFile, c as fetchMattermostChannelByName, d as fetchMattermostUser, f as fetchMattermostUserByUsername, g as parseMattermostApiStatus, h as normalizeMattermostBaseUrl, i as createMattermostDirectChannelWithRetry, p as fetchMattermostUserTeams, r as createMattermostClient, s as fetchMattermostChannel, u as fetchMattermostMe } from "./client-f2qstbX3.mjs";
import { o as resolveMattermostTrustedChatKind, v as loadOutboundMediaFromUrl } from "./monitor-auth-aZ0b1gqx.mjs";
import { u as resolveMattermostAccount } from "./normalize-DhF6_2lt.mjs";
import { normalizeLowercaseStringOrEmpty, normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
import { createChannelPartialDeliveryError } from "openclaw/plugin-sdk/channel-inbound";
import { createMessageReceiptFromOutboundResults, listMessageReceiptPlatformIds } from "openclaw/plugin-sdk/channel-outbound";
import { resolveChannelMediaMaxBytes } from "openclaw/plugin-sdk/account-helpers";
import { convertMarkdownTables } from "openclaw/plugin-sdk/text-chunking";
import { pruneMapToMaxSize } from "openclaw/plugin-sdk/collection-runtime";
import { resolveMarkdownTableMode } from "openclaw/plugin-sdk/markdown-table-runtime";
import { extensionForMime } from "openclaw/plugin-sdk/media-mime";
import { requireRuntimeConfig } from "openclaw/plugin-sdk/plugin-config-runtime";
//#region extensions/mattermost/src/mattermost/target-resolution.ts
const MATTERMOST_OPAQUE_TARGET_CACHE_MAX_ENTRIES = 1024;
const MATTERMOST_OPAQUE_TARGET_CACHE_TTL_MS = 3e5;
const mattermostOpaqueTargetCache = /* @__PURE__ */ new Map();
function cacheMattermostOpaqueTarget(key, kind) {
	mattermostOpaqueTargetCache.set(key, {
		kind,
		expiresAt: Date.now() + MATTERMOST_OPAQUE_TARGET_CACHE_TTL_MS
	});
	pruneMapToMaxSize(mattermostOpaqueTargetCache, MATTERMOST_OPAQUE_TARGET_CACHE_MAX_ENTRIES);
}
function getCachedMattermostOpaqueTargetKind(key) {
	const cached = mattermostOpaqueTargetCache.get(key);
	if (!cached) return;
	if (cached.expiresAt <= Date.now()) {
		mattermostOpaqueTargetCache.delete(key);
		return;
	}
	return cached.kind;
}
function cacheKey$1(baseUrl, token, id) {
	return `${baseUrl}::${token}::${id}`;
}
/** Mattermost IDs are 26-character lowercase alphanumeric strings. */
function isMattermostId(value) {
	return /^[a-z0-9]{26}$/.test(value);
}
function parseMattermostTarget(raw) {
	const trimmed = raw.trim();
	if (!trimmed) throw new Error("Recipient is required for Mattermost sends");
	const lower = normalizeLowercaseStringOrEmpty(trimmed);
	if (lower.startsWith("channel:")) {
		const id = trimmed.slice(8).trim();
		if (!id) throw new Error("Channel id is required for Mattermost sends");
		if (id.startsWith("#")) {
			const name = id.slice(1).trim();
			if (!name) throw new Error("Channel name is required for Mattermost sends");
			return {
				kind: "channel-name",
				name
			};
		}
		if (!isMattermostId(id)) return {
			kind: "channel-name",
			name: id
		};
		return {
			kind: "channel",
			id
		};
	}
	if (lower.startsWith("user:") || lower.startsWith("mattermost:")) {
		const id = trimmed.slice(trimmed.indexOf(":") + 1).trim();
		if (!id) throw new Error("User id is required for Mattermost sends");
		return {
			kind: "user",
			id
		};
	}
	if (trimmed.startsWith("@")) {
		const username = trimmed.slice(1).trim();
		if (!username) throw new Error("Username is required for Mattermost sends");
		return {
			kind: "user",
			username
		};
	}
	if (trimmed.startsWith("#")) {
		const name = trimmed.slice(1).trim();
		if (!name) throw new Error("Channel name is required for Mattermost sends");
		return {
			kind: "channel-name",
			name
		};
	}
	if (!isMattermostId(trimmed)) return {
		kind: "channel-name",
		name: trimmed
	};
	return {
		kind: "channel",
		id: trimmed
	};
}
async function resolveMattermostOpaqueTarget(params) {
	const input = params.input.trim();
	if (!isMattermostId(input)) return null;
	let client;
	if ("client" in params) client = params.client;
	else {
		const account = resolveMattermostAccount({
			cfg: params.cfg,
			accountId: params.accountId
		});
		if (!account.enabled) throw new Error(`Mattermost account "${account.accountId}" is disabled`);
		const token = normalizeOptionalString(account.botToken);
		const baseUrl = normalizeMattermostBaseUrl(account.baseUrl);
		if (!token || !baseUrl) return null;
		client = createMattermostClient({
			baseUrl,
			botToken: token,
			allowPrivateNetwork: account.config.network?.dangerouslyAllowPrivateNetwork === true
		});
	}
	const key = cacheKey$1(client.baseUrl, client.token, input);
	const cachedKind = getCachedMattermostOpaqueTargetKind(key);
	if (cachedKind) return {
		kind: cachedKind,
		id: input,
		to: cachedKind === "user" ? `user:${input}` : `channel:${input}`
	};
	try {
		await fetchMattermostUser(client, input);
		cacheMattermostOpaqueTarget(key, "user");
		return {
			kind: "user",
			id: input,
			to: `user:${input}`
		};
	} catch (err) {
		if (parseMattermostApiStatus(err) !== 404) return {
			kind: "channel",
			id: input,
			to: `channel:${input}`
		};
	}
	try {
		const channel = await fetchMattermostChannel(client, input);
		const channelKind = resolveMattermostTrustedChatKind({ channelType: channel.type }) === "group" ? "group" : "channel";
		cacheMattermostOpaqueTarget(key, channelKind);
		return {
			kind: channelKind,
			id: input,
			to: `channel:${input}`
		};
	} catch {
		return {
			kind: "channel",
			id: input,
			to: `channel:${input}`
		};
	}
}
//#endregion
//#region extensions/mattermost/src/mattermost/send.ts
const MATTERMOST_BOT_USER_CACHE_MAX_ENTRIES = 64;
const MATTERMOST_TARGET_CACHE_MAX_ENTRIES = 1024;
const botUserCache = /* @__PURE__ */ new Map();
const userByNameCache = /* @__PURE__ */ new Map();
const channelByNameCache = /* @__PURE__ */ new Map();
const dmChannelCache = /* @__PURE__ */ new Map();
function cacheOutboundEntry(cache, key, value, maxEntries) {
	cache.delete(key);
	cache.set(key, value);
	pruneMapToMaxSize(cache, maxEntries);
}
function resolveMattermostReceiptKind(params) {
	if (params.fileIds?.length) return "media";
	if (params.buttons?.length || params.props) return "card";
	return "text";
}
function cacheKey(baseUrl, token) {
	return `${baseUrl}::${token}`;
}
async function resolveBotUser(client) {
	const key = cacheKey(client.baseUrl, client.token);
	const cached = botUserCache.get(key);
	if (cached) return cached;
	const user = await fetchMattermostMe(client);
	cacheOutboundEntry(botUserCache, key, user, MATTERMOST_BOT_USER_CACHE_MAX_ENTRIES);
	return user;
}
async function resolveUserIdByUsername(params) {
	const { client, username } = params;
	const key = `${cacheKey(client.baseUrl, client.token)}::${normalizeLowercaseStringOrEmpty(username)}`;
	const cached = userByNameCache.get(key);
	if (cached?.id) return cached.id;
	const user = await fetchMattermostUserByUsername(client, username);
	cacheOutboundEntry(userByNameCache, key, user, MATTERMOST_TARGET_CACHE_MAX_ENTRIES);
	return user.id;
}
async function resolveChannelIdByName(params) {
	const { client, name } = params;
	const key = `${cacheKey(client.baseUrl, client.token)}::channel::${normalizeLowercaseStringOrEmpty(name)}`;
	const cached = channelByNameCache.get(key);
	if (cached) return cached;
	const me = await fetchMattermostMe(client);
	const teams = await fetchMattermostUserTeams(client, me.id);
	for (const team of teams) try {
		const channel = await fetchMattermostChannelByName(client, team.id, name);
		if (channel?.id) {
			cacheOutboundEntry(channelByNameCache, key, channel.id, MATTERMOST_TARGET_CACHE_MAX_ENTRIES);
			return channel.id;
		}
	} catch (error) {
		if (parseMattermostApiStatus(error) !== 404) throw error;
	}
	throw new Error(`Mattermost channel "#${name}" not found in any team the bot belongs to`);
}
function mergeDmRetryOptions(base, override) {
	const merged = {
		maxRetries: override?.maxRetries ?? base?.maxRetries,
		initialDelayMs: override?.initialDelayMs ?? base?.initialDelayMs,
		maxDelayMs: override?.maxDelayMs ?? base?.maxDelayMs,
		timeoutMs: override?.timeoutMs ?? base?.timeoutMs,
		onRetry: override?.onRetry
	};
	return Object.values(merged).some((value) => value !== void 0) ? merged : void 0;
}
async function resolveTargetChannelId(params) {
	if (params.target.kind === "channel") return params.target.id;
	if (params.target.kind === "channel-name") return await resolveChannelIdByName({
		client: params.client,
		name: params.target.name
	});
	const userId = params.target.id ? params.target.id : await resolveUserIdByUsername({
		client: params.client,
		username: params.target.username ?? ""
	});
	const dmKey = `${cacheKey(params.client.baseUrl, params.client.token)}::dm::${userId}`;
	const cachedDm = dmChannelCache.get(dmKey);
	if (cachedDm) return cachedDm;
	const botUser = await resolveBotUser(params.client);
	const channel = await createMattermostDirectChannelWithRetry(params.client, [botUser.id, userId], {
		...params.dmRetryOptions,
		onRetry: (attempt, delayMs, error) => {
			params.dmRetryOptions?.onRetry?.(attempt, delayMs, error);
			params.logger?.warn?.(`DM channel creation retry ${attempt} after ${delayMs}ms: ${error.message}`);
		}
	});
	cacheOutboundEntry(dmChannelCache, dmKey, channel.id, MATTERMOST_TARGET_CACHE_MAX_ENTRIES);
	return channel.id;
}
async function resolveMattermostSendContext(to, opts) {
	const core = getMattermostRuntime();
	const logger = core.logging.getChildLogger({ module: "mattermost" });
	if (!opts?.cfg) throw new Error("Mattermost send requires a resolved runtime config. Load and resolve config at the command or gateway boundary, then pass cfg through the runtime path.");
	const cfg = requireRuntimeConfig(opts.cfg, "Mattermost send");
	const account = resolveMattermostAccount({
		cfg,
		accountId: opts.accountId
	});
	const token = normalizeOptionalString(opts.botToken) ?? normalizeOptionalString(account.botToken);
	if (!token) throw new Error(`Mattermost bot token missing for account "${account.accountId}" (set channels.mattermost.accounts.${account.accountId}.botToken or MATTERMOST_BOT_TOKEN for default).`);
	const baseUrl = normalizeMattermostBaseUrl(opts.baseUrl ?? account.baseUrl);
	if (!baseUrl) throw new Error(`Mattermost baseUrl missing for account "${account.accountId}" (set channels.mattermost.accounts.${account.accountId}.baseUrl or MATTERMOST_URL for default).`);
	const client = createMattermostClient({
		baseUrl,
		botToken: token,
		allowPrivateNetwork: account.config.network?.dangerouslyAllowPrivateNetwork === true,
		assertRequestCurrent: opts.assertDirectAdapterHandoff
	});
	const dmRetryOptions = mergeDmRetryOptions(account.config.dmChannelRetry, opts.dmRetryOptions);
	let channelId;
	try {
		const trimmedTo = normalizeOptionalString(to) ?? "";
		channelId = await resolveTargetChannelId({
			target: parseMattermostTarget((await resolveMattermostOpaqueTarget({
				input: trimmedTo,
				client
			}))?.to ?? trimmedTo),
			client,
			dmRetryOptions,
			logger: core.logging.shouldLogVerbose() ? logger : void 0
		});
	} catch (error) {
		client.assertRequestCurrent?.();
		throw error;
	}
	return {
		cfg,
		accountId: account.accountId,
		client,
		channelId,
		mediaMaxBytes: resolveChannelMediaMaxBytes({
			cfg,
			accountId: account.accountId,
			resolveChannelLimitMb: () => account.config.mediaMaxMb
		})
	};
}
async function sendMessageMattermost(to, text, opts) {
	const core = getMattermostRuntime();
	const logger = core.logging.getChildLogger({ module: "mattermost" });
	const { cfg, accountId, client, channelId, mediaMaxBytes } = await resolveMattermostSendContext(to, opts);
	client.assertRequestCurrent?.();
	let props = opts.props;
	if (!props && Array.isArray(opts.buttons) && opts.buttons.length > 0) {
		setInteractionSecret(accountId, client.token);
		props = buildButtonProps({
			callbackUrl: resolveInteractionCallbackUrl(accountId, {
				gateway: cfg.gateway,
				interactions: resolveMattermostAccount({
					cfg,
					accountId
				}).config?.interactions
			}),
			accountId,
			channelId,
			buttons: opts.buttons,
			text: opts.attachmentText
		});
	}
	let message = normalizeOptionalString(text) ?? "";
	let fileIds;
	let uploadError;
	const mediaUrl = opts.mediaUrl?.trim();
	if (mediaUrl) try {
		const media = await loadOutboundMediaFromUrl(mediaUrl, {
			maxBytes: mediaMaxBytes,
			mediaLocalRoots: opts.mediaLocalRoots,
			mediaReadFile: opts.mediaReadFile,
			workspaceDir: opts.workspaceDir
		});
		fileIds = [(await uploadMattermostFile(client, {
			channelId,
			buffer: media.buffer,
			fileName: media.fileName ?? `upload${extensionForMime(media.contentType) ?? ""}`,
			contentType: media.contentType ?? void 0
		})).id];
	} catch (err) {
		client.assertRequestCurrent?.();
		uploadError = err instanceof Error ? err : new Error(String(err));
		if (opts.requireMediaUpload || mediaMaxBytes !== void 0) throw new Error(`Mattermost media upload failed: ${uploadError.message}`, { cause: err });
		if (core.logging.shouldLogVerbose()) logger.debug?.(`mattermost send: media upload failed, falling back to URL text: ${String(err)}`);
		message = [message, /^https?:\/\//i.test(mediaUrl) ? mediaUrl : ""].filter(Boolean).join("\n");
	}
	if (message) {
		const tableMode = resolveMarkdownTableMode({
			cfg,
			channel: "mattermost",
			accountId
		});
		message = convertMarkdownTables(message, tableMode);
	}
	if (!message && (!fileIds || fileIds.length === 0)) {
		if (uploadError) throw new Error(`Mattermost media upload failed: ${uploadError.message}`, { cause: uploadError });
		throw new Error("Mattermost message is empty");
	}
	client.assertRequestCurrent?.();
	try {
		await opts.onPlatformSendDispatch?.();
	} catch (error) {
		client.assertRequestCurrent?.();
		throw error;
	}
	const post = await createMattermostPost(client, {
		channelId,
		message,
		rootId: opts.replyToId,
		fileIds,
		props
	});
	const messageId = post.id;
	const receipt = createMessageReceiptFromOutboundResults({
		results: [{
			channel: "mattermost",
			messageId,
			channelId
		}],
		kind: resolveMattermostReceiptKind({
			fileIds,
			buttons: opts.buttons,
			props
		}),
		...opts.replyToId ? { replyToId: opts.replyToId } : {}
	});
	const result = {
		messageId,
		channelId,
		receipt,
		content: post.message ?? message
	};
	try {
		await opts.onDeliveryResult?.(result);
		getOptionalMattermostRuntime()?.channel.activity.record({
			channel: "mattermost",
			accountId,
			direction: "outbound"
		});
	} catch (error) {
		throw createChannelPartialDeliveryError(error, {
			messageIds: listMessageReceiptPlatformIds(receipt),
			receipt,
			visibleReplySent: true,
			content: result.content
		});
	}
	return result;
}
//#endregion
export { resolveMattermostOpaqueTarget as n, sendMessageMattermost as t };
