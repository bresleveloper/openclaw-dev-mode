import { t as createLazyImportLoader } from "./lazy-promise-DGqyc4Y4.mjs";
import { m as resolveDefaultAgentId } from "./agent-scope-config-IQKOEtZ4.mjs";
import { A as parseAgentSessionKey } from "./session-key-CBvmC8zz.mjs";
import "./agent-scope-CTuYDtny.mjs";
import { i as logVerbose } from "./globals-QODkv80i.mjs";
import { t as getGlobalHookRunner } from "./hook-runner-global-DlvY8FQy.mjs";
import { t as formatSqliteSessionFileMarker } from "./legacy-sqlite-marker-COPKCuIN.mjs";
import { d as selectSessionTranscriptLeafControlledPath } from "./transcript-tree-3xvvNd9-.mjs";
import { c as loadTranscriptEvents } from "./session-accessor.sqlite-read-BzN7WYll.mjs";
import { T as resolveSessionStorePathForScope } from "./session-accessor.sqlite-entry-BB2Zsfho.mjs";
import "./session-accessor-l-4ZHvKn.mjs";
import { n as createInternalHookEvent, u as triggerInternalHook } from "./internal-hooks-B-eMkNRp.mjs";
//#region src/auto-reply/reply/commands-reset-hooks.ts
const routeReplyRuntimeLoader = createLazyImportLoader(() => import("./route-reply.runtime.js"));
function loadRouteReplyRuntime() {
	return routeReplyRuntimeLoader.load();
}
function parseTranscriptMessages(entries) {
	return (selectSessionTranscriptLeafControlledPath(entries) ?? entries).flatMap((entry) => {
		if (entry && typeof entry === "object" && !Array.isArray(entry) && entry.type === "message" && entry.message) return [entry.message];
		return [];
	});
}
async function readBeforeResetMessages(params) {
	if (!params.sessionId || !params.sessionKey || !params.storePath) {
		logVerbose("before_reset: no session identity available, firing hook with empty messages");
		return [];
	}
	try {
		return parseTranscriptMessages(await loadTranscriptEvents({
			...params.agentId ? { agentId: params.agentId } : {},
			sessionId: params.sessionId,
			sessionKey: params.sessionKey,
			storePath: params.storePath
		}));
	} catch (err) {
		logVerbose(`before_reset: failed to read transcript identity ${params.sessionKey}/${params.sessionId}; firing hook with empty messages (${String(err)})`);
		return [];
	}
}
async function emitResetCommandHooks(params) {
	const hookAgentId = parseAgentSessionKey(params.sessionKey)?.agentId ?? params.agentId ?? resolveDefaultAgentId(params.cfg);
	const hookStorePath = hookAgentId && params.storePath ? resolveSessionStorePathForScope({
		agentId: hookAgentId,
		sessionKey: params.sessionKey,
		storePath: params.storePath
	}) : params.storePath;
	const hookEvent = createInternalHookEvent("command", params.action, params.sessionKey ?? "", {
		agentId: hookAgentId,
		sessionEntry: params.sessionEntry,
		previousSessionEntry: params.previousSessionEntry,
		previousSessionMemory: params.previousSessionMemory,
		commandSource: params.command.surface,
		senderId: params.command.senderId,
		workspaceDir: params.workspaceDir,
		storePath: hookStorePath,
		cfg: params.cfg
	});
	await triggerInternalHook(hookEvent);
	params.command.resetHookTriggered = true;
	let routedReply = false;
	if (hookEvent.messages.length > 0) {
		const channel = params.ctx.OriginatingChannel || params.command.channel;
		const to = params.ctx.OriginatingTo || params.command.from || params.command.to;
		if (channel && to) {
			const { routeReply } = await loadRouteReplyRuntime();
			const result = await routeReply({
				payload: { text: hookEvent.messages.join("\n\n") },
				channel,
				to,
				agentId: hookAgentId,
				sessionKey: params.sessionKey,
				accountId: params.ctx.AccountId,
				requesterSenderId: params.command.senderId,
				requesterSenderName: params.ctx.SenderName,
				requesterSenderUsername: params.ctx.SenderUsername,
				requesterSenderE164: params.ctx.SenderE164,
				threadId: params.ctx.MessageThreadId,
				cfg: params.cfg,
				replyKind: "final"
			});
			if (result.delivered) await params.onObservedReplyDelivery?.();
			routedReply = result.delivered || result.suppressed === true;
		}
	}
	const hookRunner = getGlobalHookRunner();
	if (hookRunner?.hasHooks("before_reset")) {
		const prevEntry = params.previousSessionEntry;
		const agentId = hookAgentId;
		const storePath = hookStorePath;
		const sessionFile = agentId && prevEntry?.sessionId && storePath ? formatSqliteSessionFileMarker({
			agentId,
			sessionId: prevEntry.sessionId,
			storePath
		}) : params.sessionKey;
		const messages = params.previousSessionResetMessages ?? await readBeforeResetMessages({
			agentId,
			sessionId: prevEntry?.sessionId,
			sessionKey: params.sessionKey,
			storePath
		});
		(async () => {
			try {
				await hookRunner.runBeforeReset({
					sessionFile,
					messages,
					reason: params.action
				}, {
					agentId,
					sessionKey: params.sessionKey,
					sessionId: prevEntry?.sessionId,
					workspaceDir: params.workspaceDir
				});
			} catch (err) {
				logVerbose(`before_reset hook failed: ${String(err)}`);
			}
		})();
	}
	return { routedReply };
}
//#endregion
export { readBeforeResetMessages as n, emitResetCommandHooks as t };
