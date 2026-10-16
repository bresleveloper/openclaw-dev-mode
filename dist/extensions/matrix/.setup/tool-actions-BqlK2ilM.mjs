import { a as resolveMatrixAccountConfig, o as resolveMatrixBaseConfig } from "./account-config-CRsKoMqJ.mjs";
import { r as resolveDefaultMatrixAccountId } from "./accounts-C_r0UlEm.mjs";
import { o as resolveMatrixRoomConfig } from "./channel-CeRXEAEP.mjs";
import { i as normalizeMatrixResolvableTarget } from "./target-ids-Nwx7cMVE.mjs";
import { l as selectOwnMatrixReactionEventIds, s as buildMatrixReactionRelationsPath, u as summarizeMatrixReactionEvents } from "./send-currentness-C2rMVVIQ.mjs";
import { c as isStrictDirectMembership, s as hasDirectMatrixMemberFlag, u as readJoinedMatrixMembers } from "./direct-management-DJtQhLKH.mjs";
import { C as resolveMatrixRoomId, n as reactMatrixMessage, p as buildPollResponseContent, v as isPollStartType, y as parsePollStart } from "./send-B1Y2L4wj.mjs";
import { i as parseMxc } from "./event-helpers-CspuhE9k.mjs";
import { a as sendMatrixMessage, c as EventType, i as readMatrixMessages, l as resolveMatrixActionLimit, n as editMatrixMessage, o as fetchEventSummary, r as readMatrixMessage, s as readPinnedEvents, t as deleteMatrixMessage } from "./messages-uCbwLRKS.mjs";
import { n as withResolvedActionClient, r as withResolvedRoomAction } from "./client-DY3HExqI.mjs";
import { t as applyMatrixProfileUpdate } from "./profile-update-C1n8SRqH.mjs";
import { _ as scanMatrixVerificationQr, a as confirmMatrixVerificationSas, b as verifyMatrixRecoveryKey, c as getMatrixRoomKeyBackupStatus, d as listMatrixVerifications, f as mismatchMatrixVerificationSas, h as restoreMatrixRoomKeyBackup, i as confirmMatrixVerificationReciprocateQr, l as getMatrixVerificationSas, n as bootstrapMatrixVerification, o as generateMatrixVerificationQr, p as requestMatrixVerification, r as cancelMatrixVerification, s as getMatrixEncryptionStatus, t as acceptMatrixVerification, u as getMatrixVerificationStatus, v as startMatrixVerification } from "./verification-kMlFYUn0.mjs";
import { n as getMatrixMemberInfo, r as getMatrixRoomInfo, t as createMatrixRoomInfoResolver } from "./room-info-BPMbwe8I.mjs";
import { normalizeAccountId } from "openclaw/plugin-sdk/account-id";
import { isRecord, normalizeLowercaseStringOrEmpty, normalizeOptionalLowercaseString, uniqueStrings, uniqueValues } from "openclaw/plugin-sdk/string-coerce-runtime";
import { ToolAuthorizationError, createActionGate, jsonResult, readPositiveIntegerParam, readReactionParams, readStringArrayParam, readStringParam } from "openclaw/plugin-sdk/channel-actions";
import { timestampMsToIsoString } from "openclaw/plugin-sdk/number-runtime";
import { captureChannelReadAuthority } from "openclaw/plugin-sdk/fetch-runtime";
import { resolveAllowlistProviderRuntimeGroupPolicy, resolveDefaultGroupPolicy } from "openclaw/plugin-sdk/runtime-group-policy";
//#region extensions/matrix/src/matrix/actions/pins.ts
async function updateMatrixPins(roomId, opts, update) {
	return await withResolvedRoomAction(roomId, opts, async (client, resolvedRoom) => {
		const next = update(await readPinnedEvents(client, resolvedRoom));
		const payload = { pinned: next };
		await client.sendStateEvent(resolvedRoom, EventType.RoomPinnedEvents, "", payload);
		return { pinned: next };
	});
}
async function pinMatrixMessage(roomId, messageId, opts = {}) {
	return await updateMatrixPins(roomId, opts, (current) => current.includes(messageId) ? current : [...current, messageId]);
}
async function unpinMatrixMessage(roomId, messageId, opts = {}) {
	return await updateMatrixPins(roomId, opts, (current) => current.filter((id) => id !== messageId));
}
async function listMatrixPins(roomId, opts = {}) {
	return await withResolvedRoomAction(roomId, opts, async (client, resolvedRoom) => {
		const pinned = await readPinnedEvents(client, resolvedRoom);
		return {
			pinned,
			events: (await Promise.all(pinned.map((eventId) => fetchEventSummary(client, resolvedRoom, eventId)))).filter((event) => Boolean(event))
		};
	});
}
//#endregion
//#region extensions/matrix/src/matrix/actions/polls.ts
function normalizeOptionIndexes(indexes) {
	const normalized = indexes.map((index) => Math.trunc(index)).filter((index) => Number.isFinite(index) && index > 0);
	return uniqueValues(normalized);
}
function normalizeOptionIds(optionIds) {
	return uniqueStrings(optionIds.map((optionId) => optionId.trim()).filter((optionId) => optionId.length > 0));
}
function resolveSelectedAnswerIds(params) {
	const parsed = parsePollStart(params.pollContent);
	if (!parsed) throw new Error("Matrix poll vote requires a valid poll start event.");
	const selectedById = normalizeOptionIds(params.optionIds ?? []);
	const selectedByIndex = normalizeOptionIndexes(params.optionIndexes ?? []).map((index) => {
		const answer = parsed.answers[index - 1];
		if (!answer) throw new Error(`Matrix poll option index ${index} is out of range for a poll with ${parsed.answers.length} options.`);
		return answer.id;
	});
	const answerIds = normalizeOptionIds([...selectedById, ...selectedByIndex]);
	if (answerIds.length === 0) throw new Error("Matrix poll vote requires at least one poll option id or index.");
	if (answerIds.length > parsed.maxSelections) throw new Error(`Matrix poll allows at most ${parsed.maxSelections} selection${parsed.maxSelections === 1 ? "" : "s"}.`);
	const answerMap = new Map(parsed.answers.map((answer) => [answer.id, answer.text]));
	return {
		answerIds,
		labels: answerIds.map((answerId) => {
			const label = answerMap.get(answerId);
			if (!label) throw new Error(`Matrix poll option id "${answerId}" is not valid for poll ${parsed.question}.`);
			return label;
		}),
		maxSelections: parsed.maxSelections
	};
}
async function voteMatrixPoll(roomId, pollId, opts = {}) {
	return await withResolvedRoomAction(roomId, opts, async (client, resolvedRoom) => {
		const pollEvent = await client.getEvent(resolvedRoom, pollId);
		const eventType = typeof pollEvent.type === "string" ? pollEvent.type : "";
		if (!isPollStartType(eventType)) throw new Error(`Event ${pollId} is not a Matrix poll start event.`);
		const { answerIds, labels, maxSelections } = resolveSelectedAnswerIds({
			optionIds: [...opts.optionIds ?? [], ...opts.optionId ? [opts.optionId] : []],
			optionIndexes: [...opts.optionIndexes ?? [], ...opts.optionIndex !== void 0 ? [opts.optionIndex] : []],
			pollContent: pollEvent.content
		});
		const content = buildPollResponseContent(pollId, answerIds);
		return {
			eventId: await client.sendEvent(resolvedRoom, "m.poll.response", content) ?? null,
			roomId: resolvedRoom,
			pollId,
			answerIds,
			labels,
			maxSelections
		};
	});
}
//#endregion
//#region extensions/matrix/src/matrix/actions/reactions.ts
async function listMatrixEmojis(roomId, opts = {}) {
	return await withResolvedRoomAction(roomId, opts, async (client, resolvedRoom) => {
		const [roomState, personalPack] = await Promise.all([client.doRequest("GET", `/_matrix/client/v3/rooms/${encodeURIComponent(resolvedRoom)}/state`), client.getAccountData("im.ponies.user_emotes")]);
		if (!Array.isArray(roomState)) throw new Error("Matrix room state response is invalid.");
		const packs = roomState.filter((event) => isRecord(event) && event.type === "im.ponies.room_emotes" && typeof event.state_key === "string").map((event) => event.content);
		if (personalPack) packs.push(personalPack);
		const emojis = [];
		for (const pack of packs) {
			if (!isRecord(pack) || !isRecord(pack.images)) continue;
			const packUsage = isRecord(pack.pack) ? pack.pack.usage : void 0;
			for (const [rawName, image] of Object.entries(pack.images)) {
				const name = rawName.trim();
				if (!name || !isRecord(image) || typeof image.url !== "string") continue;
				const url = image.url.trim();
				const usage = image.usage === void 0 ? packUsage : image.usage;
				if (!parseMxc(url) || usage !== void 0 && (!Array.isArray(usage) || usage.some((value) => typeof value !== "string") || !usage.includes("emoticon"))) continue;
				emojis.push({
					name,
					identifier: name,
					url
				});
			}
		}
		return emojis.toSorted((left, right) => left.name.localeCompare(right.name) || left.url.localeCompare(right.url)).slice(0, Math.min(resolveMatrixActionLimit(opts.limit, 100), 100));
	});
}
async function listMatrixReactionEvents(client, roomId, messageId, limit, opts = {}) {
	const events = [];
	const seenCursors = /* @__PURE__ */ new Set();
	let cursor;
	while (true) {
		const res = await client.doRequest("GET", buildMatrixReactionRelationsPath(roomId, messageId), {
			dir: "b",
			limit,
			...cursor ? { from: cursor } : {}
		});
		if (Array.isArray(res.chunk)) events.push(...res.chunk);
		const nextCursor = typeof res.next_batch === "string" ? res.next_batch.trim() : "";
		if (!nextCursor || !opts.allPages && events.length >= limit) return events;
		if (seenCursors.has(nextCursor)) throw new Error("Matrix reaction pagination returned a repeated cursor");
		seenCursors.add(nextCursor);
		cursor = nextCursor;
	}
}
async function listMatrixReactions(roomId, messageId, opts = {}) {
	return await withResolvedRoomAction(roomId, opts, async (client, resolvedRoom) => {
		const chunk = await listMatrixReactionEvents(client, resolvedRoom, messageId, resolveMatrixActionLimit(opts.limit, 100));
		return summarizeMatrixReactionEvents(chunk);
	});
}
async function removeMatrixReactions(roomId, messageId, opts = {}) {
	return await withResolvedRoomAction(roomId, opts, async (client, resolvedRoom) => {
		const chunk = await listMatrixReactionEvents(client, resolvedRoom, messageId, 200, { allPages: true });
		const userId = await client.getUserId();
		if (!userId) return { removed: 0 };
		const toRemove = selectOwnMatrixReactionEventIds(chunk, userId, opts.emoji);
		if (toRemove.length === 0) return { removed: 0 };
		await Promise.all(toRemove.map((id) => client.redactEvent(resolvedRoom, id)));
		return { removed: toRemove.length };
	});
}
//#endregion
//#region extensions/matrix/src/matrix/read-policy.ts
function normalizeRoomId(raw) {
	return raw?.trim().replace(/^room:/i, "") ?? "";
}
function isCurrentRoom(params) {
	return params.context?.currentChannelProvider?.trim().toLowerCase() === "matrix" && params.context.requesterAccountId?.trim() === params.accountId && normalizeRoomId(params.context.currentChannelId) === normalizeRoomId(params.roomId);
}
function includesEntry(entries, value) {
	const normalized = value.trim().toLowerCase();
	return (entries ?? []).some((entry) => {
		const candidate = String(entry).replace(/^matrix:/i, "").trim().toLowerCase();
		return candidate === "*" || candidate === normalized;
	});
}
function hasWildcardEntry(entries) {
	return (entries ?? []).some((entry) => String(entry).replace(/^matrix:/i, "").trim() === "*");
}
function resolveMatrixReadRoomPolicy(params) {
	const configuredRooms = params.account.config.groups ?? params.account.config.rooms;
	const room = resolveMatrixRoomConfig({
		rooms: configuredRooms,
		roomId: params.roomId,
		aliases: params.aliases
	});
	const baseRoom = resolveMatrixRoomConfig({
		rooms: params.baseConfig.groups ?? params.baseConfig.rooms,
		roomId: params.roomId,
		aliases: params.aliases
	});
	const baseRoomAccount = baseRoom.config?.account;
	const explicitlyScopedToAnotherAccount = room.config === void 0 && baseRoom.matchSource === "direct" && typeof baseRoomAccount === "string" && normalizeAccountId(baseRoomAccount) !== params.account.accountId;
	const accountMatches = !room.config?.account || room.config.account === params.account.accountId;
	const configuredRoomBlocked = room.config !== void 0 && (!room.allowed || !accountMatches);
	return {
		blocked: explicitlyScopedToAnotherAccount || configuredRoomBlocked,
		blockedBeforeProviderAccess: explicitlyScopedToAnotherAccount || room.matchSource === "direct" && configuredRoomBlocked,
		room
	};
}
async function classifyMatrixReadRoom(params) {
	const members = await readJoinedMatrixMembers(params.client, params.roomId);
	if (!members) return { kind: "unknown" };
	if (members.length >= 3) return { kind: "group" };
	if (members.length !== 2) return { kind: "unknown" };
	const selfUserId = await params.client.getUserId().catch(() => null);
	if (!selfUserId || !members.includes(selfUserId)) return { kind: "unknown" };
	const remoteUserId = members.find((member) => member !== selfUserId);
	if (!isStrictDirectMembership({
		selfUserId,
		remoteUserId,
		joinedMembers: members
	}) || !remoteUserId) return { kind: "unknown" };
	const memberStateFlag = await hasDirectMatrixMemberFlag(params.client, params.roomId, selfUserId);
	await params.client.dms.update().catch(() => false);
	if (memberStateFlag === true || params.client.dms.isDm(params.roomId)) return {
		kind: "direct",
		remoteUserId
	};
	return memberStateFlag === false ? { kind: "group" } : { kind: "unknown" };
}
async function withAuthorizedMatrixReadTarget(params) {
	const assertCurrent = captureChannelReadAuthority();
	assertCurrent?.();
	const accountId = normalizeAccountId(params.accountId ?? resolveDefaultMatrixAccountId(params.cfg));
	const account = {
		accountId,
		config: resolveMatrixAccountConfig({
			cfg: params.cfg,
			accountId
		})
	};
	const baseConfig = resolveMatrixBaseConfig(params.cfg);
	if (resolveMatrixReadRoomPolicy({
		account,
		baseConfig,
		roomId: normalizeMatrixResolvableTarget(params.roomId),
		aliases: []
	}).blockedBeforeProviderAccess) throw new ToolAuthorizationError("Matrix read target is not allowed.");
	return await withResolvedActionClient(params.opts, async (client) => {
		assertCurrent?.();
		const roomId = await resolveMatrixRoomId(client, params.roomId, { persistDirectMapping: false });
		assertCurrent?.();
		const inputAlias = params.roomId.trim().startsWith("#") ? params.roomId.trim() : void 0;
		const { getRoomInfo } = createMatrixRoomInfoResolver(client);
		const roomInfo = await getRoomInfo(roomId, { includeAliases: true });
		assertCurrent?.();
		const mutableRoomName = account.config.dangerouslyAllowNameMatching === true ? roomInfo.name : void 0;
		const aliases = [
			inputAlias,
			roomInfo.canonicalAlias,
			...roomInfo.altAliases,
			mutableRoomName
		].filter((value) => Boolean(value));
		const finalPolicy = resolveMatrixReadRoomPolicy({
			account,
			baseConfig,
			roomId,
			aliases
		});
		const room = finalPolicy.room;
		const current = isCurrentRoom({
			accountId: account.accountId,
			context: params.context,
			roomId
		});
		const currentChatType = params.context?.currentChatType?.trim().toLowerCase();
		const trustedCurrentClassification = currentChatType === "direct" ? {
			kind: "direct",
			remoteUserId: ""
		} : currentChatType === "group" || currentChatType === "channel" ? { kind: "group" } : null;
		const classification = room.matchSource === "direct" ? { kind: "group" } : current && trustedCurrentClassification ? trustedCurrentClassification : await classifyMatrixReadRoom({
			client,
			roomId
		});
		assertCurrent?.();
		const resolvedGroupPolicy = resolveAllowlistProviderRuntimeGroupPolicy({
			providerConfigPresent: params.cfg.channels?.matrix !== void 0,
			groupPolicy: account.config.groupPolicy,
			defaultGroupPolicy: resolveDefaultGroupPolicy(params.cfg)
		}).groupPolicy;
		const groupPolicy = account.config.allowlistOnly && resolvedGroupPolicy === "open" ? "allowlist" : resolvedGroupPolicy;
		const dmPolicy = account.config.allowlistOnly ? account.config.dm?.policy === "disabled" ? "disabled" : "allowlist" : account.config.dm?.policy ?? "pairing";
		const directOperator = params.context?.conversationReadOrigin === "direct-operator";
		if (!(finalPolicy.blocked ? false : directOperator ? classification.kind === "direct" ? account.config.dm?.enabled !== false && dmPolicy !== "disabled" : classification.kind === "group" ? groupPolicy !== "disabled" : groupPolicy !== "disabled" && dmPolicy !== "disabled" && account.config.dm?.enabled !== false : classification.kind === "direct" ? account.config.dm?.enabled !== false && dmPolicy !== "disabled" && (current || includesEntry(account.config.dm?.allowFrom, classification.remoteUserId)) : classification.kind === "group" ? groupPolicy !== "disabled" && (current || groupPolicy === "open" || room.config !== void 0) : current ? groupPolicy !== "disabled" && dmPolicy !== "disabled" && account.config.dm?.enabled !== false : groupPolicy === "open" && dmPolicy !== "disabled" && account.config.dm?.enabled !== false && hasWildcardEntry(account.config.dm?.allowFrom))) throw new ToolAuthorizationError("Matrix read target is not allowed.");
		return await params.run({
			client,
			roomId
		});
	});
}
//#endregion
//#region extensions/matrix/src/tool-actions.ts
const MATRIX_ACTION_DISABLED_MESSAGES = {
	messages: "Matrix messages are disabled.",
	reactions: "Matrix reactions are disabled.",
	pins: "Matrix pins are disabled.",
	profile: "Matrix profile updates are disabled.",
	memberInfo: "Matrix member info is disabled.",
	channelInfo: "Matrix room info is disabled.",
	verification: "Matrix verification actions are disabled."
};
function projectMatrixMessagesForDisplay(messages) {
	return messages.map((message) => {
		const ts = timestampMsToIsoString(message.timestamp);
		return {
			...message,
			...message.eventId ? { id: message.eventId } : {},
			...message.sender ? { authorTag: message.sender } : {},
			...message.body !== void 0 ? { content: message.body } : {},
			...ts ? { ts } : {}
		};
	});
}
function readRoomId(params) {
	return readStringParam(params, "roomId") ?? readStringParam(params, "channelId") ?? readStringParam(params, "to", { required: true });
}
function readPollOptionIndexes(params) {
	const key = Object.hasOwn(params, "pollOptionIndexes") ? "pollOptionIndexes" : "poll_option_indexes";
	const raw = Object.hasOwn(params, key) ? params[key] : void 0;
	if (raw == null) return [];
	return (Array.isArray(raw) ? raw : [raw]).flatMap((value) => {
		if (value == null || value === "") return [];
		if (typeof value === "string") {
			const trimmed = value.trim();
			if (!trimmed) return [];
			if (!/^[+-]?(?:(?:\d+\.?\d*)|(?:\.\d+))(?:e[+-]?\d+)?$/i.test(trimmed)) return [];
		}
		const index = readPositiveIntegerParam({ pollOptionIndexes: value }, "pollOptionIndexes", { message: "pollOptionIndexes must contain positive integers." });
		return index === void 0 ? [] : [index];
	});
}
async function handleMatrixAction(ctx) {
	const { action, params } = ctx;
	const cfg = ctx.cfg;
	const prepareAction = (gate) => {
		const accountParams = action === "poll-vote" || action === "permissions" ? {
			...params,
			...ctx.accountId ? { accountId: ctx.accountId } : {}
		} : { accountId: ctx.accountId };
		const accountId = readStringParam(accountParams, "accountId");
		const isActionEnabled = createActionGate(resolveMatrixAccountConfig({
			cfg,
			accountId
		}).actions);
		if (gate && !isActionEnabled(gate)) throw new Error(MATRIX_ACTION_DISABLED_MESSAGES[gate]);
		const clientOpts = {
			cfg,
			...accountId ? { accountId } : {}
		};
		const withReadTarget = async (roomId, run) => await withAuthorizedMatrixReadTarget({
			cfg,
			accountId,
			roomId,
			context: {
				accountId: ctx.accountId,
				requesterAccountId: ctx.requesterAccountId,
				currentChannelId: ctx.toolContext?.currentChannelId,
				currentChannelProvider: ctx.toolContext?.currentChannelProvider,
				currentChatType: ctx.toolContext?.currentChatType,
				conversationReadOrigin: ctx.conversationReadOrigin
			},
			opts: clientOpts,
			run: ({ roomId: resolvedRoomId, client }) => run(resolvedRoomId, {
				...clientOpts,
				client
			})
		});
		return {
			accountId,
			clientOpts,
			withReadTarget
		};
	};
	if (action === "send") {
		const to = readStringParam(params, "to", { required: true });
		const mediaUrl = readStringParam(params, "media", { trim: false }) ?? readStringParam(params, "mediaUrl", { trim: false }) ?? readStringParam(params, "filePath", { trim: false }) ?? readStringParam(params, "path", { trim: false });
		const content = readStringParam(params, "message", {
			required: !mediaUrl,
			allowEmpty: true,
			trim: false
		});
		const replyToId = readStringParam(params, "replyTo");
		const threadId = readStringParam(params, "threadId");
		const audioAsVoice = typeof params.asVoice === "boolean" ? params.asVoice : typeof params.audioAsVoice === "boolean" ? params.audioAsVoice : void 0;
		const { clientOpts } = prepareAction("messages");
		const result = await sendMatrixMessage(to, content, {
			mediaUrl: mediaUrl ?? void 0,
			...ctx.mediaAccess ? { mediaAccess: ctx.mediaAccess } : {},
			mediaLocalRoots: ctx.mediaLocalRoots,
			replyToId: replyToId ?? void 0,
			threadId: threadId ?? void 0,
			audioAsVoice,
			...clientOpts
		});
		return jsonResult({
			ok: true,
			result
		});
	}
	if (action === "react") {
		const messageId = readStringParam(params, "messageId", { required: true });
		const emojiValue = readStringParam(params, "emoji", { allowEmpty: true });
		const removeValue = typeof params.remove === "boolean" ? params.remove : void 0;
		const roomId = readRoomId(params);
		const { withReadTarget } = prepareAction("reactions");
		const { emoji, remove, isEmpty } = readReactionParams({
			emoji: emojiValue,
			remove: removeValue
		}, { removeErrorMessage: "Emoji is required to remove a Matrix reaction." });
		if (remove || isEmpty) {
			const result = await withReadTarget(roomId, async (resolvedRoom, actionOpts) => removeMatrixReactions(resolvedRoom, messageId, {
				...actionOpts,
				emoji: remove ? emoji : void 0
			}));
			return jsonResult({
				ok: true,
				removed: result.removed
			});
		}
		await withReadTarget(roomId, async (resolvedRoom, actionOpts) => reactMatrixMessage(resolvedRoom, messageId, emoji, actionOpts));
		return jsonResult({
			ok: true,
			added: emoji
		});
	}
	if (action === "reactions") {
		const messageId = readStringParam(params, "messageId", { required: true });
		const limit = readPositiveIntegerParam(params, "limit", { message: "limit must be a positive integer." });
		const roomId = readRoomId(params);
		const { withReadTarget } = prepareAction("reactions");
		const reactions = await withReadTarget(roomId, async (resolvedRoom, actionOpts) => listMatrixReactions(resolvedRoom, messageId, {
			...actionOpts,
			limit: limit ?? void 0
		}));
		return jsonResult({
			ok: true,
			reactions
		});
	}
	if (action === "emoji-list") {
		const roomId = readStringParam(params, "roomId") ?? readStringParam(params, "channelId") ?? readStringParam(params, "to") ?? (ctx.toolContext?.currentChannelProvider === "matrix" ? ctx.toolContext.currentChannelId : void 0);
		if (!roomId) throw new Error("Matrix emoji-list requires a roomId or current Matrix conversation.");
		const limit = readPositiveIntegerParam(params, "limit", { message: "limit must be a positive integer." });
		const { withReadTarget } = prepareAction("reactions");
		const emojis = await withReadTarget(readRoomId({ roomId }), async (resolvedRoom, actionOpts) => listMatrixEmojis(resolvedRoom, {
			...actionOpts,
			limit
		}));
		return jsonResult({
			ok: true,
			emojis
		});
	}
	if (action === "read") {
		const limit = readPositiveIntegerParam(params, "limit", { message: "limit must be a positive integer." });
		const roomId = readRoomId(params);
		const before = readStringParam(params, "before");
		const after = readStringParam(params, "after");
		const threadId = readStringParam(params, "threadId");
		const messageId = readStringParam(params, "messageId");
		const { withReadTarget } = prepareAction("messages");
		const result = await withReadTarget(roomId, async (resolvedRoom, actionOpts) => {
			if (messageId) return {
				messages: projectMatrixMessagesForDisplay([await readMatrixMessage(resolvedRoom, messageId, actionOpts)]),
				roomId: resolvedRoom
			};
			const messages = await readMatrixMessages(resolvedRoom, {
				limit: limit ?? void 0,
				before: before ?? void 0,
				after: after ?? void 0,
				threadId: threadId ?? void 0,
				...actionOpts
			});
			return {
				...messages,
				messages: projectMatrixMessagesForDisplay(messages.messages),
				roomId: resolvedRoom,
				...threadId ? { threadId } : {}
			};
		});
		return jsonResult({
			ok: true,
			...result
		});
	}
	if (action === "edit") {
		const messageId = readStringParam(params, "messageId", { required: true });
		const content = readStringParam(params, "message", {
			required: true,
			trim: false
		});
		const roomId = readRoomId(params);
		const { withReadTarget } = prepareAction("messages");
		const result = await withReadTarget(roomId, async (resolvedRoom, actionOpts) => editMatrixMessage(resolvedRoom, messageId, content, actionOpts));
		return jsonResult({
			ok: true,
			result
		});
	}
	if (action === "delete") {
		const messageId = readStringParam(params, "messageId", { required: true });
		const roomId = readRoomId(params);
		const { withReadTarget } = prepareAction("messages");
		await withReadTarget(roomId, async (resolvedRoom, actionOpts) => deleteMatrixMessage(resolvedRoom, messageId, {
			reason: void 0,
			...actionOpts
		}));
		return jsonResult({
			ok: true,
			deleted: true
		});
	}
	if (action === "pin" || action === "unpin" || action === "list-pins") {
		const request = action === "list-pins" ? { kind: "list" } : {
			kind: action,
			messageId: readStringParam(params, "messageId", { required: true })
		};
		const roomId = readRoomId(params);
		const { withReadTarget } = prepareAction("pins");
		return await withReadTarget(roomId, async (resolvedRoom, actionOpts) => {
			if (request.kind !== "list") {
				const result = await (request.kind === "pin" ? pinMatrixMessage : unpinMatrixMessage)(resolvedRoom, request.messageId, actionOpts);
				return jsonResult({
					ok: true,
					pinned: result.pinned
				});
			}
			const result = await listMatrixPins(resolvedRoom, actionOpts);
			return jsonResult({
				ok: true,
				pinned: result.pinned,
				events: result.events,
				pins: projectMatrixMessagesForDisplay(result.events)
			});
		});
	}
	if (action === "set-profile") {
		if (ctx.senderIsOwner !== true) throw new ToolAuthorizationError("Matrix profile updates require owner access.");
		const avatarPath = readStringParam(params, "avatarPath") ?? readStringParam(params, "path") ?? readStringParam(params, "filePath");
		const displayName = readStringParam(params, "displayName") ?? readStringParam(params, "name");
		const avatarUrl = readStringParam(params, "avatarUrl");
		const { accountId } = prepareAction("profile");
		const result = await applyMatrixProfileUpdate({
			cfg,
			account: accountId,
			displayName,
			avatarUrl,
			avatarPath,
			mediaLocalRoots: ctx.mediaLocalRoots
		});
		return jsonResult({
			ok: true,
			...result
		});
	}
	if (action === "member-info") {
		const userId = readStringParam(params, "userId", { required: true });
		const roomId = readRoomId(params);
		const { withReadTarget } = prepareAction("memberInfo");
		const result = await withReadTarget(roomId, async (resolvedRoom, actionOpts) => getMatrixMemberInfo(userId, {
			roomId: resolvedRoom,
			...actionOpts
		}));
		return jsonResult({
			ok: true,
			member: result
		});
	}
	if (action === "channel-info") {
		const roomId = readRoomId(params);
		const { withReadTarget } = prepareAction("channelInfo");
		const result = await withReadTarget(roomId, async (resolvedRoom, actionOpts) => getMatrixRoomInfo(resolvedRoom, actionOpts));
		return jsonResult({
			ok: true,
			room: result
		});
	}
	if (action === "poll-vote") {
		const { withReadTarget } = prepareAction();
		const roomId = readRoomId(params);
		const pollId = readStringParam(params, "pollId") ?? readStringParam(params, "messageId");
		if (!pollId) throw new Error("pollId required");
		const optionId = readStringParam(params, "pollOptionId");
		const optionIndex = readPositiveIntegerParam(params, "pollOptionIndex", { message: "pollOptionIndex must be a positive integer." });
		const optionIds = [...readStringArrayParam(params, "pollOptionIds") ?? [], ...optionId ? [optionId] : []];
		const optionIndexes = [...readPollOptionIndexes(params), ...optionIndex !== void 0 ? [optionIndex] : []];
		const result = await withReadTarget(roomId, async (resolvedRoom, actionOpts) => voteMatrixPoll(resolvedRoom, pollId, {
			...actionOpts,
			optionIds,
			optionIndexes
		}));
		return jsonResult({
			ok: true,
			result
		});
	}
	if (action === "permissions") {
		if (ctx.senderIsOwner !== true) throw new ToolAuthorizationError("Matrix verification actions require owner access.");
		const operation = normalizeLowercaseStringOrEmpty(readStringParam(params, "operation") ?? readStringParam(params, "mode") ?? "verification-list");
		const operations = {
			"encryption-status": async () => jsonResult({
				ok: true,
				status: await getMatrixEncryptionStatus({
					includeRecoveryKey: params.includeRecoveryKey === true,
					...clientOpts
				})
			}),
			"verification-status": async () => jsonResult({
				ok: true,
				status: await getMatrixVerificationStatus({
					includeRecoveryKey: params.includeRecoveryKey === true,
					...clientOpts
				})
			}),
			"verification-bootstrap": async () => {
				const result = await bootstrapMatrixVerification({
					recoveryKey: readRecoveryKey(),
					forceResetCrossSigning: params.forceResetCrossSigning === true,
					...clientOpts
				});
				return jsonResult({
					ok: result.success,
					result
				});
			},
			"verification-recovery-key": async () => {
				const recoveryKey = readRecoveryKey();
				const result = await verifyMatrixRecoveryKey(readStringParam({ recoveryKey }, "recoveryKey", {
					required: true,
					trim: false
				}), clientOpts);
				return jsonResult({
					ok: result.success,
					result
				});
			},
			"verification-backup-status": async () => jsonResult({
				ok: true,
				status: await getMatrixRoomKeyBackupStatus(clientOpts)
			}),
			"verification-backup-restore": async () => {
				const result = await restoreMatrixRoomKeyBackup({
					recoveryKey: readRecoveryKey(),
					...clientOpts
				});
				return jsonResult({
					ok: result.success,
					result
				});
			},
			"verification-list": async () => jsonResult({
				ok: true,
				verifications: await listMatrixVerifications(clientOpts)
			}),
			"verification-request": async () => {
				const userId = readStringParam(params, "userId");
				const deviceId = readStringParam(params, "deviceId");
				const roomId = readStringParam(params, "roomId") ?? readStringParam(params, "channelId");
				const ownUser = typeof params.ownUser === "boolean" ? params.ownUser : void 0;
				const verification = await requestMatrixVerification({
					ownUser,
					userId,
					deviceId,
					roomId,
					...clientOpts
				});
				return jsonResult({
					ok: true,
					verification
				});
			},
			"verification-accept": () => runVerification(acceptMatrixVerification),
			"verification-cancel": async () => {
				const reason = readStringParam(params, "reason");
				const code = readStringParam(params, "code");
				return runVerification((id, opts) => cancelMatrixVerification(id, {
					reason,
					code,
					...opts
				}));
			},
			"verification-start": async () => {
				const method = normalizeOptionalLowercaseString(readStringParam(params, "method"));
				if (method && method !== "sas") throw new Error("Matrix verificationStart only supports method=sas; use verificationGenerateQr/verificationScanQr for QR flows.");
				return runVerification((id, opts) => startMatrixVerification(id, {
					method: "sas",
					...opts
				}));
			},
			"verification-generate-qr": async () => {
				const qr = await generateMatrixVerificationQr(requireRequestId(), clientOpts);
				return jsonResult({
					ok: true,
					...qr
				});
			},
			"verification-scan-qr": async () => {
				const qrDataBase64 = readStringParam(params, "qrDataBase64") ?? readStringParam(params, "qrData") ?? readStringParam(params, "qr");
				return runVerification((id, opts) => scanMatrixVerificationQr(id, readStringParam({ qrDataBase64 }, "qrDataBase64", { required: true }), opts));
			},
			"verification-sas": async () => jsonResult({
				ok: true,
				sas: await getMatrixVerificationSas(requireRequestId(), clientOpts)
			}),
			"verification-confirm": () => runVerification(confirmMatrixVerificationSas),
			"verification-mismatch": () => runVerification(mismatchMatrixVerificationSas),
			"verification-confirm-qr": () => runVerification(confirmMatrixVerificationReciprocateQr)
		};
		const runOperation = Object.hasOwn(operations, operation) ? operations[operation] : void 0;
		if (!runOperation) throw new Error(`Unsupported Matrix permissions operation: ${operation}. Supported values: ${Object.keys(operations).join(", ")}`);
		const { clientOpts } = prepareAction("verification");
		const requestId = readStringParam(params, "requestId") ?? readStringParam(params, "verificationId") ?? readStringParam(params, "id");
		const requireRequestId = () => readStringParam({ requestId }, "requestId", { required: true });
		const readRecoveryKey = () => readStringParam(params, "recoveryKey", { trim: false }) ?? readStringParam(params, "key", { trim: false });
		const runVerification = async (run) => jsonResult({
			ok: true,
			verification: await run(requireRequestId(), clientOpts)
		});
		return await runOperation();
	}
	throw new Error(`Action ${action} is not supported for provider matrix.`);
}
//#endregion
export { handleMatrixAction };
