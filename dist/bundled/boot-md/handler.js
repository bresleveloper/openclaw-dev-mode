import { c as resolveAgentWorkspaceDir, r as listAgentIds } from "../../run-with-concurrency-CtAWceEI.js";
import "../../paths-C6TxBCvO.js";
import { i as defaultRuntime, t as createSubsystemLogger } from "../../subsystem-BRgnv2j0.js";
import { B as resolveAgentIdFromSessionKey } from "../../workspace-buUezKOj.js";
import "../../logger-2lihXGmH.js";
import "../../model-selection-BZIe8XrY.js";
import "../../github-copilot-token-D13V9YBz.js";
import { a as isGatewayStartupEvent } from "../../legacy-names-UtW-25Fu.js";
import "../../thinking-CYbwaase.js";
import { n as SILENT_REPLY_TOKEN } from "../../tokens-ulWOhTB_.js";
import { a as agentCommand, o as createDefaultDeps } from "../../pi-embedded-CEYU90RG.js";
import "../../plugins-BgZ7DAV-.js";
import "../../accounts-9Ue6Ey7Z.js";
import "../../send-iSWTsdUJ.js";
import "../../send-CAt3t4uR.js";
import "../../deliver-ltHYj7Pv.js";
import "../../diagnostic-D07z2whA.js";
import "../../accounts-Bum0eyQo.js";
import "../../image-ops-op-qsoxH.js";
import "../../send-Bs3rOof-.js";
import "../../pi-model-discovery-D_3pstEY.js";
import { Dt as resolveMainSessionKey, J as updateSessionStore, Tt as resolveAgentMainSessionKey, W as loadSessionStore } from "../../pi-embedded-helpers-CV3nLUSx.js";
import "../../chrome-Dw3B81RP.js";
import "../../frontmatter-B1YIuX78.js";
import "../../skills-Bdr_L2zs.js";
import "../../path-alias-guards-nJ8fVkuc.js";
import "../../redact-DYOZyabt.js";
import "../../errors-DBMuZkJB.js";
import "../../fs-safe-BPM-Flk7.js";
import "../../proxy-env-K39PnzcQ.js";
import "../../store-CwxQOkRr.js";
import "../../accounts-D9zsfEWh.js";
import { s as resolveStorePath } from "../../paths-CJ8i-g5g.js";
import "../../tool-images-3Quq3DdN.js";
import "../../image-eBQJuTWs.js";
import "../../audio-transcription-runner-Bfc_scA8.js";
import "../../fetch-J4ZoMcHG.js";
import "../../fetch-guard-CE-pCX14.js";
import "../../api-key-rotation-Da_SQvJA.js";
import "../../proxy-fetch-DYLFpQUa.js";
import "../../ir-DUcagl5j.js";
import "../../render-DW7AcFdD.js";
import "../../target-errors-DhnDQIaI.js";
import "../../commands-registry-BfTBabXx.js";
import "../../skill-commands-1Y935SQO.js";
import "../../fetch-BfuG8uZ8.js";
import "../../channel-activity-CNOqOz3Y.js";
import "../../tables-BY6Jv-RU.js";
import "../../send--V1I2fZ-.js";
import "../../outbound-attachment-B8MD5v14.js";
import "../../send-elHaba-B.js";
import "../../proxy-CecQTx_Z.js";
import "../../manager-DrvhnOR3.js";
import "../../query-expansion-BK8EIY3r.js";
import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";

//#region src/gateway/boot.ts
function generateBootSessionId() {
	return `boot-${(/* @__PURE__ */ new Date()).toISOString().replace(/[:.]/g, "-").replace("T", "_").replace("Z", "")}-${crypto.randomUUID().slice(0, 8)}`;
}
const log$1 = createSubsystemLogger("gateway/boot");
const BOOT_FILENAME = "BOOT.md";
function buildBootPrompt(content) {
	return [
		"You are running a boot check. Follow BOOT.md instructions exactly.",
		"",
		"BOOT.md:",
		content,
		"",
		"If BOOT.md asks you to send a message, use the message tool (action=send with channel + target).",
		"Use the `target` field (not `to`) for message tool destinations.",
		`After sending with the message tool, reply with ONLY: ${SILENT_REPLY_TOKEN}.`,
		`If nothing needs attention, reply with ONLY: ${SILENT_REPLY_TOKEN}.`
	].join("\n");
}
async function loadBootFile(workspaceDir) {
	const bootPath = path.join(workspaceDir, BOOT_FILENAME);
	try {
		const trimmed = (await fs.readFile(bootPath, "utf-8")).trim();
		if (!trimmed) return { status: "empty" };
		return {
			status: "ok",
			content: trimmed
		};
	} catch (err) {
		if (err.code === "ENOENT") return { status: "missing" };
		throw err;
	}
}
function snapshotMainSessionMapping(params) {
	const agentId = resolveAgentIdFromSessionKey(params.sessionKey);
	const storePath = resolveStorePath(params.cfg.session?.store, { agentId });
	try {
		const entry = loadSessionStore(storePath, { skipCache: true })[params.sessionKey];
		if (!entry) return {
			storePath,
			sessionKey: params.sessionKey,
			canRestore: true,
			hadEntry: false
		};
		return {
			storePath,
			sessionKey: params.sessionKey,
			canRestore: true,
			hadEntry: true,
			entry: structuredClone(entry)
		};
	} catch (err) {
		log$1.debug("boot: could not snapshot main session mapping", {
			sessionKey: params.sessionKey,
			error: String(err)
		});
		return {
			storePath,
			sessionKey: params.sessionKey,
			canRestore: false,
			hadEntry: false
		};
	}
}
async function restoreMainSessionMapping(snapshot) {
	if (!snapshot.canRestore) return;
	try {
		await updateSessionStore(snapshot.storePath, (store) => {
			if (snapshot.hadEntry && snapshot.entry) {
				store[snapshot.sessionKey] = snapshot.entry;
				return;
			}
			delete store[snapshot.sessionKey];
		}, { activeSessionKey: snapshot.sessionKey });
		return;
	} catch (err) {
		return err instanceof Error ? err.message : String(err);
	}
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
		const message = err instanceof Error ? err.message : String(err);
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
	const sessionKey = params.agentId ? resolveAgentMainSessionKey({
		cfg: params.cfg,
		agentId: params.agentId
	}) : resolveMainSessionKey(params.cfg);
	const message = buildBootPrompt(result.content ?? "");
	const sessionId = generateBootSessionId();
	const mappingSnapshot = snapshotMainSessionMapping({
		cfg: params.cfg,
		sessionKey
	});
	let agentFailure;
	try {
		await agentCommand({
			message,
			sessionKey,
			sessionId,
			deliver: false,
			senderIsOwner: true
		}, bootRuntime, params.deps);
	} catch (err) {
		agentFailure = err instanceof Error ? err.message : String(err);
		log$1.error(`boot: agent run failed: ${agentFailure}`);
	}
	const mappingRestoreFailure = await restoreMainSessionMapping(mappingSnapshot);
	if (mappingRestoreFailure) log$1.error(`boot: failed to restore main session mapping: ${mappingRestoreFailure}`);
	if (!agentFailure && !mappingRestoreFailure) return { status: "ran" };
	return {
		status: "failed",
		reason: [agentFailure ? `agent run failed: ${agentFailure}` : void 0, mappingRestoreFailure ? `mapping restore failed: ${mappingRestoreFailure}` : void 0].filter((part) => Boolean(part)).join("; ")
	};
}

//#endregion
//#region src/hooks/bundled/boot-md/handler.ts
const log = createSubsystemLogger("hooks/boot-md");
const runBootChecklist = async (event) => {
	if (!isGatewayStartupEvent(event)) return;
	if (!event.context.cfg) return;
	const cfg = event.context.cfg;
	const deps = event.context.deps ?? createDefaultDeps();
	const agentIds = listAgentIds(cfg);
	for (const agentId of agentIds) {
		const workspaceDir = resolveAgentWorkspaceDir(cfg, agentId);
		const result = await runBootOnce({
			cfg,
			deps,
			workspaceDir,
			agentId
		});
		if (result.status === "failed") {
			log.warn("boot-md failed for agent startup run", {
				agentId,
				workspaceDir,
				reason: result.reason
			});
			continue;
		}
		if (result.status === "skipped") log.debug("boot-md skipped for agent startup run", {
			agentId,
			workspaceDir,
			reason: result.reason
		});
	}
};

//#endregion
export { runBootChecklist as default };