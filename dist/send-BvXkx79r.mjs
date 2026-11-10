import { r as createRuntimeConfigReader } from "./runtime-snapshot-BBYDJbw9.mjs";
import "./channel-outbound-BbIm36V0.mjs";
import { o as resolveAgentRoute } from "./resolve-route-DvaXhzgP.mjs";
import { r as PlatformMessageNotDispatchedError } from "./deliver-types-ChQJdCfP.mjs";
import "./error-runtime-ikopZs5O.mjs";
import { t as createMessageReceiptFromOutboundResults } from "./receipt-C1maBxgO.mjs";
import { d as createChannelPartialDeliveryError } from "./live-BuMDR3AO.mjs";
import "./routing-Dl7FngGa.mjs";
import "./channel-inbound-C0d69q8b.mjs";
import "./runtime-config-snapshot-kTPhBdOK.mjs";
import { i as resolveXAccount } from "./accounts-n2C-ky3w.mjs";
import { i as openXAllowlist, r as normalizeXUserId, t as XAllowlistChangedError } from "./allowlist-Bk-oAvxJ.mjs";
import { a as XBudgetExceededError, c as findXUrls, t as getXApi } from "./client-D9-Q5PGR.mjs";
import { t as getXRuntime } from "./runtime-B1HOiKKH.mjs";
import { i as resolveXSenderTier, n as resolveXGuestSettings } from "./guest-policy-BDR2IA-u.mjs";
import { t as normalizeXReplyTarget } from "./target-Cu7hhfdb.mjs";
import { t as openXWorkOrigins } from "./work-origin-B7MxJjbF.mjs";
//#region extensions/x/src/recipient.ts
async function resolveXRecipient(options) {
	let post = typeof options.post === "string" ? void 0 : options.post;
	if (post?.author_id === options.userId) return;
	let users = options.users ?? [];
	let included = [];
	if (post?.entities?.mentions === void 0) {
		const postId = typeof options.post === "string" ? options.post : options.post.id;
		const page = await options.api.getPosts([postId], options.signal);
		post = page.data.find((candidate) => candidate.id === postId);
		users = [...users, ...page.includes.users];
		included = page.includes.tweets;
	}
	if (!post || post.author_id === options.userId) return;
	const mentions = post.entities?.mentions ?? [];
	if (mentions.some((mention) => mention.id === options.userId)) return {
		post,
		users
	};
	const unresolvedHandles = new Set(mentions.filter((mention) => !mention.id).map((mention) => mention.username.toLowerCase()));
	for (const username of unresolvedHandles) if ((await options.api.getUserByUsername(username, options.signal)).id === options.userId) return {
		post,
		users
	};
	if (options.allowQuote === false) return;
	const quoteIds = post.referenced_tweets?.filter((reference) => reference.type === "quoted").map((reference) => reference.id) ?? [];
	if (included.some((quote) => quoteIds.includes(quote.id) && quote.author_id === options.userId)) return {
		post,
		users
	};
	const missing = quoteIds.filter((id) => !included.some((quote) => quote.id === id));
	for (let offset = 0; offset < missing.length; offset += 100) if ((await options.api.getPosts(missing.slice(offset, offset + 100), options.signal)).data.some((quote) => quote.author_id === options.userId)) return {
		post,
		users
	};
}
//#endregion
//#region extensions/x/src/ingress.ts
const xMentionFacts = {
	canDetectMention: true,
	wasMentioned: true
};
/** Renew only the source permission, never the admitted run or its selected route. */
function createXPublicationPreparation(params) {
	return async () => {
		for (let attempt = 0;; attempt++) {
			try {
				params.assertActive();
			} catch {
				return null;
			}
			const cfg = params.readConfig();
			if (cfg !== params.cfg) return null;
			const route = resolveAgentRoute({
				cfg,
				channel: "x",
				accountId: params.accountId,
				peer: {
					kind: "group",
					id: params.post.conversation_id
				}
			});
			if (route.agentId !== params.route.agentId || route.sessionKey !== params.route.sessionKey || resolveXAccount(cfg, params.accountId).config.autoPublishWorkSessions !== true) return null;
			try {
				const authorization = await resolveXIngress(params.accountId, params.post, cfg);
				try {
					params.assertActive();
				} catch {
					return null;
				}
				if (params.readConfig() !== cfg) return null;
				const assertCurrent = () => {
					params.assertActive();
					authorization.assertCurrent();
					if (params.readConfig() !== cfg) throw new Error("X work-session publication policy changed; send a new mention.");
				};
				assertCurrent();
				if (!authorization.ingress.senderAccess.allowed || authorization.tier !== "maintainer") return null;
				return assertCurrent;
			} catch (error) {
				if (!(error instanceof XAllowlistChangedError)) throw error;
				if (attempt >= 2) return null;
			}
		}
	};
}
async function resolveXIngress(accountId, post, cfg, contextBinding, childSessionPublication) {
	const core = getXRuntime();
	const account = resolveXAccount(cfg, accountId);
	const snapshot = await openXAllowlist(core).readSnapshot(accountId, account.config.verifiedFromGitHub);
	const groupAllowFrom = [...account.config.allowFrom ?? [], ...snapshot.allowFrom];
	const tier = resolveXSenderTier(account, post.author_id);
	const guestsEnabled = resolveXGuestSettings(account).enabled;
	const ingress = await core.channel.inbound.ingress.resolveStable({
		channelId: "x",
		accountId,
		cfg,
		identity: {
			key: "x-user-id",
			normalize: (value) => normalizeXUserId(value) ?? "",
			sensitivity: "pii",
			entryIdPrefix: "x-entry"
		},
		subject: { stableId: post.author_id },
		conversation: {
			kind: "group",
			id: post.conversation_id
		},
		contextBinding,
		childSessionPublication,
		event: {
			kind: "message",
			authMode: "inbound",
			mayPair: false
		},
		dmPolicy: "disabled",
		groupPolicy: account.config.groupPolicy === "disabled" ? "disabled" : guestsEnabled ? "open" : "allowlist",
		allowFrom: account.config.allowFrom ?? [],
		groupAllowFrom,
		mentionFacts: xMentionFacts,
		policy: {
			groupAllowFromFallbackToAllowFrom: true,
			activation: {
				requireMention: true,
				allowTextCommands: false
			}
		}
	});
	const assertCurrent = () => {
		snapshot.assertCurrent();
		if (getXRuntime() !== core) throw new Error("X runtime changed during authorization");
	};
	assertCurrent();
	const githubEntry = snapshot.github?.entries.find((entry) => entry.xUserId === post.author_id);
	return {
		ingress,
		assertCurrent,
		tier,
		github: githubEntry && snapshot.github ? {
			repo: snapshot.github.repo,
			entry: githubEntry
		} : void 0
	};
}
//#endregion
//#region extensions/x/src/reply.ts
const DEFAULT_X_REPLY_SIGNATURE = "🤖 automated reply";
const graphemes = new Intl.Segmenter("en", { granularity: "grapheme" });
const emojiSequence = /* @__PURE__ */ new RegExp("^\\p{RGI_Emoji}$", "v");
function characterWeight(value) {
	if (emojiSequence.test(value) || /^\p{Extended_Pictographic}$/u.test(value)) return 2;
	return Array.from(value).reduce((total, char) => {
		const code = char.codePointAt(0);
		return total + (code <= 4351 || code >= 8192 && code <= 8205 || code >= 8208 && code <= 8223 || code >= 8242 && code <= 8247 ? 1 : 2);
	}, 0);
}
function weightedTokens(text) {
	const tokens = [];
	let offset = 0;
	const appendText = (value) => {
		tokens.push(...Array.from(graphemes.segment(value), ({ segment }) => ({
			text: segment,
			weight: characterWeight(segment)
		})));
	};
	for (const match of findXUrls(text)) {
		appendText(text.slice(offset, match.index));
		tokens.push({
			text: match.raw,
			weight: 23
		});
		offset = match.lastIndex;
	}
	appendText(text.slice(offset));
	return tokens;
}
function xWeightedLength(text) {
	return weightedTokens(text.normalize("NFC")).reduce((sum, token) => sum + token.weight, 0);
}
function appendVisibleWorkSession(text, sessions = []) {
	const session = sessions[0];
	const url = session?.url;
	const prefix = session?.publicRead === true ? "" : "Work session (sign-in required): ";
	return url && !text.includes(url) ? `${text.trimEnd()}\n${prefix}${url}` : text;
}
function chunkXReply(text, signature = DEFAULT_X_REPLY_SIGNATURE) {
	const normalized = text.normalize("NFC").trim();
	const suffix = signature.normalize("NFC").trim();
	if (!normalized) throw new Error("X replies require nonempty text");
	if (xWeightedLength(suffix) > 280) throw new Error("X replySignature exceeds 280 weighted characters");
	const tokens = weightedTokens(normalized);
	const chunks = [];
	let offset = 0;
	while (offset < tokens.length) {
		let end = offset;
		let weight = 0;
		let boundary = -1;
		while (end < tokens.length) {
			const token = tokens[end];
			if (!token || weight + token.weight > 280) break;
			weight += token.weight;
			if (/\s/u.test(token.text)) boundary = end;
			end++;
		}
		if (end === offset) throw new Error("X reply contains a character sequence longer than one post");
		if (end < tokens.length && boundary > offset) end = boundary;
		const chunk = tokens.slice(offset, end).map((token) => token.text).join("").trim();
		if (chunk) chunks.push(chunk);
		offset = end;
		while (offset < tokens.length && /^\s+$/u.test(tokens[offset]?.text ?? "")) offset++;
	}
	if (suffix) {
		const last = chunks.at(-1);
		if (xWeightedLength(`${last}\n${suffix}`) <= 280) chunks[chunks.length - 1] = `${last}\n${suffix}`;
		else chunks.push(suffix);
	}
	return chunks;
}
var XPartialReplyError = class extends Error {
	constructor(postIds, text, cause) {
		super("X reply chain failed after one or more posts were sent", { cause });
		this.postIds = postIds;
		this.text = text;
		this.name = "XPartialReplyError";
	}
};
async function sendXReply(options) {
	const replyToId = normalizeXReplyTarget(options.replyToId);
	if (!replyToId) throw new PlatformMessageNotDispatchedError("X target must be x:<postId> or an https://x.com/<handle>/status/<postId> URL", {
		cause: void 0,
		retryable: false
	});
	let chunks;
	try {
		chunks = chunkXReply(appendVisibleWorkSession(options.text, options.visibleWorkSessions), options.signature);
	} catch (cause) {
		throw new PlatformMessageNotDispatchedError(cause instanceof Error ? cause.message : "X reply text could not be prepared", {
			cause,
			retryable: false
		});
	}
	const postIds = [];
	try {
		for (const text of chunks) {
			if (options.signal?.aborted) throw new PlatformMessageNotDispatchedError("X reply was aborted before dispatch", {
				cause: options.signal.reason,
				retryable: false
			});
			const id = await options.api.reply({
				text,
				inReplyToId: postIds.at(-1) ?? replyToId,
				signal: options.signal,
				assertActive: options.assertActive
			});
			postIds.push(id);
		}
	} catch (cause) {
		if (postIds.length) throw new XPartialReplyError(postIds, chunks.slice(0, postIds.length).join("\n"), cause);
		throw cause;
	}
	return {
		postIds,
		text: chunks.join("\n")
	};
}
//#endregion
//#region extensions/x/src/send.ts
function rethrowReplyAuthorizationError(cause) {
	if (cause instanceof XAllowlistChangedError) throw new PlatformMessageNotDispatchedError("X reply allowlist changed during authorization.", {
		cause,
		retryable: false
	});
	throw cause;
}
function xReceipt(postIds, replyToId) {
	return createMessageReceiptFromOutboundResults({
		results: postIds.map((messageId) => ({
			channel: "x",
			messageId,
			conversationId: replyToId
		})),
		kind: "text",
		replyToId
	});
}
async function sendXDelivery(params) {
	if (params.mediaUrl || params.mediaUrls?.length) throw new PlatformMessageNotDispatchedError("X supports text replies only; media is not supported.", {
		cause: void 0,
		retryable: false
	});
	const replyToId = normalizeXReplyTarget(params.to);
	if (!replyToId) throw new PlatformMessageNotDispatchedError("X requires a reply target: x:<postId> or https://x.com/<handle>/status/<postId>.", {
		cause: void 0,
		retryable: false
	});
	const readConfig = createRuntimeConfigReader(params.cfg);
	const runtime = getXRuntime();
	const origin = params.sessionKey ? await openXWorkOrigins(runtime).lookup(params.sessionKey) : void 0;
	const assertHandoff = () => {
		try {
			params.signal?.throwIfAborted();
			params.assertDirectAdapterHandoff?.();
			if (getXRuntime() !== runtime) throw new Error("X reply runtime was replaced");
		} catch (cause) {
			if (cause instanceof PlatformMessageNotDispatchedError) throw cause;
			throw new PlatformMessageNotDispatchedError(cause instanceof Error ? cause.message : "X reply authority was revoked", {
				cause,
				retryable: false
			});
		}
	};
	let account;
	let api;
	let mention;
	try {
		account = resolveXAccount(params.cfg, params.accountId ?? origin?.accountId);
		api = await getXApi(account.accountId, params.cfg);
		assertHandoff();
		const resolvedMention = params.mention ?? (await resolveXRecipient({
			api,
			post: replyToId,
			userId: account.userId,
			signal: params.signal,
			allowQuote: !origin || replyToId === origin.postId
		}))?.post;
		if (!resolvedMention) throw new PlatformMessageNotDispatchedError("X only replies to posts that mention or quote this bot account and are available.", {
			cause: void 0,
			retryable: false
		});
		mention = resolvedMention;
		if (origin && (origin.accountId !== account.accountId || replyToId !== origin.postId && mention.conversation_id !== origin.conversationId)) throw new PlatformMessageNotDispatchedError(`This X work session may reply only to its origin post (${origin.postUrl}) or a bot mention in that conversation.`, {
			cause: void 0,
			retryable: false
		});
	} catch (cause) {
		if (cause instanceof PlatformMessageNotDispatchedError) throw cause;
		throw new PlatformMessageNotDispatchedError(cause instanceof Error ? cause.message : "X reply preparation failed", {
			cause,
			retryable: !(cause instanceof XBudgetExceededError) && !params.signal?.aborted
		});
	}
	const assertActive = async () => {
		assertHandoff();
		const cfg = readConfig();
		const current = resolveXAccount(cfg, account.accountId);
		if (!current.enabled || current.userId !== account.userId || mention.author_id === current.userId) throw new PlatformMessageNotDispatchedError("X reply author is no longer allowed or the account changed.", {
			cause: void 0,
			retryable: false
		});
		const authorization = await resolveXIngress(account.accountId, mention, cfg).catch(rethrowReplyAuthorizationError);
		if (!authorization.ingress.senderAccess.allowed || params.senderTier && authorization.tier !== params.senderTier) throw new PlatformMessageNotDispatchedError("X reply author is no longer allowed.", {
			cause: void 0,
			retryable: false
		});
		const assertCurrent = () => {
			assertHandoff();
			try {
				authorization.assertCurrent();
			} catch (cause) {
				rethrowReplyAuthorizationError(cause);
			}
			if (cfg !== readConfig()) throw new PlatformMessageNotDispatchedError("X reply policy changed during authorization; retry the reply", { cause: void 0 });
		};
		assertCurrent();
		return assertCurrent;
	};
	const logger = runtime.logging.getChildLogger({
		channel: "x",
		accountId: account.accountId
	});
	try {
		const result = await sendXReply({
			api,
			text: params.text,
			replyToId,
			signature: account.config.replySignature,
			visibleWorkSessions: params.senderTier === "guest" ? void 0 : params.visibleWorkSessions,
			signal: params.signal,
			assertActive
		});
		logger.info(`reply posts=${result.postIds.join(",")}`);
		return {
			channel: "x",
			messageId: result.postIds.at(-1) ?? "",
			receipt: xReceipt(result.postIds, replyToId),
			content: result.text
		};
	} catch (error) {
		if (error instanceof XPartialReplyError) {
			logger.warn(`partial reply posts=${error.postIds.join(",")}`);
			throw createChannelPartialDeliveryError(error, {
				visibleReplySent: true,
				content: error.text,
				receipt: xReceipt(error.postIds, replyToId)
			});
		}
		throw error;
	}
}
//#endregion
export { xMentionFacts as a, resolveXIngress as i, xReceipt as n, resolveXRecipient as o, createXPublicationPreparation as r, sendXDelivery as t };
