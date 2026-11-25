import { f as resolveSlackOperationToken, s as resolveSlackAccount } from "./accounts-EaPP0fFY.mjs";
import { a as parseSlackTarget, t as canonicalizeSlackApiTargetId } from "./target-parsing-DwYAP3ts.mjs";
import { Yt as captureSlackWorkspaceInstallation } from "./probe-BHqvMbno.mjs";
import { t as normalizeSlackThreadTsCandidate } from "./thread-ts-47Au2-Yn.mjs";
import { c as createSlackWriteClient, i as createSlackReadClient } from "./cursor-pages-jVn3Vkfi.mjs";
import { t as buildSlackLiteralText } from "./literal-text-DdCRYzYh.mjs";
import { n as getSlackRuntime } from "./runtime-C6HKn7Av.mjs";
import { formatErrorMessage } from "openclaw/plugin-sdk/error-runtime";
import { getSessionBindingService } from "openclaw/plugin-sdk/session-binding-runtime";
import { isDeepStrictEqual } from "node:util";
// extensions/slack/src/fork.ts
const prepareSlackFork = async (params) => {
	const { source, sourceMessageId, senderId } = params;
	const threadTs = normalizeSlackThreadTsCandidate(source.threadId);
	const messageTs = normalizeSlackThreadTsCandidate(sourceMessageId);
	const parent = source.parentConversationId;
	const target = parent ? parseSlackTarget(parent, { defaultKind: "channel" }) : void 0;
	const installation = captureSlackWorkspaceInstallation(params.accountId);
	if (!params.isGroup || !threadTs || source.conversationId !== threadTs || !messageTs || messageTs === threadTs || !senderId || !target || target.kind !== "channel" || target.teamId || !/^[CG][A-Z0-9]+$/i.test(target.id) || !installation) return {
		ok: false,
		reason: "Use @OpenClaw /fork [title] as a message inside an existing public or private channel thread. Top-level messages, native slash commands, DMs, and Enterprise Grid installs are not supported."
	};
	const title = params.title ?? "Forked conversation";
	if (!title.trim() || title.length > 3e3 || /[\r\n]/.test(title)) return {
		ok: false,
		reason: "Use a single-line /fork title of at most 3000 characters. The title becomes the new root message."
	};
	const channelId = canonicalizeSlackApiTargetId("channel", target.id, parent);
	const runtime = getSlackRuntime();
	const account = resolveSlackAccount({
		cfg: params.cfg,
		accountId: params.accountId
	});
	const readToken = resolveSlackOperationToken(account, "read");
	const writeToken = resolveSlackOperationToken(account, "write");
	if (!account.enabled || !readToken || !writeToken) return {
		ok: false,
		reason: "The selected Slack account needs an active read credential and a write credential to fork a channel thread."
	};
	const assertCurrent = () => {
		params.assertCurrent();
		params.signal?.throwIfAborted();
		installation.assertCurrent();
		const current = resolveSlackAccount({
			cfg: runtime.config.current({ clone: true }),
			accountId: account.accountId
		});
		if (getSlackRuntime() !== runtime || !isDeepStrictEqual(current, account)) throw new Error("Slack account credentials or policy changed; send a new /fork request.");
	};
	assertCurrent();
	const read = createSlackReadClient(readToken, {}, void 0, assertCurrent);
	const write = createSlackWriteClient(writeToken, { rejectRateLimitedCalls: true }, assertCurrent);
	const { postMessage: postRoot } = write.chat;
	try {
		const info = await write.conversations.info({ channel: channelId });
		assertCurrent();
		const channel = info.channel;
		if (channel?.id !== channelId || !channel.is_channel && !channel.is_group || channel.is_im || channel.is_mpim || channel.is_archived || channel.is_member !== true) return {
			ok: false,
			reason: "The selected Slack identity must already belong to the same active public or private channel. DMs and group DMs cannot be forked."
		};
		const replies = await read.conversations.replies({
			channel: channelId,
			ts: threadTs,
			oldest: messageTs,
			latest: messageTs,
			inclusive: true,
			limit: 2
		});
		assertCurrent();
		if (!replies.messages?.some((message) => message.ts === messageTs && message.thread_ts === threadTs && message.user === senderId)) return {
			ok: false,
			reason: "Slack did not confirm this command message in the source thread. Send @OpenClaw /fork [title] inside that thread; no new root was created."
		};
	} catch (error) {
		assertCurrent();
		return {
			ok: false,
			reason: "Could not verify the Slack source thread: " + formatErrorMessage(error) + ". Check channel membership and thread-history read permissions; no new root was created."
		};
	}
	let creation;
	return {
		ok: true,
		assertCurrent,
		formatRecap: (text) => ({
			text,
			channelData: { slack: { literalText: true } }
		}),
		create: async (targetSessionKey) => {
			assertCurrent();
			if (creation) {
				if (creation.sessionKey !== targetSessionKey) throw new Error("This Slack fork request already selected a different copied session.");
				return creation.result;
			}
			const result = (async () => {
				assertCurrent();
				let rootTs;
				let returnedIdentity;
				try {
					assertCurrent();
					const posted = await postRoot({
						channel: channelId,
						...buildSlackLiteralText(title)
					});
					rootTs = normalizeSlackThreadTsCandidate(posted.ts);
					returnedIdentity = (posted.channel ?? "unknown channel") + "/" + (posted.ts ?? "unknown ts");
					if (!rootTs || posted.channel !== channelId || posted.message?.thread_ts && posted.message.thread_ts !== rootTs) throw new Error("Slack did not return a matching top-level root identity");
				} catch (error) {
					throw new Error("Slack root creation was not confirmed" + (returnedIdentity ? " (returned identity " + returnedIdentity + ")" : "") + ". Check channel " + channelId + " before retrying; this request will not create another root. " + formatErrorMessage(error), { cause: error });
				}
				try {
					assertCurrent();
					const binding = await getSessionBindingService().bind({
						targetSessionKey,
						targetKind: "session",
						placement: "current",
						conversation: {
							channel: "slack",
							accountId: account.accountId,
							conversationId: rootTs,
							parentConversationId: channelId
						},
						assertCurrent
					});
					assertCurrent();
					let url;
					try {
						const permalink = await read.chat.getPermalink({
							channel: channelId,
							message_ts: rootTs
						});
						assertCurrent();
						url = permalink.permalink;
					} catch {
						assertCurrent();
					}
					return {
						binding,
						url,
						notice: "The fork stays in the same Slack channel and has the same channel audience." + (url ? "" : " The continuation link could not be retrieved; the retained root is " + channelId + "/" + rootTs + ".")
					};
				} catch (error) {
					throw new Error("Slack root " + channelId + "/" + rootTs + " was created and is retained, but fork setup did not finish. Do not create another root without checking it. " + formatErrorMessage(error), { cause: error });
				}
			})();
			creation = {
				sessionKey: targetSessionKey,
				result
			};
			return result;
		}
	};
};
export { prepareSlackFork };
