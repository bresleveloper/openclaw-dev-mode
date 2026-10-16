import { t as __exportAll } from "./rolldown-runtime-BBjsoOtd.mjs";
import { a as resolveWhatsAppAccount } from "./accounts-F0vHuze2.mjs";
import { d as listWhatsAppDeliveredMessageIdentities } from "./send-CGUsUdoX.mjs";
import { n as getOptionalWhatsAppRuntime } from "./runtime-BLlToOi6.mjs";
import { c as whatsappApprovalAuth, s as getWhatsAppApprovalApprovers } from "./group-session-key-BV8Le9r8.mjs";
import { normalizeUniqueTrimmedStringList } from "openclaw/plugin-sdk/string-coerce-runtime";
import { createLazyRuntimeSurface } from "openclaw/plugin-sdk/lazy-runtime";
import { approvalReactionDecisionSetsMatch, buildApprovalReactionDeliveredBindingMarker, createApprovalReactionTargetStore, listApprovalReactionBindings, readApprovalReactionDecisionList, readApprovalReactionDeliveredBinding, readApprovalReactionPresentationBinding, readApprovalReactionTargetRecord, resolveTypedApprovalReactionTarget, settleApprovalReaction } from "openclaw/plugin-sdk/approval-reaction-runtime";
import { createPluginStateErrorReporter } from "openclaw/plugin-sdk/plugin-state-runtime";
//#region extensions/whatsapp/src/approval-reactions.ts
var approval_reactions_exports = /* @__PURE__ */ __exportAll({
	clearWhatsAppApprovalReactionTargetsForTest: () => clearWhatsAppApprovalReactionTargetsForTest,
	maybeResolveWhatsAppApprovalReaction: () => maybeResolveWhatsAppApprovalReaction,
	prepareWhatsAppApprovalPayloadForDelivery: () => prepareWhatsAppApprovalPayloadForDelivery,
	registerWhatsAppApprovalReactionTarget: () => registerWhatsAppApprovalReactionTarget,
	registerWhatsAppApprovalReactionTargetForDeliveredPayload: () => registerWhatsAppApprovalReactionTargetForDeliveredPayload,
	resolveWhatsAppApprovalReactionTargetWithPersistence: () => resolveWhatsAppApprovalReactionTargetWithPersistence,
	unregisterWhatsAppApprovalReactionTarget: () => unregisterWhatsAppApprovalReactionTarget
});
const PERSISTENT_NAMESPACE = "whatsapp.approval-reactions";
const PERSISTENT_MAX_ENTRIES = 1e3;
const DEFAULT_REACTION_TARGET_TTL_MS = 864e5;
const DELIVERY_BINDING_CHANNEL_DATA_KEY = "whatsappApprovalReactionBindingV1";
const loadResolveApprovalOverGateway = createLazyRuntimeSurface(() => import("openclaw/plugin-sdk/approval-gateway-runtime"), (runtime) => runtime.resolveApprovalOverGateway);
const reportPersistentApprovalReactionError = createPluginStateErrorReporter(getOptionalWhatsAppRuntime, "whatsapp", "approval-reaction-state", "WhatsApp persistent approval reaction state failed");
const whatsappApprovalReactionTargets = createApprovalReactionTargetStore({
	namespace: PERSISTENT_NAMESPACE,
	maxEntries: PERSISTENT_MAX_ENTRIES,
	defaultTtlMs: DEFAULT_REACTION_TARGET_TTL_MS,
	openStore: (storeParams) => getOptionalWhatsAppRuntime()?.state.openKeyedStore(storeParams),
	logPersistentError: reportPersistentApprovalReactionError,
	readPersistedTarget: readApprovalReactionTargetRecord
});
function buildReactionTargetKey(params) {
	const accountId = params.accountId.trim();
	const remoteJid = params.remoteJid.trim();
	const messageId = params.messageId.trim();
	if (!accountId || !remoteJid || !messageId) return null;
	return `${accountId}:${remoteJid}:${messageId}`;
}
function reportApprovalBindingCorrelationMismatch(binding) {
	try {
		getOptionalWhatsAppRuntime()?.logging.getChildLogger({
			plugin: "whatsapp",
			feature: "approval-reaction-state"
		}).warn("WhatsApp approval prompt text failed binding correlation; reactions disabled", {
			approvalId: binding.approvalId,
			approvalKind: binding.approvalKind
		});
	} catch {}
}
const APPROVAL_ID_LINE_RE = /^\s*ID:\s*(\S(?:.*\S)?)\s*$/i;
const APPROVAL_KIND_LINE_RE = /^\s*(?:\S+\s+)?(Exec|Plugin) approval required\s*$/i;
function visibleApprovalBindingMatches(text, binding) {
	const lines = (text ?? "").split(/\r?\n/).map((line) => line.replace(/\*\*/g, ""));
	const kindMatches = lines.map((line) => line.match(APPROVAL_KIND_LINE_RE)).filter((match) => Boolean(match));
	const idMatches = lines.map((line) => line.match(APPROVAL_ID_LINE_RE)).filter((match) => Boolean(match));
	const visibleKind = kindMatches[0]?.[1]?.toLowerCase();
	if (kindMatches.length !== 1 || idMatches.length !== 1 || visibleKind !== binding.approvalKind || idMatches[0]?.[1] !== binding.approvalId) return false;
	const hintIndices = lines.flatMap((line, index) => line.trim().toLowerCase() === "react with:" ? [index] : []);
	if (hintIndices.length !== 1) return false;
	const hintIndex = hintIndices[0];
	if (hintIndex === void 0) return false;
	let cursor = hintIndex + 1;
	while (cursor < lines.length && !lines[cursor]?.trim()) cursor += 1;
	const decisionLines = [];
	while (cursor < lines.length) {
		const decisionLine = lines[cursor]?.trim();
		if (!decisionLine) break;
		decisionLines.push(decisionLine);
		cursor += 1;
	}
	const knownBindings = listApprovalReactionBindings({ allowedDecisions: [
		"allow-once",
		"allow-always",
		"deny"
	] });
	const visibleDecisions = decisionLines.map((line) => knownBindings.find((entry) => `${entry.emoji} ${entry.label}` === line)?.decision);
	const decisions = readApprovalReactionDecisionList(visibleDecisions);
	if (!decisions) return false;
	return approvalReactionDecisionSetsMatch(binding.allowedDecisions, decisions);
}
/** Preserve a validated typed approval binding until the platform message id is known. */
function prepareWhatsAppApprovalPayloadForDelivery(params) {
	const binding = readApprovalReactionPresentationBinding(params);
	if (!binding) return null;
	if (!visibleApprovalBindingMatches(params.payload.text, binding)) {
		reportApprovalBindingCorrelationMismatch(binding);
		return null;
	}
	return {
		...params.payload,
		channelData: {
			...params.payload.channelData,
			[DELIVERY_BINDING_CHANNEL_DATA_KEY]: buildApprovalReactionDeliveredBindingMarker(binding)
		}
	};
}
async function registerWhatsAppApprovalReactionTarget(params) {
	const key = buildReactionTargetKey(params);
	const approvalId = params.approvalId.trim();
	const allowedDecisions = listApprovalReactionBindings({ allowedDecisions: params.allowedDecisions }).map((binding) => binding.decision);
	if (!key || !approvalId || params.approvalKind !== "exec" && params.approvalKind !== "plugin" && params.approvalKind !== "system-agent" || allowedDecisions.length === 0) return null;
	const target = {
		approvalId,
		approvalKind: params.approvalKind,
		allowedDecisions
	};
	await whatsappApprovalReactionTargets.register(key, target, { ttlMs: params.ttlMs });
	return target;
}
/** Bind generic forwarded approvals to the exact WhatsApp messages accepted by Baileys. */
async function registerWhatsAppApprovalReactionTargetForDeliveredPayload(params) {
	if (params.target.channel.trim().toLowerCase() !== "whatsapp") return false;
	const binding = readApprovalReactionDeliveredBinding({
		payload: params.payload,
		channelDataKey: DELIVERY_BINDING_CHANNEL_DATA_KEY
	});
	if (!binding) return false;
	if (!visibleApprovalBindingMatches(params.payload.text, binding)) {
		reportApprovalBindingCorrelationMismatch(binding);
		return false;
	}
	const accountId = resolveWhatsAppAccount({
		cfg: params.cfg,
		accountId: params.target.accountId
	}).accountId;
	const registrations = [];
	for (const { messageId, remoteJid } of listWhatsAppDeliveredMessageIdentities(params.results, (channel) => !channel || channel === "whatsapp")) registrations.push(registerWhatsAppApprovalReactionTarget({
		accountId,
		remoteJid,
		messageId,
		approvalId: binding.approvalId,
		approvalKind: binding.approvalKind,
		allowedDecisions: binding.allowedDecisions,
		ttlMs: params.ttlMs
	}));
	return (await Promise.all(registrations)).some(Boolean);
}
async function unregisterWhatsAppApprovalReactionTarget(params) {
	const key = buildReactionTargetKey(params);
	if (!key) return;
	await whatsappApprovalReactionTargets.delete(key);
}
async function resolveWhatsAppApprovalReactionTargetWithPersistence(params) {
	const key = buildReactionTargetKey(params);
	if (!key) return null;
	const resolved = resolveTypedApprovalReactionTarget({
		target: await whatsappApprovalReactionTargets.lookup(key),
		reactionKey: params.reactionKey
	});
	return resolved ? {
		approvalId: resolved.approvalId,
		approvalKind: resolved.approvalKind,
		decision: resolved.decision
	} : null;
}
async function resolveWhatsAppApprovalReactionTargetFromCandidates(params) {
	const candidateRemoteJids = [];
	for (const observedRemoteJid of params.observedRemoteJids) {
		candidateRemoteJids.push(observedRemoteJid);
		try {
			candidateRemoteJids.push(...await params.resolveReactionTargetJids?.(observedRemoteJid) ?? []);
		} catch (error) {
			params.logVerboseMessage?.(`whatsapp: approval reaction target JID mapping failed for ${observedRemoteJid}: ${String(error)}`);
		}
	}
	for (const remoteJid of normalizeUniqueTrimmedStringList(candidateRemoteJids)) {
		const target = await resolveWhatsAppApprovalReactionTargetWithPersistence({
			accountId: params.accountId,
			remoteJid,
			messageId: params.messageId,
			reactionKey: params.reactionKey
		});
		if (target) return {
			...target,
			remoteJid
		};
	}
	return null;
}
function readWhatsAppApprovalReactionEvent(params) {
	const msg = params.msg;
	const reaction = msg.message?.reactionMessage;
	const reactionKey = reaction?.text?.trim() ?? "";
	const messageId = reaction?.key?.id?.trim() ?? "";
	const remoteJids = normalizeUniqueTrimmedStringList([reaction?.key?.remoteJid, msg.key?.remoteJid]);
	const actorJid = msg.key?.participant?.trim() || (msg.key?.fromMe ? params.selfLid?.trim() ?? params.selfJid?.trim() ?? "" : msg.key?.remoteJid?.trim() ?? "");
	if (!reactionKey || !messageId || remoteJids.length === 0 || !actorJid) return null;
	return {
		remoteJids,
		messageId,
		actorJid,
		reactionKey
	};
}
async function maybeResolveWhatsAppApprovalReaction(params) {
	const event = readWhatsAppApprovalReactionEvent({
		msg: params.msg,
		selfJid: params.selfJid,
		selfLid: params.selfLid
	});
	if (!event) return false;
	const target = await resolveWhatsAppApprovalReactionTargetFromCandidates({
		accountId: params.accountId,
		observedRemoteJids: event.remoteJids,
		messageId: event.messageId,
		reactionKey: event.reactionKey,
		resolveReactionTargetJids: params.resolveReactionTargetJids,
		logVerboseMessage: params.logVerboseMessage
	});
	if (!target) return false;
	const actorId = await params.resolveInboundJid(event.actorJid);
	if (!actorId) {
		params.logVerboseMessage?.(`whatsapp: approval reaction ignored for ${target.approvalId}; missing actor identity`);
		return true;
	}
	await settleApprovalReaction({
		request: {
			cfg: params.cfg,
			approvalId: target.approvalId,
			approvalKind: target.approvalKind,
			decision: target.decision,
			channel: "whatsapp",
			accountId: params.accountId,
			senderId: actorId,
			gatewayUrl: params.gatewayUrl
		},
		approvers: getWhatsAppApprovalApprovers({
			cfg: params.cfg,
			accountId: params.accountId
		}),
		authorizeActorAction: (input) => whatsappApprovalAuth.authorizeActorAction(input),
		loadResolver: loadResolveApprovalOverGateway,
		clearTarget: () => unregisterWhatsAppApprovalReactionTarget({
			accountId: params.accountId,
			remoteJid: target.remoteJid,
			messageId: event.messageId
		}),
		onResolved: (result) => {
			const canonicalDecision = "decision" in result.approval ? ` decision=${result.approval.decision}` : "";
			params.logVerboseMessage?.(result.applied ? `whatsapp: approval reaction applied id=${target.approvalId} sender=${actorId} status=${result.approval.status}${canonicalDecision}` : `whatsapp: approval reaction already resolved id=${target.approvalId} sender=${actorId} status=${result.approval.status}${canonicalDecision}`);
		},
		logVerboseMessage: params.logVerboseMessage
	});
	return true;
}
function clearWhatsAppApprovalReactionTargetsForTest() {
	whatsappApprovalReactionTargets.clearForTest();
	loadResolveApprovalOverGateway.clear();
}
//#endregion
export { unregisterWhatsAppApprovalReactionTarget as i, maybeResolveWhatsAppApprovalReaction as n, registerWhatsAppApprovalReactionTarget as r, approval_reactions_exports as t };
