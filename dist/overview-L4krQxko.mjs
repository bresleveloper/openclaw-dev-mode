import { t as isFastTestRuntimeEnv } from "./test-runtime-env-mVzBKwSd.mjs";
import "./env-C4a8LL2I.mjs";
import { n as normalizeAgentId } from "./agent-id-GA8mwdTG.mjs";
import { E as listAgentEntries, d as resolveAmbientOwnerAgentId } from "./agent-scope-config-IQKOEtZ4.mjs";
import { p as resolveConfigPath, v as resolveGatewayPort } from "./paths-DehQwyE0.mjs";
import "./session-key-CBvmC8zz.mjs";
import { s as resolveAgentModelPrimaryValue } from "./model-input-DKxKaZGG.mjs";
import { y as readUtilityModelSetting } from "./model-selection-shared-0uvJbX1M.mjs";
import "./agent-scope-CTuYDtny.mjs";
import { c as readConfigFileSnapshot } from "./io.runtime-CZWcIUDk.mjs";
import "./config-DryArA1l.mjs";
import { n as resolveConfiguredPrimaryModelForAgent, r as resolveConfiguredSetupModelForAgent } from "./utility-model-Bk8FTgwT.mjs";
import { n as OPENCLAW_SOURCE_URL, r as resolveOpenClawReferencePaths, t as OPENCLAW_DOCS_URL } from "./docs-path-Cq1F-2do.mjs";
import { n as probeLocalCommand, t as probeGatewayUrl } from "./probes-o7vjc7LA.mjs";
//#region src/system-agent/overview.ts
function issueMessages(snapshot) {
	return snapshot.issues.map((issue) => {
		return `${issue.path ? `${issue.path}: ` : ""}${issue.message}`;
	});
}
function buildAgentSummaries(cfg, defaultAgentId) {
	const entries = listAgentEntries(cfg);
	if (entries.length === 0) {
		const utility = readUtilityModelSetting(cfg, defaultAgentId);
		return [{
			id: defaultAgentId,
			isDefault: true,
			model: resolveConfiguredPrimaryModelForAgent({
				cfg,
				agentId: defaultAgentId
			}),
			...utility.kind === "explicit" ? { utilityModel: utility.modelRef } : {}
		}];
	}
	const seen = /* @__PURE__ */ new Set();
	const summaries = [];
	for (const entry of entries) {
		const id = normalizeAgentId(entry.id);
		if (seen.has(id)) continue;
		seen.add(id);
		const summary = {
			id,
			isDefault: id === defaultAgentId
		};
		if (typeof entry.name === "string") summary.name = entry.name;
		const model = resolveConfiguredPrimaryModelForAgent({
			cfg,
			agentId: id
		});
		if (model) summary.model = model;
		const utility = readUtilityModelSetting(cfg, id);
		if (utility.kind === "explicit") summary.utilityModel = utility.modelRef;
		if (typeof entry.workspace === "string") summary.workspace = entry.workspace;
		summaries.push(summary);
	}
	return summaries;
}
function resolveFastTestReferences(env) {
	if (!isFastTestRuntimeEnv(env)) return;
	const sourcePath = process.cwd();
	return {
		sourcePath,
		docsPath: `${sourcePath}/docs`
	};
}
async function loadSystemAgentOverview(opts = {}) {
	const env = opts.env ?? process.env;
	const deps = opts.deps ?? {};
	const snapshot = await (deps.readConfigFileSnapshot ?? readConfigFileSnapshot)();
	const cfg = snapshot.runtimeConfig ?? snapshot.sourceConfig ?? {};
	const defaultAgentId = resolveAmbientOwnerAgentId(cfg, opts.agentId);
	const defaultModel = resolveConfiguredPrimaryModelForAgent({
		cfg,
		agentId: defaultAgentId
	}) ?? resolveAgentModelPrimaryValue(cfg.agents?.defaults?.model);
	const setupSelection = resolveConfiguredSetupModelForAgent({
		cfg,
		agentId: defaultAgentId
	});
	const utility = readUtilityModelSetting(cfg, defaultAgentId);
	const configPath = snapshot.path || (deps.resolveConfigPath ?? resolveConfigPath)(env);
	let gatewayUrl = `ws://127.0.0.1:${(deps.resolveGatewayPort ?? resolveGatewayPort)(cfg, env)}`;
	let gatewaySource = "local loopback";
	let gatewayError;
	try {
		const details = (deps.buildGatewayConnectionDetails ?? (await import("./call-bfuNQIMk.mjs")).buildGatewayConnectionDetails)({
			config: cfg,
			configPath
		});
		gatewayUrl = details.url;
		gatewaySource = details.urlSource;
		gatewayError = details.remoteFallbackNote;
	} catch (err) {
		gatewayError = err instanceof Error ? err.message : String(err);
	}
	const resolveReferences = deps.resolveOpenClawReferencePaths ?? resolveOpenClawReferencePaths;
	const commandProbe = deps.probeLocalCommand ?? probeLocalCommand;
	const [codex, claude, gemini, gateway, references] = await Promise.all([
		commandProbe("codex"),
		commandProbe("claude"),
		commandProbe("gemini"),
		(deps.probeGatewayUrl ?? probeGatewayUrl)(gatewayUrl),
		resolveFastTestReferences(env) ?? resolveReferences({
			argv1: process.argv[1],
			cwd: process.cwd(),
			moduleUrl: import.meta.url
		})
	]);
	return {
		config: {
			path: configPath,
			exists: snapshot.exists,
			valid: snapshot.valid,
			issues: issueMessages(snapshot),
			hash: snapshot.hash ?? null
		},
		agents: buildAgentSummaries(cfg, defaultAgentId),
		defaultAgentId,
		defaultModel,
		...setupSelection?.modelTarget === "utility" ? { setupModel: setupSelection.modelRef } : {},
		...utility.kind === "explicit" ? { utilityModel: utility.modelRef } : {},
		tools: {
			codex,
			claude,
			gemini,
			apiKeys: {
				openai: Boolean(env.OPENAI_API_KEY?.trim()),
				anthropic: Boolean(env.ANTHROPIC_API_KEY?.trim())
			}
		},
		gateway: {
			url: gateway.url,
			source: gatewaySource,
			reachable: gateway.reachable,
			error: gateway.error ?? gatewayError
		},
		references: {
			docsPath: references.docsPath ?? void 0,
			docsUrl: OPENCLAW_DOCS_URL,
			sourcePath: references.sourcePath ?? void 0,
			sourceUrl: OPENCLAW_SOURCE_URL
		}
	};
}
function formatCommandProbe(probe) {
	if (!probe.found) return "not found";
	if (probe.version) return probe.version;
	return probe.error ? `found (${probe.error})` : "found";
}
function formatSystemAgentOverview(overview) {
	const agentLines = overview.agents.map((agent) => {
		return `  - ${[
			agent.id,
			agent.isDefault ? "default" : void 0,
			agent.name ? `name=${agent.name}` : void 0,
			agent.model ? `model=${agent.model}` : void 0,
			agent.utilityModel ? `utility=${agent.utilityModel}` : void 0,
			agent.workspace ? `workspace=${agent.workspace}` : void 0
		].filter(Boolean).join(" | ")}`;
	});
	const configStatus = overview.config.valid ? overview.config.exists ? "valid" : "missing" : "invalid";
	const issueLines = overview.config.issues.length > 0 ? ["Config issues:", ...overview.config.issues.map((issue) => `  - ${issue}`)] : [];
	return [
		"OpenClaw online. Little claws, typed tools.",
		"",
		`Config: ${configStatus}`,
		`Path: ${overview.config.path}`,
		`Default agent: ${overview.defaultAgentId}`,
		`Default model: ${overview.defaultModel ?? "not configured"}`,
		...overview.setupModel ? [`Setup model: ${overview.setupModel}`] : [],
		...overview.utilityModel ? [`Utility model: ${overview.utilityModel}`] : [],
		"Agents:",
		...agentLines,
		`Codex: ${formatCommandProbe(overview.tools.codex)}`,
		`Claude Code: ${formatCommandProbe(overview.tools.claude)}`,
		`Gemini CLI: ${formatCommandProbe(overview.tools.gemini)}`,
		`API keys: OpenAI ${overview.tools.apiKeys.openai ? "found" : "not found"}, Anthropic ${overview.tools.apiKeys.anthropic ? "found" : "not found"}`,
		`AI: ${overview.defaultModel || overview.setupModel ? `conversation runs on ${overview.defaultModel ?? overview.setupModel}` : "inference unavailable; run openclaw onboard before starting OpenClaw"}`,
		`Docs: ${overview.references.docsPath ?? overview.references.docsUrl}`,
		overview.references.sourcePath ? `Source: ${overview.references.sourcePath}` : `Source: ${overview.references.sourceUrl}`,
		`Gateway: ${overview.gateway.reachable ? "reachable" : "not reachable"} (${overview.gateway.url}, ${overview.gateway.source})`,
		overview.gateway.error ? `Gateway note: ${overview.gateway.error}` : void 0,
		`Next: ${recommendSystemAgentNextStep(overview)}`,
		...issueLines
	].filter((line) => line !== void 0).join("\n");
}
function recommendSystemAgentNextStep(overview) {
	if (!overview.config.exists) return "run \"openclaw onboard\" to establish inference";
	if (!overview.config.valid) return "run \"validate config\" or \"doctor\" to inspect the config";
	if (!overview.defaultModel) return overview.setupModel ? "continue setup here; run \"openclaw onboard\" to choose your regular agent model" : "run \"openclaw onboard\" to establish inference";
	if (!overview.gateway.reachable) return "run \"gateway status\" or \"restart gateway\"";
	return "run \"talk to agent\" to enter your default agent";
}
function formatStartupConfigStatus(overview) {
	if (!overview.config.exists) return "missing";
	return overview.config.valid ? "valid" : "invalid";
}
function formatStartupGatewayStatus(overview) {
	if (overview.gateway.reachable) return `Gateway: reachable at ${overview.gateway.url}.`;
	return `Gateway: not reachable at ${overview.gateway.url}; I already did the first probe.`;
}
function formatStartupAction(overview) {
	if (!overview.config.valid) return "Config needs attention. Run `doctor` to inspect it.";
	if (!overview.defaultModel && !overview.setupModel) return "Inference is unavailable. Run `openclaw onboard` and complete a live model check.";
	if (!overview.defaultModel) return "Setup and utility inference are ready. Choose a regular agent model in Model Setup or run `openclaw onboard`.";
}
/**
* Welcome shown right after inference activation. OpenClaw owns the
* remaining workspace, Gateway, channel, and agent setup.
*/
function formatSystemAgentOnboardingWelcome(overview) {
	return [
		"## Inference is ready.",
		"",
		`- Verified ${overview.defaultModel ? "model" : "setup model"}: ${overview.defaultModel ?? overview.setupModel ?? "not configured"}.`,
		`- ${overview.gateway.reachable ? `Gateway: running at ${overview.gateway.url}.` : "Gateway: not configured or reachable yet."}`,
		"- I can now finish your workspace, Gateway, channels, agents, plugins, and other optional setup.",
		"- Connect how you want to talk: say `connect whatsapp`, `connect telegram`, `connect slack`, `connect discord` — or `channels` for the full list.",
		"",
		overview.defaultModel ? "Say `talk to agent` to meet your agent right here, or `help` for everything I can do." : "Your setup model stays available here. Choose a primary model in Model Setup or run `openclaw onboard` before opening regular agent chat."
	].join("\n");
}
function formatSystemAgentStartupMessage(overview) {
	const agent = overview.agents.find((entry) => entry.id === overview.defaultAgentId);
	const agentLabel = agent?.name ? `${overview.defaultAgentId} (${agent.name})` : overview.defaultAgentId;
	return [
		"Hi, I'm OpenClaw — caretaker of this gateway, config, channels, and agents.",
		overview.defaultModel ? `Model: ${overview.defaultModel}.` : overview.setupModel ? `Setup model: ${overview.setupModel}.` : "Inference is unavailable.",
		`Config: ${formatStartupConfigStatus(overview)}. Default agent: ${agentLabel}.`,
		formatStartupGatewayStatus(overview),
		formatStartupAction(overview)
	].filter((line) => line !== void 0).join("\n");
}
//#endregion
export { loadSystemAgentOverview as i, formatSystemAgentOverview as n, formatSystemAgentStartupMessage as r, formatSystemAgentOnboardingWelcome as t };
