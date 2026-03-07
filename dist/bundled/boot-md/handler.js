import { c as resolveAgentWorkspaceDir, r as listAgentIds } from "../../run-with-concurrency-C4XHHPgL.js";
import "../../paths-DkxwiA8g.js";
import { i as defaultRuntime, t as createSubsystemLogger } from "../../subsystem-CJA8wzR-.js";
import { B as resolveAgentIdFromSessionKey } from "../../workspace-CfdKlr4m.js";
import "../../logger-BbAT83Qh.js";
import "../../model-selection-CjLMEx1O.js";
import "../../github-copilot-token-8N63GdbE.js";
import { a as isGatewayStartupEvent } from "../../legacy-names-DOSIC6ex.js";
import "../../thinking-Da7Taxu9.js";
import { n as SILENT_REPLY_TOKEN } from "../../tokens-CkJEWr2h.js";
import { o as agentCommand, s as createDefaultDeps } from "../../pi-embedded-tyneix3i.js";
import "../../accounts-DCQcJO-i.js";
import "../../plugins-DOPwZyoX.js";
import "../../send-qCGWC5rH.js";
import "../../send-D6mRwtfl.js";
import "../../deliver-sIcfvwX1.js";
import "../../diagnostic-BmKI6wGN.js";
import "../../accounts-DzbTLw_0.js";
import "../../image-ops-BIl9UeOZ.js";
import "../../send-CZfepO8S.js";
import "../../pi-model-discovery-CU9XMLmy.js";
import { Et as resolveAgentMainSessionKey, Ot as resolveMainSessionKey, W as loadSessionStore, Y as updateSessionStore } from "../../pi-embedded-helpers-Dxu6LHG0.js";
import "../../chrome-COZ7YCsN.js";
import "../../frontmatter-BeGrEokt.js";
import "../../skills-DNYmQKiw.js";
import "../../path-alias-guards-DS7ydm_S.js";
import "../../redact-42EdcDhY.js";
import "../../errors-Dw6HjS62.js";
import "../../fs-safe-CemWTMJt.js";
import "../../proxy-env-B6RCnAA_.js";
import "../../store-BQSQNPdy.js";
import "../../accounts-pgrv1Qkh.js";
import { s as resolveStorePath } from "../../paths-gKA8fewC.js";
import "../../tool-images-Dg_vf6bo.js";
import "../../image-CFUHso_v.js";
import "../../audio-transcription-runner-D_nujbp8.js";
import "../../fetch-BDmqlILw.js";
import "../../fetch-guard-C6jQTGKD.js";
import "../../api-key-rotation-CPMSw0JH.js";
import "../../proxy-fetch-DByX8_eQ.js";
import "../../ir-B7_edm9e.js";
import "../../render-7C7EDC8_.js";
import "../../target-errors-D3n0_J7n.js";
import "../../commands-registry-uNn1I6-g.js";
import "../../skill-commands-HlMtV9zX.js";
import "../../fetch-CONQGbzL.js";
import "../../channel-activity-7cAktR86.js";
import "../../tables-CIrPlCAf.js";
import "../../send-Dkoovwla.js";
import "../../outbound-attachment-ui5dnDdq.js";
import "../../send-BLyCK5gT.js";
import "../../proxy-BzwL4n0W.js";
import "../../manager-BNLg4e4F.js";
import "../../query-expansion-5HLLPGvn.js";
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
