import { d as resolveGatewayPort } from "./paths-BMBAvkNf.js";
import { t as formatCliCommand } from "./command-format-H_Arqann.js";
import { v as isPlainObject } from "./utils-CRO4LGEB.js";
import { r as createConfigIO } from "./io-DxnOT4sF.js";
import { r as replaceConfigFile } from "./config-Cc93keN1.js";
import { t as WizardCancelledError } from "./prompts-B0iOB1_a.js";
import { n as t } from "./i18n-CSQb1QYq.js";
import { a as stripPendingPluginInstallRecords, i as hasPendingPluginInstallRecords, n as commitConfigWriteWithPendingPluginInstalls, s as unchangedPendingPluginInstallRecordIds } from "./plugins-install-record-commit-Dci_oYIb.js";
import chalk from "chalk";
import { isDeepStrictEqual } from "node:util";
//#region src/wizard/setup.security-note.ts
const heading = (text) => chalk.bold(text);
function getSecurityNoteTitle() {
	return t("wizard.security.title");
}
function getSecurityConfirmMessage() {
	return t("wizard.security.confirm");
}
function getSecurityNoteMessage() {
	return [
		t("wizard.security.beta"),
		t("wizard.security.personalAgent"),
		t("wizard.security.toolAccess"),
		t("wizard.security.promptRisk"),
		"",
		t("wizard.security.notMultitenant"),
		t("wizard.security.sharedAuthority"),
		"",
		t("wizard.security.hardeningRequired"),
		t("wizard.security.askForHelp"),
		"",
		heading(t("wizard.security.recommendedBaseline")),
		`- ${t("wizard.security.baselinePairing")}`,
		`- ${t("wizard.security.baselineSharedInbox")}`,
		`- ${t("wizard.security.baselineSandbox")}`,
		`- ${t("wizard.security.baselineDmSessions")}`,
		`- ${t("wizard.security.baselineSecrets")}`,
		`- ${t("wizard.security.baselineStrongModel")}`,
		"",
		heading(t("wizard.security.runRegularly")),
		formatCliCommand("openclaw security audit --deep"),
		formatCliCommand("openclaw security audit --fix"),
		"",
		heading(t("wizard.security.learnMore")),
		"- https://docs.openclaw.ai/gateway/security"
	].join("\n");
}
//#endregion
//#region src/wizard/setup.shared.ts
function mergeWizardConfigValueOntoLatest(current, base, next) {
	if (isDeepStrictEqual(next, base)) return current;
	if (isPlainObject(current) && isPlainObject(base) && isPlainObject(next)) {
		const merged = { ...current };
		const keys = /* @__PURE__ */ new Set([
			...Object.keys(current),
			...Object.keys(base),
			...Object.keys(next)
		]);
		for (const key of keys) {
			const mergedValue = mergeWizardConfigValueOntoLatest(current[key], base[key], next[key]);
			if (mergedValue === void 0) delete merged[key];
			else merged[key] = mergedValue;
		}
		return merged;
	}
	return structuredClone(next);
}
/** Preserve concurrent edits while applying only changes made by an interactive wizard. */
function mergeWizardConfigOntoLatest(current, base, next) {
	return mergeWizardConfigValueOntoLatest(current, base, next);
}
/**
* Config writes go through the pending-plugin-install commit helper so wizard
* flows never drop install records that a concurrent migration already staged.
*/
async function writeWizardConfigFile(configInput, opts = {}) {
	let config = configInput;
	const allowConfigSizeDrop = opts.allowConfigSizeDrop === true;
	if (!allowConfigSizeDrop && hasPendingPluginInstallRecords(config)) {
		const migrationBaseConfig = opts.migrationBaseConfig;
		if (migrationBaseConfig && hasPendingPluginInstallRecords(migrationBaseConfig)) {
			await commitConfigWriteWithPendingPluginInstalls({
				nextConfig: migrationBaseConfig,
				writeOptions: { allowConfigSizeDrop: true },
				commit: async (nextConfig, writeOptions) => {
					return await replaceConfigFile({
						nextConfig,
						...writeOptions ? { writeOptions } : {},
						afterWrite: { mode: "auto" }
					});
				}
			});
			config = stripPendingPluginInstallRecords(config, unchangedPendingPluginInstallRecordIds(config, migrationBaseConfig));
			opts.onPendingPluginInstallMigration?.();
		}
	}
	return (await commitConfigWriteWithPendingPluginInstalls({
		nextConfig: config,
		writeOptions: { allowConfigSizeDrop },
		commit: async (nextConfig, writeOptions) => {
			return await replaceConfigFile({
				nextConfig,
				...writeOptions ? { writeOptions } : {},
				afterWrite: { mode: "auto" }
			});
		}
	})).config;
}
async function readSetupConfigFileSnapshot() {
	return await createConfigIO({ pluginValidation: "skip" }).readConfigFileSnapshot();
}
/** One-time security acknowledgement; persisted so reruns stay quiet. */
async function requireRiskAcknowledgement(params) {
	if (params.config.wizard?.securityAcknowledgedAt) return params.config;
	if (params.opts.acceptRisk === true) return applySecurityAcknowledgement(params.config);
	await params.prompter.note(getSecurityNoteMessage(), getSecurityNoteTitle());
	if (!await params.prompter.confirm({
		message: getSecurityConfirmMessage(),
		initialValue: true,
		layout: "vertical"
	})) throw new WizardCancelledError(t("wizard.setup.riskNotAccepted"));
	return applySecurityAcknowledgement(params.config);
}
function applySecurityAcknowledgement(config) {
	if (config.wizard?.securityAcknowledgedAt) return config;
	return {
		...config,
		wizard: {
			...config.wizard,
			securityAcknowledgedAt: (/* @__PURE__ */ new Date()).toISOString()
		}
	};
}
/** Derive quickstart gateway defaults, preserving any existing gateway settings. */
function resolveQuickstartGatewayDefaults(baseConfig) {
	const hasExisting = typeof baseConfig.gateway?.port === "number" || baseConfig.gateway?.bind !== void 0 || baseConfig.gateway?.auth?.mode !== void 0 || baseConfig.gateway?.auth?.token !== void 0 || baseConfig.gateway?.auth?.password !== void 0 || baseConfig.gateway?.customBindHost !== void 0 || baseConfig.gateway?.tailscale?.mode !== void 0;
	const bindRaw = baseConfig.gateway?.bind;
	const bind = bindRaw === "loopback" || bindRaw === "lan" || bindRaw === "auto" || bindRaw === "custom" || bindRaw === "tailnet" ? bindRaw : "loopback";
	let authMode = "token";
	if (baseConfig.gateway?.auth?.mode === "token" || baseConfig.gateway?.auth?.mode === "password") authMode = baseConfig.gateway.auth.mode;
	else if (baseConfig.gateway?.auth?.token) authMode = "token";
	else if (baseConfig.gateway?.auth?.password) authMode = "password";
	const tailscaleRaw = baseConfig.gateway?.tailscale?.mode;
	const tailscaleMode = tailscaleRaw === "off" || tailscaleRaw === "serve" || tailscaleRaw === "funnel" ? tailscaleRaw : "off";
	return {
		hasExisting,
		port: resolveGatewayPort(baseConfig),
		bind,
		authMode,
		tailscaleMode,
		token: baseConfig.gateway?.auth?.token,
		password: baseConfig.gateway?.auth?.password,
		customBindHost: baseConfig.gateway?.customBindHost,
		tailscaleResetOnExit: baseConfig.gateway?.tailscale?.resetOnExit ?? false
	};
}
//#endregion
export { writeWizardConfigFile as a, resolveQuickstartGatewayDefaults as i, readSetupConfigFileSnapshot as n, requireRiskAcknowledgement as r, mergeWizardConfigOntoLatest as t };
