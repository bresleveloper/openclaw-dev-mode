import { t as formatCliCommand } from "./command-format-DRYc0E-8.mjs";
import { v as resolveGatewayPort } from "./paths-DehQwyE0.mjs";
import { t as inheritLegacyDefaultAgentId } from "./legacy.default-agent-owner-B5Sofm47.mjs";
import { h as resolveDefaultSecretProviderAlias } from "./ref-contract-BVi3ykLT.mjs";
import { t as createConfigIO } from "./io.factory-ChIex6Yh.mjs";
import { n as createMergePatch, t as applyMergePatch } from "./merge-patch-C1--BlNd.mjs";
import "./config-Ciq2mxdN.mjs";
import { o as stripPendingPluginInstallRecords, s as transformConfigWithPendingPluginInstalls } from "./install-record-commit-DDMKSyro.mjs";
import { n as t } from "./i18n-BaFR7Cao.mjs";
import { t as captureSetupInferenceFileUndo } from "./setup-inference-transition-bla77ukN.mjs";
import { n as WizardCancelledError } from "./prompts-DLsO8MlU.mjs";
import chalk from "chalk";
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
		t("wizard.security.attribution"),
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
		`${t("wizard.security.learnMore")} https://docs.openclaw.ai/gateway/security`
	].join("\n");
}
//#endregion
//#region src/wizard/setup.shared.ts
function hasQuickstartGatewayOverrides(overrides) {
	return overrides.gatewayPort !== void 0 || overrides.gatewayBind !== void 0 || overrides.gatewayAuth !== void 0 || overrides.gatewayToken !== void 0 || overrides.gatewayTokenRefEnv !== void 0 || overrides.gatewayPassword !== void 0 || overrides.tailscale !== void 0;
}
function formatQuickstartGatewaySummary(defaults, keepExisting) {
	const bind = {
		auto: t("wizard.gateway.bindAuto"),
		custom: t("wizard.gateway.bindCustom"),
		lan: t("wizard.gateway.bindLan"),
		loopback: t("wizard.gateway.bindLoopback"),
		tailnet: t("wizard.gateway.bindTailnet")
	}[defaults.bind];
	return [
		...keepExisting ? [t("wizard.setup.quickstartKeepSettings")] : [],
		t("wizard.setup.quickstartGatewayPort", { port: defaults.port }),
		t("wizard.setup.quickstartGatewayBind", { bind }),
		...defaults.bind === "custom" && defaults.customBindHost ? [t("wizard.setup.quickstartGatewayCustomIp", { host: defaults.customBindHost })] : [],
		t("wizard.setup.quickstartGatewayAuth", { auth: defaults.authMode === "token" ? t("wizard.setup.quickstartAuthTokenDefault") : t("common.password") }),
		t("wizard.setup.quickstartTailscaleExposure", { exposure: t(`wizard.gatewayTailscale.${defaults.tailscaleMode}`) }),
		t("wizard.setup.quickstartDirectChannels")
	].join("\n");
}
/**
* Config writes go through the pending-plugin-install commit helper so wizard
* flows never drop install records that a concurrent migration already staged.
*/
async function writeWizardConfigFile(config, opts = {}) {
	return await transformConfigWithPendingPluginInstalls({
		...opts.baseHash !== void 0 ? { baseHash: opts.baseHash } : {},
		...opts.baseHash !== void 0 || opts.baseSnapshot ? { maxAttempts: 1 } : {},
		...opts.afterWrite ? { afterWrite: opts.afterWrite } : {},
		writeOptions: {
			...opts.writeOptions,
			...opts.allowConfigSizeDrop !== void 0 ? { allowConfigSizeDrop: opts.allowConfigSizeDrop } : {},
			...opts.baseSnapshot ? { baseSnapshot: opts.baseSnapshot } : {}
		},
		transform: (current, context) => {
			const nextConfig = opts.mergeBase ? applyMergePatch(current, createMergePatch(opts.mergeBase, config)) : config;
			opts.onPreparedCommit?.(context.snapshot, nextConfig);
			return { nextConfig };
		}
	});
}
function createWizardInferenceConfigTarget(commit) {
	const write = async (config, options, baseSnapshot) => {
		return (await commit(config, {
			baseSnapshot,
			writeOptions: options.writeOptions,
			onPreparedCommit: (snapshot, next) => options.captureUndo(captureSetupInferenceFileUndo({
				...snapshot,
				sourceConfig: stripPendingPluginInstallRecords(snapshot.sourceConfig)
			}, stripPendingPluginInstallRecords(next)))
		})).nextConfig;
	};
	return {
		write,
		read: async () => {
			const snapshot = await readSetupConfigFileSnapshot();
			return {
				config: snapshot.sourceConfig,
				write: (config, options) => write(config, options, snapshot)
			};
		}
	};
}
async function readSetupConfigFileSnapshot() {
	return await createConfigIO({ pluginValidation: "skip" }).readConfigFileSnapshot();
}
async function readValidSetupConfigFile() {
	const snapshot = await readSetupConfigFileSnapshot();
	if (!snapshot.valid) throw new Error("Migration target config became invalid. Run `openclaw doctor --fix` to apply supported repairs.");
	return snapshot.exists ? snapshot.sourceConfig ?? snapshot.config : {};
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
	return inheritLegacyDefaultAgentId(config, {
		...config,
		wizard: {
			...config.wizard,
			securityAcknowledgedAt: (/* @__PURE__ */ new Date()).toISOString()
		}
	});
}
/** Ask once during interactive setup; automation never creates telemetry consent. */
async function requestTelemetryConsent(params) {
	if (params.opts.nonInteractive === true || params.config.telemetry?.consentedAt) return params.config;
	await params.prompter.note(t("wizard.telemetry.description"), t("wizard.telemetry.title"));
	const enabled = await params.prompter.select({
		message: t("wizard.telemetry.title"),
		options: [{
			value: false,
			label: t("wizard.telemetry.decline")
		}, {
			value: true,
			label: t("wizard.telemetry.accept")
		}],
		initialValue: false
	});
	return inheritLegacyDefaultAgentId(params.config, {
		...params.config,
		telemetry: {
			...params.config.telemetry,
			enabled,
			consentedAt: (/* @__PURE__ */ new Date()).toISOString()
		}
	});
}
/** Derive quickstart gateway defaults, preserving any existing gateway settings. */
function resolveQuickstartGatewayDefaults(baseConfig, overrides = {}) {
	const hasExisting = typeof baseConfig.gateway?.port === "number" || baseConfig.gateway?.bind !== void 0 || baseConfig.gateway?.auth?.mode !== void 0 || baseConfig.gateway?.auth?.token !== void 0 || baseConfig.gateway?.auth?.password !== void 0 || baseConfig.gateway?.customBindHost !== void 0 || baseConfig.gateway?.tailscale?.mode !== void 0;
	const bindRaw = baseConfig.gateway?.bind;
	const bind = bindRaw === "loopback" || bindRaw === "lan" || bindRaw === "auto" || bindRaw === "custom" || bindRaw === "tailnet" ? bindRaw : "loopback";
	let authMode = "token";
	if (baseConfig.gateway?.auth?.mode === "token" || baseConfig.gateway?.auth?.mode === "password") authMode = baseConfig.gateway.auth.mode;
	else if (baseConfig.gateway?.auth?.token) authMode = "token";
	else if (baseConfig.gateway?.auth?.password) authMode = "password";
	const tailscaleRaw = baseConfig.gateway?.tailscale?.mode;
	const tailscaleMode = tailscaleRaw === "off" || tailscaleRaw === "serve" || tailscaleRaw === "funnel" ? tailscaleRaw : "off";
	const explicitAuthMode = overrides.gatewayAuth ?? (overrides.gatewayToken !== void 0 || overrides.gatewayTokenRefEnv !== void 0 ? "token" : overrides.gatewayPassword !== void 0 ? "password" : void 0);
	return {
		hasExisting,
		port: overrides.gatewayPort ?? resolveGatewayPort(baseConfig),
		bind: overrides.gatewayBind ?? bind,
		authMode: explicitAuthMode ?? authMode,
		tailscaleMode: overrides.tailscale ?? tailscaleMode,
		token: overrides.gatewayTokenRefEnv !== void 0 ? {
			source: "env",
			provider: resolveDefaultSecretProviderAlias(baseConfig, "env", { preferFirstProviderForSource: true }),
			id: overrides.gatewayTokenRefEnv.trim()
		} : overrides.gatewayToken ?? baseConfig.gateway?.auth?.token,
		password: overrides.gatewayPassword ?? baseConfig.gateway?.auth?.password,
		customBindHost: baseConfig.gateway?.customBindHost
	};
}
//#endregion
export { readValidSetupConfigFile as a, resolveQuickstartGatewayDefaults as c, readSetupConfigFileSnapshot as i, writeWizardConfigFile as l, formatQuickstartGatewaySummary as n, requestTelemetryConsent as o, hasQuickstartGatewayOverrides as r, requireRiskAcknowledgement as s, createWizardInferenceConfigTarget as t, getSecurityNoteTitle as u };
