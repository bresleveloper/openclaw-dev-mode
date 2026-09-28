import { i as resolveLineAccount } from "./accounts-BBEFMYbY.mjs";
import { t as hasLineCredentials } from "./account-helpers-BSUyZwLm.mjs";
import { F as inferLineTargetChatType, S as fitsLineFlexBubble, b as truncateLineActionLabel, c as createAgendaCard, d as createActionCard, g as messageAction, l as createEventCard, y as postbackAction } from "./send-retry-DbfiHBPd.mjs";
import { normalizeAccountId } from "openclaw/plugin-sdk/account-id";
import { resolveAccountEntry } from "openclaw/plugin-sdk/account-resolution";
import { isRecord, normalizeLowercaseStringOrEmpty, normalizeOptionalString, normalizeStringEntries } from "openclaw/plugin-sdk/string-coerce-runtime";
import { ChannelDeliveryStreamingConfigSchema, DmPolicySchema, GroupPolicySchema, buildChannelConfigSchema, buildGroupEntrySchema, buildMultiAccountChannelSchema, requireOpenAllowFrom } from "openclaw/plugin-sdk/channel-config-schema";
import { requireChannelOpenAllowFrom } from "openclaw/plugin-sdk/extension-shared";
import { z } from "zod";
import { firstDefined as firstDefined$1 } from "openclaw/plugin-sdk/allow-from";
import { createPluginRuntimeStore } from "openclaw/plugin-sdk/runtime-store";
import { resolveAskUserQuestionOptionIndex, resolveAskUserQuestionOptionIndices } from "openclaw/plugin-sdk/reply-payload";
import { normalizeMessagePresentation, renderMessagePresentationFallbackText, renderPresentationForDelivery, resolveMessagePresentationButtonAction, resolveMessagePresentationOptionAction } from "openclaw/plugin-sdk/interactive-runtime";
import { Type } from "typebox";
//#region extensions/line/src/config-schema.ts
const ThreadBindingsSchema = z.object({
	enabled: z.boolean().optional(),
	idleHours: z.number().optional(),
	maxAgeHours: z.number().optional(),
	spawnSessions: z.boolean().optional(),
	defaultSpawnContext: z.enum(["isolated", "fork"]).optional()
}).strict();
const LineReplyToModeSchema = z.enum([
	"off",
	"first",
	"all"
]);
const LineCommonConfigSchemaBase = z.object({
	enabled: z.boolean().optional(),
	configWrites: z.boolean().optional(),
	joinIntro: z.boolean().optional(),
	historyLimit: z.number().int().min(0).optional(),
	channelAccessToken: z.string().optional(),
	channelSecret: z.string().optional(),
	tokenFile: z.string().optional(),
	secretFile: z.string().optional(),
	name: z.string().optional(),
	allowFrom: z.array(z.union([z.string(), z.number()])).optional(),
	groupAllowFrom: z.array(z.union([z.string(), z.number()])).optional(),
	dmPolicy: DmPolicySchema.optional().default("pairing"),
	groupPolicy: GroupPolicySchema.optional().default("allowlist"),
	responsePrefix: z.string().optional(),
	replyToMode: LineReplyToModeSchema.optional(),
	streaming: ChannelDeliveryStreamingConfigSchema.optional(),
	mediaMaxMb: z.number().optional(),
	webhookPath: z.string().optional(),
	threadBindings: ThreadBindingsSchema.optional()
});
const LineGroupConfigSchema = buildGroupEntrySchema().omit({
	tools: true,
	toolsBySender: true
});
const LineAccountConfigSchema = LineCommonConfigSchemaBase.extend({ groups: z.record(z.string(), LineGroupConfigSchema.optional()).optional() }).strict();
const LineConfigSchema = buildMultiAccountChannelSchema(LineAccountConfigSchema, {
	optionalAccount: true,
	refine: (value, ctx) => {
		requireChannelOpenAllowFrom({
			channel: "line",
			policy: value.dmPolicy,
			allowFrom: value.allowFrom,
			ctx,
			requireOpenAllowFrom
		});
	}
});
const LineChannelConfigSchema = buildChannelConfigSchema(LineConfigSchema, { uiHints: { joinIntro: {
	label: "LINE Group Join Introduction",
	help: "Post one brief introduction when the bot joins an allowed LINE group or multi-person room (default: true). Account settings override the channel-wide setting."
} } });
//#endregion
//#region extensions/line/src/bot-access.ts
function normalizeLineAllowEntry(value) {
	const trimmed = String(value).trim();
	if (!trimmed) return "";
	if (trimmed === "*") return "*";
	return trimmed.replace(/^line:(?:user:)?/i, "");
}
const normalizeAllowFrom = (list) => {
	const entries = (list ?? []).map((value) => normalizeLineAllowEntry(value)).filter(Boolean);
	return {
		entries,
		hasWildcard: entries.includes("*"),
		hasEntries: entries.length > 0
	};
};
//#endregion
//#region extensions/line/src/group-keys.ts
function resolveLineGroupLookupIds(groupId) {
	const normalized = groupId?.trim();
	if (!normalized) return [];
	if (normalized.startsWith("group:") || normalized.startsWith("room:")) {
		const rawId = normalized.split(":").slice(1).join(":");
		return rawId ? [rawId, normalized] : [normalized];
	}
	return [
		normalized,
		`group:${normalized}`,
		`room:${normalized}`
	];
}
function resolveLineGroupConfigEntry(groups, params) {
	if (!groups) return;
	const defaults = groups["*"];
	for (const candidate of [...resolveLineGroupLookupIds(params.groupId), ...resolveLineGroupLookupIds(params.roomId)]) {
		const hit = groups[candidate];
		if (hit) return defaults && defaults !== hit ? {
			...defaults,
			...hit
		} : hit;
	}
	return defaults;
}
function resolveLineGroupsConfig(cfg, accountId) {
	const lineConfig = cfg.channels?.line;
	if (!lineConfig) return;
	const normalizedAccountId = normalizeAccountId(accountId);
	return resolveAccountEntry(lineConfig.accounts, normalizedAccountId)?.groups ?? lineConfig.groups;
}
function resolveExactLineGroupConfigKey(params) {
	const { groups } = params;
	if (!groups) return;
	return resolveLineGroupLookupIds(params.groupId).find((candidate) => Object.hasOwn(groups, candidate));
}
//#endregion
//#region extensions/line/src/runtime.ts
const { setRuntime: setLineRuntime, getRuntime: getLineRuntime } = createPluginRuntimeStore({
	pluginId: "line",
	errorMessage: "LINE runtime not initialized - plugin not registered"
});
//#endregion
//#region extensions/line/src/quick-reply-fallback.ts
function buildLineQuickReplyFallbackText(labels) {
	const normalized = normalizeStringEntries(labels ?? []).slice(0, 13);
	if (normalized.length === 0) return "Choose an option.";
	return `Options:\n${normalized.map((label) => `- ${label}`).join("\n")}`;
}
//#endregion
//#region extensions/line/src/flex-templates/media-control-cards.ts
function horizontalRow(contents, options = {}) {
	return {
		type: "box",
		layout: "horizontal",
		contents,
		...options
	};
}
/**
* Create a media player card for Sonos, Spotify, Apple Music, etc.
*
* Editorial design: Album art hero with gradient overlay for text,
* prominent now-playing indicator, refined playback controls.
*/
function createMediaPlayerCard(params) {
	const { title, subtitle, source, imageUrl, isPlaying, progress, controls, extraActions } = params;
	const trackInfo = [{
		type: "text",
		text: title,
		weight: "bold",
		size: "xl",
		color: "#111111",
		wrap: true
	}];
	if (subtitle) trackInfo.push({
		type: "text",
		text: subtitle,
		size: "md",
		color: "#666666",
		wrap: true,
		margin: "sm"
	});
	const statusItems = [];
	if (isPlaying !== void 0) statusItems.push(horizontalRow([{
		type: "box",
		layout: "vertical",
		contents: [],
		width: "8px",
		height: "8px",
		backgroundColor: isPlaying ? "#06C755" : "#CCCCCC",
		cornerRadius: "4px"
	}, {
		type: "text",
		text: isPlaying ? "Now Playing" : "Paused",
		size: "xs",
		color: isPlaying ? "#06C755" : "#888888",
		weight: "bold",
		margin: "sm"
	}], { alignItems: "center" }));
	if (source) statusItems.push({
		type: "text",
		text: source,
		size: "xs",
		color: "#AAAAAA",
		margin: statusItems.length > 0 ? "lg" : void 0
	});
	if (progress) statusItems.push({
		type: "text",
		text: progress,
		size: "xs",
		color: "#888888",
		align: "end",
		flex: 1
	});
	const bodyContents = [{
		type: "box",
		layout: "vertical",
		contents: trackInfo
	}];
	if (statusItems.length > 0) bodyContents.push(horizontalRow(statusItems, {
		margin: "lg",
		alignItems: "center"
	}));
	const bubble = {
		type: "bubble",
		size: "mega",
		body: {
			type: "box",
			layout: "vertical",
			contents: bodyContents,
			paddingAll: "xl",
			backgroundColor: "#FFFFFF"
		}
	};
	if (imageUrl) bubble.hero = {
		type: "image",
		url: imageUrl,
		size: "full",
		aspectRatio: "1:1",
		aspectMode: "cover"
	};
	if (controls || extraActions?.length) {
		const footerContents = [];
		if (controls) {
			const controlButtons = [];
			for (const [key, label, style] of [
				[
					"previous",
					"⏮",
					"secondary"
				],
				[
					"play",
					"▶",
					isPlaying ? "secondary" : "primary"
				],
				[
					"pause",
					"⏸",
					isPlaying ? "primary" : "secondary"
				],
				[
					"next",
					"⏭",
					"secondary"
				]
			]) {
				const control = controls[key];
				if (!control) continue;
				const button = {
					type: "button",
					action: postbackAction(label, control.data),
					style,
					flex: 1,
					height: "sm"
				};
				if (key !== "previous") button.margin = controlButtons.length > 0 ? "md" : void 0;
				controlButtons.push(button);
			}
			if (controlButtons.length > 0) footerContents.push(horizontalRow(controlButtons));
		}
		if (extraActions?.length) footerContents.push(horizontalRow(extraActions.slice(0, 2).map((action, index) => ({
			type: "button",
			action: postbackAction(truncateLineActionLabel(action.label, 15), action.data),
			style: "secondary",
			flex: 1,
			height: "sm",
			margin: index > 0 ? "md" : void 0
		})), { margin: "md" }));
		if (footerContents.length > 0) bubble.footer = {
			type: "box",
			layout: "vertical",
			contents: footerContents,
			paddingAll: "lg",
			backgroundColor: "#FAFAFA"
		};
	}
	return bubble;
}
/**
* Create an Apple TV remote card with a D-pad and control rows.
*/
function createAppleTvRemoteCard(params) {
	const { deviceName, status, actionData } = params;
	const headerContents = [{
		type: "text",
		text: deviceName,
		weight: "bold",
		size: "xl",
		color: "#111111",
		wrap: true
	}];
	if (status) headerContents.push({
		type: "text",
		text: status,
		size: "sm",
		color: "#666666",
		wrap: true,
		margin: "sm"
	});
	const makeButton = (label, data, style = "secondary") => ({
		type: "button",
		action: postbackAction(label, data),
		style,
		height: "sm",
		flex: 1
	});
	const controlRows = [
		horizontalRow([
			{ type: "filler" },
			makeButton("↑", actionData.up),
			{ type: "filler" }
		]),
		horizontalRow([
			makeButton("←", actionData.left),
			makeButton("OK", actionData.select, "primary"),
			makeButton("→", actionData.right)
		], { margin: "md" }),
		horizontalRow([
			{ type: "filler" },
			makeButton("↓", actionData.down),
			{ type: "filler" }
		], { margin: "md" }),
		horizontalRow([makeButton("Menu", actionData.menu), makeButton("Home", actionData.home)], { margin: "lg" }),
		horizontalRow([makeButton("Play", actionData.play), makeButton("Pause", actionData.pause)], { margin: "md" }),
		horizontalRow([
			makeButton("Vol +", actionData.volumeUp),
			makeButton("Mute", actionData.mute),
			makeButton("Vol -", actionData.volumeDown)
		], { margin: "md" })
	];
	return {
		type: "bubble",
		size: "mega",
		body: {
			type: "box",
			layout: "vertical",
			contents: [
				{
					type: "box",
					layout: "vertical",
					contents: headerContents
				},
				{
					type: "separator",
					margin: "lg",
					color: "#EEEEEE"
				},
				...controlRows
			],
			paddingAll: "xl",
			backgroundColor: "#FFFFFF"
		}
	};
}
/**
* Create a device control card for Apple TV, smart home devices, etc.
*
* Editorial design: Device-focused header with status indicator,
* clean control grid with clear visual hierarchy.
*/
function createDeviceControlCard(params) {
	const { deviceName, deviceType, status, isOnline, imageUrl, controls } = params;
	const headerContents = [horizontalRow([{
		type: "box",
		layout: "vertical",
		contents: [],
		width: "10px",
		height: "10px",
		backgroundColor: isOnline !== false ? "#06C755" : "#FF5555",
		cornerRadius: "5px"
	}, {
		type: "text",
		text: deviceName,
		weight: "bold",
		size: "xl",
		color: "#111111",
		wrap: true,
		flex: 1,
		margin: "md"
	}], { alignItems: "center" })];
	if (deviceType) headerContents.push({
		type: "text",
		text: deviceType,
		size: "sm",
		color: "#888888",
		margin: "sm"
	});
	if (status) headerContents.push({
		type: "box",
		layout: "vertical",
		contents: [{
			type: "text",
			text: status,
			size: "sm",
			color: "#444444",
			wrap: true
		}],
		margin: "lg",
		paddingAll: "md",
		backgroundColor: "#F8F9FA",
		cornerRadius: "md"
	});
	const bubble = {
		type: "bubble",
		size: "mega",
		body: {
			type: "box",
			layout: "vertical",
			contents: headerContents,
			paddingAll: "xl",
			backgroundColor: "#FFFFFF"
		}
	};
	if (imageUrl) bubble.hero = {
		type: "image",
		url: imageUrl,
		size: "full",
		aspectRatio: "16:9",
		aspectMode: "cover"
	};
	if (controls.length > 0) {
		const rows = [];
		const limitedControls = controls.slice(0, 6);
		for (let i = 0; i < limitedControls.length; i += 2) {
			const rowButtons = [];
			for (const [offset, ctrl] of limitedControls.slice(i, i + 2).entries()) {
				const buttonLabel = ctrl.icon ? `${ctrl.icon} ${ctrl.label}` : ctrl.label;
				rowButtons.push({
					type: "button",
					action: postbackAction(truncateLineActionLabel(buttonLabel, 18), ctrl.data),
					style: ctrl.style ?? "secondary",
					flex: 1,
					height: "sm",
					margin: offset > 0 ? "md" : void 0
				});
			}
			if (rowButtons.length === 1) rowButtons.push({ type: "filler" });
			rows.push(horizontalRow(rowButtons, { margin: i > 0 ? "md" : void 0 }));
		}
		bubble.footer = {
			type: "box",
			layout: "vertical",
			contents: rows,
			paddingAll: "lg",
			backgroundColor: "#FAFAFA"
		};
	}
	return bubble;
}
//#endregion
//#region extensions/line/src/question-postback.ts
const QUESTION_ID_PARAM = "line.question";
const OPTION_INDEX_PARAM = "line.option";
const POSTBACK_DATA_MAX_BYTES = 300;
function withinPostbackLimit(data) {
	return Buffer.byteLength(data, "utf8") <= POSTBACK_DATA_MAX_BYTES ? data : void 0;
}
/** Encodes one ask_user choice into LINE postback data, or nothing when it cannot fit. */
function buildLineQuestionPostbackData(callback) {
	const questionId = normalizeOptionalString(callback.questionId);
	if (!questionId) return;
	const params = new URLSearchParams({ [QUESTION_ID_PARAM]: questionId });
	if (!Number.isInteger(callback.optionIndex) || callback.optionIndex < 0) return;
	params.set(OPTION_INDEX_PARAM, String(callback.optionIndex));
	return withinPostbackLimit(params.toString());
}
/** Reads a question choice back out of inbound postback data, if it carries one. */
function parseLineQuestionPostbackData(data) {
	if (!data.includes(QUESTION_ID_PARAM)) return;
	const params = new URLSearchParams(data);
	const questionId = normalizeOptionalString(params.get(QUESTION_ID_PARAM));
	if (!questionId) return;
	const rawIndex = normalizeOptionalString(params.get(OPTION_INDEX_PARAM));
	if (!rawIndex || !/^\d+$/.test(rawIndex)) return;
	return {
		questionId,
		optionIndex: Number(rawIndex)
	};
}
/**
* Submit an ask_user choice a LINE tap carried, and report only what the user needs.
*
* A successful answer needs no acknowledgement: the agent's own next reply is the
* feedback, and LINE already echoes the chosen label through the action's
* `displayText`. Only an answer that cannot land says so.
*/
async function resolveLineQuestionPostback(params) {
	try {
		const { questionGatewayRuntime } = await import("openclaw/plugin-sdk/question-gateway-runtime");
		const result = await questionGatewayRuntime.resolveOption({
			cfg: params.cfg,
			questionId: params.callback.questionId,
			senderId: params.senderId,
			clientDisplayName: `LINE question (${params.accountId})`,
			optionIndex: params.callback.optionIndex,
			authorize: params.authorize
		});
		if (result.status === "answered" || result.status === "already-terminal" || result.status === "denied") return { status: result.status };
		return { status: "failed" };
	} catch {
		return { status: "failed" };
	}
}
//#endregion
//#region extensions/line/src/rich-messages.ts
const nonempty = () => Type.String({ minLength: 1 });
const closed = (properties) => Type.Object(properties, { additionalProperties: false });
const lineCardSchema = Type.Union([
	closed({
		type: Type.Literal("media_player"),
		title: nonempty(),
		artist: Type.Optional(nonempty()),
		source: Type.Optional(nonempty()),
		imageUrl: Type.Optional(Type.String({ pattern: "^https://" })),
		status: Type.Optional(Type.Union([Type.Literal("playing"), Type.Literal("paused")]))
	}),
	closed({
		type: Type.Literal("event"),
		title: nonempty(),
		date: nonempty(),
		time: Type.Optional(nonempty()),
		location: Type.Optional(nonempty()),
		description: Type.Optional(nonempty())
	}),
	closed({
		type: Type.Literal("agenda"),
		title: nonempty(),
		events: Type.Array(closed({
			title: nonempty(),
			time: Type.Optional(nonempty()),
			location: Type.Optional(nonempty())
		}), {
			minItems: 1,
			maxItems: 6
		})
	}),
	closed({
		type: Type.Literal("device"),
		name: nonempty(),
		deviceType: Type.Optional(nonempty()),
		status: Type.Optional(nonempty()),
		controls: Type.Optional(Type.Array(closed({
			label: nonempty(),
			action: nonempty()
		}), { maxItems: 6 }))
	}),
	closed({
		type: Type.Literal("appletv_remote"),
		name: Type.Optional(nonempty()),
		status: Type.Optional(nonempty())
	})
]);
const lineChannelDataSchema = Type.Optional(closed({ line: closed({
	location: Type.Optional(closed({
		title: nonempty(),
		address: nonempty(),
		latitude: Type.Number({
			minimum: -90,
			maximum: 90
		}),
		longitude: Type.Number({
			minimum: -180,
			maximum: 180
		})
	})),
	card: Type.Optional(lineCardSchema),
	mediaKind: Type.Optional(Type.Union([
		Type.Literal("image"),
		Type.Literal("video"),
		Type.Literal("audio")
	])),
	previewImageUrl: Type.Optional(Type.String({ pattern: "^https://" })),
	durationMs: Type.Optional(Type.Integer({ minimum: 1 })),
	trackingId: Type.Optional(nonempty())
}) }));
const lineMessageActions = {
	describeMessageTool: ({ cfg, accountId }) => {
		const account = resolveLineAccount({
			cfg,
			accountId: accountId ?? void 0
		});
		return account.enabled && hasLineCredentials(account) ? {
			actions: ["send"],
			capabilities: ["presentation"],
			schema: {
				actions: ["send"],
				properties: { channelData: lineChannelDataSchema }
			}
		} : {
			actions: [],
			capabilities: [],
			schema: null
		};
	},
	prepareSendPayload: ({ payload }) => payload
};
const LINE_QUICK_REPLY_LIMIT = 13;
const LINE_PRESENTATION_CAPABILITIES = {
	supported: true,
	buttons: true,
	selects: true,
	context: true,
	limits: {
		actions: {
			maxActions: 4,
			maxActionsPerRow: 1,
			maxRows: 4,
			maxLabelLength: 40
		},
		selects: {
			maxOptions: LINE_QUICK_REPLY_LIMIT,
			maxValueBytes: 300
		},
		text: { markdownDialect: "plain" }
	}
};
/**
* Reads the choice one question button carries. The Gateway owns option order, so a
* tap sends the index it published, never the rendered label; a choice it no longer
* lists renders no button at all rather than a tap that answers the wrong option.
*/
function toLineQuestionChoice(action, questionOptionIndices) {
	if ("intent" in action) return;
	const optionIndex = resolveAskUserQuestionOptionIndex({
		questionOptionIndices,
		questionId: action.questionId,
		optionValue: action.optionValue
	});
	return optionIndex === void 0 ? void 0 : {
		questionId: action.questionId,
		optionIndex
	};
}
/**
* The free-text control is not drawn. LINE can open the composer on a tap
* (`inputOption: "openKeyboard"`), so the platform is not the reason: an answer
* is claimed only on the plain-text inbound path, which no postback reaches, so
* the button cannot change whether what follows it counts as the answer. It
* would add a tap that changes nothing the card's own words already offer, which
* is why Discord and Slack leave that route in text too.
*/
function isLineTextFallbackButton(button) {
	const action = resolveMessagePresentationButtonAction(button);
	return action?.type === "question" && "intent" in action && action.intent === "custom-input";
}
/** A control the Gateway owns, whose label the operator cannot disambiguate. */
function isLineQuestionButton(button) {
	return resolveMessagePresentationButtonAction(button)?.type === "question";
}
function toLineAction(button, questionOptionIndices) {
	const normalized = resolveMessagePresentationButtonAction(button);
	const { label } = button;
	if (normalized?.type === "question") {
		const choice = toLineQuestionChoice(normalized, questionOptionIndices);
		const data = choice && buildLineQuestionPostbackData(choice);
		if (!data) return;
		return {
			type: "postback",
			label,
			data,
			displayText: label
		};
	}
	if (normalized?.type === "command") return {
		type: "message",
		label,
		text: normalized.command
	};
	if (normalized?.type === "callback") return {
		type: "postback",
		label,
		data: normalized.value,
		displayText: label
	};
	if (normalized?.type === "url") return {
		type: "uri",
		label,
		uri: normalized.url
	};
	if (normalized?.type === "web-app" && normalized.url) return {
		type: "uri",
		label,
		uri: normalized.url
	};
}
function renderLinePresentation(payload, presentation, to, sourcePresentation = presentation) {
	const hasQuestion = sourcePresentation.blocks.some((block) => block.type === "buttons" && block.buttons.some(isLineQuestionButton));
	const hasAuthoredPrompt = Boolean(sourcePresentation.title?.trim()) || sourcePresentation.blocks.some((block) => (block.type === "text" || block.type === "context") && block.text.trim());
	if (hasQuestion && !hasAuthoredPrompt) return null;
	if (inferLineTargetChatType(to ?? "") !== "direct" && hasQuestion) return null;
	const hasCard = presentation.blocks.some((block) => block.type === "buttons" && block.buttons.length > 0);
	const buttons = [];
	const quickReplyItems = [];
	const carriedBlocks = [];
	const cardBody = [];
	const omittedControlLabels = [];
	const questionLabels = /* @__PURE__ */ new Set();
	const questionOptionIndices = resolveAskUserQuestionOptionIndices(payload);
	for (const block of presentation.blocks) if (block.type === "buttons") for (const button of block.buttons) {
		if (isLineTextFallbackButton(button)) {
			omittedControlLabels.push(button.label);
			continue;
		}
		const action = toLineAction(button, questionOptionIndices);
		if (!action) return null;
		if (isLineQuestionButton(button)) {
			if (questionLabels.has(button.label)) return null;
			questionLabels.add(button.label);
		}
		buttons.push({
			label: button.label,
			action
		});
	}
	else if (block.type === "select") {
		const overflow = [];
		for (const option of block.options) {
			const action = resolveMessagePresentationOptionAction(option);
			if (!action) return null;
			if (quickReplyItems.length < LINE_QUICK_REPLY_LIMIT) quickReplyItems.push({
				label: option.label,
				action
			});
			else overflow.push(option);
		}
		if (overflow.length > 0) carriedBlocks.push({
			...block,
			options: overflow
		});
		else if (block.placeholder) carriedBlocks.push({
			type: "context",
			text: block.placeholder
		});
	} else if (!hasCard) carriedBlocks.push(block);
	else if (block.type === "text" || block.type === "context") cardBody.push(block.text);
	if (buttons.length === 0 && quickReplyItems.length === 0) return null;
	if (hasCard && omittedControlLabels.length > 0) cardBody.push(`Actions:\n${omittedControlLabels.map((label) => `- ${label}`).join("\n")}`);
	const lineData = isRecord(payload.channelData?.line) ? payload.channelData.line : {};
	const title = presentation.title || "Choose an option";
	const altText = presentation.title || cardBody[0] || title;
	const flexMessage = hasCard ? {
		altText,
		contents: createActionCard(title, cardBody.join("\n") || "Choose an option.", buttons)
	} : void 0;
	if (flexMessage && !fitsLineFlexBubble(flexMessage.contents)) return null;
	const text = renderMessagePresentationFallbackText({
		text: payload.text,
		presentation: {
			title: hasCard ? void 0 : presentation.title,
			blocks: carriedBlocks
		}
	});
	return {
		...payload,
		...text ? { text } : {},
		channelData: {
			...payload.channelData,
			line: {
				...lineData,
				...flexMessage ? { flexMessage } : {},
				quickReplyItems
			}
		}
	};
}
/**
* Resolve a reply's portable presentation into LINE-native controls.
*
* Core runs the presentation renderer inside the outbound send pipeline only, so
* replies the plugin delivers itself reach delivery with the controls still
* portable. Preparing them here keeps both LINE delivery paths on one rendering.
*/
async function prepareLineReplyPayload(payload, to) {
	if (!normalizeMessagePresentation(payload.presentation)) return payload;
	const usesFallbackText = payload.presentationTextMode === "fallback" && Boolean(payload.text?.trim());
	return renderPresentationForDelivery({
		presentationCapabilities: LINE_PRESENTATION_CAPABILITIES,
		renderPresentation: (adapted, sourcePresentation) => {
			const rendered = renderLinePresentation(adapted, adapted.presentation, to, sourcePresentation);
			return rendered && usesFallbackText && rendered.channelData.line.flexMessage === void 0 ? {
				...rendered,
				text: payload.text
			} : rendered;
		}
	}, {
		...payload,
		presentationTextMode: usesFallbackText ? "fallback" : void 0
	});
}
const toSlug = (value) => normalizeLowercaseStringOrEmpty(value).replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "") || "device";
const lineActionData = (action, device) => `line.action=${encodeURIComponent(action)}&line.device=${encodeURIComponent(device)}`;
function renderLineCard(card) {
	if (card.type === "media_player") {
		const device = toSlug(card.source || card.title);
		return {
			altText: `🎵 ${card.title}${card.artist ? ` - ${card.artist}` : ""}`,
			contents: createMediaPlayerCard({
				title: card.title,
				subtitle: card.artist,
				source: card.source,
				imageUrl: card.imageUrl,
				isPlaying: card.status ? card.status === "playing" : void 0,
				controls: Object.fromEntries([
					"previous",
					"play",
					"pause",
					"next"
				].map((action) => [action, { data: lineActionData(action, device) }]))
			})
		};
	}
	if (card.type === "event") return {
		altText: `📅 ${card.title} - ${card.date}${card.time ? ` ${card.time}` : ""}`,
		contents: createEventCard(card)
	};
	if (card.type === "agenda") return {
		altText: `📋 ${card.title} (${card.events.length} events)`,
		contents: createAgendaCard(card)
	};
	const device = toSlug(card.type === "device" ? card.name : card.name || "apple_tv");
	if (card.type === "device") return {
		altText: `📱 ${card.name}${card.status ? `: ${card.status}` : ""}`,
		contents: createDeviceControlCard({
			deviceName: card.name,
			deviceType: card.deviceType,
			status: card.status,
			controls: (card.controls ?? []).map((control) => ({
				label: control.label,
				data: lineActionData(control.action, device)
			}))
		})
	};
	const actionData = {
		up: lineActionData("up", device),
		down: lineActionData("down", device),
		left: lineActionData("left", device),
		right: lineActionData("right", device),
		select: lineActionData("select", device),
		menu: lineActionData("menu", device),
		home: lineActionData("home", device),
		play: lineActionData("play", device),
		pause: lineActionData("pause", device),
		volumeUp: lineActionData("volume_up", device),
		volumeDown: lineActionData("volume_down", device),
		mute: lineActionData("mute", device)
	};
	return {
		altText: `📺 ${card.name || "Apple TV"} Remote`,
		contents: createAppleTvRemoteCard({
			deviceName: card.name || "Apple TV",
			status: card.status,
			actionData
		})
	};
}
function createLineQuickReply(items) {
	return { items: items.slice(0, LINE_QUICK_REPLY_LIMIT).map((item) => ({
		type: "action",
		action: item.action.type === "command" ? messageAction(item.label, item.action.command) : postbackAction(item.label, item.action.value, item.label)
	})) };
}
//#endregion
export { LineConfigSchema as C, LineChannelConfigSchema as S, resolveLineGroupLookupIds as _, renderLineCard as a, normalizeAllowFrom as b, resolveLineQuestionPostback as c, createMediaPlayerCard as d, buildLineQuickReplyFallbackText as f, resolveLineGroupConfigEntry as g, resolveExactLineGroupConfigKey as h, prepareLineReplyPayload as i, createAppleTvRemoteCard as l, setLineRuntime as m, createLineQuickReply as n, renderLinePresentation as o, getLineRuntime as p, lineMessageActions as r, parseLineQuestionPostbackData as s, LINE_PRESENTATION_CAPABILITIES as t, createDeviceControlCard as u, resolveLineGroupsConfig as v, normalizeLineAllowEntry as x, firstDefined$1 as y };
