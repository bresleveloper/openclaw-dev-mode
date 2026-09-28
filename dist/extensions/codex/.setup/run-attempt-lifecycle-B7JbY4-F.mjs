import { t as attemptTerminal } from "./attempt-terminal-gZrxQ35N.mjs";
import path from "node:path";
import fs from "node:fs/promises";
import { awaitAgentEndSideEffects, embeddedAgentLog, emitAgentEvent, runAgentEndSideEffects } from "openclaw/plugin-sdk/agent-harness-runtime";
//#region extensions/codex/src/app-server/workspace-dir-cache.ts
/** Process-local cache of Codex workspaces already created by the run loop. */
const codexWorkspaceDirCache = /* @__PURE__ */ new Set();
//#endregion
//#region extensions/codex/src/app-server/run-attempt-lifecycle.ts
const CODEX_APP_SERVER_PROJECTED_CHARS_PER_TOKEN = 4;
function shouldKeepCodexSharedAbortOpen(params) {
	const terminal = attemptTerminal.project(params.result.terminal);
	if (params.explicitCancellationObserved || terminal.aborted || terminal.externalAbort) return false;
	return params.trigger === "memory" || !params.attemptSucceeded;
}
function withCodexAppServerFastModeServiceTier(appServer, params) {
	const fastMode = typeof params.fastMode === "function" ? params.fastMode() : params.fastMode;
	const serviceTier = fastMode === void 0 ? appServer.serviceTier : fastMode ? "priority" : void 0;
	if (serviceTier === appServer.serviceTier) return appServer;
	if (serviceTier) return {
		...appServer,
		serviceTier
	};
	return {
		...appServer,
		serviceTier: null
	};
}
function estimateCodexAppServerProjectedTurnTokens(params) {
	const inputChars = params.prompt.length + (params.developerInstructions?.length ?? 0);
	return Math.max(1, Math.ceil(inputChars / CODEX_APP_SERVER_PROJECTED_CHARS_PER_TOKEN));
}
async function ensureCodexWorkspaceDirOnce(workspaceDir) {
	const normalized = path.resolve(workspaceDir);
	if (codexWorkspaceDirCache.has(normalized)) return;
	await fs.mkdir(normalized, { recursive: true });
	codexWorkspaceDirCache.add(normalized);
}
async function emitCodexAppServerEvent(params, event) {
	try {
		emitAgentEvent({
			runId: params.runId,
			stream: event.stream,
			data: event.data,
			...params.sessionKey ? { sessionKey: params.sessionKey } : {}
		});
	} catch (error) {
		embeddedAgentLog.debug("codex app-server global agent event emit failed", { error });
	}
	try {
		await params.onAgentEvent?.(event);
	} catch (error) {
		embeddedAgentLog.debug("codex app-server agent event handler threw", { error });
	}
}
async function runCodexAgentEndHook(params, hookParams) {
	const sideEffectParams = {
		...hookParams,
		ctx: {
			...hookParams.ctx,
			config: params.config
		}
	};
	if (!params.messageChannel && !params.messageProvider) {
		await awaitAgentEndSideEffects(sideEffectParams);
		return;
	}
	runAgentEndSideEffects(sideEffectParams);
}
//#endregion
export { shouldKeepCodexSharedAbortOpen as a, runCodexAgentEndHook as i, ensureCodexWorkspaceDirOnce as n, withCodexAppServerFastModeServiceTier as o, estimateCodexAppServerProjectedTurnTokens as r, emitCodexAppServerEvent as t };
