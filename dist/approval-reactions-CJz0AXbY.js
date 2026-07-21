import { c as createApprovalReactionTargetStore } from "./approval-reaction-runtime-Dimop4P0.js";
import { n as getOptionalMatrixRuntime } from "./runtime-CN4Os2vf.js";
//#region extensions/matrix/src/approval-reactions.ts
const MATRIX_APPROVAL_REACTION_META = {
	"allow-once": {
		emoji: "✅",
		label: "Allow once"
	},
	"allow-always": {
		emoji: "♾️",
		label: "Allow always"
	},
	deny: {
		emoji: "❌",
		label: "Deny"
	}
};
const MATRIX_APPROVAL_REACTION_ORDER = [
	"allow-once",
	"allow-always",
	"deny"
];
const PERSISTENT_NAMESPACE = "matrix.approval-reactions";
const PERSISTENT_MAX_ENTRIES = 1e3;
const DEFAULT_REACTION_TARGET_TTL_MS = 1440 * 60 * 1e3;
function reportPersistentApprovalReactionError(error) {
	try {
		getOptionalMatrixRuntime()?.logging.getChildLogger({
			plugin: "matrix",
			feature: "approval-reaction-state"
		}).warn("Matrix persistent approval reaction state failed", { error: String(error) });
	} catch {}
}
function readPersistedTarget(target) {
	const value = target;
	if (!value || typeof value.approvalId !== "string" || !Array.isArray(value.allowedDecisions)) return null;
	return {
		approvalId: value.approvalId,
		allowedDecisions: value.allowedDecisions
	};
}
const matrixApprovalReactionTargets = createApprovalReactionTargetStore({
	namespace: PERSISTENT_NAMESPACE,
	maxEntries: PERSISTENT_MAX_ENTRIES,
	defaultTtlMs: DEFAULT_REACTION_TARGET_TTL_MS,
	openStore: (storeParams) => getOptionalMatrixRuntime()?.state.openKeyedStore(storeParams),
	logPersistentError: reportPersistentApprovalReactionError,
	readPersistedTarget
});
function buildReactionTargetKey(roomId, eventId) {
	const normalizedRoomId = roomId.trim();
	const normalizedEventId = eventId.trim();
	if (!normalizedRoomId || !normalizedEventId) return null;
	return `${normalizedRoomId}:${normalizedEventId}`;
}
function listMatrixApprovalReactionBindings(allowedDecisions) {
	const allowed = new Set(allowedDecisions);
	return MATRIX_APPROVAL_REACTION_ORDER.filter((decision) => allowed.has(decision)).map((decision) => ({
		decision,
		emoji: MATRIX_APPROVAL_REACTION_META[decision].emoji,
		label: MATRIX_APPROVAL_REACTION_META[decision].label
	}));
}
function buildMatrixApprovalReactionHint(allowedDecisions) {
	const bindings = listMatrixApprovalReactionBindings(allowedDecisions);
	if (bindings.length === 0) return null;
	return `React here: ${bindings.map((binding) => `${binding.emoji} ${binding.label}`).join(", ")}`;
}
function resolveMatrixApprovalReactionDecision(reactionKey, allowedDecisions) {
	const normalizedReaction = reactionKey.trim();
	if (!normalizedReaction) return null;
	const allowed = new Set(allowedDecisions);
	for (const decision of MATRIX_APPROVAL_REACTION_ORDER) {
		if (!allowed.has(decision)) continue;
		if (MATRIX_APPROVAL_REACTION_META[decision].emoji === normalizedReaction) return decision;
	}
	return null;
}
function registerMatrixApprovalReactionTarget(params) {
	const key = buildReactionTargetKey(params.roomId, params.eventId);
	const approvalId = params.approvalId.trim();
	const allowedDecisions = Array.from(new Set(params.allowedDecisions.filter((decision) => decision === "allow-once" || decision === "allow-always" || decision === "deny")));
	if (!key || !approvalId || allowedDecisions.length === 0) return;
	matrixApprovalReactionTargets.register(key, {
		approvalId,
		allowedDecisions
	}, { ttlMs: params.ttlMs });
}
function unregisterMatrixApprovalReactionTarget(params) {
	const key = buildReactionTargetKey(params.roomId, params.eventId);
	if (!key) return;
	matrixApprovalReactionTargets.delete(key);
}
function resolveTarget(params) {
	const target = params.target;
	if (!target) return null;
	const decision = resolveMatrixApprovalReactionDecision(params.reactionKey, target.allowedDecisions);
	if (!decision) return null;
	return {
		approvalId: target.approvalId,
		decision
	};
}
async function resolveMatrixApprovalReactionTargetWithPersistence(params) {
	const key = buildReactionTargetKey(params.roomId, params.eventId);
	if (!key) return null;
	return resolveTarget({
		target: await matrixApprovalReactionTargets.lookup(key),
		reactionKey: params.reactionKey
	});
}
//#endregion
export { unregisterMatrixApprovalReactionTarget as a, resolveMatrixApprovalReactionTargetWithPersistence as i, listMatrixApprovalReactionBindings as n, registerMatrixApprovalReactionTarget as r, buildMatrixApprovalReactionHint as t };
