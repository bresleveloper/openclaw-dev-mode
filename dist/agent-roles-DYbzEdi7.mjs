import { Et as _enum, Fn as object, Jn as string, Nt as array, xn as literal } from "./schemas-BOYIvvln.mjs";
import { l as pathExists } from "./utils-aKqR_F_U.mjs";
import { t as resolveWorkspaceTemplateSearchDirs } from "./workspace-templates-CNRexiYk.mjs";
import { n as readClawManifestFile } from "./reader-C5RYMxIl.mjs";
import path from "node:path";
import fs from "node:fs/promises";
//#region src/agents/agent-roles.ts
const AGENT_ROLES = [
	"coordinator",
	"researcher",
	"writer",
	"reviewer"
];
function listAgentRoles() {
	return AGENT_ROLES;
}
function validateAgentTeamMemberIds(ids) {
	return new Set(ids).size === ids.length ? void 0 : "Team member ids must be distinct after applying the coordinator and prefix options.";
}
const memberSchema = object({
	id: string().regex(/^[a-z0-9][a-z0-9_-]{0,63}$/),
	role: _enum(AGENT_ROLES)
}).strict();
const teamPresetSchema = object({
	schemaVersion: literal(1),
	coordinator: memberSchema,
	specialists: array(memberSchema).min(1)
}).strict().refine(({ coordinator, specialists }) => validateAgentTeamMemberIds([coordinator.id, ...specialists.map((member) => member.id)]) === void 0, { message: "Team member ids must be unique" });
async function resolveCatalogFile(...segments) {
	for (const templatesDir of await resolveWorkspaceTemplateSearchDirs()) {
		const candidate = path.join(templatesDir, "roles", ...segments);
		if (await pathExists(candidate)) return candidate;
	}
	throw new Error(`Bundled agent role is missing: ${segments.join("/")}`);
}
async function loadAgentRole(role) {
	if (!AGENT_ROLES.some((candidate) => candidate === role)) throw new Error(`Unknown agent role "${role}". Available roles: ${AGENT_ROLES.join(", ")}.`);
	const read = await readClawManifestFile(await resolveCatalogFile(role, "CLAW.md"));
	if (!read.ok) throw new Error(read.diagnostics.map(({ message }) => message).join("\n"));
	const { manifest } = read;
	const identity = manifest.agent.identity;
	const agentsSource = manifest.workspace.bootstrapFiles["AGENTS.md"]?.source;
	if (manifest.agent.id !== role || !identity?.name || !identity.emoji || !identity.theme || !agentsSource || !read.clawMarkdownBody) throw new Error(`Agent role "${role}" requires its matching id, complete identity, AGENTS.md, and SOUL body.`);
	return {
		manifest,
		identity: {
			name: identity.name,
			emoji: identity.emoji,
			theme: identity.theme
		},
		files: {
			"AGENTS.md": await fs.readFile(path.join(read.source.packageRoot, agentsSource), "utf8"),
			"SOUL.md": read.clawMarkdownBody.toString("utf8"),
			"IDENTITY.md": `# Identity\n\n- **Name:** ${identity.name}\n- **Creature:** ${role} assistant\n- **Vibe:** ${identity.theme}\n- **Emoji:** ${identity.emoji}\n- **Theme:** ${identity.theme}\n`
		}
	};
}
async function loadAgentTeamPreset(preset = "team") {
	if (preset !== "team") throw new Error(`Unknown agent team preset "${preset}". Available presets: team.`);
	const presetPath = await resolveCatalogFile("presets", `${preset}.json`);
	return teamPresetSchema.parse(JSON.parse(await fs.readFile(presetPath, "utf8")));
}
//#endregion
export { validateAgentTeamMemberIds as i, loadAgentRole as n, loadAgentTeamPreset as r, listAgentRoles as t };
