import { a as runIMessageCliJsonCommand, n as createIMessageRpcClient } from "./client-Be3-fl6b.mjs";
import { u as resolveIMessageMessageId } from "./actions-hiNfM1nd.mjs";
import { n as sanitizeIMessageFinalOutboundText } from "./sanitize-outbound-Dhjhz0a-.mjs";
import { resolveIMessageChat } from "./chat-lookup-CecNl35X.mjs";
import { n as authorizeIMessageResourceReference, t as withIMessageRemoteFile } from "./remote-file-DBAUzsm1.mjs";
import { basename, parse, win32 } from "node:path";
import { truncateUtf16Safe } from "openclaw/plugin-sdk/text-utility-runtime";
import { captureChannelReadAuthority, captureEffectAuthority } from "openclaw/plugin-sdk/fetch-runtime";
import { sanitizeUntrustedFileName } from "openclaw/plugin-sdk/security-runtime";
import { resolvePreferredOpenClawTmpDir, withTempWorkspace } from "openclaw/plugin-sdk/temp-path";
// extensions/imessage/src/actions-transport.ts
function throwIMessageRemoteUnsupported(message) {
	throw Object.assign(/* @__PURE__ */ new Error(`iMessage Remote Mac limitation: ${message}`), {
		code: "IMESSAGE_REMOTE_UNSUPPORTED",
		name: "IMessageRemoteUnsupportedError"
	});
}
async function runIMessageAction(options, method, params, args) {
	if (!options.remoteHost) {
		const assertReadAuthority = captureChannelReadAuthority();
		return await captureEffectAuthority().initiate(() => {
			assertReadAuthority?.();
			return runIMessageCliJsonCommand({
				args,
				cliPath: options.cliPath,
				dbPath: options.dbPath,
				timeoutMs: options.timeoutMs
			});
		});
	}
	const client = await createIMessageRpcClient({
		cliPath: options.cliPath,
		dbPath: options.dbPath,
		remoteHost: options.remoteHost
	});
	try {
		return await client.request(method, params, { timeoutMs: options.timeoutMs });
	} finally {
		await client.stop();
	}
}
// extensions/imessage/src/actions.runtime.ts
/**
* Messages mints the option UUIDs, so the send response is the only place they
* appear before someone votes. Approval bindings key decisions off these ids
* rather than option text, which a vote payload could otherwise spoof.
*/
function readSentPollOptions(result) {
	const poll = result.poll;
	if (typeof poll !== "object" || poll === null) return [];
	const options = poll.options;
	if (!Array.isArray(options)) return [];
	return options.flatMap((entry) => {
		if (typeof entry !== "object" || entry === null) return [];
		const { id, text } = entry;
		if (typeof id !== "string" || typeof text !== "string") return [];
		const trimmedId = id.trim();
		return trimmedId ? [{
			id: trimmedId,
			text: text.trim()
		}] : [];
	});
}
function resolveMessageId(result) {
	return typeof result.messageGuid === "string" && result.messageGuid.trim() || typeof result.messageId === "string" && result.messageId.trim() || typeof result.message_id === "string" && result.message_id.trim() || typeof result.guid === "string" && result.guid.trim() || typeof result.id === "string" && result.id.trim() || (typeof result.message_id === "number" ? String(result.message_id) : "") || (typeof result.id === "number" ? String(result.id) : "") || "ok";
}
async function withTempFile(input, options, fn) {
	return await withTempWorkspace({
		rootDir: resolvePreferredOpenClawTmpDir(),
		prefix: "openclaw-imessage-"
	}, async (workspace) => {
		const safeFilename = sanitizeUntrustedFileName(input.filename, "upload.bin");
		const { name, ext: safeExtension } = parse(safeFilename);
		const originalExtension = parse(win32.basename(basename(input.filename))).ext;
		const extension = truncateUtf16Safe(sanitizeUntrustedFileName(originalExtension, safeExtension), 16);
		const filename = `${truncateUtf16Safe(name, 80 - extension.length)}${extension}`;
		const filePath = await workspace.write(filename, input.buffer);
		if (options.remoteHost) return await withIMessageRemoteFile({
			remoteHost: options.remoteHost,
			localPath: filePath,
			timeoutMs: options.timeoutMs,
			use: fn
		});
		return await fn(filePath);
	});
}
async function runMessageAction(params, method, command, fields = {}, args = [], trailingArgs = []) {
	await runIMessageAction(params.options, method, {
		chat_guid: params.chatGuid,
		message_id: params.messageId,
		part_index: params.partIndex ?? 0,
		...fields
	}, [
		command,
		"--chat",
		params.chatGuid,
		"--message",
		params.messageId,
		...args,
		"--part",
		String(params.partIndex ?? 0),
		...trailingArgs
	]);
}
function participantAction(method, command) {
	return async (params) => {
		await runIMessageAction(params.options, method, {
			chat_guid: params.chatGuid,
			address: params.address
		}, [
			command,
			"--chat",
			params.chatGuid,
			"--address",
			params.address
		]);
	};
}
const imessageActionsRuntime = {
	resolveIMessageMessageId,
	authorizeMessageReference: authorizeIMessageResourceReference,
	resolveChatGuidForTarget: async (params) => (await resolveIMessageChat(params))?.guid ?? null,
	async sendReaction(params) {
		await runMessageAction(params, "tapback", "tapback", {
			reaction: params.reaction,
			...params.remove ? { remove: true } : {}
		}, ["--kind", params.reaction], params.remove ? ["--remove"] : []);
	},
	async editMessage(params) {
		const text = sanitizeIMessageFinalOutboundText(params.text).text;
		const backwardsCompatMessage = sanitizeIMessageFinalOutboundText(params.backwardsCompatMessage ?? params.text).text;
		if (!text.trim() || !backwardsCompatMessage.trim()) throw new Error("iMessage edit requires non-empty text after sanitization");
		await runMessageAction(params, "message.edit", "edit", {
			text,
			backwards_compatibility_message: backwardsCompatMessage
		}, [
			"--new-text",
			text,
			"--bc-text",
			backwardsCompatMessage
		]);
	},
	async unsendMessage(params) {
		await runMessageAction(params, "message.unsend", "unsend");
	},
	async sendRichMessage(params) {
		const formatted = sanitizeIMessageFinalOutboundText(params.text, { formatMarkdown: true });
		if (!formatted.text.trim() && !params.attachment) throw new Error("iMessage rich send requires text or an attachment after sanitization");
		const buildArgs = (filePath) => [
			"send-rich",
			"--chat",
			params.chatGuid,
			"--text",
			formatted.text,
			"--part",
			String(params.partIndex ?? 0),
			...params.effectId ? ["--effect", params.effectId] : [],
			...params.replyToMessageId ? ["--reply-to", params.replyToMessageId] : [],
			...formatted.ranges.length > 0 ? ["--format", JSON.stringify(formatted.ranges)] : [],
			...filePath ? ["--file", filePath] : []
		];
		if (params.options.remoteHost) {
			if (params.attachment && (params.partIndex ?? 0) !== 0) throwIMessageRemoteUnsupported("attachment replies to a nonzero partIndex are not supported by imsg v0.13.4 JSON-RPC. Retry without partIndex or send the attachment separately.");
			if (params.attachment && params.effectId) throwIMessageRemoteUnsupported("combined attachment effects are not supported by imsg v0.13.4 JSON-RPC. Send the effect text and attachment separately.");
		}
		const send = async (filePath) => {
			return { messageId: resolveMessageId(await runIMessageAction(params.options, filePath ? "send" : "send.rich", {
				chat_guid: params.chatGuid,
				text: formatted.text,
				...filePath ? {
					file: filePath,
					transport: "bridge"
				} : {
					part_index: params.partIndex ?? 0,
					...params.effectId ? { effect: params.effectId } : {}
				},
				...params.replyToMessageId ? { reply_to: params.replyToMessageId } : {},
				...formatted.ranges.length > 0 ? filePath ? { formatting: formatted.ranges } : { text_formatting: formatted.ranges } : {}
			}, buildArgs(filePath))) };
		};
		return params.attachment ? await withTempFile(params.attachment, params.options, send) : await send();
	},
	async renameGroup(params) {
		await runIMessageAction(params.options, "group.rename", {
			chat_guid: params.chatGuid,
			name: params.displayName
		}, [
			"chat-name",
			"--chat",
			params.chatGuid,
			"--name",
			params.displayName
		]);
	},
	async setGroupIcon(params) {
		await withTempFile(params, params.options, async (filePath) => {
			await runIMessageAction(params.options, "group.setIcon", {
				chat_guid: params.chatGuid,
				file: filePath
			}, [
				"chat-photo",
				"--chat",
				params.chatGuid,
				"--file",
				filePath
			]);
		});
	},
	addParticipant: participantAction("group.addParticipant", "chat-add-member"),
	removeParticipant: participantAction("group.removeParticipant", "chat-remove-member"),
	async leaveGroup(params) {
		await runIMessageAction(params.options, "group.leave", { chat_guid: params.chatGuid }, [
			"chat-leave",
			"--chat",
			params.chatGuid
		]);
	},
	async sendPoll(params) {
		const question = sanitizeIMessageFinalOutboundText(params.question).text;
		const choices = params.choices.map((choice) => sanitizeIMessageFinalOutboundText(choice).text);
		if (!question.trim() || choices.some((choice) => !choice.trim())) throw new Error("iMessage poll requires a non-empty question and options after sanitization");
		if (new Set(choices.map((choice) => choice.trim())).size !== choices.length) throw new Error("iMessage poll options must remain distinct after sanitization");
		const result = await runIMessageAction(params.options, "poll.send", {
			chat_guid: params.chatGuid,
			question,
			options: choices,
			...params.replyToMessageId ? { reply_to: params.replyToMessageId } : {},
			...params.suppressComment ? { suppress_comment: true } : {}
		}, [
			"poll",
			"send",
			"--chat",
			params.chatGuid,
			"--question",
			question,
			...choices.flatMap((choice) => ["--option", choice]),
			...params.replyToMessageId ? ["--reply-to", params.replyToMessageId] : [],
			...params.suppressComment ? ["--no-comment"] : []
		]);
		return {
			messageId: resolveMessageId(result),
			pollOptions: readSentPollOptions(result)
		};
	},
	async sendPollVote(params) {
		if (params.options.remoteHost && !params.optionId) throwIMessageRemoteUnsupported("poll votes by option index or text are not supported by imsg v0.13.4 JSON-RPC. Retry with pollOptionId from the inbound poll options.");
		const selector = params.optionId ? ["--option-id", params.optionId] : params.optionIndex !== void 0 ? ["--option-index", String(params.optionIndex)] : params.optionText ? ["--option", params.optionText] : [];
		const result = await runIMessageAction(params.options, "poll.vote", {
			chat_guid: params.chatGuid,
			poll_guid: params.pollGuid,
			option_id: params.optionId
		}, [
			"poll",
			"vote",
			"--chat",
			params.chatGuid,
			"--poll",
			params.pollGuid,
			...selector
		]);
		const selectedText = params.options.remoteHost ? result.option_text : result.optionText;
		const optionText = typeof selectedText === "string" ? selectedText.trim() : "";
		return {
			messageId: resolveMessageId(result),
			...optionText ? { optionText } : {}
		};
	},
	async sendAttachment(params) {
		return await withTempFile(params, params.options, async (filePath) => {
			return { messageId: resolveMessageId(await runIMessageAction(params.options, "send.attachment", {
				chat_guid: params.chatGuid,
				file: filePath,
				...params.asVoice ? { audio: true } : {}
			}, [
				"send-attachment",
				"--chat",
				params.chatGuid,
				"--file",
				filePath,
				...params.asVoice ? ["--audio"] : []
			])) };
		});
	}
};
export { imessageActionsRuntime };
