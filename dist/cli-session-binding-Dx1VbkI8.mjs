import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { r as normalizeProviderId } from "./provider-id-D1VImdKk.mjs";
//#region src/config/sessions/cli-session-binding.ts
const SHA256_HEX_PATTERN = /^[a-f0-9]{64}$/;
function normalizeCliTranscriptCursor(value) {
	const localSessionId = normalizeOptionalString(value?.localSessionId);
	const runId = normalizeOptionalString(value?.runId);
	const entryId = value?.entryId === null ? null : normalizeOptionalString(value?.entryId);
	return localSessionId && runId && entryId !== void 0 ? {
		localSessionId,
		entryId,
		runId,
		userEntryId: normalizeOptionalString(value?.userEntryId)
	} : void 0;
}
function normalizeCliSessionReseedReceipt(value) {
	const promptHash = normalizeOptionalString(value?.promptHash);
	const localSessionId = normalizeOptionalString(value?.localSessionId);
	const userTurnDisposition = value?.userTurnDisposition;
	if (value?.version !== 1 || !promptHash || !SHA256_HEX_PATTERN.test(promptHash) || !localSessionId || userTurnDisposition !== "persisted" && userTurnDisposition !== "omitted") return;
	return {
		version: 1,
		promptHash,
		localSessionId,
		userTurnDisposition
	};
}
/**
* Re-own omitted reseed receipts when a reset intentionally preserves the
* native CLI conversation. Persisted turns keep their old owner and fail open
* because their canonical user row belongs to the archived local transcript.
*/
function rebindCliSessionReseedReceiptsForReset(bindings, localSessionId) {
	const normalizedLocalSessionId = normalizeOptionalString(localSessionId);
	if (!bindings || !normalizedLocalSessionId) return bindings;
	let rebound;
	for (const [provider, binding] of Object.entries(bindings)) {
		const receipt = normalizeCliSessionReseedReceipt(binding.reseedReceipt);
		if (!receipt || receipt.userTurnDisposition !== "omitted") continue;
		rebound ??= { ...bindings };
		rebound[provider] = {
			...binding,
			reseedReceipt: {
				...receipt,
				localSessionId: normalizedLocalSessionId
			}
		};
	}
	return rebound ?? bindings;
}
/** Read the stored provider-keyed CLI session binding. */
function getCliSessionBinding(entry, provider) {
	if (!entry) return;
	const normalized = normalizeProviderId(provider);
	const fromBindings = entry.cliSessionBindings?.[normalized];
	const bindingSessionId = normalizeOptionalString(fromBindings?.sessionId);
	if (bindingSessionId) return {
		sessionId: bindingSessionId,
		resumeCheckpointId: normalizeOptionalString(fromBindings?.resumeCheckpointId),
		...fromBindings?.forceReuse === true ? { forceReuse: true } : {},
		...fromBindings?.forkNextResume === true ? { forkNextResume: true } : {},
		authProfileId: normalizeOptionalString(fromBindings?.authProfileId),
		authEpoch: normalizeOptionalString(fromBindings?.authEpoch),
		authEpochVersion: fromBindings?.authEpochVersion,
		extraSystemPromptHash: normalizeOptionalString(fromBindings?.extraSystemPromptHash),
		messageToolPolicyHash: normalizeOptionalString(fromBindings?.messageToolPolicyHash),
		promptToolNamesHash: normalizeOptionalString(fromBindings?.promptToolNamesHash),
		cwdHash: normalizeOptionalString(fromBindings?.cwdHash),
		mcpConfigHash: normalizeOptionalString(fromBindings?.mcpConfigHash),
		mcpResumeHash: normalizeOptionalString(fromBindings?.mcpResumeHash),
		reseedReceipt: normalizeCliSessionReseedReceipt(fromBindings?.reseedReceipt),
		transcriptCursor: normalizeCliTranscriptCursor(fromBindings?.transcriptCursor)
	};
	const fromMap = entry.cliSessionIds?.[normalized];
	const normalizedFromMap = normalizeOptionalString(fromMap);
	if (normalizedFromMap) return { sessionId: normalizedFromMap };
}
function forkCliSessionBindings(parent, supportsFork) {
	const providers = /* @__PURE__ */ new Set([...Object.keys(parent?.cliSessionBindings ?? {}), ...Object.keys(parent?.cliSessionIds ?? {})]);
	const forked = {};
	for (const provider of providers) {
		const binding = getCliSessionBinding(parent, provider);
		if (binding?.resumeCheckpointId && supportsFork(provider)) {
			const { reseedReceipt: _reseedReceipt, transcriptCursor: _transcriptCursor, forceReuse: _forceReuse, ...inherited } = binding;
			forked[normalizeProviderId(provider)] = {
				...inherited,
				forkNextResume: true
			};
		}
	}
	return Object.keys(forked).length > 0 ? forked : void 0;
}
function clearAllCliSessions(entry) {
	entry.cliSessionBindings = void 0;
	entry.cliSessionIds = void 0;
	entry.claudeCliSessionId = void 0;
}
//#endregion
export { normalizeCliTranscriptCursor as a, normalizeCliSessionReseedReceipt as i, forkCliSessionBindings as n, rebindCliSessionReseedReceiptsForReset as o, getCliSessionBinding as r, clearAllCliSessions as t };
