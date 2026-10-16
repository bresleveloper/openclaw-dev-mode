import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import "./utils-DgZn2dLu.mjs";
import { o as normalizeSetupPresentationHttpsUrl } from "./manifest-BXjFCp0F.mjs";
//#region scripts/lib/recommended-tool-installs.json
var entries = [
	{
		"id": "ollama",
		"brandId": "ollama",
		"label": "Ollama",
		"hint": "Run open models locally",
		"website": "https://ollama.com/download",
		"icon": "https://cdn.simpleicons.org/ollama"
	},
	{
		"id": "lmstudio",
		"label": "LM Studio",
		"hint": "Local model desktop app",
		"website": "https://lmstudio.ai/download",
		"icon": "https://cdn.simpleicons.org/lmstudio"
	},
	{
		"id": "claude-code",
		"brandId": "claude",
		"label": "Claude Code",
		"hint": "Anthropic's coding agent CLI",
		"website": "https://code.claude.com/docs/en/quickstart",
		"icon": "https://cdn.simpleicons.org/claudecode"
	},
	{
		"id": "codex-cli",
		"brandId": "openai",
		"label": "Codex CLI",
		"hint": "OpenAI's coding agent CLI",
		"website": "https://developers.openai.com/codex/cli/",
		"icon": "https://github.com/openai.png"
	}
];
//#endregion
//#region src/plugins/recommended-tool-installs.ts
function listRecommendedToolInstalls() {
	const entries$1 = entries;
	if (!Array.isArray(entries$1)) return [];
	const seenIds = /* @__PURE__ */ new Set();
	const installs = [];
	for (const entry of entries$1) {
		if (!isRecord(entry)) continue;
		const id = typeof entry.id === "string" ? entry.id.trim() : "";
		const brandId = typeof entry.brandId === "string" ? entry.brandId.trim() : "";
		const label = typeof entry.label === "string" ? entry.label.trim() : "";
		const hint = typeof entry.hint === "string" ? entry.hint.trim() : "";
		const website = normalizeSetupPresentationHttpsUrl(entry.website);
		const icon = normalizeSetupPresentationHttpsUrl(entry.icon);
		if (!id || seenIds.has(id) || !label || !hint || !website || !icon) continue;
		seenIds.add(id);
		installs.push({
			id,
			...brandId ? { brandId } : {},
			label,
			hint,
			website,
			icon
		});
	}
	return installs;
}
//#endregion
export { listRecommendedToolInstalls as t };
