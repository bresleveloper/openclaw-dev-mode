import { _ as readReactionParams, b as readStringParam, g as readPositiveIntegerParam, i as createActionGate, l as jsonResult } from "./common-B2QjWqqG.js";
import { n as loadOutboundMediaFromUrl } from "./outbound-media-BtSFem1l.js";
import "./channel-actions-CdLhqkfP.js";
import { t as extractToolSend } from "./tool-send-DlIp2cBO.js";
import { i as resolveGoogleChatAccount, t as listEnabledGoogleChatAccounts } from "./accounts-DwCzvEYh.js";
import { a as createGoogleChatReaction, d as sendGoogleChatMessage, i as resolveGoogleChatOutboundSpace, l as listGoogleChatReactions, p as uploadGoogleChatAttachment, s as deleteGoogleChatReaction } from "./targets-BwukKshu.js";
import { t as getGoogleChatRuntime } from "./runtime-api-DUzEmaFL.js";
//#region extensions/googlechat/src/actions.ts
const providerId = "googlechat";
function listEnabledAccounts(cfg) {
	return listEnabledGoogleChatAccounts(cfg).filter((account) => account.enabled && account.credentialSource !== "none");
}
function isReactionsEnabled(accounts) {
	for (const account of accounts) if (createActionGate(account.config.actions)("reactions")) return true;
	return false;
}
function resolveAppUserNames(account) {
	return new Set(["users/app", account.config.botUser?.trim()].filter(Boolean));
}
async function loadGoogleChatActionMedia(params) {
	const runtime = getGoogleChatRuntime();
	return /^https?:\/\//i.test(params.mediaUrl) ? await runtime.channel.media.readRemoteMediaBuffer({
		url: params.mediaUrl,
		maxBytes: params.maxBytes
	}) : await loadOutboundMediaFromUrl(params.mediaUrl, {
		maxBytes: params.maxBytes,
		mediaAccess: params.mediaAccess,
		mediaLocalRoots: params.mediaLocalRoots,
		mediaReadFile: params.mediaReadFile
	});
}
const googlechatMessageActions = {
	describeMessageTool: ({ cfg, accountId }) => {
		const accounts = accountId ? [resolveGoogleChatAccount({
			cfg,
			accountId
		})].filter((account) => account.enabled && account.credentialSource !== "none") : listEnabledAccounts(cfg);
		if (accounts.length === 0) return null;
		const actions = /* @__PURE__ */ new Set([]);
		actions.add("send");
		actions.add("upload-file");
		if (isReactionsEnabled(accounts)) {
			actions.add("react");
			actions.add("reactions");
		}
		return { actions: Array.from(actions) };
	},
	extractToolSend: ({ args }) => {
		return extractToolSend(args, "sendMessage");
	},
	handleAction: async ({ action, params, cfg, accountId, mediaAccess, mediaLocalRoots, mediaReadFile }) => {
		const account = resolveGoogleChatAccount({
			cfg,
			accountId
		});
		if (account.credentialSource === "none") throw new Error("Google Chat credentials are missing.");
		if (action === "send" || action === "upload-file") {
			const to = readStringParam(params, "to", { required: true });
			const content = readStringParam(params, "message", {
				required: action === "send",
				allowEmpty: true
			}) ?? readStringParam(params, "initialComment", { allowEmpty: true }) ?? "";
			const mediaUrl = readStringParam(params, "media", { trim: false }) ?? readStringParam(params, "filePath", { trim: false }) ?? readStringParam(params, "path", { trim: false });
			const threadId = readStringParam(params, "threadId") ?? readStringParam(params, "replyTo");
			const space = await resolveGoogleChatOutboundSpace({
				account,
				target: to
			});
			if (mediaUrl) {
				const loaded = await loadGoogleChatActionMedia({
					mediaUrl,
					maxBytes: (account.config.mediaMaxMb ?? 20) * 1024 * 1024,
					mediaAccess,
					mediaLocalRoots,
					mediaReadFile
				});
				const uploadFileName = readStringParam(params, "filename") ?? readStringParam(params, "title") ?? loaded.fileName ?? "attachment";
				const upload = await uploadGoogleChatAttachment({
					account,
					space,
					filename: uploadFileName,
					buffer: loaded.buffer,
					contentType: loaded.contentType
				});
				return jsonResult({
					ok: true,
					to: space,
					...await sendGoogleChatMessage({
						account,
						space,
						text: content,
						thread: threadId ?? void 0,
						attachments: upload.attachmentUploadToken ? [{
							attachmentUploadToken: upload.attachmentUploadToken,
							contentName: uploadFileName
						}] : void 0
					})
				});
			}
			if (action === "upload-file") throw new Error("upload-file requires media, filePath, or path");
			return jsonResult({
				ok: true,
				to: space,
				...await sendGoogleChatMessage({
					account,
					space,
					text: content,
					thread: threadId ?? void 0
				})
			});
		}
		if (action === "react") {
			const messageName = readStringParam(params, "messageId", { required: true });
			const { emoji, remove, isEmpty } = readReactionParams(params, { removeErrorMessage: "Emoji is required to remove a Google Chat reaction." });
			if (remove || isEmpty) {
				const reactions = await listGoogleChatReactions({
					account,
					messageName
				});
				const appUsers = resolveAppUserNames(account);
				const toRemove = reactions.filter((reaction) => {
					const userName = reaction.user?.name?.trim();
					if (appUsers.size > 0 && !appUsers.has(userName ?? "")) return false;
					if (emoji) return reaction.emoji?.unicode === emoji;
					return true;
				});
				for (const reaction of toRemove) {
					if (!reaction.name) continue;
					await deleteGoogleChatReaction({
						account,
						reactionName: reaction.name
					});
				}
				return jsonResult({
					ok: true,
					removed: toRemove.length
				});
			}
			return jsonResult({
				ok: true,
				reaction: await createGoogleChatReaction({
					account,
					messageName,
					emoji
				})
			});
		}
		if (action === "reactions") return jsonResult({
			ok: true,
			reactions: await listGoogleChatReactions({
				account,
				messageName: readStringParam(params, "messageId", { required: true }),
				limit: readPositiveIntegerParam(params, "limit") ?? void 0
			})
		});
		throw new Error(`Action ${action} is not supported for provider ${providerId}.`);
	}
};
//#endregion
export { googlechatMessageActions };
