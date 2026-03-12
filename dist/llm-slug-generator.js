import { G as resolveAgentWorkspaceDir, H as resolveAgentEffectiveModelPrimary, K as resolveDefaultAgentId, V as resolveAgentDir } from "./paths-C-KFRgN3.js";
import "./paths-DkxwiA8g.js";
import { t as createSubsystemLogger } from "./subsystem-CZTbUHS8.js";
import "./workspace-Cd7X7wJE.js";
import "./logger-Bza9HxLB.js";
import { l as parseModelRef, sc as DEFAULT_PROVIDER } from "./model-selection-BpzcW6do.js";
import "./github-copilot-token-8N63GdbE.js";
import "./boolean-C7Ct_klp.js";
import "./proxy-env-D49LgOsT.js";
import "./frontmatter-DiMBhUTH.js";
import "./send-ox1I6pbQ.js";
import "./send-BzLKkzAn.js";
import { t as runEmbeddedPiAgent } from "./pi-embedded-MGT4N4z1.js";
import "./tokens-CTHUOebF.js";
import "./deliver-XDM__jFI.js";
import "./diagnostic-rZ0OYjSM.js";
import "./send-FnTPzcyV.js";
import "./pi-model-discovery-BGZQWV6P.js";
import "./image-DMxFPUco.js";
import "./audio-transcription-runner-CVOeTiYX.js";
import "./fetch-DaO4TUeC.js";
import "./fetch-guard-DYY4RUUK.js";
import "./api-key-rotation-CkUVZIcp.js";
import "./proxy-fetch-DezimVDd.js";
import "./ir-DfvJx2qw.js";
import "./render-IRnn-2gt.js";
import "./target-errors-pP0_s9tW.js";
import "./commands-registry-BMYqONAe.js";
import "./fetch-CBrh_wN0.js";
import "./skill-commands-DUFMe6HW.js";
import "./channel-activity-DeE_Fhy3.js";
import "./tables-DY0SjgF4.js";
import "./send-DjF720l22.js";
import "./outbound-attachment-ClexuZOC.js";
import "./send-D31u6Ow9.js";
import "./fetch-Db00d9ZI.js";
import "./query-expansion-Ccv3NIyX.js";
import "./manager-vAfn3tsP.js";
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
		const provider = parsed?.provider ?? "anthropic";
		const model = parsed?.model ?? "claude-opus-4-6";
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
