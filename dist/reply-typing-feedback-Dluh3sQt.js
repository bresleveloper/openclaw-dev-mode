import { t as createTypingCallbacks } from "./typing-DnYJejsM.js";
import "./channel-outbound-BopAOIGF.js";
import { r as logTypingFailure } from "./logging-gUWPKC5g.js";
import "./channel-feedback-ChYFAgPX.js";
import { I as createDiscordRestClient } from "./send.shared-BR-nJT_K.js";
import { t as sendTyping } from "./typing-DKy9eSOT.js";
//#region extensions/discord/src/monitor/reply-typing-feedback.ts
const DISCORD_REPLY_TYPING_MAX_DURATION_MS = 20 * 6e4;
function createDiscordReplyTypingFeedback(params) {
	let channelId = params.channelId;
	const rest = params.rest ?? createDiscordRestClient({
		cfg: params.cfg,
		token: params.token,
		accountId: params.accountId
	}).rest;
	const createCallbacks = () => createTypingCallbacks({
		start: () => sendTyping({
			rest,
			channelId
		}),
		onStartError: (err) => {
			logTypingFailure({
				log: params.log,
				channel: "discord",
				target: channelId,
				error: err
			});
		},
		keepaliveIntervalMs: params.keepaliveIntervalMs,
		maxDurationMs: params.maxDurationMs ?? DISCORD_REPLY_TYPING_MAX_DURATION_MS
	});
	const updateChannelId = (nextChannelId) => {
		const trimmed = nextChannelId.trim();
		if (trimmed) channelId = trimmed;
	};
	let callbacks = createCallbacks();
	return {
		onReplyStart: () => callbacks.onReplyStart(),
		onIdle: () => callbacks.onIdle?.(),
		onCleanup: () => callbacks.onCleanup?.(),
		updateChannelId,
		restartForDispatch: (nextChannelId) => {
			updateChannelId(nextChannelId);
			callbacks.onCleanup?.();
			callbacks = createCallbacks();
		},
		getChannelId: () => channelId
	};
}
//#endregion
export { createDiscordReplyTypingFeedback as t };
