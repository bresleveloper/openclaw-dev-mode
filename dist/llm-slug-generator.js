import { a as resolveAgentDir, c as resolveAgentWorkspaceDir, l as resolveDefaultAgentId, o as resolveAgentEffectiveModelPrimary } from "./run-with-concurrency-CtAWceEI.js";
import "./paths-C6TxBCvO.js";
import { t as createSubsystemLogger } from "./subsystem-BRgnv2j0.js";
import "./workspace-buUezKOj.js";
import "./logger-2lihXGmH.js";
import { Sr as DEFAULT_PROVIDER, l as parseModelRef, xr as DEFAULT_MODEL } from "./model-selection-BZIe8XrY.js";
import "./github-copilot-token-D13V9YBz.js";
import "./legacy-names-UtW-25Fu.js";
import "./thinking-CYbwaase.js";
import "./tokens-ulWOhTB_.js";
import { t as runEmbeddedPiAgent } from "./pi-embedded-CEYU90RG.js";
import "./plugins-BgZ7DAV-.js";
import "./accounts-9Ue6Ey7Z.js";
import "./send-iSWTsdUJ.js";
import "./send-CAt3t4uR.js";
import "./deliver-ltHYj7Pv.js";
import "./diagnostic-D07z2whA.js";
import "./accounts-Bum0eyQo.js";
import "./image-ops-op-qsoxH.js";
import "./send-Bs3rOof-.js";
import "./pi-model-discovery-D_3pstEY.js";
import "./pi-embedded-helpers-CV3nLUSx.js";
import "./chrome-Dw3B81RP.js";
import "./frontmatter-B1YIuX78.js";
import "./skills-Bdr_L2zs.js";
import "./path-alias-guards-nJ8fVkuc.js";
import "./redact-DYOZyabt.js";
import "./errors-DBMuZkJB.js";
import "./fs-safe-BPM-Flk7.js";
import "./proxy-env-K39PnzcQ.js";
import "./store-CwxQOkRr.js";
import "./accounts-D9zsfEWh.js";
import "./paths-CJ8i-g5g.js";
import "./tool-images-3Quq3DdN.js";
import "./image-eBQJuTWs.js";
import "./audio-transcription-runner-Bfc_scA8.js";
import "./fetch-J4ZoMcHG.js";
import "./fetch-guard-CE-pCX14.js";
import "./api-key-rotation-Da_SQvJA.js";
import "./proxy-fetch-DYLFpQUa.js";
import "./ir-DUcagl5j.js";
import "./render-DW7AcFdD.js";
import "./target-errors-DhnDQIaI.js";
import "./commands-registry-BfTBabXx.js";
import "./skill-commands-1Y935SQO.js";
import "./fetch-BfuG8uZ8.js";
import "./channel-activity-CNOqOz3Y.js";
import "./tables-BY6Jv-RU.js";
import "./send--V1I2fZ-.js";
import "./outbound-attachment-B8MD5v14.js";
import "./send-elHaba-B.js";
import "./proxy-CecQTx_Z.js";
import "./manager-DrvhnOR3.js";
import "./query-expansion-BK8EIY3r.js";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";

//#region src/hooks/llm-slug-generator.ts
/**
* LLM-based slug generator for session memory filenames
*/
const log = createSubsystemLogger("llm-slug-generator");
/**
* Generate a short 1-2 word filename slug from session content using LLM
*/
async function generateSlugViaLLM(params) {
	let tempSessionFile = null;
	try {
		const agentId = resolveDefaultAgentId(params.cfg);
		const workspaceDir = resolveAgentWorkspaceDir(params.cfg, agentId);
		const agentDir = resolveAgentDir(params.cfg, agentId);
		const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "openclaw-slug-"));
		tempSessionFile = path.join(tempDir, "session.jsonl");
		const prompt = `Based on this conversation, generate a short 1-2 word filename slug (lowercase, hyphen-separated, no file extension).

Conversation summary:
${params.sessionContent.slice(0, 2e3)}

Reply with ONLY the slug, nothing else. Examples: "vendor-pitch", "api-design", "bug-fix"`;
		const modelRef = resolveAgentEffectiveModelPrimary(params.cfg, agentId);
		const parsed = modelRef ? parseModelRef(modelRef, DEFAULT_PROVIDER) : null;
		const provider = parsed?.provider ?? DEFAULT_PROVIDER;
		const model = parsed?.model ?? DEFAULT_MODEL;
		const result = await runEmbeddedPiAgent({
			sessionId: `slug-generator-${Date.now()}`,
			sessionKey: "temp:slug-generator",
			agentId,
			sessionFile: tempSessionFile,
			workspaceDir,
			agentDir,
			config: params.cfg,
			prompt,
			provider,
			model,
			timeoutMs: 15e3,
			runId: `slug-gen-${Date.now()}`
		});
		if (result.payloads && result.payloads.length > 0) {
			const text = result.payloads[0]?.text;
			if (text) return text.trim().toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "").slice(0, 30) || null;
		}
		return null;
	} catch (err) {
		const message = err instanceof Error ? err.stack ?? err.message : String(err);
		log.error(`Failed to generate slug: ${message}`);
		return null;
	} finally {
		if (tempSessionFile) try {
			await fs.rm(path.dirname(tempSessionFile), {
				recursive: true,
				force: true
			});
		} catch {}
	}
}

//#endregion
export { generateSlugViaLLM };