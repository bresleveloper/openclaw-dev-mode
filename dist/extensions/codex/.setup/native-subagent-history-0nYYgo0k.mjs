import { C as readCodexNativeSubagentHistoryOwner, b as codexNativeSubagentHistoryConnectionFingerprint, m as sessionBindingIdentity } from "./session-binding-record-BGoz8wOK.mjs";
import { t as readCodexThreadHistoryPage } from "./thread-history-page-DoVpnHim.mjs";
import { l as itemStatus } from "./event-projector-items-C6L_5ZiT.mjs";
import { r as readMirrorIdentity } from "./upstream-prompt-provenance-LphB8slG.mjs";
import { r as projectCodexThreadHistoryItem } from "./transcript-history-projection-ZZpkFkJ_.mjs";
import { n as buildCodexAppServerRuntimeFingerprint, t as buildCodexAppServerConnectionFingerprint } from "./plugin-app-cache-key-B2CsSdnV.mjs";
import { i as resolveCodexBindingAppServerConnection } from "./binding-connection-ThoatDcb.mjs";
import { c as getLeasedSharedCodexAppServerClient, h as releaseLeasedSharedCodexAppServerClient } from "./shared-client-DA4VR4Eb.mjs";
import { a as readCodexNativeSubagentRunId, f as itemToolArgs, g as projectCodexToolActivity, h as itemTranscriptResultText } from "./native-subagent-task-ids-wb8CKZGN.mjs";
import { resolveAgentDir } from "openclaw/plugin-sdk/agent-runtime";
import { getSessionEntry, resolveStorePath } from "openclaw/plugin-sdk/session-store-runtime";
//#region extensions/codex/src/app-server/native-subagent-history.ts
const MAX_SUBAGENT_ANCESTRY_READS = 32;
const taskHistoryToolItems = {
	itemToolArgs,
	itemTranscriptResultText
};
function parentThreadId(thread) {
	const source = thread.source;
	const spawn = source && typeof source === "object" && "subAgent" in source && typeof source.subAgent === "object" && "thread_spawn" in source.subAgent ? source.subAgent.thread_spawn : void 0;
	return thread.parentThreadId?.trim() ?? spawn?.parent_thread_id.trim();
}
/** Resolves history from the parent binding's native store without adopting the child. */
async function readCodexNativeSubagentHistory(params, options) {
	params.assertCurrent();
	const { task, cfg } = params;
	const sessionKey = task.requesterSessionKey;
	const agentId = task.agentId;
	const threadId = readCodexNativeSubagentRunId(task.runId)?.threadId;
	if (task.taskKind !== "codex-native" || !sessionKey || !agentId || !threadId) throw new Error("Subagent transcript owner is unavailable.");
	const storePath = resolveStorePath(cfg.session?.store, { agentId });
	const readSession = () => getSessionEntry({
		agentId,
		sessionKey,
		storePath,
		hydrateSkillPromptRefs: false,
		readConsistency: "latest"
	});
	const session = readSession();
	if (!session?.sessionId) throw new Error("Subagent parent session is unavailable.");
	const sessionId = session.sessionId;
	const lifecycleRevision = session.lifecycleRevision;
	const historyOwner = readCodexNativeSubagentHistoryOwner(task.detail);
	if (historyOwner && (historyOwner.lifecycleRevision ? historyOwner.lifecycleRevision !== lifecycleRevision : historyOwner.sessionId !== sessionId)) throw new Error("Subagent history owner changed; reconnect its parent session.");
	const identity = sessionBindingIdentity({
		agentId,
		sessionId,
		sessionKey,
		config: cfg
	});
	const binding = options.bindingStore.read(identity);
	if (!binding || binding.pendingSupervisionBranch) throw new Error("Subagent parent thread is unavailable.");
	if (historyOwner && historyOwner.connectionFingerprint !== codexNativeSubagentHistoryConnectionFingerprint(binding)) throw new Error("Subagent history owner changed; reconnect its parent session.");
	const historyParentThreadId = historyOwner?.parentThreadId ?? binding.threadId;
	const assertCurrent = () => {
		params.assertCurrent();
		const currentSession = readSession();
		const current = options.bindingStore.read(identity);
		if (currentSession?.sessionId !== sessionId || currentSession?.lifecycleRevision !== lifecycleRevision || current?.threadId !== binding.threadId || current?.appServerRuntimeFingerprint !== binding.appServerRuntimeFingerprint || current?.connectionScope !== binding.connectionScope || current?.authProfileId !== binding.authProfileId) throw new Error("Subagent parent changed; refresh its transcript.");
	};
	const agentDir = resolveAgentDir(cfg, agentId);
	const connection = await resolveCodexBindingAppServerConnection({
		binding,
		pluginConfig: options.pluginConfig,
		agentDir,
		config: cfg,
		assertCurrent,
		authProfileId: binding.authProfileId
	});
	const client = await getLeasedSharedCodexAppServerClient({
		startOptions: connection.appServer.start,
		timeoutMs: connection.appServer.requestTimeoutMs,
		authProfileId: connection.clientAuthProfileId,
		agentDir,
		config: cfg,
		assertCurrent
	});
	try {
		assertCurrent();
		const fingerprint = binding.connectionScope === "supervision" ? buildCodexAppServerConnectionFingerprint(connection.appServer, agentDir) : buildCodexAppServerRuntimeFingerprint({
			appServer: connection.appServer,
			appServerVersion: client.getServerVersion(),
			runtimeIdentity: client.getRuntimeIdentity()
		});
		if (!binding.appServerRuntimeFingerprint || fingerprint !== binding.appServerRuntimeFingerprint) throw new Error("Subagent connection changed; reconnect its parent session.");
		const read = async (method, request) => {
			assertCurrent();
			const result = await client.request(method, request, { assertCurrent });
			assertCurrent();
			return result;
		};
		const { thread } = await read("thread/read", {
			threadId,
			includeTurns: false
		});
		if (thread.id !== threadId || threadId === historyParentThreadId) throw new Error("Subagent transcript does not belong to this parent session.");
		const visited = /* @__PURE__ */ new Set([threadId]);
		let ancestor = thread;
		for (;;) {
			const parentId = parentThreadId(ancestor);
			if (parentId === historyParentThreadId) break;
			if (!parentId || visited.has(parentId) || visited.size >= MAX_SUBAGENT_ANCESTRY_READS) throw new Error("Subagent transcript does not belong to this parent session.");
			visited.add(parentId);
			const response = await read("thread/read", {
				threadId: parentId,
				includeTurns: false
			});
			if (response.thread.id !== parentId) throw new Error("Subagent transcript does not belong to this parent session.");
			ancestor = response.thread;
		}
		const page = await readCodexThreadHistoryPage({
			listItemPage: (request) => read("thread/items/list", request),
			listTurnPage: (request) => read("thread/turns/list", request)
		}, thread, {
			threadId,
			cursor: params.cursor,
			limit: Math.max(1, Math.floor(Math.min(params.limit, 200) / 2))
		}, {
			project: (entries) => entries.map((entry) => {
				const item = projectCodexToolActivity(entry.item, itemStatus(entry.item) === "running" ? "start" : "result");
				const messages = projectCodexThreadHistoryItem(thread, entry, taskHistoryToolItems).map((message) => {
					const messageIdentity = readMirrorIdentity(message);
					if (!messageIdentity) throw new Error("Subagent history message is missing its native identity.");
					return Object.assign(message, { messageId: JSON.stringify([threadId, messageIdentity]) });
				});
				return {
					messages,
					activity: item ? messages.map(({ messageId }) => ({
						messageId,
						items: item.hideFromChannelProgress ? [] : [item]
					})) : []
				};
			}),
			fits: (result) => Buffer.byteLength(JSON.stringify(result), "utf8") <= 524288
		});
		assertCurrent();
		const rows = page.items.toReversed();
		return {
			messages: rows.flatMap((row) => row.messages),
			activity: rows.flatMap((row) => row.activity),
			...page.nextCursor ? { nextCursor: page.nextCursor } : {}
		};
	} finally {
		releaseLeasedSharedCodexAppServerClient(client);
	}
}
//#endregion
export { readCodexNativeSubagentHistory };
