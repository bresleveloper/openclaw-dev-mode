import { c as normalizeOptionalLowercaseString } from "./string-coerce-1VuiLaaR.mjs";
import { o as resolveUserPath } from "./home-dir-Dc6nN6HB.mjs";
import { r as defaultRuntime } from "./runtime-DlO3PTAd.mjs";
import { p as shortenHomePath } from "./utils-DgZn2dLu.mjs";
import { n as LEGACY_IMPLICIT_AGENT_ID } from "./session-key-C09ow4h0.mjs";
import { t as resolveDefaultAgentWorkspaceDir } from "./workspace-default-path-Cwkw6Ed6.mjs";
import { t as createConfigIO } from "./io.factory-GdHkk8Z_.mjs";
import { r as replaceConfigFile } from "./mutate-BkuP-9_H.mjs";
import "./config-9720xhC5.mjs";
import { l as extractFrontmatterBlock } from "./frontmatter-ByhFzIgC.mjs";
import { r as publishBootstrapFile } from "./workspace-bootstrap-publish-ZP86pZVJ.mjs";
import { d as runWorkspacePreparation } from "./workspace-C0xiByg0.mjs";
import { t as resolveWorkspaceTemplateSearchDirs } from "./workspace-templates-SBb56ls8.mjs";
import { o as handleReset } from "./onboard-helpers-BpPrDUJb.mjs";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
//#region src/cli/gateway-cli/dev.ts
const DEV_IDENTITY_NAME = "C3-PO";
const DEV_IDENTITY_THEME = "protocol droid";
const DEV_IDENTITY_EMOJI = "🤖";
const DEV_AGENT_WORKSPACE_SUFFIX = "dev";
async function loadDevTemplate(name, fallback) {
	try {
		const templateDirs = await resolveWorkspaceTemplateSearchDirs();
		for (const templateDir of templateDirs) {
			let raw;
			try {
				raw = await fs.promises.readFile(path.join(templateDir, name), "utf-8");
			} catch (error) {
				if (error?.code === "ENOENT") continue;
				throw error;
			}
			return extractFrontmatterBlock(raw)?.body.replace(/^\s+/, "") ?? raw;
		}
	} catch {
		return fallback;
	}
	return fallback;
}
const resolveDevWorkspaceDir = (env = process.env) => {
	const baseDir = resolveDefaultAgentWorkspaceDir(env, os.homedir);
	if (normalizeOptionalLowercaseString(env.OPENCLAW_PROFILE) === "dev") return baseDir;
	return `${baseDir}-${DEV_AGENT_WORKSPACE_SUFFIX}`;
};
async function ensureDevWorkspace(dir) {
	const resolvedDir = resolveUserPath(dir);
	await runWorkspacePreparation(resolvedDir, async (assertCurrent) => {
		const [agents, soul, identity, user] = await Promise.all([
			loadDevTemplate("AGENTS.dev.md", `# AGENTS.md - OpenClaw Dev Workspace\n\nDefault dev workspace for openclaw gateway --dev.\n`),
			loadDevTemplate("SOUL.dev.md", `# SOUL.md - Dev Persona\n\nProtocol droid for debugging and operations.\n`),
			loadDevTemplate("IDENTITY.dev.md", `# IDENTITY.md - Agent Identity\n\n- Name: ${DEV_IDENTITY_NAME}\n- Creature: protocol droid\n- Vibe: ${DEV_IDENTITY_THEME}\n- Emoji: ${DEV_IDENTITY_EMOJI}\n`),
			loadDevTemplate("USER.dev.md", `# USER.md - User Profile\n\n- Name:\n- Preferred address:\n- Notes:\n`)
		]);
		assertCurrent();
		await fs.promises.mkdir(resolvedDir, { recursive: true });
		assertCurrent();
		await publishBootstrapFile(path.join(resolvedDir, "AGENTS.md"), agents, assertCurrent);
		await publishBootstrapFile(path.join(resolvedDir, "SOUL.md"), soul, assertCurrent);
		await publishBootstrapFile(path.join(resolvedDir, "IDENTITY.md"), identity, assertCurrent);
		await publishBootstrapFile(path.join(resolvedDir, "USER.md"), user, assertCurrent);
		assertCurrent();
	});
}
async function ensureDevGatewayConfig(opts) {
	const workspace = resolveDevWorkspaceDir();
	if (opts.reset) await handleReset("full", workspace, defaultRuntime);
	const configPath = createConfigIO().configPath;
	const configExists = fs.existsSync(configPath);
	if (!opts.reset && configExists) return;
	await ensureDevWorkspace(workspace);
	await replaceConfigFile({
		nextConfig: {
			gateway: {
				mode: "local",
				bind: "loopback"
			},
			agents: {
				defaults: {
					workspace,
					skipBootstrap: true
				},
				entries: { dev: {
					workspace,
					identity: {
						name: DEV_IDENTITY_NAME,
						theme: DEV_IDENTITY_THEME,
						emoji: DEV_IDENTITY_EMOJI
					}
				} }
			}
		},
		afterWrite: { mode: "auto" },
		writeOptions: { allowedAgentRosterRemovals: [LEGACY_IMPLICIT_AGENT_ID] }
	});
	defaultRuntime.log(`Dev config ready: ${shortenHomePath(configPath)}`);
	defaultRuntime.log(`Dev workspace ready: ${shortenHomePath(resolveUserPath(workspace))}`);
}
//#endregion
export { ensureDevGatewayConfig };
