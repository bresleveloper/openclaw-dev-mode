import { t as createSubsystemLogger } from "./subsystem-yNfG7O3v.js";
import { t as resolveSkillWorkshopConfig } from "./config-XlfFMqhc.js";
import { m as normalizeSkillIndexName } from "./workspace-CD16JXyF.js";
import { a as proposeUpdateSkill, f as resolveSkillProposalTarget, i as proposeCreateSkill, p as readWorkspaceSkillFile, r as listSkillProposals } from "./service-DCXLp0ol.js";
//#region src/skills/research/text.ts
const TEXT_BLOCK_TYPES = new Set([
	"text",
	"input_text",
	"output_text"
]);
function readTextValue(value) {
	if (typeof value === "string") return value;
	if (value && typeof value === "object" && typeof value.value === "string") return value.value;
	return "";
}
function extractTextBlock(block) {
	if (!block || typeof block !== "object") return "";
	const type = block.type;
	if (typeof type !== "string" || !TEXT_BLOCK_TYPES.has(type)) return "";
	return readTextValue(block.text);
}
function extractMessageText(content) {
	if (typeof content === "string") return content;
	if (Array.isArray(content)) return content.map(extractTextBlock).filter(Boolean).join("\n");
	return extractTextBlock(content);
}
/** Extracts role/text pairs from mixed transcript message shapes. */
function extractTranscriptText(messages) {
	const result = [];
	for (const message of messages) {
		if (!message || typeof message !== "object") continue;
		const role = message.role;
		const content = message.content;
		if (typeof role !== "string") continue;
		const text = extractMessageText(content).trim();
		if (text) result.push({
			role,
			text
		});
	}
	return result;
}
function compactWhitespace(value) {
	return value.replace(/\s+/g, " ").trim();
}
//#endregion
//#region src/skills/research/signals.ts
const CORRECTION_PATTERNS = [
	/\bnext time\b/i,
	/\bfrom now on\b/i,
	/\bremember to\b/i,
	/\bmake sure to\b/i,
	/\balways\b.{0,80}\b(use|check|verify|record|save|prefer)\b/i,
	/\bprefer\b.{0,120}\b(when|for|instead|use)\b/i,
	/\bwhen asked\b/i
];
function inferTopic(text) {
	const lower = text.toLowerCase();
	if (/\banimated\b|\bgifs?\b/.test(lower)) return {
		skillName: "animated-gif-workflow",
		title: "Animated GIF Workflow",
		label: "animated GIF requests"
	};
	if (/\bscreenshot|screen capture|imageoptim|asset\b/.test(lower)) return {
		skillName: "screenshot-asset-workflow",
		title: "Screenshot Asset Workflow",
		label: "screenshot asset updates"
	};
	if (/\bqa\b|\bscenario\b|\btest plan\b/.test(lower)) return {
		skillName: "qa-scenario-workflow",
		title: "QA Scenario Workflow",
		label: "QA tasks"
	};
	if (/\bpr\b|\bpull request\b|\bgithub\b/.test(lower)) return {
		skillName: "github-pr-workflow",
		title: "GitHub PR Workflow",
		label: "GitHub PR work"
	};
	return {
		skillName: "learned-workflows",
		title: "Learned Workflows",
		label: "repeatable tasks"
	};
}
function extractInstruction(text) {
	const trimmed = compactWhitespace(text);
	if (trimmed.length < 24 || trimmed.length > 1200) return;
	if (!CORRECTION_PATTERNS.some((pattern) => pattern.test(trimmed))) return;
	return trimmed.replace(/^ok[,. ]+/i, "");
}
/** Extracts a candidate durable instruction from transcript text. */
function extractDurableInstructionProposal(params) {
	const instruction = extractTranscriptText(params.messages).filter((entry) => entry.role === "user").map((entry) => entry.text).map(extractInstruction).findLast(Boolean);
	if (!instruction) return;
	const topic = inferTopic(instruction);
	const skillName = normalizeSkillIndexName(topic.skillName);
	if (!skillName) return;
	return {
		skillName,
		description: `Reusable workflow notes for ${topic.label}.`,
		goal: `Capture durable user correction for ${topic.label}.`,
		evidence: instruction,
		content: [
			`# ${topic.title}`,
			"",
			"## Workflow",
			"",
			`- ${instruction}`,
			"- Verify the result before final reply.",
			"- Record durable pitfalls as short bullets; avoid copying transcript noise."
		].join("\n")
	};
}
//#endregion
//#region src/skills/research/autocapture.ts
const log = createSubsystemLogger("skills/research");
const AUTO_CAPTURE_BLOCKED_TRIGGERS = new Set([
	"cron",
	"heartbeat",
	"memory",
	"overflow"
]);
const AUTO_CAPTURE_BLOCKED_SESSION_SEGMENTS = new Set([
	"cron",
	"hook",
	"subagent"
]);
function buildAutoCaptureUpdateContent(existingSkill, capturedContent) {
	return [
		existingSkill.trimEnd(),
		"",
		"## Captured Update",
		"",
		capturedContent.trim(),
		""
	].join("\n");
}
function isSkillResearchAutoCaptureEligible(ctx) {
	const trigger = ctx.trigger?.trim().toLowerCase();
	if (trigger && AUTO_CAPTURE_BLOCKED_TRIGGERS.has(trigger)) return false;
	const sessionKey = ctx.sessionKey?.trim().toLowerCase();
	if (!sessionKey) return true;
	if (sessionKey.includes("active-memory")) return false;
	return !sessionKey.split(":").some((segment) => AUTO_CAPTURE_BLOCKED_SESSION_SEGMENTS.has(segment));
}
/** Captures durable skill research signals from a session transcript when enabled. */
async function runSkillResearchAutoCapture(params) {
	if (!resolveSkillWorkshopConfig(params.config).autonomous.enabled) return;
	if (params.event.success === false) return;
	const workspaceDir = params.ctx.workspaceDir;
	if (!workspaceDir) return;
	if (!isSkillResearchAutoCaptureEligible(params.ctx)) return;
	const proposal = extractDurableInstructionProposal({ messages: params.event.messages });
	if (!proposal) return;
	if ((await listSkillProposals({ workspaceDir })).proposals.some((entry) => (entry.status === "pending" || entry.status === "quarantined") && entry.skillKey === proposal.skillName)) return;
	try {
		const existingSkill = await readWorkspaceSkillFile(resolveSkillProposalTarget({
			workspaceDir,
			skillName: proposal.skillName
		}).skillFile);
		const result = existingSkill === null ? await proposeCreateSkill({
			workspaceDir,
			config: params.config,
			name: proposal.skillName,
			description: proposal.description,
			content: proposal.content,
			createdBy: "skill-workshop",
			goal: proposal.goal,
			evidence: proposal.evidence
		}) : await proposeUpdateSkill({
			workspaceDir,
			config: params.config,
			agentId: params.ctx.agentId,
			skillName: proposal.skillName,
			description: proposal.description,
			content: buildAutoCaptureUpdateContent(existingSkill, proposal.content),
			createdBy: "skill-workshop",
			goal: proposal.goal,
			evidence: proposal.evidence
		});
		log.info(`skill research auto-capture queued workshop proposal ${result.record.target.skillKey}`);
	} catch (error) {
		log.warn(`skill research auto-capture skipped: ${String(error)}`);
	}
}
//#endregion
export { runSkillResearchAutoCapture };
