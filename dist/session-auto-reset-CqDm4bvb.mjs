import { f as resolveAgentWorkspaceDir } from "./agent-scope-config-fjA2T9Gz.mjs";
import { w as runWithGatewayDetachedWorkContinuation } from "./gateway-work-admission-FWbk4b3p.mjs";
import { c as resolveSessionStorePathCore } from "./paths-YgcBNLgG.mjs";
import { h as resolveSessionAgentId } from "./agent-scope-DXrnO3F4.mjs";
import { n as parseSqliteSessionFileMarker } from "./legacy-sqlite-marker-CkjJ0jcJ.mjs";
import { i as logVerbose } from "./globals-XVSoVbNQ.mjs";
import { i as hasInternalHookListeners, n as createInternalHookEvent, u as triggerInternalHook } from "./internal-hooks-DNLQqCT3.mjs";
//#region src/hooks/session-auto-reset.ts
function isSessionAutoResetReason(reason) {
	return reason === "daily" || reason === "idle";
}
function hasSessionAutoResetListeners() {
	return hasInternalHookListeners("session", "auto-reset");
}
function emitSessionAutoResetHook(params) {
	if (!isSessionAutoResetReason(params.reason) || !hasSessionAutoResetListeners()) return;
	const marker = parseSqliteSessionFileMarker(params.sessionFile);
	const agentId = params.agentId ?? marker?.agentId ?? resolveSessionAgentId({
		sessionKey: params.sessionKey,
		config: params.cfg
	});
	const event = createInternalHookEvent("session", "auto-reset", params.sessionKey, {
		cfg: params.cfg,
		agentId,
		workspaceDir: params.workspaceDir ?? resolveAgentWorkspaceDir(params.cfg, agentId),
		storePath: params.storePath ?? marker?.storePath ?? resolveSessionStorePathCore(params.cfg.session?.store, { agentId }),
		sessionEntry: {
			sessionId: params.sessionId,
			sessionFile: params.sessionFile
		},
		reason: params.reason,
		transcriptArchived: params.transcriptArchived,
		nextSessionId: params.nextSessionId,
		nextSessionKey: params.nextSessionKey,
		previousSessionMemory: params.previousSessionMemory
	});
	runWithGatewayDetachedWorkContinuation(() => triggerInternalHook(event), "hooks:session-auto-reset").catch((error) => {
		logVerbose(`session:auto-reset hook failed: ${String(error)}`);
	});
}
//#endregion
export { hasSessionAutoResetListeners as n, isSessionAutoResetReason as r, emitSessionAutoResetHook as t };
