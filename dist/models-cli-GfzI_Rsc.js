import { m as theme } from "./globals-DtwqVhkV.js";
import "./paths-BfR2LXbA.js";
import { p as defaultRuntime } from "./subsystem-CkDRqDzV.js";
import "./boolean-DTgd5CzD.js";
import "./auth-profiles-CIqoN6FN.js";
import "./agent-scope-BAb0j1gt.js";
import "./utils-DMInpDZe.js";
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
import "./send-BsspxCzG.js";
import "./send-zGJnEJ2h.js";
import "./compact-D7FmBOIi.js";
import "./paths-B52CESY4.js";
import "./chat-envelope-DZwp6OvC.js";
import "./models-config-CgYIAjpL.js";
import "./tokens-DlJSUh2B.js";
import "./with-timeout-BkPFXDKx.js";
import "./deliver-BBVbYNZl.js";
import "./diagnostic-BgzUMGxw.js";
import "./send-C30ZEgKY.js";
import "./pi-model-discovery-N8VeGFSt.js";
import "./exec-approvals-allowlist-BFQyzfY0.js";
import "./exec-safe-bin-runtime-policy-JIvK4NYP.js";
import "./model-catalog-ABQggSsr.js";
import "./fetch-BNo-TKiW.js";
import "./audio-transcription-runner-aawySreQ.js";
import "./fetch-guard-DfcVqBbv.js";
import "./image-D8LO-CO5.js";
import "./tool-display-B4YdJGcN.js";
import "./api-key-rotation-DmIVW9sh.js";
import "./proxy-fetch-wuVrlEmU.js";
import "./ir-D7O7NHen.js";
import "./render-DIsvUmKZ.js";
import "./target-errors-Cd8b6anp.js";
import "./commands-CwtsDdaQ.js";
import "./commands-registry-B6Tu3P-e.js";
import "./session-cost-usage-BqCSF78X.js";
import "./session-utils-Byo4TGCQ.js";
import "./sqlite-Bqsue8ZW.js";
import "./call-B28h9L2b.js";
import "./pi-tools.policy-BakY2muG.js";
import "./fetch-BhUTuYqs.js";
import "./pairing-store-afyqjg4D.js";
import "./exec-approvals-BZxwpxPb.js";
import "./nodes-screen-CBcHhTJX.js";
import "./restart-DQH7Yikr.js";
import "./system-run-command-CPtKcdih.js";
import "./skill-commands-3lKJ1bA0.js";
import "./workspace-dirs-BYV9O2SH.js";
import "./pairing-token-BzOmgvEq.js";
import "./channel-activity-5EA8FJ8k.js";
import "./tables-gTnrqBY-.js";
import "./runtime-web-tools-BLhk2bwq.js";
import "./runtime-BXiwDtum.js";
import "./stagger-B-xCbBoK.js";
import "./channel-selection-iBIRb_3m.js";
import "./plugin-auto-enable-CIwNgqs-.js";
import "./send-CoQdqhec.js";
import "./outbound-attachment-B7a-XtfD.js";
import "./delivery-queue-DoXxnK-F.js";
import "./send-BB9-a7dX.js";
import "./fetch-BXEZfVK2.js";
import "./timeouts-Cku3qerp.js";
import "./command-secret-targets-D-ZwQMW3.js";
import "./connection-auth-BW2kdKuY.js";
import "./onboard-helpers-Dxc5qfRZ.js";
import "./prompt-style-DjT2g1_v.js";
import "./pairing-labels-DP2OEfMM.js";
import "./search-manager-1h3uBAK6.js";
import "./manager-BrGg7Zo_.js";
import "./memory-cli-00BaWePz.js";
import { t as formatDocsLink } from "./links-y9BHyNI9.js";
import { n as runCommandWithRuntime, t as resolveOptionFromCommand } from "./cli-utils-CHV3_ffN.js";
import "./help-format-DFZn5_Pb.js";
import "./progress-DD4pMDZr.js";
import "./provider-env-vars-CYUhIc-v.js";
import "./note-V9Ncupme.js";
import "./clack-prompter-JFLI0HS7.js";
import "./issue-format-CBixuceM.js";
import "./table-B-ecKEFu.js";
import "./openai-codex-model-default-De4D22mU.js";
import "./auth-token-BkREJmad.js";
import "./logging-DRF_pgYm.js";
import { c as githubCopilotLoginCommand } from "./provider-auth-helpers-CDemEPmW.js";
import "./oauth-tls-preflight-CIgNtlR3.js";
import { _ as modelsAuthPasteTokenCommand, a as modelsImageFallbacksClearCommand, b as modelsAliasesListCommand, c as modelsFallbacksAddCommand, d as modelsFallbacksRemoveCommand, f as modelsAuthOrderClearCommand, g as modelsAuthLoginCommand, h as modelsAuthAddCommand, i as modelsImageFallbacksAddCommand, l as modelsFallbacksClearCommand, m as modelsAuthOrderSetCommand, modelsListCommand, modelsStatusCommand, n as modelsSetCommand, o as modelsImageFallbacksListCommand, p as modelsAuthOrderGetCommand, r as modelsScanCommand, s as modelsImageFallbacksRemoveCommand, t as modelsSetImageCommand, u as modelsFallbacksListCommand, v as modelsAuthSetupTokenCommand, x as modelsAliasesRemoveCommand, y as modelsAliasesAddCommand } from "./models-C8_EW7O2.js";
//#region src/cli/models-cli.ts
function runModelsCommand(action) {
	return runCommandWithRuntime(defaultRuntime, action);
}
function registerModelsCli(program) {
	const models = program.command("models").description("Model discovery, scanning, and configuration").option("--status-json", "Output JSON (alias for `models status --json`)", false).option("--status-plain", "Plain output (alias for `models status --plain`)", false).option("--agent <id>", "Agent id to inspect (overrides OPENCLAW_AGENT_DIR/PI_CODING_AGENT_DIR)").addHelpText("after", () => `\n${theme.muted("Docs:")} ${formatDocsLink("/cli/models", "docs.openclaw.ai/cli/models")}\n`);
	models.command("list").description("List models (configured by default)").option("--all", "Show full model catalog", false).option("--local", "Filter to local models", false).option("--provider <name>", "Filter by provider").option("--json", "Output JSON", false).option("--plain", "Plain line output", false).action(async (opts) => {
		await runModelsCommand(async () => {
			await modelsListCommand(opts, defaultRuntime);
		});
	});
	models.command("status").description("Show configured model state").option("--json", "Output JSON", false).option("--plain", "Plain output", false).option("--check", "Exit non-zero if auth is expiring/expired (1=expired/missing, 2=expiring)", false).option("--probe", "Probe configured provider auth (live)", false).option("--probe-provider <name>", "Only probe a single provider").option("--probe-profile <id>", "Only probe specific auth profile ids (repeat or comma-separated)", (value, previous) => {
		const next = Array.isArray(previous) ? previous : previous ? [previous] : [];
		next.push(value);
		return next;
	}).option("--probe-timeout <ms>", "Per-probe timeout in ms").option("--probe-concurrency <n>", "Concurrent probes").option("--probe-max-tokens <n>", "Probe max tokens (best-effort)").option("--agent <id>", "Agent id to inspect (overrides OPENCLAW_AGENT_DIR/PI_CODING_AGENT_DIR)").action(async (opts, command) => {
		const agent = resolveOptionFromCommand(command, "agent") ?? opts.agent;
		await runModelsCommand(async () => {
			await modelsStatusCommand({
				json: Boolean(opts.json),
				plain: Boolean(opts.plain),
				check: Boolean(opts.check),
				probe: Boolean(opts.probe),
				probeProvider: opts.probeProvider,
				probeProfile: opts.probeProfile,
				probeTimeout: opts.probeTimeout,
				probeConcurrency: opts.probeConcurrency,
				probeMaxTokens: opts.probeMaxTokens,
				agent
			}, defaultRuntime);
		});
	});
	models.command("set").description("Set the default model").argument("<model>", "Model id or alias").action(async (model) => {
		await runModelsCommand(async () => {
			await modelsSetCommand(model, defaultRuntime);
		});
	});
	models.command("set-image").description("Set the image model").argument("<model>", "Model id or alias").action(async (model) => {
		await runModelsCommand(async () => {
			await modelsSetImageCommand(model, defaultRuntime);
		});
	});
	const aliases = models.command("aliases").description("Manage model aliases");
	aliases.command("list").description("List model aliases").option("--json", "Output JSON", false).option("--plain", "Plain output", false).action(async (opts) => {
		await runModelsCommand(async () => {
			await modelsAliasesListCommand(opts, defaultRuntime);
		});
	});
	aliases.command("add").description("Add or update a model alias").argument("<alias>", "Alias name").argument("<model>", "Model id or alias").action(async (alias, model) => {
		await runModelsCommand(async () => {
			await modelsAliasesAddCommand(alias, model, defaultRuntime);
		});
	});
	aliases.command("remove").description("Remove a model alias").argument("<alias>", "Alias name").action(async (alias) => {
		await runModelsCommand(async () => {
			await modelsAliasesRemoveCommand(alias, defaultRuntime);
		});
	});
	const fallbacks = models.command("fallbacks").description("Manage model fallback list");
	fallbacks.command("list").description("List fallback models").option("--json", "Output JSON", false).option("--plain", "Plain output", false).action(async (opts) => {
		await runModelsCommand(async () => {
			await modelsFallbacksListCommand(opts, defaultRuntime);
		});
	});
	fallbacks.command("add").description("Add a fallback model").argument("<model>", "Model id or alias").action(async (model) => {
		await runModelsCommand(async () => {
			await modelsFallbacksAddCommand(model, defaultRuntime);
		});
	});
	fallbacks.command("remove").description("Remove a fallback model").argument("<model>", "Model id or alias").action(async (model) => {
		await runModelsCommand(async () => {
			await modelsFallbacksRemoveCommand(model, defaultRuntime);
		});
	});
	fallbacks.command("clear").description("Clear all fallback models").action(async () => {
		await runModelsCommand(async () => {
			await modelsFallbacksClearCommand(defaultRuntime);
		});
	});
	const imageFallbacks = models.command("image-fallbacks").description("Manage image model fallback list");
	imageFallbacks.command("list").description("List image fallback models").option("--json", "Output JSON", false).option("--plain", "Plain output", false).action(async (opts) => {
		await runModelsCommand(async () => {
			await modelsImageFallbacksListCommand(opts, defaultRuntime);
		});
	});
	imageFallbacks.command("add").description("Add an image fallback model").argument("<model>", "Model id or alias").action(async (model) => {
		await runModelsCommand(async () => {
			await modelsImageFallbacksAddCommand(model, defaultRuntime);
		});
	});
	imageFallbacks.command("remove").description("Remove an image fallback model").argument("<model>", "Model id or alias").action(async (model) => {
		await runModelsCommand(async () => {
			await modelsImageFallbacksRemoveCommand(model, defaultRuntime);
		});
	});
	imageFallbacks.command("clear").description("Clear all image fallback models").action(async () => {
		await runModelsCommand(async () => {
			await modelsImageFallbacksClearCommand(defaultRuntime);
		});
	});
	models.command("scan").description("Scan OpenRouter free models for tools + images").option("--min-params <b>", "Minimum parameter size (billions)").option("--max-age-days <days>", "Skip models older than N days").option("--provider <name>", "Filter by provider prefix").option("--max-candidates <n>", "Max fallback candidates", "6").option("--timeout <ms>", "Per-probe timeout in ms").option("--concurrency <n>", "Probe concurrency").option("--no-probe", "Skip live probes; list free candidates only").option("--yes", "Accept defaults without prompting", false).option("--no-input", "Disable prompts (use defaults)").option("--set-default", "Set agents.defaults.model to the first selection", false).option("--set-image", "Set agents.defaults.imageModel to the first image selection", false).option("--json", "Output JSON", false).action(async (opts) => {
		await runModelsCommand(async () => {
			await modelsScanCommand(opts, defaultRuntime);
		});
	});
	models.action(async (opts) => {
		await runModelsCommand(async () => {
			await modelsStatusCommand({
				json: Boolean(opts?.statusJson),
				plain: Boolean(opts?.statusPlain),
				agent: opts?.agent
			}, defaultRuntime);
		});
	});
	const auth = models.command("auth").description("Manage model auth profiles");
	auth.option("--agent <id>", "Agent id for auth order get/set/clear");
	auth.action(() => {
		auth.help();
	});
	auth.command("add").description("Interactive auth helper (setup-token or paste token)").action(async () => {
		await runModelsCommand(async () => {
			await modelsAuthAddCommand({}, defaultRuntime);
		});
	});
	auth.command("login").description("Run a provider plugin auth flow (OAuth/API key)").option("--provider <id>", "Provider id registered by a plugin").option("--method <id>", "Provider auth method id").option("--set-default", "Apply the provider's default model recommendation", false).action(async (opts) => {
		await runModelsCommand(async () => {
			await modelsAuthLoginCommand({
				provider: opts.provider,
				method: opts.method,
				setDefault: Boolean(opts.setDefault)
			}, defaultRuntime);
		});
	});
	auth.command("setup-token").description("Run a provider CLI to create/sync a token (TTY required)").option("--provider <name>", "Provider id (default: anthropic)").option("--yes", "Skip confirmation", false).action(async (opts) => {
		await runModelsCommand(async () => {
			await modelsAuthSetupTokenCommand({
				provider: opts.provider,
				yes: Boolean(opts.yes)
			}, defaultRuntime);
		});
	});
	auth.command("paste-token").description("Paste a token into auth-profiles.json and update config").requiredOption("--provider <name>", "Provider id (e.g. anthropic)").option("--profile-id <id>", "Auth profile id (default: <provider>:manual)").option("--expires-in <duration>", "Optional expiry duration (e.g. 365d, 12h). Stored as absolute expiresAt.").action(async (opts) => {
		await runModelsCommand(async () => {
			await modelsAuthPasteTokenCommand({
				provider: opts.provider,
				profileId: opts.profileId,
				expiresIn: opts.expiresIn
			}, defaultRuntime);
		});
	});
	auth.command("login-github-copilot").description("Login to GitHub Copilot via GitHub device flow (TTY required)").option("--profile-id <id>", "Auth profile id (default: github-copilot:github)").option("--yes", "Overwrite existing profile without prompting", false).action(async (opts) => {
		await runModelsCommand(async () => {
			await githubCopilotLoginCommand({
				profileId: opts.profileId,
				yes: Boolean(opts.yes)
			}, defaultRuntime);
		});
	});
	const order = auth.command("order").description("Manage per-agent auth profile order overrides");
	order.command("get").description("Show per-agent auth order override (from auth-profiles.json)").requiredOption("--provider <name>", "Provider id (e.g. anthropic)").option("--agent <id>", "Agent id (default: configured default agent)").option("--json", "Output JSON", false).action(async (opts, command) => {
		const agent = resolveOptionFromCommand(command, "agent") ?? opts.agent;
		await runModelsCommand(async () => {
			await modelsAuthOrderGetCommand({
				provider: opts.provider,
				agent,
				json: Boolean(opts.json)
			}, defaultRuntime);
		});
	});
	order.command("set").description("Set per-agent auth order override (locks rotation to this list)").requiredOption("--provider <name>", "Provider id (e.g. anthropic)").option("--agent <id>", "Agent id (default: configured default agent)").argument("<profileIds...>", "Auth profile ids (e.g. anthropic:default)").action(async (profileIds, opts, command) => {
		const agent = resolveOptionFromCommand(command, "agent") ?? opts.agent;
		await runModelsCommand(async () => {
			await modelsAuthOrderSetCommand({
				provider: opts.provider,
				agent,
				order: profileIds
			}, defaultRuntime);
		});
	});
	order.command("clear").description("Clear per-agent auth order override (fall back to config/round-robin)").requiredOption("--provider <name>", "Provider id (e.g. anthropic)").option("--agent <id>", "Agent id (default: configured default agent)").action(async (opts, command) => {
		const agent = resolveOptionFromCommand(command, "agent") ?? opts.agent;
		await runModelsCommand(async () => {
			await modelsAuthOrderClearCommand({
				provider: opts.provider,
				agent
			}, defaultRuntime);
		});
	});
}
//#endregion
export { registerModelsCli };
