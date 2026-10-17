import { r as defaultRuntime } from "../../runtime-DlO3PTAd.mjs";
import { t as formatErrorMessage } from "../../errors-O33D01XW.mjs";
import { t as createSubsystemLogger } from "../../subsystem-I-uqdx4f.mjs";
import { d as resolveAgentWorkspaceDir } from "../../agent-scope-config-CDYpzA0r.mjs";
import { l as resolveAgentIdFromSessionKey } from "../../session-key-C09ow4h0.mjs";
import { i as listAgentIds } from "../../agent-roster-BXD1uMJD.mjs";
import { l as resolveSessionStorePathCore } from "../../paths-dpReqUI8.mjs";
import "../../agent-scope-CG17uXFn.mjs";
import { t as dedupeByKey } from "../../dedupe-by-key-DnqEVrst.mjs";
import { s as escapeInternalRuntimeContextDelimiters } from "../../internal-runtime-context-CAWYwg4i.mjs";
import { r as SILENT_REPLY_TOKEN } from "../../tokens-D4ghQG_g.mjs";
import { a as resolveMainSessionKey, r as resolveAgentMainSessionKey } from "../../main-session-00MgEWj5.mjs";
import "../../session-accessor-CQ-g9yb2.mjs";
import { g as applySessionEntryLifecycleMutation } from "../../session-accessor.reset-Bn2-AwEV.mjs";
import { o as isGatewayStartupEvent } from "../../internal-hooks-HjIVcJaQ.mjs";
import { a as clearBootEchoContextForSession, o as setBootEchoContextForSession } from "../../openclaw-tools-D_lVJ00z.mjs";
import { t as createDefaultDeps } from "../../deps-CZ9MeDGs.mjs";
import { i as agentCommandFromSystem } from "../../agent-command-CgCo7NDi.mjs";
import "../../agent-BbK9nXoN.mjs";
import { t as runStartupTasks } from "../../startup-tasks-CIgrOHNf.mjs";
import path from "node:path";
import fs from "node:fs/promises";
import crypto from "node:crypto";
import { readRegularFile } from "@openclaw/fs-safe/advanced";
//#region src/gateway/boot.ts
function generateBootSessionId() {
	return `boot-${(/* @__PURE__ */ new Date()).toISOString().replace(/[:.]/g, "-").replace("T", "_").replace("Z", "")}-${crypto.randomUUID().slice(0, 8)}`;
}
const log$1 = createSubsystemLogger("gateway/boot");
const BOOT_FILENAME = "BOOT.md";
function buildBootPrompt(content) {
	const runtimeContextFragments = [
		{
			kind: "runtime-instruction",
			text: "You are running a boot check. Follow BOOT.md instructions exactly."
		},
		{
			kind: "runtime-instruction",
			text: `BOOT.md:\n${escapeInternalRuntimeContextDelimiters(content)}`
		},
		{
			kind: "runtime-instruction",
			text: [
				"If BOOT.md asks you to send a message, use the message tool (action=send with channel + target).",
				"Use the `target` field (not `to`) for message tool destinations.",
				`After sending with the message tool, reply with ONLY: ${SILENT_REPLY_TOKEN}.`,
				`If nothing needs attention, reply with ONLY: ${SILENT_REPLY_TOKEN}.`
			].join("\n")
		}
	];
	return {
		message: "Run the workspace boot check now.",
		runtimeContextFragments,
		echoContext: runtimeContextFragments.map((fragment) => fragment.text).join("\n\n")
	};
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
	const content = buffer.toString("utf-8").trim();
	return content ? {
		status: "ok",
		content
	} : { status: "empty" };
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
	if (result.status !== "ok") return {
		status: "skipped",
		reason: result.status
	};
	const mainSessionKey = params.agentId ? resolveAgentMainSessionKey({
		cfg: params.cfg,
		agentId: params.agentId
	}) : resolveMainSessionKey(params.cfg);
	const bootPrompt = buildBootPrompt(result.content);
	const sessionId = generateBootSessionId();
	const agentId = resolveAgentIdFromSessionKey(mainSessionKey);
	const sessionKey = `agent:${agentId}:boot:${sessionId}`;
	const storePath = resolveSessionStorePathCore(params.cfg.session?.store, { agentId });
	let ownedSessionId = sessionId;
	let agentFailure;
	let cleanupFailure;
	setBootEchoContextForSession(sessionKey, bootPrompt.echoContext);
	try {
		await agentCommandFromSystem({
			message: bootPrompt.message,
			runtimeContextFragments: bootPrompt.runtimeContextFragments,
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
	const tasks = dedupeByKey(listAgentIds(cfg).map((agentId) => {
		return {
			agentId,
			workspaceDir: resolveAgentWorkspaceDir(cfg, agentId)
		};
	}), ({ workspaceDir }) => workspaceDir).map(({ agentId, workspaceDir }) => ({
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
