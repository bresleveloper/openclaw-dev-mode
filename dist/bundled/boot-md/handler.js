import { r as defaultRuntime } from "../../runtime-BC29JSZp.mjs";
import { O as listAgentIds, l as resolveAgentWorkspaceDir } from "../../agent-scope-config-IQKOEtZ4.mjs";
import { l as resolveAgentIdFromSessionKey } from "../../session-key-CBvmC8zz.mjs";
import { r as readRegularFile } from "../../regular-file-D4i0kJHS.mjs";
import { t as formatErrorMessage } from "../../errors-DnjwnOju.mjs";
import { t as createSubsystemLogger } from "../../subsystem-DleLyu58.mjs";
import { a as escapeInternalRuntimeContextDelimiters, i as OPENCLAW_RUNTIME_CONTEXT_NOTICE, n as INTERNAL_RUNTIME_CONTEXT_END, t as INTERNAL_RUNTIME_CONTEXT_BEGIN } from "../../internal-runtime-context-BH-o1oq1.mjs";
import { n as SILENT_REPLY_TOKEN } from "../../tokens-BTKQYTUd.mjs";
import { l as resolveSessionStorePathCore } from "../../paths-CcMbq5NY.mjs";
import "../../agent-scope-CTuYDtny.mjs";
import { a as resolveMainSessionKey, r as resolveAgentMainSessionKey } from "../../main-session-De-bcoks.mjs";
import "../../session-accessor-l-4ZHvKn.mjs";
import { v as applySessionEntryLifecycleMutation } from "../../session-accessor.reset-0gTJAhVB.mjs";
import { o as isGatewayStartupEvent } from "../../internal-hooks-B-eMkNRp.mjs";
import { i as setBootEchoContextForSession, r as clearBootEchoContextForSession } from "../../openclaw-tools-CDCtzDVi.mjs";
import { t as createDefaultDeps } from "../../deps-BNm1BD0Q.mjs";
import { i as agentCommandFromSystem } from "../../agent-command-BtmvKxGF.mjs";
import "../../agent-BTOp8IgJ.mjs";
import { t as runStartupTasks } from "../../startup-tasks-CW4c6ut8.mjs";
import path from "node:path";
import fs from "node:fs/promises";
import crypto from "node:crypto";
//#region src/gateway/boot.ts
function generateBootSessionId() {
	return `boot-${(/* @__PURE__ */ new Date()).toISOString().replace(/[:.]/g, "-").replace("T", "_").replace("Z", "")}-${crypto.randomUUID().slice(0, 8)}`;
}
const log$1 = createSubsystemLogger("gateway/boot");
const BOOT_FILENAME = "BOOT.md";
function buildBootPrompt(content) {
	const safeContent = escapeInternalRuntimeContextDelimiters(content);
	return [
		"You are running a boot check. Follow BOOT.md instructions exactly.",
		"",
		INTERNAL_RUNTIME_CONTEXT_BEGIN,
		OPENCLAW_RUNTIME_CONTEXT_NOTICE,
		"",
		"BOOT.md:",
		safeContent,
		INTERNAL_RUNTIME_CONTEXT_END,
		"",
		"If BOOT.md asks you to send a message, use the message tool (action=send with channel + target).",
		"Use the `target` field (not `to`) for message tool destinations.",
		`After sending with the message tool, reply with ONLY: ${SILENT_REPLY_TOKEN}.`,
		`If nothing needs attention, reply with ONLY: ${SILENT_REPLY_TOKEN}.`
	].join("\n");
}
const MAX_BOOT_FILE_BYTES = 16777216;
async function loadBootFile(workspaceDir) {
	const bootPath = path.join(workspaceDir, BOOT_FILENAME);
	let buffer;
	try {
		const resolvedPath = await fs.realpath(bootPath);
		({buffer} = await readRegularFile({
			filePath: resolvedPath,
			maxBytes: MAX_BOOT_FILE_BYTES
		}));
	} catch (err) {
		if (err.code === "ENOENT") return { status: "missing" };
		throw err;
	}
	const trimmed = buffer.toString("utf-8").trim();
	if (!trimmed) return { status: "empty" };
	return {
		status: "ok",
		content: trimmed
	};
}
async function runBootOnce(params) {
	const bootRuntime = {
		log: () => {},
		error: (message) => log$1.error(String(message)),
		exit: defaultRuntime.exit
	};
	let result;
	try {
		result = await loadBootFile(params.workspaceDir);
	} catch (err) {
		const message = formatErrorMessage(err);
		log$1.error(`boot: failed to read ${BOOT_FILENAME}: ${message}`);
		return {
			status: "failed",
			reason: message
		};
	}
	if (result.status === "missing" || result.status === "empty") return {
		status: "skipped",
		reason: result.status
	};
	const mainSessionKey = params.agentId ? resolveAgentMainSessionKey({
		cfg: params.cfg,
		agentId: params.agentId
	}) : resolveMainSessionKey(params.cfg);
	const message = buildBootPrompt(result.content ?? "");
	const sessionId = generateBootSessionId();
	const agentId = resolveAgentIdFromSessionKey(mainSessionKey);
	const sessionKey = `agent:${agentId}:boot:${sessionId}`;
	const storePath = resolveSessionStorePathCore(params.cfg.session?.store, { agentId });
	let ownedSessionId = sessionId;
	let agentFailure;
	let cleanupFailure;
	setBootEchoContextForSession(sessionKey, message);
	try {
		await agentCommandFromSystem({
			message,
			sessionKey,
			sessionId,
			deliver: false,
			suppressPromptPersistence: true,
			onSessionIdChanged: (nextSessionId) => {
				ownedSessionId = nextSessionId;
			}
		}, { boundary: "gateway.boot" }, bootRuntime, params.deps);
	} catch (err) {
		agentFailure = formatErrorMessage(err);
		log$1.error(`boot: agent run failed: ${agentFailure}`);
	} finally {
		clearBootEchoContextForSession(sessionKey);
		try {
			await applySessionEntryLifecycleMutation({
				agentId,
				storePath,
				removals: [{
					sessionKey,
					expectedSessionId: ownedSessionId,
					archiveRemovedTranscript: false
				}],
				skipMaintenance: true
			});
		} catch (err) {
			cleanupFailure = formatErrorMessage(err);
			log$1.error(`boot: failed to clean up session: ${cleanupFailure}`);
		}
	}
	if (!agentFailure && !cleanupFailure) return { status: "ran" };
	return {
		status: "failed",
		reason: [agentFailure ? `agent run failed: ${agentFailure}` : void 0, cleanupFailure ? `session cleanup failed: ${cleanupFailure}` : void 0].filter((part) => Boolean(part)).join("; ")
	};
}
//#endregion
//#region src/hooks/bundled/boot-md/handler.ts
const log = createSubsystemLogger("hooks/boot-md");
/** Gateway-startup hook that runs BOOT.md checks once per unique agent workspace. */
const runBootChecklist = async (event) => {
	if (!isGatewayStartupEvent(event)) return;
	if (!event.context.cfg) return;
	const cfg = event.context.cfg;
	const deps = event.context.deps ?? createDefaultDeps();
	const seenWorkspaces = /* @__PURE__ */ new Set();
	const tasks = listAgentIds(cfg).map((agentId) => {
		return {
			agentId,
			workspaceDir: resolveAgentWorkspaceDir(cfg, agentId)
		};
	}).filter(({ workspaceDir }) => {
		if (seenWorkspaces.has(workspaceDir)) return false;
		seenWorkspaces.add(workspaceDir);
		return true;
	}).map(({ agentId, workspaceDir }) => ({
		source: "boot-md",
		agentId,
		workspaceDir,
		run: () => runBootOnce({
			cfg,
			deps,
			workspaceDir,
			agentId
		})
	}));
	await runStartupTasks({
		tasks,
		log
	});
};
//#endregion
export { runBootChecklist as default };
