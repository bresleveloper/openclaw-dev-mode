import { m as theme } from "./globals-DtwqVhkV.js";
import "./paths-BfR2LXbA.js";
import { d as defaultRuntime } from "./subsystem-D-lLN9nd.js";
import "./boolean-DTgd5CzD.js";
import { J as writeConfigFile, z as createConfigIO } from "./auth-profiles-gyYFUuWS.js";
import { E as ensureAgentWorkspace, _ as DEFAULT_AGENT_WORKSPACE_DIR } from "./agent-scope-Cp0IkEKB.js";
import { x as shortenHomePath } from "./utils-DMInpDZe.js";
import "./openclaw-root-D_NGSHjv.js";
import "./logger-lJby90xW.js";
import "./exec-9-lXnoNH.js";
import "./github-copilot-token-CcBrBN3h.js";
import "./host-env-security-BnQcDbLl.js";
import "./version-Bxx5bg6l.js";
import "./runtime-overrides-BrDRV8AG.js";
import "./registry-XwiWGUVE.js";
import "./manifest-registry-DpwUhr6x.js";
import "./dock-DXYDVeNl.js";
import "./accounts-CCmToVwr.js";
import "./plugins-BlxnRrWB.js";
import "./logging-DE_Gv8EN.js";
import "./accounts-D9cGmSBd.js";
import "./message-channel-CBxyiPG1.js";
import "./tailnet-_7OomAtX.js";
import "./ws-skc9U6x4.js";
import "./redact-DWAErDjv.js";
import "./errors-LFbAe3gQ.js";
import "./sessions-BzabF1Rs.js";
import "./accounts-B9MZJeQz.js";
import { o as resolveSessionTranscriptsDir } from "./paths-m-ckvfYo.js";
import "./chat-envelope-BCgyDMmT.js";
import "./client-x1tOQWHk.js";
import "./call-CT_1cdY_.js";
import "./pairing-token-B2YLkyDu.js";
import "./onboard-helpers-BTGTJOdS.js";
import "./prompt-style-Dnaodfgg.js";
import { t as formatDocsLink } from "./links-CPpbuTOP.js";
import { n as runCommandWithRuntime } from "./cli-utils-BQZi5I0U.js";
import "./progress-Dfes2lhw.js";
import { t as hasExplicitOptions } from "./command-options-Dh89_DYm.js";
import "./note-C1niKQJi.js";
import "./clack-prompter-Ci7xWqS9.js";
import "./runtime-guard-vBGm4L6l.js";
import "./onboarding.secret-input-CRUZgOmd.js";
import "./onboarding-CfD9oSNE.js";
import { n as logConfigUpdated, t as formatConfigPath } from "./logging-C2FUa2rZ.js";
import { t as onboardCommand } from "./onboard-B_jadGdW.js";
import "./onboard-config-DeRnlqfh.js";
import JSON5 from "json5";
import fs from "node:fs/promises";
//#region src/commands/setup.ts
async function readConfigFileRaw(configPath) {
	try {
		const raw = await fs.readFile(configPath, "utf-8");
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
		}
	};
	if (!existingRaw.exists || defaults.workspace !== workspace) {
		await writeConfigFile(next);
		if (!existingRaw.exists) runtime.log(`Wrote ${formatConfigPath(configPath)}`);
		else logConfigUpdated(runtime, {
			path: configPath,
			suffix: "(set agents.defaults.workspace)"
		});
	} else runtime.log(`Config OK: ${formatConfigPath(configPath)}`);
	const ws = await ensureAgentWorkspace({
		dir: workspace,
		ensureBootstrapFiles: !next.agents?.defaults?.skipBootstrap
	});
	runtime.log(`Workspace OK: ${shortenHomePath(ws.dir)}`);
	const sessionsDir = resolveSessionTranscriptsDir();
	await fs.mkdir(sessionsDir, { recursive: true });
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
