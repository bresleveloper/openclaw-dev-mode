import { o as resolveUserPath } from "./home-dir-BKwhAL2c.mjs";
import "./utils-aKqR_F_U.mjs";
import { b as redactToolPayloadText } from "./redact-B5EGyLvV.mjs";
import { r as loadInstalledPluginIndexInstallRecords } from "./installed-plugin-index-record-reader-Bwq1gZI1.mjs";
import { r as resolveModelRuntimePolicy } from "./model-runtime-policy-IbIjya7U.mjs";
import { o as modelSelectionShouldEnsureCodexPlugin, s as parseModelRefProvider } from "./openai-routing-BspGC-O6.mjs";
import { n as sanitizeTerminalText } from "./safe-text-CBmKtmbt.mjs";
import { r as enablePluginWithCapabilityConsent } from "./enable-35XtW1Wg.mjs";
import "./installed-plugin-index-records-Clh203og.mjs";
import { t as createPluginCapabilityConsentPrompter } from "./plugin-capability-consent-BNYfhiBg.mjs";
import { t as createNonInteractiveLoggingPrompter } from "./non-interactive-prompter-DLCGsi38.mjs";
import { existsSync } from "node:fs";
import path from "node:path";
//#region src/agents/copilot-routing.ts
const GITHUB_COPILOT_PROVIDER_ID = "github-copilot";
/**
* Canonical id of the Copilot agent runtime plugin.
*/
const COPILOT_RUNTIME_ID = "copilot";
function parseModelRefId(model) {
	if (typeof model !== "string") return;
	const trimmed = model.trim();
	const slash = trimmed.indexOf("/");
	if (slash <= 0 || slash === trimmed.length - 1) return;
	return trimmed.slice(slash + 1);
}
/**
* Returns true when the selected model should trigger the external
* `@openclaw/copilot` runtime plugin install.
*
* Gating contract (review #2, P1):
*   - Model ref must use the `github-copilot/*` provider prefix.
*   - The user's config must explicitly opt in by setting
*     `agentRuntime.id: "copilot"` at the provider, model, or agent scope
*     (resolved via `resolveModelRuntimePolicy`).
*
* Without the explicit opt-in we fall through to the built-in GitHub
* Copilot provider, which has shipped support for `github-copilot/*`
* models for a long time and must not install the runtime plugin for
* users who never asked for it.
*/
function modelSelectionShouldEnsureCopilotRuntimePlugin(params) {
	if (parseModelRefProvider(params.model) !== GITHUB_COPILOT_PROVIDER_ID) return false;
	const modelId = parseModelRefId(params.model);
	return resolveModelRuntimePolicy({
		config: params.config,
		provider: GITHUB_COPILOT_PROVIDER_ID,
		modelId
	}).policy?.id?.trim().toLowerCase() === COPILOT_RUNTIME_ID;
}
//#endregion
//#region src/commands/runtime-plugin-install.ts
const CODEX_RUNTIME_PLUGIN_ID = "codex";
const CODEX_RUNTIME_PLUGIN_DESCRIPTOR = {
	pluginId: CODEX_RUNTIME_PLUGIN_ID,
	label: "Codex",
	npmSpec: "@openclaw/codex",
	warningLabel: "Codex",
	versionBoundToOpenClaw: true
};
const COPILOT_RUNTIME_PLUGIN_DESCRIPTOR = {
	pluginId: "copilot",
	label: "GitHub Copilot agent runtime",
	npmSpec: "@openclaw/copilot",
	warningLabel: "GitHub Copilot"
};
function isInstalledRecordPresentOnDisk(record, env) {
	const installPath = record?.installPath?.trim();
	if (!installPath) return false;
	return existsSync(path.join(resolveUserPath(installPath, env), "package.json"));
}
function finalizeRequiredRuntimePluginInstall(descriptor, result) {
	if (result.installed) return {
		ok: true,
		cfg: result.cfg,
		required: true
	};
	const status = result.status === "installed" ? "failed" : result.status;
	const runtimeLabel = `${descriptor.label}${/runtime$/iu.test(descriptor.label) ? "" : " runtime"}`;
	return {
		ok: false,
		status,
		message: `${runtimeLabel} is required but unavailable (status: ${status}). Reason: ${redactToolPayloadText(sanitizeTerminalText(result.reason ?? "")).trim() || "The installer did not return a failure reason."} ${status === "failed" || status === "timed_out" ? `Retry setup after checking npm connectivity and the configured registry; install ${descriptor.npmSpec} first if it is still unavailable.` : `Retry setup and allow ${runtimeLabel} to install, or select a model that does not require it.`}`
	};
}
function adaptRuntimePluginInstallIo(params) {
	const silent = params.output === "silent";
	const runtime = {
		...params.runtime,
		error: () => {},
		...silent ? { log: () => {} } : {}
	};
	return {
		prompter: silent ? createNonInteractiveLoggingPrompter(runtime, (message) => `Runtime plugin install unexpectedly prompted: ${message}`) : {
			...params.prompter,
			note: async () => {}
		},
		runtime
	};
}
async function ensureRuntimePluginForModelSelection(params) {
	if (!params.shouldEnsure({
		cfg: params.cfg,
		model: params.model,
		agentId: params.agentId
	})) return {
		ok: true,
		cfg: params.cfg,
		required: false
	};
	const io = adaptRuntimePluginInstallIo(params);
	const onCapabilityConsent = params.output === "silent" ? async () => void 0 : createPluginCapabilityConsentPrompter(params.prompter);
	if (isInstalledRecordPresentOnDisk((await loadInstalledPluginIndexInstallRecords({ env: process.env }))[params.descriptor.pluginId], process.env)) {
		const repair = await repairRuntimePluginInstallForModelSelection({
			cfg: params.cfg,
			model: params.model,
			agentId: params.agentId,
			env: process.env,
			descriptor: params.descriptor,
			shouldEnsure: params.shouldEnsure,
			onCapabilityConsent,
			beforePersistentEffect: params.beforePersistentEffect
		});
		for (const change of repair.changes) io.runtime.log?.(change);
		for (const warning of repair.warnings) io.runtime.log?.(`${params.descriptor.warningLabel} update warning: ${warning}`);
		const enableResult = await enablePluginWithCapabilityConsent(params.cfg, params.descriptor.pluginId, {
			workspaceDir: params.workspaceDir,
			onCapabilityConsent,
			beforePersistentEffect: params.beforePersistentEffect
		});
		return finalizeRequiredRuntimePluginInstall(params.descriptor, {
			cfg: enableResult.config,
			installed: enableResult.enabled,
			status: enableResult.enabled ? "installed" : "failed",
			...enableResult.reason ? { reason: enableResult.reason } : {}
		});
	}
	const { ensureOnboardingPluginInstalled } = await import("./onboarding-plugin-install-Di77GD0k.mjs");
	const result = await ensureOnboardingPluginInstalled({
		cfg: params.cfg,
		entry: {
			pluginId: params.descriptor.pluginId,
			label: params.descriptor.label,
			install: {
				npmSpec: params.descriptor.npmSpec,
				defaultChoice: "npm"
			},
			trustedSourceLinkedOfficialInstall: true,
			...params.descriptor.versionBoundToOpenClaw ? { versionBoundToOpenClaw: true } : {}
		},
		prompter: io.prompter,
		runtime: io.runtime,
		...params.workspaceDir !== void 0 ? { workspaceDir: params.workspaceDir } : {},
		promptInstall: false,
		autoConfirmSingleSource: true,
		onCapabilityConsent,
		beforePersistentEffect: params.beforePersistentEffect
	});
	return finalizeRequiredRuntimePluginInstall(params.descriptor, {
		cfg: result.cfg,
		installed: result.installed,
		status: result.status,
		...result.error ? { reason: result.error } : {}
	});
}
/** Repairs missing install records for runtime plugins required by model selection. */
async function repairRuntimePluginInstallForModelSelection(params) {
	if (!params.shouldEnsure({
		cfg: params.cfg,
		model: params.model,
		agentId: params.agentId
	})) return {
		required: false,
		changes: [],
		warnings: []
	};
	const { repairMissingPluginInstallsForIds } = await import("./missing-configured-plugin-install-DIEWIwyy.mjs");
	const result = await repairMissingPluginInstallsForIds({
		cfg: params.cfg,
		pluginIds: [params.descriptor.pluginId],
		...params.env !== void 0 ? { env: params.env } : {},
		...params.onCapabilityConsent ? { onCapabilityConsent: params.onCapabilityConsent } : {},
		beforePersistentEffect: params.beforePersistentEffect
	});
	return {
		required: true,
		changes: result.changes,
		warnings: [...result.warnings, ...result.notices ?? []]
	};
}
function createRuntimePluginModelSelectionHelpers(descriptor, shouldEnsure) {
	return {
		ensure: (ensureParams) => ensureRuntimePluginForModelSelection({
			...ensureParams,
			descriptor,
			shouldEnsure
		}),
		repair: (repairParams) => repairRuntimePluginInstallForModelSelection({
			...repairParams,
			descriptor,
			shouldEnsure
		})
	};
}
const codexRuntimePluginInstall = createRuntimePluginModelSelectionHelpers(CODEX_RUNTIME_PLUGIN_DESCRIPTOR, ({ cfg, model, agentId }) => modelSelectionShouldEnsureCodexPlugin({
	config: cfg,
	model,
	agentId
}));
const copilotRuntimePluginInstall = createRuntimePluginModelSelectionHelpers(COPILOT_RUNTIME_PLUGIN_DESCRIPTOR, ({ cfg, model }) => modelSelectionShouldEnsureCopilotRuntimePlugin({
	config: cfg,
	model
}));
const ensureCodexRuntimePluginForModelSelection = codexRuntimePluginInstall.ensure;
const repairCodexRuntimePluginInstallForModelSelection = codexRuntimePluginInstall.repair;
const ensureCopilotRuntimePluginForModelSelection = copilotRuntimePluginInstall.ensure;
const repairCopilotRuntimePluginInstallForModelSelection = copilotRuntimePluginInstall.repair;
createRuntimePluginModelSelectionHelpers(CODEX_RUNTIME_PLUGIN_DESCRIPTOR, () => true).ensure;
async function ensureModelSelectionRuntimePlugins(params) {
	const codex = await ensureCodexRuntimePluginForModelSelection(params);
	if (!codex.ok) return {
		ok: false,
		message: codex.message
	};
	const copilot = await ensureCopilotRuntimePluginForModelSelection({
		...params,
		cfg: codex.cfg
	});
	return copilot.ok ? {
		ok: true,
		cfg: copilot.cfg,
		codexInstalled: codex.required
	} : {
		ok: false,
		message: copilot.message
	};
}
//#endregion
export { repairCopilotRuntimePluginInstallForModelSelection as a, repairCodexRuntimePluginInstallForModelSelection as i, ensureCodexRuntimePluginForModelSelection as n, ensureModelSelectionRuntimePlugins as r, CODEX_RUNTIME_PLUGIN_ID as t };
