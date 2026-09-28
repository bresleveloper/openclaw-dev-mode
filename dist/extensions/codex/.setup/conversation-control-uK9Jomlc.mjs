import { n as isCodexFastServiceTier } from "./config-utils-DujwEnhg.mjs";
import { r as bindingStoreKey } from "./session-binding-record-BGoz8wOK.mjs";
import { o as formatCodexDisplayText } from "./command-formatters-Bmqvr9tO.mjs";
import "./config-BoTP_mrL.mjs";
import { n as normalizeCodexAppServerBindingModelProvider, t as isCodexAppServerNativeAuthProfile } from "./auth-profile-WqZtZfXN.mjs";
import { _ as resolveCodexAppServerRequestModelSelection, y as resolveCodexBindingModelProviderFallback } from "./thread-requests-BLvGkP2R.mjs";
import "./thread-lifecycle-B3mfz1TG.mjs";
import "./session-binding-Cm0apEbd.mjs";
import { resolveAgentDir } from "openclaw/plugin-sdk/agent-runtime";
import { getSessionEntry, patchSessionEntry, resolveStorePath } from "openclaw/plugin-sdk/session-store-runtime";
import { ModelSelectionLockedError, applyModelOverrideWithAuthProfileCompatibility } from "openclaw/plugin-sdk/model-session-runtime";
//#region extensions/codex/src/conversation-control.ts
const CODEX_CONVERSATION_CONTROL_STATE = Symbol.for("openclaw.codex.conversationControl");
function getActiveTurns() {
	const globalState = globalThis;
	globalState[CODEX_CONVERSATION_CONTROL_STATE] ??= /* @__PURE__ */ new Map();
	return globalState[CODEX_CONVERSATION_CONTROL_STATE];
}
function trackCodexConversationActiveTurn(active) {
	const activeTurns = getActiveTurns();
	const key = bindingStoreKey(active.identity);
	activeTurns.set(key, active);
	return () => {
		if (activeTurns.get(key)?.turnId === active.turnId) activeTurns.delete(key);
	};
}
function readCodexConversationActiveTurn(identity) {
	return getActiveTurns().get(bindingStoreKey(identity));
}
async function stopCodexConversationTurn(params) {
	const active = readCodexConversationActiveTurn(params.identity);
	if (!active) return {
		stopped: false,
		message: "No active Codex run to stop."
	};
	if (params.binding?.threadId !== active.threadId) return {
		stopped: false,
		message: "The active Codex run no longer matches this session binding."
	};
	await active.client.request("turn/interrupt", {
		threadId: active.threadId,
		turnId: active.turnId
	}, {
		timeoutMs: active.requestTimeoutMs,
		assertCurrent: params.assertCurrent
	});
	return {
		stopped: true,
		message: "Codex stop requested."
	};
}
async function steerCodexConversationTurn(params) {
	const active = readCodexConversationActiveTurn(params.identity);
	const text = params.message.trim();
	if (!text) return {
		steered: false,
		message: "Usage: /codex steer <message>"
	};
	if (!active) return {
		steered: false,
		message: "No active Codex run to steer."
	};
	if (params.binding?.threadId !== active.threadId) return {
		steered: false,
		message: "The active Codex run no longer matches this session binding."
	};
	await active.client.request("turn/steer", {
		threadId: active.threadId,
		expectedTurnId: active.turnId,
		input: [{
			type: "text",
			text,
			text_elements: []
		}]
	}, {
		timeoutMs: active.requestTimeoutMs,
		assertCurrent: params.assertCurrent
	});
	return {
		steered: true,
		message: "Sent steer message to Codex."
	};
}
async function setCodexConversationModel(input) {
	const params = { ...input };
	const model = params.model.trim();
	if (!model) return "Usage: /codex model <model>";
	const lookup = buildBindingLookup(params);
	params.assertCurrent();
	const assertCommitAllowed = params.assertCommitAllowed ?? params.assertCurrent;
	const binding = requirePreparedThreadBinding(params.binding);
	if (binding.connectionScope === "supervision") throw new ModelSelectionLockedError();
	const modelProvider = resolveConversationControlModelProvider({
		authProfileId: binding.authProfileId,
		bindingModel: binding.model,
		bindingModelProvider: binding.modelProvider,
		currentModel: model,
		...lookup
	});
	const modelSelection = resolveCodexAppServerRequestModelSelection({
		model,
		modelProvider,
		authProfileId: binding.authProfileId,
		...lookup
	});
	const nextModelProvider = normalizeCodexAppServerBindingModelProvider({
		authProfileId: binding.authProfileId,
		modelProvider: modelSelection.modelProvider,
		...lookup
	});
	const nextModel = modelSelection.model;
	const modelChanged = nextModel !== binding.model || nextModelProvider !== binding.modelProvider;
	const projectionPatch = modelChanged && binding.contextEngine?.projection ? { contextEngine: {
		...binding.contextEngine,
		projection: void 0
	} } : {};
	const identity = params.identity;
	if (identity.kind === "session" && identity.sessionKey) {
		if (!await patchSessionEntry({
			agentId: identity.agentId,
			storePath: params.storePath ?? resolveStorePath(params.config?.session?.store, { agentId: identity.agentId }),
			sessionKey: identity.sessionKey,
			requireWriteSuccess: true,
			replaceEntry: true,
			assertCommitAllowed,
			update: (entry) => {
				if (entry.sessionId !== identity.sessionId) throw new Error("Codex session changed while applying the model selection.");
				applyModelOverrideWithAuthProfileCompatibility({
					cfg: params.config ?? {},
					agentDir: params.agentDir ?? resolveAgentDir(params.config ?? {}, identity.agentId),
					entry,
					currentProvider: binding.modelProvider ?? "openai",
					selection: {
						provider: nextModelProvider ?? "openai",
						model: nextModel
					},
					markLiveSwitchPending: true
				});
				return entry;
			}
		})) throw new Error("Codex session changed while applying the model selection.");
		if (modelChanged && binding.contextEngine?.projection) await patchThreadBinding(params.bindingStore, identity, binding.threadId, projectionPatch, params.assertCurrent);
	} else await patchThreadBinding(params.bindingStore, params.identity, binding.threadId, {
		model: nextModel,
		modelProvider: nextModelProvider,
		...projectionPatch
	}, assertCommitAllowed);
	return `Codex model set to ${formatCodexDisplayText(nextModel)}.`;
}
async function setCodexConversationFastMode(params) {
	params.assertCurrent();
	const binding = requirePreparedThreadBinding(params.binding);
	if (params.enabled == null) return `Codex fast mode: ${isCodexFastServiceTier(binding.serviceTier) ? "on" : "off"}.`;
	const serviceTier = params.enabled ? "priority" : "flex";
	await patchThreadBinding(params.bindingStore, params.identity, binding.threadId, { serviceTier }, params.assertCurrent);
	return `Codex fast mode ${params.enabled ? "enabled" : "disabled"}.`;
}
async function setCodexConversationPermissions(params) {
	params.assertCurrent();
	const storePath = params.storePath ?? resolveStorePath(params.config?.session?.store, { agentId: params.session.agentId });
	if (!params.mode) {
		const entry = getSessionEntry({
			agentId: params.session.agentId,
			hydrateSkillPromptRefs: false,
			readConsistency: "latest",
			sessionKey: params.session.sessionKey,
			storePath
		});
		params.assertCurrent();
		if (entry?.sessionId !== params.session.sessionId) throw new Error("Codex session changed while reading the permission mode.");
		return `Codex permissions: ${formatPermissionsMode(entry.permissionMode)}.`;
	}
	if (!await patchSessionEntry({
		agentId: params.session.agentId,
		storePath,
		sessionKey: params.session.sessionKey,
		requireWriteSuccess: true,
		replaceEntry: true,
		assertCommitAllowed: params.assertCurrent,
		update: (entry) => {
			if (entry.sessionId !== params.session.sessionId) throw new Error("Codex session changed while applying the permission mode.");
			entry.permissionMode = params.mode === "yolo" ? "full" : "guarded";
			return entry;
		}
	})) throw new Error("Codex session changed while applying the permission mode.");
	return `Codex permissions set to ${params.mode === "yolo" ? "full access" : "guarded"}.`;
}
function parseCodexFastModeArg(arg) {
	const normalized = arg?.trim().toLowerCase();
	if (!normalized || normalized === "status") return;
	if (normalized === "on" || normalized === "true" || normalized === "fast") return true;
	if (normalized === "off" || normalized === "false" || normalized === "flex") return false;
}
function parseCodexPermissionsModeArg(arg) {
	const normalized = arg?.trim().toLowerCase();
	if (!normalized || normalized === "status") return;
	if (normalized === "yolo" || normalized === "full" || normalized === "full-access") return "yolo";
	if ([
		"default",
		"guardian",
		"guarded",
		"approve"
	].includes(normalized)) return "default";
}
function formatPermissionsMode(mode) {
	return mode === "full" ? "full access" : mode ?? "default";
}
function requirePreparedThreadBinding(binding) {
	if (!binding?.threadId) throw new Error("No Codex thread is attached to this OpenClaw session yet.");
	return binding;
}
async function patchThreadBinding(bindingStore, identity, threadId, patch, assertCurrent) {
	if (!await bindingStore.mutate(identity, {
		kind: "patch",
		threadId,
		patch
	}, assertCurrent)) throw new Error("Codex thread binding changed while applying the control update.");
}
function buildBindingLookup(params) {
	const agentDir = params.agentDir?.trim();
	return {
		...agentDir ? { agentDir } : {},
		...params.config ? { config: params.config } : {}
	};
}
function resolveConversationControlModelProvider(params) {
	const modelProvider = resolveCodexBindingModelProviderFallback({
		currentModel: params.currentModel,
		bindingModel: params.bindingModel,
		bindingModelProvider: params.bindingModelProvider
	})?.trim();
	if (!modelProvider || modelProvider.toLowerCase() === "codex") return;
	if (isCodexAppServerNativeAuthProfile(params) && modelProvider.toLowerCase() === "openai") return;
	return modelProvider.toLowerCase() === "openai" ? "openai" : modelProvider;
}
//#endregion
export { setCodexConversationFastMode as a, steerCodexConversationTurn as c, readCodexConversationActiveTurn as i, stopCodexConversationTurn as l, parseCodexFastModeArg as n, setCodexConversationModel as o, parseCodexPermissionsModeArg as r, setCodexConversationPermissions as s, formatPermissionsMode as t, trackCodexConversationActiveTurn as u };
