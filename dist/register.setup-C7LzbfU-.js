import { m as theme } from "./globals-DtwqVhkV.js";
import "./paths-BfR2LXbA.js";
import { p as defaultRuntime } from "./subsystem-CkDRqDzV.js";
import "./boolean-DTgd5CzD.js";
import { Lo as writeConfigFile, To as createConfigIO } from "./auth-profiles-CIqoN6FN.js";
import { D as ensureAgentWorkspace, v as DEFAULT_AGENT_WORKSPACE_DIR } from "./agent-scope-BAb0j1gt.js";
import { x as shortenHomePath } from "./utils-DMInpDZe.js";
import "./boundary-file-read-DM07oBuv.js";
import "./logger-GQFppKMT.js";
import "./exec-DDBrWr4H.js";
import "./github-copilot-token-B_S63apr.js";
import "./env-overrides-BD1bOZrq.js";
import "./version-BvA7WhZA.js";
import "./runtime-overrides-CGfXKBb_.js";
import "./registry-DznR2BDN.js";
import "./skills-DZCrHNdp.js";
import "./frontmatter-D1I3WE8J.js";
import "./plugins-CjLMQbHJ.js";
import "./windows-spawn-D2jCT_tt.js";
import "./redact-DnTfDLlu.js";
import "./path-alias-guards-BAfWVs88.js";
import "./errors-D6OHuY6d.js";
import { o as resolveSessionTranscriptsDir } from "./paths-B52CESY4.js";
import "./chat-envelope-DZwp6OvC.js";
import "./call-B28h9L2b.js";
import "./onboard-helpers-Dxc5qfRZ.js";
import "./prompt-style-DjT2g1_v.js";
import { t as formatDocsLink } from "./links-y9BHyNI9.js";
import { n as runCommandWithRuntime } from "./cli-utils-CHV3_ffN.js";
import "./progress-DD4pMDZr.js";
import { t as hasExplicitOptions } from "./command-options-NZgZgncj.js";
import "./note-V9Ncupme.js";
import "./clack-prompter-JFLI0HS7.js";
import "./runtime-guard-dTn-df9-.js";
import "./onboarding.secret-input-BExBwTwR.js";
import "./onboarding-DMnllAyO.js";
import { n as logConfigUpdated, t as formatConfigPath } from "./logging-DRF_pgYm.js";
import { t as onboardCommand } from "./onboard-DvmTFJzs.js";
import "./onboard-config-BbiRxt4y.js";
import JSON5 from "json5";
import fsPromises from "node:fs/promises";
//#region src/commands/setup.ts
async function readConfigFileRaw(configPath) {
	try {
		const raw = await fsPromises.readFile(configPath, "utf-8");
		const parsed = JSON5.parse(raw);
		if (parsed && typeof parsed === "object") return {
			exists: true,
			parsed
		};
		return {
			exists: true,
			parsed: {}
		};
	} catch {
		return {
			exists: false,
			parsed: {}
		};
	}
}
async function setupCommand(opts, runtime = defaultRuntime) {
	const desiredWorkspace = typeof opts?.workspace === "string" && opts.workspace.trim() ? opts.workspace.trim() : void 0;
	const configPath = createConfigIO().configPath;
	const existingRaw = await readConfigFileRaw(configPath);
	const cfg = existingRaw.parsed;
	const defaults = cfg.agents?.defaults ?? {};
	const workspace = desiredWorkspace ?? defaults.workspace ?? DEFAULT_AGENT_WORKSPACE_DIR;
	const next = {
		...cfg,
		agents: {
			...cfg.agents,
			defaults: {
				...defaults,
				workspace
			}
		},
		gateway: {
			...cfg.gateway,
			mode: cfg.gateway?.mode ?? "local"
		}
	};
	if (!existingRaw.exists || defaults.workspace !== workspace || cfg.gateway?.mode !== next.gateway?.mode) {
		await writeConfigFile(next);
		if (!existingRaw.exists) runtime.log(`Wrote ${formatConfigPath(configPath)}`);
		else {
			const updates = [];
			if (defaults.workspace !== workspace) updates.push("set agents.defaults.workspace");
			if (cfg.gateway?.mode !== next.gateway?.mode) updates.push("set gateway.mode");
			logConfigUpdated(runtime, {
				path: configPath,
				suffix: updates.length > 0 ? `(${updates.join(", ")})` : void 0
			});
		}
	} else runtime.log(`Config OK: ${formatConfigPath(configPath)}`);
	const ws = await ensureAgentWorkspace({
		dir: workspace,
		ensureBootstrapFiles: !next.agents?.defaults?.skipBootstrap
	});
	runtime.log(`Workspace OK: ${shortenHomePath(ws.dir)}`);
	const sessionsDir = resolveSessionTranscriptsDir();
	await fsPromises.mkdir(sessionsDir, { recursive: true });
	runtime.log(`Sessions OK: ${shortenHomePath(sessionsDir)}`);
}
//#endregion
//#region src/cli/program/register.setup.ts
function registerSetupCommand(program) {
	program.command("setup").description("Initialize ~/.openclaw/openclaw.json and the agent workspace").addHelpText("after", () => `\n${theme.muted("Docs:")} ${formatDocsLink("/cli/setup", "docs.openclaw.ai/cli/setup")}\n`).option("--workspace <dir>", "Agent workspace directory (default: ~/.openclaw/workspace; stored as agents.defaults.workspace)").option("--wizard", "Run the interactive onboarding wizard", false).option("--non-interactive", "Run the wizard without prompts", false).option("--mode <mode>", "Wizard mode: local|remote").option("--remote-url <url>", "Remote Gateway WebSocket URL").option("--remote-token <token>", "Remote Gateway token (optional)").action(async (opts, command) => {
		await runCommandWithRuntime(defaultRuntime, async () => {
			const hasWizardFlags = hasExplicitOptions(command, [
				"wizard",
				"nonInteractive",
				"mode",
				"remoteUrl",
				"remoteToken"
			]);
			if (opts.wizard || hasWizardFlags) {
				await onboardCommand({
					workspace: opts.workspace,
					nonInteractive: Boolean(opts.nonInteractive),
					mode: opts.mode,
					remoteUrl: opts.remoteUrl,
					remoteToken: opts.remoteToken
				}, defaultRuntime);
				return;
			}
			await setupCommand({ workspace: opts.workspace }, defaultRuntime);
		});
	});
}
//#endregion
export { registerSetupCommand };
