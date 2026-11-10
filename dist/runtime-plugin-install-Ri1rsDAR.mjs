import { o as resolveUserPath } from "./home-dir-CtsdYvX3.mjs";
import { u as redactToolPayloadText } from "./redact-BcXJu5HP.mjs";
import "./utils-gjJ-tD2q.mjs";
import { n as sanitizeTerminalText } from "./safe-text-BjmWJADa.mjs";
import { r as loadInstalledPluginIndexInstallRecords } from "./installed-plugin-index-record-reader-CE166Xp8.mjs";
import { r as resolveModelRuntimePolicy } from "./model-runtime-policy-DSkspt0X.mjs";
import { o as modelSelectionShouldEnsureCodexPlugin, s as parseModelRefProvider } from "./openai-routing-Bm7d8DH8.mjs";
import { r as enablePluginWithCapabilityConsent } from "./enable-yRbPluWX.mjs";
import "./installed-plugin-index-records-DTzp62mN.mjs";
import { t as createPluginCapabilityConsentPrompter } from "./plugin-capability-consent-P722AY9p.mjs";
import { t as createNonInteractiveLoggingPrompter } from "./non-interactive-prompter-C7yy4gSh.mjs";
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
	versionBoundToOpenClaw: true,
	shouldEnsure: ({ cfg, model, agentId }) => modelSelectionShouldEnsureCodexPlugin({
		config: cfg,
		model,
		agentId
	})
};
const COPILOT_RUNTIME_PLUGIN_DESCRIPTOR = {
	pluginId: "copilot",
	label: "GitHub Copilot agent runtime",
	npmSpec: "@openclaw/copilot",
	warningLabel: "GitHub Copilot",
	shouldEnsure: ({ cfg, model }) => modelSelectionShouldEnsureCopilotRuntimePlugin({
		config: cfg,
		model
	})
};
const MUSE_RUNTIME_PLUGIN_DESCRIPTOR = {
	pluginId: "muse",
	label: "Muse Code",
	npmSpec: "@openclaw/muse",
	warningLabel: "Muse Code",
	shouldEnsure: ({ cfg, model, agentId }) => Boolean(model && resolveModelRuntimePolicy({
		config: cfg,
		modelId: model,
		agentId
	}).policy?.id === "muse")
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
async function ensureRuntimePluginForModelSelection(params, descriptor) {
	if (!descriptor.shouldEnsure(params)) return {
		ok: true,
		cfg: params.cfg,
		required: false
	};
	const io = adaptRuntimePluginInstallIo(params);
	const onCapabilityConsent = params.onCapabilityConsent ?? (params.output === "silent" ? async () => void 0 : createPluginCapabilityConsentPrompter(params.prompter));
	if (isInstalledRecordPresentOnDisk((await loadInstalledPluginIndexInstallRecords({ env: process.env }))[descriptor.pluginId], process.env)) {
		const repair = await repairRequiredRuntimePluginInstall({
			cfg: params.cfg,
			env: process.env,
			onCapabilityConsent,
			beforePersistentEffect: params.beforePersistentEffect
		}, descriptor.pluginId);
		for (const change of repair.changes) io.runtime.log?.(change);
		for (const warning of repair.warnings) io.runtime.log?.(`${descriptor.warningLabel} update warning: ${warning}`);
		const enableResult = await enablePluginWithCapabilityConsent(params.cfg, descriptor.pluginId, {
			workspaceDir: params.workspaceDir,
			onCapabilityConsent,
			recordOfficialCapabilities: params.recordOfficialCapabilities,
			beforePersistentEffect: params.beforePersistentEffect,
			beforePersistentApply: params.beforePersistentApply
		});
		return finalizeRequiredRuntimePluginInstall(descriptor, {
			cfg: enableResult.config,
			installed: enableResult.enabled,
			status: enableResult.enabled ? "installed" : "failed",
			...enableResult.reason ? { reason: enableResult.reason } : {}
		});
	}
	const { ensureOnboardingPluginInstalled } = await import("./onboarding-plugin-install-B3WrPhvj.mjs");
	const result = await ensureOnboardingPluginInstalled({
		cfg: params.cfg,
		entry: {
			pluginId: descriptor.pluginId,
			label: descriptor.label,
			install: {
				npmSpec: descriptor.npmSpec,
				defaultChoice: "npm"
			},
			trustedSourceLinkedOfficialInstall: true,
			...descriptor.versionBoundToOpenClaw ? { versionBoundToOpenClaw: true } : {}
		},
		prompter: io.prompter,
		runtime: io.runtime,
		...params.workspaceDir !== void 0 ? { workspaceDir: params.workspaceDir } : {},
		promptInstall: false,
		autoConfirmSingleSource: true,
		onCapabilityConsent,
		recordOfficialCapabilities: params.recordOfficialCapabilities,
		beforePersistentEffect: params.beforePersistentEffect,
		beforePersistentApply: params.beforePersistentApply
	});
	return finalizeRequiredRuntimePluginInstall(descriptor, {
		cfg: result.cfg,
		installed: result.installed,
		status: result.status,
		...result.error ? { reason: result.error } : {}
	});
}
/** Repairs missing install records for runtime plugins required by model selection. */
async function repairRequiredRuntimePluginInstall(params, pluginId) {
	const { repairMissingPluginInstallsForIds } = await import("./missing-configured-plugin-install-BTp4wRrU.mjs");
	const result = await repairMissingPluginInstallsForIds({
		cfg: params.cfg,
		pluginIds: [pluginId],
		...params.env !== void 0 ? { env: params.env } : {},
		...params.onCapabilityConsent ? { onCapabilityConsent: params.onCapabilityConsent } : {},
		beforePersistentEffect: params.beforePersistentEffect
	});
	return {
		changes: result.changes,
		warnings: [...result.warnings, ...result.notices ?? []]
	};
}
const ensureCodexRuntimePluginForModelSelection = (params) => ensureRuntimePluginForModelSelection(params, CODEX_RUNTIME_PLUGIN_DESCRIPTOR);
const ensureCodexRuntimePluginForSupervision = (params) => ensureRuntimePluginForModelSelection(params, {
	...CODEX_RUNTIME_PLUGIN_DESCRIPTOR,
	shouldEnsure: () => true
});
async function repairModelSelectionRuntimePlugins(params) {
	const warnings = [];
	for (const descriptor of [
		CODEX_RUNTIME_PLUGIN_DESCRIPTOR,
		COPILOT_RUNTIME_PLUGIN_DESCRIPTOR,
		MUSE_RUNTIME_PLUGIN_DESCRIPTOR
	]) if (descriptor.shouldEnsure(params)) {
		const repaired = await repairRequiredRuntimePluginInstall(params, descriptor.pluginId);
		warnings.push(...repaired.warnings);
	}
	return warnings;
}
async function ensureModelSelectionRuntimePlugins(params) {
	const codex = await ensureCodexRuntimePluginForModelSelection(params);
	if (!codex.ok) return {
		ok: false,
		message: codex.message
	};
	const copilot = await ensureRuntimePluginForModelSelection({
		...params,
		cfg: codex.cfg
	}, COPILOT_RUNTIME_PLUGIN_DESCRIPTOR);
	if (!copilot.ok) return {
		ok: false,
		message: copilot.message
	};
	const muse = await ensureRuntimePluginForModelSelection({
		...params,
		cfg: copilot.cfg
	}, MUSE_RUNTIME_PLUGIN_DESCRIPTOR);
	return muse.ok ? {
		ok: true,
		cfg: muse.cfg,
		codexInstalled: codex.required
	} : {
		ok: false,
		message: muse.message
	};
}
//#endregion
export { repairModelSelectionRuntimePlugins as a, ensureModelSelectionRuntimePlugins as i, ensureCodexRuntimePluginForModelSelection as n, ensureCodexRuntimePluginForSupervision as r, CODEX_RUNTIME_PLUGIN_ID as t };
