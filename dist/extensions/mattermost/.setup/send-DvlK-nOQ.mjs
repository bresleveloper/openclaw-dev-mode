import { c as setInteractionSecret, n as buildButtonProps, o as resolveInteractionCallbackUrl } from "./interactions-BrvSFYI9.mjs";
import { a as createMattermostPost, b as uploadMattermostFile, c as fetchMattermostChannelByName, d as fetchMattermostUser, f as fetchMattermostUserByUsername, g as parseMattermostApiStatus, h as normalizeMattermostBaseUrl, i as createMattermostDirectChannelWithRetry, p as fetchMattermostUserTeams, r as createMattermostClient, s as fetchMattermostChannel, u as fetchMattermostMe } from "./client-CVipK0N2.mjs";
import { s as resolveMattermostTrustedChatKind, v as loadOutboundMediaFromUrl } from "./monitor-auth-C9TiGGVQ.mjs";
import { n as getOptionalMattermostRuntime, t as getMattermostRuntime } from "./runtime-y_L8jPMH.mjs";
import { d as resolveMattermostAccount, o as createMattermostAccountClient } from "./normalize-V4AG9QEw.mjs";
import { normalizeLowercaseStringOrEmpty, normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
import { createChannelPartialDeliveryError } from "openclaw/plugin-sdk/channel-inbound";
import { createMessageReceiptFromOutboundResults, listMessageReceiptPlatformIds } from "openclaw/plugin-sdk/channel-outbound";
import { resolveChannelMediaMaxBytes } from "openclaw/plugin-sdk/account-helpers";
import { resolveTextChunksWithFallback } from "openclaw/plugin-sdk/reply-payload";
import { convertMarkdownTables } from "openclaw/plugin-sdk/text-chunking";
import { createStaleWhileRevalidateCache, pruneMapToMaxSize } from "openclaw/plugin-sdk/collection-runtime";
import { resolveMarkdownTableMode } from "openclaw/plugin-sdk/markdown-table-runtime";
import { extensionForMime } from "openclaw/plugin-sdk/media-mime";
import { requireRuntimeConfig } from "openclaw/plugin-sdk/plugin-config-runtime";
// extensions/mattermost/src/mattermost/target-resolution.ts
const mattermostOpaqueTargetCache = createStaleWhileRevalidateCache({
	maxEntries: 1024,
	maxPending: Number.POSITIVE_INFINITY,
	ttlMs: 3e5,
	cacheable: (kind) => kind !== void 0
});
function cacheKey$1(baseUrl, token, id) {
	return `${baseUrl}::${token}::${id}`;
}
/** Mattermost IDs are 26-character lowercase alphanumeric strings. */
function isMattermostId(value) {
	return /^[a-z0-9]{26}$/.test(value);
}
function parseMattermostTarget(raw) {
	let trimmed = raw.trim();
	if (!trimmed) throw new Error("Recipient is required for Mattermost sends");
	const lower = normalizeLowercaseStringOrEmpty(trimmed);
	if (lower.startsWith("channel:")) {
		trimmed = trimmed.slice(8).trim();
		if (!trimmed) throw new Error("Channel id is required for Mattermost sends");
	} else if (lower.startsWith("user:") || lower.startsWith("mattermost:")) {
		const id = trimmed.slice(trimmed.indexOf(":") + 1).trim();
		if (!id) throw new Error("User id is required for Mattermost sends");
		return {
			kind: "user",
			id
		};
	} else if (trimmed.startsWith("@")) {
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
	const { value } = await mattermostOpaqueTargetCache.read(key, async () => {
		try {
			await fetchMattermostUser(client, input);
			return "user";
		} catch (err) {
			if (parseMattermostApiStatus(err) !== 404) return;
		}
		try {
			const channel = await fetchMattermostChannel(client, input);
			return resolveMattermostTrustedChatKind({ channelType: channel.type }) === "group" ? "group" : "channel";
		} catch {
			return;
		}
	}, { allowStale: false });
	const kind = value ?? "channel";
	return {
		kind,
		to: `${kind === "user" ? "user" : "channel"}:${input}`
	};
}
// extensions/mattermost/src/mattermost/send.ts
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
function cacheKey(baseUrl, token) {
	return `${baseUrl}::${token}`;
}
async function sendMessageMattermost(to, text, opts) {
	const core = getMattermostRuntime();
	const logger = core.logging.getChildLogger({ module: "mattermost" });
	const cfg = requireRuntimeConfig(opts?.cfg, "Mattermost send");
	const account = resolveMattermostAccount({
		cfg,
		accountId: opts.accountId
	});
	const { client } = createMattermostAccountClient(account, opts, opts.assertDirectAdapterHandoff);
	const dmRetryOptions = account.config.dmChannelRetry;
	let channelId;
	try {
		const trimmedTo = normalizeOptionalString(to) ?? "";
		const target = parseMattermostTarget((await resolveMattermostOpaqueTarget({
			input: trimmedTo,
			client
		}))?.to ?? trimmedTo);
		const targetLogger = core.logging.shouldLogVerbose() ? logger : void 0;
		channelId = await (async () => {
			if (target.kind === "channel") return target.id;
			if (target.kind === "channel-name") {
				const name = target.name;
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
			let userId = target.id;
			if (!userId) {
				const username = target.username ?? "";
				const key = `${cacheKey(client.baseUrl, client.token)}::${normalizeLowercaseStringOrEmpty(username)}`;
				const cached = userByNameCache.get(key);
				if (cached?.id) userId = cached.id;
				else {
					const user = await fetchMattermostUserByUsername(client, username);
					cacheOutboundEntry(userByNameCache, key, user, MATTERMOST_TARGET_CACHE_MAX_ENTRIES);
					userId = user.id;
				}
			}
			const dmKey = `${cacheKey(client.baseUrl, client.token)}::dm::${userId}`;
			const cachedDm = dmChannelCache.get(dmKey);
			if (cachedDm) return cachedDm;
			const botKey = cacheKey(client.baseUrl, client.token);
			let botUser = botUserCache.get(botKey);
			if (!botUser) {
				botUser = await fetchMattermostMe(client);
				cacheOutboundEntry(botUserCache, botKey, botUser, MATTERMOST_BOT_USER_CACHE_MAX_ENTRIES);
			}
			const channel = await createMattermostDirectChannelWithRetry(client, [botUser.id, userId], {
				...dmRetryOptions,
				onRetry: (attempt, delayMs, error) => {
					targetLogger?.warn?.(`DM channel creation retry ${attempt} after ${delayMs}ms: ${error.message}`);
				}
			});
			cacheOutboundEntry(dmChannelCache, dmKey, channel.id, MATTERMOST_TARGET_CACHE_MAX_ENTRIES);
			return channel.id;
		})();
	} catch (error) {
		client.assertRequestCurrent?.();
		throw error;
	}
	const accountId = account.accountId;
	const mediaMaxBytes = resolveChannelMediaMaxBytes({
		cfg,
		accountId: account.accountId,
		resolveChannelLimitMb: () => account.config.mediaMaxMb
	});
	client.assertRequestCurrent?.();
	let props = opts.props;
	if (!props && opts.buttons?.length) {
		setInteractionSecret(accountId, client.token);
		props = buildButtonProps({
			callbackUrl: resolveInteractionCallbackUrl(accountId, {
				gateway: cfg.gateway,
				interactions: account.config.interactions
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
			mediaAccess: opts.mediaAccess,
			mediaLocalRoots: opts.mediaLocalRoots,
			mediaReadFile: opts.mediaReadFile,
			workspaceDir: opts.workspaceDir
		});
		fileIds = [(await uploadMattermostFile(client, {
			channelId,
			buffer: media.buffer,
			fileName: media.fileName ?? `upload${extensionForMime(media.contentType) ?? ""}`,
			contentType: media.contentType
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
	const messageParts = fileIds?.length && message ? resolveTextChunksWithFallback(message, core.channel.text.chunkMarkdownTextWithMode(message, core.channel.text.resolveTextChunkLimit(cfg, "mattermost", accountId, { fallbackLimit: account.textChunkLimit ?? 4e3 }), core.channel.text.resolveChunkMode(cfg, "mattermost", accountId))) : [message];
	const kind = fileIds?.length ? "media" : opts.buttons?.length || props ? "card" : "text";
	const posts = [];
	const createResult = (sent) => ({
		messageId: sent[0].messageId,
		channelId,
		receipt: createMessageReceiptFromOutboundResults({
			results: sent.map(({ messageId }) => ({
				channel: "mattermost",
				messageId,
				channelId
			})),
			kind,
			sentAt: sent[0].sentAt,
			...opts.replyToId ? { replyToId: opts.replyToId } : {}
		}),
		content: sent.map((post) => post.content).join("\n")
	});
	client.assertRequestCurrent?.();
	try {
		await opts.onPlatformSendDispatch?.();
	} catch (error) {
		client.assertRequestCurrent?.();
		throw error;
	}
	try {
		for (const [index, part] of messageParts.entries()) {
			const post = await createMattermostPost(client, {
				channelId,
				message: part,
				rootId: opts.replyToId,
				...index === 0 ? {
					fileIds,
					props
				} : {}
			});
			posts.push({
				messageId: post.id,
				content: post.message ?? part,
				sentAt: Date.now()
			});
			await opts.onDeliveryResult?.(createResult(posts.slice(-1)));
		}
		getOptionalMattermostRuntime()?.channel.activity.record({
			channel: "mattermost",
			accountId,
			direction: "outbound"
		});
	} catch (error) {
		if (posts.length === 0) throw error;
		const sent = createResult(posts);
		throw createChannelPartialDeliveryError(error, {
			messageIds: listMessageReceiptPlatformIds(sent.receipt),
			receipt: sent.receipt,
			visibleReplySent: true,
			content: sent.content
		});
	}
	return createResult(posts);
}
export { resolveMattermostOpaqueTarget as n, sendMessageMattermost as t };
