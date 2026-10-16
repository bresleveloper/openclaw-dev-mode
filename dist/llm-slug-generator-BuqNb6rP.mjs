import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { D as extractLeadingHttpStatus, I as parseApiErrorPayload } from "./redact-DJ8j6ADa.mjs";
import { t as createSubsystemLogger } from "./subsystem-I-uqdx4f.mjs";
import { a as resolveAgentDir, d as resolveAgentWorkspaceDir } from "./agent-scope-config-CDYpzA0r.mjs";
import "./agent-scope-CG17uXFn.mjs";
import { d as prepareSystemAgentRunAdmission } from "./admitted-run-context-QJnFIxUZ.mjs";
import { n as resolveAgentTimeoutMs } from "./timeout-Q2p-0uCf.mjs";
import { t as SessionManager } from "./session-manager-B2n0aSnK.mjs";
import "./sessions-DVbpm5GD.mjs";
import { t as runEmbeddedAgent } from "./embedded-agent-B_DdyEe2.mjs";
import { randomUUID } from "node:crypto";
//#region src/hooks/llm-slug-generator.ts
const log = createSubsystemLogger("llm-slug-generator");
const DEFAULT_SLUG_GENERATOR_TIMEOUT_MS = 15e3;
const PROVIDER_ERROR_PREFIX_RE = /^(?:provider\s+)?(?:api|llm|model|openai|anthropic|codex|gateway)\s+(?:request\s+)?(?:error|failed|failure)\b/i;
const PROVIDER_ERROR_DETAIL_RE = /\b(?:insufficient[_ -]?quota|quota (?:exceeded|exhausted)|exceeded your current quota|payment required|insufficient credits|credit balance|insufficient[_ -]?(?:balance|funds)|rate[_ -]?limit(?:ed)?|too many requests|invalid[_ -]?api[_ -]?key|incorrect api key|authentication failed|oauth token refresh failed|missing (?:token|projectid|credentials)|google cloud credentials|re-?authenticate|unauthorized|forbidden|permission_error|billing hard limit|spend(?:ing)? limit)\b/i;
function resolveSlugGeneratorTimeoutMs(cfg) {
	const configuredTimeoutSeconds = cfg.agents?.defaults?.timeoutSeconds;
	if (typeof configuredTimeoutSeconds !== "number" || !Number.isFinite(configuredTimeoutSeconds)) return DEFAULT_SLUG_GENERATOR_TIMEOUT_MS;
	return resolveAgentTimeoutMs({ cfg });
}
function isErrorSlugPayload(payload) {
	if (!payload) return false;
	if (payload.isError === true) return true;
	const text = payload.text?.trim();
	if (!text) return false;
	if (parseApiErrorPayload(text)) return true;
	const leadingStatus = extractLeadingHttpStatus(text);
	if (leadingStatus) {
		if ([
			401,
			402,
			403,
			429
		].includes(leadingStatus.code)) return true;
		if (leadingStatus.code === 400 && (parseApiErrorPayload(leadingStatus.rest) || PROVIDER_ERROR_PREFIX_RE.test(leadingStatus.rest) || PROVIDER_ERROR_DETAIL_RE.test(leadingStatus.rest))) return true;
	}
	return PROVIDER_ERROR_PREFIX_RE.test(text) || PROVIDER_ERROR_DETAIL_RE.test(text);
}
async function generateSlugViaLLM(params) {
	try {
		const agentId = params.agentId;
		const workspaceDir = resolveAgentWorkspaceDir(params.cfg, agentId);
		const agentDir = resolveAgentDir(params.cfg, agentId);
		const sessionId = `slug-generator-${randomUUID()}`;
		const sessionKey = `agent:${agentId}:helper:incognito-${sessionId}`;
		const prompt = `Based on this conversation, generate a short 1-2 word filename slug (lowercase, hyphen-separated, no file extension).

Conversation summary:
${truncateUtf16Safe(params.sessionContent, 2e3)}

Reply with ONLY the slug, nothing else. Examples: "vendor-pitch", "api-design", "bug-fix"`;
		const timeoutMs = resolveSlugGeneratorTimeoutMs(params.cfg);
		const runId = `slug-gen-${Date.now()}`;
		const preparedRunAdmission = prepareSystemAgentRunAdmission(params.cfg, runId, agentId, "hooks.slug-generator");
		try {
			const payload = (await runEmbeddedAgent({
				preparedRunAdmission,
				sessionId,
				sessionKey,
				sessionManager: SessionManager.inMemory(workspaceDir),
				agentId,
				workspaceDir,
				agentDir,
				config: params.cfg,
				prompt,
				model: params.model,
				timeoutMs,
				runId,
				disableTools: true,
				toolsAllow: [],
				disableTrajectory: true,
				cleanupBundleMcpOnRunEnd: true,
				authProfileFailurePolicy: "local"
			})).payloads?.[0];
			const text = payload?.text;
			if (!text || isErrorSlugPayload(payload)) return null;
			return normalizeLowercaseStringOrEmpty(text).replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-").replace(/^-+|-+$/g, "").slice(0, 30).replace(/^-+|-+$/g, "") || null;
		} finally {
			preparedRunAdmission.close();
		}
	} catch (err) {
		const message = err instanceof Error ? err.stack ?? err.message : String(err);
		log.error(`Failed to generate slug: ${message}`);
		return null;
	}
}
//#endregion
export { generateSlugViaLLM as t };
