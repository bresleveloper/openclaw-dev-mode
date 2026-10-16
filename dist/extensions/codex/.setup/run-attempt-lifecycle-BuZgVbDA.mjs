import { t as attemptTerminal } from "./attempt-terminal-gZrxQ35N.mjs";
import path from "node:path";
import fs from "node:fs/promises";
import { awaitAgentEndSideEffects, embeddedAgentLog, formatErrorMessage, runAgentEndSideEffects } from "openclaw/plugin-sdk/agent-harness-runtime";
import { emitAgentHarnessAttemptEvent } from "openclaw/plugin-sdk/agent-harness-attempt-runtime";
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
function withCodexAppServerFastModeServiceTier(appServer, params, configuredAppServer = appServer) {
	const fastMode = typeof params.fastMode === "function" ? params.fastMode() : params.fastMode;
	const configuredServiceTier = configuredAppServer.serviceTier === "ultrafast" ? "priority" : configuredAppServer.serviceTier;
	const serviceTier = fastMode === void 0 ? configuredServiceTier : fastMode ? "priority" : null;
	if (serviceTier === appServer.serviceTier) return appServer;
	return {
		...appServer,
		serviceTier: serviceTier || null
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
function emitCodexAppServerEvent(params, event) {
	return emitAgentHarnessAttemptEvent(params, event, {
		label: "codex app-server",
		log: embeddedAgentLog
	});
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
function reportCodexBackgroundCleanupFailure(params, error) {
	const message = formatErrorMessage(error);
	embeddedAgentLog.warn("codex native background work remains unsettled", {
		runId: params.runId,
		sessionId: params.sessionId,
		error: message
	});
	emitCodexAppServerEvent(params, {
		stream: "codex_app_server.lifecycle",
		data: {
			phase: "background_cleanup_failed",
			error: message
		}
	});
}
//#endregion
export { runCodexAgentEndHook as a, reportCodexBackgroundCleanupFailure as i, ensureCodexWorkspaceDirOnce as n, shouldKeepCodexSharedAbortOpen as o, estimateCodexAppServerProjectedTurnTokens as r, withCodexAppServerFastModeServiceTier as s, emitCodexAppServerEvent as t };
