import { o as callGateway } from "./call-C_MP4_Gs.mjs";
import { v as renderMessagePresentationFallbackText } from "./payload-COvcWceu.mjs";
import { S as readAskUserQuestionId } from "./reply-payload-B2ZQhznY.mjs";
import { r as registerQuestionChannelDelivery } from "./question-channel-runtime-iX-d9p2G.mjs";
import { t as bindAgentToolGatewayRequest } from "./in-process-gateway-BvSta947.mjs";
//#region src/infra/question-gateway-resolver.ts
const QUESTION_RECORD_ID_PATTERN = /^ask_[a-f0-9]{32}$/u;
function readTerminalReason(error) {
	if (!(error instanceof Error) || error.name !== "GatewayClientRequestError") return;
	const details = error.details;
	if (!details || typeof details !== "object" || Array.isArray(details)) return;
	const reason = details.reason;
	if (reason === "QUESTION_ALREADY_TERMINAL") return "already-terminal";
	return reason === "QUESTION_NOT_FOUND" ? "not-found" : void 0;
}
async function resolveQuestionOverGateway(params) {
	if (!QUESTION_RECORD_ID_PATTERN.test(params.questionId)) throw new Error("question resolution requires a valid question record id");
	if (params.customInput !== true && params.optionValue === void 0 && !Number.isInteger(params.optionIndex)) throw new Error("question resolution requires an option value or index");
	if (params.optionValue !== void 0 && !params.optionValue) throw new Error("question resolution requires a non-empty option value");
	const gatewayOptions = {
		config: params.cfg,
		url: params.gatewayUrl,
		scopes: ["operator.questions"],
		clientDisplayName: params.clientDisplayName ?? `Question (${params.senderId?.trim() || "unknown"})`
	};
	const request = params.gatewayUrl?.trim() ? callGateway : bindAgentToolGatewayRequest({ hostedOnly: true });
	let getResult;
	try {
		getResult = await request({
			...gatewayOptions,
			method: "question.get",
			params: { id: params.questionId }
		});
	} catch (error) {
		const reason = readTerminalReason(error);
		if (reason) return {
			status: "already-terminal",
			reason
		};
		throw error;
	}
	const record = getResult.question;
	if (record.status !== "pending") return {
		status: "already-terminal",
		reason: "already-terminal"
	};
	const question = record.questions.length === 1 ? record.questions[0] : void 0;
	if (!question || question.multiSelect || question.isSecret) throw new Error("question button resolution requires one tappable question");
	if (params.customInput === true) {
		if (!question.isOther) throw new Error("question does not allow a custom answer");
		return {
			status: "custom-input",
			questionId: question.questionId
		};
	}
	const optionValue = params.optionValue ?? question.options[params.optionIndex]?.label;
	if (!optionValue) throw new Error("question resolution index does not match a declared option");
	if (params.authorize && !await params.authorize()) return { status: "denied" };
	try {
		await request({
			...gatewayOptions,
			method: "question.resolve",
			params: {
				id: params.questionId,
				answers: { answers: { [question.questionId]: [optionValue] } },
				resolvedBy: params.senderId?.trim() || void 0
			}
		});
	} catch (error) {
		const reason = readTerminalReason(error);
		if (reason) return {
			status: "already-terminal",
			reason
		};
		throw error;
	}
	return {
		status: "answered",
		questionId: question.questionId,
		optionValue
	};
}
//#endregion
//#region src/infra/question-reaction-runtime.ts
const QUESTION_REACTION_CHANNEL_DATA_KEY = "openclawQuestionReaction";
const QUESTION_REACTION_EMOJIS = [
	"1️⃣",
	"2️⃣",
	"3️⃣",
	"4️⃣"
];
function readQuestionReactionBinding(payload) {
	const raw = payload.channelData?.[QUESTION_REACTION_CHANNEL_DATA_KEY];
	if (!raw || typeof raw !== "object" || Array.isArray(raw)) return;
	const questionId = raw.questionId;
	const optionValues = raw.optionValues;
	return typeof questionId === "string" && questionId.length > 0 && Array.isArray(optionValues) && optionValues.length >= 1 && optionValues.length <= QUESTION_REACTION_EMOJIS.length && optionValues.every((value) => typeof value === "string" && value.length > 0) ? {
		questionId,
		optionValues: [...optionValues]
	} : void 0;
}
function resolveQuestionReactionIndex(reaction) {
	const index = QUESTION_REACTION_EMOJIS.indexOf(reaction);
	return index >= 0 ? index : void 0;
}
function prepareQuestionReactionPayloadForDelivery(params) {
	const questionId = readAskUserQuestionId(params.payload);
	const presentation = params.presentation ?? params.payload.presentation;
	if (!questionId || !presentation) return null;
	const buttonBlocks = presentation.blocks.filter((block) => block.type === "buttons");
	const buttonBlock = buttonBlocks[0];
	if (!buttonBlock || buttonBlocks.length !== 1) return null;
	const optionButtons = buttonBlock.buttons.filter((button) => button.action?.type === "question" && !("intent" in button.action));
	if (optionButtons.length < 1 || optionButtons.length > 4) return null;
	const labels = [];
	const optionValues = [];
	for (const button of optionButtons) {
		if (button.action?.type !== "question" || button.action.questionId !== questionId || !("optionValue" in button.action) || !button.action.optionValue) return null;
		labels.push(button.label);
		optionValues.push(button.action.optionValue);
	}
	const questionBlock = presentation.blocks.find((block) => block.type === "text");
	const textPresentation = {
		...presentation,
		blocks: questionBlock ? [questionBlock] : []
	};
	const prompt = renderMessagePresentationFallbackText({ presentation: textPresentation });
	const reactionHint = labels.map((label, index) => `${QUESTION_REACTION_EMOJIS[index]} ${label}`).join("\n");
	const customInputHint = buttonBlock.buttons.some((button) => {
		const action = button.action;
		return action?.type === "question" && "intent" in action && action.intent === "custom-input";
	}) ? "\n\nOr reply with your own answer." : "";
	return {
		...params.payload,
		text: `${prompt}\n\nReact with:\n${reactionHint}${customInputHint}`,
		presentation: void 0,
		presentationTextMode: void 0,
		channelData: {
			...params.payload.channelData,
			[QUESTION_REACTION_CHANNEL_DATA_KEY]: {
				questionId,
				optionValues
			}
		}
	};
}
async function resolveQuestionReactionOverGateway(params) {
	return await resolveQuestionOverGateway(params);
}
//#endregion
//#region src/plugin-sdk/question-gateway-runtime.ts
/** Runtime SDK subpath for Gateway-backed ask_user question controls. */
const DEFAULT_QUESTION_REACTION_TARGET_TTL_MS = 864e5;
/** Creates one channel-owned target store for numbered ask_user reactions. */
function createQuestionReactionTargetStore(params) {
	const ttlMs = params.ttlMs ?? DEFAULT_QUESTION_REACTION_TARGET_TTL_MS;
	const registerChannelDelivery = params.registerChannelDelivery ?? registerQuestionChannelDelivery;
	const resolveReaction = params.resolveReaction ?? resolveQuestionReactionOverGateway;
	const targets = /* @__PURE__ */ new Map();
	const findTarget = (identities) => {
		for (const identity of identities) {
			const key = params.buildKey(identity);
			const target = key ? targets.get(key) : void 0;
			if (target) return target;
		}
	};
	return {
		register(binding, identity, metadata) {
			const key = params.buildKey(identity);
			if (!key) return false;
			const existing = targets.get(key);
			if (existing) clearTimeout(existing.cleanupTimer);
			const target = {
				...binding,
				metadata,
				terminal: false,
				expiresAtMs: Date.now() + ttlMs,
				cleanupTimer: setTimeout(() => {
					if (targets.get(key) === target) targets.delete(key);
				}, ttlMs)
			};
			target.cleanupTimer.unref?.();
			targets.set(key, target);
			registerChannelDelivery({
				questionId: binding.questionId,
				deliveryId: `${params.channel}-reaction:${key}`,
				finalize: () => {
					target.terminal = true;
				}
			});
			return true;
		},
		has(identities) {
			return Boolean(findTarget(identities));
		},
		async resolve(resolveParams) {
			const target = findTarget(resolveParams.identities);
			if (!target || params.identityMatches && !params.identityMatches(target.metadata, resolveParams.metadata)) return false;
			if (target.expiresAtMs <= Date.now() || target.terminal) {
				target.terminal = true;
				resolveParams.logDebug?.(`${params.channel}: stale question reaction ignored id=${target.questionId}`);
				return true;
			}
			const optionValue = target.optionValues[resolveParams.optionIndex];
			if (!optionValue) {
				resolveParams.logDebug?.(`${params.channel}: out-of-range question reaction ignored id=${target.questionId}`);
				return true;
			}
			try {
				const result = await resolveReaction({
					cfg: resolveParams.cfg,
					questionId: target.questionId,
					optionValue,
					senderId: resolveParams.senderId,
					gatewayUrl: resolveParams.gatewayUrl,
					clientDisplayName: `${params.channelDisplayName} question (${resolveParams.senderId})`
				});
				target.terminal = result?.status === "answered" || result?.status === "already-terminal";
				if (result?.status === "already-terminal") resolveParams.logDebug?.(`${params.channel}: stale question reaction ignored id=${target.questionId}`);
			} catch (error) {
				resolveParams.logDebug?.(`${params.channel}: question reaction failed id=${target.questionId}: ${String(error)}`);
			}
			return true;
		}
	};
}
const questionGatewayRuntime = {
	resolveOption: resolveQuestionOverGateway,
	reactionEmojis: QUESTION_REACTION_EMOJIS,
	prepareReactionPayloadForDelivery: prepareQuestionReactionPayloadForDelivery,
	readAskUserQuestionId,
	readReactionBinding: readQuestionReactionBinding,
	resolveReactionIndex: resolveQuestionReactionIndex,
	resolveReaction: resolveQuestionReactionOverGateway,
	registerChannelDelivery: registerQuestionChannelDelivery
};
//#endregion
export { questionGatewayRuntime as n, createQuestionReactionTargetStore as t };
