import { t as isFastTestRuntimeEnv } from "./test-runtime-env-mVzBKwSd.mjs";
import "./env-BBJTTIuE.mjs";
import { b as resolveGatewayPort, m as resolveConfigPath } from "./paths-DGIwWbpu.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { p as resolveAmbientOwnerAgentId } from "./agent-scope-config-CDYpzA0r.mjs";
import "./session-key-C09ow4h0.mjs";
import { n as listAgentEntries } from "./agent-roster-BXD1uMJD.mjs";
import { s as resolveAgentModelPrimaryValue } from "./model-input-C9K4a_6k.mjs";
import "./agent-scope-CG17uXFn.mjs";
import { y as readUtilityModelSetting } from "./model-selection-shared-DKlQ1p0S.mjs";
import { c as readConfigFileSnapshot } from "./io.runtime-BSum32pK.mjs";
import "./config-9720xhC5.mjs";
import { i as resolveConfiguredSetupModelForAgent, r as resolveConfiguredPrimaryModelForAgent } from "./utility-model-zUQQg0xn.mjs";
import { n as OPENCLAW_SOURCE_URL, r as resolveOpenClawReferencePaths, t as OPENCLAW_DOCS_URL } from "./docs-path-CRbzrTCx.mjs";
import { t as createSetupTranslator } from "./i18n-Cuh2pEdZ.mjs";
import { n as probeLocalCommand, t as probeGatewayUrl } from "./probes-BEX9YOKS.mjs";
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
		const details = (deps.buildGatewayConnectionDetails ?? (await import("./call-CWvmXO5x.mjs")).buildGatewayConnectionDetails)({
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
function formatStartupAction(overview) {
	if (!overview.config.valid) return "Config needs attention. Run `doctor` to inspect it.";
	if (!overview.defaultModel && !overview.setupModel) return "Inference is unavailable. Run `openclaw onboard` and complete a live model check.";
	if (!overview.defaultModel) return "Setup and utility inference are ready. Choose a regular agent model in Model Setup or run `openclaw onboard`.";
}
/**
* Welcome shown right after inference activation. OpenClaw owns the
* remaining workspace, Gateway, channel, and agent setup.
*/
function formatSystemAgentOnboardingWelcome(overview, translate = createSetupTranslator({ keyPrefix: "wizard.onboardingWelcome" })) {
	return [
		`## ${translate("inferenceReady")}`,
		"",
		`- ${translate(overview.defaultModel ? "verifiedModel" : "verifiedSetupModel", { model: overview.defaultModel ?? overview.setupModel ?? translate("notConfigured") })}`,
		`- ${overview.gateway.reachable ? translate("gatewayRunning", { url: overview.gateway.url }) : translate("gatewayUnavailable")}`,
		`- ${translate("optionalSetup")}`,
		`- ${translate("channelCommands")}`,
		"",
		translate(overview.defaultModel ? "readyNext" : "readySetupNext")
	].join("\n");
}
function formatSystemAgentStartupMessage(overview) {
	const agent = overview.agents.find((entry) => entry.id === overview.defaultAgentId);
	const agentLabel = agent?.name ? `${overview.defaultAgentId} (${agent.name})` : overview.defaultAgentId;
	const configStatus = !overview.config.exists ? "missing" : overview.config.valid ? "valid" : "invalid";
	return [
		"Hi, I'm OpenClaw — caretaker of this gateway, config, channels, and agents.",
		overview.defaultModel ? `Model: ${overview.defaultModel}.` : overview.setupModel ? `Setup model: ${overview.setupModel}.` : "Inference is unavailable.",
		`Config: ${configStatus}. Default agent: ${agentLabel}.`,
		overview.gateway.reachable ? `Gateway: reachable at ${overview.gateway.url}.` : `Gateway: not reachable at ${overview.gateway.url}; I already did the first probe.`,
		formatStartupAction(overview)
	].filter((line) => line !== void 0).join("\n");
}
//#endregion
export { loadSystemAgentOverview as i, formatSystemAgentOverview as n, formatSystemAgentStartupMessage as r, formatSystemAgentOnboardingWelcome as t };
