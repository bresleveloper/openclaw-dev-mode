import { asOptionalRecord, normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
import { truncateUtf16Safe } from "openclaw/plugin-sdk/text-utility-runtime";
import { root } from "openclaw/plugin-sdk/security-runtime";
import { resolveAgentIdentity, resolveAgentWorkspaceDir } from "openclaw/plugin-sdk/agent-runtime";
//#region extensions/voice-call/src/realtime-agent-context.legacy.ts
function limitLegacyContextText(text, maxChars) {
	if (text.length <= maxChars) return text;
	const truncated = `${truncateUtf16Safe(text, Math.max(0, maxChars - 32)).trimEnd()}\n[truncated]`;
	return truncateUtf16Safe(truncated, maxChars);
}
async function buildLegacyRealtimeVoiceAgentContext(params) {
	const { config, coreConfig, agentId } = params;
	if (!config.enabled) return;
	const capsule = [
		"OpenClaw agent voice context:",
		`- Agent id: ${agentId}`,
		"- Use this context to match the OpenClaw agent's personality and standing preferences on fast voice turns.",
		"- Treat this as compact context only; call openclaw_agent_consult when the caller needs the full agent brain, tools, memory, or workspace state."
	];
	if (config.includeIdentity) {
		const identity = asOptionalRecord(resolveAgentIdentity(coreConfig, agentId));
		const lines = [
			["Name", identity?.name],
			["Emoji", identity?.emoji],
			["Vibe", identity?.vibe],
			["Theme", identity?.theme],
			["Creature/persona", identity?.creature]
		].flatMap(([label, value]) => {
			const text = normalizeOptionalString(value);
			return text ? [`- ${label}: ${text}`] : [];
		});
		if (lines.length > 0) capsule.push(`Configured identity:\n${lines.join("\n")}`);
	}
	if (config.includeWorkspaceFiles) {
		const workspace = await root(resolveAgentWorkspaceDir(coreConfig, agentId)).catch(() => null);
		if (workspace) {
			const sections = [];
			let remaining = config.maxChars;
			for (const file of config.files) {
				if (remaining <= 0) continue;
				const trimmed = (await workspace.readText(file).catch(() => void 0))?.trim();
				if (!trimmed) continue;
				const section = `### ${file}\n${limitLegacyContextText(trimmed, Math.max(0, remaining - file.length - 16))}`;
				sections.push(section);
				remaining -= section.length;
			}
			if (sections.length > 0) capsule.push(`Workspace voice context:\n${sections.join("\n\n")}`);
		}
	}
	return limitLegacyContextText(capsule.join("\n\n"), config.maxChars);
}
//#endregion
export { buildLegacyRealtimeVoiceAgentContext };
