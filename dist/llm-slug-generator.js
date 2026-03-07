import { a as resolveAgentDir, c as resolveAgentWorkspaceDir, l as resolveDefaultAgentId, o as resolveAgentEffectiveModelPrimary } from "./run-with-concurrency-C4XHHPgL.js";
import "./paths-DkxwiA8g.js";
import { t as createSubsystemLogger } from "./subsystem-CJA8wzR-.js";
import "./workspace-CfdKlr4m.js";
import "./logger-BbAT83Qh.js";
import { Ar as DEFAULT_PROVIDER, l as parseModelRef } from "./model-selection-CjLMEx1O.js";
import "./github-copilot-token-8N63GdbE.js";
import "./legacy-names-DOSIC6ex.js";
import "./thinking-Da7Taxu9.js";
import "./tokens-CkJEWr2h.js";
import { t as runEmbeddedPiAgent } from "./pi-embedded-tyneix3i.js";
import "./accounts-DCQcJO-i.js";
import "./plugins-DOPwZyoX.js";
import "./send-qCGWC5rH.js";
import "./send-D6mRwtfl.js";
import "./deliver-sIcfvwX1.js";
import "./diagnostic-BmKI6wGN.js";
import "./accounts-DzbTLw_0.js";
import "./image-ops-BIl9UeOZ.js";
import "./send-CZfepO8S.js";
import "./pi-model-discovery-CU9XMLmy.js";
import "./pi-embedded-helpers-Dxu6LHG0.js";
import "./chrome-COZ7YCsN.js";
import "./frontmatter-BeGrEokt.js";
import "./skills-DNYmQKiw.js";
import "./path-alias-guards-DS7ydm_S.js";
import "./redact-42EdcDhY.js";
import "./errors-Dw6HjS62.js";
import "./fs-safe-CemWTMJt.js";
import "./proxy-env-B6RCnAA_.js";
import "./store-BQSQNPdy.js";
import "./accounts-pgrv1Qkh.js";
import "./paths-gKA8fewC.js";
import "./tool-images-Dg_vf6bo.js";
import "./image-CFUHso_v.js";
import "./audio-transcription-runner-D_nujbp8.js";
import "./fetch-BDmqlILw.js";
import "./fetch-guard-C6jQTGKD.js";
import "./api-key-rotation-CPMSw0JH.js";
import "./proxy-fetch-DByX8_eQ.js";
import "./ir-B7_edm9e.js";
import "./render-7C7EDC8_.js";
import "./target-errors-D3n0_J7n.js";
import "./commands-registry-uNn1I6-g.js";
import "./skill-commands-HlMtV9zX.js";
import "./fetch-CONQGbzL.js";
import "./channel-activity-7cAktR86.js";
import "./tables-CIrPlCAf.js";
import "./send-Dkoovwla.js";
import "./outbound-attachment-ui5dnDdq.js";
import "./send-BLyCK5gT.js";
import "./proxy-BzwL4n0W.js";
import "./manager-BNLg4e4F.js";
import "./query-expansion-5HLLPGvn.js";
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
